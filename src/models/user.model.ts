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

export const userModel = {
  findUserByEmail,
  CreateUser,
  findUserByEmailWithPassword,
};
