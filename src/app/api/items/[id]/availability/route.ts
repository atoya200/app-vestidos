import { NextResponse } from "next/server";
import {getItem, getItemRentals} from "@/lib/RentalManagementSystem";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const sizeLabel = searchParams.get('size');
  
  let sizeId: number | undefined;
  if (sizeLabel) {
    const result = await pool.query(
      'SELECT id FROM sizes WHERE UPPER(size_label) = UPPER($1) AND active = true',
      [sizeLabel]
    );
    sizeId = result.rows[0]?.id;
  }

  const rentals = (await getItemRentals(id, sizeId)).map((r) => ({ start: r.start, end: r.end }));
  return NextResponse.json({ rentals });
}
