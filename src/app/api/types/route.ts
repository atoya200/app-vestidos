import { NextResponse } from "next/server";
import { getTypes } from "@/lib/dao/typesDaos";

export async function GET() {
  console.log("Dale la puta que te pario")
  const data = await getTypes();
  return NextResponse.json(data);
}
