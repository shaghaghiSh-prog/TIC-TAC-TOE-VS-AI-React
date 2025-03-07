import React, { useState, useCallback } from 'react';
import Board from './Board';
import GameInfo from './GameInfo';
import './Wrapper.css';

const Wrapper = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [winningLine, setWinningLine] = useState(null);

  // Check for a winner and return the winning line
  const checkWinner = useCallback((currentBoard) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return lines[i]; // Return winning line
      }
    }
    return null; // No winner
  }, []);

  // Handle player click
  const handleClick = useCallback((index) => {
    if (!gameStarted || board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const winningLine = checkWinner(newBoard);
    if (winningLine) {
      setWinningLine(winningLine);
      setGameOver(true);
    } else if (newBoard.every(Boolean)) {
      setGameOver(true); // Draw
    } else {
      setTimeout(() => makeAIMove(newBoard), 500);
    }
  }, [board, checkWinner, gameOver, gameStarted]);

  // Make AI move based on difficulty
  const makeAIMove = useCallback((currentBoard) => {
    let bestMove;

    switch (difficulty) {
      case 'easy':
        bestMove = getEasyMove(currentBoard);
        break;
      case 'normal':
        bestMove = getNormalMove(currentBoard);
        break;
      case 'hard':
        bestMove = getHardMove(currentBoard);
        break;
      default:
        bestMove = getEasyMove(currentBoard);
    }

    const newBoard = [...currentBoard];
    newBoard[bestMove] = 'O';
    setBoard(newBoard);
    setIsXNext(true);

    const winningLine = checkWinner(newBoard);
    if (winningLine) {
      setWinningLine(winningLine);
      setGameOver(true);
    } else if (newBoard.every(Boolean)) {
      setGameOver(true); // Draw
    }
  }, [difficulty, checkWinner]);

  // Get easy AI move
  const getEasyMove = (board) => {
    const emptyCells = board.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  // Get normal AI move
  const getNormalMove = (board) => {
    if (Math.random() < 0.7) {
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'O';
          if (checkWinner(newBoard)) {
            return i; // Block winning move
          }
        }
      }

      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'X';
          if (checkWinner(newBoard)) {
            return i; // Block player winning move
          }
        }
      }

      return getEasyMove(board); // Fallback to easy move
    } else {
      return getEasyMove(board); // Randomly fallback
    }
  };

  // Get hard AI move
  const getHardMove = (board) => {
    if (board.filter(cell => cell === null).length === 9) {
      return 4; // Center move
    }

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'O';
        if (checkWinner(newBoard)) {
          return i; // Winning move
        }
      }
    }

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        const newBoard = [...board];
        newBoard[i] = 'X';
        if (checkWinner(newBoard)) {
          return i; // Block player winning move
        }
      }
    }

    return minimax(board, 7, false).index; // Use minimax
  };

  // Minimax algorithm for AI decision making
  const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
    const winner = checkWinner(board);
    if (winner) return { score: winner === 'X' ? depth - 10 : 10 - depth };
    if (board.every(Boolean)) return { score: 0 }; // Draw
    if (depth === 0) return { score: 0 };

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'O';
          const score = minimax(newBoard, depth - 1, false, alpha, beta).score;
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
      }
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove;
      for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
          const newBoard = [...board];
          newBoard[i] = 'X';
          const score = minimax(newBoard, depth - 1, true, alpha, beta).score;
          if (score < bestScore) {
            bestScore = score;
            bestMove = i;
          }
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
      }
      return { score: bestScore, index: bestMove };
    }
  };

  // Reset the game state
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setGameStarted(false);
    setDifficulty(null);
    setWinningLine(null);
  }, []);

  // Start a new game with selected difficulty
  const startGame = useCallback((selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
  }, []);

  // Determine the game status
  const winner = checkWinner(board);
  const status = winner
    ? `Winner: ${!isXNext ? 'X' : 'O' }`
    : board.every(Boolean)
    ? 'Draw!'
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  return (
    <div className="app">
      <h1 className="title">Tic Tac Toe vs AI</h1>
      {difficulty && <h2 className="levelDisplay">Level: {difficulty}</h2>}
      <Board board={board} onClick={handleClick} winningLine={winningLine} />
      <GameInfo
        status={status}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
        startGame={startGame}
        gameStarted={gameStarted}
      />
    </div>
  );
};

export default Wrapper;
