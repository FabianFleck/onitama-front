import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onitama",
  description: "Onitama app",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[url('/subtle-pattern.svg')] bg-cover bg-center bg-no-repeat px-4 md:px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}