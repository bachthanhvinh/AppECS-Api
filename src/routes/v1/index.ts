import { ecsTest } from "./ecsTest.routes";
import { categoriesRouter } from "./categories.routes";
import express from "express";
import { userRouter } from "./users.routes";
import { articlesRouter } from "./articles.routes";
import { authRouter } from "./auth.routes";
import { uploadRouter } from "./uploads.routes";

const router = express.Router();

router.use(ecsTest);

router.use("/users", userRouter);
router.use("/categories", categoriesRouter);
router.use("/articles", articlesRouter);
router.use("/auth", authRouter);
router.use("/upload", uploadRouter);
export const API_V1 = router;
