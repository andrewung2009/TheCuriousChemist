// overview.js

// Data structure for all overview quizzes
const overviewQuizzes = {
    // Element-specific quizzes
    'beryllium': {
        title: 'Beryllium Quiz',
        question: 'What is a unique property of Beryllium compared to other Group 2 metals?',
        options: [
            'It is the most reactive.',
            'It does not react with water at room temperature.',
            'It has the lowest density.',
            'It forms a green flame in a flame test.'
        ],
        correct: 1,
        feedback: 'Correct! Beryllium is unique as it does not react with water, even when heated, due to the formation of a protective oxide layer.'
    },
    'magnesium': {
        title: 'Magnesium Quiz',
        question: 'What is the primary use of Magnesium in the human body?',
        options: [
            'Strengthening bones and teeth.',
            'Essential for enzyme function and muscle contraction.',
            'Maintaining nerve impulses.',
            'All of the above.'
        ],
        correct: 3,
        feedback: 'Correct! Magnesium is crucial for over 300 biochemical reactions, including muscle and nerve function, blood glucose control, and regulating blood pressure.'
    },
    'calcium': {
        title: 'Calcium Quiz',
        question: 'What color flame does Calcium produce in a flame test?',
        options: [
            'Bright white',
            'Brick-red',
            'Green',
            'Crimson'
        ],
        correct: 1,
        feedback: 'Correct! Calcium compounds impart a characteristic brick-red color to a flame.'
    },

    // Term-specific quizzes
    'alkaline-earth-metals': {
        title: 'Alkaline Earth Metals',
        question: 'Why are Group 2 elements called "alkaline earth metals"?',
        options: [
            'They are found in the earth\'s crust and form basic (alkaline) oxides and hydroxides.',
            'They were first discovered in alkaline soil.',
            'They are less reactive than alkali metals but more reactive than earth metals.',
            'The name is historical and has no chemical basis.'
        ],
        correct: 0,
        feedback: 'Correct! The name comes from their oxides and hydroxides being basic (alkaline) and their abundance in the Earth\'s crust.'
    },
    'valence-electrons': {
        title: 'Valence Electrons',
        question: 'How many valence electrons do all Group 2 elements have?',
        options: [
            '1',
            '2',
            '8',
            'It varies down the group.'
        ],
        correct: 1,
        feedback: 'Correct! All Group 2 elements have 2 electrons in their outermost shell, which defines their chemical properties.'
    },
    'hardness': {
        title: 'Hardness',
        question: 'Compared to Group 1 metals (alkali metals), Group 2 metals are generally:',
        options: [
            'Softer',
            'Harder',
            'The same hardness',
            'More brittle'
        ],
        correct: 1,
        feedback: 'Correct! Alkaline earth metals have stronger metallic bonds than alkali metals, making them harder and have higher melting points.'
    },
    'melting-point': {
        title: 'Melting Point',
        question: 'What is the general trend for melting points as you go down Group 2?',
        options: [
            'Increases',
            'Decreases',
            'Stays the same',
            'No clear trend'
        ],
        correct: 1,
        feedback: 'Correct! The melting point generally decreases down the group because the metallic bonds become weaker as the atomic size increases.'
    },
    'density': {
        title: 'Density',
        question: 'How does the density of Group 2 elements change down the group?',
        options: [
            'It decreases',
            'It increases',
            'It remains constant',
            'It fluctuates randomly'
        ],
        correct: 1,
        feedback: 'Correct! Density increases down the group as the atoms become much heavier, and this increase outweighs the increase in atomic volume.'
    },
    'reactivity': {
        title: 'Reactivity',
        question: 'Which Group 2 element is the most reactive with water?',
        options: [
            'Beryllium (Be)',
            'Magnesium (Mg)',
            'Calcium (Ca)',
            'Barium (Ba)'
        ],
        correct: 3,
        feedback: 'Correct! Reactactivity increases down the group. Barium reacts very vigorously with water, while Beryllium does not react at all.'
    },
    'flame-test': {
        title: 'Flame Test',
        question: 'Which element is known for producing a brilliant crimson flame, used in fireworks?',
        options: [
            'Calcium (Ca)',
            'Strontium (Sr)',
            'Barium (Ba)',
            'Magnesium (Mg)'
        ],
        correct: 1,
        feedback: 'Correct! Strontium salts produce a bright crimson flame, making them popular for red fireworks.'
    },

    // Trend-specific quizzes
    'trend-melting-point': {
        title: 'Melting Point Trend',
        question: 'Why does the melting point decrease down Group 2?',
        options: [
            'The atoms get smaller.',
            'The metallic bonds become weaker due to increased atomic radius.',
            'The number of protons decreases.',
            'The elements become less metallic.'
        ],
        correct: 1,
        feedback: 'Correct! As you go down the group, the atomic radius increases, the delocalized electrons are further from the nucleus, and the metallic bond strength decreases, requiring less energy (lower temperature) to break.'
    },
    'trend-density': {
        title: 'Density Trend',
        question: 'The density of Group 2 metals increases down the group primarily because:',
        options: [
            'The atoms get smaller.',
            'The increase in atomic mass is greater than the increase in atomic volume.',
            'The elements become more solid.',
            'The metallic bonds get stronger.'
        ],
        correct: 1,
        feedback: 'Correct! While both mass and volume increase down the group, the mass increases at a faster rate than the volume, leading to an overall increase in density (mass/volume).'
    },
    'trend-reactivity': {
        title: 'Reactivity Trend',
        question: 'Reactivity increases down Group 2 because:',
        options: [
            'The elements have more protons.',
            'The outermost electrons are held more tightly.',
            'The outermost electrons are further from the nucleus and easier to lose.',
            'The ionization energy increases.'
        ],
        correct: 2,
        feedback: 'Correct! The outermost (valence) electrons are in a higher energy level, further from the attractive pull of the nucleus, and are shielded by more inner electron shells. This makes them easier to lose, increasing reactivity.'
    }
};

/**
 * Displays the quiz modal for a given quiz key.
 * @param {string} quizKey - The key for the quiz in the overviewQuizzes object.
 */
function showOverviewQuiz(quizKey) {
    const quiz = overviewQuizzes[quizKey];
    if (!quiz) {
        console.error('Quiz not found for key:', quizKey);
        return;
    }

    const popup = document.getElementById('elementQuizPopup');
    const titleEl = document.getElementById('elementQuizTitle');
    const questionEl = document.getElementById('elementQuizQuestion');
    const optionsContainer = document.getElementById('elementQuizOptions');
    const feedbackEl = document.getElementById('elementQuizFeedback');

    // Populate modal content
    titleEl.textContent = quiz.title;
    questionEl.textContent = quiz.question;
    feedbackEl.classList.add('hidden');
    feedbackEl.textContent = '';

    // Clear and populate options
    optionsContainer.innerHTML = '';
    quiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-indigo-50 transition-colors duration-200';
        button.textContent = option;
        button.onclick = () => checkOverviewAnswer(button, index, quiz.correct, quiz.feedback);
        optionsContainer.appendChild(button);
    });

    // Show the modal
    popup.classList.remove('hidden');
}

/**
 * Checks the selected answer, provides feedback, and awards XP.
 * @param {HTMLElement} clickedButton - The button element that was clicked.
 * @param {number} selectedIndex - The index of the selected option.
 * @param {number} correctIndex - The index of the correct answer.
 * @param {string} feedback - The feedback text to display.
 */
function checkOverviewAnswer(clickedButton, selectedIndex, correctIndex, feedback) {
    const optionsContainer = document.getElementById('elementQuizOptions');
    const feedbackEl = document.getElementById('elementQuizFeedback');
    const buttons = optionsContainer.querySelectorAll('button');

    // Disable all buttons
    buttons.forEach(btn => {
        btn.disabled = true;
        btn.classList.remove('hover:bg-indigo-50');
    });

    // Show feedback
    feedbackEl.textContent = feedback;
    feedbackEl.classList.remove('hidden');

    if (selectedIndex === correctIndex) {
        // Correct answer
        clickedButton.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        feedbackEl.classList.add('bg-green-100', 'text-green-800');
        feedbackEl.classList.remove('bg-red-100', 'text-red-800');
        
        // Award XP (assuming a global function exists)
        if (typeof awardXP === 'function') {
            awardXP(5); // Award 5 XP for a correct answer
        }
    } else {
        // Incorrect answer
        clickedButton.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        feedbackEl.classList.add('bg-red-100', 'text-red-800');
        feedbackEl.classList.remove('bg-green-100', 'text-green-800');
        
        // Highlight the correct answer
        if (buttons[correctIndex]) {
            buttons[correctIndex].classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        }
    }
}

/**
 * Closes the element quiz modal and resets its state.
 */
function closeElementQuiz() {
    const popup = document.getElementById('elementQuizPopup');
    popup.classList.add('hidden');
    // Reset content for next time
    document.getElementById('elementQuizTitle').textContent = '';
    document.getElementById('elementQuizQuestion').textContent = '';
    document.getElementById('elementQuizOptions').innerHTML = '';
    document.getElementById('elementQuizFeedback').classList.add('hidden');
}

// --- Event Handlers for HTML onclick attributes ---

// These functions act as simple wrappers to call the main function with the correct key.
// This keeps the HTML clean and readable.

function showElementQuiz(element) {
    showOverviewQuiz(element);
}

function showTermQuiz(term) {
    showOverviewQuiz(term);
}

function showTrendQuiz(trend) {
    // The trend keys in the data object are prefixed with 'trend-'
    showOverviewQuiz(`trend-${trend}`);
}
