// Element details
const elementDetails = {
    'Beryllium': {
        symbol: 'Be',
        atomicNumber: 4,
        electronConfig: '2,2',
        meltingPoint: '1287°C',
        density: '1.85 g/cm³',
        reactivity: 'Lowest in group',
        uses: 'Aerospace alloys, X-ray windows, nuclear reactors',
        fact: 'Beryllium is transparent to X-rays and is used in X-ray windows.',
        quizQuestion: "What is the primary use of Beryllium in aerospace applications?",
        quizOptions: [
            "Fuel for rockets",
            "Lightweight structural alloys",
            "Thermal insulation",
            "Electrical wiring"
        ],
        quizCorrect: 1,
        quizExplanation: "Beryllium is used in lightweight structural alloys for aerospace applications due to its high strength-to-weight ratio and stiffness."
    },
    'Magnesium': {
        symbol: 'Mg',
        atomicNumber: 12,
        electronConfig: '2,8,2',
        meltingPoint: '650°C',
        density: '1.74 g/cm³',
        reactivity: 'Moderate',
        uses: 'Alloys, fireworks, medicine',
        fact: 'Magnesium is essential for human health and is involved in over 300 biochemical reactions.',
        quizQuestion: "What compound of Magnesium is commonly used as a supplement?",
        quizOptions: [
            "Magnesium hydroxide",
            "Magnesium carbonate",
            "Magnesium oxide",
            "Magnesium sulfate"
        ],
        quizCorrect: 2,
        explanation: "Magnesium oxide is commonly used as a dietary supplement to prevent and treat low levels of magnesium in the blood."
    },
    'Calcium': {
        symbol: 'Ca',
        atomicNumber: 20,
        electronConfig: '2,8,8,2',
        meltingPoint: '842°C',
        density: '1.55 g/cm³',
        reactivity: 'Moderate to high',
        uses: 'Building materials, cement, bones',
        fact: 'Calcium is the most abundant mineral in the human body and is essential for bone health.',
        quizQuestion: "Why is Calcium important for the human body?",
        quizOptions: [
            "It strengthens bones and teeth",
            "It aids in muscle contraction and nerve function",
            "It helps in blood clotting",
            "All of the above"
        ],
        quizCorrect: 3,
        quizExplanation: "Calcium is essential for all these functions: strengthening bones and teeth, muscle contraction, nerve function, and blood clotting."
    },
    'Strontium': {
        symbol: 'Sr',
        atomicNumber: 38,
        electronConfig: '2,8,18,8,2',
        meltingPoint: '777°C',
        density: '2.64 g/cm³',
        reactivity: 'High',
        uses: 'Fireworks, ceramics, magnets',
        fact: 'Strontium-90 is a radioactive isotope used in medical applications and nuclear power.',
        quizQuestion: "What is Strontium primarily used for in fireworks?",
        quizOptions: [
            "Creating white sparks",
            "Creating red color",
            "Creating blue color",
            "Creating sound effects"
        ],
        quizCorrect: 1,
        quizExplanation: "Strontium compounds are used in fireworks to create a brilliant red color due to their characteristic crimson flame."
    },
    'Barium': {
        symbol: 'Ba',
        atomicNumber: 56,
        electronConfig: '2,8,18,18,8,2',
        meltingPoint: '727°C',
        density: '3.62 g/cm³',
        reactivity: 'Very high',
        uses: 'Medical imaging, drilling fluids, vacuum tubes',
        fact: 'Barium sulfate is used in medical imaging because it\'s opaque to X-rays but safe to ingest.',
        quizQuestion: "Why is Barium sulfate used in medical imaging?",
        quizOptions: [
            "It's radioactive and can be tracked",
            "It's opaque to X-rays but safe to ingest",
            "It enhances MRI contrast",
            "It's fluorescent under UV light"
        ],
        quizCorrect: 1,
        quizExplanation: "Barium sulfate is used in medical imaging because it's opaque to X-rays, allowing doctors to see the digestive tract, but it's insoluble and safe to ingest."
    },
    'Radium': {
        symbol: 'Ra',
        atomicNumber: 88,
        electronConfig: '2,8,18,32,18,8,2',
        meltingPoint: '700°C',
        density: '5.5 g/cm³',
        reactivity: 'Highest',
        uses: 'Cancer treatment, research',
        fact: 'Radium is highly radioactive and was discovered by Marie and Pierre Curie in 1898.',
        quizQuestion: "Why is Radium rarely used today?",
        quizOptions: [
            "It's too expensive to extract",
            "It's highly radioactive and dangerous",
            "It's not reactive enough",
            "It's toxic to humans"
        ],
        quizCorrect: 1,
        quizExplanation: "Radium is highly radioactive and dangerous to handle, which limits its use to specialized medical and research applications."
    }
};

// Quiz questions for terms
const termQuizQuestions = {
    'beryllium': {
        question: "What is the atomic number of Beryllium?",
        options: ["2", "3", "4", "5"],
        correct: 2,
        explanation: "Beryllium has an atomic number of 4, meaning it has 4 protons in its nucleus."
    },
    'magnesium': {
        question: "What color flame does Magnesium produce when burned?",
        options: ["Red", "Yellow", "Green", "Bright white"],
        correct: 3,
        explanation: "Magnesium produces a bright white flame when burned, which is why it's used in fireworks and flares."
    },
    'calcium': {
        question: "How does Calcium react with cold water?",
        options: ["No reaction", "Fizzes slowly", "Fizzes steadily", "Fizzes violently"],
        correct: 2,
        explanation: "Calcium reacts steadily with cold water, producing calcium hydroxide and hydrogen gas."
    },
    'alkaline-earth-metals': {
        question: "Why are Group 2 elements called alkaline earth metals?",
        options: ["They are alkaline in nature", "They form alkaline solutions with water", "Their oxides form alkaline solutions in water", "They react with alkalis"],
        correct: 2,
        explanation: "Group 2 elements are called alkaline earth metals because their oxides react with water to form alkaline (basic) solutions."
    },
    'valence-electrons': {
        question: "How many valence electrons do Group 2 elements have?",
        options: ["1", "2", "3", "7"],
        correct: 1,
        explanation: "All Group 2 elements have 2 valence electrons in their outer shell, which they readily lose to form +2 ions."
    }
};

// Interactive element quiz functions
function showElementQuiz(element) {
    const question = termQuizQuestions[element];
    if (!question) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `${element.charAt(0).toUpperCase() + element.slice(1)} Quiz`;
    
    content.innerHTML = `
        <div class="mb-6">
            <p class="text-lg mb-4">${question.question}</p>
            <div class="space-y-2">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="checkElementQuizAnswer(${index}, ${question.correct}, '${question.explanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="elementQuizFeedback" class="mt-4 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkElementQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('elementQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}

function showElementDetails(name, symbol, atomicNumber, electronConfig) {
    const details = elementDetails[name];
    if (!details) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = name;
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <div class="bg-gray-100 p-5 rounded-lg mb-5">
                    <h3 class="font-semibold text-gray-800 mb-3">Atomic Information</h3>
                    <p><strong>Symbol:</strong> ${details.symbol}</p>
                    <p><strong>Atomic Number:</strong> ${details.atomicNumber}</p>
                    <p><strong>Electron Configuration:</strong> ${details.electronConfig}</p>
                </div>
                <div class="bg-gray-100 p-5 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">Properties</h3>
                    <p><strong>Melting Point:</strong> ${details.meltingPoint}</p>
                    <p><strong>Density:</strong> ${details.density}</p>
                    <p><strong>Reactivity:</strong> ${details.reactivity}</p>
                </div>
            </div>
            <div>
                <div class="bg-gray-100 p-5 rounded-lg mb-5">
                    <h3 class="font-semibold text-gray-800 mb-3">Uses</h3>
                    <p>${details.uses}</p>
                </div>
                <div class="bg-gray-100 p-5 rounded-lg">
                    <h3 class="font-semibold text-gray-800 mb-3">Fun Fact</h3>
                    <p>${details.fact}</p>
                </div>
            </div>
        </div>
        <div class="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <h3 class="font-semibold text-blue-800 mb-3">Quick Quiz</h3>
            <p class="mb-3">${details.quizQuestion}</p>
            <div class="space-y-2">
                ${details.quizOptions.map((option, index) => `
                    <div class="quiz-option" onclick="checkElementDetailsQuizAnswer(${index}, ${details.quizCorrect}, '${details.quizExplanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="elementDetailsQuizFeedback" class="mt-3 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full mt-4">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkElementDetailsQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('elementDetailsQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-3 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-3 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}

function closeElementDetails() {
    const modal = document.getElementById('elementDetailsModal');
    if (modal) modal.classList.remove('active');
}

function showTermQuiz(term) {
    const question = termQuizQuestions[term];
    if (!question) return;
    
    const modal = document.getElementById('elementDetailsModal');
    const title = document.getElementById('elementDetailsName');
    const content = document.getElementById('elementDetailsContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = `Quick Quiz: ${term.replace('-', ' ')}`;
    
    content.innerHTML = `
        <div class="mb-6">
            <p class="text-lg mb-4">${question.question}</p>
            <div class="space-y-2">
                ${question.options.map((option, index) => `
                    <div class="quiz-option" onclick="checkTermQuizAnswer(${index}, ${question.correct}, '${question.explanation}')">
                        <label>${option}</label>
                    </div>
                `).join('')}
            </div>
            <div id="termQuizFeedback" class="mt-4 p-3 rounded-lg hidden"></div>
        </div>
        <button onclick="closeElementDetails()" class="btn btn-secondary w-full">Close</button>
    `;
    
    modal.classList.add('active');
}

function checkTermQuizAnswer(selectedIndex, correctIndex, explanation) {
    const options = document.querySelectorAll('#elementDetailsContent .quiz-option');
    const feedback = document.getElementById('termQuizFeedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.onclick = null; // Disable further clicks
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === correctIndex) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + explanation;
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + explanation;
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
}
