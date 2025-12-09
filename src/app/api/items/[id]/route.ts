import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "ID inválido" }, { status: 400 });
        }

        const sql = `
        SELECT 
        a.id,
        a.style,
        a.description,
        a.image_url,
        a.price_for_day,
        a.stock,
        a.reserves,
        a.active,

        at.type_name,
        s.size_label,
        c.color_name,
        c.hex_value,

        a.created_at,
        a.modified_at,
        um.username AS modified_by
        FROM articles a
        LEFT JOIN article_types at ON at.id = a.article_type_id
        LEFT JOIN sizes s ON s.id = a.size_id
        LEFT JOIN colors c ON c.id = a.color_id
        LEFT JOIN users um ON um.id = a.user_modified_id
        WHERE a.id = $1
    `;

        const { rows } = await pool.query(sql, [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }

        return NextResponse.json(rows[0], { status: 200 });

    } catch (err) {
        console.error("❌ Error GET item:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
