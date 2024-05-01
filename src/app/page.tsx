import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronDown, Slash } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";

export default async function HomePage() {
  return (
    <div>
      <h1>Bem vindo ao ONITAMA</h1>
    </div>
  );
}
