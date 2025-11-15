"use client";

import { signOut } from "next-auth/react";

const LogoutButton = () => {
  return (
    <button
      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
      onClick={() => signOut({ callbackUrl: "/signIn" })}
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
