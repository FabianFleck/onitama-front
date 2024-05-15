import React from "react";
import "./play.css";

const Cell = ({ value, onClick, isClickable, isInverted = false }) => {
  // Combinar classes com condicionais
  const cellClass = `cell ${
    value.highlight ? "highlight" : ""
  } ${isClickable ? "" : "non-clickable"}`;

  // Função para manipular o clique
  const handleClick = () => {
    if (isClickable) {
      onClick();
    }
  };

  const getSrc = () => {
    if (value) {
      const direction = isInverted ? "front" : "back";
      return `part.${value.state}.${value.color}.${direction}.png`;
    }
    return "";
  };

  const src = getSrc();

  return (
    <div className={cellClass} onClick={handleClick}>
      {value.state && (
        <img
          src={`/images/parts/${src}`}
          alt={`${value.color} ${value.state}`}
        />
      )}
    </div>
  );
};

export default Cell;