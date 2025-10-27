// Quiz variables
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answerSubmitted = false;
let quizAnswers = [];

// All MCQ Quiz Questions
quizQuestions = [
    {
        question: "What is the electron configuration of the outer shell of all Group 2 elements?",
        options: ["1 electron", "2 electrons", "8 electrons", "Variable number of electrons"],
        correct: 1,
        explanation: "All Group 2 elements have two electrons in their outer shell, which they readily lose to form +2 ions."
    },
    {
        question: "Which of the following statements about the reactivity of Group 2 metals is correct?",
        options: ["Reactivity decreases down the group", "Reactivity increases down the group", "Reactivity stays the same down the group", "Reactivity is highest for beryllium"],
        correct: 1,
        explanation: "Reactivity increases down Group 2 because the outer electrons are further from the nucleus and easier to lose."
    },
    {
        question: "When Group 2 metals react with water, what products are formed?",
        options: ["Metal oxide and hydrogen", "Metal hydroxide and hydrogen", "Metal oxide and oxygen", "Metal hydroxide and oxygen"],
        correct: 1,
        explanation: "The general equation is: M(s) + 2H₂O(l) → M(OH)₂(aq) + H₂(g)"
    },
    {
        question: "Which Group 2 metal does not react with water at room temperature?",
        options: ["Magnesium", "Calcium", "Strontium", "Barium"],
        correct: 0,
        explanation: "Beryllium does not react with water at room temperature due to its protective oxide layer and high ionization energy."
    },
    {
        question: "What color flame does calcium produce in a flame test?",
        options: ["Red", "Yellow", "Green", "Brick-red"],
        correct: 3,
        explanation: "Calcium produces a brick-red flame in flame tests, which is characteristic of calcium ions."
    },
    {
        question: "Which statement about the melting point of Group 2 metals is correct?",
        options: ["Melting point increases down the group", "Melting point decreases down the group", "Melting point is highest for barium", "Melting point is constant across the group"],
        correct: 1,
        explanation: "The melting point decreases down Group 2 due to increasing atomic size and weaker metallic bonding."
    },
    {
        question: "Which Group 2 metal is used in medical imaging as a contrast agent?",
        options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
        correct: 3,
        explanation: "Barium sulfate is used as a contrast agent in medical imaging because it's opaque to X-rays but safe to ingest."
    },
    {
        question: "What happens when magnesium ribbon is burned in oxygen?",
        options: ["It produces a red flame and forms MgO", "It produces a bright white flame and forms MgO", "It produces a green flame and forms MgO", "It doesn't burn in oxygen"],
        correct: 1,
        explanation: "Magnesium burns with a bright white flame in oxygen to form white magnesium oxide powder."
    },
    {
        question: "Which Group 2 metal is essential for plant growth?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 1,
        explanation: "Magnesium is essential for plant growth as it's the central atom in chlorophyll, the molecule responsible for photosynthesis."
    },
    {
        question: "Which Group 2 metal is used in fireworks to produce a red color?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 2,
        explanation: "Strontium compounds are used in fireworks to produce a brilliant red color due to their characteristic crimson flame."
    }
];

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    answerSubmitted = false;
    quizAnswers = [];
    
    const modal = document.getElementById('quizModal');
    const progress = document.getElementById('quizProgress');
    const content = document.getElementById('quizContent');
    const results = document.getElementById('quizResults');
    
    if (!modal || !progress || !content || !results) return;
    
    modal.classList.add('active');
    progress.style.display = 'block';
    content.style.display = 'block';
    results.style.display = 'none';
    
    const currentQuestionElement = document.getElementById('currentQuestion');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const currentScoreElement = document.getElementById('currentScore');
    const progressFillElement = document.getElementById('progressFill');
    
    if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
    if (totalQuestionsElement) totalQuestionsElement.textContent = quizQuestions.length;
    if (currentScoreElement) currentScoreElement.textContent = score;
    if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
    
    loadQuestion();
}

function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    const questionTextElement = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    if (!question || !questionTextElement || !optionsContainer) return;
    
    questionTextElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    
    // Check if this question has been answered already
    const answeredQuestion = quizAnswers[currentQuestion];
    
    // Load MCQ options
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        if (answeredQuestion) {
            optionDiv.classList.add('disabled');
            if (answeredQuestion.selected === index) {
                optionDiv.classList.add(answeredQuestion.isCorrect ? 'correct' : 'incorrect');
            }
        }
        optionDiv.dataset.index = index;
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'quiz-option';
        input.id = `option-${index}`;
        input.value = index;
        if (answeredQuestion && answeredQuestion.selected === index) {
            input.checked = true;
        }
        if (answeredQuestion) {
            input.disabled = true;
        }
        
        const label = document.createElement('label');
        label.htmlFor = `option-${index}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        
        if (!answeredQuestion) {
            optionDiv.onclick = () => selectOption(index);
        }
        optionsContainer.appendChild(optionDiv);
    });
    
    // Show/hide navigation buttons
    const prevButton = document.getElementById('prevButton');
    const submitButton = document.getElementById('submitButton');
    const nextButton = document.getElementById('nextButton');
    
    if (prevButton) prevButton.classList.toggle('hidden', currentQuestion === 0);
    
    // Show submit button if not answered, show next button if answered
    if (answeredQuestion) {
        if (submitButton) submitButton.style.display = 'none';
        if (nextButton) nextButton.classList.remove('hidden');
        
        // Show feedback for answered question
        const feedback = document.getElementById('feedback');
        if (feedback) {
            if (answeredQuestion.isCorrect) {
                feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
                feedback.textContent = 'Correct! ' + question.explanation;
            } else {
                feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
                feedback.textContent = 'Incorrect. ' + question.explanation;
            }
            feedback.classList.remove('hidden');
        }
    } else {
        if (submitButton) {
            submitButton.style.display = 'inline-flex';
            submitButton.disabled = true;
        }
        if (nextButton) nextButton.classList.add('hidden');
        
        const feedback = document.getElementById('feedback');
        if (feedback) feedback.classList.add('hidden');
    }
    
    selectedOption = answeredQuestion ? answeredQuestion.selected : null;
    answerSubmitted = !!answeredQuestion;
}

function selectOption(index) {
    if (answerSubmitted) return;
    
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        option.classList.remove('selected');
        const input = option.querySelector('input');
        if (input) input.checked = false;
    });
    
    options[index].classList.add('selected');
    const selectedInput = options[index].querySelector('input');
    if (selectedInput) selectedInput.checked = true;
    
    const submitButton = document.getElementById('submitButton');
    if (submitButton) submitButton.disabled = false;
}

function submitAnswer() {
    if (answerSubmitted) return;
    
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedOption === question.correct;
    const feedback = document.getElementById('feedback');
    
    if (!question || !feedback) return;
    
    quizAnswers[currentQuestion] = {
        selected: selectedOption,
        submitted: true,
        isCorrect: isCorrect
    };
    
    if (isCorrect) {
        feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
        feedback.textContent = 'Correct! ' + question.explanation;
        score++;
        
        if (soundEnabled) correctSound.play();
    } else {
        feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
        feedback.textContent = 'Incorrect. ' + question.explanation;
        
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
    
    const submitButton = document.getElementById('submitButton');
    const nextButton = document.getElementById('nextButton');
    const currentScoreElement = document.getElementById('currentScore');
    
    if (submitButton) submitButton.style.display = 'none';
    if (nextButton) nextButton.classList.remove('hidden');
    if (currentScoreElement) currentScoreElement.textContent = score;
    
    answerSubmitted = true;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        showResults();
        return;
    }
    
    const currentQuestionElement = document.getElementById('currentQuestion');
    const progressFillElement = document.getElementById('progressFill');
    
    if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
    if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
    
    loadQuestion();
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        
        const currentQuestionElement = document.getElementById('currentQuestion');
        const progressFillElement = document.getElementById('progressFill');
        
        if (currentQuestionElement) currentQuestionElement.textContent = currentQuestion + 1;
        if (progressFillElement) progressFillElement.style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
        
        loadQuestion();
    }
}

function showResults() {
    const progress = document.getElementById('quizProgress');
    const content = document.getElementById('quizContent');
    const results = document.getElementById('quizResults');
    
    if (!progress || !content || !results) return;
    
    progress.style.display = 'none';
    content.style.display = 'none';
    results.style.display = 'block';
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const finalScoreElement = document.getElementById('finalScore');
    const scoreMessageElement = document.getElementById('scoreMessage');
    
    if (finalScoreElement) finalScoreElement.textContent = `${score}/${quizQuestions.length}`;
    
    let message = '';
    if (percentage >= 80) {
        message = 'Excellent! You have a strong understanding of Group 2 elements.';
    } else if (percentage >= 60) {
        message = 'Good job! You have a solid foundation to build upon.';
    } else if (percentage >= 40) {
        message = 'Not bad! Review the materials to improve your understanding.';
    } else {
        message = 'Keep practicing! Review the materials carefully.';
    }
    
    if (scoreMessageElement) scoreMessageElement.textContent = message;
    
    // Award XP for quiz completion
    const quizXP = Math.round((score / quizQuestions.length) * 20); // Max 20 XP for perfect score
    const newXp = (userData.xp || 0) + quizXP;
    
    // Check for quiz badge
    const newBadges = [...(userData.badges || [])];
    let badgeEarned = false;
    
    if (percentage >= 80 && !newBadges.includes('Quiz Master')) {
        newBadges.push('Quiz Master');
        badgeEarned = true;
    }
    
    // Save to Firebase
    if (currentUser && userData) {
        const userRef = group2MetalsRef.child('users').child(currentUser.uid);
        const updates = {
            xp: newXp
        };
        
        if (badgeEarned) {
            updates.badges = newBadges;
        }
        
        userRef.update(updates).then(() => {
            userData.xp = newXp;
            if (badgeEarned) {
                userData.badges = newBadges;
            }
            
            updateUserXP();
            updateUserBadges();
            
            if (soundEnabled) {
                completeSound.play();
                if (badgeEarned) badgeSound.play();
            }
            
            if (badgeEarned) {
                showToast('success', 'Badge Earned!', `You've earned a new badge: ${newBadges[newBadges.length - 1]}`);
            }
        });
    }
}

function closeQuiz() {
    const modal = document.getElementById('quizModal');
    if (modal) modal.classList.remove('active');
}
