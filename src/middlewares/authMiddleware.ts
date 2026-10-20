import { NextFunction, Request, Response } from "express";
import { JwtProvider } from "../providers/Jwt.provider";
import ApiError from "../utils/apiError";

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Access token is required"));
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    next(new ApiError(401, "invalid access token format"));
    return;
  }
  req.user = JwtProvider.verifyAccessToken(token);
  next();
};
export const authMiddleware = {
  authenticate,
};
