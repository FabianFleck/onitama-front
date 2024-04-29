import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NextAuthSessionProvider from "./providers/sessionProvider";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Onitama",
  description: "Onitama app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-500 text-black`}>
        {children}
      </body>
    </html>
  );
}
