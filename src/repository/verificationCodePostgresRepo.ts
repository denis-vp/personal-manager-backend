import { VerificationCode } from "../model/verificationCode"
import pool from "../postgresDatabase";

export const getVerificationCodeByEmail = async (email: string) => {
    const result = await pool.query('SELECT email, code, "expirationDate" FROM public."verificationCodes" WHERE email = $1', [email]);
    if (result.rowCount === 0) {
        throw new Error("Verification code not found");
    }
    return result.rows[0];
};

export const createVerificationCode = async (verificationCode: VerificationCode) => {
    const result = await pool.query('INSERT INTO public."verificationCodes" (email, code, "expirationDate") VALUES ($1, $2, $3) RETURNING *', [verificationCode.email, verificationCode.code, verificationCode.expirationDate]);
    if (result.rowCount === 0) {
        throw new Error("Verification code not added");
    }
};

export const deleteVerificationCode = async (email: string) => {
    const result = await pool.query('DELETE FROM public."verificationCodes" WHERE email = $1 RETURNING *', [email]);
    if (result.rowCount === 0) {
        throw new Error("Verification code not found");
    }
};

export default { getVerificationCodeByEmail, createVerificationCode, deleteVerificationCode };