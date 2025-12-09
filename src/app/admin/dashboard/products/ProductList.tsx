"use client";

import { useState } from "react";
import ImageModal from "../../../components/ImagenModal";
import EditProductModal from "./EditProductModal";

export default function ProductsList({ products, colors, sizes, types }: any) {
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [items, setItems] = useState(products); // 🔥 manejamos los items acá

  console.log("ProductsList render with items:", items);

  // 🔥 REFRESCAR SOLO UN PRODUCTO
  async function refreshItem(id: number) {
    const res = await fetch(`/api/items/${id}`, { cache: "no-store" });
    const updated = await res.json();

    setItems((prev: any[]) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  }

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full border rounded-lg shadow-md bg-white text-slate-900
          dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700">
        <thead className="bg-slate-100 border-b dark:bg-slate-700 dark:border-slate-600">
          <tr>
            <th className="p-3">Nro</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Tipo</th>
            <th className="p-3">Color</th>
            <th className="p-3">Talle</th>
            <th className="p-3">Estilo</th>
            <th className="p-3">Fecha cargado</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Reservas</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={11} className="text-center p-6 text-slate-500 dark:text-slate-400">
                No hay productos para mostrar.
              </td>
            </tr>
          )}

          {items.map((p: any) => (
            <tr
              key={p.id}
              className="border-b hover:bg-slate-50 dark:hover:bg-slate-700 dark:border-slate-700"
            >
              <td className="p-3 text-center">{p.id}</td>
              <td className="p-3">{p.description}</td>
              <td className="p-3">{p.type_name}</td>
              <td className="p-3">{p.color_name}</td>
              <td className="p-3">{p.size_label}</td>
              <td className="p-3">{p.style}</td>
              <td className="p-3">{new Date(p.created_at).toLocaleDateString("es-UY")}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">{p.reserves}</td>

              <td className="p-3">
                {p.active ? (
                  <span className="text-green-600 dark:text-green-400 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-semibold">Inactivo</span>
                )}
              </td>

              <td className="p-3 flex gap-3">
                <button
                  className="px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
                  onClick={() => setModalImg(p.image_url)}
                >
                  Imagen
                </button>

                <button
                  className="px-3 py-1 rounded-md text-white bg-green-600 hover:bg-green-700 transition"
                  onClick={() => setEditingProduct(p)}
                >
                  Modificar
                </button>

                <button
                  className="px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                  onClick={() => alert("Eliminar producto " + p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalImg && <ImageModal url={modalImg} onClose={() => setModalImg(null)} />}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          colors={colors}
          sizes={sizes}
          types={types}
          onUpdated={refreshItem} // 🔥 ahora solo actualiza uno
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
}
