import { NextResponse } from "next/server";
import {getItem, getItemRentals} from "@/lib/RentalManagementSystem";
import { getSizeId } from "@/lib/sizeHelper";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = getItem(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Obtener el parámetro de talle de la URL
  const { searchParams } = new URL(request.url);
  const sizeLabel = searchParams.get('size');
  const sizeId = sizeLabel ? getSizeId(sizeLabel) : undefined;

  const rentals = (await getItemRentals(id, sizeId ?? undefined)).map((r) => ({ start: r.start, end: r.end }));
  return NextResponse.json({ rentals });
}
