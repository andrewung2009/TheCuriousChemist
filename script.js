const container = document.getElementById("elements-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");

const animateBtn = document.getElementById("animate-btn");
const reactionAnimation = document.getElementById("reaction-animation");
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizFeedback = document.getElementById("quiz-feedback");

// Populate Group 1 elements
group1Metals.forEach(metal => {
    const div = document.createElement("div");
    div.className = "element group1";
    div.innerHTML = `<strong>${metal.symbol}</strong><br>${metal.number}`;
    div.addEventListener("click", () => showModal(metal));
    container.appendChild(div);
});

function showModal(metal) {
    document.getElementById("element-name").textContent = metal.name;
    document.getElementById("element-symbol").textContent = metal.symbol;
    document.getElementById("element-number").textContent = metal.number;
    document.getElementById("element-physical").textContent = metal.physical;
    document.getElementById("element-chemical").textContent = metal.chemical;
    document.getElementById("element-reactions").textContent = metal.reactions;

    // Clear previous animation and quiz
    reactionAnimation.innerHTML = '';
    quizFeedback.textContent = '';

    // Setup quiz
    quizQuestion.textContent = metal.quiz.question;
    quizOptions.innerHTML = '';
    metal.quiz.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.className = "quiz-btn";
        btn.addEventListener("click", () => checkAnswer(option, metal.quiz.answer));
        quizOptions.appendChild(btn);
    });

    modal.style.display = "block";

    // Reaction button
    animateBtn.onclick = () => showReactionAnimation(metal.symbol);
}

// Reaction animation function
function showReactionAnimation(symbol) {
    reactionAnimation.innerHTML = '';
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = "H₂ ↑";
    reactionAnimation.appendChild(bubble);

    // Animate bubble rising
    let position = 0;
    const interval = setInterval(() => {
        if (position >= 100) clearInterval(interval);
        position += 2;
        bubble.style.bottom = position + "px";
        bubble.style.opacity = 1 - position/120;
    }, 30);
}

// Quiz check
function checkAnswer(selected, correct) {
    quizFeedback.textContent = selected === correct ? "✅ Correct!" : "❌ Try again!";
}

// Close modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };
