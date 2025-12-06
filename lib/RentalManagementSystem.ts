//import * as db from "./db";
//const pool = (db as any).default ?? db;

import { Console } from "console";
import pool from "./db";

export type Category = "dress" | "shoes" | "bag" | "jacket";

export interface Item {
  id: number;
  name: string;
  category: Category;
  pricePerDay: number;
  sizes: string[];
  color: string;
  style?: string;
  description: string;
  images: string[];
  alt: string;
}

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Rental {
  id: string;
  itemId: number;
  sizeId: number;
  start: string;
  end: string;
  customer: Customer;
  createdAt: string;
  status: "active" | "canceled";
}

export interface CreateRental {
  itemId: number;
  sizeId: number;
  start: string;
  end: string;
  customer: Customer;
}

export interface ItemFilters {
  q?: string;
  category?: Category;
  size?: string;
  color?: string;
  style?: string;
}

type ItemRow = {
  id: number;
  name: string;
  category: string;
  pricePerDay: string;
  color: string;
  style?: string;
  description?: string | null;
  image_url?: string | null;
};

type RentalRow = {
  id: string;
  itemId: number;
  sizeId: number;
  start: string;
  end: string;
  full_name: string;
  email: string;
  phone: string;
  createdAt: string;
  canceled_at: string | null;
};

export async function listItems(filters?: ItemFilters): Promise<Item[]> {
  try {
    // Group by style+color to get unique items (not by individual size)
    let query = `
      SELECT DISTINCT ON (a.style, a.color_id)
        MIN(a.id) as id,
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

    if (filters?.category) {
      query += ` AND at.type_name = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    if (filters?.color) {
      query += ` AND LOWER(c.color_name) = LOWER($${paramIndex})`;
      params.push(filters.color);
      paramIndex++;
    }

    if (filters?.style) {
      query += ` AND LOWER(a.style) LIKE LOWER($${paramIndex})`;
      params.push(`%${filters.style}%`);
      paramIndex++;
    }

    if (filters?.q) {
      query += ` AND (
        LOWER(a.style) LIKE LOWER($${paramIndex}) OR
        LOWER(c.color_name) LIKE LOWER($${paramIndex}) OR
        LOWER(a.description) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${filters.q}%`);
      paramIndex++;
    }

    query += ` GROUP BY a.style, a.color_id, at.type_name, a.price_for_day, c.color_name, a.description, a.image_url
               ORDER BY a.style, a.color_id`;

    const result = await pool.query(query, params);

    const items: Item[] = await Promise.all(
      result.rows.map(async (row:any) => {
        const sizes = await getAvailableSizes(row.id);

        return {
          id: row.id,
          name: row.name,
          category: row.category as Category,
          pricePerDay: parseFloat(row.pricePerDay),
          sizes,
          color: row.color,
          style: row.style,
          description: row.description ?? "",
          images: row.image_url
            ? [row.image_url]
            : [`/images/dresses/${row.id}.jpeg`],
          alt: `${row.name} - ${row.color}`,
        };
      })
    );

    if (filters?.size) {
      return items.filter((item) => item.sizes.includes(filters.size!));
    }

    return items;
  } catch (error) {
    console.error("Error listing items:", error);
    return [];
  }
}

export async function getItem(id: number): Promise<Item | null> {
  try {
    const result = await pool.query(
      `
      SELECT 
        a.id,
        a.style AS name,
        at.type_name AS category,
        a.price_for_day AS "pricePerDay",
        c.color_name AS color,
        a.style,
        a.description,
        a.image_url
      FROM articles a
      JOIN article_types at ON a.article_type_id = at.id
      JOIN colors c ON a.color_id = c.id
      WHERE a.id = $1 AND a.active = TRUE
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const sizes = await getAvailableSizes(id);

    return {
      id: row.id,
      name: row.name,
      category: row.category as Category,
      pricePerDay: parseFloat(row.pricePerDay),
      sizes,
      color: row.color,
      style: row.style,
      description: row.description ?? "",
      images: row.image_url
        ? [row.image_url]
        : [`/images/dresses/${row.id}.jpeg`],
      alt: `${row.name} - ${row.color}`,
    };
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
}

export async function getAvailableSizes(itemId: number): Promise<string[]> {
  try {
    // Get the style and color of the item
    const itemResult = await pool.query(
      `SELECT style, color_id FROM articles WHERE id = $1`,
      [itemId]
    );
    
    if (itemResult.rows.length === 0) return [];
    
    const { style, color_id } = itemResult.rows[0];

    
    // Find all sizes available for this style+color combination
    const {rows} = await pool.query(
      `
      select  distinct  s.size_label 
      FROM articles a
      JOIN sizes s ON a.size_id = s.id
      WHERE a.style = $1
        AND a.color_id = $2
        AND a.active = true 
        AND a.stock > 0 
        AND s.active = true
      ORDER BY s.size_label
      `,
      [style, color_id]
    );

    return rows.map((row:any) => row.size_label as string);
  } catch (error) {
    console.error("Error fetching available sizes:", error);
    return [];
  }
}

export async function getItemRentals(
  itemId: number,
  sizeId?: number
): Promise<Rental[]> {
  try {
    let query = `
       SELECT
        o.id::text,
        article_id AS "itemId",
        a.size_id  AS "sizeId",
        TO_CHAR(start_date, 'YYYY-MM-DD') AS start,
        TO_CHAR(end_date, 'YYYY-MM-DD') AS "end",
        full_name,
        email,
        phone,
        o.created_at::text AS "createdAt",
        canceled_at
      FROM orders o
      join articles a on a.id = o.article_id 
      WHERE article_id = $1 AND o.canceled_at IS NULL
    `;

    const params: any[] = [itemId];

    if (sizeId !== undefined) {
      query += ` AND size_id = $2`;
      params.push(sizeId);
    }

    query += ` ORDER BY start_date`;

    console.log("Executing query:", query, "with params:", params);
    const {rows} = await pool.query(query, params);

    return rows.map((row:any) => ({
      id: row.id,
      itemId: row.itemId,
      sizeId: row.sizeId,
      start: row.start,
      end: row.end,
      customer: {
        name: row.full_name,
        email: row.email,
        phone: row.phone,
      },
      createdAt: row.createdAt,
      status: "active",
    }));
  } catch (error) {
    console.error("Error fetching rentals:", error);
    return [];
  }
}

export function hasOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
): boolean {
  return !(aEnd < bStart || bEnd < aStart);
}

export async function isItemAvailable(
  itemId: number,
  sizeId: number,
  start: string,
  end: string
): Promise<boolean> {
  const rentals = await getItemRentals(itemId, sizeId);
  return rentals.every((r) => !hasOverlap(start, end, r.start, r.end));
}

export async function createRental(
  data: CreateRental
): Promise<{ rental?: Rental; error?: string }> {
  const ok = await isItemAvailable(data.itemId, data.sizeId, data.start, data.end);
  if (!ok) return { error: "Item not available for selected dates" as const };

  try {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const numberDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const item = await getItem(data.itemId);
    if (!item) return { error: "Item not found" as const };

    const sizeCheck = await pool.query(
      `
         select 1 from articles where id = $1 and size_id = $2 AND active = TRUE  AND stock > 0 
      `,
      [data.itemId, data.sizeId]
    );

    if (sizeCheck.rows.length === 0) {
      return { error: "This size is not available for this item" as const };
    }

    console.log([
        data.itemId,
        data.start,
        data.end,
        item.pricePerDay,
        data.customer.phone,
        data.customer.name,
        data.customer.email,
        numberDays,
      ])
      
    const result = await pool.query(
      `
      INSERT INTO orders 
        (article_id, status_id, start_date, end_date, price_for_day, phone, full_name, email, number_days)
      VALUES ($1, 1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING 
        id::text, 
        TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at
      `,
      [
        data.itemId,
        data.start,
        data.end,
        item.pricePerDay,
        data.customer.phone,
        data.customer.name,
        data.customer.email,
        numberDays,
      ]
    );

    if (!result.rows[0]) {
      throw new Error("No se pudo crear el registro");
    }

    const rental: Rental = {
      id: result.rows[0].id,
      itemId: data.itemId,
      sizeId: data.sizeId,
      start: data.start,
      end: data.end,
      customer: data.customer,
      createdAt: result.rows[0].created_at,
      status: "active",
    };

    return { rental };
  } catch (error) {
    console.error("Error creating rental:", error);
    return { error: "Failed to create rental" as const };
  }
}

export async function listRentals(): Promise<Rental[]> {
  try {
    const {rows} = await pool.query(
      `
      SELECT 
        id::text,
        article_id AS "itemId",
        size_id AS "sizeId",
        TO_CHAR(start_date, 'YYYY-MM-DD') AS start,
        TO_CHAR(end_date, 'YYYY-MM-DD') AS "end",
        full_name,
        email,
        phone,
        created_at::text AS "createdAt",
        canceled_at
      FROM orders 
      ORDER BY created_at DESC
      `
    );

    return rows.map((row:any) => ({
      id: row.id,
      itemId: row.itemId,
      sizeId: row.sizeId,
      start: row.start,
      end: row.end,
      customer: {
        name: row.full_name,
        email: row.email,
        phone: row.phone,
      },
      createdAt: row.createdAt,
      status: row.canceled_at ? ("canceled" as const) : ("active" as const),
    }));
  } catch (error) {
    console.error("Error listing rentals:", error);
    return [];
  }
}

export async function cancelRental(
  id: string
): Promise<{ ok?: true; error?: string }> {
  try {
    const result = await pool.query(
      "UPDATE orders SET canceled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return { error: "Not found" as const };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("Error canceling rental:", error);
    return { error: "Failed to cancel rental" as const };
  }
}
