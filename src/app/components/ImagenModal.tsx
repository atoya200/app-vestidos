"use client";
import { useEffect } from "react";

export default function ImageModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [onClose]);

  return (
    <div
      className="
        fixed inset-0 
        bg-black/70 
        flex items-center justify-center 
        z-50 p-4
      "
    >
      <div
        className="
          bg-white dark:bg-slate-800 
          text-slate-900 dark:text-slate-200
          rounded-xl shadow-xl 
          p-4 max-w-3xl max-h-[90vh] 
          flex flex-col
        "
      >
        <img
          src={url}
          className="rounded-lg max-h-[80vh] object-contain"
        />

        <button
          className="
            mt-4 
            px-4 py-2 rounded-lg 
            bg-fuchsia-600 text-white
            hover:opacity-90 transition
            dark:bg-fuchsia-700
          "
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
