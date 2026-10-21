import { QueryResultRow } from "pg";
import { pool } from "../providers/db";

export const findOneByField = async <T extends QueryResultRow>(
  DbTable: string,
  DbField: string,
  value: any,
): Promise<T | null> => {
  const query = `
        SELECT * FROM ${DbTable} WHERE ${DbField} = $1 LIMIT 1;
        `;
  const values = [value];

  const result = await pool.query<T>(query, values);

  return result.rows[0] ?? null;
};

export const findBySlug = async <T extends QueryResultRow>(
  table: string,
  slug: string,
) => findOneByField<T>(table, "slug", slug);

export const findById = async <T extends QueryResultRow>(
  table: string,
  id: string,
) => findOneByField<T>(table, "id", id);
