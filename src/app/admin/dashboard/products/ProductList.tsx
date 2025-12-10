"use client";
import { useState } from "react";
import ImageModal from "../../../components/ImagenModal";
import EditProductModal from "./EditProductModal";
import AddProductModal from "./AddProduct";

export default function ProductsList({ products, colors, sizes, types, csrf }: any) {
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [addProducto, setAddProduct] = useState<any | null>(null);
  const [items, setItems] = useState(products);

  async function refreshItem(id: number) {
    const res = await fetch(`/api/items/${id}`, {
      cache: "no-store",
      headers: { "x-csrf-token": csrf }
    });
    const updated = await res.json();

    setItems((prev: any[]) =>
      prev.map((p) => (p.id === id ? updated : p))
    );
  }

  async function deleteProduct(id: number) {
    const res = await fetch(`/api/items/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrf }
    });

    if (!res.ok) {
      alert("Error al eliminar");
      return;
    } else {
      alert(`Producto ${id} eliminado con exito`);
      await refreshItem(id)
    }
  }
  async function reactiveProduct(id: number) {
    const res = await fetch(`/api/items/${id}`, {
      method: "PATCH",
      headers: { "x-csrf-token": csrf }
    });

    if (!res.ok) {
      alert("Error al reactivar producto");
      return;
    } else {
      alert(`Producto ${id} reactivado con exito`);
      await refreshItem(id)
    }
  }

  async function refreshList() {
    const res = await fetch("/api/items/dashboard", { cache: "no-store" });
    const data = await res.json();
    setItems(data);
  }

  return (
    <div className="max-heigth=[60vh]">
      <h1
        style={{
          width: "100%",
          fontSize: "40px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >Productos</h1>
      <button
        className="px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
        onClick={() => {
          setAddProduct(true);
        }}
      >
        Agregar producto
      </button>
      <div className="mt-6 overflow-y-auto max-h-[70vh]">
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
                <td className="p-3">{p.cantidad_reservas}</td>

                <td className="p-3">
                  {p.active ? (
                    <span className="text-green-600 dark:text-green-400 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 font-semibold">Inactive</span>
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

                  {p.active ? <button
                    className="px-3 py-1 rounded-md text-white bg-red-600 hover:bg-red-700 transition"
                    onClick={() => {
                      if (confirm(`¿Está seguro de eliminar el producto nro ${p.id}?`)) {
                        deleteProduct(p.id);
                      }
                    }}
                  >
                    Eliminar
                  </button> :
                    <button
                      className="px-3 py-1 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                      onClick={() => {
                        if (confirm(`¿Esta seguro de volver a poner a la venta el artículo ${p.id}?`)) {
                          reactiveProduct(p.id);
                        }
                      }}
                    >
                      Reactivar
                    </button>
                  }
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
            onUpdated={refreshItem}
            onClose={() => setEditingProduct(null)}
            csrf={csrf}
          />
        )}


        {addProducto && (
          <AddProductModal
            onClose={() => setAddProduct(null)}
            colors={colors}
            onCreated={() => refreshList()}
            sizes={sizes}
            types={types}
            csrf={csrf}
          />
        )}
      </div>
    </div>
  );
}
