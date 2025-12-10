import { isAdmin, getOrCreateCsrfToken } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";
import ProductsList from "./ProductList";

async function fetchData() {
  const base = "http://localhost:3000" //process.env.NEXT_PUBLIC_SITE_URL;
  const csrf = await getOrCreateCsrfToken()

  const [products, colors, sizes, types] = await Promise.all([
    fetch(`${base}/api/items/dashboard`, { cache: "no-store", headers: { "x-csrf-token": csrf } }).then(r => r.json()),
    fetch(`${base}/api/colors`, { cache: "no-store", headers: { "x-csrf-token": csrf } }).then(r => r.json()),
    fetch(`${base}/api/sizes`, { cache: "no-store", headers: { "x-csrf-token": csrf } }).then(r => r.json()),
    fetch(`${base}/api/types`, { cache: "no-store", headers: { "x-csrf-token": csrf } }).then(r => r.json()),
  ]);

  return { products, colors, sizes, types };
}

export default async function ProductsPage() {
  if (!await isAdmin()) redirect("/admin/login");
  const csrf = await getOrCreateCsrfToken()

  const data = await fetchData();

  return (
    <ProductsList
      products={data.products}
      colors={data.colors}
      sizes={data.sizes}
      types={data.types}
      csrf={csrf}
    />
  );
}
