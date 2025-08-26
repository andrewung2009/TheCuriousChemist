// Generate metal grid
const metalGrid = document.getElementById('metal-grid');
metalsData.forEach(metal => {
    const div = document.createElement('div');
    div.classList.add('metal');
    div.textContent = metal.symbol;
    div.addEventListener('mouseover', () => showMetalInfo(metal));
    metalGrid.appendChild(div);
});

function showMetalInfo(metal) {
    document.getElementById('metal-name').textContent = `${metal.name} (${metal.symbol})`;
    document.getElementById('metal-properties').innerHTML = `
        <strong>Atomic Number:</strong> ${metal.atomicNumber}<br>
        <strong>Density:</strong> ${metal.density}<br>
        <strong>Melting Point:</strong> ${metal.meltingPoint}<br>
        <strong>Reaction:</strong> ${metal.reaction}
    `;
}

// Quiz logic
const quizQuestions = [
    { question: "Which metal is the lightest?", options: ["Lithium","Sodium","Potassium","Rubidium"], answer: "Lithium" },
    { question: "Which metal reacts most violently with water?", options: ["Sodium","Potassium","Cesium","Lithium"], answer: "Cesium" },
    { question: "Symbol of Potassium?", options: ["P","Po","K","Pt"], answer: "K" }
];

let currentQuestion = 0;

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('quiz-question').textContent = q.question;
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => checkAnswer(opt));
        optionsDiv.appendChild(btn);
    });
    document.getElementById('quiz-feedback').textContent = '';
}

function checkAnswer(selected) {
    const correct = quizQuestions[currentQuestion].answer;
    const feedback = document.getElementById('quiz-feedback');
    if (selected === correct) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = `Wrong! Correct answer: ${correct}`;
        feedback.style.color = "red";
    }
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestion = (currentQuestion + 1) % quizQuestions.length;
    loadQuestion();
});

// Initialize quiz
loadQuestion();
