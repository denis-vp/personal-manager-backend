import { User } from "../model/user";
import pool from "../postgresDatabase";

export const getUsers = async () => {
  const result = await pool.query(
    'SELECT "firstName", "lastName", email, verified FROM public."users"'
  );
  return result.rows;
};

export const getUserById = async (id: string) => {
  const result = await pool.query(
    'SELECT "firstName", "lastName", email, verified FROM public."users" WHERE id = $1',
    [id]
  );
  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
  return result.rows[0];
};

export const getUsersByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT "firstName", "lastName", email, verified FROM public."users" WHERE email = $1',
    [email]
  );
  return result.rows;
};

export const getUserByEmail = async (email: string) => {
  const result = await pool.query(
    'SELECT id, "firstName", "lastName", email, password, verified FROM public."users" WHERE email = $1',
    [email]
  );
  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
  return result.rows[0];
};

export const verifyUser = async (email: string) => {
  const result = await pool.query(
    'UPDATE public."users" SET verified = true WHERE email = $1 RETURNING *',
    [email]
  );
  if (result.rowCount === 0) {
    throw new Error("User not found");
  }
  return result.rows[0];
};

export const createUser = async (user: User) => {
  const result = await pool.query(
    'INSERT INTO public."users" (id, "firstName", "lastName", email, password, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.password,
      user.verified,
    ]
  );
  if (result.rowCount === 0) {
    throw new Error("User not added");
  }
};

export default {
  getUsers,
  getUserById,
  getUsersByEmail,
  getUserByEmail,
  verifyUser,
  createUser,
};
