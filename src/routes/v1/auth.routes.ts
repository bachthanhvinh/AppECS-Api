import express from "express";
import { authController } from "../../controllers/auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const router = express.Router();

router.route("/register").post(authController.registerNew);

router.route("/login").post(authController.login);

router.route("/refresh").post(authController.refresh);

router.route("/logout").post(authController.logout);

router.use(authMiddleware.authenticate);

router.route("/me").get(authController.me);
export const authRouter = router;
