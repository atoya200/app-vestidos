import { isAdmin, getOrCreateCsrfToken } from "@/lib/CsrfSessionManagement";
import { listItems, listRentals } from "@/lib/RentalManagementSystem";
import { redirect } from "next/navigation";
import BackButton from "../components/BackButton";


export default async function Page() {
  if (!isAdmin()) {
    redirect("/admin/login")
} else {
    redirect("/admin/dashboard")
};
}
