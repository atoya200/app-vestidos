import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";


export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fijo arriba */}
      <AdminHeader />

      {/* Contenido centrado */}
        <main className="flex flex-col items-center justify-center flex-1 px-4 py-16">
        {children}
      </main>

      <Footer />

    </div>
  );
}


