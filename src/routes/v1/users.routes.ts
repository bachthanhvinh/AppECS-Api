import express from "express";
import { userController } from "../../controllers/user.controllers";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";

export const router = express.Router();

router.use(authMiddleware.authenticate, adminMiddleware.authorizationAdmin);

router.route("/").get(userController.getUsers);

export const userRouter = router;
