import { isAdmin } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";
import ProductsList from "./ProductList";

async function fetchData() {
  const base = "http://localhost:3000" //process.env.NEXT_PUBLIC_SITE_URL;

  const [products, colors, sizes, types] = await Promise.all([
    fetch(`${base}/api/items/`, { cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/api/colors`, { cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/api/sizes`, { cache: "no-store" }).then(r => r.json()),
    fetch(`${base}/api/types`, { cache: "no-store" }).then(r => r.json()),
  ]);

  return { products, colors, sizes, types };
}

export default async function ProductsPage() {
  if (!isAdmin()) redirect("/admin/login");

  const data = await fetchData();

  console.log("ProductsPage fetched data:", data);
  return (
    <ProductsList
      products={data.products}
      colors={data.colors}
      sizes={data.sizes}
      types={data.types}
    />
  );
}
