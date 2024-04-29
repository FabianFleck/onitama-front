import { useSession, getSession } from "next-auth/react"
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Checking session for", req.nextUrl.pathname); // Debug aprimorado
  const { data: session, status } = getSession()

  // Verifica se está tentando acessar as páginas de login ou registro sem sessão
  if (!session && !['/auth/login', '/auth/register'].includes(req.nextUrl.pathname)) {
    console.log("No session found, redirecting...");
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  console.log("Session found or not required, continuing...");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
