import { type NextFunction, type Request, type Response } from "express";
import { logger } from "../providers/logger.js";
import ApiError from "../utils/apiError.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });

    return;
  }

  logger.error({ err }, "Unhandled error");

  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(env.isProduction ? {} : { error: err.message, stack: err.stack }),
  });
}
