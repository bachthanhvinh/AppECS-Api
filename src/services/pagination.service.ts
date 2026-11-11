import { paginationModel } from "../models/pagination.model";

const pagination = async (page: number, pageSize: number, table: string) => {
  return await paginationModel.pagination(page, pageSize, table);
};
export const paginationService = {
  pagination,
};
