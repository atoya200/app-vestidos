import Image from "next/image";
import { notFound } from "next/navigation";
import { getArticleById, getAvailableSizesForArticle } from "@/lib/dao/productsDao";
import ItemWithSizeSelector from "./ItemWithSizeSelector";
import ImageGallery from "./ImageGallery";
import {getOrCreateCsrfToken} from "@/lib/CsrfSessionManagement";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import BackButton from "../../components/BackButton";

export default async function ItemDetail({params}: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const item = await getArticleById(id);
    if (!item) return notFound();

    // Generate CSRF token; cookie will be set if missing
    const csrf = await getOrCreateCsrfToken();

    // Obtener los talles disponibles desde la base de datos
    const availableSizes = await getAvailableSizesForArticle(id);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div>
                    <ImageGallery images={item.images} alt={item.alt} />
                </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{item.name}</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 capitalize">{item.category}</p>
          <p className="mt-4">{item.description}</p>
          <p className="mt-4 font-semibold">From ${item.pricePerDay}/day</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Color: {item.color}{item.style ? ` • Style: ${item.style}` : ""}</p>

          <ItemWithSizeSelector itemId={id} availableSizes={availableSizes} csrf={csrf} />
        </div>
      </div>
    </div>
  );
}
