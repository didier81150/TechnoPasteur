// =====================================================
// MODULE RAPPORT DE STAGE (DOCUMENTS, DÉPÔT & EVALUATION)
// =====================================================

const STAGE_DOCUMENTS = [
    {
        titre: "Guide du Rapport de Stage",
        description: "Document de guide et consignes pour la rédaction du rapport.",
        icon: "📘",
        url: "https://drive.google.com/file/d/1ItkAteHLzEMvh2UURx7Cw4FcYikHhkag/view?usp=drive_link"
    },
    {
        titre: "Fiche Tuteur",
        description: "Fiche d'évaluation à faire remplir par le tuteur de stage.",
        icon: "📋",
        url: "https://drive.google.com/file/d/16hnDVjqgxuN_z1M5jb645bv6K76sLMeC/view?usp=drive_link"
    },
    {
        titre: "Organisation et dates",
        description: "Calendrier et dates de restitution du rapport de stage.",
        icon: "📅",
        url: "https://drive.google.com/file/d/1K0gM5uCMnWDEsnAFRVsOF5VbmUGS0v63/view?usp=drive_link"
    },
    {
        titre: "Barème Rapport de Stage",
        description: "Grille de critères et barème officiel de notation.",
        icon: "📊",
        url: "https://drive.google.com/file/d/1K0gM5uCMnWDEsnAFRVsOF5VbmUGS0v63/view?usp=drive_link"
    }
];

// Variables globales du module stage
let enseignantsList = [];
let currentTeacher = null;
let stageElevesMap = {}; // Classe -> [{nom, prenom, fullText}]

// Données de secours des enseignants si réseau indisponible
const DEMO_ENSEIGNANTS = [
    { nom: "BOIVIN", prenom: "DIDIER", motDePasse: "DB" },
    { nom: "MONASSON", prenom: "SYLVIE", motDePasse: "MS" }
];

// Données des élèves par classe (fallback si non connecté ou sheet distant non chargé)
const STAGE_STUDENTS_DATA = {
    "302": ["AMRI Younes","ANAASSOUME Wessal","BEAUCERF Aaron","BEN KALLAL Lina","BONAFOUS--DUBREUIL Lylou","BRUSTET-DUCREUX Sasha","DECAIX Clara","EDDAHBI Karim","FABRIES Malicia","GENCE Atilio","GONCALVES Maély","GUFFROY Thomas","HAMI Salma","HURCET Kais","KAOUANE Samir","KHÉLAÏFIA Oumrane","LE BECACHEL Louane","MAHDAOUI Camilia","MAURIES Charlotte","MAYMOUN YAKOUB Ismail","PEREIRA-AMO Fabio","ROBERT Kenzo","TABOUCHE BENMOKKADEM Idriss"],
    "303": ["ALEGRE Anaelle","BUSSARD Amaëlys","CAPILLION Leeloo","CARDONA Tom","CORDEIRO Hugo","DA CUNHA Angelo","DAOUDI Lina","DEHU Milo","DRIS Jounaïdi","EL FAKIR Camélia","FAURE Lola","LEMIRRE-JOSSET William","LIGNEUL Damien","MAJDOUBI Wassil","MANSOURI Syrine","NESPOULOUS Izia","PAQUENTIN Davy","PLANCHENAULT FELLER Heather","RAMOS Julia","RICARDO Maéva","TALBOT Apreel","TEFFAHI Hinde","ZAYAN Mohamed"],
    "304": ["BLASCO-STEVANOVIC Nolan","BONNOT SPENLE Owen","BOUQUIN Noah","BOUSSEDRA Naim","CHAFAI Salim","CRUZ-SOUET Tao","DUBAC Kelian","EL HALFAOUI Kamélia","HENNON Oscar","IDIRI Yaëlle","JULIEN-CALVET Aude","KERARMI Shayma","KHELLAFI--KAMRAOUI Sohane","KHITER Tesnime","MESSOUDI KIKI Wassima","MONNIER-BENETEAU DE LAPRAIRIE Lylia","MULLER Ines","PLAIRE Emrys","RIBEIRO Elsa","ROMIEU Neïla","ROQUES Kewanee","SERY Loanne","TOUSET Ilena","ZAOUBAI Hamza"],
    "305": ["AZEROUAL Mouna","BAISSE Charlotte","BARITAUD Alycia","BATEHO Elikia Nolan","BAYOL Rhaiss","BRISEPIERRE-RODRIGUEZ Loucas","CAUHEPE Thyméo","CHASSAGNAT Luca","DROCOURT Lena","ENJALBERT Chloé","ENJALBERT Emma","ETTANICH BAUDRUN Lila","FEDOU Rachelle","GOGUERY Roxane","LAMRABTI Sidi-Brahim","MARECHAL Abraham","PAULIN Loréna","PAUTHE Lucie","POUGET LORETO Kalliste","RAMIER Emmie","RIOU Djavan","THEMINES Maëva","THEVENIN Aaron","VINCENT Mickaël"],
    "306": ["ABEJEAN Ethan","AROUROU Dora","BAHMAD SOUIRI Hafssa","BATIGNE Leona","BENMANSOUR Fares","BIRBES Mathias","CHERKAOUI Marwane","DE BAERDEMACKER VIDAL Yhan","DEGREMONT Esteban","GIENDAJ-LARROCHE Lohan","HERAL Yael","JOFFRE Jade","MAGRON Juliette","METAHRI Rida","NEANI Sana","ORFAO Cassandra","OUNIR BADDOU Maryam","OUSIDI Aymann","PAULIN Auriane","PETIT HOUGUENADE Sean","REMAUD Loénie","SALEM Maxime","VIGUIER Léna"],
    "307": ["ABDAOUI Abdelmoughith","AFKIR Amine","AMPONSAH Emmanuel","AZOUGAGH Saoussen","AZRAGUE Manal","BELLIERES Cassandra","CHANCELLE Enzo","CNUDDE LECLER Cerise","DANDINE Maxime","FERREIRA Dynis","KESSEIRI Fatma","LOPEZ Lucie","LOPEZ Raphaël","MANSOURI Rehanna","MARCUS Diego","MASSON Eunice","MAZANIELLO Nino","PAU Louise","PEREZ-MICOULAS Alyzée","RODRIGUES VALERIO Alyssia","SALVAN Quentin","TORRES JARIA Leonor","VIVES Chloé"]
};

// Chargement de l'annuaire des enseignants depuis Google Sheet
async function loadEnseignants() {
    try {
        if (!CONFIG.ENSEIGNANTS_CSV_URL) throw new Error("URL annuaire enseignants non configurée.");
        const response = await fetch(CONFIG.ENSEIGNANTS_CSV_URL);
        if (!response.ok) throw new Error("HTTP " + response.status);
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(l => l.trim() !== '');
        if (lines.length < 2) throw new Error("Fichier enseignants vide");

        const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const nomIndex = headers.findIndex(h => h.includes('nom') && !h.includes('prenom'));
        const prenomIndex = headers.findIndex(h => h.includes('prenom') || h.includes('prénom'));
        const pwdIndex = headers.findIndex(h => h.includes('pass') || h.includes('code') || h.includes('mdp') || h.includes('mot'));

        enseignantsList = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
            if (values[nomIndex]) {
                enseignantsList.push({
                    nom: values[nomIndex],
                    prenom: prenomIndex !== -1 ? values[prenomIndex] : '',
                    motDePasse: pwdIndex !== -1 ? values[pwdIndex] : 'prof2024'
                });
            }
        }
        DEMO_ENSEIGNANTS.forEach(de => {
            if (!enseignantsList.some(e => e.nom.toUpperCase() === de.nom.toUpperCase())) {
                enseignantsList.push(de);
            }
        });
        console.log(`✅ ${enseignantsList.length} enseignants chargés.`);
    } catch (err) {
        console.warn("⚠️ Utilisation de la liste enseignants démo de secours :", err);
        enseignantsList = DEMO_ENSEIGNANTS;
    }
}

// Chargement des élèves 3ème depuis Google Sheet
async function loadStageEleves() {
    try {
        if (!CONFIG.STAGE_ELEVES_CSV_URL) throw new Error("URL élèves 3ème non configurée.");
        const response = await fetch(CONFIG.STAGE_ELEVES_CSV_URL);
        if (!response.ok) throw new Error("HTTP " + response.status);
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(l => l.trim() !== '');
        if (lines.length < 2) throw new Error("Fichier élèves vide");

        const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const nomIndex = headers.findIndex(h => h === 'nom' || h.includes('nom'));
        const prenomIndex = headers.findIndex(h => h.includes('prenom') || h.includes('prénom'));
        const classeIndex = headers.findIndex(h => h.includes('classe'));

        stageElevesMap = {};
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
            if (values[nomIndex] && values[prenomIndex]) {
                const classeVal = values[classeIndex] || '3ème';
                if (!stageElevesMap[classeVal]) {
                    stageElevesMap[classeVal] = [];
                }
                stageElevesMap[classeVal].push({
                    nom: values[nomIndex],
                    prenom: values[prenomIndex],
                    fullText: `${values[nomIndex]} ${values[prenomIndex]}`
                });
            }
        }
        console.log(`✅ ${Object.keys(stageElevesMap).length} classes chargées pour le rapport de stage.`);
    } catch (err) {
        console.warn("⚠️ Utilisation de la liste d'élèves de secours pour le stage :", err);
        stageElevesMap = {};
        Object.keys(STAGE_STUDENTS_DATA).forEach(c => {
            stageElevesMap[c] = STAGE_STUDENTS_DATA[c].map(fullname => {
                const parts = fullname.split(' ');
                return {
                    nom: parts[0] || fullname,
                    prenom: parts.slice(1).join(' ') || '',
                    fullText: fullname
                };
            });
        });
    }
}

async function openStageModuleDirect() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboardScreen) dashboardScreen.style.display = 'none';

    await openStageModule({ id: '3_rapport_stage' });

    // Passer directement à l'onglet de saisie des notes
    const tabBtns = document.querySelectorAll('.stage-tab-btn');
    if (tabBtns && tabBtns[2]) {
        switchStageTab('saisie', tabBtns[2]);
    }
}

async function openStageModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    // S'assurer que les enseignants et la liste des élèves sont chargés
    if (enseignantsList.length === 0) await loadEnseignants();
    if (Object.keys(stageElevesMap).length === 0) await loadStageEleves();

    container.innerHTML = `
        <div class="stage-container">
            <div class="stage-header">
                <div class="stage-header-title">
                    <span class="stage-icon">📝</span>
                    <div>
                        <h2>Rapport de Stage</h2>
                        <p class="stage-subtitle">Collège Louis Pasteur — Graulhet | Niveau 3ème</p>
                    </div>
                </div>
            </div>

            <!-- Onglets d'activité -->
            <div class="stage-tabs">
                <button class="stage-tab-btn active" onclick="switchStageTab('docs', this)">
                    📂 Documents Élèves
                </button>
                <button class="stage-tab-btn" onclick="switchStageTab('depot', this)">
                    📤 Dépôt du Rapport (PDF)
                </button>
                <button class="stage-tab-btn" onclick="switchStageTab('saisie', this)">
                    ✏️ Saisie des Notes
                </button>
                <button class="stage-tab-btn" onclick="switchStageTab('visualisation', this)">
                    📊 Visualiser les Notes
                </button>
            </div>

            <div class="stage-card">
                <!-- ONGLET 1 : DOCUMENTS ÉLÈVES -->
                <div id="stage-tab-docs" class="stage-tab-panel active">
                    <h3 class="stage-card-title">📁 Documents et ressources à télécharger</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">
                        Retrouvez ci-dessous l'ensemble des documents de cadrage nécessaires pour rédiger votre rapport de stage et préparer votre soutenance.
                    </p>

                    <div class="stage-docs-grid">
                        ${STAGE_DOCUMENTS.map(doc => `
                            <div class="stage-doc-card">
                                <div class="stage-doc-icon">${doc.icon}</div>
                                <div class="stage-doc-info">
                                    <h4>${doc.titre}</h4>
                                    <p>${doc.description}</p>
                                </div>
                                <a href="${doc.url}" target="_blank" download class="btn-download-doc">
                                    ⬇️ Télécharger
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- ONGLET 2 : DÉPÔT DU RAPPORT PDF -->
                <div id="stage-tab-depot" class="stage-tab-panel">
                    <h3 class="stage-card-title">📤 Dépôt de votre Rapport de Stage</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">
                        Veuillez sélectionner votre fichier PDF. Le nom du fichier doit impérativement suivre la nomenclature : <strong style="color: var(--primary);">nom-prenom-classe.pdf</strong> (ex : <code>dupont-lucas-302.pdf</code>).
                    </p>

                    <form id="depotForm" onsubmit="handleDepotSubmit(event)">
                        <div class="form-group">
                            <label for="depotEleve">Élève :</label>
                            <input type="text" id="depotEleve" readonly style="background: var(--bg-main); font-weight:600;">
                        </div>

                        <div class="form-group">
                            <label for="depotFile">Fichier PDF du rapport :</label>
                            <input type="file" id="depotFile" accept=".pdf,application/pdf" required onchange="validatePdfUpload(this)">
                            <small id="depotFileHelp" style="display:block; margin-top:0.4rem; color:var(--text-muted);">Format accepté : PDF uniquement. Nom attendu : <span id="expectedFilename">nom-prenom-classe.pdf</span></small>
                        </div>

                        <button type="submit" class="btn-primary" id="btnDepotSubmit" style="background: var(--accent); color: white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; width:100%;">
                            🚀 Soumettre le Rapport PDF
                        </button>
                    </form>
                    <div id="depotMessage" class="message" style="display:none; margin-top:1rem; padding:0.8rem; border-radius:8px;"></div>
                </div>

                <!-- FORMULAIRE DE CONNEXION ENSEIGNANT (REQUIS POUR LA SAISIE ET CONSULTATION) -->
                <div id="teacherAuthBlock" style="padding: 1.5rem; background: var(--bg-main); border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; display: none;">
                    <h3 style="margin-bottom:0.5rem; color:var(--text-color);">🔒 Accès réservé aux Enseignants</h3>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">
                        Veuillez vous identifier pour saisir ou consulter les notes du rapport de stage.
                    </p>
                    <form onsubmit="handleTeacherLogin(event)">
                        <div class="form-group">
                            <label for="selectTeacherNom">Nom de l'enseignant :</label>
                            <select id="selectTeacherNom" required onchange="onTeacherNomChange()">
                                <option value="">-- Choisir votre nom --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="selectTeacherPrenom">Prénom :</label>
                            <select id="selectTeacherPrenom" required disabled>
                                <option value="">-- Sélectionnez d'abord votre nom --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="teacherPassword">Mot de passe enseignant :</label>
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="password" id="teacherPassword" placeholder="Entrez votre mot de passe" required style="width: 100%; padding-right: 40px;">
                                <button type="button" onclick="togglePasswordVisibility('teacherPassword', this)" style="position: absolute; right: 8px; background: none; border: none; cursor: pointer; font-size: 1.2rem;" title="Afficher/Masquer le mot de passe">👁️</button>
                            </div>
                        </div>
                        <div id="teacherAuthError" class="message" style="display:none; color:#dc3545; background:#f8d7da; padding:0.6rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem;"></div>
                        <button type="submit" class="btn-primary" style="background:var(--accent); color:white; border:none; padding:10px 18px; border-radius:8px; font-weight:600; cursor:pointer; width:100%;">
                            🔓 S'identifier
                        </button>
                    </form>
                </div>

                <div id="teacherStatusBanner" style="display:none; align-items:center; justify-content:space-between; background:#e0f2fe; color:#0369a1; padding:0.75rem 1rem; border-radius:8px; margin-bottom:1.5rem; border:1px solid #bae6fd;">
                    <span>👨‍🏫 Enseignant connecté : <strong id="teacherDisplayName"></strong></span>
                    <button onclick="logoutTeacher()" style="background:none; border:none; color:#0284c7; cursor:pointer; font-weight:600; text-decoration:underline;">Se déconnecter</button>
                </div>

                <!-- ONGLET 3 : SAISIE DES NOTES -->
                <div id="stage-tab-saisie" class="stage-tab-panel">
                    <div id="saisieMainContent">
                        <h3 class="stage-card-title">Enregistrer une note</h3>

                        <!-- Rappel note sur 20 -->
                        <div style="background:#fffbe6; color:#856404; border:1px solid #ffeba1; padding:0.8rem 1rem; border-radius:8px; margin-bottom:1.2rem; font-weight:600; display:flex; align-items:center; gap:0.5rem;">
                            <span>⚠️</span> <span>Rappel : La note doit impérativement être saisie sur 20 (ex: 15.5).</span>
                        </div>

                        <form id="stageNoteForm" onsubmit="handleStageNoteSubmit(event)">
                            <div class="form-group">
                                <label for="stageClasse">Classe</label>
                                <select id="stageClasse" required onchange="onStageClasseChange()">
                                    <option value="">— Choisir une classe —</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="stageEleve">Élève</label>
                                <select id="stageEleve" required disabled>
                                    <option value="">— Choisir d'abord une classe —</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="stageNote">Note sur 20</label>
                                <input type="number" id="stageNote" min="0" max="20" step="0.25" placeholder="Ex : 15.5" required>
                            </div>

                            <button type="submit" class="btn-primary" id="stageSubmitBtn" style="background: var(--accent); color: white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; width:100%;">
                                Enregistrer la note
                            </button>
                        </form>

                        <div id="stageMessage" class="message" style="display:none; margin-top:1rem; padding:0.8rem; border-radius:8px;"></div>
                    </div>
                </div>

                <!-- ONGLET 4 : VISUALISATION DES NOTES -->
                <div id="stage-tab-visualisation" class="stage-tab-panel">
                    <div id="visualisationMainContent">
                        <h3 class="stage-card-title">Notes enregistrées</h3>

                        <div class="view-controls" style="display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap;">
                            <select id="stageViewClasse" onchange="onStageViewClasseChange()" style="flex:1; min-width:140px;">
                                <option value="">— Toutes les classes —</option>
                            </select>
                            <select id="stageViewEleve" disabled style="flex:1; min-width:140px;">
                                <option value="">— Tous les élèves —</option>
                            </select>
                            <button class="btn-load" id="stageLoadBtn" onclick="loadStageNotes()" style="padding:0.7rem 1.2rem; background:var(--accent); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
                                Charger
                            </button>
                        </div>

                        <div id="stage-stats-bar" class="stats-bar" style="display:none; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-count" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" style="font-size:0.75rem; color:var(--text-muted);">Élèves notés</div>
                            </div>
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-avg" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" id="stage-stat-avg-label" style="font-size:0.75rem; color:var(--text-muted);">Moyenne de la classe</div>
                            </div>
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-max" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" style="font-size:0.75rem; color:var(--text-muted);">Meilleure note</div>
                            </div>
                        </div>

                        <div id="stage-notes-container">
                            <div class="state-placeholder" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
                                <div class="icon" style="font-size:2rem; margin-bottom:0.5rem;">🔍</div>
                                Sélectionnez une classe et cliquez sur <strong>Charger</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    initStageSelects();
    prefillStudentData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchStageTab(name, btn) {
    document.querySelectorAll('.stage-tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.stage-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('stage-tab-' + name).classList.add('active');
    btn.classList.add('active');

    // Pour les onglets Saisie et Visualisation, vérifier l'authentification Enseignant
    if (name === 'saisie' || name === 'visualisation') {
        updateTeacherAuthUI();
    } else {
        const authBlock = document.getElementById('teacherAuthBlock');
        const banner = document.getElementById('teacherStatusBanner');
        if (authBlock) authBlock.style.display = 'none';
        if (banner && !currentTeacher) banner.style.display = 'none';
    }
}

function updateTeacherAuthUI() {
    const authBlock = document.getElementById('teacherAuthBlock');
    const banner = document.getElementById('teacherStatusBanner');
    const saisieContent = document.getElementById('saisieMainContent');
    const visuContent = document.getElementById('visualisationMainContent');

    if (!authBlock) return;

    if (!currentTeacher) {
        authBlock.style.display = 'block';
        if (banner) banner.style.display = 'none';
        if (saisieContent) saisieContent.style.display = 'none';
        if (visuContent) visuContent.style.display = 'none';
        fillTeacherNomSelect();
    } else {
        authBlock.style.display = 'none';
        if (banner) {
            banner.style.display = 'flex';
            document.getElementById('teacherDisplayName').textContent = `${currentTeacher.nom} ${currentTeacher.prenom}`;
        }
        if (saisieContent) saisieContent.style.display = 'block';
        if (visuContent) visuContent.style.display = 'block';
    }
}

function fillTeacherNomSelect() {
    const selectNom = document.getElementById('selectTeacherNom');
    if (!selectNom) return;

    selectNom.innerHTML = '<option value="">-- Choisir votre nom --</option>';
    const noms = [...new Set(enseignantsList.map(e => e.nom))].sort();
    noms.forEach(nom => {
        const opt = document.createElement('option');
        opt.value = nom;
        opt.textContent = nom;
        selectNom.appendChild(opt);
    });
}

function onTeacherNomChange() {
    const nom = document.getElementById('selectTeacherNom').value;
    const selectPrenom = document.getElementById('selectTeacherPrenom');
    if (!selectPrenom) return;

    selectPrenom.innerHTML = '<option value="">-- Sélectionnez d\'abord votre nom --</option>';

    if (!nom) {
        selectPrenom.disabled = true;
        return;
    }

    const prenoms = [...new Set(enseignantsList.filter(e => e.nom === nom).map(e => e.prenom))].sort();
    selectPrenom.innerHTML = '<option value="">-- Choisir votre prénom --</option>';
    prenoms.forEach(prenom => {
        const opt = document.createElement('option');
        opt.value = prenom;
        opt.textContent = prenom;
        selectPrenom.appendChild(opt);
    });
    selectPrenom.disabled = false;

    if (prenoms.length === 1) {
        selectPrenom.value = prenoms[0];
    }
}

function handleTeacherLogin(e) {
    if (e) e.preventDefault();
    const nom = document.getElementById('selectTeacherNom').value;
    const prenom = document.getElementById('selectTeacherPrenom').value;
    const pwd = document.getElementById('teacherPassword').value.trim();
    const errDiv = document.getElementById('teacherAuthError');

    errDiv.style.display = 'none';

    if (!nom || !pwd) {
        errDiv.textContent = '⚠️ Veuillez sélectionner votre nom et saisir le mot de passe.';
        errDiv.style.display = 'block';
        return;
    }

    const prof = enseignantsList.find(e => e.nom === nom && (!prenom || e.prenom === prenom));

    if (!prof) {
        errDiv.textContent = '❌ Enseignant introuvable dans l\'annuaire.';
        errDiv.style.display = 'block';
        return;
    }

    const inputPwdClean = pwd.toUpperCase().trim();
    const profPwdClean = (prof.motDePasse || '').toUpperCase().trim();

    if (profPwdClean && profPwdClean !== inputPwdClean && pwd !== CONFIG.PROF_PASSWORD) {
        errDiv.textContent = '❌ Mot de passe incorrect.';
        errDiv.style.display = 'block';
        return;
    }

    currentTeacher = prof;
    document.getElementById('teacherPassword').value = '';
    updateTeacherAuthUI();
}

function logoutTeacher() {
    currentTeacher = null;
    updateTeacherAuthUI();
}

// ── Initialisation des listes déroulantes (Saisie et Visualisation) ──
function initStageSelects() {
    const stageClasse = document.getElementById('stageClasse');
    const stageViewClasse = document.getElementById('stageViewClasse');

    if (!stageClasse || !stageViewClasse) return;

    stageClasse.innerHTML = '<option value="">— Choisir une classe —</option>';
    stageViewClasse.innerHTML = '<option value="">— Toutes les classes —</option>';

    const classesList = Object.keys(stageElevesMap).length > 0 ? Object.keys(stageElevesMap).sort() : Object.keys(STAGE_STUDENTS_DATA).sort();

    classesList.forEach(c => {
        const opt1 = document.createElement('option');
        opt1.value = c; opt1.textContent = 'Classe ' + c;
        stageClasse.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = c; opt2.textContent = 'Classe ' + c;
        stageViewClasse.appendChild(opt2);
    });
}

function prefillStudentData() {
    if (!currentStudent) {
        document.getElementById('depotEleve').value = "Élève non connecté (Mode libre)";
        document.getElementById('expectedFilename').textContent = "nom-prenom-classe.pdf";
        return;
    }

    // Format attendu du fichier: nom-prenom-classe.pdf (en minuscules sans caractères spéciaux complexes)
    const cleanNom = sanitizeString(currentStudent.nom);
    const cleanPrenom = sanitizeString(currentStudent.prenom);
    const cleanClasse = sanitizeString(currentStudent.classe);
    const expectedName = `${cleanNom}-${cleanPrenom}-${cleanClasse}.pdf`;

    document.getElementById('depotEleve').value = `${currentStudent.nom} ${currentStudent.prenom} (${currentStudent.classe})`;
    document.getElementById('expectedFilename').textContent = expectedName;

    // Pré-sélection automatique dans Saisie & Visualisation
    // Extraire le numéro de classe si forme '3ème A' -> '302' ou chercher correspondance
    const classeMatch = findMatchingClasseKey(currentStudent.classe);
    if (classeMatch) {
        const stageClasse = document.getElementById('stageClasse');
        stageClasse.value = classeMatch;
        onStageClasseChange();

        const stageEleve = document.getElementById('stageEleve');
        // Trouver l'élève dans la liste
        for (let i = 0; i < stageEleve.options.length; i++) {
            if (stageEleve.options[i].value.toLowerCase().includes(currentStudent.nom.toLowerCase())) {
                stageEleve.selectedIndex = i;
                break;
            }
        }

        const stageViewClasse = document.getElementById('stageViewClasse');
        stageViewClasse.value = classeMatch;
        onStageViewClasseChange();
        const stageViewEleve = document.getElementById('stageViewEleve');
        for (let i = 0; i < stageViewEleve.options.length; i++) {
            if (stageViewEleve.options[i].value.toLowerCase().includes(currentStudent.nom.toLowerCase())) {
                stageViewEleve.selectedIndex = i;
                break;
            }
        }
    }
}

function findMatchingClasseKey(studentClasse) {
    if (!studentClasse) return Object.keys(STAGE_STUDENTS_DATA)[0];
    const digits = studentClasse.replace(/\D/g, '');
    if (STAGE_STUDENTS_DATA[digits]) return digits;
    return Object.keys(STAGE_STUDENTS_DATA)[0];
}

function sanitizeString(str) {
    return str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") : "";
}

function onStageClasseChange() {
    const classeSelect = document.getElementById('stageClasse');
    const eleveSelect = document.getElementById('stageEleve');
    eleveSelect.innerHTML = '<option value="">— Choisir un élève —</option>';

    const classeVal = classeSelect.value;
    if (classeVal && stageElevesMap[classeVal]) {
        stageElevesMap[classeVal].forEach(e => {
            const o = document.createElement('option');
            o.value = JSON.stringify({ nom: e.nom, prenom: e.prenom });
            o.textContent = `${e.nom} ${e.prenom}`;
            eleveSelect.appendChild(o);
        });
        eleveSelect.disabled = false;
    } else {
        eleveSelect.disabled = true;
    }
}

function onStageViewClasseChange() {
    const viewClasse = document.getElementById('stageViewClasse');
    const viewEleve = document.getElementById('stageViewEleve');
    viewEleve.innerHTML = '<option value="">— Tous les élèves —</option>';

    const classeVal = viewClasse.value;
    if (classeVal && stageElevesMap[classeVal]) {
        stageElevesMap[classeVal].forEach(e => {
            const o = document.createElement('option');
            o.value = `${e.nom} ${e.prenom}`;
            o.textContent = `${e.nom} ${e.prenom}`;
            viewEleve.appendChild(o);
        });
        viewEleve.disabled = false;
    } else {
        viewEleve.disabled = true;
    }
}

// ── Validation et Dépôt PDF ──
function validatePdfUpload(input) {
    const msgDiv = document.getElementById('depotMessage');
    msgDiv.style.display = 'none';

    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert("⚠️ Seuls les fichiers au format PDF sont autorisés.");
        input.value = '';
        return;
    }

    if (currentStudent) {
        const cleanNom = sanitizeString(currentStudent.nom);
        const cleanPrenom = sanitizeString(currentStudent.prenom);
        const cleanClasse = sanitizeString(currentStudent.classe);
        const expectedName = `${cleanNom}-${cleanPrenom}-${cleanClasse}.pdf`;
        const fileNameSanitized = sanitizeString(file.name.replace(/\.pdf$/i, '')) + '.pdf';

        if (fileNameSanitized !== expectedName) {
            msgDiv.style.display = 'block';
            msgDiv.style.background = 'var(--warning-bg, #fffbe6)';
            msgDiv.style.color = 'var(--warning-text, #856404)';
            msgDiv.style.border = '1px solid #ffeba1';
            msgDiv.innerHTML = `⚠️ Attention : Nom de fichier suggéré : <strong>${expectedName}</strong> (Fichier actuel : <code>${file.name}</code>)`;
        }
    }
}

function handleDepotSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('depotFile');
    const msgDiv = document.getElementById('depotMessage');
    const btnSubmit = document.getElementById('btnDepotSubmit');

    if (!input.files || !input.files[0]) {
        alert("Veuillez sélectionner un fichier à déposer.");
        return;
    }

    const file = input.files[0];
    btnSubmit.disabled = true;
    btnSubmit.textContent = "⏳ Transmission du rapport...";
    msgDiv.style.display = 'none';

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Data = event.target.result.split(',')[1];
        const studentInfo = currentStudent ? {
            nom: currentStudent.nom,
            prenom: currentStudent.prenom,
            classe: currentStudent.classe
        } : { nom: "ANONYME", prenom: "", classe: "3ème" };

        const payload = {
            action: "upload_stage_report",
            fileName: file.name,
            fileType: file.type,
            fileData: base64Data,
            student: studentInfo
        };

        const webAppUrl = CONFIG.STAGE_WEB_APP_URL;

        if (!webAppUrl || webAppUrl === 'COLLER_ICI_URL_APPS_SCRIPT_DEPLOYE') {
            showDepotError(msgDiv, "L'URL de l'application Web Google Apps Script n'est pas configurée dans `js/config.js`.");
            btnSubmit.disabled = false;
            btnSubmit.textContent = "🚀 Soumettre le Rapport PDF";
            return;
        }

        // Utilisation de Content-Type text/plain pour éviter les requêtes OPTIONS preflight bloquées par Apps Script
        fetch(webAppUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        })
        .then(async response => {
            let resultJson = null;
            try {
                resultJson = await response.json();
            } catch (e) {
                // Si la réponse n'est pas du JSON valide
            }

            if (response.ok && (!resultJson || resultJson.status === 'success')) {
                showDepotSuccess(msgDiv, file.name);
                input.value = '';
            } else {
                const errorMsg = (resultJson && resultJson.message) ? resultJson.message : `Erreur serveur (code HTTP ${response.status})`;
                showDepotError(msgDiv, errorMsg);
            }
        })
        .catch(err => {
            console.error("Erreur d'envoi du rapport:", err);
            showDepotError(msgDiv, "Erreur de connexion lors de la transmission du rapport vers Google Drive. Vérifiez votre connexion internet ou le déploiement de l'application Web Google.");
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "🚀 Soumettre le Rapport PDF";
        });
    };
    reader.onerror = function() {
        showDepotError(msgDiv, "Erreur lors de la lecture du fichier local.");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "🚀 Soumettre le Rapport PDF";
    };
    reader.readAsDataURL(file);
}

function showDepotSuccess(msgDiv, fileName) {
    msgDiv.style.display = 'block';
    msgDiv.style.background = '#ecfdf5';
    msgDiv.style.color = '#065f46';
    msgDiv.style.border = '1px solid #a7f3d0';
    msgDiv.innerHTML = `✅ Le rapport <strong>${fileName}</strong> a été transmis et déposé directement dans le dossier "Dépôt rapport de stage" du Google Drive de votre professeur !`;
}

function showDepotError(msgDiv, errorDetails) {
    msgDiv.style.display = 'block';
    msgDiv.style.background = '#f8d7da';
    msgDiv.style.color = '#721c24';
    msgDiv.style.border = '1px solid #f5c6cb';
    msgDiv.innerHTML = `❌ <strong>Erreur de dépôt du rapport :</strong> Le fichier n'a pas pu être sauvegardé sur le Google Drive.<br><small style="margin-top:0.4rem; display:block;">Détail : ${errorDetails}</small>`;
}

// ── Submission de la Note ──
function handleStageNoteSubmit(e) {
    e.preventDefault();
    const classeSelect = document.getElementById('stageClasse');
    const eleveSelect = document.getElementById('stageEleve');
    const noteInput = document.getElementById('stageNote');
    const submitBtn = document.getElementById('stageSubmitBtn');
    const msgDiv = document.getElementById('stageMessage');

    const classeVal = classeSelect.value;
    if (!classeVal || !eleveSelect.value) {
        alert("Veuillez choisir une classe et un élève.");
        return;
    }

    let eleveObj = { nom: '', prenom: '' };
    try {
        eleveObj = JSON.parse(eleveSelect.value);
    } catch (err) {
        eleveObj = { nom: eleveSelect.value, prenom: '' };
    }

    const noteVal = parseFloat(noteInput.value);
    if (isNaN(noteVal) || noteVal < 0 || noteVal > 20) {
        alert("⚠️ La note doit être comprise entre 0 et 20.");
        return;
    }

    const todayStr = new Date().toLocaleDateString('fr-FR');
    const payload = {
        nom: eleveObj.nom,
        prenom: eleveObj.prenom,
        note: noteVal,
        date: todayStr,
        classe: classeVal
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi…";
    msgDiv.style.display = 'none';

    // Sauvegarde en stockage local
    saveStageNoteLocal(payload);

    const webAppUrl = CONFIG.STAGE_WEB_APP_URL || (typeof STAGE_WEB_APP_URL !== 'undefined' ? STAGE_WEB_APP_URL : '');

    if (webAppUrl) {
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            showNoteSuccess(msgDiv, eleveObj, noteVal);
            noteInput.value = '';
        })
        .catch(err => {
            console.warn("Erreur envoi Apps Script, note enregistrée localement :", err);
            showNoteSuccess(msgDiv, eleveObj, noteVal);
            noteInput.value = '';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enregistrer la note';
        });
    } else {
        showNoteSuccess(msgDiv, eleveObj, noteVal);
        noteInput.value = '';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enregistrer la note';
    }
}

function showNoteSuccess(msgDiv, eleveObj, noteVal) {
    msgDiv.style.display = 'block';
    msgDiv.style.background = '#ecfdf5';
    msgDiv.style.color = '#065f46';
    msgDiv.style.border = '1px solid #a7f3d0';
    msgDiv.innerHTML = `✅ Note de <strong>${noteVal}/20</strong> enregistrée pour <strong>${eleveObj.nom} ${eleveObj.prenom}</strong> le ${new Date().toLocaleDateString('fr-FR')} !`;
}

function saveStageNoteLocal(noteObj) {
    try {
        const stored = JSON.parse(localStorage.getItem('stage_notes_local')) || [];
        // Remplacer si existe déjà ou ajouter
        const idx = stored.findIndex(n => n.nom === noteObj.nom && n.prenom === noteObj.prenom && n.classe === noteObj.classe);
        if (idx !== -1) {
            stored[idx] = noteObj;
        } else {
            stored.push(noteObj);
        }
        localStorage.setItem('stage_notes_local', JSON.stringify(stored));
    } catch (e) {
        console.error("Erreur sauvegarde locale note", e);
    }
}

function getStageNotesLocal() {
    try {
        return JSON.parse(localStorage.getItem('stage_notes_local')) || [];
    } catch (e) {
        return [];
    }
}

// ── Chargement des Notes ──
async function loadStageNotes() {
    const loadBtn = document.getElementById('stageLoadBtn');
    const container = document.getElementById('stage-notes-container');
    const statsBar = document.getElementById('stage-stats-bar');
    const viewClasse = document.getElementById('stageViewClasse');
    const viewEleve = document.getElementById('stageViewEleve');

    const classeVal = viewClasse.value;
    const eleveVal = viewEleve.value;

    loadBtn.disabled = true;
    loadBtn.textContent = "Chargement…";
    container.innerHTML = '<div class="state-placeholder" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);"><div class="icon" style="font-size:2rem; margin-bottom:0.5rem;">⏳</div>Récupération des données…</div>';
    statsBar.style.display = 'none';

    let allNotes = [];

    // 1. Essayer de charger depuis le Google Sheet des Notes CSV
    try {
        if (CONFIG.STAGE_NOTES_CSV_URL) {
            const resp = await fetch(CONFIG.STAGE_NOTES_CSV_URL);
            if (resp.ok) {
                const csvText = await resp.text();
                const lines = csvText.split('\n').filter(l => l.trim() !== '');
                if (lines.length >= 2) {
                    const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
                    const nomIdx = headers.findIndex(h => h.includes('nom') && !h.includes('prenom'));
                    const prenomIdx = headers.findIndex(h => h.includes('prenom') || h.includes('prénom'));
                    const noteIdx = headers.findIndex(h => h.includes('note'));
                    const dateIdx = headers.findIndex(h => h.includes('date'));

                    for (let i = 1; i < lines.length; i++) {
                        const vals = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
                        if (vals[nomIdx] && vals[noteIdx]) {
                            allNotes.push({
                                nom: vals[nomIdx],
                                prenom: prenomIdx !== -1 ? vals[prenomIdx] : '',
                                note: vals[noteIdx],
                                date: dateIdx !== -1 ? vals[dateIdx] : '',
                                classe: ''
                            });
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.warn("Impossible de lire le CSV distant des notes :", err);
    }

    // 2. Fusionner avec le stockage local
    const localNotes = getStageNotesLocal();
    localNotes.forEach(ln => {
        const idx = allNotes.findIndex(n => n.nom.toLowerCase() === ln.nom.toLowerCase() && n.prenom.toLowerCase() === ln.prenom.toLowerCase());
        if (idx !== -1) {
            allNotes[idx] = ln;
        } else {
            allNotes.push(ln);
        }
    });

    // 3. Filtrer par classe / élève si sélectionné
    let filtered = allNotes;
    if (classeVal) {
        const studentListForClasse = stageElevesMap[classeVal] || [];
        filtered = filtered.filter(n => {
            if (n.classe && n.classe === classeVal) return true;
            return studentListForClasse.some(s => s.nom.toLowerCase() === n.nom.toLowerCase() && s.prenom.toLowerCase() === n.prenom.toLowerCase());
        });
    }

    if (eleveVal) {
        filtered = filtered.filter(n => `${n.nom} ${n.prenom}`.toLowerCase().includes(eleveVal.toLowerCase()));
    }

    renderStageNotes(filtered);
    loadBtn.disabled = false;
    loadBtn.textContent = 'Charger';
}

function renderStageNotes(data) {
    const container = document.getElementById('stage-notes-container');
    const statsBar = document.getElementById('stage-stats-bar');

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<div class="state-placeholder" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);"><div class="icon" style="font-size:2rem; margin-bottom:0.5rem;">📭</div>Aucune note trouvée pour cette sélection.</div>';
        statsBar.style.display = 'none';
        return;
    }

    const notes = data.map(r => parseFloat(r.note)).filter(n => !isNaN(n));
    if (notes.length > 0) {
        const avg = notes.reduce((a, b) => a + b, 0) / notes.length;
        const max = Math.max(...notes);

        const viewClasse = document.getElementById('stageViewClasse');
        const classeVal = viewClasse ? viewClasse.value : '';
        const avgLabel = document.getElementById('stage-stat-avg-label');
        if (avgLabel) {
            avgLabel.textContent = classeVal ? `Moyenne classe ${classeVal}` : 'Moyenne globale';
        }

        document.getElementById('stage-stat-count').textContent = notes.length;
        document.getElementById('stage-stat-avg').textContent = avg.toFixed(2).replace('.', ',') + ' / 20';
        document.getElementById('stage-stat-max').textContent = max.toFixed(2).replace('.', ',') + ' / 20';
        document.getElementById('stage-stat-avg').style.color = avg >= 14 ? '#28a745' : avg >= 10 ? '#ffc107' : '#dc3545';
        statsBar.style.display = 'grid';
    }

    let rows = data.map(r => {
        const v = parseFloat(r.note);
        const cls = v >= 14 ? 'badge-qcm' : v >= 10 ? 'badge-pdf' : 'badge-video';
        return `
            <tr>
                <td><strong>${r.nom || '—'}</strong></td>
                <td>${r.prenom || '—'}</td>
                <td><span class="activity-badge-type ${cls}">${v.toFixed(2).replace('.', ',')} / 20</span></td>
                <td>${r.date || '—'}</td>
            </tr>`;
    }).join('');

    container.innerHTML = `
        <div style="overflow-x:auto;">
            <table class="results-table" style="width:100%;">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Note sur 20</th>
                        <th>Date de saisie</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}
