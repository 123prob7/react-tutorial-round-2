import { React, useState } from "react";
import { Board } from "./Board";

export function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(Math.floor(9)).fill(null),
      lastPos: null, // used for recording the new change
    },
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setxIsNext] = useState(true); //'X', 'O'
  const [sortType, setSortType] = useState(true); //sort moves, true = ascending
  const [size, setSize] = useState(3); //size of a match
  const [winningQuantity, setWinningQuantity] = useState(3); //the amount of X/O needed to finish the game, autochanging when the size mutates

  function handleClick(i) {
    const currentHistory = history.slice(0, stepNumber + 1);
    const current = currentHistory[currentHistory.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares, size, winningQuantity);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? "X" : "O";
    const newHistory = currentHistory.concat([
      {
        squares: squares,
        lastPos: i,
      },
    ]);
    setHistory(newHistory);
    setStepNumber(currentHistory.length);
    setxIsNext(!xIsNext);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setxIsNext(step % 2 === 0);
  }

  function sortMoves() {
    setSortType(!sortType);
  }

  function handleSize(e) {
    setSize(e.target.value);
    setHistory([
      {
        squares: Array(Math.floor(e.target.value * e.target.value)).fill(null),
        lastPos: null,
      },
    ]);
    setWinningQuantity(e.target.value <= 5 ? e.target.value : 5);
    setStepNumber(0);
    setxIsNext(true);
    setSortType(true);
  }

  const current = history[stepNumber];
  //console.log(current, history, stepNumber)
  const winner = calculateWinner(current.squares, size, winningQuantity);
  const moves = history.map((step, move) => {
    // 1. Display the location for each move in the format (col, row) in the move history list.
    const pos = step.lastPos;
    const desc = move
      ? "Go to move (" + (Math.floor(pos / size) + 1) + ", " + ((pos % size) + 1) + ")"
      : "Go to game start";
    return (
      // 2. Bold the currently selected item in the move list
      <li key={move}>
        <button onClick={() => jumpTo(move)} style={move === stepNumber ? { fontWeight: "bold" } : null}>
          {desc}
        </button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
    //console.log(winner.line);
  } else if (history.length === size * size + 1 && history.length === stepNumber + 1) {
    // 6. When no one wins, display a message about the result being a draw
    status = "Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          length={parseInt(size)}
          onClick={(i) => handleClick(i)}
          winTrace={winner && winner.line} //In js, true always evaluates 2nd expression. Ex: false && expression => false
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <span>Size </span>
          <input type="number" value={size} onChange={(e) => handleSize(e)}></input>
        </div>
        <div>
          <button onClick={() => sortMoves()}>Sort {sortType ? "Ascending" : "Descending"}</button>
        </div>
        <ol>{sortType ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares, size, len) {
  //change the shape
  const temp = [...squares];
  const newArr = [];
  for (let _ = 0; _ < size; _++) {
    newArr.push(temp.splice(0, size));
  }
  //console.log(newArr)
  // iterate through row -> col to find winning trace
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // check xlen top straight line, upper right cross, right, lower right cross
      // top
      let line = [];
      for (let k = 0; k < len; k++) {
        if (i - k >= 0) {
          if (newArr[i][j] && newArr[i][j] === newArr[i - k][j]) {
            line.push(size * (i - k) + j);
            if (k === len - 1) return { winner: newArr[i][j], line: line };
            continue;
          } else {
            line = [];
            break;
          }
        } else {
          line = [];
          break;
        }
      }
      // upper right cross
      for (let k = 0; k < len; k++) {
        if (i - k >= 0 && j + k < size) {
          if (newArr[i][j] && newArr[i][j] === newArr[i - k][j + k]) {
            line.push(size * (i - k) + (j + k));
            if (k === len - 1) return { winner: newArr[i][j], line: line };
            continue;
          } else {
            line = [];
            break;
          }
        } else {
          line = [];
          break;
        }
      }
      // right
      for (let k = 0; k < len; k++) {
        if (j + k < size) {
          if (newArr[i][j] && newArr[i][j] === newArr[i][j + k]) {
            line.push(size * i + j + k);
            if (k === len - 1) return { winner: newArr[i][j], line: line };
            continue;
          } else {
            line = [];
            break;
          }
        } else {
          line = [];
          break;
        }
      }
      // lower right cross
      for (let k = 0; k < len; k++) {
        if (i + k < size && j + k < size) {
          if (newArr[i][j] && newArr[i][j] === newArr[i + k][j + k]) {
            line.push(size * (i + k) + (j + k));
            if (k === len - 1) return { winner: newArr[i][j], line: line };
            continue;
          } else break;
        } else break;
      }
    }
  }
  return null;
}
