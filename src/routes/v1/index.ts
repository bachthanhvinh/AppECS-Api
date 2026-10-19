import { ecsTest } from "./ecsTest.routes";
import { adminCategoriesRouter } from "./admin.categories.routes";
import express from "express";
import { userRouter } from "./users.routes";

const Router = express.Router();

Router.use(ecsTest);

Router.use("/users", userRouter);
Router.use("/admin", adminCategoriesRouter);

export const API_V1 = Router;
