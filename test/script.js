
        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyBOp4x0lTFvmt2s3MQKBRYmZT9IJ2ZaRi8",
            authDomain: "group-1-alkali-metals.firebaseapp.com",
            databaseURL: "https://group-1-alkali-metals-default-rtdb.firebaseio.com",
            projectId: "group-1-alkali-metals",
            storageBucket: "group-1-alkali-metals.firebasestorage.app",
            messagingSenderId: "806417495419",
            appId: "1:806417495419:web:5b80607e8a23e96da4f9de",
            measurementId: "G-S76E52MQ37"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();
        const database = firebase.database();

        // Create a reference to the "Group 2 Metals" subset
        const group2MetalsRef = database.ref('Group2Metals');

        // Global variables
        let currentUser = null;
        let userData = null;
        let currentSection = 'overview';
        let completedSections = [];
        let quizQuestions = [];
        let currentQuestion = 0;
        let score = 0;
        let selectedOption = null;
        let answerSubmitted = false;
        let quizAnswers = [];
        let discussionPosts = [];
        let studyGroups = [];
        let currentSort = 'newest';
        let soundEnabled = true;
        let dailyChallenge = null;
        let dailyChallengeAnswered = false;
        let mainChart = null;
        let currentGraphType = 'line';
        let selectedElements = ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'];
        let activeProperties = ['melting-point', 'density']; // Start with melting point and density active

        // Element data for graphs
        const elementData = {
            'Be': { name: 'Beryllium', atomicNumber: 4, meltingPoint: 1287, density: 1.85, reactivity: 1, atomicRadius: 112 },
            'Mg': { name: 'Magnesium', atomicNumber: 12, meltingPoint: 650, density: 1.74, reactivity: 2, atomicRadius: 150 },
            'Ca': { name: 'Calcium', atomicNumber: 20, meltingPoint: 842, density: 1.55, reactivity: 3, atomicRadius: 180 },
            'Sr': { name: 'Strontium', atomicNumber: 38, meltingPoint: 777, density: 2.64, reactivity: 4, atomicRadius: 200 },
            'Ba': { name: 'Barium', atomicNumber: 56, meltingPoint: 727, density: 3.62, reactivity: 5, atomicRadius: 215 },
            'Ra': { name: 'Radium', atomicNumber: 88, meltingPoint: 700, density: 5.5, reactivity: 6, atomicRadius: 221 }
        };

        // Property configuration for graph
        const propertyConfig = {
            'melting-point': {
                label: 'Melting Point (°C)',
                color: '#3b82f6',
                yAxisID: 'y'
            },
            'density': {
                label: 'Density (g/cm³)',
                color: '#8b5cf6',
                yAxisID: 'y'
            },
            'reactivity': {
                label: 'Reactivity Level',
                color: '#10b981',
                yAxisID: 'y'
            },
            'atomic-radius': {
                label: 'Atomic Radius (pm)',
                color: '#f59e0b',
                yAxisID: 'y'
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
            },
            'hardness': {
                question: "How do Group 2 metals compare to Group 1 metals in terms of hardness?",
                options: ["Softer than Group 1", "Harder than Group 1", "Same hardness", "Variable hardness"],
                correct: 1,
                explanation: "Group 2 metals are harder than Group 1 metals due to stronger metallic bonding from higher charge density."
            },
            'melting-point': {
                question: "Which Group 2 metal has the highest melting point?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 0,
                explanation: "Beryllium has the highest melting point (1287°C) due to its small atomic size and strong metallic bonding."
            },
            'density': {
                question: "How does density generally change down Group 2?",
                options: ["Decreases", "Increases", "Remains constant", "Varies randomly"],
                correct: 1,
                explanation: "Density generally increases down Group 2 as atomic mass increases more significantly than atomic volume."
            },
            'reactivity': {
                question: "Which Group 2 metal is the most reactive?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 3,
                explanation: "Reactivity increases down Group 2, making Barium the most reactive element in the group."
            },
            'flame-test': {
                question: "What flame color does Calcium produce?",
                options: ["Red", "Yellow", "Green", "Brick-red"],
                correct: 3,
                explanation: "Calcium produces a brick-red flame in flame tests, which is characteristic of calcium ions."
            }
        };

        // Trend quiz questions
        const trendQuizQuestions = {
            'melting-point': {
                question: "Why does melting point generally decrease down Group 2?",
                options: [
                    "Atomic size increases, metallic bonds weaken",
                    "Atomic size decreases, metallic bonds strengthen",
                    "Electron configuration changes",
                    "Nuclear charge increases"
                ],
                correct: 0,
                explanation: "As we move down Group 2, atomic size increases due to additional electron shells. This increases the distance between positive nuclei and delocalized electrons, weakening the metallic bonds and lowering the melting point."
            },
            'density': {
                question: "Why does density increase down Group 2?",
                options: [
                    "Atomic mass increases more than atomic volume",
                    "Atomic volume increases more than atomic mass",
                    "Crystal structure changes",
                    "Electron configuration changes"
                ],
                correct: 0,
                explanation: "Density increases down Group 2 because the increase in atomic mass is proportionally greater than the increase in atomic volume."
            },
            'reactivity': {
                question: "Why does reactivity increase down Group 2?",
                options: [
                    "Nuclear charge increases",
                    "Atomic radius increases, making it easier to lose outer electrons",
                    "Electron shielding decreases",
                    "Ionization energy increases"
                ],
                correct: 1,
                explanation: "As we move down Group 2, the atomic radius increases due to additional electron shells. The outer electrons are further from the nucleus and experience more shielding, making them easier to lose and increasing reactivity."
            }
        };

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
                quizExplanation: "Magnesium oxide is commonly used as a dietary supplement to prevent and treat low levels of magnesium in the blood."
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
                    "It\'s radioactive and can be tracked",
                    "It\'s opaque to X-rays but safe to ingest",
                    "It enhances MRI contrast",
                    "It\'s fluorescent under UV light"
                ],
                quizCorrect: 1,
                quizExplanation: "Barium sulfate is used in medical imaging because it\'s opaque to X-rays, allowing doctors to see the digestive tract, but it\'s insoluble and safe to ingest."
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
                    "It\'s too expensive to extract",
                    "It\'s highly radioactive and dangerous",
                    "It\'s not reactive enough",
                    "It\'s toxic to humans"
                ],
                quizCorrect: 1,
                quizExplanation: "Radium is highly radioactive and dangerous to handle, which limits its use to specialized medical and research applications."
            }
        };

        // Reaction details
        const reactionDetails = {
            'magnesium-water': {
                equation: "Mg(s) + 2H₂O(l) → Mg(OH)₂(aq) + H₂(g)",
                observations: "Magnesium reacts very slowly with cold water, but reacts readily with steam to produce magnesium oxide and hydrogen gas.",
                explanation: "Magnesium has a protective oxide layer that prevents reaction with cold water. When heated or reacted with steam, this layer is disrupted and the reaction proceeds.",
                quizQuestion: "Why does Magnesium react slowly with cold water?",
                quizOptions: [
                    "It has a protective oxide layer",
                    "It\'s not reactive enough",
                    "Water is not a strong enough reactant",
                    "Magnesium is too stable"
                ],
                quizCorrect: 0,
                quizExplanation: "Magnesium has a protective oxide layer on its surface that prevents reaction with cold water. This layer must be disrupted for the reaction to occur."
            },
            'calcium-water': {
                equation: "Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)",
                observations: "Calcium fizzes steadily in cold water, producing bubbles of hydrogen gas. The solution becomes milky due to calcium hydroxide.",
                explanation: "Calcium reacts with cold water to produce calcium hydroxide and hydrogen gas. The reaction is more vigorous than magnesium but less than heavier Group 2 metals.",
                quizQuestion: "What makes the solution milky when Calcium reacts with water?",
                quizOptions: [
                    "Calcium oxide",
                    "Calcium hydroxide",
                    "Hydrogen gas",
                    "Calcium carbonate"
                ],
                quizCorrect: 1,
                quizExplanation: "Calcium hydroxide is slightly soluble in water, creating a milky suspension that gives the solution its characteristic appearance."
            },
            'barium-water': {
                equation: "Ba(s) + 2H₂O(l) → Ba(OH)₂(aq) + H₂(g)",
                observations: "Barium reacts vigorously with water, producing hydrogen gas rapidly. The reaction is exothermic and can be explosive.",
                explanation: "Barium is highly reactive due to its large atomic size and low ionization energy. It readily loses its two valence electrons to form Ba²⁺ ions.",
                quizQuestion: "Why is Barium more reactive than Calcium?",
                options: [
                    "It has more protons",
                    "It has a larger atomic radius",
                    "It has more electron shells",
                    "It has a higher density"
                ],
                correct: 1,
                explanation: "Barium has a larger atomic radius than calcium, making its outer electrons easier to lose, which increases its reactivity."
            },
            'magnesium-oxygen': {
                equation: "2Mg(s) + O₂(g) → 2MgO(s)",
                observations: "Magnesium burns with a bright white flame to form white magnesium oxide powder.",
                explanation: "Magnesium reacts with oxygen to form magnesium oxide. The reaction is highly exothermic and produces a characteristic bright white light.",
                quizQuestion: "What color flame does Magnesium produce when burned?",
                options: [
                    "Red",
                    "Yellow",
                    "Green",
                    "Bright white"
                ],
                correct: 3,
                quizExplanation: "Magnesium produces a bright white flame when burned due to the high temperature of the reaction and the properties of magnesium oxide."
            },
            'calcium-oxygen': {
                equation: "2Ca(s) + O₂(g) → 2CaO(s)",
                observations: "Calcium burns with an orange-red flame to form white calcium oxide.",
                explanation: "Calcium reacts with oxygen to form calcium oxide. The reaction is less vigorous than magnesium but still produces a visible flame.",
                quizQuestion: "What product forms when Calcium burns in oxygen?",
                options: [
                    "Calcium peroxide",
                    "Calcium oxide",
                    "Calcium superoxide",
                    "Calcium hydroxide"
                ],
                correct: 1,
                quizExplanation: "Calcium forms calcium oxide (CaO) when burned in oxygen, which is a typical oxide formed by Group 2 metals."
            },
            'barium-oxygen': {
                equation: "Ba(s) + O₂(g) → BaO₂(s)",
                observations: "Barium burns with a greenish-white flame to form barium peroxide.",
                explanation: "Barium forms a peroxide (BaO₂) when burned in oxygen. This contains the peroxide ion (O₂²⁻) with an oxygen-oxygen single bond.",
                quizQuestion: "What type of oxide does Barium form when burned in excess oxygen?",
                options: [
                    "Normal oxide (BaO)",
                    "Peroxide (BaO₂)",
                    "Superoxide (BaO₂)",
                    "No oxide is formed"
                ],
                correct: 1,
                quizExplanation: "Barium forms barium peroxide (BaO₂) when burned in oxygen, which contains the peroxide ion (O₂²⁻)."
            }
        };

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
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
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

        // Daily challenges
        const dailyChallenges = [
            {
                question: "Which Group 2 metal is used in medical imaging as a contrast agent?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 3,
                explanation: "Barium sulfate is used as a contrast agent in medical imaging because it's opaque to X-rays but safe to ingest."
            },
            {
                question: "What color flame does calcium produce when burned?",
                options: ["Red", "Yellow", "Green", "Brick-red"],
                correct: 3,
                explanation: "Calcium produces a brick-red flame in flame tests, which is characteristic of calcium ions."
            },
            {
                question: "Which Group 2 metal has the highest melting point?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 0,
                explanation: "Beryllium has the highest melting point (1287°C) due to its small atomic size and strong metallic bonding."
            },
            {
                question: "What is the main use of magnesium in the human body?",
                options: ["Bone formation", "Muscle contraction", "Oxygen transport", "Energy production"],
                correct: 1,
                explanation: "Magnesium is essential for proper muscle contraction, nerve function, and maintaining fluid balance in the body."
            },
            {
                question: "Which Group 2 metal is essential for plant growth?",
                options: ["Beryllium", "Magnesium", "Strontium", "Barium"],
                correct: 1,
                explanation: "Magnesium is essential for plant growth as it's the central atom in chlorophyll, the molecule responsible for photosynthesis."
            }
        ];

        // Graph quiz questions
        const graphQuizQuestions = [
            {
                question: "Which element has the highest melting point?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 0,
                explanation: "Beryllium has the highest melting point at 1287°C due to its small atomic size and strong metallic bonding."
            },
            {
                question: "What is the trend for density down Group 2?",
                options: ["Decreases", "Increases", "Remains constant", "No pattern"],
                correct: 1,
                explanation: "Density increases down Group 2 as atomic mass increases more significantly than atomic volume."
            },
            {
                question: "Which element is the most reactive?",
                options: ["Beryllium", "Magnesium", "Calcium", "Barium"],
                correct: 3,
                explanation: "Barium is the most reactive due to its large atomic radius and low ionization energy."
            }
        ];

        // Initialize app
        function initApp() {
            // Check authentication state
            auth.onAuthStateChanged((user) => {
                if (user) {
                    currentUser = user;
                    loadUserData();
                } else {
                    showLandingPage();
                }
            });
            
            // Initialize search functionality
            document.getElementById('searchInput').addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                // We'll search through the content of the current section
                if (searchTerm === '') {
                    // Show all content
                    document.querySelectorAll('.content-card').forEach(card => {
                        card.style.display = 'block';
                    });
                } else {
                    document.querySelectorAll('.content-card').forEach(card => {
                        const text = card.textContent.toLowerCase();
                        if (text.includes(searchTerm)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
            });
            
            // Initialize periodic table interactions
            document.querySelectorAll('.element').forEach(element => {
                element.addEventListener('click', function() {
                    const elementName = this.querySelector('.element-name').textContent;
                    showToast('info', 'Element Info', `You clicked on ${elementName}`);
                });
            });
        }

        // Navigation functions
        function navigateToSection(sectionName) {
            // Check if section is locked
            const navItem = document.getElementById(`nav-${sectionName}`);
            if (navItem && navItem.classList.contains('locked')) {
                showToast('info', 'Section Locked', 'Please complete previous sections first.');
                return;
            }
            
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show selected section
            const sectionElement = document.getElementById(`${sectionName}-section`);
            if (sectionElement) {
                sectionElement.style.display = 'block';
            }
            
            // Update active nav item
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
            });
            
            if (navItem) {
                navItem.classList.add('active');
            }
            
            currentSection = sectionName;
            
            // Load leaderboard if that section is selected
            if (sectionName === 'leaderboard') {
                loadLeaderboard();
            }
            
            // Initialize graph if properties section is selected
            if (sectionName === 'properties') {
                setTimeout(() => {
                    initializeGraph();
                    populateDataTable();
                    loadGraphQuiz();
                }, 100);
            }
        }

        // Show main app
        function showMainApp() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            
            // Update user info
            document.getElementById('userName').textContent = userData.displayName || 'User';
            document.getElementById('userEmail').textContent = currentUser.email || 'user@example.com';
            
            // Update XP and badges
            updateUserXP();
            updateUserBadges();
            
            // Update progress
            updateProgressTracker();
            updateSectionCompletionStatus();
            
            // Load discussion posts and study groups
            loadDiscussionPosts();
            loadStudyGroups();
            loadLeaderboard();
            
            // Check for daily challenge
            checkDailyChallenge();
        }

        // Load user data from Firebase
        function loadUserData() {
            const userRef = group2MetalsRef.child('users').child(currentUser.uid);
            userRef.once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    userData = snapshot.val();
                    completedSections = userData.completedSections || [];
                    showMainApp();
                } else {
                    // Create new user profile
                    const newUser = {
                        uid: currentUser.uid,
                        email: currentUser.email,
                        displayName: currentUser.displayName || 'User',
                        completedSections: [],
                        savedPosts: [],
                        xp: 0,
                        badges: [],
                        createdAt: firebase.database.ServerValue.TIMESTAMP
                    };
                    
                    userRef.set(newUser).then(() => {
                        userData = newUser;
                        completedSections = [];
                        showMainApp();
                    });
                }
            }).catch((error) => {
                console.error("Error loading user data:", error);
                showToast('error', 'Error', 'Failed to load your data.');
            });
        }

        // Show landing page
        function showLandingPage() {
            document.getElementById('landingPage').style.display = 'flex';
            document.getElementById('mainApp').style.display = 'none';
        }

        // Update user XP display
        function updateUserXP() {
            const xp = userData.xp || 0;
            document.getElementById('userXP').textContent = xp;
        }

        // Update user badges display
        function updateUserBadges() {
            const badges = userData.badges || [];
            const badgesContainer = document.getElementById('userBadges');
            badgesContainer.innerHTML = '';
            
            if (badges.length === 0) {
                badgesContainer.innerHTML = '<span class="text-sm text-gray-500">No badges yet</span>';
                return;
            }
            
            badges.forEach(badge => {
                const badgeElement = document.createElement('div');
                badgeElement.className = 'badge';
                badgeElement.innerHTML = `<i class="fas fa-medal"></i>`;
                badgeElement.title = badge;
                badgesContainer.appendChild(badgeElement);
            });
        }

        // Check for daily challenge
        function checkDailyChallenge() {
            const today = new Date().toISOString().split('T')[0];
            const challengeRef = group2MetalsRef.child('dailyChallenges').child(today);
            
            challengeRef.once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    dailyChallenge = snapshot.val();
                    
                    // Check if user has completed today's challenge
                    const userChallengeRef = group2MetalsRef.child('users').child(currentUser.uid).child('dailyChallenges').child(today);
                    userChallengeRef.once('value').then((userSnapshot) => {
                        if (!userSnapshot.exists()) {
                            // Show daily challenge
                            document.getElementById('dailyChallenge').style.display = 'block';
                            document.getElementById('dailyChallengeQuestion').textContent = dailyChallenge.question;
                        }
                    });
                } else {
                    // Create a new daily challenge for today
                    const randomChallenge = dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)];
                    challengeRef.set(randomChallenge).then(() => {
                        dailyChallenge = randomChallenge;
                        document.getElementById('dailyChallenge').style.display = 'block';
                        document.getElementById('dailyChallengeQuestion').textContent = dailyChallenge.question;
                    });
                }
            });
        }

        // Show daily challenge modal
        function showDailyChallengeModal() {
            if (!dailyChallenge) return;
            
            document.getElementById('dailyChallengeModal').classList.add('active');
            document.getElementById('dailyChallengeQuestionText').textContent = dailyChallenge.question;
            
            const optionsContainer = document.getElementById('dailyChallengeOptions');
            optionsContainer.innerHTML = '';
            
            dailyChallenge.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.dataset.index = index;
                
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'daily-challenge-option';
                input.id = `daily-option-${index}`;
                input.value = index;
                
                const label = document.createElement('label');
                label.htmlFor = `daily-option-${index}`;
                label.textContent = option;
                
                optionDiv.appendChild(input);
                optionDiv.appendChild(label);
                
                optionDiv.onclick = () => selectDailyChallengeOption(index);
                
                optionsContainer.appendChild(optionDiv);
            });
            
            // Reset feedback
            document.getElementById('dailyChallengeFeedback').classList.add('hidden');
            document.getElementById('dailyChallengeSubmitBtn').disabled = true;
            dailyChallengeAnswered = false;
        }

        // Close daily challenge modal
        function closeDailyChallengeModal() {
            document.getElementById('dailyChallengeModal').classList.remove('active');
        }

        // Select daily challenge option
        function selectDailyChallengeOption(index) {
            if (dailyChallengeAnswered) return;
            
            const options = document.querySelectorAll('#dailyChallengeOptions .quiz-option');
            options.forEach(option => {
                option.classList.remove('selected');
                const input = option.querySelector('input');
                input.checked = false;
            });
            
            options[index].classList.add('selected');
            options[index].querySelector('input').checked = true;
            
            document.getElementById('dailyChallengeSubmitBtn').disabled = false;
        }

        // Submit daily challenge
        function submitDailyChallenge() {
            if (dailyChallengeAnswered) return;
            
            const selectedOption = document.querySelector('#dailyChallengeOptions .quiz-option.selected');
            if (!selectedOption) return;
            
            const selectedIndex = parseInt(selectedOption.dataset.index);
            const isCorrect = selectedIndex === dailyChallenge.correct;
            
            const feedback = document.getElementById('dailyChallengeFeedback');
            if (isCorrect) {
                feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
                feedback.textContent = 'Correct! ' + dailyChallenge.explanation;
                
                // Award XP
                const newXp = (userData.xp || 0) + 5;
                const userRef = group2MetalsRef.child('users').child(currentUser.uid);
                userRef.update({
                    xp: newXp
                }).then(() => {
                    userData.xp = newXp;
                    updateUserXP();
                    
                    if (soundEnabled) correctSound.play();
                    showToast('success', 'Daily Challenge Complete!', 'You earned 5 XP!');
                });
            } else {
                feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
                feedback.textContent = 'Incorrect. ' + dailyChallenge.explanation;
                
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
            document.getElementById('dailyChallengeSubmitBtn').disabled = true;
            dailyChallengeAnswered = true;
            
            // Mark as completed
            const today = new Date().toISOString().split('T')[0];
            const userChallengeRef = group2MetalsRef.child('users').child(currentUser.uid).child('dailyChallenges').child(today);
            userChallengeRef.set(true);
            
            // Hide daily challenge banner
            document.getElementById('dailyChallenge').style.display = 'none';
        }

        // Tab functions
        function showTab(tabName) {
            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            const tabContent = document.getElementById(tabName);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            
            // Add active class to clicked tab
            const activeTab = document.querySelector(`[onclick="showTab('${tabName}')"]`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
            
            // Initialize graph if data visualization tab is selected
            if (tabName === 'data-visualization') {
                setTimeout(() => {
                    initializeGraph();
                    populateDataTable();
                    loadGraphQuiz();
                }, 100);
            }
        }

        function completeSection(sectionName) {
            if (completedSections.includes(sectionName)) {
                // If already completed, unmark as complete
                unmarkSectionComplete(sectionName);
                return;
            }
            
            completedSections.push(sectionName);
            
            // Award XP
            const xpAwarded = 10;
            const newXp = (userData.xp || 0) + xpAwarded;
            
            // Check for badges
            const newBadges = [...(userData.badges || [])];
            let badgeEarned = false;
            
            if (completedSections.length === 1 && !newBadges.includes('First Steps')) {
                newBadges.push('First Steps');
                badgeEarned = true;
            }
            
            if (completedSections.length === 4 && !newBadges.includes('Metal Master')) {
                newBadges.push('Metal Master');
                badgeEarned = true;
            }
            
            // Save to Firebase
            if (currentUser && userData) {
                const userRef = group2MetalsRef.child('users').child(currentUser.uid);
                const updates = {
                    completedSections: completedSections,
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
                    
                    showToast('success', 'Section Complete!', `Great job! You've completed this section and earned ${xpAwarded} XP.`);
                    
                    if (badgeEarned) {
                        showToast('success', 'Badge Earned!', `You've earned a new badge: ${newBadges[newBadges.length - 1]}`);
                    }
                    
                    updateSectionCompletionStatus();
                    updateProgressTracker();
                    
                    // Navigate to next section if available
                    const sectionOrder = ['overview', 'elements', 'properties', 'reactions', 'quiz'];
                    const currentIndex = sectionOrder.indexOf(sectionName);
                    if (currentIndex < sectionOrder.length - 1) {
                        const nextSection = sectionOrder[currentIndex + 1];
                        navigateToSection(nextSection);
                    }
                }).catch((error) => {
                    console.error("Error saving progress:", error);
                    showToast('error', 'Error', 'Failed to save your progress.');
                });
            }
        }

        function unmarkSectionComplete(sectionName) {
            // Remove from completed sections
            completedSections = completedSections.filter(section => section !== sectionName);
            
            // Update UI
            updateSectionCompletionStatus();
            updateProgressTracker();
            
            // Save to Firebase
            if (currentUser && userData) {
                const userRef = group2MetalsRef.child('users').child(currentUser.uid);
                userRef.update({
                    completedSections: completedSections
                }).then(() => {
                    showToast('info', 'Section Unmarked', `You've unmarked ${sectionName} as complete.`);
                }).catch((error) => {
                    console.error("Error updating progress:", error);
                    showToast('error', 'Error', 'Failed to update your progress.');
                });
            }
        }

        function updateSectionCompletionStatus() {
            // Update nav items
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const section = item.id.replace('nav-', '');
                if (completedSections.includes(section)) {
                    item.classList.remove('locked');
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
            });
            
            // Unlock next sections
            const sectionOrder = ['overview', 'elements', 'properties', 'reactions', 'quiz'];
            sectionOrder.forEach((section, index) => {
                if (completedSections.includes(section) && index < sectionOrder.length - 1) {
                    const nextSection = sectionOrder[index + 1];
                    const nextNavItem = document.getElementById(`nav-${nextSection}`);
                    if (nextNavItem) {
                        nextNavItem.classList.remove('locked');
                    }
                }
            });
            
            // Check if all sections are completed to unlock quiz
            const allSectionsCompleted = ['overview', 'elements', 'properties', 'reactions'].every(section => 
                completedSections.includes(section)
            );
            
            if (allSectionsCompleted) {
                const quizNavItem = document.getElementById('nav-quiz');
                if (quizNavItem) {
                    quizNavItem.classList.remove('locked');
                }
            }
            
            // Update section buttons
            updateSectionButtons();
        }

        function updateSectionButtons() {
            // Update each section's complete button
            const sections = ['overview', 'elements', 'properties', 'reactions', 'quiz'];
            sections.forEach(section => {
                const button = document.getElementById(`${section}-complete-btn`);
                if (button) {
                    if (completedSections.includes(section)) {
                        button.innerHTML = '<i class="fas fa-times mr-2"></i>Unmark as Complete';
                        button.classList.remove('btn-success');
                        button.classList.add('btn-unmark');
                    } else {
                        button.innerHTML = '<i class="fas fa-check mr-2"></i>Mark as Complete';
                        button.classList.remove('btn-unmark');
                        button.classList.add('btn-success');
                    }
                }
            });
        }

        function updateProgressTracker() {
            const totalSections = 4; // overview, elements, properties, reactions
            const completedCount = completedSections.length;
            const percentage = Math.round((completedCount / totalSections) * 100);
            
            document.getElementById('progressPercentage').textContent = `${percentage}%`;
            document.getElementById('overallProgressFill').style.width = `${percentage}%`;
            
            // Update progress items
            const sections = ['overview', 'elements', 'properties', 'quiz'];
            sections.forEach(section => {
                const progressItem = document.getElementById(`progress-${section}`);
                const statusElement = progressItem.querySelector('.text-xs');
                
                if (completedSections.includes(section)) {
                    progressItem.classList.add('bg-green-100');
                    statusElement.textContent = 'Completed';
                    statusElement.classList.remove('text-gray-500');
                    statusElement.classList.add('text-green-600');
                } else if (section === 'quiz' && completedSections.length === 4) {
                    progressItem.classList.remove('bg-gray-100');
                    progressItem.classList.add('bg-blue-100');
                    statusElement.textContent = 'Available';
                    statusElement.classList.remove('text-gray-500');
                    statusElement.classList.add('text-blue-600');
                }
            });
        }

        // Interactive element quiz functions
        function showElementQuiz(element) {
            const question = termQuizQuestions[element];
            if (!question) return;
            
            const popup = document.getElementById('elementQuizPopup');
            const title = document.getElementById('elementQuizTitle');
            const questionText = document.getElementById('elementQuizQuestion');
            const optionsContainer = document.getElementById('elementQuizOptions');
            const feedback = document.getElementById('elementQuizFeedback');
            
            title.textContent = `${element.charAt(0).toUpperCase() + element.slice(1)} Quiz`;
            questionText.textContent = question.question;
            
            optionsContainer.innerHTML = '';
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkElementQuizAnswer(index, question.correct, question.explanation);
                optionsContainer.appendChild(optionDiv);
            });
            
            feedback.classList.add('hidden');
            popup.classList.remove('hidden');
        }

        function checkElementQuizAnswer(selectedIndex, correctIndex, explanation) {
            const options = document.querySelectorAll('#elementQuizOptions .quiz-option');
            const feedback = document.getElementById('elementQuizFeedback');
            
            options.forEach((option, index) => {
                option.onclick = null; // Disable further clicks
                if (index === correctIndex) {
                    option.classList.add('correct');
                } else if (index === selectedIndex) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedIndex === correctIndex) {
                feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800';
                feedback.textContent = 'Correct! ' + explanation;
                if (soundEnabled) correctSound.play();
            } else {
                feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800';
                feedback.textContent = 'Incorrect. ' + explanation;
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        function closeElementQuiz() {
            document.getElementById('elementQuizPopup').classList.add('hidden');
        }

        // Term quiz functions
        function showTermQuiz(term) {
            const question = termQuizQuestions[term];
            if (!question) return;
            
            document.getElementById('quizQuestionModal').classList.add('active');
            document.getElementById('quizQuestionTitle').textContent = `Quick Quiz: ${term.replace('-', ' ')}`;
            document.getElementById('quizQuestionText').textContent = question.question;
            
            const answersContainer = document.getElementById('quizQuestionAnswers');
            answersContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'quiz-option';
                answerDiv.textContent = option;
                answerDiv.onclick = () => selectTermQuizAnswer(index, question.correct, question.explanation);
                answersContainer.appendChild(answerDiv);
            });
            
            // Reset feedback
            document.getElementById('quizQuestionFeedback').classList.add('hidden');
        }

        function selectTermQuizAnswer(index, correctIndex, explanation) {
            const answers = document.querySelectorAll('#quizQuestionAnswers .quiz-option');
            const feedback = document.getElementById('quizQuestionFeedback');
            
            answers.forEach(answer => {
                answer.style.pointerEvents = 'none';
            });
            
            if (index === correctIndex) {
                answers[index].classList.add('correct');
                feedback.className = 'quiz-feedback correct';
                feedback.textContent = 'Correct! ' + explanation;
                
                if (soundEnabled) correctSound.play();
            } else {
                answers[index].classList.add('incorrect');
                feedback.className = 'quiz-feedback incorrect';
                feedback.textContent = 'Incorrect. ' + explanation;
                
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        function closeQuizQuestionModal() {
            document.getElementById('quizQuestionModal').classList.remove('active');
        }

        // Trend quiz functions
        function showTrendQuiz(trend) {
            const question = trendQuizQuestions[trend];
            if (!question) return;
            
            document.getElementById('quizQuestionModal').classList.add('active');
            document.getElementById('quizQuestionTitle').textContent = `Trend Quiz: ${trend.replace('-', ' ')}`;
            document.getElementById('quizQuestionText').textContent = question.question;
            
            const answersContainer = document.getElementById('quizQuestionAnswers');
            answersContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'quiz-option';
                answerDiv.textContent = option;
                answerDiv.onclick = () => selectTrendQuizAnswer(index, question.correct, question.explanation);
                answersContainer.appendChild(answerDiv);
            });
            
            // Reset feedback
            document.getElementById('quizQuestionFeedback').classList.add('hidden');
        }

        function selectTrendQuizAnswer(index, correctIndex, explanation) {
            const answers = document.querySelectorAll('#quizQuestionAnswers .quiz-option');
            const feedback = document.getElementById('quizQuestionFeedback');
            
            answers.forEach(answer => {
                answer.style.pointerEvents = 'none';
            });
            
            if (index === correctIndex) {
                answers[index].classList.add('correct');
                feedback.className = 'quiz-feedback correct';
                feedback.textContent = 'Correct! ' + explanation;
                
                if (soundEnabled) correctSound.play();
            } else {
                answers[index].classList.add('incorrect');
                feedback.className = 'quiz-feedback incorrect';
                feedback.textContent = 'Incorrect. ' + explanation;
                
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        // Element details functions
        function showElementDetails(name, symbol, atomicNumber, electronConfig) {
            const details = elementDetails[name];
            if (!details) return;
            
            document.getElementById('elementDetailsName').textContent = name;
            document.getElementById('elementDetailsSymbol').textContent = symbol;
            document.getElementById('elementDetailsNumber').textContent = atomicNumber;
            document.getElementById('elementDetailsConfig').textContent = electronConfig;
            document.getElementById('elementDetailsMP').textContent = details.meltingPoint;
            document.getElementById('elementDetailsDensity').textContent = details.density;
            document.getElementById('elementDetailsReactivity').textContent = details.reactivity;
            document.getElementById('elementDetailsUses').textContent = details.uses;
            document.getElementById('elementDetailsFact').textContent = details.fact;
            
            // Setup quiz
            document.getElementById('elementDetailsQuizQuestion').textContent = details.quizQuestion;
            const optionsContainer = document.getElementById('elementDetailsQuizOptions');
            optionsContainer.innerHTML = '';
            
            details.quizOptions.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkElementDetailsQuizAnswer(index, details.quizCorrect, details.quizExplanation);
                optionsContainer.appendChild(optionDiv);
            });
            
            document.getElementById('elementDetailsQuizFeedback').classList.add('hidden');
            document.getElementById('elementDetailsModal').classList.add('active');
        }

        function checkElementDetailsQuizAnswer(selectedIndex, correctIndex, explanation) {
            const options = document.querySelectorAll('#elementDetailsQuizOptions .quiz-option');
            const feedback = document.getElementById('elementDetailsQuizFeedback');
            
            options.forEach((option, index) => {
                option.onclick = null; // Disable further clicks
                if (index === correctIndex) {
                    option.classList.add('correct');
                } else if (index === selectedIndex) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedIndex === correctIndex) {
                feedback.className = 'mt-3 p-4 rounded-lg bg-green-100 text-green-800';
                feedback.textContent = 'Correct! ' + explanation;
                if (soundEnabled) correctSound.play();
            } else {
                feedback.className = 'mt-3 p-4 rounded-lg bg-red-100 text-red-800';
                feedback.textContent = 'Incorrect. ' + explanation;
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        function closeElementDetails() {
            document.getElementById('elementDetailsModal').classList.remove('active');
        }

        // Trend explanation functions
        function showTrendExplanation(trend, element) {
            let title, heading, content, quizQuestion, quizOptions, quizCorrect, quizExplanation;
            
            if (trend === 'melting-point') {
                title = 'Melting Point Trend';
                heading = `Melting Point of ${element.charAt(0).toUpperCase() + element.slice(1)}`;
                
                if (element === 'beryllium') {
                    content = 'Beryllium has the highest melting point in Group 2 (1287°C) due to its small atomic size and strong metallic bonding. The small size of beryllium atoms means the positive nuclei are closer to the delocalized electrons, resulting in stronger metallic bonds that require more energy to break.';
                } else if (element === 'magnesium') {
                    content = 'Magnesium has a lower melting point (650°C) than beryllium due to its larger atomic size. The increased atomic radius means the positive nuclei are further from the delocalized electrons, weakening the metallic bonds and requiring less energy to break them.';
                } else if (element === 'calcium') {
                    content = 'Calcium has an even lower melting point (842°C) due to its larger atomic size. The additional electron shell increases the atomic radius significantly, further weakening the metallic bonds.';
                } else if (element === 'strontium') {
                    content = 'Strontium has a very low melting point (777°C) due to its large atomic size. The increased distance between positive nuclei and delocalized electrons results in very weak metallic bonds.';
                } else if (element === 'barium') {
                    content = 'Barium has the lowest melting point in Group 2 (727°C) due to its largest atomic size. The significant distance between positive nuclei and delocalized electrons results in extremely weak metallic bonds that require very little energy to break.';
                }
                
                quizQuestion = "Why does melting point decrease down Group 2?";
                quizOptions = [
                    "Atomic size increases, metallic bonds weaken",
                    "Atomic size decreases, metallic bonds strengthen",
                    "Electron configuration changes",
                    "Nuclear charge increases"
                ];
                quizCorrect = 0;
                quizExplanation = "As we move down Group 2, atomic size increases due to additional electron shells. This increases the distance between positive nuclei and delocalized electrons, weakening the metallic bonds and lowering the melting point.";
            } else if (trend === 'density') {
                title = 'Density Trend';
                heading = `Density of ${element.charAt(0).toUpperCase() + element.slice(1)}`;
                
                if (element === 'beryllium') {
                    content = 'Beryllium has a density of 1.85 g/cm³. Its relatively low density is due to its small atomic mass combined with a compact atomic structure.';
                } else if (element === 'magnesium') {
                    content = 'Magnesium has a lower density (1.74 g/cm³) than beryllium. The increase in atomic volume is proportionally greater than the increase in atomic mass compared to beryllium.';
                } else if (element === 'calcium') {
                    content = 'Calcium has a lower density (1.55 g/cm³) than magnesium. The increase in atomic volume is proportionally greater than the increase in atomic mass compared to magnesium.';
                } else if (element === 'strontium') {
                    content = 'Strontium has a higher density (2.64 g/cm³) than calcium. The increase in atomic mass is proportionally greater than the increase in atomic volume, following the general trend of increasing density down the group.';
                } else if (element === 'barium') {
                    content = 'Barium has the highest density in Group 2 (3.62 g/cm³). The significant increase in atomic mass compared to the increase in atomic volume results in the highest density in the group.';
                }
                
                quizQuestion = "Why does density increase down Group 2?";
                quizOptions = [
                    "Atomic mass increases more than atomic volume",
                    "Atomic volume increases more than atomic mass",
                    "Crystal structure changes",
                    "Electron configuration changes"
                ];
                quizCorrect = 0;
                quizExplanation = "Density increases down Group 2 because the increase in atomic mass is proportionally greater than the increase in atomic volume.";
            }
            
            document.getElementById('trendExplanationTitle').textContent = title;
            document.getElementById('trendExplanationHeading').textContent = heading;
            document.getElementById('trendExplanationContent').textContent = content;
            document.getElementById('trendExplanationQuizQuestion').textContent = quizQuestion;
            
            const optionsContainer = document.getElementById('trendExplanationQuizOptions');
            optionsContainer.innerHTML = '';
            
            quizOptions.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkTrendExplanationQuizAnswer(index, quizCorrect, quizExplanation);
                optionsContainer.appendChild(optionDiv);
            });
            
            document.getElementById('trendExplanationQuizFeedback').classList.add('hidden');
            document.getElementById('trendExplanationModal').classList.add('active');
        }

        function checkTrendExplanationQuizAnswer(selectedIndex, correctIndex, explanation) {
            const options = document.querySelectorAll('#trendExplanationQuizOptions .quiz-option');
            const feedback = document.getElementById('trendExplanationQuizFeedback');
            
            options.forEach((option, index) => {
                option.onclick = null; // Disable further clicks
                if (index === correctIndex) {
                    option.classList.add('correct');
                } else if (index === selectedIndex) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedIndex === correctIndex) {
                feedback.className = 'mt-3 p-4 rounded-lg bg-green-100 text-green-800';
                feedback.textContent = 'Correct! ' + explanation;
                if (soundEnabled) correctSound.play();
            } else {
                feedback.className = 'mt-3 p-4 rounded-lg bg-red-100 text-red-800';
                feedback.textContent = 'Incorrect. ' + explanation;
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        function closeTrendExplanation() {
            document.getElementById('trendExplanationModal').classList.remove('active');
        }

        // Reaction details functions
        function showReactionDetails(reaction) {
            const details = reactionDetails[reaction];
            if (!details) return;
            
            document.getElementById('reactionDetailsTitle').textContent = `${reaction.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
            document.getElementById('reactionDetailsEquation').textContent = details.equation;
            document.getElementById('reactionDetailsObservations').textContent = details.observations;
            document.getElementById('reactionDetailsExplanation').textContent = details.explanation;
            
            // Setup quiz
            document.getElementById('reactionDetailsQuizQuestion').textContent = details.quizQuestion;
            const optionsContainer = document.getElementById('reactionDetailsQuizOptions');
            optionsContainer.innerHTML = '';
            
            details.quizOptions.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkReactionDetailsQuizAnswer(index, details.quizCorrect, details.quizExplanation);
                optionsContainer.appendChild(optionDiv);
            });
            
            document.getElementById('reactionDetailsQuizFeedback').classList.add('hidden');
            document.getElementById('reactionDetailsModal').classList.add('active');
        }

        function checkReactionDetailsQuizAnswer(selectedIndex, correctIndex, explanation) {
            const options = document.querySelectorAll('#reactionDetailsQuizOptions .quiz-option');
            const feedback = document.getElementById('reactionDetailsQuizFeedback');
            
            options.forEach((option, index) => {
                option.onclick = null; // Disable further clicks
                if (index === correctIndex) {
                    option.classList.add('correct');
                } else if (index === selectedIndex) {
                    option.classList.add('incorrect');
                }
            });
            
            if (selectedIndex === correctIndex) {
                feedback.className = 'mt-3 p-4 rounded-lg bg-green-100 text-green-800';
                feedback.textContent = 'Correct! ' + explanation;
                if (soundEnabled) correctSound.play();
            } else {
                feedback.className = 'mt-3 p-4 rounded-lg bg-red-100 text-red-800';
                feedback.textContent = 'Incorrect. ' + explanation;
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        function closeReactionDetails() {
            document.getElementById('reactionDetailsModal').classList.remove('active');
        }

        function showReactionVideo(element) {
            // Create a modal to show the video
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.zIndex = '1001'; // Ensure it's on top
            
            // Define video URLs for each element (replace with actual video URLs)
            const videoUrls = {
                'magnesium': 'https://www.youtube.com/embed/uQk3Dk6IpQ',
                'calcium': 'https://www.youtube.com/embed/5aDH6N2v3s8',
                'barium': 'https://www.youtube.com/embed/6F3HlJn5c5s',
                'strontium': 'https://www.youtube.com/embed/d26hCR5FQgU'
            };
            
            // Get the video URL for the selected element
            const videoUrl = videoUrls[element] || 'https://www.youtube.com/embed/TGZs93DzMDY'; // Default video
            
            // Set modal content
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 900px;">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800 capitalize">${element} Reaction with Water</h2>
                        <button class="close-video-modal text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="aspect-w-16 aspect-h-9 mb-6">
                        <iframe id="video-iframe" src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-96 rounded-lg"></iframe>
                    </div>
                    
                    <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                        <h3 class="font-semibold text-blue-800 mb-3">Observations</h3>
                        <p id="reactionVideoObservations">Loading observations...</p>
                    </div>
                    
                    <div class="flex justify-end mt-6">
                        <button class="close-video-modal btn btn-secondary transform transition-all duration-300 hover:scale-105">
                            Close
                        </button>
                    </div>
                </div>
            `;
            
            // Add modal to the body
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Set observations based on element
            const observations = {
                'magnesium': 'Magnesium reacts very slowly with cold water due to a protective oxide layer, but reacts readily with steam.',
                'calcium': 'Calcium fizzes steadily in cold water, producing bubbles of hydrogen gas. The solution becomes milky.',
                'barium': 'Barium reacts vigorously with water, producing hydrogen gas rapidly. The reaction is exothermic.',
                'strontium': 'Strontium reacts steadily with water, producing hydrogen gas and heat.'
            };
            
            document.getElementById('reactionVideoObservations').textContent = observations[element] || 'Observations not available.';
            
            // Add event listeners to close buttons
            const closeButtons = modal.querySelectorAll('.close-video-modal');
            closeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Stop the video by clearing the iframe src
                    const iframe = document.getElementById('video-iframe');
                    if (iframe) {
                        iframe.src = '';
                    }
                    
                    // Remove the modal from the DOM
                    modal.remove();
                });
            });
        }

        function showOxideTrendQuiz() {
            const question = {
                question: "Which type of oxide does Barium form when burned in excess oxygen?",
                options: [
                    "Normal oxide (BaO)",
                    "Peroxide (BaO₂)",
                    "Superoxide (BaO₂)",
                    "No oxide is formed"
                ],
                correct: 1,
                explanation: "Barium forms barium peroxide (BaO₂) when burned in oxygen. This contains the peroxide ion (O₂²⁻) with an oxygen-oxygen single bond."
            };
            
            document.getElementById('quizQuestionModal').classList.add('active');
            document.getElementById('quizQuestionTitle').textContent = 'Oxide Trend Quiz';
            document.getElementById('quizQuestionText').textContent = question.question;
            
            const answersContainer = document.getElementById('quizQuestionAnswers');
            answersContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'quiz-option';
                answerDiv.textContent = option;
                answerDiv.onclick = () => selectOxideTrendQuizAnswer(index, question.correct, question.explanation);
                answersContainer.appendChild(answerDiv);
            });
            
            // Reset feedback
            document.getElementById('quizQuestionFeedback').classList.add('hidden');
        }

        function selectOxideTrendQuizAnswer(index, correctIndex, explanation) {
            const answers = document.querySelectorAll('#quizQuestionAnswers .quiz-option');
            const feedback = document.getElementById('quizQuestionFeedback');
            
            answers.forEach(answer => {
                answer.style.pointerEvents = 'none';
            });
            
            if (index === correctIndex) {
                answers[index].classList.add('correct');
                feedback.className = 'quiz-feedback correct';
                feedback.textContent = 'Correct! ' + explanation;
                
                if (soundEnabled) correctSound.play();
            } else {
                answers[index].classList.add('incorrect');
                feedback.className = 'quiz-feedback incorrect';
                feedback.textContent = 'Incorrect. ' + explanation;
                
                if (soundEnabled) incorrectSound.play();
            }
            
            feedback.classList.remove('hidden');
        }

        // Quiz Functions
        function startQuiz() {
            currentQuestion = 0;
            score = 0;
            selectedOption = null;
            answerSubmitted = false;
            quizAnswers = [];
            
            document.getElementById('quizModal').classList.add('active');
            document.getElementById('quizProgress').style.display = 'block';
            document.getElementById('quizContent').style.display = 'block';
            document.getElementById('quizResults').style.display = 'none';
            
            document.getElementById('currentQuestion').textContent = currentQuestion + 1;
            document.getElementById('totalQuestions').textContent = quizQuestions.length;
            document.getElementById('currentScore').textContent = score;
            document.getElementById('progressFill').style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
            
            loadQuestion();
            
            // Add anti-cheating measures
            addAntiCheatingMeasures();
        }

        function addAntiCheatingMeasures() {
            // Disable right-click
            document.getElementById('quizModal').addEventListener('contextmenu', e => e.preventDefault());
            
            // Disable text selection
            document.getElementById('quizModal').addEventListener('selectstart', e => e.preventDefault());
            document.getElementById('quizModal').addEventListener('mousedown', e => e.preventDefault());
            
            // Warn before leaving
            window.addEventListener('beforeunload', preventQuizExit);
        }

        function removeAntiCheatingMeasures() {
            // Re-enable right-click
            document.getElementById('quizModal').removeEventListener('contextmenu', e => e.preventDefault());
            
            // Re-enable text selection
            document.getElementById('quizModal').removeEventListener('selectstart', e => e.preventDefault());
            document.getElementById('quizModal').removeEventListener('mousedown', e => e.preventDefault());
            
            // Remove beforeunload listener
            window.removeEventListener('beforeunload', preventQuizExit);
        }

        function preventQuizExit(e) {
            if (document.getElementById('quizModal').classList.contains('active')) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        }

        function loadQuestion() {
            const question = quizQuestions[currentQuestion];
            document.getElementById('questionText').textContent = question.question;
            
            const optionsContainer = document.getElementById('optionsContainer');
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
            document.getElementById('prevButton').classList.toggle('hidden', currentQuestion === 0);
            
            // Show submit button if not answered, show next button if answered
            if (answeredQuestion) {
                document.getElementById('submitButton').style.display = 'none';
                document.getElementById('nextButton').classList.remove('hidden');
                
                // Show feedback for answered question
                const feedback = document.getElementById('feedback');
                if (answeredQuestion.isCorrect) {
                    feedback.className = 'mb-5 p-4 rounded-lg bg-green-100 text-green-800 text-sm';
                    feedback.textContent = 'Correct! ' + question.explanation;
                } else {
                    feedback.className = 'mb-5 p-4 rounded-lg bg-red-100 text-red-800 text-sm';
                    feedback.textContent = 'Incorrect. ' + question.explanation;
                }
                feedback.classList.remove('hidden');
            } else {
                document.getElementById('submitButton').style.display = 'inline-flex';
                document.getElementById('nextButton').classList.add('hidden');
                document.getElementById('feedback').classList.add('hidden');
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
                input.checked = false;
            });
            
            options[index].classList.add('selected');
            options[index].querySelector('input').checked = true;
            
            selectedOption = index;
            document.getElementById('submitButton').disabled = false;
        }

        function submitAnswer() {
            if (answerSubmitted) return;
            
            const question = quizQuestions[currentQuestion];
            const isCorrect = selectedOption === question.correct;
            const feedback = document.getElementById('feedback');
            
            quizAnswers[currentQuestion] = {
                selected: selectedOption,
                submitted: true,
                isCorrect: isCorrect
            };
            
            // Store quiz analytics in Firebase
            const analyticsRef = group2MetalsRef.child('quizAnalytics').child(currentQuestion);
            analyticsRef.transaction((analytics) => {
                if (!analytics) {
                    analytics = { correct: 0, incorrect: 0 };
                }
                if (isCorrect) {
                    analytics.correct++;
                } else {
                    analytics.incorrect++;
                }
                return analytics;
            });
            
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
            document.getElementById('submitButton').style.display = 'none';
            document.getElementById('nextButton').classList.remove('hidden');
            document.getElementById('currentScore').textContent = score;
            
            answerSubmitted = true;
        }

        function nextQuestion() {
            currentQuestion++;
            
            if (currentQuestion >= quizQuestions.length) {
                showResults();
                return;
            }
            
            document.getElementById('currentQuestion').textContent = currentQuestion + 1;
            document.getElementById('progressFill').style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
            loadQuestion();
        }

        function previousQuestion() {
            if (currentQuestion > 0) {
                currentQuestion--;
                document.getElementById('currentQuestion').textContent = currentQuestion + 1;
                document.getElementById('progressFill').style.width = ((currentQuestion + 1) / quizQuestions.length * 100) + '%';
                loadQuestion();
            }
        }

        function showResults() {
            document.getElementById('quizProgress').style.display = 'none';
            document.getElementById('quizContent').style.display = 'none';
            document.getElementById('quizResults').style.display = 'block';
            
            const percentage = Math.round((score / quizQuestions.length) * 100);
            document.getElementById('finalScore').textContent = `${score}/${quizQuestions.length}`;
            
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
            
            document.getElementById('scoreMessage').textContent = message;
            
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
            
            // Remove anti-cheating measures
            removeAntiCheatingMeasures();
        }

        function closeQuiz() {
            document.getElementById('quizModal').classList.remove('active');
            removeAntiCheatingMeasures();
        }

        // Feedback System Functions
        function showFeedbackModal() {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to provide feedback.');
                showLoginModal();
                return;
            }
            document.getElementById('feedbackModal').classList.add('active');
        }

        function closeFeedbackModal() {
            document.getElementById('feedbackModal').classList.remove('active');
            document.getElementById('feedbackForm').reset();
            document.getElementById('feedbackRating').value = '0';
            // Reset thumbs
            document.querySelectorAll('#feedbackModal .fa-thumbs-up, #feedbackModal .fa-thumbs-down').forEach(icon => {
                icon.classList.remove('fas', 'text-yellow-500');
                icon.classList.add('far', 'text-gray-400');
            });
        }

        function setFeedbackRating(rating) {
            document.getElementById('feedbackRating').value = rating;
            // Update the thumbs
            document.querySelectorAll('#feedbackModal .fa-thumbs-up, #feedbackModal .fa-thumbs-down').forEach(icon => {
                icon.classList.remove('fas', 'text-yellow-500');
                icon.classList.add('far', 'text-gray-400');
            });
            if (rating === 1) {
                const thumbsDown = document.querySelector('#feedbackModal .fa-thumbs-down');
                thumbsDown.classList.remove('far', 'text-gray-400');
                thumbsDown.classList.add('fas', 'text-yellow-500');
            } else if (rating === 2) {
                const thumbsUp = document.querySelector('#feedbackModal .fa-thumbs-up');
                thumbsUp.classList.remove('far', 'text-gray-400');
                thumbsUp.classList.add('fas', 'text-yellow-500');
            }
        }

        function handleFeedback(event) {
            event.preventDefault();
            const text = document.getElementById('feedbackText').value.trim();
            const rating = document.getElementById('feedbackRating').value;
            if (!text) {
                showToast('error', 'Missing Feedback', 'Please enter your feedback.');
                return;
            }
            // Save feedback to Firebase
            const feedbackRef = group2MetalsRef.child('feedback').push();
            feedbackRef.set({
                userId: currentUser.uid,
                userName: userData.displayName,
                text: text,
                rating: rating,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            }).then(() => {
                showToast('success', 'Feedback Sent', 'Thank you for your feedback.');
                closeFeedbackModal();
            }).catch((error) => {
                console.error("Error sending feedback:", error);
                showToast('error', 'Error', 'Failed to send feedback.');
            });
        }

        // Export to PDF
        function exportToPDF() {
            // Define the filename of your pre-existing PDF
            const pdfFileName = "Alkaline Earth Metals.pdf";
            
            // Create a temporary link element to trigger download
            const link = document.createElement('a');
            link.href = pdfFileName;  // Just the filename, no path
            link.download = pdfFileName;
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show success notification with filename
            showToast('success', 'Export Successful', `Downloading: ${pdfFileName}`);
        }

        // Discussion functions
        function showCreatePostModal() {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to create posts.');
                showLoginModal();
                return;
            }
            document.getElementById('createPostModal').classList.add('active');
        }

        function closeCreatePostModal() {
            document.getElementById('createPostModal').classList.remove('active');
            document.getElementById('createPostForm').reset();
        }

        function showEditPostModal(postId) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to edit posts.');
                showLoginModal();
                return;
            }
            
            const post = discussionPosts.find(p => p.id === postId);
            if (!post) return;
            
            document.getElementById('editPostId').value = postId;
            document.getElementById('editPostTitle').value = post.title;
            document.getElementById('editPostContent').value = post.content;
            document.getElementById('editPostTags').value = post.tags ? post.tags.join(', ') : '';
            
            document.getElementById('editPostModal').classList.add('active');
        }

        function closeEditPostModal() {
            document.getElementById('editPostModal').classList.remove('active');
            document.getElementById('editPostForm').reset();
        }

        function handleCreatePost(event) {
            event.preventDefault();
            
            const title = document.getElementById('postTitle').value.trim();
            const content = document.getElementById('postContent').value.trim();
            const tags = document.getElementById('postTags').value.trim();
            
            if (!title || !content) {
                showToast('error', 'Missing Fields', 'Please fill in all required fields.');
                return;
            }
            
            const postsRef = group2MetalsRef.child('discussionPosts').push();
            const newPost = {
                authorId: currentUser.uid,
                authorName: userData.displayName,
                title: title,
                content: content,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                upvotes: 0,
                downvotes: 0,
                votes: {},
                comments: 0,
                saved: 0,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            
            postsRef.set(newPost).then(() => {
                showToast('success', 'Post Created!', 'Your post has been published successfully.');
                closeCreatePostModal();
            }).catch((error) => {
                console.error("Error creating post:", error);
                showToast('error', 'Error', 'Failed to create post.');
            });
        }

        function handleEditPost(event) {
            event.preventDefault();
            
            const postId = document.getElementById('editPostId').value;
            const title = document.getElementById('editPostTitle').value.trim();
            const content = document.getElementById('editPostContent').value.trim();
            const tags = document.getElementById('editPostTags').value.trim();
            
            if (!title || !content) {
                showToast('error', 'Missing Fields', 'Please fill in all required fields.');
                return;
            }
            
            const postRef = group2MetalsRef.child('discussionPosts').child(postId);
            postRef.once('value').then((snapshot) => {
                const post = snapshot.val();
                
                if (!post) {
                    showToast('error', 'Error', 'Post not found.');
                    return;
                }
                
                if (post.authorId !== currentUser.uid) {
                    showToast('error', 'Permission Denied', 'You can only edit your own posts.');
                    return;
                }
                
                const updates = {};
                updates['/title'] = title;
                updates['/content'] = content;
                updates['/tags'] = tags ? tags.split(',').map(tag => tag.trim()) : [];
                updates['/editedAt'] = firebase.database.ServerValue.TIMESTAMP;
                
                postRef.update(updates).then(() => {
                    showToast('success', 'Post Updated!', 'Your post has been updated successfully.');
                    closeEditPostModal();
                }).catch((error) => {
                    console.error("Error updating post:", error);
                    showToast('error', 'Error', 'Failed to update post.');
                });
            }).catch((error) => {
                console.error("Error getting post:", error);
                showToast('error', 'Error', 'Failed to update post.');
            });
        }

        function loadDiscussionPosts() {
            const postsContainer = document.getElementById('discussionPosts');
            postsContainer.innerHTML = '<div class="spinner"></div>';
            
            const postsRef = group2MetalsRef.child('discussionPosts');

            postsRef.orderByChild('createdAt').on('value', (snapshot) => {
                postsContainer.innerHTML = '';
                
                if (!snapshot.exists()) {
                    postsContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="fas fa-comments"></i>
                            </div>
                            <h3 class="empty-state-title">No Posts Yet</h3>
                            <p class="empty-state-description">Be the first to start a discussion about Group 2 Alkaline Earth Metals.</p>
                        </div>`;
                    return;
                }
                
                discussionPosts = [];
                snapshot.forEach((childSnapshot) => {
                    discussionPosts.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                
                // Sort based on current sort option
                sortDiscussionPosts();
                
                discussionPosts.forEach(post => {
                    const postElement = createDiscussionPostElement(post);
                    postsContainer.appendChild(postElement);
                });
            }, (error) => {
                console.error("Error loading discussion posts:", error);
                postsContainer.innerHTML = '<p class="text-gray-500 text-center">Error loading posts.</p>';
            });
        }

        function sortDiscussionPosts() {
            switch(currentSort) {
                case 'newest':
                    discussionPosts.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    break;
                case 'oldest':
                    discussionPosts.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    });
                    break;
                case 'popular':
                    discussionPosts.sort((a, b) => {
                        const aScore = (a.upvotes || 0) - (a.downvotes || 0);
                        const bScore = (b.upvotes || 0) - (b.downvotes || 0);
                        return bScore - aScore;
                    });
                    break;
            }
        }

        function sortDiscussions(sortType) {
            currentSort = sortType;
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active', 'bg-indigo-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            event.target.classList.remove('bg-gray-200', 'text-gray-700');
            event.target.classList.add('active', 'bg-indigo-600', 'text-white');
            
            // Re-sort and re-render
            sortDiscussionPosts();
            
            const postsContainer = document.getElementById('discussionPosts');
            postsContainer.innerHTML = '';
            
            discussionPosts.forEach(post => {
                const postElement = createDiscussionPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }

        function filterDiscussions() {
            const searchTerm = document.getElementById('discussionSearch').value.toLowerCase();
            
            const postsContainer = document.getElementById('discussionPosts');
            postsContainer.innerHTML = '';
            
            const filteredPosts = discussionPosts.filter(post => {
                return post.title.toLowerCase().includes(searchTerm) || 
                       post.content.toLowerCase().includes(searchTerm) ||
                       (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm)));
            });
            
            if (filteredPosts.length === 0) {
                postsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">
                            <i class="fas fa-search"></i>
                        </div>
                        <h3 class="empty-state-title">No Posts Found</h3>
                        <p class="empty-state-description">No posts match your search criteria.</p>
                    </div>`;
                return;
            }
            
            filteredPosts.forEach(post => {
                const postElement = createDiscussionPostElement(post);
                postsContainer.appendChild(postElement);
            });
        }

        function createDiscussionPostElement(post) {
            const postDiv = document.createElement('div');
            postDiv.className = 'discussion-post';
            
            const date = new Date(post.createdAt);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const isAuthor = currentUser && post.authorId === currentUser.uid;
            const userVote = post.votes && post.votes[currentUser.uid];
            const isSaved = userData && userData.savedPosts && userData.savedPosts.includes(post.id);
            
            postDiv.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar">${post.authorName ? post.authorName.charAt(0).toUpperCase() : 'A'}</div>
                    <div class="post-meta">
                        <div class="post-author">${post.authorName || 'Anonymous'}</div>
                        <div class="post-time">${formattedDate} at ${formattedTime}</div>
                    </div>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <div class="post-content">${post.content}</div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="mt-3">
                        ${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <div class="post-actions">
                    <div class="post-action ${userVote === true ? 'voted' : ''}" onclick="togglePostVote('${post.id}', 'up')">
                        <i class="fas fa-arrow-up"></i>
                        <span>${post.upvotes || 0}</span>
                    </div>
                    <div class="post-action ${userVote === false ? 'voted' : ''}" onclick="togglePostVote('${post.id}', 'down')">
                        <i class="fas fa-arrow-down"></i>
                        <span>${post.downvotes || 0}</span>
                    </div>
                    <div class="post-action" onclick="toggleComments('${post.id}')">
                        <i class="fas fa-comment"></i>
                        <span>${post.comments || 0}</span>
                    </div>
                    <div class="post-action ${isSaved ? 'voted' : ''}" onclick="toggleSavePost('${post.id}')">
                        <i class="fas fa-bookmark"></i>
                        <span>${post.saved || 0}</span>
                    </div>
                    ${isAuthor ? `
                        <div class="post-action" onclick="showEditPostModal('${post.id}')">
                            <i class="fas fa-edit"></i>
                            Edit
                        </div>
                        <div class="post-action text-red-500" onclick="deletePost('${post.id}')">
                            <i class="fas fa-trash"></i>
                            Delete
                        </div>
                    ` : ''}
                </div>
                <div id="comments-${post.id}" class="comments-section" style="display: none;">
                    <div class="mb-4">
                        <form onsubmit="addComment(event, '${post.id}')" class="flex gap-3">
                            <input type="text" id="comment-input-${post.id}" class="form-input flex-1" placeholder="Add a comment...">
                            <button type="submit" class="btn btn-primary">Comment</button>
                        </form>
                    </div>
                    <div id="comments-list-${post.id}"></div>
                </div>
            `;
            
            // Load comments for this post
            loadPostComments(post.id);
            
            return postDiv;
        }

        function togglePostVote(postId, voteType) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to vote on posts.');
                showLoginModal();
                return;
            }
            
            const postRef = group2MetalsRef.child('discussionPosts').child(postId);
            postRef.once('value').then((snapshot) => {
                const post = snapshot.val();
                
                if (!post) {
                    showToast('error', 'Error', 'Post not found.');
                    return;
                }
                
                const votes = post.votes || {};
                const currentVote = votes[currentUser.uid];
                const upvotes = post.upvotes || 0;
                const downvotes = post.downvotes || 0;
                
                let newUpvotes = upvotes;
                let newDownvotes = downvotes;
                let newVotes = { ...votes };
                
                if (voteType === 'up') {
                    if (currentVote === true) {
                        // Remove upvote
                        delete newVotes[currentUser.uid];
                        newUpvotes = Math.max(0, upvotes - 1);
                    } else {
                        // Add or change to upvote
                        newVotes[currentUser.uid] = true;
                        newUpvotes = upvotes + 1;
                        if (currentVote === false) {
                            // Was downvoted before
                            newDownvotes = Math.max(0, downvotes - 1);
                        }
                    }
                } else { // voteType === 'down'
                    if (currentVote === false) {
                        // Remove downvote
                        delete newVotes[currentUser.uid];
                        newDownvotes = Math.max(0, downvotes - 1);
                    } else {
                        // Add or change to downvote
                        newVotes[currentUser.uid] = false;
                        newDownvotes = downvotes + 1;
                        if (currentVote === true) {
                            // Was upvoted before
                            newUpvotes = Math.max(0, upvotes - 1);
                        }
                    }
                }
                
                const updates = {};
                updates['/upvotes'] = newUpvotes;
                updates['/downvotes'] = newDownvotes;
                updates['/votes'] = newVotes;
                
                postRef.update(updates).catch((error) => {
                    console.error("Error voting on post:", error);
                    showToast('error', 'Error', 'Failed to vote on post.');
                });
            }).catch((error) => {
                console.error("Error getting post:", error);
                showToast('error', 'Error', 'Failed to vote on post.');
            });
        }

        function toggleSavePost(postId) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to save posts.');
                showLoginModal();
                return;
            }
            
            const userRef = group2MetalsRef.child('users').child(currentUser.uid);
            userRef.once('value').then((snapshot) => {
                const userData = snapshot.val();
                const savedPosts = userData.savedPosts || [];
                
                const postRef = group2MetalsRef.child('discussionPosts').child(postId);
                
                if (savedPosts.includes(postId)) {
                    // Remove from saved posts
                    const newSavedPosts = savedPosts.filter(id => id !== postId);
                    
                    // Decrement saved count
                    postRef.transaction((post) => {
                        if (post) {
                            post.saved = Math.max(0, (post.saved || 0) - 1);
                        }
                        return post;
                    });
                    
                    // Update user data
                    userRef.update({
                        savedPosts: newSavedPosts
                    }).then(() => {
                        // Update local user data
                        userData.savedPosts = newSavedPosts;
                        
                        showToast('info', 'Post Unsaved', 'This post has been removed from your saved posts.');
                    });
                } else {
                    // Add to saved posts
                    const newSavedPosts = [...savedPosts, postId];
                    
                    // Increment saved count
                    postRef.transaction((post) => {
                        if (post) {
                            post.saved = (post.saved || 0) + 1;
                        }
                        return post;
                    });
                    
                    // Update user data
                    userRef.update({
                        savedPosts: newSavedPosts
                    }).then(() => {
                        // Update local user data
                        userData.savedPosts = newSavedPosts;
                        
                        showToast('success', 'Post Saved!', 'This post has been added to your saved posts.');
                    });
                }
            }).catch((error) => {
                console.error("Error saving post:", error);
                showToast('error', 'Error', 'Failed to save post.');
            });
        }

        function deletePost(postId) {
            if (!confirm('Are you sure you want to delete this post?')) {
                return;
            }
            
            const postRef = group2MetalsRef.child('discussionPosts').child(postId);
            postRef.remove().then(() => {
                showToast('success', 'Post Deleted', 'Your post has been deleted successfully.');
            }).catch((error) => {
                console.error("Error deleting post:", error);
                showToast('error', 'Error', 'Failed to delete post.');
            });
        }

        function toggleComments(postId) {
            const commentsSection = document.getElementById(`comments-${postId}`);
            if (commentsSection.style.display === 'none') {
                commentsSection.style.display = 'block';
                // Focus on comment input
                const commentInput = document.getElementById(`comment-input-${postId}`);
                if (commentInput) {
                    commentInput.focus();
                }
                
                // Ensure comments are loaded and visible
                loadPostComments(postId);
            } else {
                commentsSection.style.display = 'none';
            }
        }

        function loadPostComments(postId) {
            const commentsContainer = document.getElementById(`comments-list-${postId}`);
            if (!commentsContainer) return;
            
            // Show loading indicator
            commentsContainer.innerHTML = '<div class="text-center py-3"><div class="spinner"></div></div>';
            
            const commentsRef = group2MetalsRef.child('postComments').orderByChild('postId').equalTo(postId);
            commentsRef.on('value', (snapshot) => {
                commentsContainer.innerHTML = '';
                
                if (!snapshot.exists()) {
                    commentsContainer.innerHTML = '<p class="text-gray-500 text-center py-3">No comments yet. Be the first to comment!</p>';
                    return;
                }
                
                const commentsArray = [];
                snapshot.forEach((childSnapshot) => {
                    commentsArray.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                
                // Sort by creation date (oldest first)
                commentsArray.sort((a, b) => {
                    return new Date(a.createdAt) - new Date(b.createdAt);
                });
                
                if (commentsArray.length === 0) {
                    commentsContainer.innerHTML = '<p class="text-gray-500 text-center py-3">No comments yet. Be the first to comment!</p>';
                    return;
                }
                
                commentsArray.forEach(comment => {
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                });
            });
        }

        function createCommentElement(comment) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment mb-4 p-4 bg-white rounded-lg shadow-sm';
            
            const date = new Date(comment.createdAt);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isAuthor = currentUser && comment.authorId === currentUser.uid;
            
            commentDiv.innerHTML = `
                <div class="flex items-start space-x-4">
                    <div class="comment-avatar flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-800 font-medium">${comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'A'}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between">
                            <div class="comment-author font-semibold text-gray-800">${comment.authorName || 'Anonymous'}</div>
                            <div class="comment-time text-xs text-gray-500">${formattedDate} at ${formattedTime}</div>
                        </div>
                        <div class="comment-content mt-2 text-gray-700">${comment.content}</div>
                    </div>
                </div>
                ${isAuthor ? `
                    <div class="mt-3">
                        <button onclick="deleteComment('${comment.id}', '${comment.postId}')" class="text-red-500 text-sm hover:text-red-700 flex items-center">
                            <i class="fas fa-trash mr-2"></i>Delete
                        </button>
                    </div>
                ` : ''}
            `;
            
            return commentDiv;
        }

        function addComment(event, postId) {
            event.preventDefault();
            
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to comment.');
                showLoginModal();
                return;
            }
            
            const commentInput = document.getElementById(`comment-input-${postId}`);
            const content = commentInput.value.trim();
            
            if (!content) {
                showToast('error', 'Empty Comment', 'Please enter a comment before posting.');
                return;
            }
            
            const commentsRef = group2MetalsRef.child('postComments').push();
            const newComment = {
                postId: postId,
                authorId: currentUser.uid,
                authorName: userData.displayName,
                content: content,
                createdAt: firebase.database.ServerValue.TIMESTAMP
            };
            
            commentsRef.set(newComment).then(() => {
                // Update comment count on post
                const postRef = group2MetalsRef.child('discussionPosts').child(postId);
                postRef.transaction((post) => {
                    if (post) {
                        post.comments = (post.comments || 0) + 1;
                    }
                    return post;
                });
                
                // Clear input field
                commentInput.value = '';
                
                // Show success message
                showToast('success', 'Comment Added', 'Your comment has been posted successfully.');
                
                // Load comments for this post to update the UI
                loadPostComments(postId);
            }).catch((error) => {
                console.error("Error adding comment:", error);
                showToast('error', 'Error', 'Failed to post comment.');
            });
        }

        function deleteComment(commentId, postId) {
            if (!confirm('Are you sure you want to delete this comment?')) {
                return;
            }
            
            const commentRef = group2MetalsRef.child('postComments').child(commentId);
            commentRef.remove().then(() => {
                // Update comment count on post
                const postRef = group2MetalsRef.child('discussionPosts').child(postId);
                postRef.transaction((post) => {
                    if (post) {
                        post.comments = Math.max(0, (post.comments || 0) - 1);
                    }
                    return post;
                });
                
                showToast('success', 'Comment Deleted', 'Your comment has been deleted successfully.');
                
                // Reload comments to update the UI
                loadPostComments(postId);
            }).catch((error) => {
                console.error("Error deleting comment:", error);
                showToast('error', 'Error', 'Failed to delete comment.');
            });
        }

        // Study Groups functions
        function showCreateGroupModal() {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to create study groups.');
                showLoginModal();
                return;
            }
            document.getElementById('createGroupModal').classList.add('active');
        }

        function closeCreateGroupModal() {
            document.getElementById('createGroupModal').classList.remove('active');
            document.getElementById('createGroupForm').reset();
        }

        function handleCreateGroup(event) {
            event.preventDefault();
            
            const name = document.getElementById('groupName').value.trim();
            const topic = document.getElementById('groupTopic').value;
            const description = document.getElementById('groupDescription').value.trim();
            const maxMembers = parseInt(document.getElementById('groupMaxMembers').value);
            
            if (!name || !topic || !description) {
                showToast('error', 'Missing Fields', 'Please fill in all fields.');
                return;
            }
            
            const groupsRef = group2MetalsRef.child('studyGroups').push();
            const newGroup = {
                name: name,
                topic: topic,
                description: description,
                maxMembers: maxMembers,
                creatorId: currentUser.uid,
                creatorName: userData.displayName,
                members: [currentUser.uid],
                memberCount: 1,
                announcements: [],
                resources: [],
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                lastActivity: firebase.database.ServerValue.TIMESTAMP
            };
            
            groupsRef.set(newGroup).then(() => {
                showToast('success', 'Group Created!', 'Your study group has been created successfully.');
                closeCreateGroupModal();
            }).catch((error) => {
                console.error("Error creating study group:", error);
                showToast('error', 'Error', 'Failed to create study group.');
            });
        }

        function loadStudyGroups() {
            const groupsContainer = document.getElementById('studyGroupsList');
            groupsContainer.innerHTML = '<div class="spinner"></div>';
            
            const groupsRef = group2MetalsRef.child('studyGroups');
            groupsRef.on('value', (snapshot) => {
                groupsContainer.innerHTML = '';
                
                if (!snapshot.exists()) {
                    groupsContainer.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="empty-state-title">No Study Groups Yet</h3>
                            <p class="empty-state-description">Create your first study group to collaborate with peers.</p>
                        </div>`;
                    return;
                }
                
                studyGroups = [];
                snapshot.forEach((childSnapshot) => {
                    studyGroups.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                
                // Create a document fragment to improve performance
                const fragment = document.createDocumentFragment();
                
                studyGroups.forEach(group => {
                    const groupElement = createStudyGroupElement(group);
                    fragment.appendChild(groupElement);
                });
                
                // Append all elements at once
                groupsContainer.appendChild(fragment);
            }, (error) => {
                console.error("Error loading study groups:", error);
                groupsContainer.innerHTML = '<p class="text-gray-500 text-center">Error loading study groups.</p>';
            });
        }

        function createStudyGroupElement(group) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'study-group-card';
            
            const isMember = currentUser && group.members && group.members.includes(currentUser.uid);
            const memberCount = group.members ? group.members.length : 0;
            const maxMembers = group.maxMembers || 10;
            const isFull = memberCount >= maxMembers;
            
            const createdDate = new Date(group.createdAt);
            const formattedDate = createdDate.toLocaleDateString();
            
            // Format topic for display
            const topicLabels = {
                'melting-point': 'Melting Point Trends',
                'density': 'Density Trends',
                'reactivity': 'Reactivity Series',
                'reactions': 'Chemical Reactions',
                'electron-configuration': 'Electron Configuration',
                'experiments': 'Laboratory Experiments',
                'exam-prep': 'Exam Preparation'
            };
            
            groupDiv.innerHTML = `
                <div class="group-header">
                    <div>
                        <h3 class="group-title">${group.name}</h3>
                        <span class="group-topic">${topicLabels[group.topic] || group.topic}</span>
                    </div>
                </div>
                <p class="group-description">${group.description}</p>
                <div class="group-meta">
                    <div class="group-members">
                        <div class="flex -space-x-2">
                            ${(group.members || []).slice(0, 5).map(member =>
                                `<div class="member-avatar" title="${member}">${member.charAt(0).toUpperCase()}</div>`
                            ).join('')}
                            ${(memberCount || 0) > 5 ?
                                `<div class="member-avatar">+${(memberCount || 0) - 5}</div>` : ''
                            }
                        </div>
                        <span class="ml-3 text-sm">${memberCount}/${maxMembers} members</span>
                    </div>
                    <div class="group-stats">
                        Created on ${formattedDate}
                    </div>
                </div>
                <div class="group-actions">
                    <button onclick="showGroupDetails('${group.id}')" class="btn btn-primary btn-sm">
                        <i class="fas fa-eye mr-2"></i>
                        View Details
                    </button>
                    <button onclick="${isMember ? 'leaveStudyGroup' : 'joinStudyGroup'}('${group.id}')"
                            class="btn ${isMember ? 'btn-danger' : 'btn-primary'} btn-sm"
                            ${isFull && !isMember ? 'disabled' : ''}>
                        ${isMember ? 'Leave Group' : isFull ? 'Full' : 'Join Group'}
                    </button>
                </div>
            `;
            
            return groupDiv;
        }

        function showGroupDetails(groupId) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to view group details.');
                showLoginModal();
                return;
            }
            
            const group = studyGroups.find(g => g.id === groupId);
            if (!group) return;
            
            const isMember = currentUser && group.members && group.members.includes(currentUser.uid);
            
            // Format topic for display
            const topicLabels = {
                'melting-point': 'Melting Point Trends',
                'density': 'Density Trends',
                'reactivity': 'Reactivity Series',
                'reactions': 'Chemical Reactions',
                'electron-configuration': 'Electron Configuration',
                'experiments': 'Laboratory Experiments',
                'exam-prep': 'Exam Preparation'
            };
            
            // Create modal content
            const modalContent = `
                <div class="group-details-container">
                    <div class="flex justify-between items-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-800">${group.name}</h3>
                        <button onclick="closeGroupDetailsModal()" class="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100 transition-colors">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <p class="text-gray-700 mb-8">${group.description}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-info-circle mr-3 text-indigo-600"></i>
                                Group Info
                            </h4>
                            <p><strong>Created by:</strong> ${group.creatorName || 'Unknown'}</p>
                            <p><strong>Created on:</strong> ${new Date(group.createdAt).toLocaleDateString()}</p>
                            <p><strong>Members:</strong> ${group.members ? group.members.length : 0}/${group.maxMembers || 10}</p>
                        </div>
                        <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
                            <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                                <i class="fas fa-users mr-3 text-indigo-600"></i>
                                Members
                            </h4>
                            <div class="space-y-3">
                                ${(group.members || []).map(memberId => {
                                    // In a real app, we would fetch user details from the database
                                    return `<div class="flex items-center">
                                        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span class="text-indigo-800 font-medium text-sm">${memberId.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span>${memberId}</span>
                                    </div>`;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-bullhorn mr-3 text-indigo-600"></i>
                            Announcements
                        </h4>
                        <div id="groupAnnouncements">
                            ${(group.announcements || []).length > 0 ? 
                                group.announcements.map(announcement => `
                                    <div class="group-announcement mb-4">
                                        <div class="flex justify-between items-start mb-2">
                                            <h5 class="font-semibold">${announcement.title}</h5>
                                            <span class="text-sm text-gray-500">${new Date(announcement.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p>${announcement.content}</p>
                                    </div>
                                `).join('') :
                                '<p class="text-gray-500">No announcements yet.</p>'
                            }
                        </div>
                        ${isMember ? `
                            <button onclick="showAddAnnouncement('${groupId}')" class="btn btn-primary btn-sm mt-4">
                                <i class="fas fa-plus mr-2"></i>
                                Add Announcement
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h4 class="font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-folder-open mr-3 text-indigo-600"></i>
                            Resources
                        </h4>
                        <div id="groupResources">
                            ${(group.resources || []).length > 0 ? 
                                group.resources.map(resource => `
                                    <div class="resource-item mb-4">
                                        <div class="resource-icon">
                                            <i class="fas fa-file-alt"></i>
                                        </div>
                                        <div class="resource-info">
                                            <div class="resource-name">${resource.name}</div>
                                            <div class="resource-meta">Added by ${resource.addedBy} on ${new Date(resource.addedAt).toLocaleDateString()}</div>
                                            <div class="resource-description">${resource.description}</div>
                                        </div>
                                        <div class="resource-actions">
                                            <button onclick="downloadResource('${resource.url}')" class="resource-btn">
                                                <i class="fas fa-download"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                `).join('') :
                                '<p class="text-gray-500">No resources yet.</p>'
                            }
                        </div>
                        ${isMember ? `
                            <button onclick="showAddResource('${groupId}')" class="btn btn-primary btn-sm mt-4">
                                <i class="fas fa-plus mr-2"></i>
                                Add Resource
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="flex justify-end mt-8">
                        <button onclick="closeGroupDetailsModal()" class="btn btn-secondary mr-3">
                            Close
                        </button>
                        ${isMember ? `
                            <button onclick="leaveStudyGroup('${groupId}')" class="btn btn-danger">
                                Leave Group
                            </button>
                        ` : `
                            <button onclick="joinStudyGroup('${groupId}')" class="btn btn-primary">
                                Join Group
                            </button>
                        `}
                    </div>
                </div>
            `;
            
            // Set modal content and show modal
            document.getElementById('groupDetailsContent').innerHTML = modalContent;
            document.getElementById('groupDetailsModal').classList.add('active');
        }

        function closeGroupDetailsModal() {
            document.getElementById('groupDetailsModal').classList.remove('active');
        }

        function joinStudyGroup(groupId) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to join study groups.');
                showLoginModal();
                return;
            }
            
            const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
            groupRef.once('value').then((snapshot) => {
                const group = snapshot.val();
                
                if (!group) {
                    showToast('error', 'Error', 'Study group not found.');
                    return;
                }
                
                const members = group.members || [];
                const maxMembers = group.maxMembers || 10;
                
                if (members.includes(currentUser.uid)) {
                    showToast('info', 'Already a Member', 'You are already a member of this study group.');
                    return;
                }
                
                if (members.length >= maxMembers) {
                    showToast('error', 'Group Full', 'This study group is already full.');
                    return;
                }
                
                // Add user to group
                members.push(currentUser.uid);
                
                const updates = {
                    members: members,
                    memberCount: members.length,
                    lastActivity: firebase.database.ServerValue.TIMESTAMP
                };
                
                groupRef.update(updates).then(() => {
                    showToast('success', 'Joined Group', 'You have successfully joined the study group.');
                    
                    // Add notification for group creator
                    if (group.creatorId && group.creatorId !== currentUser.uid) {
                        const notificationRef = group2MetalsRef.child('notifications').push();
                        notificationRef.set({
                            userId: group.creatorId,
                            type: 'group_join',
                            message: `${userData.displayName} joined your study group "${group.name}"`,
                            groupId: groupId,
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                            read: false
                        });
                    }
                }).catch((error) => {
                    console.error("Error joining study group:", error);
                    showToast('error', 'Error', 'Failed to join study group.');
                });
            }).catch((error) => {
                console.error("Error getting study group:", error);
                showToast('error', 'Error', 'Failed to join study group.');
            });
        }

        function leaveStudyGroup(groupId) {
            if (!currentUser) {
                showToast('error', 'Sign in required', 'Please sign in to leave study groups.');
                showLoginModal();
                return;
            }
            
            if (!confirm('Are you sure you want to leave this study group?')) {
                return;
            }
            
            const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
            groupRef.once('value').then((snapshot) => {
                const group = snapshot.val();
                
                if (!group) {
                    showToast('error', 'Error', 'Study group not found.');
                    return;
                }
                
                const members = group.members || [];
                
                if (!members.includes(currentUser.uid)) {
                    showToast('info', 'Not a Member', 'You are not a member of this study group.');
                    return;
                }
                
                // Remove user from group
                const updatedMembers = members.filter(member => member !== currentUser.uid);
                
                const updates = {
                    members: updatedMembers,
                    memberCount: updatedMembers.length,
                    lastActivity: firebase.database.ServerValue.TIMESTAMP
                };
                
                groupRef.update(updates).then(() => {
                    showToast('success', 'Left Group', 'You have successfully left the study group.');
                    
                    // If the user was the creator and there are no members left, delete the group
                    if (group.creatorId === currentUser.uid && updatedMembers.length === 0) {
                        groupRef.remove().then(() => {
                            showToast('info', 'Group Deleted', 'The study group has been deleted as it had no members.');
                        }).catch((error) => {
                            console.error("Error deleting study group:", error);
                        });
                    }
                    
                    // Add notification for group creator if they're not the one leaving
                    if (group.creatorId && group.creatorId !== currentUser.uid) {
                        const notificationRef = group2MetalsRef.child('notifications').push();
                        notificationRef.set({
                            userId: group.creatorId,
                            type: 'group_leave',
                            message: `${userData.displayName} left your study group "${group.name}"`,
                            groupId: groupId,
                            timestamp: firebase.database.ServerValue.TIMESTAMP,
                            read: false
                        });
                    }
                }).catch((error) => {
                    console.error("Error leaving study group:", error);
                    showToast('error', 'Error', 'Failed to leave study group.');
                });
            }).catch((error) => {
                console.error("Error getting study group:", error);
                showToast('error', 'Error', 'Failed to leave study group.');
            });
        }

        function showAddAnnouncement(groupId) {
            // This would open a modal to add an announcement
            // For simplicity, we'll just show a prompt
            const title = prompt('Announcement Title:');
            if (!title) return;
            
            const content = prompt('Announcement Content:');
            if (!content) return;
            
            const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
            groupRef.once('value').then((snapshot) => {
                const group = snapshot.val();
                
                if (!group) {
                    showToast('error', 'Error', 'Study group not found.');
                    return;
                }
                
                const announcements = group.announcements || [];
                announcements.push({
                    title: title,
                    content: content,
                    addedBy: userData.displayName,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                groupRef.update({
                    announcements: announcements,
                    lastActivity: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    showToast('success', 'Announcement Added', 'Your announcement has been added to the group.');
                    
                    // Refresh group details
                    showGroupDetails(groupId);
                    
                    // Notify group members
                    (group.members || []).forEach(memberId => {
                        if (memberId !== currentUser.uid) {
                            const notificationRef = group2MetalsRef.child('notifications').push();
                            notificationRef.set({
                                userId: memberId,
                                type: 'group_announcement',
                                message: `New announcement in "${group.name}": ${title}`,
                                groupId: groupId,
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                read: false
                            });
                        }
                    });
                }).catch((error) => {
                    console.error("Error adding announcement:", error);
                    showToast('error', 'Error', 'Failed to add announcement.');
                });
            }).catch((error) => {
                console.error("Error getting study group:", error);
                showToast('error', 'Error', 'Failed to add announcement.');
            });
        }

        function showAddResource(groupId) {
            // This would open a modal to add a resource
            // For simplicity, we'll just show prompts
            const name = prompt('Resource Name:');
            if (!name) return;
            
            const description = prompt('Resource Description:');
            if (!description) return;
            
            const url = prompt('Resource URL:');
            if (!url) return;
            
            const groupRef = group2MetalsRef.child('studyGroups').child(groupId);
            groupRef.once('value').then((snapshot) => {
                const group = snapshot.val();
                
                if (!group) {
                    showToast('error', 'Error', 'Study group not found.');
                    return;
                }
                
                const resources = group.resources || [];
                resources.push({
                    name: name,
                    description: description,
                    url: url,
                    addedBy: userData.displayName,
                    addedAt: firebase.database.ServerValue.TIMESTAMP
                });
                
                groupRef.update({
                    resources: resources,
                    lastActivity: firebase.database.ServerValue.TIMESTAMP
                }).then(() => {
                    showToast('success', 'Resource Added', 'Your resource has been added to the group.');
                    
                    // Refresh group details
                    showGroupDetails(groupId);
                    
                    // Notify group members
                    (group.members || []).forEach(memberId => {
                        if (memberId !== currentUser.uid) {
                            const notificationRef = group2MetalsRef.child('notifications').push();
                            notificationRef.set({
                                userId: memberId,
                                type: 'group_resource',
                                message: `New resource added to "${group.name}": ${name}`,
                                groupId: groupId,
                                timestamp: firebase.database.ServerValue.TIMESTAMP,
                                read: false
                            });
                        }
                    });
                }).catch((error) => {
                    console.error("Error adding resource:", error);
                    showToast('error', 'Error', 'Failed to add resource.');
                });
            }).catch((error) => {
                console.error("Error getting study group:", error);
                showToast('error', 'Error', 'Failed to add resource.');
            });
        }

        function downloadResource(url) {
            // In a real app, this would handle file downloads
            window.open(url, '_blank');
        }

        // Leaderboard functions
        function loadLeaderboard() {
            const leaderboardContent = document.getElementById('leaderboardContent');
            leaderboardContent.innerHTML = '<div class="spinner"></div>';
            
            const usersRef = group2MetalsRef.child('users');
            usersRef.orderByChild('xp').limitToLast(10).on('value', (snapshot) => {
                leaderboardContent.innerHTML = '';
                
                if (!snapshot.exists()) {
                    leaderboardContent.innerHTML = '<p class="text-gray-500 text-center">No users found.</p>';
                    return;
                }
                
                const users = [];
                snapshot.forEach((childSnapshot) => {
                    users.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                
                // Sort by XP (descending)
                users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
                
                // Create leaderboard table
                const table = document.createElement('table');
                table.className = 'leaderboard-table';
                
                // Create table header
                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>XP</th>
                        <th>Badges</th>
                    </tr>
                `;
                table.appendChild(thead);
                
                // Create table body
                const tbody = document.createElement('tbody');
                users.forEach((user, index) => {
                    const row = document.createElement('tr');
                    row.className = 'leaderboard-entry';
                    
                    // Determine rank class for special styling
                    let rankClass = '';
                    if (index === 0) rankClass = 'first';
                    else if (index === 1) rankClass = 'second';
                    else if (index === 2) rankClass = 'third';
                    
                    row.innerHTML = `
                        <td>
                            <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                        </td>
                        <td>${user.displayName || 'Anonymous'}</td>
                        <td>${user.xp || 0}</td>
                        <td>${(user.badges || []).length}</td>
                    `;
                    
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                
                leaderboardContent.appendChild(table);
            }, (error) => {
                console.error("Error loading leaderboard:", error);
                leaderboardContent.innerHTML = '<p class="text-gray-500 text-center">Error loading leaderboard.</p>';
            });
        }

        // Toast notification function
        function showToast(type, title, message) {
            const toastContainer = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon = '';
            if (type === 'success') {
                icon = '<i class="fas fa-check-circle toast-icon"></i>';
            } else if (type === 'error') {
                icon = '<i class="fas fa-exclamation-circle toast-icon"></i>';
            } else if (type === 'info') {
                icon = '<i class="fas fa-info-circle toast-icon"></i>';
            }
            
            toast.innerHTML = `
                ${icon}
                <div class="toast-message">
                    <div class="toast-title">${title}</div>
                    <div class="toast-description">${message}</div>
                </div>
            `;
            
            toastContainer.appendChild(toast);
            
            // Show toast
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            // Hide toast after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toastContainer.removeChild(toast);
                }, 400);
            }, 4000);
        }

        // Authentication functions
        function showLoginModal() {
            document.getElementById('loginModal').classList.add('active');
        }

        function closeLoginModal() {
            document.getElementById('loginModal').classList.remove('active');
        }

        function signInWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = result.credential;
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                showToast('success', 'Welcome back!', 'You have been successfully signed in.');
                closeLoginModal();
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Google sign-in error:", error);
                showToast('error', 'Sign in failed', errorMessage);
            });
        }

        function signOut() {
            auth.signOut().then(() => {
                showToast('info', 'Goodbye!', 'You have been successfully signed out.');
                showLandingPage();
            }).catch((error) => {
                console.error("Sign out error:", error);
                showToast('error', 'Error', 'Failed to sign out.');
            });
        }

        // Graph functions
        function initializeGraph() {
            const ctx = document.getElementById('mainChart').getContext('2d');
            
            // Destroy existing chart if it exists
            if (mainChart) {
                mainChart.destroy();
            }
            
            // Create initial chart with active properties
            const chartData = getGraphData();
            
            mainChart = new Chart(ctx, {
                type: currentGraphType,
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#cbd5e1'
                            }
                        },
                        tooltip: {
                            backgroundColor: '#1e293b',
                            titleColor: '#f1f5f9',
                            bodyColor: '#cbd5e1',
                            borderColor: '#334155',
                            borderWidth: 1
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
                            limits: {
                                y: {min: 0, max: 1500},
                                x: {min: 0, max: 100}
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: '#334155',
                                borderColor: '#334155'
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            title: {
                                display: true,
                                text: 'Atomic Number',
                                color: '#cbd5e1'
                            }
                        },
                        y: {
                            grid: {
                                color: '#334155',
                                borderColor: '#334155'
                            },
                            ticks: {
                                color: '#94a3b8'
                            },
                            title: {
                                display: true,
                                text: 'Value',
                                color: '#cbd5e1'
                            }
                        }
                    }
                }
            });
        }

        function getGraphData() {
            const labels = selectedElements.map(el => elementData[el].name);
            const datasets = [];
            
            // Add datasets for each active property
            activeProperties.forEach(property => {
                const config = propertyConfig[property];
                const data = selectedElements.map(el => elementData[el][getPropertyKey(property)]);
                
                datasets.push({
                    label: config.label,
                    data: data,
                    borderColor: config.color,
                    backgroundColor: config.color + '33', // Add transparency
                    tension: 0.4,
                    fill: false,
                    pointRadius: 5,
                    pointHoverRadius: 7
                });
            });
            
            return {
                labels: labels,
                datasets: datasets
            };
        }

        function getPropertyKey(property) {
            // Convert property name to the key in elementData
            switch(property) {
                case 'melting-point': return 'meltingPoint';
                case 'density': return 'density';
                case 'reactivity': return 'reactivity';
                case 'atomic-radius': return 'atomicRadius';
                default: return property;
            }
        }

        function toggleGraphProperty(property) {
            const index = activeProperties.indexOf(property);
            if (index > -1) {
                // Property is active, remove it
                activeProperties.splice(index, 1);
            } else {
                // Property is inactive, add it
                activeProperties.push(property);
            }
            
            // Update chart
            if (mainChart) {
                mainChart.data = getGraphData();
                mainChart.update();
            }
            
            // Update data table highlighting
            updateDataTableHighlighting();
        }

        function changeGraphView(viewType) {
            currentGraphType = viewType;
            
            // Update active button
            document.querySelectorAll('.graph-view-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.getElementById(`view-${viewType}`).classList.add('active');
            
            // Update chart
            if (mainChart) {
                mainChart.config.type = viewType;
                mainChart.update();
            }
        }

        function toggleElement(element) {
            const index = selectedElements.indexOf(element);
            if (index > -1) {
                selectedElements.splice(index, 1);
            } else {
                selectedElements.push(element);
            }
            
            // Update chart
            if (mainChart) {
                mainChart.data = getGraphData();
                mainChart.update();
            }
            
            // Update data table highlighting
            updateDataTableHighlighting();
        }

        function resetZoom() {
            if (mainChart) {
                mainChart.resetZoom();
            }
        }

        function downloadGraph() {
            if (mainChart) {
                const link = document.createElement('a');
                link.download = 'graph.png';
                link.href = mainChart.toBase64Image();
                link.click();
            }
        }

        function toggleAnimation() {
            // Implement animation logic if needed
            showToast('info', 'Animation', 'Animation feature coming soon!');
        }

        function populateDataTable() {
            const tbody = document.getElementById('dataTableBody');
            tbody.innerHTML = '';
            
            selectedElements.forEach(element => {
                const data = elementData[element];
                const row = document.createElement('tr');
                row.dataset.element = element;
                
                row.innerHTML = `
                    <td>${data.name}</td>
                    <td>${data.atomicNumber}</td>
                    <td>${data.meltingPoint}</td>
                    <td>${data.density}</td>
                    <td>${data.reactivity}</td>
                    <td>${data.atomicRadius}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            updateDataTableHighlighting();
        }

        function updateDataTableHighlighting() {
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

        function loadGraphQuiz() {
            const question = graphQuizQuestions[Math.floor(Math.random() * graphQuizQuestions.length)];
            document.getElementById('graph-quiz-question').textContent = question.question;
            
            const optionsContainer = document.getElementById('graph-quiz-options');
            optionsContainer.innerHTML = '';
            
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'graph-quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkGraphQuizAnswer(index, question.correct, question.explanation);
                optionsContainer.appendChild(optionDiv);
            });
            
            // Reset feedback
            document.getElementById('graph-quiz-feedback').classList.add('hidden');
        }

        function checkGraphQuizAnswer(selectedIndex, correctIndex, explanation) {
            const options = document.querySelectorAll('#graph-quiz-options .graph-quiz-option');
            const feedback = document.getElementById('graph-quiz-feedback');
            
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

        // Initialize the app when the page loads
        window.onload = function() {
            initApp();
        };
    