import pool  from "../db";

export async function getColors() {
  const {rows} = await pool.query("SELECT id, color_name FROM colors WHERE active = true ORDER BY color_name");
  return rows;
}
