import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import { categoryController } from "../../controllers/category.controllers";
import { validate } from "../../middlewares/validation.middleware";
import { categoryValidation } from "../../validations/category.validation";

const Router = express.Router();

Router.route("/").get(categoryController.getCategorys);
Router.route("/:categoryId").get(categoryController.getCategoryId);

Router.use(authMiddleware.authenticate);
Router.use(adminMiddleware.authorizationAdmin);

Router.route("/").post(
  validate(categoryValidation.createCategorySchema),
  categoryController.createCategory,
);

Router.route("/:categoryId")
  .put(
    validate(categoryValidation.updateCategorySchema),
    categoryController.updateCategory,
  )
  .delete(categoryController.deleteCategory);

export const categoriesRouter = Router;
