
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");
const backMenuBtn = document.getElementById("back-menu");

const scoreXEl = document.getElementById("score-x");
const scoreOEl = document.getElementById("score-o");

const gameMode = localStorage.getItem("gameMode") || "pvp"; 
const PLAYER_X = "X";
const PLAYER_O = "O"; // Bot uses O in PVB

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = PLAYER_X;
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
  if (!gameActive) return;

  if (gameMode === "pvb") {
    currentPlayer = PLAYER_O;
    setTimeout(botMove, 400);
  } else {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
  }
}

function botMove() {
  if (!gameActive || gameMode !== "pvb") return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = PLAYER_O;
      let score = minimax(board, false);
      board[i] = "";

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  board[move] = PLAYER_O;
  cells[move].textContent = PLAYER_O;

  checkResult();
  currentPlayer = PLAYER_X;
}


function minimax(board, isMaximizing) {
  let result = checkWinner();
  if (result !== null) return result;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = PLAYER_O;
        let score = minimax(board, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = PLAYER_X;
        let score = minimax(board, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  for (let [a, b, c] of winCombo) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] === PLAYER_O ? 1 : -1;
    }
  }
  return board.includes("") ? null : 0;
}

function checkResult() {
  for (let [a, b, c] of winCombo) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameActive = false;

      if (board[a] === PLAYER_X) {
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
  currentPlayer = PLAYER_X;
  gameActive = true;
  cells.forEach(cell => (cell.textContent = ""));
}
  
cells.forEach(cell => cell.addEventListener("click", cellClick));
resetButton.addEventListener("click", resetGame);

backMenuBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});
