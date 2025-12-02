import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/dao/rentalsDao";

export async function GET() {
  const rentals = await getAllOrders();
  return NextResponse.json(rentals);
}
