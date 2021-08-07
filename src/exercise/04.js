// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react';
import {useLocalStorageState} from '../utils';

const Board = ({onClick, squares}) => {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

const Moves = ({history, currentStep, toggleHistory}) => (
  <ol>
    {history.map((gameState, step) => {
      const START = 'Go to game start';
      const MOVE = `Go to move #${step}`;
      const text = step === 0 ? `${START}` : `${MOVE}`;
      const isCurrent = step === currentStep;

      return (
        <li key={step}>
          <button disabled={isCurrent} onClick={() => toggleHistory(step)}>
            {text} {isCurrent ? ' (current)' : undefined}
          </button>
        </li>
      );
    })}
  </ol>
);

const Game = () => {
  const [history, setHistory] = useLocalStorageState('history', [
    Array(9).fill(null),
  ]);
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0);

  const currentSquares = history[currentStep];
  // Derived state
  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    // If a box is clicked, when browsing through history we also want to 
    // make a quick return: history.length - currentStep > 1
    if (winner || currentSquares[square] || history.length - currentStep > 1) {
      return;
    }

    const sqauresCopy = [...currentSquares];
    sqauresCopy[square] = nextValue;

    // Kent Solution
    // const newHistory = history.slice(0, currentStep + 1);
    // setHistory([...newHistory, sqauresCopy]);
    // setCurrentStep(newHistory.length);

    // How I solved it.
    setHistory(prevSquares => [...prevSquares, sqauresCopy]);
    setCurrentStep(sqauresCopy.filter(Boolean).length);
    // What is positive/negative with the different solutions?
  }

  function restart() {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
  }

  function toggleHistory(index) {
    setCurrentStep(index);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          toggleHistory={toggleHistory}
          history={history}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
