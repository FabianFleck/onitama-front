import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/auth/login");
  }
  return (
    <div>
      <h1>Bem vindo {session.token}</h1>
    </div>
  );
}
