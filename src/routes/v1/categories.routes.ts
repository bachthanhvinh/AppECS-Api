import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adminMiddleware } from "../../middlewares/adminMiddleware";
import { categoryController } from "../../controllers/category.controller";
import { validate } from "../../middlewares/validation.middleware";
import { categoryValidation } from "../../validations/category.validation";
import { paginationController } from "../../controllers/pagination.controller";

const router = express.Router();

router.route("/").get(categoryController.getCategorys);
router.route("/pagination").get(paginationController.pagination);

router.route("/:categoryId").get(categoryController.getCategoryId);

router.use(authMiddleware.authenticate);
router.use(adminMiddleware.authorizationAdmin);

router
  .route("/")
  .post(
    validate(categoryValidation.createCategorySchema),
    categoryController.createCategory,
  );

router
  .route("/:categoryId")
  .put(
    validate(categoryValidation.updateCategorySchema),
    categoryController.updateCategory,
  )
  .delete(categoryController.deleteCategory);

export const categoriesRouter = router;
