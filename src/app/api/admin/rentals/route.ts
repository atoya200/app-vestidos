import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/CsrfSessionManagement";
import { getAllOrders } from "@/lib/dao/rentalsDao";

export async function GET() {
  if (!isAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ rentals: await getAllOrders() });
}
