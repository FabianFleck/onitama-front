import React from "react";
import "./play.css";

const Cell = ({ value, onClick, isClickable }) => {
    // Combinar classes com condicionais
    const cellClass = `cell ${value.color} ${value.highlight ? 'highlight' : ''} ${isClickable ? '' : 'non-clickable'}`;
  
    // Função para manipular o clique
    const handleClick = () => {
      if (isClickable) {
        onClick();
      }
    };
  
    return (
      <div className={cellClass} onClick={handleClick}>
        {value.state || ""}
      </div>
    );
  };
  
  export default Cell;