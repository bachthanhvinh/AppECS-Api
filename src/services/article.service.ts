import { articleModel } from "../models/article.model";
import { DBArticlesRow } from "../types/articles";
import { DBCategoriesRow } from "../types/categories";
import ApiError from "../utils/apiError";
import { findById, findBySlug } from "../utils/dbhelper";
import { slugify } from "../utils/formatters";

export interface CreateArticleDTO {
  title: string;
  description: string;
  content: string;
  thumbnail_url?: string | null;
  category_id: string;
}

export interface UpdateArticleDTO {
  title?: string | null;
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

  const autoSlug = slugify(reqBody.title);

  const slugExists = await findBySlug<DBArticlesRow>("articles", autoSlug);
  if (slugExists) {
    throw new ApiError(
      409,
      "Tiêu đề bài viết này đã tạo ra slug bị trùng, vui lòng đổi tiêu đề khác",
    );
  }

  return await articleModel.createArticle({
    ...reqBody,
    author_id: userId,
    slug: autoSlug,
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

  let newSlug = article.slug;

  if (payload.title && payload.title !== article.title) {
    newSlug = slugify(payload.title);

    const existingSlug = await findBySlug<DBArticlesRow>("articles", newSlug);
    if (existingSlug && existingSlug.id !== articleId) {
      throw new ApiError(
        409,
        "Tiêu đề mới tạo ra slug đã tồn tại ở bài viết khác, vui lòng chọn tiêu đề khác",
      );
    }
  }

  const updatedArticle = await articleModel.updateArticle({
    ...payload,
    articleId,
    slug: newSlug,
  });

  if (!updatedArticle) throw new ApiError(400, "Update article failed");

  return updatedArticle;
};

const deleteArticle = async (articleId: string) => {
  const article = await findById<DBArticlesRow>("articles", articleId);
  if (!article) {
    throw new ApiError(404, "Bài viết không tồn tại");
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
