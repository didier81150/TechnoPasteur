// =====================================================
// MOTEUR DE QCM (QUESTIONS ET LOGIQUE DE PASSAGE)
// =====================================================

const QUESTIONS_SCORE1 = [
    {
        question: "Quel est le principal avantage d'un objet en acier inoxydable par rapport à un objet en acier ordinaire ?",
        options: ["Il est plus léger", "Il résiste mieux à la corrosion", "Il conduit mieux l'électricité", "Il est moins cher à produire"],
        correct: 1,
        explanation: "L'acier inoxydable contient du chrome (au moins 10,5%) qui forme une couche protectrice d'oxyde de chrome en surface, empêchant la corrosion."
    },
    {
        question: "Quel matériau est le meilleur isolant thermique ?",
        options: ["L'aluminium", "Le cuivre", "La laine de verre", "L'acier"],
        correct: 2,
        explanation: "La laine de verre est un excellent isolant thermique car elle emprisonne de l'air dans ses fibres. L'air immobile est un très mauvais conducteur de chaleur."
    },
    {
        question: "La masse volumique d'un matériau s'exprime en :",
        options: ["kg/m³", "N/m²", "W/(m·K)", "m/s²"],
        correct: 0,
        explanation: "La masse volumique (ρ) est le rapport de la masse d'un corps à son volume. Elle s'exprime en kilogrammes par mètre cube (kg/m³)."
    },
    {
        question: "Quel procédé permet d'améliorer la dureté superficielle d'une pièce en acier ?",
        options: ["Le recuit", "La trempe superficielle", "Le laminage à froid", "Le soudage"],
        correct: 1,
        explanation: "La trempe superficielle chauffe rapidement la surface de la pièce puis la refroidit brutalement, durcissant la couche externe."
    },
    {
        question: "Le coefficient de dilatation thermique caractérise :",
        options: ["La variation de dimension avec la température", "La résistance à la traction", "La conductivité électrique", "La résistance aux chocs"],
        correct: 0,
        explanation: "Le coefficient de dilatation thermique (α) mesure la variation relative de longueur ou de volume d'un matériau en fonction de la température."
    },
    {
        question: "Quelle est la principale différence entre un matériau ductile et un matériau fragile ?",
        options: ["Le matériau ductile se déforme avant de rompre", "Le matériau fragile est plus lourd", "Le matériau ductile est transparent", "Le matériau fragile conduit mieux la chaleur"],
        correct: 0,
        explanation: "Un matériau ductile subit une déformation plastique importante avant de rompre, contrairement à un matériau fragile qui rompt sans déformation significative."
    },
    {
        question: "Dans un diagramme de traction, la limite d'élasticité correspond :",
        options: ["À la fin de la zone élastique", "Au point de rupture", "Au début de l'essai", "À la charge maximale"],
        correct: 0,
        explanation: "La limite d'élasticité (Re) marque la transition entre le domaine élastique (déformations réversibles) et le domaine plastique (déformations permanentes)."
    },
    {
        question: "Quel est le rôle principal d'un traitement de surface par galvanisation ?",
        options: ["Protéger contre la corrosion", "Augmenter la conductivité électrique", "Réduire le poids de la pièce", "Améliorer la transparence"],
        correct: 0,
        explanation: "La galvanisation consiste à recouvrir l'acier d'une couche de zinc qui s'oxyde à la place de l'acier (protection sacrificielle)."
    },
    {
        question: "La conductivité thermique d'un matériau indique :",
        options: ["Sa capacité à transmettre la chaleur", "Sa résistance mécanique", "Sa couleur", "Son magnétisme"],
        correct: 0,
        explanation: "La conductivité thermique (λ) mesure la capacité d'un matériau à conduire la chaleur. Elle s'exprime en W/(m·K)."
    },
    {
        question: "Parmi ces matériaux, lequel est un matériau composite ?",
        options: ["Le verre trempé", "La fibre de carbone / époxy", "Le laiton", "L'aluminium pur"],
        correct: 1,
        explanation: "Un matériau composite est constitué d'une matrice (époxy) et d'un renfort (fibres de carbone), offrant des propriétés supérieures combinées."
    }
];

const QUESTIONS_SCORE2 = [
    {
        question: "Quelle est l'unité de la résistance à la traction ?",
        options: ["Pascal (Pa)", "Newton (N)", "Joule (J)", "Watt (W)"],
        correct: 0,
        explanation: "La résistance à la traction (Rm) est une contrainte, c'est-à-dire une force rapportée à une surface ; elle s'exprime donc en pascals (Pa)."
    },
    {
        question: "Lequel de ces matériaux est le plus léger ?",
        options: ["L'acier", "L'aluminium", "Le cuivre", "Le titane"],
        correct: 1,
        explanation: "L'aluminium a une masse volumique d'environ 2700 kg/m³, nettement inférieure à celle de l'acier, du cuivre ou du titane."
    },
    {
        question: "Qu'est-ce que la ténacité d'un matériau ?",
        options: ["Sa capacité à résister aux chocs", "Sa résistance à la compression", "Sa dureté superficielle", "Sa conductivité thermique"],
        correct: 0,
        explanation: "La ténacité caractérise la capacité d'un matériau à résister à la propagation de fissures et donc aux chocs, sans se rompre brutalement."
    },
    {
        question: "La corrosion est un phénomène :",
        options: ["Chimique", "Mécanique", "Électrique uniquement", "Optique"],
        correct: 0,
        explanation: "La corrosion résulte d'une réaction chimique, souvent électrochimique, entre le matériau et son environnement (ex : oxydation du fer)."
    },
    {
        question: "Quel matériau est utilisé pour les filaments d'ampoules à incandescence ?",
        options: ["Le tungstène", "Le fer", "Le zinc", "Le nickel"],
        correct: 0,
        explanation: "Le tungstène possède la température de fusion la plus élevée de tous les métaux (environ 3400°C), idéale pour un filament chauffé."
    },
    {
        question: "Le module d'Young (E) mesure :",
        options: ["La rigidité d'un matériau", "Sa densité", "Sa conductivité électrique", "Son point de fusion"],
        correct: 0,
        explanation: "Le module d'Young relie la contrainte à la déformation élastique : plus il est élevé, plus le matériau est rigide."
    },
    {
        question: "Quel traitement thermique rend l'acier plus dur mais plus fragile ?",
        options: ["La trempe", "Le recuit", "Le revenu", "La normalisation"],
        correct: 0,
        explanation: "La trempe refroidit rapidement l'acier chauffé, augmentant sa dureté mais diminuant sa ténacité."
    },
    {
        question: "Laquelle de ces matières plastiques est thermodurcissable ?",
        options: ["Le polyéthylène", "Le PVC", "La bakélite", "Le polystyrène"],
        correct: 2,
        explanation: "La bakélite, une fois moulée et polymérisée, ne peut plus être refondue, contrairement aux thermoplastiques comme le PVC."
    },
    {
        question: "Quel est le principal composant du verre ?",
        options: ["Le sable (silice)", "Le calcaire", "L'argile", "Le gypse"],
        correct: 0,
        explanation: "Le verre est obtenu en fondant du sable siliceux (silice, SiO2), généralement avec de la soude et de la chaux."
    },
    {
        question: "Quelle est la propriété principale d'un matériau réfractaire ?",
        options: ["Résister aux hautes températures", "Conduire l'électricité", "Être transparent", "Être magnétique"],
        correct: 0,
        explanation: "Un matériau réfractaire conserve ses propriétés mécaniques à très haute température, utile dans les fours industriels."
    }
];

const QUESTIONS_SCORE3 = [
    {
        question: "Lequel de ces matériaux est un alliage ?",
        options: ["Le fer pur", "L'aluminium pur", "Le laiton", "Le cuivre pur"],
        correct: 2,
        explanation: "Le laiton est un alliage de cuivre et de zinc, contrairement aux métaux purs proposés dans les autres réponses."
    },
    {
        question: "La résilience d'un matériau caractérise :",
        options: ["Sa résistance aux chocs", "Sa conductivité thermique", "Sa masse volumique", "Sa couleur"],
        correct: 0,
        explanation: "La résilience mesure l'énergie qu'un matériau peut absorber avant de se rompre sous un choc (essai de résilience Charpy)."
    },
    {
        question: "Qu'est-ce que le fluage ?",
        options: ["Déformation lente sous charge constante", "Rupture brutale", "Corrosion", "Dilatation thermique"],
        correct: 0,
        explanation: "Le fluage est une déformation progressive et lente d'un matériau soumis à une contrainte constante, souvent à température élevée."
    },
    {
        question: "Quel métal est le meilleur conducteur électrique ?",
        options: ["L'argent", "Le cuivre", "L'or", "L'aluminium"],
        correct: 0,
        explanation: "L'argent possède la meilleure conductivité électrique de tous les métaux, même si le cuivre lui est souvent préféré pour son coût."
    },
    {
        question: "Le PVC est un matériau :",
        options: ["Thermoplastique", "Thermodurcissable", "Métallique", "Céramique"],
        correct: 0,
        explanation: "Le PVC est un thermoplastique : il se ramollit sous l'effet de la chaleur et peut être remis en forme plusieurs fois."
    },
    {
        question: "Quelle est la température de fusion approximative de l'aluminium ?",
        options: ["660°C", "1000°C", "1500°C", "2000°C"],
        correct: 0,
        explanation: "L'aluminium fond à environ 660°C, une température bien inférieure à celle de l'acier (environ 1500°C)."
    },
    {
        question: "Lequel de ces matériaux est un bon isolant électrique ?",
        options: ["Le caoutchouc", "Le cuivre", "L'aluminium", "Le fer"],
        correct: 0,
        explanation: "Le caoutchouc est un isolant électrique couramment utilisé pour la gaine des câbles, contrairement aux métaux qui sont conducteurs."
    },
    {
        question: "Qu'est-ce que l'écrouissage ?",
        options: ["Durcissement par déformation plastique", "Traitement thermique", "Corrosion", "Polissage"],
        correct: 0,
        explanation: "L'écrouissage est le durcissement d'un métal provoqué par une déformation plastique à froid (martelage, laminage)."
    },
    {
        question: "Quel matériau est utilisé pour les aimants permanents ?",
        options: ["Le fer doux", "L'acier au cobalt", "L'aluminium", "Le cuivre"],
        correct: 1,
        explanation: "Les aimants permanents utilisent des alliages comme l'acier au cobalt, qui conservent leur aimantation, contrairement au fer doux."
    },
    {
        question: "La fatigue d'un matériau est due à :",
        options: ["Des sollicitations cycliques", "Une surchauffe", "Un choc unique", "Une corrosion"],
        correct: 0,
        explanation: "La fatigue résulte de sollicitations répétées (cycliques), même d'intensité modérée, pouvant conduire à une rupture progressive."
    }
];

const QUESTIONS_DEMO_5 = [
    {
        question: "Quelle est la fonction d'usage d'un vélo ?",
        options: ["Se déplacer rapidement sur terre", "Faire joli dans un garage", "Porter des charges lourdes", "Mesurer le temps"],
        correct: 0,
        explanation: "La fonction d'usage répond à la question : 'À quoi sert l'objet ?'."
    },
    {
        question: "Parmi ces matériaux, lequel est d'origine biologique (organique) ?",
        options: ["Le bois", "L'aluminium", "Le verre", "Le béton"],
        correct: 0,
        explanation: "Le bois provient des arbres, c'est un matériau organique naturel."
    }
];

const QUESTIONS_DEMO_3 = [
    {
        question: "Dans une chaîne d'information, quel composant acquiert les données de l'environnement ?",
        options: ["Un capteur", "Un actionneur", "Une batterie", "Un engrenage"],
        correct: 0,
        explanation: "Le capteur (ex: température, présence) capte les grandeurs physiques de l'environnement."
    },
    {
        question: "Quel langage de programmation par blocs est couramment utilisé en technologie 3ème ?",
        options: ["Scratch / mBlock", "C++", "HTML", "Assembly"],
        correct: 0,
        explanation: "Scratch et mBlock permettent de programmer des algorithmes par blocs logiques simples."
    }
];

const QUIZ_DATA_MAP = {
    1: { questions: QUESTIONS_SCORE1, nom: "Score 1 – QCM Type Objets" },
    2: { questions: QUESTIONS_SCORE2, nom: "Score 2 – QCM Objets & Matériaux 1" },
    3: { questions: QUESTIONS_SCORE3, nom: "Score 3 – QCM Objets & Matériaux 2" },
    "demo_5": { questions: QUESTIONS_DEMO_5, nom: "QCM – Objets, Besoins & Fonctions (5ème)" },
    "demo_3": { questions: QUESTIONS_DEMO_3, nom: "QCM – Automatismes & Prototypage (3ème)" }
};

// Variables d'état du QCM en cours
let currentQuizId = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizTimerInterval = null;
let timeRemaining = 0;
let quizAnswers = [];
let quizFinished = false;

function startQuiz(quizId) {
    const quizData = QUIZ_DATA_MAP[quizId];
    if (!quizData) {
        alert("QCM non trouvé.");
        return;
    }

    currentQuizId = quizId;
    currentQuestionIndex = 0;
    quizScore = 0;
    quizAnswers = new Array(quizData.questions.length).fill(null);
    quizFinished = false;

    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');
    container.innerHTML = `
        <div class="timer-container">
            <span class="timer-label">⏱️ Temps restant :</span>
            <span class="timer-display" id="timerDisplay">00:00</span>
            <span class="timer-label" id="timerInfo"></span>
        </div>
        <div id="quizContainer"></div>
        <div class="resultat-final" id="resultatFinal">
            <h3>📊 Résultat final</h3>
            <div class="score-circle" id="scoreCircle">
                <span id="finalScore">0</span>
                <span id="scoreTotal">/ ${quizData.questions.length}</span>
            </div>
            <p class="mention" id="mention"></p>
            <p id="messageResultat"></p>
            <p id="saveStatus" style="margin-top: 15px; font-weight: 600;"></p>
            <button class="btn-menu" onclick="showDashboard(currentStudent.niveau)">↩️ Retour au tableau de bord</button>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';

    let totalTime = quizData.questions.length * CONFIG.TEMPS_PAR_QUESTION;
    if (currentStudent && currentStudent.ppa) {
        const bonus = Math.round(totalTime * CONFIG.PPA_BONUS_PERCENTAGE / 100);
        totalTime += bonus;
        document.getElementById('timerInfo').textContent = `(+${bonus}s bonus PPA)`;
    } else {
        document.getElementById('timerInfo').textContent = '';
    }

    timeRemaining = totalTime;
    updateTimerDisplay();

    generateQuestions(quizData.questions);
    startQuizTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateQuestions(questions) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `question-${index}`;
        if (index === 0) card.classList.add('active');

        const optionsHTML = q.options.map((opt, optIndex) => `
            <div class="option" id="opt-${index}-${optIndex}" onclick="selectOption(${index}, ${optIndex})">
                <input type="radio" name="q${index}" value="${optIndex}">
                <label>${String.fromCharCode(65 + optIndex)}. ${opt}</label>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${index + 1} / ${questions.length}</span>
            </div>
            <p class="question-text">${q.question}</p>
            <div class="options">${optionsHTML}</div>
            <div class="explanation" id="explanation-${index}"></div>
            <button class="btn-next" id="btnNext-${index}" onclick="nextQuestion()">
                ${index === questions.length - 1 ? 'Voir le résultat' : 'Question suivante →'}
            </button>
        `;

        container.appendChild(card);
    });
}

function selectOption(questionIndex, optionIndex) {
    if (quizAnswers[questionIndex] !== null) return;

    quizAnswers[questionIndex] = optionIndex;
    const q = QUIZ_DATA_MAP[currentQuizId].questions[questionIndex];

    const card = document.getElementById(`question-${questionIndex}`);
    const options = card.querySelectorAll('.option');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === optionIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        }
    });

    if (optionIndex === q.correct) {
        quizScore++;
        document.getElementById(`opt-${questionIndex}-${optionIndex}`).classList.add('correct-answer');
    } else {
        document.getElementById(`opt-${questionIndex}-${optionIndex}`).classList.add('wrong-answer');
        document.getElementById(`opt-${questionIndex}-${q.correct}`).classList.add('correct-answer');
    }

    const explanationDiv = document.getElementById(`explanation-${questionIndex}`);
    explanationDiv.textContent = `💡 ${q.explanation}`;
    explanationDiv.classList.add('active');

    document.getElementById(`btnNext-${questionIndex}`).classList.add('active');
}

function nextQuestion() {
    document.getElementById(`question-${currentQuestionIndex}`).classList.remove('active');
    currentQuestionIndex++;

    const questions = QUIZ_DATA_MAP[currentQuizId].questions;
    if (currentQuestionIndex < questions.length) {
        const nextCard = document.getElementById(`question-${currentQuestionIndex}`);
        nextCard.classList.add('active');
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        finishQuiz();
    }
}

function startQuizTimer() {
    stopQuizTimer();
    quizTimerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            stopQuizTimer();
            finishQuiz();
        }
    }, 1000);
}

function stopQuizTimer() {
    if (quizTimerInterval) {
        clearInterval(quizTimerInterval);
        quizTimerInterval = null;
    }
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    if (!display) return;
    const minutes = Math.floor(Math.max(timeRemaining, 0) / 60);
    const seconds = Math.max(timeRemaining, 0) % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (timeRemaining <= 30) display.classList.add('urgent');
    else display.classList.remove('urgent');
}

function finishQuiz() {
    if (quizFinished) return;
    quizFinished = true;
    stopQuizTimer();

    document.querySelectorAll('.question-card').forEach(card => card.classList.remove('active'));

    const questions = QUIZ_DATA_MAP[currentQuizId].questions;
    const resultatFinal = document.getElementById('resultatFinal');
    const finalScore = document.getElementById('finalScore');
    const scoreCircle = document.getElementById('scoreCircle');
    const mention = document.getElementById('mention');
    const messageResultat = document.getElementById('messageResultat');

    finalScore.textContent = quizScore;
    const pct = quizScore / questions.length;

    if (pct >= 0.9) {
        scoreCircle.style.background = '#28A745';
        mention.textContent = '🏆 Excellent !';
        mention.className = 'mention excellent';
        messageResultat.textContent = "Félicitations ! Vous maîtrisez parfaitement les notions abordées.";
    } else if (pct >= 0.7) {
        scoreCircle.style.background = '#2E86AB';
        mention.textContent = '👍 Très bien !';
        mention.className = 'mention bien';
        messageResultat.textContent = "Bon travail ! Quelques révisions vous permettront d'atteindre l'excellence.";
    } else if (pct >= 0.5) {
        scoreCircle.style.background = '#FFC107';
        mention.textContent = '📖 Moyen';
        mention.className = 'mention moyen';
        messageResultat.textContent = "Vous avez des bases, mais il est conseillé de revoir le cours.";
    } else {
        scoreCircle.style.background = '#DC3545';
        mention.textContent = '📚 Insuffisant';
        mention.className = 'mention insuffisant';
        messageResultat.textContent = "Il est nécessaire de reprendre le cours avant de retenter ce QCM.";
    }

    resultatFinal.classList.add('active');
    resultatFinal.scrollIntoView({ behavior: 'smooth' });

    const resultData = {
        nom: currentStudent.nom,
        prenom: currentStudent.prenom,
        classe: currentStudent.classe,
        quizType: currentQuizId,
        score: quizScore,
        total: questions.length,
        pourcentage: Math.round(pct * 100),
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR')
    };

    saveResultLocally(resultData);
    sendResultToGoogleSheets(resultData);
}

function saveResultLocally(result) {
    try {
        const results = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_RESULTS)) || [];
        results.push(result);
        localStorage.setItem(CONFIG.STORAGE_KEY_RESULTS, JSON.stringify(results));
    } catch (e) {
        console.error("Erreur de sauvegarde locale", e);
    }
}

async function sendResultToGoogleSheets(resultData) {
    const saveStatus = document.getElementById('saveStatus');
    if (!saveStatus) return;

    if (!CONFIG.RESULTS_WEB_APP_URL || CONFIG.RESULTS_WEB_APP_URL.includes('COLLER_ICI')) {
        saveStatus.textContent = '⚠️ Envoi en ligne non configuré — résultat conservé localement.';
        saveStatus.style.color = '#856404';
        return;
    }

    saveStatus.textContent = '📤 Envoi du résultat en cours...';
    saveStatus.style.color = '#6C757D';

    try {
        await fetch(CONFIG.RESULTS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(resultData)
        });
        saveStatus.textContent = '✅ Résultat enregistré en ligne et localement.';
        saveStatus.style.color = '#28A745';
    } catch (error) {
        console.error("❌ Erreur envoi en ligne:", error);
        saveStatus.textContent = '⚠️ Envoi en ligne impossible — résultat conservé localement.';
        saveStatus.style.color = '#DC3545';
    }
}
