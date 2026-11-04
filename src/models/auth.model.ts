import { pool } from "../providers/db";
import { DBUserRow, DBUserWithPasswordRow, User } from "../types/user";

const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<DBUserRow>(
    "SELECT id, email, role, created_at FROM users WHERE email = $1",
    [email],
  );

  return result.rows[0] ?? null;
};

const findUserByEmailWithPassword = async (
  email: string,
): Promise<DBUserWithPasswordRow | null> => {
  const result = await pool.query<DBUserWithPasswordRow>(
    `SELECT id, email, role, password_hash 
    FROM users 
    WHERE email = $1`,
    [email],
  );
  return result.rows[0] ?? null;
};

const CreateUser = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
  const result = await pool.query<DBUserRow>(
    `INSERT INTO users (username,email,password_hash)
     VALUES ($1,$2,$3)
     RETURNING id, username, email, role, is_active, created_at, updated_at `,
    [username, email, password],
  );
  return result.rows[0] as User;
};

const findUserForRefresh = async (userId: string) => {
  const result = await pool.query<{
    id: string;
    email: string;
    role: string;
    refresh_token_hash: string | null;
  }>(
    `SELECT id, email, role, refresh_token_hash
     FROM users
     WHERE id = $1 AND is_active = true`,
    [userId],
  );
  return result.rows[0] ?? null;
};

const setRefreshTokenHash = async (userId: string, hash: string) => {
  await pool.query(
    `UPDATE users SET refresh_token_hash = $1, updated_at = NOW() WHERE id = $2`,
    [hash, userId],
  );
};

const clearRefreshTokenHash = async (userId: string) => {
  await pool.query(
    `UPDATE users SET refresh_token_hash = NULL, updated_at = NOW() WHERE id = $1`,
    [userId],
  );
};

const clearRefreshTokenIfMatch = async (userId: string, hash: string) => {
  await pool.query(
    `UPDATE users SET refresh_token_hash = NULL, updated_at = NOW()
     WHERE id = $1 AND refresh_token_hash = $2`,
    [userId, hash],
  );
};

export const authModel = {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserForRefresh,
  setRefreshTokenHash,
  clearRefreshTokenHash,
  clearRefreshTokenIfMatch,
  CreateUser,
};
