import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paginationService } from "../services/pagination.service";

const pagination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 8;
    const table = String(req.query.table);
    const { items, total } = await paginationService.pagination(
      page,
      pageSize,
      table,
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: "load page",
      items,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const paginationController = {
  pagination,
};
