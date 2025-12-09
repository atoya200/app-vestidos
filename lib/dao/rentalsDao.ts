import pool from "../db";

export async function getAllOrders() {
  const sql = `
    SELECT 
      o.id,
      o.article_id,
      a.style,
      a.image_url,
      a.price_for_day AS article_price,
      
      at.type_name,
      s.size_label,
      c.color_name,
      c.hex_value,


      TO_CHAR(o.start_date, 'DD-MM-YYYY') AS start_date,
      TO_CHAR(o.end_date, 'DD-MM-YYYY') AS end_date,

      o.number_days,
      o.price_for_day * o.number_days AS order_price,
      
      os.status_name,
      
      o.full_name,
      o.email,
      o.phone,
      
      u.username AS created_by,
      o.user_id,

      TO_CHAR(o.created_at, 'DD-MM-YYYY') AS created_at,
      TO_CHAR(o.canceled_at, 'DD-MM-YYYY') AS canceled_at,
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
  return rows; 
}
