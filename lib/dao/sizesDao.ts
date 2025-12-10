import pool from "@/lib/db";


export async function getSizes() {
  const {rows} = await pool.query("SELECT id, size_label FROM sizes WHERE active = true ORDER BY size_label");
  return rows;
}


export async function getSizeIdByLabel(sizeLabel: string) {
  const sql = `SELECT id FROM sizes WHERE size_label = $1 AND active = TRUE LIMIT 1`;
  const { rows } = await pool.query(sql, [sizeLabel]);
  return rows[0]?.id || null;
}