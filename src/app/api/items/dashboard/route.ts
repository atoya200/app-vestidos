import { NextResponse } from "next/server";
import { getProductsForDashboard } from "@/lib/dao/productsDao";
import { verifyCsrfToken } from "@/lib/CsrfSessionManagement";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {

        const items = await getProductsForDashboard();
        return NextResponse.json(items);
    } catch (error) {
        console.error("Items API error:", error);
        return NextResponse.json({ items: [], error: "Failed to load items" }, { status: 500 });
    }
}