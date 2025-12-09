import { NextResponse } from "next/server";
import { listItems, getAvailableSizes } from "../../../../lib/RentalManagementSystem";
import pool from "../../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const category = (searchParams.get("category") as any) || undefined;
    const size = searchParams.get("size") || undefined;
    const color = searchParams.get("color") || undefined;
    const style = searchParams.get("style") || undefined;

    const items = (await listItems({ q, category, size, color, style })).map((i) => ({
      id: i.id,
      name: i.name,
      category: i.category,
      pricePerDay: i.pricePerDay,
      sizes: i.sizes,
      color: i.color,
      style: i.style,
      image: i.images[0],
      alt: i.alt,
    }));

    if (items.length > 0) {
      return NextResponse.json({ items });
    }


    const result = await pool.query(
      `
      SELECT DISTINCT ON (a.style, a.color_id)
        MIN(a.id) as id,
        a.style AS name,
        at.type_name AS category,
        a.price_for_day AS pricePerDay,
        c.color_name AS color,
        a.style,
        a.description,
        a.image_url
      FROM articles a
      JOIN article_types at ON a.article_type_id = at.id
      JOIN colors c ON a.color_id = c.id
      WHERE a.active = TRUE
      GROUP BY a.style, a.color_id, at.type_name, a.price_for_day, c.color_name, a.description, a.image_url
      ORDER BY a.style, a.color_id
      `
    );

    const fallbackItems = await Promise.all(
      result.rows.map(async (row) => {
        const sizes = await getAvailableSizes(row.id);
        return {
          id: row.id,
          name: row.name,
          category: row.category,
          pricePerDay: Number(row.priceperday ?? row.pricePerDay),
          sizes,
          color: row.color,
          style: row.style,
          image: row.image_url || `/images/dresses/${row.id}.jpeg`,
          alt: `${row.name} - ${row.color}`,
        };
      })
    );

    return NextResponse.json({ items: fallbackItems });
  } catch (error) {
    console.error("Items API error:", error);
    return NextResponse.json({ items: [], error: "Failed to load items" }, { status: 500 });
  }
}
