import { isAdmin, getOrCreateCsrfToken } from "@/lib/CsrfSessionManagement";
import { redirect } from "next/navigation";
import BackButton from "../components/BackButton";


export default async function Page() {
  if (!await isAdmin()) {
    redirect("/admin/login")
} else {
    redirect("/admin/dashboard")
};
}
