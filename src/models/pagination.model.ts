import { pool } from "../providers/db";
const ALLOWED_TABLES = ["users", "articles", "categories"];

const pagination = async (page: number, pageSize: number, table: string) => {
  if (!ALLOWED_TABLES.includes(table)) {
    throw new Error(
      `Bảng "${table}" không hợp lệ hoặc không được phép truy vấn.`,
    );
  }

  const safePage = Math.max(1, Math.floor(page));
  const safePageSize = Math.min(100, Math.max(1, Math.floor(pageSize)));
  const offset = (safePage - 1) * safePageSize;

  const query = `
    SELECT *, COUNT(*) OVER() AS total_count
    FROM ${table}
    ORDER BY updated_at DESC, id DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [safePageSize, offset]);

  const total = result.rows.length > 0 ? Number(result.rows[0].total_count) : 0;
  const items = result.rows.map(({ total_count, ...rest }) => rest);
  return {
    items,
    total,
  };
};

export const paginationModel = {
  pagination,
};
