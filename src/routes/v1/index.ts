import { ecsTest } from "./ecsTest.routes";
import { categoriesRouter } from "./categories.routes";
import express from "express";
import { userRouter } from "./users.routes";
import { articlesRouter } from "./articles.routes";

const Router = express.Router();

Router.use(ecsTest);

Router.use("/users", userRouter);
Router.use("/categories", categoriesRouter);
Router.use("/articles", articlesRouter);

export const API_V1 = Router;
