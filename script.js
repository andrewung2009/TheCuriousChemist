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

function createReaction(metal) {
    const area = document.getElementById('reaction-area');
    area.innerHTML = ''; // clear previous reaction

    let bubbleCount = 10; // number of bubbles
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = Math.random() * 90 + '%';
        bubble.style.animationDuration = 1.5 + Math.random() * 1.5 + 's';
        area.appendChild(bubble);
    }

    // Optional: background color change based on metal
    let colors = {
        "Lithium": "#fff0b3",
        "Sodium": "#ffe066",
        "Potassium": "#ffd633",
        "Rubidium": "#ffbf00",
        "Cesium": "#ffad00",
        "Francium": "#ff9900"
    };
    area.style.background = colors[metal.name] || "#e0f7ff";
}

// Add click listeners to metals
document.querySelectorAll('.metal').forEach(metalDiv => {
    metalDiv.addEventListener('click', () => {
        const metal = metalsData.find(m => m.symbol === metalDiv.textContent);
        createReaction(metal);
    });
});
