import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogoutButton } from "./LogoutButton";
import { AdminNavTabs } from "./AdminNavTabs";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              {isAdmin ? (
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              ) : (
                <Link href="/" className="text-xl font-bold text-gray-900">
                  Marketplace
                </Link>
              )}
            </div>
            
            {isAdmin && <AdminNavTabs />}
          </div>
          
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center gap-4">
                {/* Show Catálogo link only for non-admin users */}
                {!isAdmin && (
                  <Link
                    href="/products"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    Catálogo
                  </Link>
                )}
                
                <LogoutButton />
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm"
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
}
