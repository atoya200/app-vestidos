import { NextResponse } from "next/server";
import pool from "@/lib/db";
import fs from "fs";
import path from "path";
import { verifyCsrfToken } from "@/lib/CsrfSessionManagement";

export async function GET(
    _req: Request,
    context: { params: { id: string } }
) {
    try {

        const id = Number(context.params.id);

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
            a.active,
            at.type_name,
            s.size_label,
            c.color_name,
            c.hex_value,
            a.created_at,
            a.modified_at,
            um.username AS modified_by,
            COUNT(o.id) AS cantidad_reservas
        FROM 
            articles a
            LEFT JOIN article_types at ON at.id = a.article_type_id
            LEFT JOIN sizes s ON s.id = a.size_id
            LEFT JOIN colors c ON c.id = a.color_id
            LEFT JOIN users um ON um.id = a.user_modified_id
            LEFT JOIN orders o ON o.article_id = a.id AND start_date > NOW() AND status_id = 1
        WHERE 
            a.id = $1
        GROUP BY 
            a.id,
            a.style,
            a.description,
            a.image_url,
            a.price_for_day,
            a.stock,
            a.active,
            at.type_name,
            s.size_label,
            c.color_name,
            c.hex_value,
            a.created_at,
            a.modified_at,
            um.username    `;


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



export async function PUT(req: Request, context: { params: any }) {
    try {

        const headers = req.headers;
        const validCsrf = await verifyCsrfToken(null, headers);
        if (!validCsrf) {
            return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
        }
        const body = await req.json();

        const {
            id,
            description,
            style,
            type_id,
            color_id,
            size_id,
            new_image_base64,
            stock
        } = body;

        let imageUrl: string | null = null;

        // -------------------------------------------------------------------------
        // Guardar imagen si se envió en base64
        // -------------------------------------------------------------------------
        if (new_image_base64) {
            const folder = path.join(process.cwd(), "public/file-server/items");

            if (!fs.existsSync(folder)) fs.mkdirSync(folder);

            // "data:image/jpeg;base64,xxxxx..." → solo la parte base64
            const base64Data = new_image_base64.split(",")[1];

            //const filename = `${id}-${Date.now()}.jpg`;
            const filename = `${id}.jpg`;
            const filePath = path.join(folder, filename);

            // Crear el archivo físico
            fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

            imageUrl = `/file-server/items/${filename}`;
        }

        const sql = `
      UPDATE articles SET
        description = COALESCE($1, description),
        style = COALESCE($2, style),
        color_id = COALESCE($3, color_id),
        size_id =   COALESCE($4, size_id),
        image_url = COALESCE($5, image_url),
        modified_at = NOW(),
        article_type_id =  COALESCE($6, article_type_id),
        stock = COALESCE($8, stock)
      WHERE id = $7
    `;

        await pool.query(sql, [
            description,
            style,
            color_id,
            size_id,
            imageUrl,
            type_id,
            id,
            stock
        ]);

        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error("❌ Error UPDATE:", err);
        return NextResponse.json(
            { error: "Error actualizando producto" },
            { status: 500 }
        );
    }
}


export async function DELETE(
    _req: Request,
    context: { params: { id: string } }
) {
    try {
        const headers = _req.headers;
        const validCsrf = await verifyCsrfToken(null, headers);
        if (!validCsrf) {
            return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
        }

        const id = Number(context.params.id);

        let sqlOrdenes = 'SELECT 1 FROM orders WHERE article_id = $1 AND start_date > NOW() AND status_id = 1'
        let result = await pool.query(sqlOrdenes, [id]);

        if (result.rows.length > 0) {
            return NextResponse.json({ error: "No se puede eliminar el producto porque tiene reservas activas." }, { status: 400 });
        }

        let sqlDelete = 'UPDATE  articles SET active = false  WHERE id = $1';
        await pool.query(sqlDelete, [id]);

        return NextResponse.json({ ok: true });
    }
    catch (err) {
        console.error("❌ Error DELETE item:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}


export async function PATCH(req: Request,
    context: { params: { id: string } }) {
    try {
        const headers = req.headers;
        const validCsrf = await verifyCsrfToken(null, headers);
        if (!validCsrf) {
            return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
        }
        const id = Number(context.params.id);

        let sqlDelete = 'UPDATE  articles SET active = true WHERE id = $1';
        await pool.query(sqlDelete, [id]);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("❌ Error PATCH item:", error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

