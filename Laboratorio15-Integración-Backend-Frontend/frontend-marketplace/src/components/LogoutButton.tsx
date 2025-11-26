"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
    >
      Cerrar Sesión
    </button>
  );
}
