import React from 'react';
import Square from './Square';
import './board.css';

const Board = ({ board, onClick, winningLine }) => {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          onClick={() => onClick(index)}
          isWinner={winningLine && winningLine.includes(index)}
        />
      ))}
    </div>
  );
};

export default Board;

