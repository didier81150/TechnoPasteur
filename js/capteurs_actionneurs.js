// =====================================================
// MODULE : CAPTEURS, DÉTECTEURS, ACTIONNEURS & INTERFACES (4ÈME)
// Activity title: "Non, les robots n’ont pas de super-pouvoirs"
// =====================================================

const CAPTEURS_ACTIONNEURS_QUIZ_DATA = [
    { item: "🔊 Buzzer", answer: "actionneur" },
    { item: "☀️ Photorésistance", answer: "capteur" },
    { item: "🟦 Arduino", answer: "interface" },
    { item: "🚪 Fin de course", answer: "detecteur" },
    { item: "🦾 Servomoteur", answer: "actionneur" },
    { item: "📏 Ultrason", answer: "capteur" },
    { item: "🟩 Micro:bit", answer: "interface" },
    { item: "👋 Infrarouge", answer: "detecteur" }
];

const CAPTEURS_ACTIONNEURS_CATEGORIES = [
    { key: "capteur", label: "👀 Capteur" },
    { key: "detecteur", label: "🚨 Détecteur" },
    { key: "actionneur", label: "💪 Actionneur" },
    { key: "interface", label: "🧠 Interface" }
];

let caScore = 0;
let caAnswered = 0;
let caState = [];

function openCapteursActionneursModule() {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');
    document.getElementById('activityScreen').style.display = 'block';

    renderCapteursActionneursContent(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCapteursActionneursContent(container) {
    container.innerHTML = `
        <style>
            .ca-wrapper {
                max-width: 1050px;
                margin: 0 auto;
                font-family: 'Plus Jakarta Sans', sans-serif;
            }
            .ca-header {
                background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1);
                background-size: 300% 300%;
                animation: caGradientShift 8s ease infinite;
                border-radius: var(--radius-lg, 20px);
                padding: 30px 20px;
                text-align: center;
                color: white;
                text-shadow: 2px 2px 6px rgba(0,0,0,0.4);
                margin-bottom: 25px;
                box-shadow: var(--shadow-lg);
            }
            @keyframes caGradientShift {
                0%,100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            .ca-header h1 {
                font-size: 2.2em;
                margin-bottom: 10px;
                letter-spacing: 0.5px;
            }
            .ca-header p {
                font-size: 1.15em;
                font-weight: 700;
            }
            .ca-chain {
                background: white;
                border-radius: var(--radius-lg, 20px);
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: var(--shadow-md);
                text-align: center;
                border: 1px solid var(--border);
            }
            .ca-chain h2 {
                color: var(--navy, #0F172A);
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            .ca-chain-flow {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
            }
            .ca-chain-step {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 18px 22px;
                border-radius: 15px;
                min-width: 140px;
                font-weight: bold;
                box-shadow: 0 5px 15px rgba(0,0,0,0.15);
                transition: transform 0.3s;
            }
            .ca-chain-step:hover { transform: translateY(-5px) scale(1.04); }
            .ca-chain-step .emoji { font-size: 2.2em; display: block; margin-bottom: 6px; }
            .ca-chain-step .label { font-size: 1em; }
            .ca-chain-step .sub { font-size: 0.85em; opacity: 0.9; margin-top: 4px; }
            .ca-arrow {
                font-size: 2.2em;
                color: #ff6b6b;
                font-weight: bold;
                animation: caPulse 1.5s infinite;
            }
            @keyframes caPulse {
                0%,100% { transform: translateX(0); }
                50% { transform: translateX(8px); }
            }
            .ca-magic-phrase {
                margin-top: 20px;
                padding: 15px;
                background: linear-gradient(135deg, #feca57, #ff9f43);
                border-radius: 12px;
                font-size: 1.1em;
                font-weight: bold;
                color: #2c2c54;
                text-align: center;
            }
            .ca-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }
            .ca-card {
                background: white;
                border-radius: 18px;
                padding: 22px;
                box-shadow: var(--shadow-md);
                border-top: 8px solid;
                border-left: 1px solid var(--border);
                border-right: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                transition: transform 0.3s, box-shadow 0.3s;
            }
            .ca-card:hover {
                transform: translateY(-6px);
                box-shadow: var(--shadow-lg);
            }
            .ca-card.capteur { border-top-color: #48dbfb; }
            .ca-card.detecteur { border-top-color: #ff6b6b; }
            .ca-card.actionneur { border-top-color: #1dd1a1; }
            .ca-card.interface { border-top-color: #a55eea; }
            .ca-card h3 {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.3em;
                margin-bottom: 12px;
                color: var(--navy);
            }
            .ca-card .badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.7em;
                font-weight: bold;
                color: white;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            .capteur .badge { background: #00b4d8; }
            .detecteur .badge { background: #ff6b6b; }
            .actionneur .badge { background: #1dd1a1; }
            .interface .badge { background: #a55eea; }
            .ca-card .desc {
                font-style: italic;
                color: #555;
                margin-bottom: 12px;
                padding: 8px 12px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 0.92em;
            }
            .ca-card ul { list-style: none; }
            .ca-card ul li {
                padding: 6px 0;
                border-bottom: 1px dashed #eee;
                font-size: 0.92em;
            }
            .ca-card ul li:last-child { border-bottom: none; }
            .ca-card ul li strong { color: #2a5298; }

            .ca-piege {
                background: linear-gradient(135deg, #fff5f5, #ffe0e0);
                border: 3px dashed #ff6b6b;
                border-radius: 18px;
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: var(--shadow-sm);
            }
            .ca-piege h2 {
                text-align: center;
                color: #c0392b;
                margin-bottom: 20px;
                font-size: 1.4em;
            }
            .ca-piege-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            .ca-piege-box {
                background: white;
                padding: 18px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            }
            .ca-piege-box h4 { font-size: 1.15em; margin-bottom: 8px; }
            .ca-piege-box.cap h4 { color: #00b4d8; }
            .ca-piege-box.det h4 { color: #ff6b6b; }
            .ca-piege-box p { font-size: 0.92em; color: #444; }
            .ca-piege-box .big { font-size: 1.25em; font-weight: bold; margin: 8px 0; }

            .ca-exemple {
                background: white;
                border-radius: 18px;
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: var(--shadow-md);
                border: 1px solid var(--border);
            }
            .ca-exemple h2 {
                text-align: center;
                color: #2a5298;
                margin-bottom: 20px;
                font-size: 1.4em;
            }
            .ca-exemple-step {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                margin-bottom: 12px;
                border-radius: 12px;
                background: #f8f9fa;
                transition: transform 0.3s;
            }
            .ca-exemple-step:hover { transform: translateX(8px); }
            .ca-exemple-step .icon { font-size: 2.2em; min-width: 50px; text-align: center; }
            .ca-exemple-step .text { flex: 1; font-size: 0.98em; }
            .ca-exemple-step .text strong { color: #2a5298; }

            .ca-quiz-section {
                background: linear-gradient(135deg, #f6f9ff, #e8f0ff);
                border-radius: 18px;
                padding: 25px;
                margin-bottom: 25px;
                box-shadow: var(--shadow-md);
                border: 1px solid #d0e1fd;
            }
            .ca-quiz-section h2 {
                text-align: center;
                color: #2a5298;
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            .ca-quiz-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 18px;
                background: white;
                border-radius: 12px;
                margin-bottom: 12px;
                box-shadow: 0 3px 10px rgba(0,0,0,0.06);
                font-size: 1em;
                flex-wrap: wrap;
                gap: 10px;
            }
            .ca-quiz-item button {
                padding: 8px 16px;
                border: none;
                border-radius: 20px;
                background: #667eea;
                color: white;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.25s;
                font-size: 0.88em;
            }
            .ca-quiz-item button:hover:not(:disabled) {
                background: #764ba2;
                transform: scale(1.04);
            }
            .ca-quiz-item button:disabled {
                opacity: 0.85;
                cursor: default;
            }
            .ca-quiz-item button.ca-correct { background: #1dd1a1 !important; color: white; }
            .ca-quiz-item button.ca-wrong { background: #ff6b6b !important; color: white; animation: caShake 0.4s; }

            @keyframes caShake {
                0%,100% { transform: translateX(0); }
                25% { transform: translateX(-6px); }
                75% { transform: translateX(6px); }
            }

            .ca-quiz-result {
                text-align: center;
                font-size: 1.2em;
                font-weight: bold;
                margin-top: 18px;
                color: #2a5298;
                min-height: 40px;
            }

            .ca-memo {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-bottom: 25px;
            }
            .ca-memo-card {
                background: white;
                border-radius: 15px;
                padding: 20px 12px;
                text-align: center;
                box-shadow: var(--shadow-sm);
                transition: transform 0.3s;
                border: 1px solid var(--border);
            }
            .ca-memo-card:hover { transform: scale(1.05) rotate(-2deg); }
            .ca-memo-card .big-emoji { font-size: 2.8em; display: block; margin-bottom: 8px; }
            .ca-memo-card .title { font-weight: bold; font-size: 1em; margin-bottom: 5px; }
            .ca-memo-card .verb { font-size: 0.88em; color: #666; font-style: italic; }

            .ca-memo-card.c1 { border-top: 6px solid #48dbfb; }
            .ca-memo-card.c2 { border-top: 6px solid #ff6b6b; }
            .ca-memo-card.c3 { border-top: 6px solid #1dd1a1; }
            .ca-memo-card.c4 { border-top: 6px solid #a55eea; }

            .ca-footer {
                text-align: center;
                color: #475569;
                font-size: 0.95em;
                padding: 15px;
            }
            .ca-footer .final {
                display: inline-block;
                background: #e2e8f0;
                padding: 10px 22px;
                border-radius: 30px;
                font-weight: bold;
                font-size: 1.05em;
            }

            @media (max-width: 600px) {
                .ca-header h1 { font-size: 1.5em; }
                .ca-piege-grid { grid-template-columns: 1fr; }
                .ca-arrow { transform: rotate(90deg); }
                @keyframes caPulse {
                    0%,100% { transform: rotate(90deg) translateX(0); }
                    50% { transform: rotate(90deg) translateX(8px); }
                }
            }
        </style>

        <div class="ca-wrapper">
            <!-- HEADER -->
            <header class="ca-header">
                <h1>🤖 La Chaîne du Robot</h1>
                <p>Non, les robots n’ont pas de super-pouvoirs</p>
                <p style="font-size:0.95em; margin-top:8px; opacity:0.95;">Capteurs • Détecteurs • Actionneurs • Interfaces — Technologie 4ème</p>
            </header>

            <!-- CHAÎNE -->
            <section class="ca-chain">
                <h2>🎯 Le Grand Schéma</h2>
                <div class="ca-chain-flow">
                    <div class="ca-chain-step">
                        <span class="emoji">👀</span>
                        <span class="label">CAPTEURS</span>
                        <div class="sub">+ Détecteurs</div>
                    </div>
                    <span class="ca-arrow">➡️</span>
                    <div class="ca-chain-step">
                        <span class="emoji">🧠</span>
                        <span class="label">INTERFACE</span>
                        <div class="sub">Programmable</div>
                    </div>
                    <span class="ca-arrow">➡️</span>
                    <div class="ca-chain-step">
                        <span class="emoji">💪</span>
                        <span class="label">ACTIONNEURS</span>
                        <div class="sub">Agir</div>
                    </div>
                </div>
                <div class="ca-magic-phrase">
                    🎵 « Les capteurs 👀 informent, l'interface 🧠 décide, les actionneurs 💪 agissent ! »
                </div>
            </section>

            <!-- GRILLE 4 CARTES -->
            <div class="ca-grid">
                <!-- CAPTEURS -->
                <div class="ca-card capteur">
                    <span class="badge">👀 Capteurs</span>
                    <h3>Ils MESURENT</h3>
                    <div class="desc">📏 Ils donnent une <strong>VALEUR</strong> (ex : 25°C, 40 cm…)</div>
                    <ul>
                        <li>🌡️ <strong>Température</strong> → Thermostat</li>
                        <li>☀️ <strong>Photorésistance</strong> → Lampadaire auto</li>
                        <li>📏 <strong>Ultrason</strong> → Radar de recul</li>
                        <li>🎮 <strong>Potentiomètre</strong> → Manette de jeu</li>
                    </ul>
                </div>

                <!-- DÉTECTEURS -->
                <div class="ca-card detecteur">
                    <span class="badge">🚨 Détecteurs</span>
                    <h3>Ils REPÈRENT</h3>
                    <div class="desc">✅ Ils donnent juste <strong>OUI</strong> ou <strong>NON</strong> (1 ou 0)</div>
                    <ul>
                        <li>👋 <strong>Infrarouge</strong> → Alarme</li>
                        <li>🚪 <strong>Fin de course</strong> → Portail</li>
                        <li>🔥 <strong>Flamme</strong> → Sécurité incendie</li>
                        <li>🔔 <strong>Interrupteur</strong> → Sonnette</li>
                    </ul>
                </div>

                <!-- ACTIONNEURS -->
                <div class="ca-card actionneur">
                    <span class="badge">💪 Actionneurs</span>
                    <h3>Ils AGISSENT</h3>
                    <div class="desc">🦾 Ils transforment l'énergie en <strong>ACTION</strong></div>
                    <ul>
                        <li>🔄 <strong>Moteur</strong> → Ventilateur</li>
                        <li>🦾 <strong>Servomoteur</strong> → Bras robot</li>
                        <li>🚪 <strong>Vérin</strong> → Porte de bus</li>
                        <li>🔊 <strong>Buzzer</strong> → Alarme</li>
                        <li>💡 <strong>DEL</strong> → Voyant</li>
                        <li>⚡ <strong>Relais</strong> → Lampe 230V</li>
                    </ul>
                </div>

                <!-- INTERFACES -->
                <div class="ca-card interface">
                    <span class="badge">🧠 Interfaces</span>
                    <h3>Elles RÉFLÉCHISSENT</h3>
                    <div class="desc">🎛️ Le <strong>CERVEAU</strong> : lit les capteurs, commande les actionneurs</div>
                    <ul>
                        <li>🟦 <strong>Arduino</strong> → Robots</li>
                        <li>🟩 <strong>Micro:bit</strong> → Collège</li>
                        <li>🍓 <strong>Raspberry Pi</strong> → Projets costauds</li>
                        <li>🏭 <strong>Automate (API)</strong> → Usines</li>
                        <li>📶 <strong>Bluetooth/Wi-Fi</strong> → Télécommande</li>
                    </ul>
                </div>
            </div>

            <!-- PIÈGE -->
            <section class="ca-piege">
                <h2>⚡ Le Piège à Éviter</h2>
                <div class="ca-piege-grid">
                    <div class="ca-piege-box cap">
                        <h4>👀 CAPTEUR</h4>
                        <p class="big">« COMBIEN ? »</p>
                        <p>Ex : <strong>22°C</strong></p>
                        <p>Valeur continue</p>
                    </div>
                    <div class="ca-piege-box det">
                        <h4>🚨 DÉTECTEUR</h4>
                        <p class="big">« OUI ou NON ? »</p>
                        <p>Ex : <strong>« il y a quelqu'un ! »</strong></p>
                        <p>Signal 0 ou 1</p>
                    </div>
                </div>
            </section>

            <!-- EXEMPLE -->
            <section class="ca-exemple">
                <h2>🚪 Exemple Concret — Le Portail Automatique</h2>
                <div class="ca-exemple-step">
                    <div class="icon">👋</div>
                    <div class="text"><strong>Détecteur de mouvement</strong> → 🚨 « Une voiture arrive ! »</div>
                </div>
                <div class="ca-exemple-step">
                    <div class="icon">🧠</div>
                    <div class="text"><strong>Carte programmable</strong> → 🤔 « J'ouvre le portail ? OUI »</div>
                </div>
                <div class="ca-exemple-step">
                    <div class="icon">⚙️</div>
                    <div class="text"><strong>Moteur</strong> → 💪 « Je fais glisser le portail ! »</div>
                </div>
            </section>

            <!-- QUIZ -->
            <section class="ca-quiz-section">
                <h2>✏️ À Toi de Jouer !</h2>
                <div id="caQuizContainer"></div>
                <div class="ca-quiz-result" id="caQuizResult"></div>
                <div style="text-align: center; margin-top: 15px;" id="caRetryContainer"></div>
            </section>

            <!-- MÉMO -->
            <section class="ca-memo">
                <div class="ca-memo-card c1">
                    <span class="big-emoji">👀</span>
                    <div class="title">CAPTEUR</div>
                    <div class="verb">Il MESURE</div>
                </div>
                <div class="ca-memo-card c2">
                    <span class="big-emoji">🚨</span>
                    <div class="title">DÉTECTEUR</div>
                    <div class="verb">Il DÉTECTE</div>
                </div>
                <div class="ca-memo-card c3">
                    <span class="big-emoji">💪</span>
                    <div class="title">ACTIONNEUR</div>
                    <div class="verb">Il AGIT</div>
                </div>
                <div class="ca-memo-card c4">
                    <span class="big-emoji">🧠</span>
                    <div class="title">INTERFACE</div>
                    <div class="verb">Elle DÉCIDE</div>
                </div>
            </section>

            <!-- FOOTER -->
            <footer class="ca-footer">
                <div class="final">🌟 👀 Informent — 🧠 Décident — 💪 Agissent 🌟</div>
            </footer>
        </div>
    `;

    initCapteursActionneursQuiz();
}

function initCapteursActionneursQuiz() {
    const container = document.getElementById('caQuizContainer');
    const resultDiv = document.getElementById('caQuizResult');
    const retryContainer = document.getElementById('caRetryContainer');
    if (!container) return;

    container.innerHTML = '';
    resultDiv.innerHTML = '';
    retryContainer.innerHTML = '';

    caScore = 0;
    caAnswered = 0;
    caState = new Array(CAPTEURS_ACTIONNEURS_QUIZ_DATA.length).fill(null);

    CAPTEURS_ACTIONNEURS_QUIZ_DATA.forEach((q, i) => {
        const row = document.createElement('div');
        row.className = 'ca-quiz-item';

        const label = document.createElement('span');
        label.innerHTML = `<strong>${i+1}.</strong> ${escapeHTML(q.item)}`;
        row.appendChild(label);

        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '6px';
        btnGroup.style.flexWrap = 'wrap';

        CAPTEURS_ACTIONNEURS_CATEGORIES.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat.label;
            btn.onclick = () => handleCaQuizAnswer(i, cat.key, btnGroup);
            btnGroup.appendChild(btn);
        });

        row.appendChild(btnGroup);
        container.appendChild(row);
    });
}

function handleCaQuizAnswer(itemIndex, chosenCat, btnGroup) {
    if (caState[itemIndex] !== null) return;

    caState[itemIndex] = chosenCat;
    caAnswered++;

    const q = CAPTEURS_ACTIONNEURS_QUIZ_DATA[itemIndex];
    const buttons = [...btnGroup.children];

    buttons.forEach(b => {
        b.disabled = true;
    });

    if (chosenCat === q.answer) {
        caScore++;
        const targetBtn = buttons.find(b => b.textContent === CAPTEURS_ACTIONNEURS_CATEGORIES.find(c => c.key === chosenCat).label);
        if (targetBtn) targetBtn.classList.add('ca-correct');
    } else {
        const targetBtn = buttons.find(b => b.textContent === CAPTEURS_ACTIONNEURS_CATEGORIES.find(c => c.key === chosenCat).label);
        if (targetBtn) targetBtn.classList.add('ca-wrong');

        const correctBtn = buttons.find(b => b.textContent === CAPTEURS_ACTIONNEURS_CATEGORIES.find(c => c.key === q.answer).label);
        if (correctBtn) correctBtn.classList.add('ca-correct');
    }

    if (caAnswered === CAPTEURS_ACTIONNEURS_QUIZ_DATA.length) {
        showCaQuizResult();
    }
}

function showCaQuizResult() {
    const resultDiv = document.getElementById('caQuizResult');
    const retryContainer = document.getElementById('caRetryContainer');
    if (!resultDiv) return;

    const total = CAPTEURS_ACTIONNEURS_QUIZ_DATA.length;
    let msg = `🎯 Score : <strong>${caScore} / ${total}</strong> — `;

    if (caScore === total) msg += "🏆 PARFAIT !";
    else if (caScore >= 6) msg += "🌟 Très bien !";
    else if (caScore >= 4) msg += "👍 Pas mal, continue !";
    else msg += "💪 Retente, tu vas y arriver !";

    resultDiv.innerHTML = msg;

    if (retryContainer) {
        retryContainer.innerHTML = `
            <button onclick="initCapteursActionneursQuiz()" style="background: linear-gradient(135deg, var(--turquoise), var(--primary)); color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: var(--shadow-md); transition: transform 0.2s;">
                🔄 Recommencer le questionnaire
            </button>
        `;
    }
}
