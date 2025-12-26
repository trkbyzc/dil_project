// VocabBlitz - Kelime Eşleştirme Oyunu

document.addEventListener("DOMContentLoaded", () => {
  // Kelime havuzları
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
      { en: "facetious", tr: "nükteli" },
      { en: "meticulous", tr: "titiz" }
    ]
  }

  // Oyun durumu
  let gameState = {
    level: null,
    words: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 10,
    timeLeft: 0,
    maxTime: 0,
    timer: null,
    canAnswer: true
  }

  // DOM elementleri
  const levelSelect = document.getElementById("levelSelect")
  const gameSection = document.getElementById("gameSection")
  const gameOver = document.getElementById("gameOver")
  const startGameBtn = document.getElementById("startGame")
  const playAgain = document.getElementById("playAgain")
  
  const wordDisplay = document.getElementById("wordDisplay")
  const choicesDiv = document.getElementById("choices")
  const scoreSpan = document.getElementById("score")
  const questionNumSpan = document.getElementById("questionNum")
  const timeSpan = document.getElementById("time")
  const message = document.getElementById("message")
  const progressFill = document.getElementById("progressFill")
  const timerCircle = document.getElementById("timerCircle")
  
  const finalScore = document.getElementById("finalScore")
  const correctBar = document.getElementById("correctBar")
  const wrongBar = document.getElementById("wrongBar")
  const correctCount = document.getElementById("correctCount")
  const wrongCount = document.getElementById("wrongCount")
  const resultIcon = document.getElementById("resultIcon")
  const resultTitle = document.getElementById("resultTitle")
  const wrongSummary = document.getElementById("wrongSummary")

  // Yardımcı fonksiyonlar
  function shuffle(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  function getTimeForLevel(level) {
    switch(level) {
      case "A1-A2": return 7
      case "B1-B2": return 5
      case "C1-C2": return 4
      default: return 5
    }
  }

  function updateProgress() {
    const progress = (gameState.currentIndex / gameState.totalQuestions) * 100
    if (progressFill) progressFill.style.width = `${progress}%`
    if (questionNumSpan) questionNumSpan.textContent = gameState.currentIndex + 1
  }

  function updateTimer() {
    if (timerCircle) {
      const progress = gameState.timeLeft / gameState.maxTime
      const circumference = 2 * Math.PI * 45
      const offset = circumference * (1 - progress)
      timerCircle.style.strokeDashoffset = offset
    }
  }

  function updateUI() {
    if (scoreSpan) scoreSpan.textContent = gameState.score
    if (timeSpan) timeSpan.textContent = gameState.timeLeft
    updateProgress()
    updateTimer()
  }

  // Oyun fonksiyonları
  function startGame() {
    const selectedLevel = document.querySelector('input[name="level"]:checked')?.value
    if (!selectedLevel) return

    // Oyun durumunu sıfırla
    gameState = {
      level: selectedLevel,
      words: shuffle(wordPools[selectedLevel]).slice(0, 10),
      currentIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 10,
      timeLeft: 0,
      maxTime: getTimeForLevel(selectedLevel),
      timer: null,
      canAnswer: true
    }

    // Ekranları değiştir
    if (levelSelect) levelSelect.style.display = "none"
    if (gameSection) gameSection.style.display = "block"
    if (gameOver) gameOver.style.display = "none"

    // İlk soruyu başlat
    nextQuestion()
  }

  function nextQuestion() {
    if (gameState.currentIndex >= gameState.totalQuestions) {
      endGame()
      return
    }

    gameState.canAnswer = true
    gameState.timeLeft = gameState.maxTime

    // Mevcut kelimeyi al
    const currentWord = gameState.words[gameState.currentIndex]
    if (wordDisplay) wordDisplay.textContent = currentWord.en

    // Seçenekleri oluştur
    createChoices(currentWord)

    // UI'ı güncelle
    updateUI()
    if (message) {
      message.textContent = ""
      message.className = "feedback-message"
    }

    // Timer'ı başlat
    startTimer()
  }

  function createChoices(currentWord) {
    if (!choicesDiv) return

    // Yanlış seçenekleri al
    const wrongChoices = shuffle(
      wordPools[gameState.level].filter(word => word.tr !== currentWord.tr)
    ).slice(0, 3)

    // Tüm seçenekleri karıştır
    const allChoices = shuffle([
      { text: currentWord.tr, correct: true },
      ...wrongChoices.map(word => ({ text: word.tr, correct: false }))
    ])

    // Seçenekleri oluştur
    choicesDiv.innerHTML = ""
    allChoices.forEach((choice, index) => {
      const button = document.createElement("button")
      button.className = "choice-btn"
      button.textContent = choice.text
      button.onclick = () => selectChoice(choice.correct, button, currentWord.tr)
      choicesDiv.appendChild(button)
    })
  }

  function startTimer() {
    clearInterval(gameState.timer)
    gameState.timer = setInterval(() => {
      gameState.timeLeft--
      updateUI()

      if (gameState.timeLeft <= 0) {
        clearInterval(gameState.timer)
        if (gameState.canAnswer) {
          handleTimeout()
        }
      }
    }, 1000)
  }

  function selectChoice(isCorrect, buttonElement, correctAnswer) {
    if (!gameState.canAnswer) return

    gameState.canAnswer = false
    clearInterval(gameState.timer)

    // Tüm butonları devre dışı bırak
    const buttons = choicesDiv.querySelectorAll(".choice-btn")
    buttons.forEach(btn => btn.disabled = true)

    if (isCorrect) {
      gameState.score += 10
      gameState.correctAnswers++
      buttonElement.style.backgroundColor = "#4CAF50"
      buttonElement.style.color = "white"
      if (message) {
        message.textContent = "Correct! 🎉"
        message.className = "feedback-message correct"
        message.style.color = "#4CAF50"
      }
    } else {
      gameState.wrongAnswers++
      buttonElement.style.backgroundColor = "#f44336"
      buttonElement.style.color = "white"
      // Doğru cevabı göster
      buttons.forEach(btn => {
        if (btn.textContent === correctAnswer) {
          btn.style.backgroundColor = "#4CAF50"
          btn.style.color = "white"
        }
      })
      if (message) {
        message.textContent = `Wrong! Correct answer: ${correctAnswer}`
        message.className = "feedback-message wrong"
        message.style.color = "#f44336"
      }
    }

    updateUI()

    // Sonraki soruya geç
    setTimeout(() => {
      gameState.currentIndex++
      nextQuestion()
    }, 1500)
  }

  function handleTimeout() {
    gameState.canAnswer = false
    gameState.wrongAnswers++

    const correctAnswer = gameState.words[gameState.currentIndex].tr

    // Doğru cevabı göster
    const buttons = choicesDiv.querySelectorAll(".choice-btn")
    buttons.forEach(btn => {
      btn.disabled = true
      if (btn.textContent === correctAnswer) {
        btn.style.backgroundColor = "#4CAF50"
        btn.style.color = "white"
      }
    })

    if (message) {
      message.textContent = `Time's up! Correct answer: ${correctAnswer}`
      message.className = "feedback-message wrong"
      message.style.color = "#f44336"
    }

    setTimeout(() => {
      gameState.currentIndex++
      nextQuestion()
    }, 1500)
  }

  function endGame() {
    clearInterval(gameState.timer)

    // Ekranları değiştir
    if (gameSection) gameSection.style.display = "none"
    if (gameOver) gameOver.style.display = "block"

    // Sonuçları hesapla
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)

    // Sonuç ikonunu ve başlığını ayarla
    if (resultIcon && resultTitle) {
      if (accuracy >= 80) {
        resultIcon.innerHTML = '<span class="material-icons">emoji_events</span>'
        resultTitle.textContent = "Excellent Work!"
      } else if (accuracy >= 60) {
        resultIcon.innerHTML = '<span class="material-icons">thumb_up</span>'
        resultTitle.textContent = "Good Job!"
      } else {
        resultIcon.innerHTML = '<span class="material-icons">school</span>'
        resultTitle.textContent = "Keep Practicing!"
      }
    }

    // Final skorunu göster
    if (finalScore) {
      finalScore.innerHTML = `
        <div style="font-size: 1.5rem; font-weight: 700; color: #3b82f6; margin-bottom: 0.5rem;">
          ${accuracy}% Accuracy
        </div>
        <div>Score: <strong>${gameState.score}</strong> / ${gameState.totalQuestions * 10}</div>
      `
    }

    // Grafikleri güncelle
    if (correctCount) correctCount.textContent = gameState.correctAnswers
    if (wrongCount) wrongCount.textContent = gameState.wrongAnswers

    setTimeout(() => {
      const correctPercentage = (gameState.correctAnswers / gameState.totalQuestions) * 100
      const wrongPercentage = (gameState.wrongAnswers / gameState.totalQuestions) * 100
      
      if (correctBar) correctBar.style.height = `${correctPercentage}%`
      if (wrongBar) wrongBar.style.height = `${wrongPercentage}%`
    }, 500)

    // Hata özetini göster
    if (wrongSummary) {
      if (gameState.wrongAnswers === 0) {
        wrongSummary.innerHTML = `
          <div style="text-align: center; color: #4CAF50; font-weight: 600;">
            🎉 Perfect Score! All answers were correct!
          </div>
        `
      } else {
        wrongSummary.innerHTML = `
          <h3>Review Your Performance</h3>
          <p>You got ${gameState.correctAnswers} out of ${gameState.totalQuestions} questions correct!</p>
        `
      }
    }
  }

  function resetGame() {
    clearInterval(gameState.timer)
    
    // Ekranları sıfırla
    if (levelSelect) levelSelect.style.display = "block"
    if (gameSection) gameSection.style.display = "none"
    if (gameOver) gameOver.style.display = "none"

    // Progress bar'ı sıfırla
    if (progressFill) progressFill.style.width = "0%"
    if (correctBar) correctBar.style.height = "0%"
    if (wrongBar) wrongBar.style.height = "0%"
  }

  // Event listener'lar
  if (startGameBtn) {
    startGameBtn.addEventListener("click", startGame)
  }

  if (playAgain) {
    playAgain.addEventListener("click", resetGame)
  }

  // Başlangıç durumu
  resetGame()
})