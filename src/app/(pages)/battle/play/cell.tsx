import React from "react";
import "./play.css"

const Cell = ({ value, onClick }) => {

  return (
    <div className={`cell ${value.color}`} onClick={onClick}>
      {value.state || ""}
    </div>
  );
};

export default Cell;
