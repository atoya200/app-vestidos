import { NextResponse } from "next/server";
import {createRental, isItemAvailable, getItem} from "../../../../lib/RentalManagementSystem";
import {verifyCsrfToken} from "../../../../lib/CsrfSessionManagement";
import { getSizeId } from "../../../../lib/sizeHelper";

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
  const sizeId = getSizeId(sizeLabel);
  const name = (form.get("name") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const phone = (form.get("phone") || "").toString().trim();
  const start = normalizeDate((form.get("start") || "").toString());
  const end = normalizeDate((form.get("end") || "").toString());

  if (!itemId || !sizeId || !name || !email || !phone || !start || !end) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const item = getItem(itemId);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (end < start) return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });

  if (!(await isItemAvailable(itemId, sizeId, start, end))) {
    return NextResponse.json({ error: "Item not available for selected dates" }, { status: 409 });
  }

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
