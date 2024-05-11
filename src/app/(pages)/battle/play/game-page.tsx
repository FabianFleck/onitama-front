"use client";
import { apiClientWithToken } from "@/lib/axios";
import { getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Board from "./board";
import PlayerCards from "./card";

const GamePage = () => {
  // PATH AND ROUTER
  const router = useRouter();
  const searchParams = useSearchParams();
  const battleId = searchParams.get("battleId") ?? "";

  // TABLE AND GAME
  const [tableCard, setTableCard] = useState(null);
  const [errors, setErrors] = useState(null);
  const [board, setBoard] = useState([]);
  const [session, setSession] = useState(null);
  const [game, setGame] = useState(null);

  // YOUR PLAYER
  const [playerColor, setPlayerColor] = useState(null);
  const [yourPlayer, setYourPlayer] = useState(null);
  const [selectCard, setSelectCard] = useState(null);
  const [selectCell, setSelectCell] = useState(null);
  const [yourCards, setYourCards] = useState(null);

  // OPPONENT PLAYER
  const [opponentPlayer, setOpponentPlayer] = useState(null);
  const [opponentCards, setOpponentCards] = useState(null);

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
    if (opponentPlayer) {
      setInitParts(opponentPlayer);
      if (opponentPlayer.card1) {
        setOpponentCards([opponentPlayer.card1, opponentPlayer.card2]);
        setTableCard(game.tableCard);
      }
    }
  }, [opponentPlayer]);

  useEffect(() => {
    if (game) {
      setTableCard(game.tableCard);
    }
  }, [game]);

  const setInitParts = (player) => {
    setBoard((prevBoard) => {
      return prevBoard.map((row) =>
        row.map((cell) => {
          const isPlayerPart = player.parts.some(
            (part) =>
              part.position.line === cell.line &&
              part.position.column === cell.column
          );

          if (isPlayerPart) {
            const part = player.parts.find(
              (part) =>
                part.position.line === cell.line &&
                part.position.column === cell.column
            );

            return {
              ...cell,
              state: part.partTypeEnum,
              color: player.color,
            };
          }
          return cell; // Retorna a célula como está se não for uma parte do jogador
        })
      );
    });
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
    if (!battleId) {
      router.push("/battle");
    }
    const client = apiClientWithToken(session.token);
    try {
      const response = await client.get("/api/battle/" + battleId);
      if (response.data) {
        setGame(response.data);
        const currentPlayer = [
          response.data.player1,
          response.data.player2,
        ].find((p) => p && p.user.username === session.id);
        const opponentPlayer = [
          response.data.player1,
          response.data.player2,
        ].find((p) => p && p !== currentPlayer);
        if (currentPlayer) {
          setPlayerColor(currentPlayer.color);
          setYourPlayer(currentPlayer);
          setBoard(createBoard(currentPlayer.color === "RED"));
        }
        if (opponentPlayer) {
          setOpponentPlayer(opponentPlayer);
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
    let clickedCell = null;
    for (const row of board) {
      for (const cell of row) {
        if (cell.line === line && cell.column === column) {
          clickedCell = cell;
          break;
        }
      }
      if (clickedCell) break;
    }
    if (clickedCell && clickedCell.color === yourPlayer.color && selectCard) {
      console.log("Obtendo movimentos possíveis...");
      getPossibleMoviments(line, column, yourPlayer.id, selectCard);
      setSelectCell({ line, column });
    } else if (clickedCell && clickedCell.highlight) {
      // Verificar se a célula é um movimento possível
      console.log("Realizando movimento...", selectCell.line);
      moviePart(
        selectCell.line,
        selectCell.column,
        line,
        column,
        yourPlayer.id,
        selectCard
      );
    }
  };

  const moviePart = async (
    line,
    column,
    lineNew,
    columnNew,
    playerId,
    cardId
  ) => {
    const client = apiClientWithToken(session.token);
    try {
      const response = await client.post("/api/movement", null, {
        params: {
          line: line,
          column: column,
          lineNew: lineNew,
          columnNew: columnNew,
          playerId: playerId,
          cardId,
        },
      });
      alert("Movimento realizado!");
    } catch (error) {
      alert(error.response.data.errors[0]);
    }
  };

  const getPossibleMoviments = async (line, column, playerId, cardId) => {
    const client = apiClientWithToken(session.token);
    try {
      const response = await client.get("/api/movement/possible", {
        params: {
          line: line,
          column: column,
          playerId: playerId,
          cardId,
        },
      });
      highlightPossibleMoves(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const highlightPossibleMoves = (moves) => {
    const newBoard = board.map((row) =>
      row.map((cell) => ({
        ...cell,
        highlight: moves.some(
          (move) => move.line === cell.line && move.column === cell.column
        ),
      }))
    );
    clearHighlights();
    setBoard(newBoard);
  };

  const handleCardClick = (cardId) => {
    if (
      cardId &&
      (cardId === yourPlayer.card1.id || cardId === yourPlayer.card2.id)
    ) {
      setSelectCard(cardId);
      clearHighlights();
    }
  };

  const clearHighlights = () => {
    const clearedBoard = board.map((row) =>
      row.map((cell) => ({ ...cell, highlight: false }))
    );
    setBoard(clearedBoard);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-10 space-y-4">
        {yourCards && (
          <PlayerCards
            cards={opponentCards}
            playerName={opponentPlayer.user.name}
            onCardClick={handleCardClick}
          />
        )}
        <h1>{errors}</h1>
        <Board board={board} onCellClick={handleCellClick} color={playerColor} />
        {yourCards && (
          <PlayerCards
            cards={yourCards}
            playerName={yourPlayer.user.name}
            onCardClick={handleCardClick}
          />
        )}
      </div>
      <div className="col-span-2 flex items-center">
        {yourCards && (
          <PlayerCards
            cards={[tableCard]}
            playerName="Carta da mesa"
            onCardClick={handleCardClick}
            className="flex-col"
          />
        )}
      </div>
    </div>
  );
};

export default GamePage;
