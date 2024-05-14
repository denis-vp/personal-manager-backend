import { RefreshToken } from "../model/refreshToken";
import pool from "../postgresDatabase";

const getRefreshToken = async (token: string) => {
  const result = await pool.query(
    'SELECT * FROM public."refreshTokens" WHERE token = $1',
    [token]
  );
  if (result.rowCount === 0) {
    throw new Error("Refresh token not found");
  }
  return result.rows[0];
};

const createRefreshToken = async (refreshToken: RefreshToken) => {
  const result = await pool.query(
    'INSERT INTO public."refreshTokens" (token, email, "firstName", "lastName") VALUES ($1, $2, $3, $4) RETURNING *',
    [
      refreshToken.token,
      refreshToken.email,
      refreshToken.firstName,
      refreshToken.lastName,
    ]
  );
  if (result.rowCount === 0) {
    throw new Error("Refresh token not added");
  }
};

const deleteRefreshToken = async (token: string) => {
  const result = await pool.query(
    'DELETE FROM public."refreshTokens" WHERE token = $1 RETURNING *',
    [token]
  );
  if (result.rowCount === 0) {
    throw new Error("Refresh token not found");
  }
};

export default {
  getRefreshToken,
  createRefreshToken,
  deleteRefreshToken,
};
