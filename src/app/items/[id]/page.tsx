import Image from "next/image";
import { notFound } from "next/navigation";
import {getItem, getAvailableSizes} from "../../../../lib/RentalManagementSystem";
import ItemWithSizeSelector from "./ItemWithSizeSelector";
import {getOrCreateCsrfToken} from "../../../../lib/CsrfSessionManagement";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key } from "react";
import BackButton from "../../components/BackButton";

export default async function ItemDetail({params}: { params: Promise<{ id: string }> }) {
    const { id: idStr } = await params;
    const id = Number(idStr);
    const item = await getItem(id);
    if (!item) return notFound();

    // Generate CSRF token; cookie will be set if missing
    const csrf = await getOrCreateCsrfToken();

    // Obtener los talles disponibles desde la base de datos
    const availableSizes = await getAvailableSizes(id);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <BackButton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                <div>
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <Image 
                            src={item.images[0]} 
                            alt={item.alt} 
                            fill 
                            className="object-contain rounded-2xl" 
                            priority
                            quality={100}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                        {item.images.slice(1).map((src: Key | StaticImport | null | undefined) => (
                            <div key={`${src}-${item.id}`}
                                 className="relative aspect-[3/4] rounded-xl overflow-hidden">
                                <Image 
                                    src={src as StaticImport} 
                                    alt={item.alt} 
                                    fill 
                                    className="object-contain rounded-xl"
                                    quality={95}
                                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 200px"
                                />
              </div>
            ))}
          </div>
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
