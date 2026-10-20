import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod"; // Nhập ZodType thay vì ZodTypeAny
import ApiError from "../utils/apiError";

export const validate =
  (schema: ZodType) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues
          .map((issue) => issue.message)
          .join(", ");
        next(new ApiError(400, errorMessage));
      } else {
        next(error);
      }
    }
  };
