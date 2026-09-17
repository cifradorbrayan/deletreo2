// ==========================================
// BANCO DE LAS 50 PALABRAS POR DIFICULTAD
// ==========================================
const allWords = [
  // FÁCIL (15 palabras)
  { word: "cat", level: "facil" },
  { word: "sun", level: "facil" },
  { word: "book", level: "facil" },
  { word: "tree", level: "facil" },
  { word: "fish", level: "facil" },
  { word: "ball", level: "facil" },
  { word: "house", level: "facil" },
  { word: "star", level: "facil" },
  { word: "milk", level: "facil" },
  { word: "bird", level: "facil" },
  { word: "door", level: "facil" },
  { word: "pen", level: "facil" },
  { word: "red", level: "facil" },
  { word: "dog", level: "facil" },
  { word: "cup", level: "facil" },

  // MEDIO (20 palabras)
  { word: "apple", level: "medio" },
  { word: "school", level: "medio" },
  { word: "friend", level: "medio" },
  { word: "yellow", level: "medio" },
  { word: "winter", level: "medio" },
  { word: "family", level: "medio" },
  { word: "window", level: "medio" },
  { word: "summer", level: "medio" },
  { word: "monkey", level: "medio" },
  { word: "purple", level: "medio" },
  { word: "orange", level: "medio" },
  { word: "garden", level: "medio" },
  { word: "table", level: "medio" },
  { word: "rabbit", level: "medio" },
  { word: "butter", level: "medio" },
  { word: "pillow", level: "medio" },
  { word: "jungle", level: "medio" },
  { word: "basket", level: "medio" },
  { word: "forest", level: "medio" },
  { word: "planet", level: "medio" },

  // DIFÍCIL (15 palabras)
  { word: "beautiful", level: "dificil" },
  { word: "chocolate", level: "dificil" },
  { word: "restaurant", level: "dificil" },
  { word: "knowledge", level: "dificil" },
  { word: "wednesday", level: "dificil" },
  { word: "necessary", level: "dificil" },
  { word: "library", level: "dificil" },
  { word: "vegetable", level: "dificil" },
  { word: "through", level: "dificil" },
  { word: "february", level: "dificil" },
  { word: "acknowledge", level: "dificil" },
  { word: "entrepreneur", level: "dificil" },
  { word: "accommodate", level: "dificil" },
  { word: "rhythm", level: "dificil" },
  { word: "questionnaire", level: "dificil" }
];

// Variables de estado
let wordPool = [];
let currentItem = null;
let score = 0;
let streak = 0;

// Referencias del DOM
const bodyRoot = document.getElementById("bodyRoot");
const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const btnStart = document.getElementById("btnStart");
const difficultyBadge = document.getElementById("difficultyBadge");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const remainingDisplay = document.getElementById("remaining");
const btnAudio = document.getElementById("btnAudio");
const wordSlots = document.getElementById("wordSlots");
const spellingForm = document.getElementById("spellingForm");
const userInput = document.getElementById("userInput");
const feedback = document.getElementById("feedback");
const btnPeek = document.getElementById("btnPeek");
const btnSkip = document.getElementById("btnSkip");
const wordReveal = document.getElementById("wordReveal");

// Pronunciación en inglés (en-US)
function speak(word) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

// Iniciar juego
btnStart.addEventListener("click", () => {
  wordPool = [...allWords];
  score = 0;
  streak = 0;
  scoreDisplay.textContent = "0";
  streakDisplay.textContent = "0";
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  btnPeek.classList.remove("hidden");
  btnSkip.classList.remove("hidden");
  nextWord();
});

// Cargar siguiente palabra aleatoria
function nextWord() {
  userInput.value = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  wordReveal.textContent = "";

  // Cuando se agotan las palabras
  if (wordPool.length === 0) {
    wordSlots.textContent = "🏆 ¡JUEGO COMPLETADO!";
    feedback.className = "feedback correct";
    feedback.textContent = `¡Felicidades! Lograste ${score} aciertos de 50.`;
    btnAudio.disabled = true;
    userInput.disabled = true;
    btnPeek.classList.add("hidden");
    btnSkip.classList.add("hidden");
    remainingDisplay.textContent = "0";
    return;
  }

  // Tomar una palabra aleatoria y removerla del mazo
  const randomIndex = Math.floor(Math.random() * wordPool.length);
  currentItem = wordPool[randomIndex];
  wordPool.splice(randomIndex, 1);

  // Actualizar contador
  remainingDisplay.textContent = wordPool.length + 1;

  // Cambiar colores y etiqueta según la dificultad
  applyTheme(currentItem.level);

  // Dibujar guiones según la longitud
  wordSlots.textContent = "_ ".repeat(currentItem.word.length).trim();

  // Reproducir sonido automáticamente
  speak(currentItem.word);
  userInput.focus();
}

// Aplicar estilos y etiquetas por dificultad
function applyTheme(level) {
  bodyRoot.classList.remove("theme-easy", "theme-medium", "theme-hard");

  if (level === "facil") {
    bodyRoot.classList.add("theme-easy");
    difficultyBadge.textContent = "NIVEL: FÁCIL";
  } else if (level === "medio") {
    bodyRoot.classList.add("theme-medium");
    difficultyBadge.textContent = "NIVEL: MEDIO";
  } else if (level === "dificil") {
    bodyRoot.classList.add("theme-hard");
    difficultyBadge.textContent = "NIVEL: DIFÍCIL";
  }
}

// Botón para repetir audio
btnAudio.addEventListener("click", () => {
  if (currentItem) {
    speak(currentItem.word);
    userInput.focus();
  }
});

// Validar comprobación de palabra
spellingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const attempt = userInput.value.trim().toLowerCase();

  if (!attempt) return;

  if (attempt === currentItem.word.toLowerCase()) {
    score++;
    streak++;
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    feedback.className = "feedback correct";
    feedback.textContent = `¡Correcto! Era "${currentItem.word}".`;

    setTimeout(nextWord, 1200);
  } else {
    streak = 0;
    streakDisplay.textContent = streak;
    feedback.className = "feedback wrong";
    feedback.textContent = "¡Incorrecto! Intenta escucharlo de nuevo.";
    userInput.select();
  }
});

// ==========================================
// BOTÓN ESQUINA DERECHA: SALTAR PALABRA
// ==========================================
btnSkip.addEventListener("click", () => {
  streak = 0;
  streakDisplay.textContent = streak;
  nextWord();
});

// ==========================================
// BOTÓN ESQUINA IZQUIERDA: MANTENER PARA VER
// ==========================================
const showWord = (e) => {
  if (e) e.preventDefault();
  if (currentItem) {
    wordReveal.textContent = `Palabra: ${currentItem.word}`;
    btnPeek.classList.add("active");
  }
};

const hideWord = () => {
  wordReveal.textContent = "";
  btnPeek.classList.remove("active");
};

// Eventos Mouse
btnPeek.addEventListener("mousedown", showWord);
window.addEventListener("mouseup", hideWord);

// Eventos Pantallas Táctiles
btnPeek.addEventListener("touchstart", showWord, { passive: false });
window.addEventListener("touchend", hideWord);
window.addEventListener("touchcancel", hideWord);