import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../types/user";
import { env } from "../config/env";
import ApiError from "../utils/apiError";

const signAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtAccessSecret, options);
};

const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
  } catch {
    throw new ApiError(401, "Invalid or expired access token");
  }
};

export const JwtProvider = {
  signAccessToken,
  verifyAccessToken,
};
