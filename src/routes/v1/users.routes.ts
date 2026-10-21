import express from "express";
import { userController } from "../../controllers/user.controllers";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";

export const Router = express.Router();

Router.route("/register").post(userController.registerNew);

Router.route("/login").post(userController.login);

Router.use(authMiddleware.authenticate);
Router.use(adminMiddleware.authorizationAdmin);

Router.route("/").get(userController.getUsers);

export const userRouter = Router;
