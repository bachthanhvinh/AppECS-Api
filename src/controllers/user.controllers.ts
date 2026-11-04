import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userServices } from "../services/user.service";

const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await userServices.getUsers();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "getUser Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getUsers,
};
