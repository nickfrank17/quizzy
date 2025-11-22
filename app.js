document.addEventListener("DOMContentLoaded", () => {

  // Quiz questions
  const questions = [
    { q: "What is the capital of Senegal?", options: ["Cape Town", "Dakar", "Maiduguri"], answer: "B" },
    { q: "What is X if; X - 2 = 0?", options: ["4", "6", "2"], answer: "C" },
    { q: "What class of food gives energy the most?", options: ["Fats and oil", "Carbohydrates", "Protein"], answer: "A" },
    { q: "The basic unit of life is?", options: ["Atom", "Cell", "Molecules"], answer: "B" },
    { q: "The richest man in Africa?", options: ["OTEDOLA", "DANGOTE", "ADELEKE"], answer: "B" },
    { q: "The capital of Germany is?", options: ["Yola", "Rome", "Berlin"], answer: "C" },
    { q: "The place called Ottawa is located in?", options: ["Argentina", "Canada", "Korea"], answer: "B" },
    { q: "The largest country in the world is?", options: ["China", "Russia", "Africa"], answer: "B" },
    { q: "An example of an omnivore is?", options: ["Pig", "Cheetah", "Horse"], answer: "A" },
    { q: "Pick an odd one from the options", options: ["Lionel Messi", "Martin Odegaard", "Bola Ahmed Tinubu"], answer: "C" },
  ];

  let currentQuestion = 0;
  const answers = new Array(questions.length).fill(null);
  let timeLeft = 20 * 60;
  let timerInterval = null;

  // DOM elements
  const startBtn = document.getElementById("startd-btn");
  const introDiv = document.getElementById("intro");
  const quizContainer = document.getElementById("quiz-container");
  const timerDisplay = document.getElementById("timer");
  const questionContainer = document.getElementById("question-container");
  const optionsDiv = document.getElementById("options");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resultContainer = document.getElementById("result-container");
  const reviewContainer = document.getElementById("review-container");

  // Start quiz
  startBtn.addEventListener("click", startQuiz);

  // Previous button
  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    }
  });

  // Next button
  nextBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      endQuiz();
    }
  });

  function startQuiz() {
    introDiv.classList.add("hidden");
    resultContainer.classList.add("hidden");
    reviewContainer.classList.add("hidden");
    quizContainer.classList.remove("hidden");

    currentQuestion = 0;
    timeLeft = 20 * 60;
    answers.fill(null);

    loadQuestion();
    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endQuiz();
      } else {
        updateTimerDisplay();
      }
    }, 1000);
  }

  function loadQuestion() {
    questionContainer.classList.remove("show");
    optionsDiv.classList.remove("show");

    optionsDiv.innerHTML = "";

    const q = questions[currentQuestion];
    questionContainer.innerText = `${currentQuestion + 1}. ${q.q}`;

    q.options.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i);

      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "8px";
      label.style.color = "#fff"; // ensure visible text in dark card

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "option";
      input.value = letter;
      input.id = `q${currentQuestion}_opt${i}`;

      if (answers[currentQuestion] === letter) input.checked = true;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + opt));
      optionsDiv.appendChild(label);
    });

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.innerText = currentQuestion === questions.length - 1 ? "Finish" : "Next";

    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = ((currentQuestion + 1) / questions.length * 100) + "%";

    setTimeout(() => {
      questionContainer.classList.add("show");
      optionsDiv.classList.add("show");
    }, 50);
  }

  function saveAnswer() {
    const selected = optionsDiv.querySelector('input[name="option"]:checked');
    answers[currentQuestion] = selected ? selected.value : null;
  }

  function updateTimerDisplay() {
    const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss = String(timeLeft % 60).padStart(2, "0");
    timerDisplay.innerText = `Time left: ${mm}:${ss}`;
  }

  function endQuiz() {
    if (timerInterval) clearInterval(timerInterval);
    saveAnswer();

    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    let score = 0;
    let reviewHTML = "";

    questions.forEach((q, idx) => {
      const userAns = answers[idx];
      const correctAns = q.answer;

      if (userAns === correctAns) score++;

      reviewHTML += `
        <div style="margin-bottom:12px;padding:10px;border-radius:8px;background:rgba(0,0,0,0.5); color:#fff;">
          <p><strong>Q${idx + 1}:</strong> ${q.q}</p>
          <p>Your answer: 
            <span style="color:${userAns === correctAns ? '#95d712' : '#ff5252'};">
              ${userAns || "No answer"}
            </span>
          </p>
          <p>Correct answer: <strong style="color:#95d712">${correctAns}</strong></p>
        </div>
      `;
    });

    resultContainer.innerHTML = `
      <h2>Quiz Completed!</h2>
      <p>Your score: <strong>${score}</strong> / ${questions.length}</p>
      <p>Percentage: <strong>${Math.round((score / questions.length) * 100)}%</strong></p>
      <div style="margin-top:15px;">
        <button id="review-btn">View Review</button>
        <button id="restart-btn">Redo</button>
      </div>
    `;

    reviewContainer.innerHTML = reviewHTML;

    document.getElementById("restart-btn").addEventListener("click", () => {
      resultContainer.classList.add("hidden");
      reviewContainer.classList.add("hidden");
      introDiv.classList.remove("hidden");
    });

    document.getElementById("review-btn").addEventListener("click", () => {
      reviewContainer.classList.toggle("hidden");
    });

    showConfetti();
  }

  function showConfetti() {
    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti-piece");
      confetti.style.left = Math.random() * window.innerWidth + "px";
      confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
      confetti.style.position = "absolute";
      confetti.style.width = "8px";
      confetti.style.height = "8px";
      confetti.style.top = "0px";
      confetti.style.borderRadius = "50%";
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    }
  }

});
