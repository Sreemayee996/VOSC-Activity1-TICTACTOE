const cells = [...document.querySelectorAll('.cell')];
const status = document.querySelector('#status');
const scoreDisplays = {
  X: document.querySelector('#x-score'),
  O: document.querySelector('#o-score'),
  draw: document.querySelector('#draw-score')
};

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board;
let currentPlayer;
let gameActive;
let scores = { X: 0, O: 0, draw: 0 };

function startRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  status.textContent = "X's turn";
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
    cell.setAttribute('aria-label', `Empty square ${Number(cell.dataset.index) + 1}`);
  });
}

function getWinningLine() {
  return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function endRound(winner, line) {
  gameActive = false;
  cells.forEach((cell) => { cell.disabled = true; });

  if (winner) {
    scores[winner]++;
    scoreDisplays[winner].textContent = scores[winner];
    status.textContent = `${winner} wins this round!`;
    line.forEach((index) => cells[index].classList.add('winner'));
  } else {
    scores.draw++;
    scoreDisplays.draw.textContent = scores.draw;
    status.textContent = "It's a draw!";
  }
}

function playMove(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;
  cell.setAttribute('aria-label', `${currentPlayer} in square ${index + 1}`);

  const line = getWinningLine();
  if (line) return endRound(currentPlayer, line);
  if (board.every(Boolean)) return endRound();

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `${currentPlayer}'s turn`;
}

cells.forEach((cell) => cell.addEventListener('click', playMove));
document.querySelector('#new-round').addEventListener('click', startRound);
document.querySelector('#reset-game').addEventListener('click', () => {
  scores = { X: 0, O: 0, draw: 0 };
  Object.entries(scoreDisplays).forEach(([key, display]) => { display.textContent = scores[key]; });
  startRound();
});

startRound();
