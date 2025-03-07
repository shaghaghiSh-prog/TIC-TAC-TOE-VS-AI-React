import React, { useCallback } from 'react';
import './gameinfo.css';

const GameInfo = ({ status, difficulty, setDifficulty, resetGame, startGame, gameStarted }) => {
  const handleDifficultyChange = useCallback((e) => {
    setDifficulty(e.target.value);
  }, [setDifficulty]);

  const handleStartGame = useCallback(() => {
    if (difficulty) {
      startGame(difficulty);
    }
  }, [difficulty, startGame]);

  return (
    <div className="gameInfo">
      <div className="status">{status}</div>
      {!gameStarted ? (
        <div className="difficultySelector">
          <label htmlFor="difficulty">Select Difficulty: </label>
          <select
            id="difficulty"
            value={difficulty || ''}
            onChange={handleDifficultyChange}
            className="select"
          >
            <option value="" disabled>Choose a level</option>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
          <button 
            className="startButton" 
            onClick={handleStartGame}
            disabled={!difficulty}
          >
            Start Game
          </button>
        </div>
      ) : (
        <button className="resetButton" onClick={resetGame}>
          Reset Game
        </button>
      )}
    </div>
  );
};

export default React.memo(GameInfo);

