export type UserRole = "admin" | "user";

export type DBUserRow = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type DBUserWithPasswordRow = DBUserRow & {
  password_hash: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type TokenPayload = {
  userId: string;
  email: string;
  role: UserRole;
};
