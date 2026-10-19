import express from "express";
import { userController } from "../../controllers/user.controllers";

export const Router = express.Router();

Router.route("/register").post(userController.registerNew);

Router.route("/login").get(userController.login);

export const userRouter = Router;
