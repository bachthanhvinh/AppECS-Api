import { pool } from "../providers/db";
import { DBArticlesRow } from "../types/articles";

export interface CreateArticleParams {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url?: string | null;
  category_id: string;
  author_id: string;
}
export interface UpdateArticleParams {
  articleId: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  category_id?: string | null;
  is_published?: boolean | null;
}
const UPDATABLE_COLUMNS = [
  "title",
  "slug",
  "description",
  "content",
  "thumbnail_url",
  "category_id",
  "is_published",
] as const;

const createArticle = async (
  params: CreateArticleParams,
): Promise<DBArticlesRow | null> => {
  const query = `
    INSERT INTO articles (title, slug, description, content, category_id, author_id, thumbnail_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    params.title,
    params.slug,
    params.description,
    params.content,
    params.category_id,
    params.author_id,
    params.thumbnail_url ?? null,
  ];
  const result = await pool.query<DBArticlesRow>(query, values);
  return result.rows[0] ?? null;
};

const getArticles = async (): Promise<DBArticlesRow[]> => {
  const query = `
  SELECT 
    a.*, 
    c.name AS category_name 
  FROM articles a
  LEFT JOIN categories c ON a.category_id = c.id
  ORDER BY a.updated_at DESC;`;
  const result = await pool.query<DBArticlesRow>(query);
  return result.rows;
};


const updateArticle = async (
  params: UpdateArticleParams,
): Promise<DBArticlesRow | null> => {
  const updateFields = UPDATABLE_COLUMNS.filter(
    (col) => params[col] !== undefined,
  ).map((col) => [col, params[col]] as const);

  if (updateFields.length === 0) return null;

  const setString = updateFields
    .map(([key], index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = updateFields.map(([, val]) => val);

  const query = `
    UPDATE articles
    SET ${setString}, updated_at = NOW()
    WHERE id = $${values.length + 1}
    RETURNING *;
  `;

  const result = await pool.query<DBArticlesRow>(query, [
    ...values,
    params.articleId,
  ]);
  return result.rows[0] ?? null;
};

const deleteArticle = async (articleDelete: string) => {
  const query = `
  DELETE FROM articles
  WHERE id = $1
  RETURNING *;
  `;
  const result = await pool.query<DBArticlesRow>(query, [articleDelete]);

  return result.rows[0];
};
export const articleModel = {
  createArticle,
  getArticles,
  updateArticle,
  deleteArticle,
};
