import { isAdmin, getOrCreateCsrfToken } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";
import OrdersList from "./OrdersList";

async function fetchOrders() {
  const csrf = await getOrCreateCsrfToken()
  const res = await fetch(`${process.env.NEXT_URL_API}/api/rentals`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "x-csrf-token": csrf
    },
  });
  return res.json();
}

export default async function OrdersPage() {
  if (!await isAdmin()) redirect("/admin/login");
  
  const csrf = await getOrCreateCsrfToken()
  const orders = await fetchOrders();

  return (
    <OrdersList orders={orders} csrf={csrf} />
  );

}
