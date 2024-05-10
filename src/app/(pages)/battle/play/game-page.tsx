"use client";
import { apiClientWithToken } from "@/lib/axios";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Board from "./board";
import PlayerCards from "./card";

const GamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [board, setBoard] = useState([]);
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);
  const [playerType, setPlayerType] = useState(null);
  const [yourPlayer, setYourPlayer] = useState(null);
  const [yourCards, setYourCards] = useState(null);
  const [tableCard, setTableCard] = useState(null);
  const [errors, setErrors] = useState(null);
  const battleId = searchParams.get("battleId") ?? "";

  useEffect(() => {
    if (yourPlayer) {
      setInitParts(yourPlayer);
      if (yourPlayer.card1) {
        setYourCards([yourPlayer.card1, yourPlayer.card2]);
        setTableCard(game.tableCard);
      }
    }
  }, [yourPlayer]);

  useEffect(() => {
    if (game) {
      setTableCard(game.tableCard);
    }
  }, [game]);

  const setInitParts = (player) => {
    let updatedBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    player.parts.forEach((part) => {
      updatedBoard.forEach((row) => {
        row.forEach((cell) => {
          if (
            cell.line === part.position.line &&
            cell.column === part.position.column
          ) {
            cell.state = part.partTypeEnum;
            cell.color = playerType;
          }
        });
      });
    });
    setBoard(updatedBoard);
  };

  useEffect(() => {
    const loadSession = async () => {
      const sessionData = await getSession();
      if (sessionData) {
        setSession(sessionData);
      } else {
        console.log("No session found, redirecting to login.");
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (session) {
      initGame();
    }
  }, [session]);

  const initGame = async () => {
    const client = apiClientWithToken(session.token);
    if (!battleId) {
      router.push("/battle");
    }
    try {
      const response = await client.get("/api/battle/" + battleId);
      if (response.data) {
        setGame(response.data);
        const currentPlayer = [
          response.data.player1,
          response.data.player2,
        ].find((p) => p && p.user.username === session.id);
        if (currentPlayer) {
          setPlayerType(currentPlayer.color);
          setYourPlayer(currentPlayer);
          setBoard(createBoard(currentPlayer.color === "RED"));
        }
      }
    } catch (error) {
      console.log(error.response.data.errors);
      setErrors(error.response.data.errors);
    }
  };

  const createBoard = (isRed) => {
    return Array.from({ length: 5 }, (_, i) =>
      Array.from({ length: 5 }, (_, j) => ({
        line: isRed ? 5 - i : i + 1,
        column: isRed ? 5 - j : j + 1,
        state: null,
      }))
    );
  };

  const handleCellClick = (line, column) => {
    const updatedBoard = board.map((row) =>
      row.map((cell) =>
        cell.line === line && cell.column === column
          ? { ...cell, state: playerType }
          : cell
      )
    );
    setBoard(updatedBoard);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>{errors}</h1>
      <Board board={board} onCellClick={handleCellClick} />

      {tableCard && (
        <PlayerCards cards={[tableCard]} playerName="Carta da mesa" />
      )}

      {yourCards && (
        <PlayerCards cards={yourCards} playerName={yourPlayer.user.name} />
      )}
    </div>
  );
};

export default GamePage;
