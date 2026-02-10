const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const backMenuBtn = document.getElementById("back-menu");

const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");


const HUMAN = "X";
const BOT = "O";

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = HUMAN;
let gameActive = true;

let scoreX = 0;
let scoreO = 0;

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

  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  checkResult();

  if (gameActive) {
    currentPlayer = BOT;
    setTimeout(botMove, 400);
  }
}

function botMove() {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = BOT;
      let score = minimax(board, 0, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = BOT;
  cells[move].textContent = BOT;

  checkResult();
  currentPlayer = HUMAN;
}

function minimax(board, depth, isMaximizing) {
  let result = checkWinner();
  if (result !== null) return result;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = BOT;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = HUMAN;
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  for (let combo of winCombo) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === BOT ? 1 : -1;
    }
  }

  if (!board.includes("")) return 0;
  return null;
}

function checkResult() {
  for (let combo of winCombo) {
    const [a, b, c] = combo;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;

      if (board[a] === HUMAN) {
        scoreX++;
        scoreXEl.textContent = scoreX;
      } else {
        scoreO++;
        scoreOEl.textContent = scoreO;
      }

      autoReset();
      return;
    }
  }

  if (!board.includes("")) {
    gameActive = false;
    autoReset();
  }
}


function autoReset() {
  setTimeout(resetGame, 1200);
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = HUMAN;
  cells.forEach(cell => (cell.textContent = ""));
}


cells.forEach(cell => cell.addEventListener("click", cellClick));
resetButton.addEventListener("click", resetGame);

backMenuBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});
