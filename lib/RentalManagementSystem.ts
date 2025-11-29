import pool from './db';

export type Category = "dress" | "shoes" | "bag" | "jacket";

export type Item = {
  id: number;
  name: string;
  category: Category;
  pricePerDay: number;
  sizes: string[]; // for shoes you can use "36-41"
  color: string;
  style?: string;
  description: string;
  images: string[];
  alt: string;
};

export type Rental = {
  id: string;
  itemId: number;
  sizeId: number;
  start: string; // ISO date (yyyy-mm-dd)
  end: string;   // ISO date (yyyy-mm-dd)
  customer: { name: string; email: string; phone: string };
  createdAt: string;
  status: "active" | "canceled";
};

// In-memory store for demo. Replace with a DB in production.
const items: Item[] = [
  {
    id: 1,
    name: "Silk Evening Gown",
    category: "dress",
    pricePerDay: 79,
    sizes: ["XS", "S", "M", "L"],
    color: "champagne",
    style: "evening",
    description: "Luxurious silk gown with flattering silhouette.",
    images: ["/images/dresses/silk-evening-gown.jpg"],
    alt: "Model wearing a champagne silk evening gown",
  },
  {
    id: 2,
    name: "Black Tie Dress",
    category: "dress",
    pricePerDay: 99,
    sizes: ["S", "M", "L", "XL"],
    color: "black",
    style: "black-tie",
    description: "Elegant black-tie dress for formal events.",
    images: ["/images/dresses/black-tie-dress.jpg"],
    alt: "Elegant black tie dress",
  },
  {
    id: 3,
    name: "Floral Midi Dress",
    category: "dress",
    pricePerDay: 49,
    sizes: ["XS", "S", "M"],
    color: "floral",
    style: "daytime",
    description: "Bright floral midi for daytime events.",
    images: ["/images/dresses/floral-midi-dress.jpg"],
    alt: "Floral midi dress perfect for daytime events",
  },
  {
    id: 4,
    name: "Velvet Cocktail Dress",
    category: "dress",
    pricePerDay: 59,
    sizes: ["S", "M", "L"],
    color: "burgundy",
    style: "cocktail",
    description: "Rich velvet cocktail dress in deep tones.",
    images: ["/images/dresses/velvet-cocktail-dress.jpg"],
    alt: "Velvet cocktail dress in deep tones",
  },
];

export function listItems(filters?: {
  q?: string;
  category?: Category;
  size?: string;
  color?: string;
  style?: string;
}) {
  const q = filters?.q?.toLowerCase().trim();
  return items.filter((it) => {
    if (filters?.category && it.category !== filters.category) return false;
    if (filters?.size && !it.sizes.includes(filters.size)) return false;
    if (filters?.color && it.color.toLowerCase() !== filters.color.toLowerCase()) return false;
    if (filters?.style && (it.style ?? "").toLowerCase() !== filters.style.toLowerCase()) return false;
    if (q) {
      const hay = [it.name, it.color, it.style ?? "", it.category].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function getItem(id: number) {
  return items.find((i) => i.id === id) ?? null;
}

export async function getAvailableSizes(itemId: number): Promise<string[]> {
  try {

    const result = await pool.query(
      `SELECT DISTINCT s.size_label 
       FROM articles a
       JOIN sizes s ON a.size_id = s.id
       WHERE a.id = $1 AND a.active = true
       ORDER BY s.id`,
      [itemId]
    );
    
    if (result.rows.length === 0) {
      // Si no hay en BD, usar los hardcodeados del item en memoria
      const item = getItem(itemId);
      return item?.sizes || [];
    }
    
    return result.rows.map(row => row.size_label);
  } catch (error) {
    console.error('Error fetching available sizes:', error);
    const item = getItem(itemId);
    return item?.sizes || [];
  }
}

export async function getItemRentals(itemId: number, sizeId?: number): Promise<Rental[]> {
  try {
    let query = `SELECT 
      id::text,
      article_id as "itemId",
      size_id as "sizeId",
      TO_CHAR(start_date, 'YYYY-MM-DD') as start,
      TO_CHAR(end_date, 'YYYY-MM-DD') as end,
      full_name,
      email,
      phone,
      created_at::text as "createdAt",
      canceled_at
    FROM orders 
    WHERE article_id = $1 AND canceled_at IS NULL`;
    
    const params: any[] = [itemId];
    
    if (sizeId !== undefined) {
      query += ` AND size_id = $2`;
      params.push(sizeId);
    }
    
    query += ` ORDER BY start_date`;

    const result = await pool.query(query, params);

    return result.rows.map(row => ({
      id: row.id,
      itemId: row.itemId,
      sizeId: row.sizeId,
      start: row.start,
      end: row.end,
      customer: {
        name: row.full_name,
        email: row.email,
        phone: row.phone
      },
      createdAt: row.createdAt,
      status: 'active' as const
    }));
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return [];
  }
}

export function hasOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  return !(aEnd < bStart || bEnd < aStart);
}

export async function isItemAvailable(itemId: number, sizeId: number, start: string, end: string): Promise<boolean> {
  const rs = await getItemRentals(itemId, sizeId);
  return rs.every((r) => !hasOverlap(start, end, r.start, r.end));
}

export async function createRental(data: Omit<Rental, "id" | "createdAt" | "status">) {
  const ok = await isItemAvailable(data.itemId, data.sizeId, data.start, data.end);
  if (!ok) return { error: "Item not available for selected dates" as const };

  try {
    const startDate = new Date(data.start);
    const endDate = new Date(data.end);
    const numberDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const item = getItem(data.itemId);
    if (!item) return { error: "Item not found" as const };

    const result = await pool.query(
      `INSERT INTO orders 
        (article_id, size_id, start_date, end_date, status_id, price_for_day, phone, full_name, email, number_days)
      VALUES ($1, $2, $3, $4, 1, $5, $6, $7, $8, $9)
      RETURNING id::text, TO_CHAR(created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as created_at`,
      [
        data.itemId,
        data.sizeId,
        data.start,
        data.end,
        item.pricePerDay,
        data.customer.phone,
        data.customer.name,
        data.customer.email,
        numberDays
      ]
    );

    if (!result.rows[0]) {
      throw new Error('No se pudo crear el registro');
    }

    const rental: Rental = {
      id: result.rows[0].id,
      itemId: data.itemId,
      sizeId: data.sizeId,
      start: data.start,
      end: data.end,
      customer: data.customer,
      createdAt: result.rows[0].created_at,
      status: "active"
    };

    return { rental };
  } catch (error) {
    console.error('Error creating rental:', error);
    return { error: "Failed to create rental" as const };
  }
}

export async function listRentals(): Promise<Rental[]> {
  try {
    const result = await pool.query(
      `SELECT 
        id::text,
        article_id as "itemId",
        size_id as "sizeId",
        TO_CHAR(start_date, 'YYYY-MM-DD') as start,
        TO_CHAR(end_date, 'YYYY-MM-DD') as end,
        full_name,
        email,
        phone,
        created_at::text as "createdAt",
        canceled_at
      FROM orders 
      ORDER BY created_at DESC`
    );

    return result.rows.map(row => ({
      id: row.id,
      itemId: row.itemId,
      sizeId: row.sizeId,
      start: row.start,
      end: row.end,
      customer: {
        name: row.full_name,
        email: row.email,
        phone: row.phone
      },
      createdAt: row.createdAt,
      status: row.canceled_at ? 'canceled' as const : 'active' as const
    }));
  } catch (error) {
    console.error('Error listing rentals:', error);
    return [];
  }
}

export async function cancelRental(id: string) {
  try {
    const result = await pool.query(
      'UPDATE orders SET canceled_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rowCount === 0) {
      return { error: "Not found" as const };
    }
    
    return { ok: true as const };
  } catch (error) {
    console.error('Error canceling rental:', error);
    return { error: "Failed to cancel rental" as const };
  }
}
