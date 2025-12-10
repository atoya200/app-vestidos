"use client";
import { useState } from "react";

export default function AddProductModal({
  colors,
  sizes,
  types,
  onClose,
  onCreated,
  csrf
}: {
  colors: any[];
  sizes: any[];
  types: any[];
  onClose: () => void;
  onCreated: (id: number) => void;
  csrf: string;
}) {

  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [colorId, setColorId] = useState<number>(colors[0]?.id ?? 1);
  const [sizeId, setSizeId] = useState<number>(sizes[0]?.id ?? 1);
  const [typeId, setTypeId] = useState<number>(types[0]?.id ?? 1);
  const [stock, setStock] = useState<number>(1);

  const [newImgBase64, setNewImgBase64] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  async function handleSubmit() {
    const payload = {
      price,
      description,
      style,
      color_id: colorId,
      size_id: sizeId,
      type_id: typeId,
      image_base64: newImgBase64,
      stock
    };

    const res = await fetch(`/api/items/dashboard/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrf
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Error al crear artículo");
      return;
    }

    const data = await res.json();

    alert(`Artículo creado con éxito (#${data.id})`);
    onCreated(data.id);
    onClose();
  }

  const inputClass =
    "w-full border p-2 rounded mb-4 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600";
  const labelClass = "block mb-1 font-medium";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-[450px] max-h-[90vh] overflow-y-auto shadow-xl">

        <h2 className="text-xl font-semibold mb-4">Crear nuevo artículo</h2>

        {/* DESCRIPCIÓN */}
        <label className={labelClass}>Descripción:</label>
        <textarea
          className={inputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* PRECIO */}
        <label className={labelClass}>Precio por día:</label>
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
        <label className={labelClass}>Stock inicial:</label>
        <input
          type="number"
          min="1"
          step="1"
          className={inputClass}
          value={stock}
          onChange={(e) => {
            const v = parseInt(e.target.value);
            setStock(isNaN(v) || v < 0 ? 1 : v);
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

        {/* PREVIEW */}
        {previewImg && (
          <img
            src={previewImg}
            className="w-full h-40 object-cover rounded mb-4 border border-slate-300 dark:border-slate-700"
          />
        )}

        {/* FILE UPLOAD */}
        <label className="block mb-2 font-semibold">Imagen:</label>

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

              const previewURL = URL.createObjectURL(file);
              setPreviewImg(previewURL);

              const reader = new FileReader();
              reader.onload = () => setNewImgBase64(reader.result as string);
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
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}
