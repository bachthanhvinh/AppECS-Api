import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

const authorizationAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== "admin") {
    next(
      new ApiError(
        403,
        "Admin access required. You do not have admin access it seems",
      ),
    );
    return;
  }
  next();
};

export const adminMiddleware = {
  authorizationAdmin,
};
