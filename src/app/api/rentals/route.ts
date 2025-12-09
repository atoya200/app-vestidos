import { NextResponse } from "next/server";
import { verifyCsrfToken } from "../../../../lib/CsrfSessionManagement";
import { getArticleById, getSizeIdByLabel, getArticleByStyleColorSize } from "../../../../lib/dao/productsDao";
import { getOrdersByArticle, createOrder } from "../../../../lib/dao/rentalsDao";

function normalizeDate(s: string | null) {
  if (!s) return null;
  const m = s.match(/^\d{4}-\d{2}-\d{2}$/);
  return m ? s : null;
}

function hasOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return !(aEnd < bStart || bEnd < aStart);
}

export async function POST(req: Request) {
  try {
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

    const item = await getArticleById(itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (end < start) return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });

    const sizeId = await getSizeIdByLabel(sizeLabel);
    if (!sizeId) return NextResponse.json({ error: "Invalid size" }, { status: 400 });

    if (!item.colorId) return NextResponse.json({ error: "Item color not found" }, { status: 500 });
    
    const articleVariant = await getArticleByStyleColorSize(item.style!, item.colorId, sizeId);
    if (!articleVariant) {
      return NextResponse.json({ error: "This size is not available for this item" }, { status: 400 });
    }

  const actualArticleId = articleVariant.id;

  // Check how many of this article are rented during the requested period
  const existingOrders = await getOrdersByArticle(actualArticleId);
  
  // Check availability for each day of the requested period
  const reqStart = new Date(start);
  const reqEnd = new Date(end);
  
  // Filter orders that overlap with the requested range to optimize
  const relevantOrders = existingOrders.filter((order: any) => hasOverlap(start, end, order.start, order.end));

  for (let d = new Date(reqStart); d <= reqEnd; d.setDate(d.getDate() + 1)) {
    const dayString = d.toISOString().split('T')[0];
    
    let rentalsOnThisDay = 0;
    for (const order of relevantOrders) {
      if (order.start <= dayString && order.end >= dayString) {
        rentalsOnThisDay++;
      }
    }
    
    if (rentalsOnThisDay >= articleVariant.stock) {
      return NextResponse.json({ error: "Item not available for selected dates" }, { status: 409 });
    }
  }

    // Calculate rental details
    const startDate = new Date(start);
    const endDate = new Date(end);
    const numberDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    const orderResult = await createOrder({
      articleId: actualArticleId,
      startDate: start,
      endDate: end,
      pricePerDay: item.pricePerDay,
      phone,
      fullName: name,
      email,
      numberDays,
    });

    if (!orderResult) {
      return NextResponse.json({ error: "Unable to complete rental" }, { status: 500 });
    }

    const rental = {
      id: orderResult.id,
      itemId: actualArticleId,
      sizeId,
      start,
      end,
      customer: { name, email, phone },
      createdAt: orderResult.created_at,
      status: "active" as const,
    };

    return NextResponse.json({ success: true, rental });
  } catch (error) {
    console.error('Error processing rental:', error);
    return NextResponse.json({ error: "Unable to complete rental" }, { status: 500 });
  }
}



export async function GET() {
  const rentals = await getAllOrders();
  return NextResponse.json(rentals);
}
