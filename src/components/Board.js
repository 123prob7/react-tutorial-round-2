import { Square } from "./Square";
/**
 *
 * @param {squares} Array[] current squares of the game
 * @param {length} int size of rows
 * @param {onClick} func callback
 * @param {winTrace} Array[] store the index of winning squares
 * @returns
 */
export function Board({ squares, length, onClick, winTrace }) {
  function renderSquare(i, winTrace, square, onClick) {
    let isWinTrace = winTrace && winTrace.includes(i) ? true : false;
    return <Square value={square} onClick={() => onClick(i)} key={i} winSquare={isWinTrace} />;
  }

  return (
    <div>
      {
        // 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
        [...Array(length)].fill(1).map((_, i) => (
          <div key={i} className="board-row">
            {[...Array(length)]
              .fill(1)
              .map((_, j) => renderSquare(length * i + j, winTrace, squares[length * i + j], onClick))}
          </div>
        ))
      }
    </div>
  );
}
