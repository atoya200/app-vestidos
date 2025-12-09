import  pool from "../db";

export async function getAllArticles() {
  const sql = `
    SELECT 
      a.id,
      a.style,
      a.description,
      a.image_url,
      a.price_for_day,
      a.stock,
      a.reserves,
      a.active,

      at.type_name,
      s.size_label,
      c.color_name,
      c.hex_value,

      a.created_at,
      a.modified_at,
      um.username AS modified_by
    FROM articles a
    LEFT JOIN article_types at ON at.id = a.article_type_id
    LEFT JOIN sizes s ON s.id = a.size_id
    LEFT JOIN colors c ON c.id = a.color_id
    LEFT JOIN users um ON um.id = a.user_modified_id
    WHERE a.deleted_at IS NULL
    ORDER BY a.id DESC;
  `;

  const { rows } = await pool.query(sql);
  return rows;
}
