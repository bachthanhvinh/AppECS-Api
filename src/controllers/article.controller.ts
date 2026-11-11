import { NextFunction, Request, Response } from "express";
import { articles, DBArticlesRow } from "../types/articles";
import { articleService } from "../services/article.service";
import ApiError from "../utils/apiError";

const createArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await articleService.createArticle(req.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: "create success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getArticles = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await articleService.getArticles();
    res.status(200).json({
      success: true,
      message: "Get Article success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const getArticleId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const articleId = req.params.articleId as string;
    const data = await articleService.getArticleId(articleId);
    res.status(200).json({
      success: true,
      message: "Get ArticleId  success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const articleId = req.params.articleId as string;

    const data = await articleService.updateArticle(articleId, req.body);

    res.status(200).json({
      success: true,
      message: "Update article success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
const deleteArticle = async (
  req: Request<{ articleId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { articleId } = req.params;
    const data = await articleService.deleteArticle(articleId);

    res.status(200).json({
      success: true,
      message: "delete success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const articleController = {
  createArticle,
  getArticles,
  getArticleId,
  updateArticle,
  deleteArticle,
};
