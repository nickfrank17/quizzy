document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    { q: "What is the capital of Senegal?", options: ["Cape Town", "Dakar", "Maiduguri"], answer: "B" },
    { q: "What is X if; X - 2 = 0?", options: ["4", "6", "2"], answer: "C" },
    { q: "What class of food gives energy the most?", options: ["Fats and oil", "Carbohydrates", "Protein"], answer: "A" },
    { q: "The basic unit of life is?", options: ["Atom", "Cell", "Molecules"], answer: "B" },
    { q: "The richest man in africa?", options: ["OTEDOLA", "DANGOTE", "ADELEKE"], answer: "B" },
    { q: "The capital of Germany is?", options: ["Yola", "Rome", "Berlin"], answer: "C" },
    { q: "The place called Ottawa is located in?", options: ["Argentina", "Canada", "Korea"], answer: "B" },
    { q: "The largest country in the world is?", options: ["China", "Russia", "Africa"], answer: "B" },
    { q: "An example of an omnivore is?", options: ["Pig", "Cheetah", "Horse"], answer: "A" },
    { q: "Pick an odd one from the options", options: ["Lionel Messi", "Martin Odegaard", "Bola Ahmed Tinubu"], answer: "C" },
  ];

  let currentQuestion = 0;
  const answers = new Array(questions.length).fill(null);
  let timeLeft = 20 * 60; // seconds
  let timerInterval = null;

  const startBtn = document.getElementById("startd-btn");
  const introDiv = document.getElementById("intro");
  const quizContainer = document.getElementById("quiz-container");
  const timerDisplay = document.getElementById("timer");
  const questionContainer = document.getElementById("question-container");
  const optionsDiv = document.getElementById("options");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const resultContainer = document.getElementById("result-container");

  if (!startBtn || !quizContainer || !questionContainer || !optionsDiv || !prevBtn || !nextBtn || !timerDisplay || !resultContainer) {
    console.error("Missing one or more required DOM elements. Check your HTML IDs.");
    return;
  }

  startBtn.addEventListener("click", startQuiz);
  prevBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    }
  });
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
    quizContainer.classList.remove("hidden");

    currentQuestion = 0;
    timeLeft =  20* 60;
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
    optionsDiv.innerHTML = "";

    const q = questions[currentQuestion];
    questionContainer.innerText = `${currentQuestion + 1}. ${q.q}`;

    q.options.forEach((opt, i) => {
      const letter = String.fromCharCode(65 + i); 
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "8px";

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
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    saveAnswer();
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");

    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    resultContainer.innerHTML = `
      <h2>Congrats!</h2>
      <p>Your score: <strong>${score}</strong> / ${questions.length}</p>
      <div style="margin-top:12px;">
        <button id="restart-btn">Redo</button>
      </div>
    `;

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        resultContainer.classList.add("hidden");
        introDiv.classList.remove("hidden");
      });
    }
  }

  introDiv.classList.remove("hidden");
  quizContainer.classList.add("hidden");
  resultContainer.classList.add("hidden");
  updateTimerDisplay();
});