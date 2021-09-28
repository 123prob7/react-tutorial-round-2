import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick} style={props.winSquare ? {color: "red"}: null}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let isWinTrace = this.props.winTrace && this.props.winTrace.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
        winSquare={isWinTrace}
      />
    );
  }

  render() {
    const length = parseInt(this.props.length)
    return (
      <div>
        { // 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
          [...Array(length)].fill(1).map((_, i) => (
            <div key={i} className="board-row">
              {[...Array(length)].fill(1).map((_, j) => this.renderSquare(length*i+j))}
            </div>
          ))
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(Math.floor(9)).fill(null),
          lastPos: null, // used for recording the new change
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      sortType: true, // state for sorting stuffs (true = ascending)
      size: 3, // size of a match
      n: 3, // the amount of X/O to finish the game, autochange when the size mutate
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares, this.state.size, this.state.n);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastPos: i, // record the new move occured
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  sortMoves() {
    this.setState({
      sortType: !this.state.sortType
    })
  }

  handleSize(e) {
    this.setState({
      size: e.target.value,
      history: [{
        squares: Array(Math.floor(e.target.value * e.target.value)).fill(null),
        lastPos: null,
      }],
      n: e.target.value<=5?e.target.value:5,
      stepNumber: 0,
      xIsNext: true,
      sortType: true,
    })
  }

  render() {
    const size = this.state.size;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, size, this.state.n);

    const curStep = this.state.stepNumber;
    const moves = history.map((step, move) => {
      // 1. Display the location for each move in the format (col, row) in the move history list.
      const pos = step.lastPos
      const lengthOfBoard = this.state.size
      const desc = move ? "Go to move (" + (Math.floor(pos/lengthOfBoard)+1) + ", " + (pos%lengthOfBoard+1) + ")" : "Go to game start";
      return (  // 2. Bold the currently selected item in the move list
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={move===curStep?{fontWeight:"bold"}:null}>{desc}</button> 
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
      console.log(winner.line)
    } else if (history.length === (size*size+1) && history.length === this.state.stepNumber+1) { // 6. When no one wins, display a message about the result being a draw
      status = "Draw";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            length={size}
            onClick={(i) => this.handleClick(i)}
            winTrace={winner && winner.line} //In js, true always evaluates 2nd expression. Ex: false && expression => false
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><span>Size </span><input type="number" value={size} onChange={(e) => this.handleSize(e)}></input></div>
          <div>
            <button onClick={() => this.sortMoves()}>Sort {this.state.sortType ? "Ascending":"Descending"}</button>
          </div>
          <ol>{this.state.sortType ? moves: moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, size, len) {
  //change the shape
  const temp = [...squares];
  const newArr = [];
  for (let _ = 0; _ < size; _++) {
    newArr.push(temp.splice(0,size))
  }
  //console.log(newArr)
  // iterate through row -> col to find winning trace
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      // check xlen top straight line, upper right cross, right, lower right cross
      // top
      let line = []
      for (let k = 0; k < len; k++) {
        if (i-k>=0) {
          if (newArr[i][j] && newArr[i][j]===newArr[i-k][j]) {
            line.push(size*(i-k)+j)
            if (k === len-1) return { winner: newArr[i][j], line: line }
            continue
          } else {line=[]; break}
        } else {line=[]; break}
      }
      // upper right cross
      for (let k = 0; k < len; k++) {
        if (i-k>=0 && j+k<size) {
          if (newArr[i][j] && newArr[i][j]===newArr[i-k][j+k]) {
            line.push(size*(i-k)+(j+k))
            if (k === len-1) return { winner: newArr[i][j], line: line }
            continue
          } else {line=[]; break}
        } else {line=[]; break}
      }
      // right
      for (let k = 0; k < len; k++) {
        if (j+k<size) {
          if (newArr[i][j] && newArr[i][j]===newArr[i][j+k]) {
            line.push(size*i+j+k)
            if (k === len-1) return { winner: newArr[i][j], line: line }
            continue
          } else {line=[]; break}
        } else {line=[]; break}
      }
      // lower right cross
      for (let k = 0; k < len; k++) {
        if (i+k<size && j+k<size) {
          if (newArr[i][j] && newArr[i][j]===newArr[i+k][j+k]) {
            line.push(size*(i+k)+(j+k))
            if (k === len-1) return { winner: newArr[i][j], line: line }
            continue
          } else break
        } else break
      }
    }
  }
  return null;
}
