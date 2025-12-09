import pool from "../db";

export async function getSizes() {
  const {rows} = await pool.query("SELECT id, size_label FROM sizes WHERE active = true ORDER BY size_label");
  return rows;
}
