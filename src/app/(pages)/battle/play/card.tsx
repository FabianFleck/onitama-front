import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@mui/material";
import { cn } from "@/lib/utils";

const PlayerCards = ({ cards, playerName, onCardClick, className = ""}) => {
  return (
    <div className={cn('flex justify-center gap-[20px] mt-3 text-center', className)}>
      <h3>{playerName}</h3>
      {cards.map((card, index) => (
        <Card key={index} className="card-style">
          <Button onClick={() => onCardClick(card.id)}>{card.name}</Button>
        </Card>
      ))}
    </div>
  );
};

export default PlayerCards;
