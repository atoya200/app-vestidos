import { NextResponse } from "next/server";
import { getProductsForDashboard } from "@/lib/dao/productsDao";
import { verifyCsrfToken } from "@/lib/CsrfSessionManagement";
import path from "path";
import pool from "@/lib/db";
import fs from "fs";

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




export async function POST(req: Request) {
    try {
        const headers = req.headers;
        const validCsrf = await verifyCsrfToken(null, headers);
        if (!validCsrf) {
            return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
        }

        const { price, description, style, type_id, color_id, size_id, stock, image_base64 } = await req.json();

        let imageUrl = null;

        // 1️⃣ Insert con retorno de ID
        const insertResult = await pool.query(
            `
  INSERT INTO articles (
    article_type_id, size_id, color_id, "style",
    price_for_day, stock, image_url, description,
    created_at, modified_at, active
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW(), NOW(), true)
  RETURNING id
  `,
            [
                type_id,
                size_id,
                color_id,
                style,
                price,
                stock,
                image_base64 ? "temp" : null, // temporal mientras creamos la imagen
                description
            ]
        );

        const { id } = insertResult.rows[0]; // 👈 acá obtenés el id generado

        // 2️⃣ Si viene imagen, guardarla físicamente y actualizar url
        if (image_base64) {
            const folder = path.join(process.cwd(), "public/file-server/items");
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

            const base64Data = image_base64.split(",")[1];
            const filename = `${id}.jpg`;
            const filePath = path.join(folder, filename);

            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

            imageUrl = `/file-server/items/${filename}`;

            // actualizar image_url definitivo
            await pool.query(
                `UPDATE articles SET image_url = $1, modified_at = NOW() WHERE id = $2`,
                [imageUrl, id]
            );
        }

        // 3️⃣ respuesta con id + url
        return NextResponse.json({
            message: "Artículo creado correctamente",
            id,
            imageUrl
        });

    } catch (error) {
        console.error("Create Item API error:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }

}