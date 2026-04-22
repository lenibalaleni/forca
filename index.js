const wordDatabase = {
  "Filmes": [
    "O Rei Leão", "Jurassic Park", "Matrix", "Titanic", "Avatar", 
    "Harry Potter", "Star Wars", "O Senhor dos Anéis", "Toy Story", "Vingadores"
  ],
  "Séries": [
    "Stranger Things", "Breaking Bad", "The Crown", "Friends", "Game of Thrones",
    "The Office", "The Mandalorian", "Black Mirror", "Lost", "Suits"
  ],
  "Comida": [
    "Pizza de Pepperoni", "Lasanha Bolonhesa", "Hambúrguer Gourmet", "Sushi Variado", 
    "Bacalhau com Natas", "Arroz de Marisco", "Feijoada", "Brigadeiro", "Tiramisu", "Gelado de Baunilha"
  ],
  "Desporto": [
    "Futebol de Onze", "Basquetebol", "Voleibol de Praia", "Natação Sincronizada", 
    "Fórmula Um", "Ciclismo de Estrada", "Ténis de Mesa", "Andebol", "Judo", "Surf"
  ],
  "Países": [
    "Portugal", "Brasil", "Estados Unidos", "Reino Unido", "França", 
    "Alemanha", "Itália", "Japão", "Austrália", "África do Sul"
  ]
};

let selectedWord = "";
let selectedCategory = "";
let guessedLetters = [];
let errorCount = 0;
const maxErrors = 6;

// DOM Elements
const categoryScreen = document.getElementById("category-screen");
const gameContainer = document.getElementById("game-container");
const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const errorCountDisplay = document.getElementById("error-count");
const categoryNameDisplay = document.getElementById("category-name");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayEmoji = document.getElementById("overlay-emoji");
const overlayMessage = document.getElementById("overlay-message");
const btnPlayAgain = document.getElementById("btn-play-again");
const catButtons = document.querySelectorAll(".cat-btn");

// Body parts in order
const bodyParts = [
  "part-head",
  "part-body",
  "part-left-arm",
  "part-right-arm",
  "part-left-leg",
  "part-right-leg"
];

// Initialize Category Selection
catButtons.forEach(btn => {
  btn.onclick = () => {
    selectedCategory = btn.getAttribute("data-cat");
    startGame();
  };
});

function startGame() {
  categoryScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  
  // Pick random word from category
  const words = wordDatabase[selectedCategory];
  selectedWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  
  errorCount = 0;
  guessedLetters = [];
  
  errorCountDisplay.innerText = `0 / ${maxErrors}`;
  categoryNameDisplay.innerText = selectedCategory;
  overlay.classList.add("hidden");
  
  bodyParts.forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });

  renderWord();
  renderKeyboard();
}

function renderWord() {
  wordDisplay.innerHTML = "";
  
  const characters = selectedWord.split("");
  characters.forEach(char => {
    const slot = document.createElement("div");
    slot.classList.add("letter-slot");
    
    // Normalizing Portuguese characters for comparison
    const normalizedChar = char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isLetter = /[a-z]/.test(normalizedChar);

    if (char === " ") {
      slot.classList.add("space");
      slot.innerText = " ";
    } else if (!isLetter) {
      // For symbols like hyphens or special punctuation if any
      slot.innerText = char;
      slot.classList.add("filled");
    } else if (guessedLetters.includes(normalizedChar)) {
      slot.innerText = char;
      slot.classList.add("filled");
    } else {
      slot.innerText = "";
    }
    
    wordDisplay.appendChild(slot);
  });
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
  
  alphabet.forEach(letter => {
    const button = document.createElement("button");
    button.innerText = letter;
    button.classList.add("key");
    button.onclick = () => handleGuess(letter, button);
    keyboard.appendChild(button);
  });
}

function handleGuess(letter, button) {
  button.disabled = true;
  
  // Normalize the secret word to check against the simple alphabet letter
  const normalizedWord = selectedWord.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (normalizedWord.includes(letter)) {
    guessedLetters.push(letter);
    button.classList.add("correct");
    renderWord();
    checkWin(normalizedWord);
  } else {
    errorCount++;
    button.classList.add("wrong");
    updateHangman();
    checkLoss();
  }
}

function updateHangman() {
  errorCountDisplay.innerText = `${errorCount} / ${maxErrors}`;
  
  if (errorCount <= bodyParts.length) {
    const partId = bodyParts[errorCount - 1];
    document.getElementById(partId).classList.remove("hidden");
  }
}

function checkWin(normalizedWord) {
  // Check if all letters in the normalized word are in guessedLetters
  const allLettersGuessed = normalizedWord.split("").every(char => {
    if (char === " " || !/[a-z]/.test(char)) return true;
    return guessedLetters.includes(char);
  });

  if (allLettersGuessed) {
    showGameOver(true);
  }
}

function checkLoss() {
  if (errorCount >= maxErrors) {
    showGameOver(false);
  }
}

function showGameOver(isWin) {
  overlay.classList.remove("hidden");
  
  if (isWin) {
    overlayEmoji.innerText = "🎉";
    overlayTitle.innerText = "Parabéns!";
    overlayMessage.innerText = `Adivinhaste: "${selectedWord.toUpperCase()}"`;
  } else {
    overlayEmoji.innerText = "💀";
    overlayTitle.innerText = "Game Over";
    overlayMessage.innerText = `A palavra era: "${selectedWord.toUpperCase()}"`;
  }
}

btnPlayAgain.onclick = () => {
  gameContainer.classList.add("hidden");
  categoryScreen.classList.remove("hidden");
  overlay.classList.add("hidden");
};
