import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import BattleList from "./battle-list";

export default async function HomePage() {
  const session = await getServerSession(nextAuthOptions);

  return (
    <div>
      <BattleList />
    </div>
  );
}
