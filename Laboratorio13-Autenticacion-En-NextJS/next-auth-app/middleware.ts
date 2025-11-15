import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (token && (pathname === "/" || pathname.startsWith("/signIn"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/signIn",
    },
  }
);

export const config = { matcher: ["/", "/dashboard", "/profile", "/signIn"] };