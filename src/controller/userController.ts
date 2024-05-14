import userRepository from "../repository/userRepository";
import verificationCodeRepository from "../repository/verificationCodeRepository";
import refreshTokenRepository from "../repository/refreshTokenRepository";
import { Request, Response } from "express";
import { validateUser } from "../validators/userValidator";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { VerificationCode } from "../model/verificationCode";
import { validateVerificationCode } from "../validators/verificationCodeValidator";

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.getUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const user = await userRepository.getUserById(id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const users = await userRepository.getUsersByEmail(email);
    const user = users[0];
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  const token = req.query.token;

  let decodedToken: string | object;
  try {
    decodedToken = jwt.verify(token as string, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  if (typeof decodedToken !== "object") {
    res.status(400).json({ message: "Invalid token" });
    return;
  }

  const email = (decodedToken as JwtPayload).email;
  
  try {
    try {
      const user = await userRepository.getUserByEmail(email);
    } catch (error) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const verificationCode = await verificationCodeRepository.getVerificationCodeByEmail(email);
    if (!verificationCode) {
      res.status(404).json({ message: "Verification code not found" });
      return;
    }

    const isMatch = await bcrypt.compare(token as string, verificationCode.code);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid token" });
      return;
    }

    // TODO: Resend verification email if token expired
    // if (verificationCode.expirationDate < new Date()) {
    //   res.status(400).json({ message: "Token expired" });
    //   return;
    // }

    await userRepository.verifyUser(email);
    await verificationCodeRepository.deleteVerificationCode(email);
    res.status(201).json({ message: "User verified" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  try {
    // Validate user
    validateUser(user);
    // Check if an user with the same email already exists
    const users = await userRepository.getUsersByEmail(user.email);
    if (users.length > 0) {
      throw new Error("User already exists");
    }

    // Encrypt the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    // Create the user object
    user.password = hashedPassword;
    user.id = uuidv4();
    user.verified = false;
    await userRepository.createUser(user);

    // Send verification email
    const email = user.email;
    const emailDomain = email.split("@")[1];
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const code = jwt.sign({ email: email }, JWT_SECRET!);
    const verificationLink = `${CLIENT_URL}/verify?code=${code}`;

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      // TODO: Handle better than console.log
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Save the verification code in the database
    const availableDuration = 1000 * 60 * 60 * 48; // 48 hours
    const verificationCode: VerificationCode = {
      email: email,
      code: await bcrypt.hash(code, 10),
      expirationDate: new Date(Date.now() + availableDuration),
    };
    await verificationCodeRepository.createVerificationCode(verificationCode);

    res.status(201).json({ message: "User created" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const authenticateUser = async (req: Request, res: Response) => {
  const returnValue = {
    authenticate: false,
    user: null,
  };

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json(returnValue);
      return;
    }

    const payload = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    res.status(200).json({
      authenticate: true,
      user: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    });
  } catch (error) {
    res.status(401).json(returnValue);
  }
};

export const getAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;

    let payload: string | object;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET!) as JwtPayload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const decodedToken = jwt.verify(refreshToken, JWT_SECRET!, {
          ignoreExpiration: true,
        }) as JwtPayload;
        if (decodedToken && decodedToken.email) {
          await refreshTokenRepository.deleteRefreshToken(decodedToken.email);
        }
        res.status(401).json({ message: "Refresh token expired" });
        return;
      } else {
        throw error;
      }
    }

    if (typeof payload !== "object") {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const user = payload as JwtPayload;
    const hashedToken = await refreshTokenRepository.getRefreshToken(
      user.email
    );
    if (!hashedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const isMatch = await bcrypt.compare(refreshToken, hashedToken.token);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const accessToken = jwt.sign(
      { email: user.email, firstName: user.firstName, lastName: user.lastName },
      JWT_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({ accessToken: accessToken });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const email = req.body.email;

  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    await verificationCodeRepository.deleteVerificationCode(email);

    const emailDomain = email.split("@")[1];
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const code = jwt.sign({ email: email }, JWT_SECRET!);
    const verificationLink = `${CLIENT_URL}/verify?code=${code}`;

    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "Verify your email",
      text: `Click this link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      // TODO: Handle better than console.log
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Save the verification code in the database
    const availableDuration = 1000 * 60 * 60 * 0.5; // 30 minutes
    const verificationCode: VerificationCode = {
      email: email,
      code: await bcrypt.hash(code, 10),
      expirationDate: new Date(Date.now() + availableDuration),
    };
    await verificationCodeRepository.createVerificationCode(verificationCode);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password, code } = req.body;
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }
    delete user.password;

    if (!user.verified) {
      res.status(403).json({ message: "Email not verified" });
      return;
    }

    if (!code) {
      const emailDomain = email.split("@")[1];
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: EMAIL,
          pass: EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Login code",
        text: `Your login code is: ${code}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        // TODO: Handle better than console.log
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      try {
        await verificationCodeRepository.deleteVerificationCode(email);
      } catch (error) {
        // Do nothing
      }
      const availableDuration = 1000 * 60 * 5; // 5 minutes
      const verificationCode: VerificationCode = {
        email: email,
        code: await bcrypt.hash(code, 10),
        expirationDate: new Date(Date.now() + availableDuration),
      };
      await verificationCodeRepository.createVerificationCode(verificationCode);

      res.status(200).json({ message: "Verification code sent", secondFactorReq: true });
    } else {
      validateVerificationCode(code);

      const verificationCode = await verificationCodeRepository.getVerificationCodeByEmail(email);
      if (bcrypt.compareSync(code, verificationCode.code) === false) {
        res.status(401).json({ message: "Invalid verification code" });
        return;
      }
      // if (verificationCode.expirationDate < new Date()) {
      //   res.status(401).json({ message: "Verification code expired" });
      //   return;
      // }
      await verificationCodeRepository.deleteVerificationCode(email);

      const accessToken = jwt.sign(user, JWT_SECRET!, {
        expiresIn: "15s",
      });
      const refreshToken = jwt.sign(user, JWT_SECRET!, {
        expiresIn: "7d",
      });

      await refreshTokenRepository.createRefreshToken({
        token: await bcrypt.hash(refreshToken, 10),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
      res.status(201).json({ user, accessToken });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1] as string;
  try {
    const user = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    await refreshTokenRepository.deleteRefreshToken(user.email);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "User logged out" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default {
  getUsers,
  getUserById,
  getUserByEmail,
  verifyUser,
  createUser,
  authenticateUser,
  getAccessToken,
  sendVerificationEmail,
  loginUser,
  logoutUser,
};