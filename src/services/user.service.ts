import { userModel } from "../models/user.model";
import { JwtProvider } from "../providers/Jwt.provider";
import ApiError from "../utils/apiError";
import bcrypt from "bcryptjs";

const registerNew = async (
  username: string,
  email: string,
  password: string,
): Promise<void> => {
  if (!email || !password || !username) {
    throw new ApiError(400, "Email and password and username are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 character");
  }

  const normalizeEmail = email.toLowerCase().trim();

  const existingUser = await userModel.findUserByEmail(normalizeEmail);

  if (existingUser) {
    throw new ApiError(409, "Email already present");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await userModel.CreateUser(username, normalizeEmail, passwordHash);
};

const login = async (
  email: string,
  password: string,
): Promise<{ accessToken: string }> => {
  if (!email || !password) {
    throw new ApiError(400, "email and password are require!");
  }
  const normalizeEmail = email.toLocaleLowerCase().trim();
  const user = await userModel.findUserByEmailWithPassword(normalizeEmail);

  if (!user?.password_hash) {
    throw new ApiError(400, "invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new ApiError(400, "password not correct");
  }

  const accessToken = JwtProvider.signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
};

export const userServices = {
  registerNew,
  login,
};
