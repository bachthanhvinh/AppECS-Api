import express from "express";
import { articleController } from "../../controllers/article.controllers";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import { validate } from "../../middlewares/validation.middleware";
import { articleValidation } from "../../validations/article.validation";

const Router = express.Router();

Router.route("/").get(articleController.getArticles);
Router.route("/:articleId").get(articleController.getArticleId);

Router.use(authMiddleware.authenticate);
Router.use(adminMiddleware.authorizationAdmin);

Router.route("/").post(
  validate(articleValidation.createArticleSchema),
  articleController.createArticle,
);
Router.route("/:articleId")
  .put(
    validate(articleValidation.updateArticleSchema),
    articleController.updateArticle,
  )
  .delete(articleController.deleteArticle);

export const articlesRouter = Router;
