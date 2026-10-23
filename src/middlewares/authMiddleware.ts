import { NextFunction, Request, Response } from "express";
import { JwtProvider } from "../providers/Jwt.provider";
import ApiError from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import { TokenPayload } from "../types/user";

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  const clientAccessToken = req.cookies.accessToken;

  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized! (token not found)"),
    );
    return;
  }
  try {
    const accessTokenDecoded = JwtProvider.verifyToken<TokenPayload>(
      clientAccessToken,
      env.jwtAccessSecret,
    );

    req.user = accessTokenDecoded;

    next();
  } catch (error) {
    if (error instanceof Error && error?.message?.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token."));
      return;
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
  }
};
export const authMiddleware = {
  authenticate,
};
