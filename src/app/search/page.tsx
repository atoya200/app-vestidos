import Link from "next/link";
import Image from "next/image";
import {listItems, type Category} from "../../../lib/RentalManagementSystem";
import BackButton from "../components/BackButton";
import {getColors} from "../../../lib/dao/colorDao";

type SearchParams = {
  q?: string; 
  category?: Category | "";
  size?: string;
  color?: string;
  style?: string;
  start?: string;
  end?: string;
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { q = "", category = "", size = "", color = "", style = "" } = params;
  const items = await listItems({
    q,
    category: category || undefined,
    size: size || undefined,
    color: color || undefined,
    style: style || undefined,
  });
  const colors = await getColors();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <BackButton href="/" />
      <h1 className="text-2xl sm:text-3xl font-bold mt-4">Browse catalog</h1>
      <form method="GET" className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <input name="q" defaultValue={q} placeholder="Search…" className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-400" />
        <select name="category" defaultValue={category} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <option value="" className="dark:bg-slate-800 dark:text-white">All categories</option>
          <option value="dress" className="dark:bg-slate-800 dark:text-white">Dresses</option>
          <option value="shoes" className="dark:bg-slate-800 dark:text-white">Shoes</option>
          <option value="bag" className="dark:bg-slate-800 dark:text-white">Bags</option>
          <option value="jacket" className="dark:bg-slate-800 dark:text-white">Jackets</option>
        </select>
        <input name="size" defaultValue={size} placeholder="Size" className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-400" />
        <select name="color" defaultValue={color} className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700">
          <option value="" className="dark:bg-slate-800 dark:text-white">All colors</option>
          {colors.map((col) => (
            <option key={col.id} value={col.color_name} className="dark:bg-slate-800 dark:text-white">{col.color_name}</option>
          ))}
        </select>
        <input name="style" defaultValue={style} placeholder="Style (e.g., cocktail)" className="rounded-xl border px-3 py-2 text-sm dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:placeholder:text-slate-400" />
        <button className="rounded-xl bg-fuchsia-600 text-white px-4 py-2 text-sm">Search</button>
      </form>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <Link key={it.id} href={`/items/${it.id}`} className="rounded-2xl border bg-white dark:bg-slate-900 overflow-hidden block hover:shadow-md transition-shadow">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              <Image 
                src={it.images[0]} 
                alt={it.alt} 
                fill 
                className="object-contain rounded-lg"
                quality={95}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="rounded-full bg-white/85 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-100">
                  From ${it.pricePerDay}/day
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{it.category}</p>
              <p className="font-medium">{it.name}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Sizes: {it.sizes.join(", ")}</p>
              <div className="mt-3">
                <span className="text-sm rounded-lg border px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 inline-block">
                  View details
                </span>
              </div>
            </div>
          </Link>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400">No items match your filters.</p>
        )}
      </div>
    </div>
  );
}
