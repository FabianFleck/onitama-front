import React from "react";
import { Card } from "@/components/ui/card";

const PlayerCards = ({ cards, playerName }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
      <h3>{playerName}</h3>
      {cards.map((card, index) => (
        <Card key={index} className="card-style">
          {/* Implementação da exibição de card */}
          {card.name}
        </Card>
      ))}
    </div>
  );
};

export default PlayerCards;
