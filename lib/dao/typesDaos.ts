import { pool } from "../db";

export async function getTypes() {
  const {rows} = await pool.query("SELECT id, type_name FROM article_types ORDER BY type_name");
  return rows;
}
