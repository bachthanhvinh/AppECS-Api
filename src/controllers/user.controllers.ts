import { NextFunction, Request, Response } from "express";
import { userServices } from "../services/user.service";
import { userModel } from "../models/user.model";
import ApiError from "../utils/apiError";
import { StatusCodes } from "http-status-codes";
import { env } from "../config/env";
import ms from "ms";

const registerNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    await userServices.registerNew(username, email, password);

    res.status(201).json({
      success: true,
      message: "registerUser success!",
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const result = await userServices.login(email, password);

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "none",
      maxAge: ms("1h"),
    });
     res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: "getUser Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const userController = {
  registerNew,
  login,
  getUsers,
};
