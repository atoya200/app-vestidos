import { isAdmin } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";


export default async function Page() {
  if (!await isAdmin()) redirect("/admin/login");
  redirect("/admin/dashboard/products");
  
}
