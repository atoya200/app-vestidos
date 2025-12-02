// app/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} GlamRent. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm">
          <Link href="/terms" className="hover:text-fuchsia-600">Terms</Link>
          <Link href="/privacy" className="hover:text-fuchsia-600">Privacy</Link>
          <Link href="/contact" className="hover:text-fuchsia-600">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
