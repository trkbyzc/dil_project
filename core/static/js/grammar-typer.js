// Grammar Typer - Gramer Yazma Oyunu

document.addEventListener("DOMContentLoaded", () => {
  console.log("Grammar Typer loaded!")
  
  // Cümle havuzları
  const sentencePools = {
    "A1-A2": [
      { tr: "Ben öğrenciyim.", en: "I am a student" },
      { tr: "Bu bir elma.", en: "This is an apple" },
      { tr: "O mutlu.", en: "He is happy" },
      { tr: "Biz evdeyiz.", en: "We are at home" },
      { tr: "Köpek koşuyor.", en: "The dog is running" },
      { tr: "Onlar okuldalar.", en: "They are at school" },
      { tr: "Ben kitap okuyorum.", en: "I am reading a book" },
      { tr: "O bir öğretmen.", en: "She is a teacher" },
      { tr: "Biz mutluyuz.", en: "We are happy" },
      { tr: "Bu bir kalem.", en: "This is a pen" }
    ],
    "B1-B2": [
      { tr: "Ben bu kitabı daha önce okudum.", en: "I have read this book before" },
      { tr: "Yarın toplantıya katılacağım.", en: "I will attend the meeting tomorrow" },
      { tr: "Onlar hiç İstanbul'u ziyaret etmedi.", en: "They have never visited Istanbul" },
      { tr: "Araba tamir ediliyor.", en: "The car is being repaired" },
      { tr: "Film oldukça ilginçti.", en: "The movie was quite interesting" },
      { tr: "O İngilizce konuşabilir.", en: "He can speak English" },
      { tr: "Dün sinemaya gittik.", en: "We went to the cinema yesterday" },
      { tr: "O kitabı henüz bitirmedi.", en: "She hasn't finished the book yet" },
      { tr: "Bu odaya girmemelisin.", en: "You must not enter this room" },
      { tr: "Onlar çok çalışıyorlar.", en: "They are working very hard" }
    ],
    "C1-C2": [
      { tr: "Eğer zamanım olsaydı, sana yardım ederdim.", en: "If I had time, I would help you" },
      { tr: "Projeyi zamanında tamamlamış olmalı.", en: "He must have completed the project on time" },
      { tr: "Sorular genellikle öğrencilere sorulur.", en: "The questions are usually asked to students" },
      { tr: "O konuşmayı yapmadan önce çok hazırlandı.", en: "She prepared a lot before giving the speech" },
      { tr: "Hiç böyle karmaşık bir problem çözmedim.", en: "I have never solved such a complex problem" },
      { tr: "Toplantı ertelendi.", en: "The meeting was postponed" },
      { tr: "O kitabı yazan adam İngilizmiş.", en: "The man who wrote that book was English" },
      { tr: "İşini zamanında bitirmiş olmalı.", en: "He must have finished his work on time" },
      { tr: "Bu sorular genellikle öğrenciler tarafından sorulur.", en: "These questions are often asked by students" },
      { tr: "Daha fazla çalışsaydım, sınavı geçerdim.", en: "If I had studied more, I would have passed the exam" }
    ]
  }

  // Oyun durumu
  let gameState = {
    level: null,
    sentences: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    totalQuestions: 5,
    timeLeft: 0,
    maxTime: 0,
    timer: null,
    userAnswers: []
  }

  // DOM elementleri
  const levelSelect = document.getElementById("levelSelect")
  const gameSection = document.getElementById("gameSection")
  const gameOver = document.getElementById("gameOver")
  const startGameBtn = document.getElementById("startGame")
  const playAgainBtn = document.getElementById("playAgain")
  
  console.log("DOM Elements found:")
  console.log("levelSelect:", levelSelect)
  console.log("gameSection:", gameSection)
  console.log("gameOver:", gameOver)
  console.log("startGameBtn:", startGameBtn)
  
  const turkishSentence = document.getElementById("turkishSentence")
  const userInput = document.getElementById("userInput")
  const submitBtn = document.getElementById("submitAnswer")
  const feedback = document.getElementById("feedback")
  
  const progressFill = document.getElementById("progressFill")
  const questionNum = document.getElementById("questionNum")
  const totalQuestions = document.getElementById("totalQuestions")
  const scoreSpan = document.getElementById("score")
  const timeSpan = document.getElementById("time")
  const timerCircle = document.getElementById("timerCircle")
  
  const finalScore = document.getElementById("finalScore")
  const correctBar = document.getElementById("correctBar")
  const wrongBar = document.getElementById("wrongBar")
  const correctCount = document.getElementById("correctCount")
  const wrongCount = document.getElementById("wrongCount")
  const mistakeSummary = document.getElementById("mistakeSummary")

  // Yardımcı fonksiyonlar
  function shuffle(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  function normalize(text) {
    return text.toLowerCase().replace(/[.,!?'"]/g, "").trim()
  }

  function getTimeForLevel(level) {
    switch(level) {
      case "A1-A2": return 15
      case "B1-B2": return 20
      case "C1-C2": return 25
      default: return 15
    }
  }

  function updateProgress() {
    const progress = ((gameState.currentIndex + 1) / gameState.totalQuestions) * 100
    if (progressFill) progressFill.style.width = `${progress}%`
    if (questionNum) questionNum.textContent = gameState.currentIndex + 1
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
    console.log("Start game clicked!")
    
    const selectedLevel = document.querySelector('input[name="level"]:checked')?.value
    console.log("Selected level:", selectedLevel)
    
    if (!selectedLevel) {
      console.log("No level selected!")
      return
    }

    // Oyun durumunu sıfırla
    gameState = {
      level: selectedLevel,
      sentences: shuffle(sentencePools[selectedLevel]).slice(0, 5),
      currentIndex: 0,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalQuestions: 5,
      timeLeft: 0,
      maxTime: getTimeForLevel(selectedLevel),
      timer: null,
      userAnswers: []
    }

    console.log("Game state initialized:", gameState)

    // Ekranları değiştir
    if (levelSelect) {
      levelSelect.style.display = "none"
      console.log("Level select hidden")
    }
    if (gameSection) {
      gameSection.style.display = "block"
      console.log("Game section shown")
    }
    if (gameOver) {
      gameOver.style.display = "none"
      console.log("Game over hidden")
    }

    // UI'ı güncelle
    if (totalQuestions) totalQuestions.textContent = gameState.totalQuestions

    // İlk soruyu başlat
    nextSentence()
  }

  function nextSentence() {
    console.log("Next sentence called, index:", gameState.currentIndex)
    
    if (gameState.currentIndex >= gameState.totalQuestions) {
      endGame()
      return
    }

    // Mevcut cümleyi al
    const currentSentence = gameState.sentences[gameState.currentIndex]
    console.log("Current sentence:", currentSentence)
    
    if (turkishSentence) turkishSentence.textContent = currentSentence.tr

    // Input'u temizle ve odaklan
    if (userInput) {
      userInput.value = ""
      userInput.focus()
      userInput.disabled = false
    }

    if (submitBtn) submitBtn.disabled = false

    // Feedback'i temizle
    if (feedback) {
      feedback.textContent = ""
      feedback.className = "feedback-message"
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
        handleSubmit(true) // timeout = true
      }
    }, 1000)
  }

  function handleSubmit(isTimeout = false) {
    console.log("Handle submit called, timeout:", isTimeout)
    
    clearInterval(gameState.timer)

    const currentSentence = gameState.sentences[gameState.currentIndex]
    const userAnswer = userInput ? userInput.value.trim() : ""
    const correctAnswer = currentSentence.en

    // Input'u devre dışı bırak
    if (userInput) userInput.disabled = true
    if (submitBtn) submitBtn.disabled = true

    let isCorrect = false
    
    if (!isTimeout && userAnswer && normalize(userAnswer) === normalize(correctAnswer)) {
      isCorrect = true
      gameState.score += 20
      gameState.correctAnswers++
      
      if (feedback) {
        feedback.textContent = "Mükemmel! ✅"
        feedback.className = "feedback-message correct"
      }
    } else {
      gameState.wrongAnswers++
      
      if (feedback) {
        if (isTimeout) {
          feedback.innerHTML = `⏰ Süre bitti!<br><strong>Doğru cevap:</strong> ${correctAnswer}`
        } else if (!userAnswer) {
          feedback.innerHTML = `❌ Boş cevap!<br><strong>Doğru cevap:</strong> ${correctAnswer}`
        } else {
          feedback.innerHTML = `❌ Yanlış!<br><strong>Doğru cevap:</strong> ${correctAnswer}`
        }
        feedback.className = "feedback-message wrong"
      }
    }

    // Cevabı kaydet
    gameState.userAnswers.push({
      turkish: currentSentence.tr,
      correct: correctAnswer,
      user: userAnswer || null,
      isCorrect: isCorrect,
      isTimeout: isTimeout
    })

    updateUI()

    // Sonraki soruya geç
    setTimeout(() => {
      gameState.currentIndex++
      nextSentence()
    }, 2000)
  }

  function endGame() {
    console.log("End game called")
    
    clearInterval(gameState.timer)

    // Ekranları değiştir
    if (gameSection) gameSection.style.display = "none"
    if (gameOver) gameOver.style.display = "block"

    // Sonuçları hesapla
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100)

    // Final skorunu göster
    if (finalScore) {
      finalScore.innerHTML = `
        <div>Skor: <strong>${gameState.score}</strong> / ${gameState.totalQuestions * 20}</div>
        <div>Doğruluk: <strong>%${accuracy}</strong></div>
        <div>Doğru: <strong>${gameState.correctAnswers}</strong> / Yanlış: <strong>${gameState.wrongAnswers}</strong></div>
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
    showMistakeSummary()
  }

  function showMistakeSummary() {
    if (!mistakeSummary) return

    const mistakes = gameState.userAnswers.filter(answer => !answer.isCorrect)

    if (mistakes.length === 0) {
      mistakeSummary.innerHTML = `
        <div style="text-align: center; color: #4CAF50; font-weight: 600;">
          🎉 Mükemmel! Tüm çeviriler doğru!
        </div>
      `
      return
    }

    let html = "<h3>Hataları İncele:</h3><ul>"
    mistakes.forEach((mistake, index) => {
      html += `
        <li style="margin-bottom: 1rem; padding: 1rem; border-left: 3px solid #f44336; background: #fafafa;">
          <div><strong>Türkçe:</strong> ${mistake.turkish}</div>
          <div><strong>Senin cevabın:</strong> <span style="color: #f44336;">${mistake.user || "Cevap verilmedi"}</span></div>
          <div><strong>Doğru cevap:</strong> <span style="color: #4CAF50;">${mistake.correct}</span></div>
        </li>
      `
    })
    html += "</ul>"

    mistakeSummary.innerHTML = html
  }

  function resetGame() {
    console.log("Reset game called")
    
    clearInterval(gameState.timer)
    
    // Ekranları sıfırla
    if (levelSelect) levelSelect.style.display = "block"
    if (gameSection) gameSection.style.display = "none"
    if (gameOver) gameOver.style.display = "none"

    // Progress bar'ı sıfırla
    if (progressFill) progressFill.style.width = "0%"
    if (correctBar) correctBar.style.height = "0%"
    if (wrongBar) wrongBar.style.height = "0%"
    if (timerCircle) timerCircle.style.strokeDashoffset = "283"
  }

  // Event listener'lar
  if (startGameBtn) {
    console.log("Adding click listener to start button")
    startGameBtn.addEventListener("click", startGame)
  } else {
    console.log("Start button not found!")
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetGame)
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", () => handleSubmit())
  }

  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !submitBtn.disabled) {
        handleSubmit()
      }
    })
  }

  // Başlangıç durumu
  resetGame()
  console.log("Grammar Typer initialization complete!")
})