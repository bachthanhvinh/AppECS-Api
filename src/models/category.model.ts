import { pool } from "../providers/db";
import { DBCategoriesRow } from "../types/categories";
import { findOneByField } from "../utils/dbhelper";

interface CreateCategoryParams {
  name: string;
  slug: string;
  description: string | null;
}
interface UpdateCategoryParams {
  categoryId: string;
  name?: string;
  slug?: string;
  description?: string;
}

// const findBySlug = async (slug: string) =>
//   findOneByField<DBCategoriesRow>("categories", "id", slug);

// const findById = async (categoryId: string) =>
//   findOneByField<DBCategoriesRow>("categories", "id", categoryId);

const createCategory = async ({
  name,
  slug,
  description,
}: CreateCategoryParams): Promise<DBCategoriesRow> => {
  const query = `
    INSERT INTO categories (name, slug, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query<DBCategoriesRow>(query, [
    name,
    slug,
    description,
  ]);
  return result.rows[0] as DBCategoriesRow;
};

const updateCategory = async ({
  categoryId,
  name,
  slug,
  description,
}: UpdateCategoryParams): Promise<DBCategoriesRow | null> => {
  const query = `
   UPDATE categories
   SET
   name = COALESCE($1, name),
   slug = COALESCE($2, slug),
   description = COALESCE($3, description),
   updated_at = NOW()
   WHERE id = $4
   RETURNING *;
   `;
  const result = await pool.query<DBCategoriesRow>(query, [
    name ?? null,
    slug ?? null,
    description ?? null,
    categoryId,
  ]);

  return result.rows[0] ?? null;
};

const getCategorys = async (): Promise<DBCategoriesRow[]> => {
  const query = `
  SELECT * 
  FROM categories
  ORDER BY updated_at DESC;
  `;
  const result = await pool.query<DBCategoriesRow>(query);
  return result.rows;
};

const deleteCategory = async (categoryDelete: string) => {
  const query = `
  DELETE FROM categories
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query<DBCategoriesRow>(query, [categoryDelete]);

  return result.rows[0];
};
export const categoryModel = {
  createCategory,
  updateCategory,
  getCategorys,
  deleteCategory,
};
