import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";

const PlayerCards = ({
  cards,
  playerName,
  onCardClick,
  className = "",
  currentPlayer = false,
}) => {
  return (
    <div
      className={cn(
        "flex justify-center gap-[20px] mt-3 text-center items-center",
        className
      )}
    >
      <h3 className="text-center">{playerName}</h3>
      {cards.map((card, index) => (
        <Card key={index} className="card-style">
          <Button onClick={() => onCardClick(card.id)}>{card.name}</Button>
        </Card>
      ))}
      {currentPlayer && <h3 style={{fontSize: '2rem', color: 'green'}}>SEU TURNO</h3>}
    </div>
  );
};

export default PlayerCards;
