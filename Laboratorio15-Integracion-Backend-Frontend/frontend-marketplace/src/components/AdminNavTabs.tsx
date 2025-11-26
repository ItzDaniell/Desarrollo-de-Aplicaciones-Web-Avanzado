"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavTabs() {
  const pathname = usePathname();
  
  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      <Link
        href="/admin"
        className={`${
          pathname === '/admin'
            ? 'border-blue-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
      >
        Productos
      </Link>
      <Link
        href="/admin/categories"
        className={`${
          pathname === '/admin/categories'
            ? 'border-blue-500 text-gray-900'
            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
        } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
      >
        Categorías
      </Link>
    </div>
  );
}
