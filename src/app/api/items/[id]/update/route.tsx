import { NextResponse } from "next/server";
import pool from "../../../../../../lib/db";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    // 🔥 Recibir JSON del frontend
    const body = await req.json();

    const {
      id,
      description,
      style,
      type_id,
      color_id,
      size_id,
      new_image_base64, // <-- viene del modal
    } = body;

    let imageUrl: string | null = null;

    // -------------------------------------------------------------------------
    // 🔥 Guardar imagen si se envió en base64
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

    // -------------------------------------------------------------------------
    // 🔥 UPDATE en la base de datos
    // -------------------------------------------------------------------------
    const sql = `
      UPDATE articles SET
        description = $1,
        style = $2,
        color_id = $3,
        size_id = $4,
        image_url = COALESCE($5, image_url),
        modified_at = NOW()
        article_type_id = $6
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
