let users = [];
let currentUser = null;
let gameRole = "";
let selectedSide = "";
let predictedSide = "";
let betAmount = 0;
let coinResult = "";
let opponent = null;

// Show Login Screen
function showLogin() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "block";
}

// Show Registration Screen
function showRegister() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("register-screen").style.display = "block";
}

// Register User
async function register() {
  const username = document.getElementById("register-username").value;
  const phone = document.getElementById("register-phone").value;
  const password = document.getElementById("register-password").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, phone, password }),
  });

  const data = await response.json();
  if (response.ok) {
    alert("Registration successful! Please login.");
    showLogin();
  } else {
    document.getElementById("register-error").innerText = data.error;
  }
}

// Login User
async function login() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (response.ok) {
    currentUser = data.user;
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("display-username").innerText = currentUser.username;
    document.getElementById("user-balance").innerText = currentUser.balance;
  } else {
    document.getElementById("login-error").innerText = data.error;
  }
}

// Find Opponent
function findOpponent() {
  document.getElementById("matchmaking-status").innerText = "Searching for opponent...";
  setTimeout(() => {
    opponent = { username: "OpponentUser", balance: 1000 }; // Replace with actual opponent username
    document.getElementById("matchmaking-status").innerText = `Opponent found: ${opponent.username}`;
    document.getElementById("role-selection").style.display = "block";
  }, 2000);
}

// Choose Role
function chooseRole(role) {
  gameRole = role;
  document.getElementById("role-selection").style.display = "none";
  document.getElementById("game-play-section").style.display = "block";

  if (role === "flipper") {
    document.getElementById("flipper-section").style.display = "block";
  } else {
    document.getElementById("guesser-section").style.display = "block";
  }
}

// Flipper Chooses Side
function chooseSide(side) {
  selectedSide = side;
}

// Flipper Flips Coin
function flipCoin() {
  betAmount = parseFloat(document.getElementById("bet-amount").value);
  if (isNaN(betAmount) || betAmount < 10 || betAmount > currentUser.balance) {
    alert("Invalid bet amount!");
    return;
  }

  currentUser.balance -= betAmount;
  alert("Waiting for Guesser to predict...");
}

// Guesser Predicts
function predictSide(side) {
  predictedSide = side;
  coinResult = Math.random() < 0.5 ? "Bichwa" : "Mwenge";
  document.getElementById("coin-result").innerText = "Coin Result: " + coinResult;

  if (predictedSide === coinResult) {
    alert("Guesser won!");
    currentUser.balance += betAmount * 2;
  } else {
    alert("Flipper won!");
  }

  document.getElementById("user-balance").innerText = currentUser.balance;
}

// Chat Function
function sendMessage() {
  const message = document.getElementById("chat-input").value.trim();
  if (!message) return;

  const messagesDiv = document.getElementById("messages");
  const msgElement = document.createElement("p");
  msgElement.innerText = `${currentUser.username}: ${message}`;
  messagesDiv.appendChild(msgElement);

  document.getElementById("chat-input").value = "";
}

// Show Deposit Section
function showDeposit() {
  document.getElementById("deposit-section").style.display = "block";
}

// Deposit Funds
function depositFunds() {
  let amount = parseFloat(document.getElementById("deposit-amount").value);
  if (isNaN(amount) || amount < 200) {
    document.getElementById("deposit-status").innerText = "Invalid amount!";
    return;
  }

  currentUser.balance += amount;
  document.getElementById("user-balance").innerText = currentUser.balance;
  document.getElementById("deposit-status").innerText = "Deposit successful!";
}

// Start Voice Chat
function startVoiceChat() {
  alert("Voice chat started!");
}
