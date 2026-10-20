import { NextFunction, Request, Response } from "express";
import { categoryService } from "../services/category.service";
import ApiError from "../utils/apiError";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const category = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Create category successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;
    if (!categoryId) {
      next(new ApiError(404, "Category Empty"));
      return;
    }
    const data = await categoryService.updateCategory(categoryId, req.body);

    res.status(200).json({
      success: true,
      message: "update category success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const getCategorys = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await categoryService.getCategorys();

    res.status(200).json({
      success: true,
      message: "get category success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const getCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId as string;
    const data = await categoryService.getCategoryId(categoryId);

    res.status(200).json({
      success: true,
      message: "get data by id success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const deleteCategory = async (
  req: Request<{ categoryId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const data = await categoryService.deleteCategory(categoryId);

    res.status(200).json({
      success: true,
      message: "delete success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
export const categoryController = {
  createCategory,
  updateCategory,
  getCategorys,
  getCategoryId,
  deleteCategory,
};
