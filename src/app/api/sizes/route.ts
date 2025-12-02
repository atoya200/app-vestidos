import { NextResponse } from "next/server";
import { getSizes } from "@/lib/dao/sizesDao";

export async function GET() {
  const data = await getSizes();
  return NextResponse.json(data);
}
