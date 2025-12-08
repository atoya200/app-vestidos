import { NextResponse } from "next/server";
import { getArticleById, getSizeIdByLabel, getArticleByStyleColorSize } from "@/lib/dao/productsDao";
import { getOrdersByArticle } from "@/lib/dao/rentalsDao";

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  const item = await getArticleById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const sizeLabel = searchParams.get('size');
  
  let actualArticleId = id;
  
  if (sizeLabel) {
    const sizeId = await getSizeIdByLabel(sizeLabel);
    if (sizeId) {
      // Note: item.colorId is now available from the updated DAO
      if (item.colorId && item.style) {
        const articleVariant = await getArticleByStyleColorSize(item.style, item.colorId, sizeId);
        if (articleVariant) {
          actualArticleId = articleVariant.id;
        }
      }
    }
  }

  const orders = await getOrdersByArticle(actualArticleId);

  const actualItem = actualArticleId !== id ? await getArticleById(actualArticleId) : item;
  if (!actualItem) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  const stock = actualItem.stock || 1;
  
  

  const dateCountMap = new Map<string, number>();
  
  orders.forEach((order: any) => {
    const start = new Date(order.start);
    const end = new Date(order.end);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      dateCountMap.set(dateStr, (dateCountMap.get(dateStr) || 0) + 1);
    }
  });
  
  // Only mark as rented if ALL stock is booked
  const rentals: Array<{ start: string; end: string }> = [];
  let rangeStart: string | null = null;
  
  // Get all dates from orders and check each one
  const allDates = Array.from(dateCountMap.keys()).sort();
  
  allDates.forEach((date, idx) => {
    const count = dateCountMap.get(date) || 0;
    const isFullyBooked = count >= stock;
    
    if (isFullyBooked) {
      if (!rangeStart) rangeStart = date;
    } else {
      if (rangeStart) {
        const prevDate = allDates[idx - 1];
        rentals.push({ start: rangeStart, end: prevDate });
        rangeStart = null;
      }
    }
  });
  
  // Close final range if needed
  if (rangeStart) {
    rentals.push({ start: rangeStart, end: allDates[allDates.length - 1] });
  }
  
  return NextResponse.json({ rentals });
}
