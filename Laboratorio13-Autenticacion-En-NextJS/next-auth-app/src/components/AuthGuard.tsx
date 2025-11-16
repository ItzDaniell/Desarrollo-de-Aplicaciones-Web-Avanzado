"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const lower = pathname.toLowerCase();
  const isAuthRoute = lower === "/" || lower === "/signin" || lower === "/signup" || lower.startsWith("/sign");
  const isProtectedRoute = lower.startsWith("/dashboard") || lower.startsWith("/profile");

  useEffect(() => {
    if (status === "authenticated" && isAuthRoute) {
      router.replace("/dashboard");
    } else if (status === "unauthenticated" && isProtectedRoute) {
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/signIn?callbackUrl=${callbackUrl}`);
    }
  }, [status, isAuthRoute, isProtectedRoute, pathname, router]);

  // Evitar parpadeo mientras resolvemos el estado de sesión
  if (status === "loading") return null;

  return <>{children}</>;
}
