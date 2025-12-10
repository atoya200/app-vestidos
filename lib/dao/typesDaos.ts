import pool from "@/lib/db";

export async function getTypes() {
  const {rows} = await pool.query("SELECT id, type_name FROM article_types ORDER BY type_name");
  return rows;
}
