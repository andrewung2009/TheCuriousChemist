// Smooth scroll for Learn More button
document.getElementById("learnMoreBtn").addEventListener("click", () => {
  document.getElementById("overview").scrollIntoView({ behavior: "smooth" });
});

// Reaction Simulation
function simulateReaction(metal) {
  let output = document.getElementById("reactionOutput");
  output.innerHTML = "";

  if (metal === "Lithium") {
    output.innerHTML = "Lithium reacts slowly with water, fizzing gently and producing hydrogen gas.";
  } else if (metal === "Sodium") {
    output.innerHTML = "Sodium reacts vigorously, moving around on the surface of the water and fizzing strongly.";
  } else if (metal === "Potassium") {
    output.innerHTML = "Potassium reacts explosively, igniting with a lilac flame!";
  }
}

// Quiz Section
const quizData = [
  {
    question: "Which of these is the lightest alkali metal?",
    options: ["Sodium", "Lithium", "Potassium"],
    answer: "Lithium"
  },
  {
    question: "What color flame does Potassium produce?",
    options: ["Red", "Lilac", "Green"],
    answer: "Lilac"
  },
  {
    question: "What is common in all Group 1 metals?",
    options: ["They are gases", "They are very reactive", "They are unreactive"],
    answer: "They are very reactive"
  }
];

let currentQuestion = 0;
let score = 0;

function loadQuiz() {
  let q = quizData[currentQuestion];
  document.getElementById("quizQuestion").innerText = q.question;
  let optionsDiv = document.getElementById("quizOptions");
  optionsDiv.innerHTML = "";
  q.options.forEach(opt => {
    let btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  let q = quizData[currentQuestion];
  if (selected === q.answer) {
    score++;
    alert("Correct!");
  } else {
    alert("Wrong! Correct answer: " + q.answer);
  }
}

document.getElementById("nextBtn").addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuiz();
  } else {
    document.getElementById("quizResult").innerText = 
      `Quiz completed! Your score: ${score}/${quizData.length}`;
    document.getElementById("quizContainer").style.display = "none";
  }
});

// Load first quiz question
loadQuiz();
