import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@mui/material";

const PlayerCards = ({ cards, playerName, onCardClick }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      <h3>{playerName}</h3>
      {cards.map((card, index) => (
        <Card key={index} className="card-style">
          {/* Implementação da exibição de card */}
          <Button onClick={() => onCardClick(card.id)}>{card.name}</Button>
        </Card>
      ))}
    </div>
  );
};

export default PlayerCards;
