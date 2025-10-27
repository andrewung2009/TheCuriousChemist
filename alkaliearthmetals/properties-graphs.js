// Graph Data and Configuration
const elementData = {
    'Be': {
        name: 'Beryllium',
        atomicNumber: 4,
        meltingPoint: 1287,
        density: 1.85,
        reactivity: 1,
        atomicRadius: 112,
        color: '#FF6384'
    },
    'Mg': {
        name: 'Magnesium',
        atomicNumber: 12,
        meltingPoint: 650,
        density: 1.74,
        reactivity: 3,
        atomicRadius: 150,
        color: '#36A2EB'
    },
    'Ca': {
        name: 'Calcium',
        atomicNumber: 20,
        meltingPoint: 842,
        density: 1.55,
        reactivity: 5,
        atomicRadius: 180,
        color: '#FFCE56'
    },
    'Sr': {
        name: 'Strontium',
        atomicNumber: 38,
        meltingPoint: 777,
        density: 2.64,
        reactivity: 7,
        atomicRadius: 200,
        color: '#4BC0C0'
    },
    'Ba': {
        name: 'Barium',
        atomicNumber: 56,
        meltingPoint: 727,
        density: 3.62,
        reactivity: 9,
        atomicRadius: 215,
        color: '#9966FF'
    },
    'Ra': {
        name: 'Radium',
        atomicNumber: 88,
        meltingPoint: 700,
        density: 5.5,
        reactivity: 10,
        atomicRadius: 221,
        color: '#FF9F40'
    }
};

// Global chart variables
let mainChart = null;
let currentGraphType = 'melting-point';
let selectedElements = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
let animationEnabled = true;

// Graph Quiz Questions
const graphQuizQuestions = [
    {
        question: "Based on the melting point graph, which element has the highest melting point?",
        options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
        correct: 0,
        explanation: "Beryllium has the highest melting point (1287°C) due to its small atomic size and strong metallic bonding."
    },
    {
        question: "What trend do you observe in the density graph as you move down Group 2?",
        options: ["Density decreases", "Density increases", "Density remains constant", "No clear pattern"],
        correct: 1,
        explanation: "Density generally increases down Group 2 as atomic mass increases more significantly than atomic volume."
    },
    {
        question: "Which element shows the most dramatic change in reactivity compared to the others?",
        options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
        correct: 0,
        explanation: "Beryllium shows the lowest reactivity (index 1) compared to other elements, making it an exception in the group."
    },
    {
        question: "In the correlation graph, what relationship exists between atomic radius and reactivity?",
        options: ["No correlation", "Positive correlation", "Negative correlation", "Inverse relationship"],
        correct: 1,
        explanation: "There's a positive correlation between atomic radius and reactivity - as atomic radius increases, reactivity increases."
    }
];

let currentQuizQuestion = null;

// Initialize graphs when page loads
function initializeGraphs() {
    createMainChart('melting-point');
    populateDataTable();
    loadGraphQuiz();
}

// Create main chart
function createMainChart(type) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (mainChart) {
        mainChart.destroy();
    }

    const chartConfig = getChartConfig(type);
    mainChart = new Chart(ctx, chartConfig);

    // Update title
    const titles = {
        'melting-point': 'Melting Point Trend',
        'density': 'Density Trend',
        'reactivity': 'Reactivity Trend',
        'comparison': 'Element Properties Comparison',
        'correlation': 'Property Correlations'
    };
    
    const titleElement = document.getElementById('graph-title');
    if (titleElement) {
        titleElement.textContent = titles[type] || 'Interactive Graph';
    }
}

// Get chart configuration based on type
function getChartConfig(type) {
    const visibleElements = selectedElements;
    const labels = visibleElements.map(el => elementData[el].name);
    const colors = visibleElements.map(el => elementData[el].color);

    let datasets = [];

    switch (type) {
        case 'melting-point':
            datasets = [{
                label: 'Melting Point (°C)',
                data: visibleElements.map(el => elementData[el].meltingPoint),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'density':
            datasets = [{
                label: 'Density (g/cm³)',
                data: visibleElements.map(el => elementData[el].density),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'reactivity':
            datasets = [{
                label: 'Reactivity Index',
                data: visibleElements.map(el => elementData[el].reactivity),
                backgroundColor: colors.map(color => color + '33'),
                borderColor: colors,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: colors,
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }];
            break;

        case 'comparison':
            datasets = [
                {
                    label: 'Melting Point (°C)',
                    data: visibleElements.map(el => elementData[el].meltingPoint),
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 2
                },
                {
                    label: 'Density (g/cm³) × 100',
                    data: visibleElements.map(el => elementData[el].density * 100),
                    backgroundColor: '#36A2EB',
                    borderColor: '#36A2EB',
                    borderWidth: 2
                },
                {
                    label: 'Reactivity Index × 100',
                    data: visibleElements.map(el => elementData[el].reactivity * 100),
                    backgroundColor: '#FFCE56',
                    borderColor: '#FFCE56',
                    borderWidth: 2
                }
            ];
            break;

        case 'correlation':
            datasets = [{
                label: 'Elements',
                data: visibleElements.map(el => ({
                    x: elementData[el].atomicRadius,
                    y: elementData[el].reactivity,
                    r: 8,
                    element: el
                })),
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 2
            }];
            break;
    }

    const baseConfig = {
        type: type === 'comparison' ? 'bar' : (type === 'correlation' ? 'bubble' : 'line'),
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: animationEnabled ? 1000 : 0,
                easing: 'easeInOutQuart'
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#cbd5e1',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                    borderColor: '#475569',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        afterLabel: function(context) {
                            if (type === 'correlation') {
                                const element = context.raw.element;
                                return `Element: ${elementData[element].name}`;
                            }
                            return '';
                        }
                    }
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            },
            scales: type === 'correlation' ? {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Atomic Radius (pm)',
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Reactivity Index',
                        color: '#cbd5e1',
                        font: {
                            size: 14,
                            weight: '500'
                        }
                    },
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            } : {
                x: {
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: type !== 'melting-point',
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8',
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: getAxisLabel(type),
                        color: '#cbd5e1',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    };

    return baseConfig;
}

// Get axis label based on graph type
function getAxisLabel(type) {
    const labels = {
        'melting-point': 'Temperature (°C)',
        'density': 'Density (g/cm³)',
        'reactivity': 'Reactivity Index',
        'comparison': 'Value'
    };
    return labels[type] || 'Value';
}

// Switch between different graph types
function switchGraph(type) {
    currentGraphType = type;
    
    // Update button states
    document.querySelectorAll('.graph-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${type}-btn`).classList.add('active');
    
    // Create new chart
    createMainChart(type);
    
    // Update table highlighting
    updateTableHighlighting();
}

// Toggle element visibility
function toggleElement(element) {
    const index = selectedElements.indexOf(element);
    if (index > -1) {
        selectedElements.splice(index, 1);
    } else {
        selectedElements.push(element);
    }
    
    // Sort elements to maintain order
    selectedElements.sort();
    
    // Recreate chart
    createMainChart(currentGraphType);
    
    // Update table
    updateTableHighlighting();
}

// Reset zoom
function resetZoom() {
    if (mainChart) {
        mainChart.resetZoom();
    }
}

// Download graph as image
function downloadGraph() {
    if (!mainChart) return;
    
    const link = document.createElement('a');
    link.download = `group2-${currentGraphType}-chart.png`;
    link.href = mainChart.toBase64Image();
    link.click();
    
    showToast('success', 'Graph Downloaded', 'The chart has been saved as an image.');
}

// Toggle animation
function toggleAnimation() {
    animationEnabled = !animationEnabled;
    const btn = event.currentTarget;
    const icon = btn.querySelector('i');
    
    if (animationEnabled) {
        icon.className = 'fas fa-pause';
        showToast('info', 'Animation Enabled', 'Chart animations are now enabled.');
    } else {
        icon.className = 'fas fa-play';
        showToast('info', 'Animation Disabled', 'Chart animations are now disabled.');
    }
    
    // Recreate chart with new animation setting
    createMainChart(currentGraphType);
}

// Populate data table
function populateDataTable() {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    Object.keys(elementData).forEach(element => {
        const data = elementData[element];
        const row = document.createElement('tr');
        row.dataset.element = element;
        
        row.innerHTML = `
            <td>
                <span class="element-color" style="background-color: ${data.color};"></span>
                ${data.name}
            </td>
            <td>${data.atomicNumber}</td>
            <td>${data.meltingPoint}</td>
            <td>${data.density}</td>
            <td>${data.reactivity}</td>
            <td>${data.atomicRadius}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update table highlighting based on selected elements
function updateTableHighlighting() {
    const rows = document.querySelectorAll('#dataTableBody tr');
    
    rows.forEach(row => {
        const element = row.dataset.element;
        if (selectedElements.includes(element)) {
            row.classList.add('highlighted-row');
        } else {
            row.classList.remove('highlighted-row');
        }
    });
}

// Load graph quiz
function loadGraphQuiz() {
    const questionContainer = document.getElementById('graph-quiz-question');
    const optionsContainer = document.getElementById('graph-quiz-options');
    
    if (!questionContainer || !optionsContainer) return;
    
    // Select random question
    currentQuizQuestion = graphQuizQuestions[Math.floor(Math.random() * graphQuizQuestions.length)];
    
    questionContainer.textContent = currentQuizQuestion.question;
    
    optionsContainer.innerHTML = '';
    currentQuizQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'graph-quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => checkGraphQuizAnswer(index);
        optionsContainer.appendChild(optionDiv);
    });
    
    // Hide feedback
    const feedback = document.getElementById('graph-quiz-feedback');
    if (feedback) {
        feedback.classList.add('hidden');
    }
}

// Check graph quiz answer
function checkGraphQuizAnswer(selectedIndex) {
    if (!currentQuizQuestion) return;
    
    const options = document.querySelectorAll('.graph-quiz-option');
    const feedback = document.getElementById('graph-quiz-feedback');
    
    if (!feedback) return;
    
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === currentQuizQuestion.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === currentQuizQuestion.correct) {
        feedback.className = 'mt-4 p-3 rounded-lg bg-green-100 text-green-800';
        feedback.textContent = 'Correct! ' + currentQuizQuestion.explanation;
        
        if (soundEnabled) correctSound.play();
        
        // Award XP
        const newXp = (userData.xp || 0) + 2;
        if (currentUser && userData) {
            const userRef = group2MetalsRef.child('users').child(currentUser.uid);
            userRef.update({ xp: newXp }).then(() => {
                userData.xp = newXp;
                updateUserXP();
            });
        }
    } else {
        feedback.className = 'mt-4 p-3 rounded-lg bg-red-100 text-red-800';
        feedback.textContent = 'Incorrect. ' + currentQuizQuestion.explanation;
        
        if (soundEnabled) incorrectSound.play();
    }
    
    feedback.classList.remove('hidden');
    
    // Load new question after delay
    setTimeout(() => {
        loadGraphQuiz();
    }, 5000);
}
