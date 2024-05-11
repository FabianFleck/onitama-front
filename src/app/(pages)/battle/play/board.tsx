import React from "react";
import Cell from "./cell";
import "./play.css"

const Board = ({ board, onCellClick, color}) => {
  return (
    <div className="body">
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <Cell
              key={`${rowIndex}-${cellIndex}`}
              value={cell}
              onClick={() => onCellClick(cell.line, cell.column)}
              isClickable={cell.color === color && cell.state || cell.highlight}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;