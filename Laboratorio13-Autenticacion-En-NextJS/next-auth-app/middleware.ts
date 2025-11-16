// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirigir usuarios autenticados que intentan acceder a rutas de autenticación
    if (token && (pathname === "/" || pathname.startsWith("/sign"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Redirigir usuarios no autenticados que intentan acceder a rutas protegidas
    if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/profile"))) {
      return NextResponse.redirect(new URL("/signIn", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Rutas públicas que no requieren autenticación
        const publicPaths = ["/", "/signIn", "/signup", "/api/auth"];
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }
        // Rutas protegidas
        return !!token;
      },
    },
    pages: {
      signIn: "/signIn",
    },
  }
);

export const config = { 
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*", 
    "/profile",
    "/profile/:path*", 
    "/signIn",
    "/signIn/:path*",
    "/signup",
    "/signup/:path*",
  ] 
};