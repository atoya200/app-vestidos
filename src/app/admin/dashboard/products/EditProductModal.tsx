"use client";
import { useState } from "react";

export default function EditProductModal({
  product,
  colors,
  sizes,
  types,
  onClose,
  onUpdated,
  csrf
}: {
  product: any;
  colors: any[];
  sizes: any[];
  types: any[];
  onClose: () => void;
  onUpdated: (id: number) => void;
  csrf: string;
}) {
  const [price, setPrice] = useState<number>(Number.parseFloat(product.price_for_day) ?? 0);
  const [description, setDescription] = useState(product.description);
  const [style, setStyle] = useState(product.style);
  const [colorId, setColorId] = useState<number>(product.color_id);
  const [sizeId, setSizeId] = useState<number>(product.size_id);
  const [typeId, setTypeId] = useState<number>(product.article_type_id);
  const [stock, setStock] = useState<number>(product.stock);

  const [newImgBase64, setNewImgBase64] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  async function handleSubmit() {
    debugger
    const payload = {
      id: product.id,
      price,
      description,
      style,
      color_id: colorId,
      size_id: sizeId,
      type_id: typeId,
      new_image_base64: newImgBase64, 
      stock
    };
    const res = await fetch(`/api/items/${product.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
          "x-csrf-token": csrf
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Error al actualizar");
      return;
    }

    alert(`Producto ${product.id} actualizado con exito`);
    onUpdated(product.id); 
    onClose();
  }

  const inputClass =
    "w-full border p-2 rounded mb-4 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600";
  const labelClass = "block mb-1 font-medium";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">

        <h2 className="text-xl font-semibold mb-4">
          Editar artículo #{product.id}
        </h2>

        {/* DESCRIPCIÓN */}
        <label className={labelClass}>Descripción:</label>
        <textarea
          className={inputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* PRICE */}
        <label className={labelClass}>Precio:</label>
        <input
          type="number"
          min="0"
          step="1"
          className={inputClass}
          value={price}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setPrice(isNaN(v) || v < 0 ? 0 : v);
          }}
        />

        {/* STOCK */}
        <label className={labelClass}>Stock Actual:</label>
        <input
          type="number"
          min="1"
          step="1"
          className={inputClass}
          value={stock}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setStock(isNaN(v) || v < 0 ? 0 : v);
          }}
        />

        {/* ESTILO */}
        <label className={labelClass}>Estilo:</label>
        <input
          type="text"
          className={inputClass}
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        />

        {/* TIPO */}
        <label className={labelClass}>Tipo:</label>
        <select
          className={inputClass}
          value={typeId}
          onChange={(e) => setTypeId(Number(e.target.value))}
        >
          {types.map((t) => (
            <option key={t.id} value={t.id}>
              {t.type_name}
            </option>
          ))}
        </select>

        {/* COLOR */}
        <label className={labelClass}>Color:</label>
        <select
          className={inputClass}
          value={colorId}
          onChange={(e) => setColorId(Number(e.target.value))}
        >
          {colors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.color_name}
            </option>
          ))}
        </select>

        {/* SIZE */}
        <label className={labelClass}>Talle:</label>
        <select
          className={inputClass}
          value={sizeId}
          onChange={(e) => setSizeId(Number(e.target.value))}
        >
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.size_label}
            </option>
          ))}
        </select>

        {/* IMAGEN ACTUAL / PREVIEW */}
        <p className="mb-2 font-semibold">Imagen:</p>
        <img
          src={previewImg ?? product.image_url}
          className="w-full h-40 object-cover rounded mb-4 border border-slate-300 dark:border-slate-700"
        />

        {/* FILE UPLOAD */}
        <label className="block mb-2 font-semibold">Nueva imagen:</label>

        <div className="flex items-center gap-3 mb-4">
          <label
            htmlFor="fileUpload"
            className="px-4 py-2 rounded-lg cursor-pointer bg-blue-600 text-white font-medium hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
          >
            Elegir archivo
          </label>

          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              if (!file) {
                setPreviewImg(null);
                setNewImgBase64(null);
                return;
              }

              // PREVIEW
              const previewURL = URL.createObjectURL(file);
              setPreviewImg(previewURL);

              // BASE64
              const reader = new FileReader();
              reader.onload = () => {
                setNewImgBase64(reader.result as string);
              };
              reader.readAsDataURL(file);
            }}
          />

          <span className="text-sm text-slate-700 dark:text-slate-300">
            {newImgBase64 ? "Imagen lista ✔" : "Ningún archivo seleccionado"}
          </span>
        </div>

        {/* BOTONES */}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-slate-300 dark:bg-slate-600 dark:text-white"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
