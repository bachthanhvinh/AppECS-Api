import express from "express";
import { articleController } from "../../controllers/article.controllers";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import { validate } from "../../middlewares/validation.middleware";
import { articleValidation } from "../../validations/article.validation";

const router = express.Router();

router.route("/").get(articleController.getArticles);
router.route("/:articleId").get(articleController.getArticleId);

router.use(authMiddleware.authenticate);
router.use(adminMiddleware.authorizationAdmin);

router
  .route("/")
  .post(
    validate(articleValidation.createArticleSchema),
    articleController.createArticle,
  );
router
  .route("/:articleId")
  .put(
    validate(articleValidation.updateArticleSchema),
    articleController.updateArticle,
  )
  .delete(articleController.deleteArticle);


export const articlesRouter = router;
