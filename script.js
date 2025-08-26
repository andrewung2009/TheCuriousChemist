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

// Reaction Simulation
function createReaction(metal) {
    const area = document.getElementById('reaction-area');
    area.innerHTML = ''; // clear previous reaction

    // Show chemical equation
    const eq = document.createElement('p');
    eq.innerHTML = `<strong>Equation:</strong> ${metal.equation}`;
    eq.style.fontWeight = "bold";
    area.appendChild(eq);

    // Show explanation
    const expl = document.createElement('p');
    expl.textContent = metal.explanation;
    area.appendChild(expl);

    // Simulate H2 bubbles (optional)
    let bubbleCount = 5; // fewer bubbles, labeled H2
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.textContent = "H2";
        bubble.style.left = 10 + i * 15 + "%";
        bubble.style.animationDuration = 2 + Math.random() * 1 + 's';
        bubble.style.fontSize = "10px";
        bubble.style.textAlign = "center";
        bubble.style.color = "#000";
        area.appendChild(bubble);
    }

    // Background color represents hydroxide solution
    const colors = {
        "Lithium": "#e6f7ff",
        "Sodium": "#ccf2ff",
        "Potassium": "#b3ecff",
        "Rubidium": "#99e6ff",
        "Cesium": "#80dfff",
        "Francium": "#66d9ff"
    };
    area.style.background = colors[metal.name] || "#e0f7ff";
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
