// Modern bilingual word match game

const wordPools = {
  "A1-A2": [
    { en: "cat", tr: "kedi" },
    { en: "dog", tr: "köpek" },
    { en: "house", tr: "ev" },
    { en: "book", tr: "kitap" },
    { en: "car", tr: "araba" },
    { en: "water", tr: "su" },
    { en: "apple", tr: "elma" },
    { en: "school", tr: "okul" },
    { en: "sun", tr: "güneş" },
    { en: "table", tr: "masa" },
    { en: "chair", tr: "sandalye" },
    { en: "pen", tr: "kalem" },
    { en: "window", tr: "pencere" },
    { en: "door", tr: "kapı" },
    { en: "milk", tr: "süt" },
    { en: "bread", tr: "ekmek" },
    { en: "tree", tr: "ağaç" },
    { en: "bird", tr: "kuş" },
    { en: "fish", tr: "balık" },
    { en: "flower", tr: "çiçek" }
  ],
  "B1-B2": [
    { en: "challenge", tr: "meydan okuma" },
    { en: "improve", tr: "geliştirmek" },
    { en: "solution", tr: "çözüm" },
    { en: "opinion", tr: "görüş" },
    { en: "environment", tr: "çevre" },
    { en: "opportunity", tr: "fırsat" },
    { en: "responsible", tr: "sorumlu" },
    { en: "experience", tr: "deneyim" },
    { en: "decision", tr: "karar" },
    { en: "support", tr: "destek" },
    { en: "community", tr: "topluluk" },
    { en: "increase", tr: "artırmak" },
    { en: "reduce", tr: "azaltmak" },
    { en: "require", tr: "gerektirmek" },
    { en: "suggestion", tr: "öneri" },
    { en: "achievement", tr: "başarı" },
    { en: "attend", tr: "katılmak" },
    { en: "compare", tr: "karşılaştırmak" },
    { en: "describe", tr: "tanımlamak" },
    { en: "prepare", tr: "hazırlamak" }
  ],
  "C1-C2": [
    { en: "comprehensive", tr: "kapsamlı" },
    { en: "notwithstanding", tr: "-e rağmen" },
    { en: "subsequently", tr: "sonradan" },
    { en: "predominantly", tr: "çoğunlukla" },
    { en: "contemplate", tr: "düşünüp taşınmak" },
    { en: "perceive", tr: "algılamak" },
    { en: "convey", tr: "iletmek" },
    { en: "detrimental", tr: "zararlı" },
    { en: "inadvertently", tr: "yanlışlıkla" },
    { en: "meticulous", tr: "titiz" },
    { en: "notion", tr: "kavram" },
    { en: "prevalent", tr: "yaygın" },
    { en: "scrutiny", tr: "inceleme" },
    { en: "substantiate", tr: "kanıtlamak" },
    { en: "ubiquitous", tr: "her yerde bulunan" },
    { en: "vindicate", tr: "aklamak" },
    { en: "alleviate", tr: "hafifletmek" },
    { en: "conspicuous", tr: "göze çarpan" },
    { en: "elaborate", tr: "ayrıntılı" },
    { en: "facetious", tr: "nükteli" }
  ]
};

let currentLevel = null;
let currentWords = [];
let score = 0;
let questionNum = 1;
let totalQuestions = 10;
let time = 0;
let timer = null;
let currentWord = null;
let choices = [];
let canAnswer = true;
let correctCount = 0;
let wrongCount = 0;
let userAnswers = [];

const levelSelect = document.getElementById("levelSelect");
const gameSection = document.getElementById("gameSection");
const wordDisplay = document.getElementById("wordDisplay");
const scoreSpan = document.getElementById("score");
const questionNumSpan = document.getElementById("questionNum");
const timeSpan = document.getElementById("time");
const message = document.getElementById("message");
const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const playAgain = document.getElementById("playAgain");
const infoButton = document.getElementById("infoButton");
const infoModal = document.getElementById("infoModal");
const closeInfo = document.getElementById("closeInfo");
const choicesDiv = document.getElementById("choices");

// --- Oyun Seçme Ekranı Başlangıç Akışı ---
const gameSelect = document.getElementById("gameSelect");
const chooseVocabBlitz = document.getElementById("chooseVocabBlitz");
const chooseSentenceGame = document.getElementById("chooseSentenceGame");

function showGameSelect() {
  gameSelect.style.display = "flex";
  levelSelect.style.display = "none";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  // Eğer sentence game varsa onu da gizle
  const sentenceGame = document.getElementById("sentenceGameSection");
  if (sentenceGame) sentenceGame.style.display = "none";
}

function showVocabBlitz() {
  gameSelect.style.display = "none";
  levelSelect.style.display = "flex";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  const sentenceGame = document.getElementById("sentenceGameSection");
  if (sentenceGame) sentenceGame.style.display = "none";
  console.log("VocabBlitz seviye seçimi açıldı");
}

function showSentenceGame() {
  gameSelect.style.display = "none";
  levelSelect.style.display = "none";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  let sentenceGame = document.getElementById("sentenceGameSection");
  if (!sentenceGame) {
    sentenceGame = document.createElement("div");
    sentenceGame.id = "sentenceGameSection";
    sentenceGame.className = "card";
    sentenceGame.innerHTML = `<h2>Cümle Ustası (Yakında)</h2><p>Bu oyun çok yakında aktif olacak!</p>`;
    document.querySelector(".container").appendChild(sentenceGame);
  }
  sentenceGame.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function() {
  showGameSelect();
});
if (chooseVocabBlitz) {
  chooseVocabBlitz.onclick = showVocabBlitz;
}
if (chooseSentenceGame) {
  chooseSentenceGame.onclick = function() {
    window.location.href = "sentence_game.html";
  };
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getTimeForLevel(level) {
  if (level === "A1-A2") return 7;
  if (level === "B1-B2") return 5;
  if (level === "C1-C2") return 4;
  return 5;
}

function startGame(level) {
  console.log("startGame çağrıldı, seviye:", level);
  currentLevel = level;
  currentWords = shuffle([...wordPools[level]]).slice(0, totalQuestions);
  score = 0;
  questionNum = 1;
  correctCount = 0;
  wrongCount = 0;
  userAnswers = [];
  gameSection.style.display = "flex";
  levelSelect.style.display = "none";
  gameOver.style.display = "none";
  scoreSpan.textContent = score;
  questionNumSpan.textContent = questionNum;
  // Özet kutusunu temizle
  const wrongSummary = document.getElementById("wrongSummary");
  if (wrongSummary) wrongSummary.innerHTML = "";
  // Spinner'ı göster
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "inline-block";
  nextQuestion();
}

function nextQuestion() {
  canAnswer = true;
  message.textContent = "";
  if (questionNum > totalQuestions) {
    endGame();
    return;
  }
  currentWord = currentWords[questionNum - 1];
  wordDisplay.textContent = currentWord.en;
  // 3 yanlış şık seç
  let wrongs = shuffle(wordPools[currentLevel].filter(w => w.tr !== currentWord.tr)).slice(0, 3);
  choices = shuffle([
    { text: currentWord.tr, correct: true },
    ...wrongs.map(w => ({ text: w.tr, correct: false }))
  ]);
  renderChoices();
  time = getTimeForLevel(currentLevel);
  timeSpan.textContent = time;
  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeSpan.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      if (canAnswer) {
        canAnswer = false;
        wrongCount++;
        showAnswer(null); // Süre bitti, cevap yok
      }
    }
  }, 1000);
  // Spinner'ı göster
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "inline-block";
}

function renderChoices() {
  choicesDiv.innerHTML = "";
  choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice.text;
    btn.onclick = () => selectChoice(idx);
    btn.disabled = !canAnswer;
    choicesDiv.appendChild(btn);
  });
}

function selectChoice(idx) {
  if (!canAnswer) return;
  canAnswer = false;
  clearInterval(timer);
  const isCorrect = choices[idx].correct;
  userAnswers.push({
    word: currentWord.en,
    correct: currentWord.tr,
    selected: choices[idx].text,
    isCorrect: !!isCorrect
  });
  if (isCorrect) {
    score++;
    correctCount++;
    message.textContent = "Correct!";
  } else {
    wrongCount++;
    message.textContent = "Wrong!";
  }
  // Şıkları renklendir
  Array.from(choicesDiv.children).forEach((btn, i) => {
    btn.disabled = true;
    if (choices[i].correct) btn.classList.add("correct");
    if (i === idx && !choices[i].correct) btn.classList.add("wrong");
  });
  scoreSpan.textContent = score;
  setTimeout(() => {
    questionNum++;
    questionNumSpan.textContent = questionNum <= totalQuestions ? questionNum : totalQuestions;
    nextQuestion();
  }, 1000);
}

function showAnswer(idx) {
  if (canAnswer) {
    userAnswers.push({
      word: currentWord.en,
      correct: currentWord.tr,
      selected: null,
      isCorrect: false
    });
  }
  // Süre bittiğinde veya cevap verilmediğinde
  Array.from(choicesDiv.children).forEach((btn, i) => {
    btn.disabled = true;
    if (choices[i].correct) btn.classList.add("correct");
    if (i === idx && !choices[i].correct) btn.classList.add("wrong");
  });
  message.textContent = "Time's up!";
  setTimeout(() => {
    questionNum++;
    questionNumSpan.textContent = questionNum <= totalQuestions ? questionNum : totalQuestions;
    nextQuestion();
  }, 1000);
}

function endGame() {
  gameSection.style.display = "none";
  gameOver.style.display = "flex";
  finalScore.innerHTML = `Correct: <b>${correctCount}</b> / Wrong: <b>${wrongCount}</b> <br> Score: <b>${score}</b>`;
  // Başarılıysa öneri ekle
  let nextLevel = null;
  if (currentLevel === "A1-A2") nextLevel = "B1-B2";
  else if (currentLevel === "B1-B2") nextLevel = "C1-C2";
  if (correctCount >= 7 && nextLevel) {
    finalScore.innerHTML += `<br><span style='color:#388e3c;font-weight:600;'>Tebrikler! Bir üst seviyeye geçebilirsiniz.</span><br><button id='nextLevelBtn' class='levelBtn' style='margin-top:10px;'>${nextLevel} Seviyesine Geç</button>`;
  }
  clearInterval(timer);
  renderWrongSummary();
  // Spinner'ı gizle
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "none";
  // Yeni seviye butonu için event
  setTimeout(() => {
    const nextBtn = document.getElementById('nextLevelBtn');
    if (nextBtn) {
      nextBtn.onclick = () => startGame(nextLevel);
    }
  }, 0);
}

function renderWrongSummary() {
  const wrongSummary = document.getElementById("wrongSummary");
  if (!wrongSummary) return;
  const wrongs = userAnswers.filter(ans => !ans.isCorrect);
  if (wrongs.length === 0) {
    wrongSummary.innerHTML = '<h3>Perfect! All answers correct 🎉</h3>';
    return;
  }
  let html = '<h3>Wrong Answers</h3><ul>';
  wrongs.forEach(ans => {
    html += `<li><span class="q">${ans.word}</span> → <span class="y">${ans.selected ? ans.selected : 'No answer'}</span> <br><span class="a">Correct: ${ans.correct}</span></li>`;
  });
  html += '</ul>';
  wrongSummary.innerHTML = html;
}

playAgain.addEventListener("click", () => {
  startGame(currentLevel);
});

// Eski seviye butonları için event kaldırıldı
// Yeni radio group ve Start butonu için event:
const startGameBtn = document.getElementById("startGame");
if (startGameBtn) {
  startGameBtn.addEventListener("click", function() {
    // Seçili radio inputu bul
    const selectedRadio = document.querySelector('.glass-radio-group-vertical input[name="level"]:checked');
    if (selectedRadio) {
      const level = selectedRadio.value;
      console.log("Başlatılan seviye:", level);
      startGame(level);
    }
  });
}

// Info modal
infoButton.addEventListener("click", () => {
  infoModal.classList.add("active");
});
closeInfo.addEventListener("click", () => {
  infoModal.classList.remove("active");
});

window.onload = () => {
  levelSelect.style.display = "flex";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  // Spinner'ı gizle
  const spinner = document.getElementById("timerSpinner");
  if (spinner) spinner.style.display = "none";
};

// --- Cümle Ustası Oyun Akışı ---
const sentenceGameSection = document.getElementById("sentenceGameSection");
const sentenceLevelSelect = document.getElementById("sentenceLevelSelect");
const sentenceGamePlay = document.getElementById("sentenceGamePlay");
const sentenceGameOver = document.getElementById("sentenceGameOver");
const sentenceScoreSpan = document.getElementById("sentenceScore");
const sentenceQuestionNumSpan = document.getElementById("sentenceQuestionNum");
const sentenceTimeSpan = document.getElementById("sentenceTime");
const sentenceQuestionDiv = document.getElementById("sentenceQuestion");
const sentenceChoicesDiv = document.getElementById("sentenceChoices");
const sentenceFeedbackDiv = document.getElementById("sentenceFeedback");
const sentenceFinalScore = document.getElementById("sentenceFinalScore");
const sentencePlayAgain = document.getElementById("sentencePlayAgain");
const startSentenceGameBtn = document.getElementById("startSentenceGame");

let sentenceGameState = {
  level: null,
  questions: [],
  current: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  timer: null,
  time: 0,
  userAnswers: []
};

const sentenceQuestionsData = {
  "A2": [
    { type: "fill", q: "I ___ a student.", a: "am", choices: ["is", "am", "are", "be"] },
    { type: "order", q: ["She", "to", "goes", "school", "every", "day"], a: ["She", "goes", "to", "school", "every", "day"] },
    { type: "verb", q: "He ___ (play) football.", a: "plays", choices: ["play", "plays", "playing", "played"] },
    { type: "error", q: "She don't like apples.", a: "don't", choices: ["don't", "like", "apples", "No error"] },
    { type: "fill", q: "They ___ happy.", a: "are", choices: ["is", "am", "are", "be"] },
    { type: "order", q: ["We", "in", "live", "Ankara"], a: ["We", "live", "in", "Ankara"] },
    { type: "verb", q: "I ___ (read) a book.", a: "am reading", choices: ["read", "am reading", "reading", "reads"] },
    { type: "error", q: "He go to work every day.", a: "go", choices: ["go", "to", "work", "No error"] },
    { type: "fill", q: "It ___ cold today.", a: "is", choices: ["is", "are", "am", "be"] },
    { type: "order", q: ["My", "name", "is", "Ali"], a: ["My", "name", "is", "Ali"] }
  ],
  "B1": [
    { type: "fill", q: "She ___ to the gym on Mondays.", a: "goes", choices: ["go", "goes", "going", "gone"] },
    { type: "order", q: ["They", "have", "never", "visited", "Istanbul"], a: ["They", "have", "never", "visited", "Istanbul"] },
    { type: "verb", q: "We ___ (study) English for two years.", a: "have studied", choices: ["studied", "have studied", "studying", "study"] },
    { type: "error", q: "He didn't went to the party.", a: "went", choices: ["didn't", "went", "party", "No error"] },
    { type: "fill", q: "The children ___ playing in the park.", a: "are", choices: ["is", "are", "was", "were"] },
    { type: "order", q: ["I", "will", "call", "you", "later"], a: ["I", "will", "call", "you", "later"] },
    { type: "verb", q: "She ___ (not/like) coffee.", a: "doesn't like", choices: ["don't like", "doesn't like", "not like", "isn't like"] },
    { type: "error", q: "We was at home yesterday.", a: "was", choices: ["was", "at", "home", "No error"] },
    { type: "fill", q: "My father ___ a doctor.", a: "is", choices: ["is", "are", "am", "be"] },
    { type: "order", q: ["The", "movie", "was", "very", "interesting"], a: ["The", "movie", "was", "very", "interesting"] }
  ],
  "B2-C1": [
    { type: "fill", q: "If I ___ more time, I would travel.", a: "had", choices: ["have", "had", "has", "having"] },
    { type: "order", q: ["Despite", "the", "rain", "they", "went", "out"], a: ["Despite", "the", "rain", "they", "went", "out"] },
    { type: "verb", q: "She ___ (write) three books so far.", a: "has written", choices: ["wrote", "has written", "writes", "writing"] },
    { type: "error", q: "Neither of the answers are correct.", a: "are", choices: ["Neither", "are", "correct", "No error"] },
    { type: "fill", q: "He ___ to have finished the project.", a: "claims", choices: ["claim", "claims", "claimed", "claiming"] },
    { type: "order", q: ["The", "book", "I", "read", "was", "amazing"], a: ["The", "book", "I", "read", "was", "amazing"] },
    { type: "verb", q: "They ___ (not/see) the film yet.", a: "haven't seen", choices: ["didn't see", "haven't seen", "not see", "don't see"] },
    { type: "error", q: "He don't know the answer.", a: "don't", choices: ["don't", "know", "answer", "No error"] },
    { type: "fill", q: "The results ___ announced tomorrow.", a: "will be", choices: ["will", "will be", "are", "is"] },
    { type: "order", q: ["She", "has", "been", "working", "here", "since", "2015"], a: ["She", "has", "been", "working", "here", "since", "2015"] }
  ]
};

function shuffleArray(arr) {
  return arr.map(x => [Math.random(), x]).sort().map(x => x[1]);
}

function startSentenceGameFlow(level) {
  sentenceGameState.level = level;
  sentenceGameState.questions = [];
  sentenceGameState.current = 0;
  sentenceGameState.score = 0;
  sentenceGameState.correct = 0;
  sentenceGameState.wrong = 0;
  sentenceGameState.userAnswers = [];
  sentenceGameState.time = 0;
  clearInterval(sentenceGameState.timer);
  // AI Modu ise placeholder göster
  if (level === "AI") {
    sentenceLevelSelect.style.display = "none";
    sentenceGamePlay.style.display = "none";
    sentenceGameOver.style.display = "flex";
    sentenceFinalScore.innerHTML = "AI Modu çok yakında!";
    return;
  }
  // Soruları seç
  let pool = sentenceQuestionsData[level] || sentenceQuestionsData["A2"];
  sentenceGameState.questions = shuffleArray(pool).slice(0, 10);
  sentenceLevelSelect.style.display = "none";
  sentenceGamePlay.style.display = "flex";
  sentenceGameOver.style.display = "none";
  nextSentenceQuestion();
  // Zamanlayıcı başlat
  sentenceGameState.time = 0;
  sentenceTimeSpan.textContent = sentenceGameState.time;
  sentenceGameState.timer = setInterval(() => {
    sentenceGameState.time++;
    sentenceTimeSpan.textContent = sentenceGameState.time;
  }, 1000);
}

function nextSentenceQuestion() {
  if (sentenceGameState.current >= sentenceGameState.questions.length) {
    endSentenceGame();
    return;
  }
  const qObj = sentenceGameState.questions[sentenceGameState.current];
  sentenceQuestionNumSpan.textContent = sentenceGameState.current + 1;
  sentenceScoreSpan.textContent = sentenceGameState.score;
  sentenceFeedbackDiv.textContent = "";
  // Soru tipine göre render
  if (qObj.type === "fill" || qObj.type === "verb" || qObj.type === "error") {
    sentenceQuestionDiv.innerHTML = qObj.q;
    sentenceChoicesDiv.innerHTML = "";
    qObj.choices.forEach((choice, idx) => {
      const btn = document.createElement("button");
      btn.className = "sentence-choice-btn";
      btn.textContent = choice;
      btn.onclick = () => selectSentenceChoice(choice);
      sentenceChoicesDiv.appendChild(btn);
    });
  } else if (qObj.type === "order") {
    sentenceQuestionDiv.innerHTML = "Kelimeleri doğru sıraya dizin:";
    sentenceChoicesDiv.innerHTML = "";
    // Karışık sırada göster
    let mixed = shuffleArray(qObj.q);
    mixed.forEach((word, idx) => {
      const btn = document.createElement("button");
      btn.className = "sentence-choice-btn";
      btn.textContent = word;
      btn.onclick = () => selectOrderWord(word, btn);
      sentenceChoicesDiv.appendChild(btn);
    });
    // Kullanıcının seçtiği sıralama
    sentenceGameState.orderAnswer = [];
  }
}

function selectSentenceChoice(choice) {
  const qObj = sentenceGameState.questions[sentenceGameState.current];
  let correct = false;
  if (qObj.a === choice) {
    correct = true;
    sentenceGameState.score += 10;
    sentenceGameState.correct++;
    sentenceFeedbackDiv.textContent = "Doğru!";
    sentenceFeedbackDiv.style.color = "#388e3c";
  } else {
    sentenceGameState.score -= 2;
    sentenceGameState.wrong++;
    sentenceFeedbackDiv.textContent = `Yanlış! Doğru cevap: ${qObj.a}`;
    sentenceFeedbackDiv.style.color = "#d32f2f";
  }
  sentenceGameState.userAnswers.push({q: qObj, user: choice, correct});
  setTimeout(() => {
    sentenceGameState.current++;
    nextSentenceQuestion();
  }, 900);
}

function selectOrderWord(word, btn) {
  if (!btn.disabled) {
    btn.disabled = true;
    btn.style.opacity = 0.6;
    sentenceGameState.orderAnswer.push(word);
    // Cevap tamamlandıysa kontrol et
    const qObj = sentenceGameState.questions[sentenceGameState.current];
    if (sentenceGameState.orderAnswer.length === qObj.a.length) {
      let correct = JSON.stringify(sentenceGameState.orderAnswer) === JSON.stringify(qObj.a);
      if (correct) {
        sentenceGameState.score += 10;
        sentenceGameState.correct++;
        sentenceFeedbackDiv.textContent = "Doğru!";
        sentenceFeedbackDiv.style.color = "#388e3c";
      } else {
        sentenceGameState.score -= 2;
        sentenceGameState.wrong++;
        sentenceFeedbackDiv.textContent = `Yanlış! Doğru sıra: ${qObj.a.join(" ")}`;
        sentenceFeedbackDiv.style.color = "#d32f2f";
      }
      sentenceGameState.userAnswers.push({q: qObj, user: [...sentenceGameState.orderAnswer], correct});
      setTimeout(() => {
        sentenceGameState.current++;
        nextSentenceQuestion();
      }, 1200);
    }
  }
}

function endSentenceGame() {
  clearInterval(sentenceGameState.timer);
  sentenceGamePlay.style.display = "none";
  sentenceGameOver.style.display = "flex";
  let accuracy = Math.round((sentenceGameState.correct / sentenceGameState.questions.length) * 100);
  sentenceFinalScore.innerHTML = `Doğru: <b>${sentenceGameState.correct}</b> / Yanlış: <b>${sentenceGameState.wrong}</b><br>Skor: <b>${sentenceGameState.score}</b><br>Doğruluk: <b>${accuracy}%</b>`;
}

if (startSentenceGameBtn) {
  startSentenceGameBtn.onclick = function() {
    // Seçili radio inputu bul
    const selectedRadio = document.querySelector('.sentence-level-select input[name="sentenceLevel"]:checked');
    if (selectedRadio) {
      startSentenceGameFlow(selectedRadio.value);
    }
  };
}
if (sentencePlayAgain) {
  sentencePlayAgain.onclick = function() {
    sentenceLevelSelect.style.display = "flex";
    sentenceGamePlay.style.display = "none";
    sentenceGameOver.style.display = "none";
  };
}
// --- Oyun seçme ekranı ile entegrasyon ---
function showSentenceGame() {
  gameSelect.style.display = "none";
  levelSelect.style.display = "none";
  gameSection.style.display = "none";
  gameOver.style.display = "none";
  sentenceGameSection.style.display = "flex";
  sentenceLevelSelect.style.display = "flex";
  sentenceGamePlay.style.display = "none";
  sentenceGameOver.style.display = "none";
}