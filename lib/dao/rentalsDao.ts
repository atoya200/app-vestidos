import  pool  from "../db";
import { Rental } from "../types";

export async function getAllOrders(): Promise<Rental[]> {
  const sql = `
    SELECT 
      o.id,
      o.article_id,
      a.size_id,
      a.style,
      a.image_url,
      a.price_for_day AS article_price,
      
      at.type_name,
      s.size_label,
      c.color_name,
      c.hex_value,


      TO_CHAR(o.start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(o.end_date, 'YYYY-MM-DD') AS end_date,

      o.number_days,
      o.price_for_day * o.number_days AS order_price,
      
      os.status_name,
      
      o.full_name,
      o.email,
      o.phone,
      
      u.username AS created_by,
      o.user_id,

      TO_CHAR(o.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
      TO_CHAR(o.canceled_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS canceled_at,
      cu.username AS canceled_by
    FROM orders o
    LEFT JOIN articles a ON a.id = o.article_id
    LEFT JOIN article_types at ON at.id = a.article_type_id
    LEFT JOIN sizes s ON s.id = a.size_id
    LEFT JOIN colors c ON c.id = a.color_id
    LEFT JOIN order_statuses os ON os.id = o.status_id
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN users cu ON cu.id = o.canceled_by_user_id
    ORDER BY o.id DESC;
  `;

  const { rows } = await pool.query(sql);
  
  return rows.map((row: any) => ({
    id: row.id.toString(),
    itemId: row.article_id,
    sizeId: row.size_id, 
    start: row.start_date,
    end: row.end_date,
    customer: {
      name: row.full_name,
      email: row.email,
      phone: row.phone,
    },
    createdAt: row.created_at,
    status: row.canceled_at ? "canceled" : "active",
  }));
}

export async function getOrdersByArticle(articleId: number, sizeId?: number) {
  const query = `
    SELECT 
      o.id::text,
      o.article_id AS "itemId",
      TO_CHAR(o.start_date, 'YYYY-MM-DD') AS start,
      TO_CHAR(o.end_date, 'YYYY-MM-DD') AS "end",
      o.full_name,
      o.email,
      o.phone,
      o.created_at::text AS "createdAt",
      o.canceled_at
    FROM orders o
    WHERE o.article_id = $1 
      AND o.canceled_at IS NULL
    ORDER BY o.start_date
  `;

  const { rows } = await pool.query(query, [articleId]);
  return rows;
}

export async function createOrder(data: {
  articleId: number;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  phone: string;
  fullName: string;
  email: string;
  numberDays: number;
}) {
  const sql = `
    INSERT INTO orders 
      (article_id, status_id, start_date, end_date, price_for_day, phone, full_name, email, number_days)
    VALUES ($1, 1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING 
      id::text, 
      TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at
  `;

  const { rows } = await pool.query(sql, [
    data.articleId,
    data.startDate,
    data.endDate,
    data.pricePerDay,
    data.phone,
    data.fullName,
    data.email,
    data.numberDays,
  ]);

  return rows[0];
}

export async function cancelOrder(id: string) {
  const sql = `UPDATE orders SET canceled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`;
  const { rows, rowCount } = await pool.query(sql, [id]);
  return rowCount && rowCount > 0 ? rows[0] : null;
}
