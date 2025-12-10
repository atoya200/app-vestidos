"use client";

import { usePathname } from "next/navigation";
import HomeHeader from "@/src/app/components/Headers/HomeHeader";
import SearchHeader from "@/src/app/components/Headers/ProductsHeader";
import AdminHeader from "@/src/app/components/AdminHeader";
import SimpleHeader from "@/src/app/components/Headers/SimpleHeader";
import Footer from "@/src/app/components/Footer";
import path from "path";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {


    const adminPathsFullHeader = ["/admin/dashboard/orders", "/admin/dashboard/products", "/admin/products", "/admin/orders"];
    const withSemiHomeHeader = ["/search", "/items", "/faq", "/contact", "/terms", "/privacy"];


    const pathname = usePathname();

    function getHeader() {
        if (pathname === "/") return <HomeHeader />;
        if (adminPathsFullHeader.includes(pathname)) return <AdminHeader />;
        if (withSemiHomeHeader.includes(pathname)) return <SearchHeader />;
        if (pathname == '/admin/login') return <SimpleHeader />;
        if(pathname.startsWith('/items/')) return <SearchHeader />;
        return null;
    }


    function getFooter() {
        if (pathname === "/") return <Footer />;
        if (adminPathsFullHeader.includes(pathname)) return <Footer />;
        if (withSemiHomeHeader.includes(pathname)) return <Footer />;
        if (pathname == '/admin/login') return <Footer />;
        if(pathname.startsWith('/items/')) return <Footer />;


        return null;
    }


    return (
        <>
            {getHeader()}
            {children}
            {getFooter()}
        </>
    );
}
