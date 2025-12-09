import { NextResponse } from "next/server";
import {createRental, getItem} from "../../../../lib/RentalManagementSystem";
import {verifyCsrfToken} from "../../../../lib/CsrfSessionManagement";
import { getAllOrders } from "@/lib/dao/rentalsDao";
import pool from "../../../../lib/db";

function normalizeDate(s: string | null) {
  if (!s) return null;
  const m = s.match(/^\d{4}-\d{2}-\d{2}$/);
  return m ? s : null;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const csrf = form.get("csrf")?.toString() ?? null;
  if (!verifyCsrfToken(csrf)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 400 });
  }

  const itemId = Number(form.get("itemId") || NaN);
  const sizeLabel = (form.get("size") || "").toString().trim();
  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const phone = (form.get("phone") || "").toString().trim();
  const start = normalizeDate((form.get("start") || "").toString());
  const end = normalizeDate((form.get("end") || "").toString());

  if (!itemId || !sizeLabel || !name || !email || !phone || !start || !end) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const item = await getItem(itemId);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (end < start) return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });

  // Convert sizeLabel to sizeId
  const sizeResult = await pool.query(
    'SELECT id FROM sizes WHERE UPPER(size_label) = UPPER($1) AND active = true',
    [sizeLabel]
  );
  const sizeId = sizeResult.rows[0]?.id;
  if (!sizeId) return NextResponse.json({ error: "Invalid size" }, { status: 400 });

  const { rental, error } = await createRental({
    itemId,
    sizeId,
    start,
    end,
    customer: { name, email, phone },
  });

  if (error) return NextResponse.json({ error }, { status: 409 });

  return NextResponse.json({ success: true, rental });
}



export async function GET() {
  const rentals = await getAllOrders();
  return NextResponse.json(rentals);
}
