"use client";

import { useState } from "react";
import ImageModal from "../../../components/ImagenModal";

export default function OrdersList({ orders }: { orders: any[] }) {
  const [modalImg, setModalImg] = useState<string | null>(null);

  async function cancelOrder(orderId: number) {
    const res = await fetch(`/api/admin/orders/${orderId}/cancel`, {
      method: "POST",
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error al cancelar la orden");
      return;
    }

    alert("Orden cancelada correctamente");
    location.reload(); // o podés actualizar el estado si querés hacerlo elegante
  }


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse bg-white dark:bg-slate-900 shadow rounded-xl">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800 text-left text-slate-700 dark:text-slate-300">
            <th className="p-3">Nro Pedido</th>
            <th className="p-3">Artículo</th>
            <th className="p-3">Cliente</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Días</th>
            <th className="p-3">Fecha inicio</th>
            <th className="p-3">Fecha fin</th>
            <th className="p-3">Fecha cancelado</th>
            <th className="p-3">Cancelado por</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              {/* NRO PEDIDO */}
              <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                {o.id}
              </td>

              {/* ARTÍCULO */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                <div className="font-semibold text-sm">{o.style}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {o.type_name} · {o.size_label} · {o.color_name}
                </div>
              </td>

              {/* CLIENTE */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                <div>{o.full_name}</div>
                <div className="text-xs text-slate-500">{o.email}</div>
                <div className="text-xs text-slate-500">{o.phone}</div>
              </td>

              {/* PRECIO */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                ${o.order_price}
              </td>

              {/* CANTIDAD DÍAS */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.number_days}
              </td>

              {/* FECHA INICIO */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.start_date}
              </td>

              {/* FECHA FIN */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.end_date}
              </td>

              {/* FECHA CANCELADO */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.canceled_at ? o.canceled_at : "–"}
              </td>

              {/* CANCELADO POR */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.canceled_by_user_name ? o.canceled_by_user_name : "–"}
              </td>

              {/* ESTADO */}
              <td className="p-3 text-slate-900 dark:text-slate-100">
                {o.status_name}
              </td>

              {/* ACCIONES */}
              <td className="p-3 flex flex-col gap-2">
                {/* Ver imagen */}
                <button
                  onClick={() => setModalImg(o.image_url)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs"
                >
                  Ver Imagen
                </button>

                {/* Cancelar */}
                {o.status_name === "Pendiente" ? (
                  <button
                    onClick={() => cancelOrder(o.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs"
                  >
                    Cancelar
                  </button>

                ) : (
                  <button
                    className="px-3 py-1 bg-gray-400 text-white rounded-lg text-xs cursor-not-allowed"
                    disabled
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={11}
                className="text-center p-6 text-slate-500 dark:text-slate-400"
              >
                No hay órdenes registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalImg && (
        <ImageModal url={modalImg} onClose={() => setModalImg(null)} />
      )}
    </div>
  );
}
