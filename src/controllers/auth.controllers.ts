import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import { env } from "../config/env";
import { authServices } from "../services/auth.service";

const isProd = env.nodeEnv === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("none" as const) : ("lax" as const),
};

const REFRESH_COOKIE_PATH = "/v1/auth";

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: ms("1h"),
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: ms("14 days"),
    path: REFRESH_COOKIE_PATH,
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", {
    ...cookieOptions,
    path: REFRESH_COOKIE_PATH,
  });
};

const registerNew = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    await authServices.registerNew(username, email, password);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Register success" });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authServices.login(email, password);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login success",
      data: { user: result.user },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken } = await authServices.refreshTokens(
      req.cookies?.refreshToken,
    );

    setAuthCookies(res, accessToken, refreshToken);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Refresh success" });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authServices.logout(req.cookies?.refreshToken);
    clearAuthCookies(res);

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Logout success" });
  } catch (error) {
    next(error);
  }
};

const me = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(StatusCodes.OK).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  registerNew,
  login,
  refresh,
  logout,
  me,
};
