function showSection(id) {
  document.querySelectorAll("main section").forEach(sec => {
    sec.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// Periodic Table info
function showElement(symbol) {
  const info = {
    "Li": "Lithium (Li, Z=3): Soft, reacts slowly with water.",
    "Na": "Sodium (Na, Z=11): Reacts vigorously, moves on water.",
    "K": "Potassium (K, Z=19): Very reactive, lilac flame.",
    "Rb": "Rubidium (Rb, Z=37): Explosive reaction with water.",
    "Cs": "Cesium (Cs, Z=55): Extremely reactive, can explode on contact.",
    "Fr": "Francium (Fr, Z=87): Highly radioactive, rare."
  };
  const box = document.getElementById("element-info");
  box.style.display = "block";
  box.innerHTML = info[symbol];
}

// Reactions
function simulateReaction(metal) {
  const output = document.getElementById("reaction-output");
  if (metal === "Lithium") {
    output.innerHTML = "Lithium reacts gently with water, releasing hydrogen gas.";
  } else if (metal === "Sodium") {
    output.innerHTML = "Sodium reacts vigorously, fizzing and moving around.";
  } else if (metal === "Potassium") {
    output.innerHTML = "Potassium reacts explosively with sparks and lilac flame!";
  }
}

// Quiz
function checkAnswer(answer) {
  const result = document.getElementById("quiz-result");
  if (answer === "Cesium") {
    result.innerHTML = "✅ Correct! Cesium is the most reactive.";
  } else {
    result.innerHTML = "❌ Try again!";
  }
}
