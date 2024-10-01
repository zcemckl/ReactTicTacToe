import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={isWinner ? { backgroundColor: "green" } : {}}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    console.log(nextSquares);
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner != null) {
    status = "Winner: " + (xIsNext ? "O" : "X");
  } else if (squares.every((square) => square != null)) {
    status = "No winner";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const rows = Array(3).fill(null);
  for (var m = 0; m < 3; m++) {
    const squareArray = Array(3).fill(null);
    for (var j = 0; j < 3; j++) {
      const k = m * 3 + j;
      squareArray[j] = (
        <Square
          key={k}
          value={squares[k]}
          onSquareClick={() => handleClick(k)}
          isWinner={winner != null && winner.includes(k) ? true : false}
        />
      );
    }
    rows[m] = (
      <div key={m} className="board-row">
        {squareArray}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSorted, setIsSort] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleClick() {
    setIsSort(!isSorted);
  }

  var moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const previousSquares = history[move - 1];
      var previousMove = null;
      var previousPlayer = null;
      for (var i = 0; i < 9; i++) {
        if (squares[i] != previousSquares[i]) {
          previousMove = i;
          previousPlayer = squares[i];
          break;
        }
      }

      description =
        "Go to move #" +
        move +
        " (" +
        Math.floor(previousMove / 3) +
        "," +
        (previousMove % 3) +
        ")" +
        previousPlayer;
    } else {
      description = "Go to game start";
    }

    const len = history.length - 1;
    return move == len ? (
      <li key={move}>
        <div>{description}</div>
      </li>
    ) : (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  moves = isSorted ? moves : moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <div className="move-order">
          <button onClick={handleClick}>{isSorted ? "↑" : "↓"}</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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
      return lines[i];
    }
  }
  return null;
}
