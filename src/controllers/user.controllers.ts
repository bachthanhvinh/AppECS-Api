import { NextFunction, Request, Response } from "express";
import { userServices } from "../services/user.service";
import { userModel } from "../models/user.model";
import ApiError from "../utils/apiError";

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
    const { accessToken } = await userServices.login(email, password);
    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  registerNew,
  login,
};
