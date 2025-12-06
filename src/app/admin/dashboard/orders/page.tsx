import { isAdmin } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";
import OrdersList from "./OrdersList";

async function fetchOrders() {
  const res = await fetch(`${process.env.NEXT_URL_API}/api/admin/orders`, {
    cache: "no-store"
  });
  return res.json();
}

export default async function OrdersPage() {
  if (!isAdmin()) redirect("/admin/login");

  const orders = await fetchOrders();

return (
  <div>
    <h1
      style={{
        width: "100%",
        fontSize: "40px",
        textAlign: "center",
        marginBottom: "20px",
      }}
    >
      Ordenes
    </h1>

    <OrdersList orders={orders} />
  </div>
);

}
