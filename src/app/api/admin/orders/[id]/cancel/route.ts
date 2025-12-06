import { NextResponse } from "next/server";
import { pool } from "../../../../../../../lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const orderId = Number(params.id);

  // Simulás el usuario que cancela (luego lo vas a sacar del auth)
  const userCancelId = 1;

  try {
    // 1) Obtener la orden
    const orderRes = await pool.query(
      `SELECT id, status_id FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderRes.rowCount === 0) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    const order = orderRes.rows[0];

    // 2) Validar que esté pendiente (asumiendo status_id = 1 es PENDIENTE)
    if (order.status_id !== 1) {
      return NextResponse.json(
        { error: "Solo las órdenes pendientes pueden ser canceladas" },
        { status: 400 }
      );
    }

    // 3) Ejecutar cancelación
    await pool.query(
      `
      UPDATE orders
      SET 
        status_id = 4,           -- 4 = Cancelado
        canceled_at = NOW(),
        canceled_by_user_id = $1
      WHERE id = $2
      `,
      [userCancelId, orderId]
    );

    return NextResponse.json({ success: true, message: "Orden cancelada correctamente" });

  } catch (error) {
    console.error("Error cancelando orden:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
