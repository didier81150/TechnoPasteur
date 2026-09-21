// =====================================================
// MODULE INTEGRATION : OBJET ET MATÉRIAUX
// Sub-modules : Type d'objet, Objet & Matériaux 1, Objet & Matériaux 2
// =====================================================

const OBJET_MATERIAUX_SUBMODULES = [
    {
        id: 1,
        code: "type_objet",
        title: "Sub-module 1 : Type d'objet",
        shortTitle: "Type d'objet",
        description: "Évaluation sur les caractéristiques fondamentales et types d'objets.",
        questions: QUESTIONS_SCORE1,
        colKey: "type d'objet"
    },
    {
        id: 2,
        code: "materiaux_1",
        title: "Sub-module 2 : Objet & Matériaux 1",
        shortTitle: "Objet & Matériaux 1",
        description: "Évaluation approfondie : caractéristiques mécaniques et traitements thermiques.",
        questions: QUESTIONS_SCORE2,
        colKey: "note objet et materiaux 1"
    },
    {
        id: 3,
        code: "materiaux_2",
        title: "Sub-module 3 : Objet & Matériaux 2",
        shortTitle: "Objet & Matériaux 2",
        description: "Évaluation avancée : propriétés des polymères, métaux et résilience.",
        questions: QUESTIONS_SCORE3,
        colKey: "note objet et materiaux 2"
    }
];

// Key helper for localStorage progression per student
function getObjetMateriauxStorageKey() {
    if (currentStudent) {
        return `om_progress_${currentStudent.niveau}_${currentStudent.classe}_${currentStudent.nom}_${currentStudent.prenom}`.toLowerCase().replace(/\s+/g, '_');
    }
    return `om_progress_guest`;
}

function getObjetMateriauxProgress() {
    try {
        const key = getObjetMateriauxStorageKey();
        const saved = localStorage.getItem(key);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error("Erreur lecture progression Objet & Matériaux", e);
    }
    return {
        sub1_score: null, sub1_max: null, sub1_pct: null, sub1_done: false,
        sub2_score: null, sub2_max: null, sub2_pct: null, sub2_done: false,
        sub3_score: null, sub3_max: null, sub3_pct: null, sub3_done: false,
        note_totale: null
    };
}

function saveObjetMateriauxProgress(progress) {
    try {
        const key = getObjetMateriauxStorageKey();
        localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
        console.error("Erreur sauvegarde progression Objet & Matériaux", e);
    }
}

// Global state for current sub-module quiz session
let omCurrentSubId = null;
let omCurrentQuestionIndex = 0;
let omQuizScore = 0;
let omQuizAnswers = [];
let omTimerInterval = null;
let omTimeRemaining = 0;
let omQuizFinished = false;

function openObjetMateriauxModule() {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');
    document.getElementById('activityScreen').style.display = 'block';

    renderObjetMateriauxOverview(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderObjetMateriauxOverview(container) {
    const progress = getObjetMateriauxProgress();

    // Determine lock statuses:
    // Sub 1: always unlocked
    // Sub 2: unlocked if Sub 1 is done
    // Sub 3: unlocked if Sub 2 is done
    const sub1Unlocked = true;
    const sub2Unlocked = progress.sub1_done === true;
    const sub3Unlocked = progress.sub2_done === true;

    // Calculate completion metrics
    let completedCount = 0;
    if (progress.sub1_done) completedCount++;
    if (progress.sub2_done) completedCount++;
    if (progress.sub3_done) completedCount++;

    const sub1PctText = progress.sub1_done ? progress.sub1_pct : "Non effectué";
    const sub2PctText = progress.sub2_done ? progress.sub2_pct : (sub2Unlocked ? "Non effectué" : "🔒 Verrouillé");
    const sub3PctText = progress.sub3_done ? progress.sub3_pct : (sub3Unlocked ? "Non effectué" : "🔒 Verrouillé");
    const noteTotaleText = progress.note_totale ? progress.note_totale : "-- / 20";

    container.innerHTML = `
        <div class="stage-container" style="max-width: 850px; margin: 0 auto; padding: 30px;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; border-bottom: 2px solid var(--border); padding-bottom: 15px;">
                <span style="font-size: 2.5rem; background: #DBEAFE; padding: 12px; border-radius: 12px;">⚙️</span>
                <div>
                    <h2 style="color: var(--navy); font-size: 1.6rem; font-weight: 800; margin: 0;">Parcours : Objet et Matériaux</h2>
                    <p style="color: var(--text-muted); margin: 4px 0 0 0; font-size: 0.95rem;">
                        Complétez successivement les 3 sous-modules pour valider votre parcours.
                    </p>
                </div>
            </div>

            <!-- CARTE RECAPITULATIVE DES NOTES -->
            <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; border-radius: var(--radius-md); padding: 20px 24px; margin-bottom: 25px; box-shadow: var(--shadow-md);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
                    <div>
                        <span style="font-size: 0.8rem; color: var(--turquoise); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Bilan Actuel</span>
                        <h3 style="margin: 4px 0; font-size: 1.3rem;">${currentStudent ? escapeHTML(`${currentStudent.prenom} ${currentStudent.nom} (${currentStudent.classe})`) : 'Élève'}</h3>
                        <p style="margin: 0; font-size: 0.88rem; opacity: 0.8;">Progression : ${completedCount} / 3 sous-modules validés</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 12px 20px; border-radius: 12px; text-align: center; border: 1px solid rgba(255,255,255,0.15);">
                        <span style="display: block; font-size: 0.75rem; color: #94A3B8; text-transform: uppercase; font-weight: 700;">Note Totale</span>
                        <span style="font-size: 1.8rem; font-weight: 800; color: #5EEAD4;">${noteTotaleText}</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center;">
                        <span style="display: block; font-size: 0.75rem; color: #94A3B8;">Type d'objet</span>
                        <strong style="font-size: 1.1rem; color: ${progress.sub1_done ? '#6EE7B7' : '#FCD34D'};">${sub1PctText}</strong>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center;">
                        <span style="display: block; font-size: 0.75rem; color: #94A3B8;">Objet & Matériaux 1</span>
                        <strong style="font-size: 1.1rem; color: ${progress.sub2_done ? '#6EE7B7' : (sub2Unlocked ? '#FCD34D' : '#94A3B8')};">${sub2PctText}</strong>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; text-align: center;">
                        <span style="display: block; font-size: 0.75rem; color: #94A3B8;">Objet & Matériaux 2</span>
                        <strong style="font-size: 1.1rem; color: ${progress.sub3_done ? '#6EE7B7' : (sub3Unlocked ? '#FCD34D' : '#94A3B8')};">${sub3PctText}</strong>
                    </div>
                </div>
            </div>

            <!-- LISTE DES 3 SOUS-MODULES -->
            <div style="display: flex; flex-direction: column; gap: 18px;">
                <!-- SOUS-MODULE 1 -->
                <div style="background: var(--card-bg); border: 2px solid ${progress.sub1_done ? 'var(--green)' : 'var(--border)'}; border-radius: var(--radius-md); padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; transition: var(--transition); box-shadow: var(--shadow-sm);">
                    <div style="flex: 1; min-width: 240px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="background: #DBEAFE; color: #1E40AF; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Étape 1</span>
                            ${progress.sub1_done ? '<span style="color: var(--green); font-weight: 700; font-size: 0.85rem;">✅ Validé</span>' : '<span style="color: var(--yellow); font-weight: 700; font-size: 0.85rem;">🟢 En attente</span>'}
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: var(--navy); font-size: 1.15rem; font-weight: 800;">Type d'objet</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">Évaluation sur les caractéristiques fondamentales des objets et des alliages.</p>
                    </div>
                    <div style="text-align: right; min-width: 140px;">
                        ${progress.sub1_done ? `<div style="font-weight: 800; font-size: 1.2rem; color: var(--green); margin-bottom: 8px;">Score : ${progress.sub1_pct}</div>` : ''}
                        <button class="btn-start-activity" ${progress.sub1_done ? 'disabled style="background: #CBD5E1; cursor: not-allowed;"' : ''} onclick="startObjetMateriauxSubQuiz(1)" style="width: 100%;">
                            ${progress.sub1_done ? '✅ Terminé (1 seul essai)' : '▶ Commencer étape 1'}
                        </button>
                    </div>
                </div>

                <!-- SOUS-MODULE 2 -->
                <div style="background: ${sub2Unlocked ? 'var(--card-bg)' : '#F8FAFC'}; border: 2px solid ${progress.sub2_done ? 'var(--green)' : (sub2Unlocked ? 'var(--border)' : 'var(--border)')}; border-radius: var(--radius-md); padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; transition: var(--transition); opacity: ${sub2Unlocked ? '1' : '0.65'}; box-shadow: var(--shadow-sm);">
                    <div style="flex: 1; min-width: 240px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="background: #DBEAFE; color: #1E40AF; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Étape 2</span>
                            ${progress.sub2_done ? '<span style="color: var(--green); font-weight: 700; font-size: 0.85rem;">✅ Validé</span>' : (sub2Unlocked ? '<span style="color: var(--yellow); font-weight: 700; font-size: 0.85rem;">🟢 Disponible</span>' : '<span style="color: var(--text-muted); font-weight: 700; font-size: 0.85rem;">🔒 Débloqué après l\'étape 1</span>')}
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: var(--navy); font-size: 1.15rem; font-weight: 800;">Objet & Matériaux 1</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">Évaluation approfondie : caractéristiques mécaniques et traitements thermiques.</p>
                    </div>
                    <div style="text-align: right; min-width: 140px;">
                        ${progress.sub2_done ? `<div style="font-weight: 800; font-size: 1.2rem; color: var(--green); margin-bottom: 8px;">Score : ${progress.sub2_pct}</div>` : ''}
                        <button class="btn-start-activity" ${sub2Unlocked && !progress.sub2_done ? '' : 'disabled style="background: #CBD5E1; cursor: not-allowed;"'} onclick="startObjetMateriauxSubQuiz(2)" style="width: 100%;">
                            ${progress.sub2_done ? '✅ Terminé (1 seul essai)' : (sub2Unlocked ? '▶ Commencer étape 2' : '🔒 Verrouillé')}
                        </button>
                    </div>
                </div>

                <!-- SOUS-MODULE 3 -->
                <div style="background: ${sub3Unlocked ? 'var(--card-bg)' : '#F8FAFC'}; border: 2px solid ${progress.sub3_done ? 'var(--green)' : (sub3Unlocked ? 'var(--border)' : 'var(--border)')}; border-radius: var(--radius-md); padding: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px; transition: var(--transition); opacity: ${sub3Unlocked ? '1' : '0.65'}; box-shadow: var(--shadow-sm);">
                    <div style="flex: 1; min-width: 240px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <span style="background: #DBEAFE; color: #1E40AF; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">Étape 3</span>
                            ${progress.sub3_done ? '<span style="color: var(--green); font-weight: 700; font-size: 0.85rem;">✅ Validé</span>' : (sub3Unlocked ? '<span style="color: var(--yellow); font-weight: 700; font-size: 0.85rem;">🟢 Disponible</span>' : '<span style="color: var(--text-muted); font-weight: 700; font-size: 0.85rem;">🔒 Débloqué après l\'étape 2</span>')}
                        </div>
                        <h4 style="margin: 0 0 4px 0; color: var(--navy); font-size: 1.15rem; font-weight: 800;">Objet & Matériaux 2</h4>
                        <p style="margin: 0; color: var(--text-muted); font-size: 0.88rem;">Évaluation avancée : propriétés des polymères, métaux et résilience.</p>
                    </div>
                    <div style="text-align: right; min-width: 140px;">
                        ${progress.sub3_done ? `<div style="font-weight: 800; font-size: 1.2rem; color: var(--green); margin-bottom: 8px;">Score : ${progress.sub3_pct}</div>` : ''}
                        <button class="btn-start-activity" ${sub3Unlocked && !progress.sub3_done ? '' : 'disabled style="background: #CBD5E1; cursor: not-allowed;"'} onclick="startObjetMateriauxSubQuiz(3)" style="width: 100%;">
                            ${progress.sub3_done ? '✅ Terminé (1 seul essai)' : (sub3Unlocked ? '▶ Commencer étape 3' : '🔒 Verrouillé')}
                        </button>
                    </div>
                </div>
            </div>

            <div style="margin-top: 25px; text-align: center;">
                <button class="btn-menu" onclick="showDashboard('4eme')" style="padding: 10px 24px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer;">
                    ↩️ Retour au tableau de bord
                </button>
            </div>
        </div>
    `;
}

function startObjetMateriauxSubQuiz(subId) {
    const progress = getObjetMateriauxProgress();
    if ((subId === 1 && progress.sub1_done) || (subId === 2 && progress.sub2_done) || (subId === 3 && progress.sub3_done)) {
        alert("Vous avez déjà effectué ce sous-module. Un seul essai est autorisé.");
        return;
    }

    const subConfig = OBJET_MATERIAUX_SUBMODULES.find(s => s.id === subId);
    if (!subConfig) return;

    omCurrentSubId = subId;
    omCurrentQuestionIndex = 0;
    omQuizScore = 0;
    omQuizAnswers = new Array(subConfig.questions.length).fill(null);
    omQuizFinished = false;

    const container = document.getElementById('activityContent');
    container.innerHTML = `
        <div style="margin-bottom: 15px;">
            <button onclick="openObjetMateriauxModule()" style="background: #64748B; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; cursor: pointer;">
                ⬅️ Annuler & Retour au parcours
            </button>
        </div>
        <div class="timer-container">
            <span class="timer-label">⏱️ Temps restant (${subConfig.shortTitle}) :</span>
            <span class="timer-display" id="omTimerDisplay">00:00</span>
            <span class="timer-label" id="omTimerInfo"></span>
        </div>
        <div id="omQuizContainer"></div>
        <div class="resultat-final" id="omResultatFinal">
            <h3>📊 Résultat - ${subConfig.shortTitle}</h3>
            <div class="score-circle" id="omScoreCircle">
                <span id="omFinalScore">0</span>
                <span id="omScoreTotal">/ ${subConfig.questions.length}</span>
            </div>
            <p class="mention" id="omMention"></p>
            <p id="omMessageResultat"></p>
            <p id="omSaveStatus" style="margin-top: 15px; font-weight: 600;"></p>
            <div style="display: flex; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
                <button class="btn-menu" onclick="openObjetMateriauxModule()" style="padding: 12px 24px; border-radius: 25px; background: var(--primary); color: white; border: none; font-weight: 700; cursor: pointer;">
                    📋 Continuer le parcours
                </button>
            </div>
        </div>
    `;

    let totalTime = subConfig.questions.length * CONFIG.TEMPS_PAR_QUESTION;
    if (currentStudent && currentStudent.ppa) {
        const bonus = Math.round(totalTime * CONFIG.PPA_BONUS_PERCENTAGE / 100);
        totalTime += bonus;
        document.getElementById('omTimerInfo').textContent = `(+${bonus}s bonus PPA)`;
    } else {
        document.getElementById('omTimerInfo').textContent = '';
    }

    omTimeRemaining = totalTime;
    updateOmTimerDisplay();

    generateOmQuestions(subConfig.questions);
    startOmQuizTimer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function generateOmQuestions(questions) {
    const container = document.getElementById('omQuizContainer');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.id = `om-question-${index}`;
        if (index === 0) card.classList.add('active');

        const optionsHTML = q.options.map((opt, optIndex) => `
            <div class="option" id="om-opt-${index}-${optIndex}" onclick="selectOmOption(${index}, ${optIndex})">
                <input type="radio" name="om_q${index}" value="${optIndex}">
                <label>${String.fromCharCode(65 + optIndex)}. ${escapeHTML(opt)}</label>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${index + 1} / ${questions.length}</span>
            </div>
            <p class="question-text">${escapeHTML(q.question)}</p>
            <div class="options">${optionsHTML}</div>
            <div class="explanation" id="om-explanation-${index}"></div>
            <button class="btn-next" id="omBtnNext-${index}" onclick="nextOmQuestion()">
                ${index === questions.length - 1 ? 'Voir le résultat' : 'Question suivante →'}
            </button>
        `;

        container.appendChild(card);
    });
}

function selectOmOption(questionIndex, optionIndex) {
    if (omQuizAnswers[questionIndex] !== null) return;

    omQuizAnswers[questionIndex] = optionIndex;
    const subConfig = OBJET_MATERIAUX_SUBMODULES.find(s => s.id === omCurrentSubId);
    const q = subConfig.questions[questionIndex];

    const card = document.getElementById(`om-question-${questionIndex}`);
    const options = card.querySelectorAll('.option');

    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === optionIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        }
    });

    if (optionIndex === q.correct) {
        omQuizScore++;
        document.getElementById(`om-opt-${questionIndex}-${optionIndex}`).classList.add('correct-answer');
    } else {
        document.getElementById(`om-opt-${questionIndex}-${optionIndex}`).classList.add('wrong-answer');
        document.getElementById(`om-opt-${questionIndex}-${q.correct}`).classList.add('correct-answer');
    }

    const explanationDiv = document.getElementById(`om-explanation-${questionIndex}`);
    if (explanationDiv) {
        explanationDiv.textContent = `💡 ${q.explanation}`;
        explanationDiv.classList.add('active');
    }

    document.getElementById(`omBtnNext-${questionIndex}`).classList.add('active');
}

function nextOmQuestion() {
    document.getElementById(`om-question-${omCurrentQuestionIndex}`).classList.remove('active');
    omCurrentQuestionIndex++;

    const subConfig = OBJET_MATERIAUX_SUBMODULES.find(s => s.id === omCurrentSubId);
    if (omCurrentQuestionIndex < subConfig.questions.length) {
        const nextCard = document.getElementById(`om-question-${omCurrentQuestionIndex}`);
        nextCard.classList.add('active');
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        finishOmQuiz();
    }
}

function startOmQuizTimer() {
    stopOmQuizTimer();
    omTimerInterval = setInterval(() => {
        omTimeRemaining--;
        updateOmTimerDisplay();

        if (omTimeRemaining <= 0) {
            stopOmQuizTimer();
            finishOmQuiz();
        }
    }, 1000);
}

function stopOmQuizTimer() {
    if (omTimerInterval) {
        clearInterval(omTimerInterval);
        omTimerInterval = null;
    }
}

function updateOmTimerDisplay() {
    const display = document.getElementById('omTimerDisplay');
    if (!display) return;
    const minutes = Math.floor(Math.max(omTimeRemaining, 0) / 60);
    const seconds = Math.max(omTimeRemaining, 0) % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    if (omTimeRemaining <= 30) display.classList.add('urgent');
    else display.classList.remove('urgent');
}

async function finishOmQuiz() {
    if (omQuizFinished) return;
    omQuizFinished = true;
    stopOmQuizTimer();

    document.querySelectorAll('#omQuizContainer .question-card').forEach(card => card.classList.remove('active'));

    const subConfig = OBJET_MATERIAUX_SUBMODULES.find(s => s.id === omCurrentSubId);
    const totalQuestions = subConfig.questions.length;
    const pct = Math.round((omQuizScore / totalQuestions) * 100);
    const pctStr = `${pct}%`;

    // 1. Update localStorage progress
    const progress = getObjetMateriauxProgress();
    if (omCurrentSubId === 1) {
        progress.sub1_score = omQuizScore;
        progress.sub1_max = totalQuestions;
        progress.sub1_pct = pctStr;
        progress.sub1_done = true;
    } else if (omCurrentSubId === 2) {
        progress.sub2_score = omQuizScore;
        progress.sub2_max = totalQuestions;
        progress.sub2_pct = pctStr;
        progress.sub2_done = true;
    } else if (omCurrentSubId === 3) {
        progress.sub3_score = omQuizScore;
        progress.sub3_max = totalQuestions;
        progress.sub3_pct = pctStr;
        progress.sub3_done = true;
    }

    // Calculate Note Totale on 20
    let totalScore = 0;
    let totalMax = 0;

    if (progress.sub1_done) { totalScore += progress.sub1_score; totalMax += progress.sub1_max; }
    if (progress.sub2_done) { totalScore += progress.sub2_score; totalMax += progress.sub2_max; }
    if (progress.sub3_done) { totalScore += progress.sub3_score; totalMax += progress.sub3_max; }

    let noteTotaleVal = 0;
    if (totalMax > 0) {
        noteTotaleVal = (totalScore / totalMax) * 20;
    }
    // Format note_totale (e.g. "16/20" or "15.5/20")
    const formattedNote20 = (Math.round(noteTotaleVal * 10) / 10).toString();
    progress.note_totale = `${formattedNote20}/20`;

    saveObjetMateriauxProgress(progress);

    // Display result UI
    const resultatFinal = document.getElementById('omResultatFinal');
    const finalScore = document.getElementById('omFinalScore');
    const scoreCircle = document.getElementById('omScoreCircle');
    const mention = document.getElementById('omMention');
    const messageResultat = document.getElementById('omMessageResultat');

    finalScore.textContent = omQuizScore;
    const pctRatio = omQuizScore / totalQuestions;

    if (pctRatio >= 0.9) {
        scoreCircle.style.background = '#28A745';
        mention.textContent = '🏆 Excellent !';
        mention.className = 'mention excellent';
        messageResultat.textContent = `Sous-module ${subConfig.shortTitle} validé avec brio !`;
    } else if (pctRatio >= 0.7) {
        scoreCircle.style.background = '#2E86AB';
        mention.textContent = '👍 Très bien !';
        mention.className = 'mention bien';
        messageResultat.textContent = `Sous-module ${subConfig.shortTitle} validé !`;
    } else if (pctRatio >= 0.5) {
        scoreCircle.style.background = '#FFC107';
        mention.textContent = '📖 Moyen';
        mention.className = 'mention moyen';
        messageResultat.textContent = `Sous-module ${subConfig.shortTitle} validé. Préparez la suite !`;
    } else {
        scoreCircle.style.background = '#DC3545';
        mention.textContent = '📚 Insuffisant';
        mention.className = 'mention insuffisant';
        messageResultat.textContent = `Sous-module ${subConfig.shortTitle} complété. Vous pouvez poursuivre l'étape suivante.`;
    }

    resultatFinal.classList.add('active');
    resultatFinal.scrollIntoView({ behavior: 'smooth' });

    // 2. Send payload to Google Apps Script / Google Sheets
    const saveStatus = document.getElementById('omSaveStatus');
    if (saveStatus) {
        saveStatus.textContent = '📤 Envoi des résultats vers le Google Sheet en cours...';
        saveStatus.style.color = '#6C757D';
    }

    const payload = {
        type: 'MODULE_OBJETS_MATERIAUX',
        nom: currentStudent ? currentStudent.nom : '',
        prenom: currentStudent ? currentStudent.prenom : '',
        classe: currentStudent ? currentStudent.classe : '',
        "type d'objet": progress.sub1_pct !== null ? progress.sub1_pct : "",
        "note objet et materiaux 1": progress.sub2_pct !== null ? progress.sub2_pct : "",
        "note objet et materiaux 2": progress.sub3_pct !== null ? progress.sub3_pct : "",
        "note totale": progress.note_totale !== null ? progress.note_totale : "",
        // Standard keys fallback
        typeObjet: progress.sub1_pct !== null ? progress.sub1_pct : "",
        noteMateriaux1: progress.sub2_pct !== null ? progress.sub2_pct : "",
        noteMateriaux2: progress.sub3_pct !== null ? progress.sub3_pct : "",
        noteTotale: progress.note_totale !== null ? progress.note_totale : "",
        date: new Date().toLocaleDateString('fr-FR')
    };

    let gasSuccess = false;
    if (typeof sendDataToGoogleAppsScript === 'function') {
        gasSuccess = await sendDataToGoogleAppsScript(payload);
    }

    if (saveStatus) {
        if (gasSuccess) {
            saveStatus.textContent = '✅ Résultats enregistrés sur Google Sheets et localement.';
            saveStatus.style.color = '#28A745';
        } else {
            saveStatus.textContent = '⚠️ Résultats enregistrés localement sur ce navigateur.';
            saveStatus.style.color = '#856404';
        }
    }
}
