import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation';
import { nextAuthOptions } from "../api/auth/[...nextauth]/route";
import dynamic from "next/dynamic";

const DynamicHeader = dynamic(() => import('./dynamic-header'), { ssr: false });

export default async function PagesLayout({ children }) {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div>
      <DynamicHeader session={session}/>
      {children}
    </div>
  );
}