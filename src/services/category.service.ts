import { categoryModel } from "../models/category.model";
import { DBCategoriesRow } from "../types/categories";
import ApiError from "../utils/apiError";
import { findById, findBySlug } from "../utils/dbhelper";

interface createCategoryDTO {
  name: string;
  slug: string;
  description?: string;
}
interface updateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
}

const createCategory = async (
  payload: createCategoryDTO,
): Promise<DBCategoriesRow> => {
  const { name, slug, description } = payload;

  const existingCategory = await findBySlug<DBCategoriesRow>(
    "categories",
    slug,
  );
  if (existingCategory) {
    throw new ApiError(409, "Category slug already exists");
  }

  return await categoryModel.createCategory({
    name,
    slug,
    description: description || null,
  });
};

const updateCategory = async (
  categoryId: string,
  payload: updateCategoryDTO,
): Promise<DBCategoriesRow | null> => {
  const category = await findById<DBCategoriesRow>("categories", categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (payload.slug && payload.slug !== category.slug) {
    const existingSlug = await findBySlug<DBCategoriesRow>(
      "categories",
      payload.slug,
    );
    if (existingSlug) {
      throw new ApiError(409, "Category slug already exists");
    }
  }

  const updatedCategory = await categoryModel.updateCategory({
    categoryId,
    name: payload.name,
    slug: payload.slug,
    description: payload.description,
  });
  if (!updatedCategory) {
    throw new ApiError(400, "Update category failed");
  }

  return updatedCategory;
};

const getCategorys = async () => {
  return await categoryModel.getCategorys();
};

const getCategoryId = async (categoryId: string) => {
  return await findById<DBCategoriesRow>("categories", categoryId);
};

const deleteCategory = async (categoryId: string) => {
  const category = await findById<DBCategoriesRow>("categories", categoryId);
  const checkCategoryDelete = categoryId === category?.id;
  if (!checkCategoryDelete) {
    throw new ApiError(400, "not found");
  }
  return await categoryModel.deleteCategory(categoryId);
};
export const categoryService = {
  createCategory,
  updateCategory,
  getCategorys,
  getCategoryId,
  deleteCategory,
};
