import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { nextAuthOptions } from "./app/api/auth/[...nextauth]/route";
import NextAuth from "next-auth/next";

const { auth: middleware } = NextAuth(nextAuthOptions);

// This function can be marked async if using await inside
export default middleware((req) => {
  const { nextUrl } = req;
  console.log(req);
});

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
