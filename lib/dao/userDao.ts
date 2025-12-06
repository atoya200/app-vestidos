import { pool } from "../db";

export interface User {
  id: number;
  username: string;
  password_hash: string;
  // otros campos que tengas en la tabla
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const sql = "SELECT * FROM users WHERE username = $1 LIMIT 1";
  const { rows } = await pool.query(sql, [username]);
  return rows[0] || null;
}
