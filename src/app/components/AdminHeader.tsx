// app/components/Header.tsx
import Link from "next/link";

export default function AdminHeader() {
    return (
        <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="font-extrabold text-xl tracking-tight">
                    GlamRent
                </Link>

                <div className="flex flex-row items-center">
                    <Link href="/admin/dashboard/orders" className="">
                        <button className="text-sm rounded-lg border px-3 py-2 mr-4 hover-effect" >Orders</button>
                    </Link>
                    <Link href="/admin/dashboard/products" className="">
                        <button className="text-sm rounded-lg border px-3 py-2 mr-4 hover-effect">Products</button>
                    </Link>
                    <form action="/api/admin/logout" method="POST">
                        <button className="text-sm rounded-lg border px-3 py-2 hover-effect">Sign out</button>
                    </form>

                </div>

            </div>
        </header>
    );
}
