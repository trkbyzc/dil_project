// Sentence Game - Cümle Ustası Oyunu

document.addEventListener("DOMContentLoaded", () => {
  // Soru havuzları
  const questionPools = {
    "A2": [
      { type: "fill", q: "I ___ a student.", a: "am", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "She ___ to school every day.", a: "goes", choices: ["go", "goes", "going", "gone"] },
      { type: "fill", q: "They ___ happy.", a: "are", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "He ___ a book.", a: "reads", choices: ["read", "reads", "reading", "readed"] },
      { type: "fill", q: "We ___ at home.", a: "are", choices: ["is", "am", "are", "be"] },
      { type: "fill", q: "It ___ cold today.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "fill", q: "My father ___ a doctor.", a: "is", choices: ["is", "are", "am", "be"] },
      { type: "fill", q: "The children ___ playing.", a: "are", choices: ["is", "are", "was", "were"] },
      { type: "fill", q: "I ___ coffee every morning.", a: "drink", choices: ["drink", "drinks", "drinking", "drank"] },
      { type: "fill", q: "She ___ English well.", a: "speaks", choices: ["speak", "speaks", "speaking", "spoke"] }
    ],
    "B1": [
      { type: "fill", q: "I ___ to the gym on Mondays.", a: "go", choices: ["go", "goes", "going", "gone"] },
      { type: "fill", q: "We ___ English for two years.", a: "have studied", choices: ["studied", "have studied", "studying", "study"] },
      { type: "fill", q: "She ___ coffee.", a: "doesn't like", choices: ["don't like", "doesn't like", "not like", "isn't like"] },
      { type: "fill", q: "They ___ never visited Istanbul.", a: "have", choices: ["has", "have", "had", "having"] },
      { type: "fill", q: "I ___ call you later.", a: "will", choices: ["will", "would", "shall", "should"] },
      { type: "fill", q: "The movie ___ very interesting.", a: "was", choices: ["is", "was", "were", "are"] },
      { type: "fill", q: "He ___ working here since 2020.", a: "has been", choices: ["is", "was", "has been", "have been"] },
      { type: "fill", q: "We ___ to the party yesterday.", a: "went", choices: ["go", "went", "gone", "going"] },
      { type: "fill", q: "She ___ finish her homework.", a: "must", choices: ["must", "can", "may", "might"] },
      { type: "fill", q: "I ___ seen this movie before.", a: "have", choices: ["has", "have", "had", "having"] }
    ],
    "B2-C1": [
      { type: "fill", q: "If I ___ more time, I would travel.", a: "had", choices: ["have", "had", "has", "having"] },
      { type: "fill", q: "She ___ three books so far.", a: "has written", choices: ["wrote", "has written", "writes", "writing"] },
      { type: "fill", q: "The results ___ announced tomorrow.", a: "will be", choices: ["will", "will be", "are", "is"] },
      { type: "fill", q: "He ___ to have finished the project.", a: "claims", choices: ["claim", "claims", "claimed", "claiming"] },
      { type: "fill", q: "They ___ the film yet.", a: "haven't seen", choices: ["didn't see", "haven't seen", "not see", "don't see"] },
      { type: "fill", q: "The book ___ by millions of people.", a: "has been read", choices: ["read", "was read", "has been read", "is reading"] },
      { type: "fill", q: "I wish I ___ speak French fluently.", a: "could", choices: ["can", "could", "would", "should"] },
      { type: "fill", q: "By next year, we ___ living here for 10 years.", a: "will have been", choices: ["will be", "will have been", "are", "have been"] },
      { type: "fill", q: "The meeting ___ postponed due to bad weather.", a: "was", choices: ["is", "was", "has been", "will be"] },
      { type: "fill", q: "She suggested that he ___ a doctor.", a: "see", choices: ["sees", "see", "saw", "seeing"] }
    ]
  }

  // Oyun durumu
  let gameState = {
    level: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 10,
    timeLeft: 0,
    maxTime: 0,
    timer: null,
    canAnswer: true,
    userAnswers: []
  }

  // DOM elementleri
  const levelSelect = document.getElementById("levelSelect")
  const gameSection = document.getElementById("gameSection")
  const gameOver = document.getElementById("gameOver")
  const startGameBtn = document.getElementById("startGame")
  const playAgainBtn = document.getElementById("playAgain")
  
  const questionText = document.getElementById("questionText")
  const choicesDiv = document.getElementById("choices")
  const feedback = document.getElementById("feedback")
  
  const questionNumSpan = document.getElementById("questionNum")
  const scoreSpan = document.getElementById("score")
  const timeSpan = document.getElementById("time")
  const progressFill = document.getElementById("progressFill")
  
  const finalScore = document.getElementById("finalScore")
  const correctBar = document.getElementById("correctBar")
  const wrongBar = document.getElementById("wrongBar")
  const correctCount = document.getElementById("correctCount")
  const wrongCount = document.getElementById("wrongCount")
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
      case "A2": return 10
      case "B1": return 8
      case "B2-C1": return 6
      default: return 8
    }
  }

  function updateUI() {
    if (questionNumSpan) questionNumSpan.textContent = gameState.currentIndex + 1
    if (scoreSpan) scoreSpan.textContent = gameState.score
    if (timeSpan) timeSpan.textContent = gameState.timeLeft
    
    // Progress bar güncelle
    const progress = ((gameState.currentIndex + 1) / gameState.totalQuestions) * 100
    if (progressFill) progressFill.style.width = `${progress}%`
  }

  // Oyun fonksiyonları
  function startGame() {
    const selectedLevel = document.querySelector('input[name="level"]:checked')?.value
    if (!selectedLevel) return

    // Oyun durumunu sıfırla
    gameState = {
      level: selectedLevel,
      questions: shuffle(questionPools[selectedLevel] || questionPools["A2"]).slice(0, 10),
      currentIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 10,
      timeLeft: 0,
      maxTime: getTimeForLevel(selectedLevel),
      timer: null,
      canAnswer: true,
      userAnswers: []
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
    const currentQuestion = gameState.questions[gameState.currentIndex]

    // Soruyu göster
    if (questionText) {
      questionText.innerHTML = currentQuestion.q
    }

    // Seçenekleri oluştur
    if (choicesDiv) {
      choicesDiv.innerHTML = ""
      currentQuestion.choices.forEach(choice => {
        const button = document.createElement("button")
        button.className = "choice-btn"
        button.textContent = choice
        button.onclick = () => selectChoice(choice, currentQuestion.a)
        choicesDiv.appendChild(button)
      })
    }

    // Feedback'i temizle
    if (feedback) {
      feedback.textContent = ""
      feedback.style.color = ""
    }

    // Timer'ı başlat
    gameState.timeLeft = gameState.maxTime
    updateUI()
    startTimer()
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

  function selectChoice(selectedChoice, correctAnswer) {
    if (!gameState.canAnswer) return

    gameState.canAnswer = false
    clearInterval(gameState.timer)

    const isCorrect = selectedChoice === correctAnswer

    // Tüm butonları devre dışı bırak ve renklendir
    const buttons = choicesDiv.querySelectorAll(".choice-btn")
    buttons.forEach(btn => {
      btn.disabled = true
      if (btn.textContent === correctAnswer) {
        btn.style.backgroundColor = "#4CAF50"
        btn.style.color = "white"
      } else if (btn.textContent === selectedChoice && !isCorrect) {
        btn.style.backgroundColor = "#f44336"
        btn.style.color = "white"
      }
    })

    if (isCorrect) {
      gameState.score += 10
      gameState.correctAnswers++
      if (feedback) {
        feedback.textContent = "Correct! 🎉"
        feedback.style.color = "#4CAF50"
      }
    } else {
      gameState.wrongAnswers++
      if (feedback) {
        feedback.textContent = `Wrong! Correct answer: ${correctAnswer}`
        feedback.style.color = "#f44336"
      }
    }

    // Cevabı kaydet
    gameState.userAnswers.push({
      question: gameState.questions[gameState.currentIndex],
      userAnswer: selectedChoice,
      isCorrect: isCorrect
    })

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

    const currentQuestion = gameState.questions[gameState.currentIndex]

    // Doğru cevabı göster
    const buttons = choicesDiv.querySelectorAll(".choice-btn")
    buttons.forEach(btn => {
      btn.disabled = true
      if (btn.textContent === currentQuestion.a) {
        btn.style.backgroundColor = "#4CAF50"
        btn.style.color = "white"
      }
    })

    if (feedback) {
      feedback.textContent = `Time's up! Correct answer: ${currentQuestion.a}`
      feedback.style.color = "#f44336"
    }

    // Cevabı kaydet
    gameState.userAnswers.push({
      question: currentQuestion,
      userAnswer: null,
      isCorrect: false,
      isTimeout: true
    })

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

    // Final skorunu göster
    if (finalScore) {
      finalScore.innerHTML = `
        Correct: <b>${gameState.correctAnswers}</b> / Wrong: <b>${gameState.wrongAnswers}</b><br>
        Score: <b>${gameState.score}</b><br>
        Accuracy: <b>${accuracy}%</b>
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
    showSummary()
  }

  function showSummary() {
    if (!wrongSummary) return

    const mistakes = gameState.userAnswers.filter(answer => !answer.isCorrect)

    if (mistakes.length === 0) {
      wrongSummary.innerHTML = "<h3>🎉 Congratulations! All questions correct!</h3>"
      return
    }

    let html = "<h3>Review Your Mistakes</h3><ul>"
    mistakes.forEach((mistake, index) => {
      const questionText = mistake.question.q
      const userAnswer = mistake.userAnswer || "No answer"
      const correctAnswer = mistake.question.a

      html += `
        <li style="margin-bottom: 1rem; padding: 1rem; border-left: 3px solid #f44336; background: #fafafa;">
          <div><strong>Question ${index + 1}:</strong> ${questionText}</div>
          <div><span style="color: #f44336;">Your answer:</span> ${userAnswer}</div>
          <div><span style="color: #4CAF50;">Correct answer:</span> ${correctAnswer}</div>
        </li>
      `
    })
    html += "</ul>"

    wrongSummary.innerHTML = html
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

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetGame)
  }

  // Başlangıç durumu
  resetGame()
})