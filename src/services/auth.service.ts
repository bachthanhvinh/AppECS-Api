import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { authModel } from "../models/auth.model";
import { JwtProvider } from "../providers/Jwt.provider";
import ApiError from "../utils/apiError";

type TokenPayload = {
  userId: string;
  email: string;
  role: string;
  jti?: string;
};

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

const issueTokens = async (user: {
  id: string;
  email: string;
  role: string;
}) => {
  const payload = { userId: user.id, email: user.email, role: user.role };

  const accessToken = JwtProvider.generateToken(
    payload,
    env.jwtAccessSecret,
    env.jwtAccessExpiresIn,
  );

  const refreshToken = JwtProvider.generateToken(
    { ...payload, jti: crypto.randomUUID() },
    env.jwtRefreshSecret,
    env.jwtRefreshExpiresIn,
  );

  await authModel.setRefreshTokenHash(user.id, hashToken(refreshToken));

  return { accessToken, refreshToken };
};

const registerNew = async (
  username: string,
  email: string,
  password: string,
) => {
  if (!username || !email || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Username, email and password are required",
    );
  }
  if (password.length < 6) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Password must be at least 6 characters",
    );
  }

  const normalizeEmail = email.toLowerCase().trim();
  const existingUser = await authModel.findUserByEmail(normalizeEmail);
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, "Email already present");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await authModel.CreateUser(username, normalizeEmail, passwordHash);
};

const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Email and password are required",
    );
  }

  const normalizeEmail = email.toLowerCase().trim();
  const user = await authModel.findUserByEmailWithPassword(normalizeEmail);
  if (!user?.password_hash) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const tokens = await issueTokens(user);

  return {
    ...tokens,
    user: { id: user.id, email: user.email, role: user.role },
  };
};

const refreshTokens = async (refreshToken?: string) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is missing");
  }

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as TokenPayload;
  } catch {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Refresh token is invalid or expired",
    );
  }

  const user = await authModel.findUserForRefresh(decoded.userId);
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found or inactive");
  }

  if (user.refresh_token_hash !== hashToken(refreshToken)) {
    await authModel.clearRefreshTokenHash(user.id);
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Session revoked, please login again",
    );
  }

  return issueTokens(user);
};

const logout = async (refreshToken?: string) => {
  if (!refreshToken) return;

  try {
    const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret, {
      ignoreExpiration: true,
    }) as TokenPayload;

    await authModel.clearRefreshTokenIfMatch(
      decoded.userId,
      hashToken(refreshToken),
    );
  } catch (error) {
    console.warn("Logout với token không hợp lệ hoặc đã hết hạn:", error);
  }
};

export const authServices = {
  registerNew,
  login,
  refreshTokens,
  logout,
};
