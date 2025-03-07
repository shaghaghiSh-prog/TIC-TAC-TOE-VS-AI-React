import React from 'react';
import './square.css';

const Square = ({ value, onClick, isWinner }) => {
  return (
    <button
      className={`square ${isWinner ? 'winner' : ''}`}
      onClick={onClick}
      data-value={value}
    >
      {value}
    </button>
  );
};

export default Square;

