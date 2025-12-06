'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label = 'Volver' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={href || '#'}
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      {label}
    </Link>
  );
}
