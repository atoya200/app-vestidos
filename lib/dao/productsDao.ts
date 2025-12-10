import pool from "@/lib/db";
import { Item, Category, ItemFilters } from "@/lib/types";

export async function getAllArticles(): Promise<Item[]> {
  const sql = `
    SELECT DISTINCT ON (a.style, a.color_id)
      a.id,
      a.style AS name,
      at.type_name AS category,
      a.price_for_day AS "pricePerDay",
      c.color_name AS color,
      a.style,
      a.description,
      a.image_url,
      a.color_id
    FROM articles a
    JOIN article_types at ON a.article_type_id = at.id
    JOIN colors c ON a.color_id = c.id
    WHERE a.active = TRUE
    ORDER BY a.style, a.color_id, a.id ASC
  `;

  const { rows } = await pool.query(sql);

  return Promise.all(rows.map(async (row: any) => {
    const sizes = await getAvailableSizesForArticle(row.id);
    return {
      id: row.id,
      name: row.name,
      category: row.category as Category,
      pricePerDay: parseFloat(row.pricePerDay),
      sizes,
      color: row.color,
      colorId: row.color_id,
      style: row.style,
      description: row.description || "",
      images: row.image_url ? [row.image_url] : [`/images/dresses/${row.id}.jpeg`],
      alt: `${row.name} - ${row.color}`,
    };
  }));
}

export async function getArticleById(id: number): Promise<Item | null> {
  const sql = `
    SELECT 
      a.id,
      a.style AS name,
      at.type_name AS category,
      a.price_for_day AS "pricePerDay",
      c.color_name AS color,
      a.style,
      a.description,
      a.image_url,
      a.color_id,
      a.stock
    FROM articles a
    JOIN article_types at ON a.article_type_id = at.id
    JOIN colors c ON a.color_id = c.id
    WHERE a.id = $1
  `;

  const { rows } = await pool.query(sql, [id]);
  if (rows.length === 0) return null;

  const row = rows[0];
  const sizes = await getAvailableSizesForArticle(id);

  return {
    id: row.id,
    name: row.name,
    category: row.category as Category,
    pricePerDay: parseFloat(row.pricePerDay),
    sizes,
    color: row.color,
    colorId: row.color_id,
    style: row.style,
    description: row.description || "",
    images: row.image_url ? [row.image_url] : [`/images/dresses/${row.id}.jpeg`],
    alt: `${row.name} - ${row.color}`,
    stock: row.stock,
  };
}

export async function getArticlesByFilters(filters: ItemFilters): Promise<Item[]> {
  let query = `
    SELECT DISTINCT ON (a.style, a.color_id)
      a.id,
      a.style AS name,
      at.type_name AS category,
      a.price_for_day AS "pricePerDay",
      c.color_name AS color,
      a.style,
      a.description,
      a.image_url,
      a.color_id
    FROM articles a
    JOIN article_types at ON a.article_type_id = at.id
    JOIN colors c ON a.color_id = c.id
    WHERE a.active = TRUE
  `;

  const params: any[] = [];
  let paramIndex = 1;

  if (filters.category) {
    query += ` AND at.type_name = $${paramIndex}`;
    params.push(filters.category);
    paramIndex++;
  }

  if (filters.color) {
    query += ` AND LOWER(c.color_name) = LOWER($${paramIndex})`;
    params.push(filters.color);
    paramIndex++;
  }

  if (filters.style) {
    query += ` AND LOWER(a.style) LIKE LOWER($${paramIndex})`;
    params.push(`%${filters.style}%`);
    paramIndex++;
  }

  if (filters.q) {
    query += ` AND (
      LOWER(a.style) LIKE LOWER($${paramIndex}) OR
      LOWER(c.color_name) LIKE LOWER($${paramIndex}) OR
      LOWER(a.description) LIKE LOWER($${paramIndex})
    )`;
    params.push(`%${filters.q}%`);
    paramIndex++;
  }

  query += ` ORDER BY a.style, a.color_id, a.id`;

  const { rows } = await pool.query(query, params);

  const items = await Promise.all(rows.map(async (row: any) => {
    const sizes = await getAvailableSizesForArticle(row.id);
    return {
      id: row.id,
      name: row.name,
      category: row.category as Category,
      pricePerDay: parseFloat(row.pricePerDay),
      sizes,
      color: row.color,
      colorId: row.color_id,
      style: row.style,
      description: row.description || "",
      images: row.image_url ? [row.image_url] : [`/images/dresses/${row.id}.jpeg`],
      alt: `${row.name} - ${row.color}`,
    };
  }));

  if (filters.size) {
    return items.filter((item) => item.sizes.includes(filters.size!));
  }

  return items;
}

export async function getAvailableSizesForArticle(itemId: number) {
  const itemResult = await pool.query(
    `SELECT style, color_id FROM articles WHERE id = $1`,
    [itemId]
  );

  if (itemResult.rows.length === 0) return [];

  const { style, color_id } = itemResult.rows[0];

  const result = await pool.query(
    `
    SELECT DISTINCT s.size_label, s.id
    FROM articles a
    JOIN sizes s ON a.size_id = s.id
    WHERE a.style = $1 
      AND a.color_id = $2
      AND a.active = TRUE 
      AND a.stock > 0 
      AND s.active = TRUE
    ORDER BY s.id
    `,
    [style, color_id]
  );

  return result.rows.map((row: any) => row.size_label as string);
}

export async function getArticleByStyleColorSize(style: string, colorId: number, sizeId: number) {
  const sql = `
    SELECT id, stock FROM articles 
    WHERE style = $1 
      AND color_id = $2 
      AND size_id = $3 
      AND active = TRUE 
      AND stock > 0
    LIMIT 1
  `;

  const { rows } = await pool.query(sql, [style, colorId, sizeId]);
  return rows[0] || null;
}


export async function getProductsForDashboard() {
  const sql = `
    SELECT
      a.id, 
      a.article_type_id, 
      t.type_name, 
      a.size_id, 
      s.size_label, 
      a.color_id, 
      c.color_name,
      a."style", 
      a.price_for_day, 
      a.stock, 
      a.image_url, 
      a.description,
      TO_CHAR(a.created_at, 'YYYY-MM-DD HH24') AS created_at,
      TO_CHAR(a.modified_at , 'YYYY-MM-DD HH24:MI') AS modified_at,
      TO_CHAR(a.deleted_at , 'YYYY-MM-DD HH24') AS deleted_at,
      a.user_modified_id,
      a.user_delete_id,
      a.active,
      COUNT(o.id) AS cantidad_reservas
    FROM articles a 
      JOIN article_types t ON a.article_type_id = t.id 
      JOIN sizes s ON s.id = a.size_id 
      JOIN colors c ON c.id = a.color_id 
      LEFT JOIN orders o ON o.article_id = a.id AND start_date > NOW() AND status_id = 1
    GROUP BY
      a.id, a.article_type_id, t.type_name, a.size_id, s.size_label, a.color_id, c.color_name,
      a."style", a.price_for_day, a.stock, a.image_url, a.description, a.created_at,
      modified_at, a.deleted_at, a.user_modified_id, a.user_delete_id, a.active;
  `;

  const { rows } = await pool.query(sql);

  return rows.map((row: any) => ({
    id: row.id,
    article_type_id: row.article_type_id,
    type_name: row.type_name,
    size_id: row.size_id,
    size_label: row.size_label,
    color_id: row.color_id,
    color_name: row.color_name,
    style: row.style,
    price_for_day: row.price_for_day,
    stock: row.stock,
    image_url: row.image_url,
    description: row.description,
    created_at: row.created_at,
    modified_at: row.modified_at,
    deleted_at: row.deleted_at,
    user_modified_id: row.user_modified_id,
    user_delete_id: row.user_delete_id,
    active: row.active,
    cantidad_reservas: row.cantidad_reservas
  }));
}



