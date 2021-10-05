export function Square({ onClick, winSquare, value }) {
  return (
    <button className="square" onClick={onClick} style={winSquare ? { color: "red" } : null}>
      {value}
    </button>
  );
}
