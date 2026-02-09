const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function cellClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || board[index] !== "") {
    return;
  }

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  checkResult();
}

function checkResult() {
  for (let combo of winCombo) {
    const [a, b, c] = combo;

    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      gameActive = false;
      setTimeout(() => alert(`${board[a]} wins!`), 100);
      return;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    setTimeout(() => alert("It's a draw!"), 100);
    return;
  }


  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => cell.addEventListener("click", cellClick));
resetButton.addEventListener("click", resetGame);
