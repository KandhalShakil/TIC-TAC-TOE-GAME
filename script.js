// Select all cells
const cells = document.querySelectorAll(".cell");
const winnerMessage = document.getElementById("winner-message"); // Winner message
const winnerText = document.getElementById("winner"); // Winner name
const marqtext = document.getElementById("slide"); // Marquee element
const restartButton = document.getElementById("restart-button"); // Restart button
const playerScoreElement = document.getElementById("player-score"); // Player score element
const computerScoreElement = document.getElementById("computer-score"); // Computer score element
const matchdrawElement = document.getElementById("match-draw"); // Match draw element
const totalmatchElement = document.getElementById("total-match"); // Total score element
const chooseXButton = document.getElementById("X"); // Choose 'X' button
const chooseOButton = document.getElementById("O"); // Choose 'O' button

let playerScore = 0; // Player score
let computerScore = 0; // Computer score
let drawScore = 0; // Match draw score
let totalScore = 0; // Total match score
let currentPlayer = ""; // Initial state for current player
let board = ["", "", "", "", "", "", "", "", ""]; // Board state
let isGameActive = false; // Game starts inactive until a player is chosen
let x = ""; // Variable to keep track of player's choice

// Possible winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

// Choose player function
const choosePlayer = (e) => {
  currentPlayer = e.target.id; // Set currentPlayer to 'X' or 'O'
  x = currentPlayer;
  isGameActive = true; // Start the game
  document
    .querySelectorAll(".current-player")
    .forEach((button) => (button.disabled = true)); // Disable choice buttons
  document.getElementById("choice").style.display = "none"; // Hide the choice buttons
  document.getElementById("game-board").style.display = "grid";
};

// Add event listeners to choose buttons
chooseXButton.addEventListener("click", choosePlayer);
chooseOButton.addEventListener("click", choosePlayer);

// Handle cell click
const handleClick = (e) => {
  const cell = e.target;
  const index = cell.getAttribute("data-index");

  // If the cell is empty and the game is active
  if (board[index] === "" && isGameActive) {
    board[index] = currentPlayer; // Update the board
    cell.textContent = currentPlayer; // Display X or O
    cell.classList.add("taken");
    checkWinner(); // Check for winner
    currentPlayer = currentPlayer === "X" ? "O" : "X"; // Switch to the other player
    if (isGameActive && currentPlayer !== x) {
      // Add a 0.5-second delay before computer's turn
      setTimeout(() => {
        intelligentComputerMove();
      }, 500); // 0.5-second delay
    }
  }
};

// Intelligent computer's move
const intelligentComputerMove = () => {
  const emptyCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter((val) => val !== null);

  // Win: If the computer can win in the next move, it will do so.
  for (let index of emptyCells) {
    board[index] = currentPlayer;
    if (checkImmediateWin(currentPlayer)) {
      cells[index].textContent = currentPlayer;
      cells[index].classList.add("taken");
      checkWinner();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      return;
    }
    board[index] = "";
  }

  // Block: If the player can win in the next move, the computer will block.
  for (let index of emptyCells) {
    board[index] = x;
    if (checkImmediateWin(x)) {
      board[index] = currentPlayer;
      cells[index].textContent = currentPlayer;
      cells[index].classList.add("taken");
      checkWinner();
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      return;
    }
    board[index] = "";
  }

  // Play center, if available.
  if (board[4] === "") {
    board[4] = currentPlayer;
    cells[4].textContent = currentPlayer;
    cells[4].classList.add("taken");
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    return;
  }

  // Play random corner, if available.
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((index) => board[index] === "");
  if (availableCorners.length > 0) {
    const randomIndex =
      availableCorners[Math.floor(Math.random() * availableCorners.length)];
    board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;
    cells[randomIndex].classList.add("taken");
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    return;
  }

  // Play random side, if available.
  const sides = [1, 3, 5, 7];
  const availableSides = sides.filter((index) => board[index] === "");
  if (availableSides.length > 0) {
    const randomIndex =
      availableSides[Math.floor(Math.random() * availableSides.length)];
    board[randomIndex] = currentPlayer;
    cells[randomIndex].textContent = currentPlayer;
    cells[randomIndex].classList.add("taken");
    checkWinner();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    return;
  }
};

// Check immediate win for a player
const checkImmediateWin = (player) => {
  return winningCombinations.some((combination) => {
    const [a, b, c] = combination;
    return board[a] === player && board[b] === player && board[c] === player;
  });
};

// Check for winner
const checkWinner = () => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      isGameActive = false;
      // Highlight the winning combination
      highlightWinningCombination(combination); 
      displayWinner(board[a]); // Display winner message
      updateScore(board[a]); // Update score
      return;
    }
  }

  // If the board is full and no winner, it's a draw
  if (!board.includes("")) {
    isGameActive = false;
    displayDraw(); // Display draw message
  }
};


// Display the winner message
const displayWinner = (winner) => {
  winnerMessage.style.display = "block"; // Show the winner message
  if (winner === x) {
    // winnerText.textContent = "You Win!"; // Player wins
    marqtext.textContent = "🏆Hurry !You Win🏆";

  } else {
    // winnerText.textContent = "You Lose!"; // Computer wins
  marqtext.textContent = "😔 Oh No ! You Lose😔";

  }
};

// Display the draw message
const displayDraw = () => {
  winnerMessage.style.display = "block"; // Show the draw message

  marqtext.textContent = "📍Match is Draw📍"
  drawScore++;
  matchdrawElement.textContent = drawScore;
  computerScoreElement.textContent = computerScore;
  playerScoreElement.textContent = playerScore;
  totalmatchElement.textContent = drawScore + playerScore + computerScore;
};

// Restart the game
const restartGame = () => {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentPlayer =x;
  winnerMessage.style.display = "none"; // Hide the winner message
  cells.forEach((cell) => {
  cell.textContent = "";
  cell.classList.remove("taken");
  marqtext.textContent = "This is Tic-Tac-Toe Game ! "+"\n"+"Create By Kandhal Shakil"
  removeHighlight(); // Remove the 'highlight' class
  });
};

// Update score
const updateScore = (winner) => {
  if (winner === x) {
    playerScore++;
  } else {
    computerScore++;
  }
  matchdrawElement.textContent = drawScore;
  computerScoreElement.textContent = computerScore;
  playerScoreElement.textContent = playerScore;
  totalmatchElement.textContent = drawScore + playerScore + computerScore;
};
// Highlight the winning combination
const highlightWinningCombination = (combination) => {
  combination.forEach((index) => {
    cells[index].classList.add("highlight"); // Add the 'highlight' class
  });
};
const removeHighlight = () => {
  cells.forEach((cell) => {
    cell.classList.remove("highlight"); // Remove the 'highlight' class
  });
};
// Add event listeners to all cells
cells.forEach((cell) => cell.addEventListener("click", handleClick));
// Add event listener to the restart button
restartButton.addEventListener("click", restartGame);
