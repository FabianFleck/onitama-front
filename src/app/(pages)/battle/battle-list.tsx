"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClientWithToken } from "@/lib/axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const serverBaseURL = "http://localhost:8088";

interface Battle {
  id: string;
  playerOne: string;
  playerTwo: string;
  result: string;
}

export default function BattleList() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [session, setSession] = useState(null);
  const router = useRouter();

  const initBattles = async (token) => {
    console.log(token);
    const client = apiClientWithToken(token);
    const response = await client.get<Battle[]>("/api/battle");
    setBattles(response.data);
  };

  const fetchData = useCallback(async (token) => {
    await fetchEventSource(`${serverBaseURL}/api/battle/stream-battles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onopen(response) {
        if (
          !response.ok &&
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          // handle client errors
          throw new Error("Client error: " + response.status);
        }
      },
      onmessage(event) {
        const newBattle = JSON.parse(event.data);
        setBattles((currentBattles) => {
          const index = currentBattles.findIndex((b) => b.id === newBattle.id);
          if (index > -1) {
            const updatedBattles = [...currentBattles];
            updatedBattles[index] = newBattle;
            return updatedBattles;
          } else {
            return [...currentBattles, newBattle];
          }
        });
      },
      onerror(err) {
        console.error("EventSource error:", err);
      },
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      const session = await getSession();
      if (session) {
        setSession(session);
        initBattles(session.token);
        fetchData(session.token);
      }
    };
    init();
  }, [fetchData]);

  function handleBattlePlaying(battleId: string) {
    router.push("/battle/play?battleId=" + battleId);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Suas batalhas</h1>
        </div>
        <div className="mt-4 overflow-auto rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead className="font-medium text-center">
                  Jogador 1
                </TableHead>
                <TableHead className="font-medium text-center">
                  Jogador 2
                </TableHead>
                <TableHead className="font-medium text-center">
                  Status
                </TableHead>
                <TableHead className="font-medium text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {battles.map((battle) => {
                const status = getStatus(battle, session.id);
                return (
                  <TableRow key={battle.id}>
                    <TableCell
                      onClick={() => handleBattlePlaying(battle.id)}
                      className="font-medium"
                    >
                      {battle.id}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {battle.playerOne}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {battle.playerTwo}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <Badge className={status.className} variant="outline">
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <Button onClick={() => handleBattlePlaying(battle.id)} size="icon" variant="ghost">
                        <EyeIcon className="h-4 w-4" />
                        <span className="sr-only">View battle</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}

function getStatus(battle, sessionId) {
  if (battle.result === "OPEN") {
    return {
      label: "ABERTO",
      className:
        "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    };
  } else if (
    (battle.result === "RED" && battle.playerOne === sessionId) ||
    (battle.result === "BLUE" && battle.playerTwo === sessionId)
  ) {
    return {
      label: "VITÓRIA",
      className:
        "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    };
  } else {
    return {
      label: "DERROTA",
      className: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    };
  }
}

function EyeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
