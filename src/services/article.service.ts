import { articleModel } from "../models/article.model";
import { DBArticlesRow } from "../types/articles";
import { DBCategoriesRow } from "../types/categories";
import ApiError from "../utils/apiError";
import { findById, findBySlug } from "../utils/dbhelper";

export interface CreateArticleDTO {
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail_url?: string | null;
  category_id: string;
}
export interface UpdateArticleDTO {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  content?: string | null;
  thumbnail_url?: string | null;
  is_published?: boolean | null;
}

const createArticle = async (
  userId: string,
  reqBody: CreateArticleDTO,
): Promise<DBArticlesRow | null> => {
  const categoryExists = await findById<DBCategoriesRow>(
    "categories",
    reqBody.category_id,
  );
  if (!categoryExists) throw new ApiError(404, "Category không tồn tại");

  const slugExists = await findBySlug<DBArticlesRow>("articles", reqBody.slug);
  if (slugExists)
    throw new ApiError(409, "Slug bài viết đã tồn tại, vui lòng đổi slug khác");

  return await articleModel.createArticle({
    ...reqBody,
    author_id: userId,
  });
};

const getArticles = async () => {
  return await articleModel.getArticles();
};

const getArticleId = async (articleId: string) => {
  const article = await findById<DBArticlesRow>("articles", articleId);
  if (!article) throw new ApiError(404, "Article not found");
  return article;
};

const updateArticle = async (
  articleId: string,
  payload: UpdateArticleDTO,
): Promise<DBArticlesRow> => {
  const article = await findById<DBArticlesRow>("articles", articleId);
  if (!article) throw new ApiError(404, "Article not found");

  if (payload.slug && payload.slug !== article.slug) {
    const existingSlug = await findBySlug<DBArticlesRow>(
      "articles",
      payload.slug,
    );
    if (existingSlug) throw new ApiError(409, "Slug bài viết đã tồn tại");
  }

  const updatedArticle = await articleModel.updateArticle({
    articleId,
    ...payload,
  });
  if (!updatedArticle) throw new ApiError(400, "Update article failed");

  return updatedArticle;
};

const deleteArticle = async (articleId: string) => {
  const findArticleId = await findById<DBArticlesRow>("articles", articleId);
  const checkCategoryDelete = articleId === findArticleId?.id;
  if (!checkCategoryDelete) {
    throw new ApiError(400, "not found");
  }
  return await articleModel.deleteArticle(articleId);
};
export const articleService = {
  createArticle,
  getArticles,
  getArticleId,
  updateArticle,
  deleteArticle,
};
