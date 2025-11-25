"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Marketplace
          </Link>
          <div className="flex gap-6 items-center">
            
            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Admin
              </Link>
            )}

            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{session.user.email}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
