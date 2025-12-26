// Voice Pronunciation - Telaffuz Oyunu

document.addEventListener("DOMContentLoaded", () => {
  // Cümle havuzları
  const sentencePools = {
    "A1-A2": [
      { tr: "Ben her sabah kahve içerim.", en: "I drink coffee every morning" },
      { tr: "O bir öğretmen.", en: "She is a teacher" },
      { tr: "Bu bir kalem.", en: "This is a pen" },
      { tr: "Masada bir kitap var.", en: "There is a book on the table" },
      { tr: "Onlar okulda.", en: "They are at school" },
      { tr: "Ben mutluyum.", en: "I am happy" },
      { tr: "O araba kullanıyor.", en: "He is driving a car" },
      { tr: "Biz evdeyiz.", en: "We are at home" },
      { tr: "Köpek koşuyor.", en: "The dog is running" },
      { tr: "Bu çok güzel.", en: "This is very beautiful" }
    ],
    "B1-B2": [
      { tr: "Ben bu filmi daha önce izledim.", en: "I have seen this movie before" },
      { tr: "Dün sinemaya gittik.", en: "We went to the cinema yesterday" },
      { tr: "O İngilizce konuşabilir.", en: "He can speak English" },
      { tr: "O kitabı henüz bitirmedi.", en: "She hasn't finished the book yet" },
      { tr: "Bu odaya girmemelisin.", en: "You must not enter this room" },
      { tr: "Onlar çok çalışıyorlar.", en: "They are working very hard" },
      { tr: "Yarın toplantıya katılacağım.", en: "I will attend the meeting tomorrow" },
      { tr: "Film oldukça ilginçti.", en: "The movie was quite interesting" },
      { tr: "Araba tamir ediliyor.", en: "The car is being repaired" },
      { tr: "O hiç İstanbul'u ziyaret etmedi.", en: "He has never visited Istanbul" }
    ],
    "C1-C2": [
      { tr: "Daha fazla çalışsaydım, sınavı geçerdim.", en: "If I had studied more, I would have passed the exam" },
      { tr: "Toplantı ertelendi.", en: "The meeting was postponed" },
      { tr: "O kitabı yazan adam İngilizmiş.", en: "The man who wrote that book was English" },
      { tr: "İşini zamanında bitirmiş olmalı.", en: "He must have finished his work on time" },
      { tr: "Bu sorular genellikle öğrenciler tarafından sorulur.", en: "These questions are often asked by students" },
      { tr: "Eğer zamanım olsaydı, sana yardım ederdim.", en: "If I had time, I would help you" },
      { tr: "Projeyi zamanında tamamlamış olmalı.", en: "He must have completed the project on time" },
      { tr: "O konuşmayı yapmadan önce çok hazırlandı.", en: "She prepared a lot before giving the speech" },
      { tr: "Hiç böyle karmaşık bir problem çözmedim.", en: "I have never solved such a complex problem" },
      { tr: "Sorular genellikle öğrencilere sorulur.", en: "The questions are usually asked to students" }
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
    maxTime: 15,
    timer: null,
    isListening: false,
    userAnswers: []
  }

  // Speech Recognition kurulumu
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  let recognition = null

  if (SpeechRecognition) {
    recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false
  }

  // DOM elementleri
  const levelSelect = document.getElementById("levelSelect")
  const gameSection = document.getElementById("gameSection")
  const gameOver = document.getElementById("gameOver")
  const startGameBtn = document.getElementById("startGame")
  const playAgainBtn = document.getElementById("playAgain")
  
  const turkish = document.getElementById("turkish")
  const expectedSentence = document.getElementById("expectedSentence")
  const startBtn = document.getElementById("startBtn")
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
    return text.toLowerCase()
      .replace(/[.,!?'"]/g, "")
      .replace(/\s+/g, " ")
      .trim()
  }

  function calculateSimilarity(str1, str2) {
    const s1 = normalize(str1)
    const s2 = normalize(str2)
    
    if (s1 === s2) return 100
    
    // Basit kelime eşleştirme
    const words1 = s1.split(" ")
    const words2 = s2.split(" ")
    const maxLength = Math.max(words1.length, words2.length)
    
    if (maxLength === 0) return 0
    
    let matches = 0
    words1.forEach(word => {
      if (words2.includes(word)) matches++
    })
    
    return Math.round((matches / maxLength) * 100)
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
    if (!recognition) {
      alert("Ses tanıma özelliği tarayıcınızda desteklenmiyor. Lütfen Chrome veya Edge kullanın.")
      return
    }

    const selectedLevel = document.querySelector('input[name="level"]:checked')?.value
    if (!selectedLevel) return

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
      maxTime: 15,
      timer: null,
      isListening: false,
      userAnswers: []
    }

    // Ekranları değiştir
    if (levelSelect) levelSelect.style.display = "none"
    if (gameSection) gameSection.style.display = "block"
    if (gameOver) gameOver.style.display = "none"

    // UI'ı güncelle
    if (totalQuestions) totalQuestions.textContent = gameState.totalQuestions

    // İlk cümleyi başlat
    nextSentence()
  }

  function nextSentence() {
    if (gameState.currentIndex >= gameState.totalQuestions) {
      endGame()
      return
    }

    // Mevcut cümleyi al
    const currentSentence = gameState.sentences[gameState.currentIndex]
    if (turkish) turkish.textContent = currentSentence.tr
    if (expectedSentence) expectedSentence.textContent = `Beklenen: "${currentSentence.en}"`

    // Buton durumunu sıfırla
    if (startBtn) {
      startBtn.disabled = false
      startBtn.classList.remove("listening")
      const buttonText = startBtn.querySelector(".button-text")
      if (buttonText) buttonText.textContent = "Konuşmaya Başla"
    }

    // Feedback'i temizle
    if (feedback) {
      feedback.textContent = ""
      feedback.className = "feedback-message"
    }

    // Timer'ı başlat
    gameState.timeLeft = gameState.maxTime
    gameState.isListening = false
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
        if (gameState.isListening && recognition) {
          recognition.stop()
        }
        handleResult(null, true) // timeout = true
      }
    }, 1000)
  }

  function startListening() {
    if (!recognition || gameState.isListening) return

    gameState.isListening = true
    
    if (startBtn) {
      startBtn.classList.add("listening")
      startBtn.disabled = true
      const buttonText = startBtn.querySelector(".button-text")
      if (buttonText) buttonText.textContent = "Dinleniyor..."
    }

    if (feedback) {
      feedback.textContent = "🎤 Dinliyorum... Lütfen konuşun"
      feedback.className = "feedback-message listening"
    }

    try {
      recognition.start()
    } catch (error) {
      console.error("Ses tanıma başlatılamadı:", error)
      gameState.isListening = false
      if (startBtn) {
        startBtn.classList.remove("listening")
        startBtn.disabled = false
        const buttonText = startBtn.querySelector(".button-text")
        if (buttonText) buttonText.textContent = "Konuşmaya Başla"
      }
    }
  }

  function handleResult(spokenText, isTimeout = false) {
    gameState.isListening = false
    clearInterval(gameState.timer)

    if (startBtn) {
      startBtn.classList.remove("listening")
      startBtn.disabled = true
    }

    const currentSentence = gameState.sentences[gameState.currentIndex]
    const expectedText = currentSentence.en

    let isCorrect = false
    let similarity = 0

    if (!isTimeout && spokenText) {
      similarity = calculateSimilarity(spokenText, expectedText)
      isCorrect = similarity >= 70 // %70 benzerlik yeterli
    }

    if (isCorrect) {
      gameState.score += 20
      gameState.correctAnswers++
      
      if (feedback) {
        feedback.innerHTML = `✅ Mükemmel telaffuz! (Benzerlik: %${similarity})`
        feedback.className = "feedback-message correct"
      }
    } else {
      gameState.wrongAnswers++
      
      if (feedback) {
        if (isTimeout) {
          feedback.innerHTML = `⏰ Süre bitti!<br><strong>Beklenen:</strong> ${expectedText}`
        } else if (!spokenText) {
          feedback.innerHTML = `❌ Ses algılanamadı!<br><strong>Beklenen:</strong> ${expectedText}`
        } else {
          feedback.innerHTML = `❌ Telaffuz geliştirilebilir (Benzerlik: %${similarity})<br><strong>Söylediğiniz:</strong> "${spokenText}"<br><strong>Beklenen:</strong> ${expectedText}`
        }
        feedback.className = "feedback-message wrong"
      }
    }

    // Cevabı kaydet
    gameState.userAnswers.push({
      turkish: currentSentence.tr,
      expected: expectedText,
      spoken: spokenText || null,
      similarity: similarity,
      isCorrect: isCorrect,
      isTimeout: isTimeout
    })

    updateUI()

    // Sonraki cümleye geç
    setTimeout(() => {
      gameState.currentIndex++
      nextSentence()
    }, 3000)
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
          🎉 Mükemmel! Tüm telaffuzlar doğru!
        </div>
      `
      return
    }

    let html = "<h3>Telaffuz Hatalarını İncele:</h3><ul>"
    mistakes.forEach((mistake, index) => {
      html += `
        <li style="margin-bottom: 1rem; padding: 1rem; border-left: 3px solid #f44336; background: #fafafa;">
          <div><strong>Türkçe:</strong> ${mistake.turkish}</div>
          <div><strong>Söylediğiniz:</strong> <span style="color: #f44336;">${mistake.spoken || "Ses algılanamadı"}</span></div>
          <div><strong>Beklenen:</strong> <span style="color: #4CAF50;">${mistake.expected}</span></div>
          ${mistake.similarity > 0 ? `<div><strong>Benzerlik:</strong> %${mistake.similarity}</div>` : ""}
        </li>
      `
    })
    html += "</ul>"

    mistakeSummary.innerHTML = html
  }

  function resetGame() {
    clearInterval(gameState.timer)
    gameState.isListening = false
    
    if (recognition) {
      try {
        recognition.stop()
      } catch (error) {
        // Ses tanıma zaten durdurulmuş
      }
    }
    
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

  // Speech Recognition Event Listener'ları
  if (recognition) {
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      handleResult(spokenText)
    }

    recognition.onerror = (event) => {
      console.error("Ses tanıma hatası:", event.error)
      gameState.isListening = false
      
      if (startBtn) {
        startBtn.classList.remove("listening")
        startBtn.disabled = false
        const buttonText = startBtn.querySelector(".button-text")
        if (buttonText) buttonText.textContent = "Konuşmaya Başla"
      }

      if (feedback) {
        feedback.innerHTML = `⚠️ Ses tanıma hatası: ${event.error}. Lütfen tekrar deneyin.`
        feedback.className = "feedback-message wrong"
      }
    }

    recognition.onend = () => {
      if (gameState.isListening) {
        // Beklenmedik şekilde durdu, kullanıcıya bildir
        gameState.isListening = false
        if (startBtn) {
          startBtn.classList.remove("listening")
          startBtn.disabled = false
          const buttonText = startBtn.querySelector(".button-text")
          if (buttonText) buttonText.textContent = "Konuşmaya Başla"
        }
      }
    }
  }

  // Event listener'lar
  if (startGameBtn) {
    startGameBtn.addEventListener("click", startGame)
  }

  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", resetGame)
  }

  if (startBtn) {
    startBtn.addEventListener("click", startListening)
  }

  // Başlangıç durumu
  resetGame()
})