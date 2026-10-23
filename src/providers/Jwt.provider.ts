import jwt, { SignOptions } from "jsonwebtoken";
import ApiError from "../utils/apiError";

const generateToken = (
  payload: object,
  secretSignature: string,
  tokenLife: string | number,
): string => {
  try {
    return jwt.sign(payload, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife as SignOptions["expiresIn"],
    });
  } catch (error) {
    throw new Error(`Error generating token: ${(error as Error).message}`);
  }
};

const verifyToken = <T>(token: string, secretSignature: string): T => {
  return jwt.verify(token, secretSignature) as T;
};

export const JwtProvider = {
  generateToken,
  verifyToken,
};
