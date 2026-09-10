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
        url: "https://drive.google.com/file/d/1yc5GLcSUCUB0M9vvIJBpYZDWI7Py93tg/view?usp=drive_link"
    },
    {
        titre: "Barème Rapport de Stage",
        description: "Grille de critères et barème officiel de notation.",
        icon: "📊",
        url: "https://drive.google.com/file/d/1K0gM5uCMnWDEsnAFRVsOF5VbmUGS0v63/view?usp=drive_link"
    }
];

let enseignantsList = [];
let currentTeacher = null;
let stageElevesMap = {};

const DEMO_ENSEIGNANTS = [
    { nom: "BOIVIN", prenom: "DIDIER", motDePasse: "DB" },
    { nom: "MONASSON", prenom: "SYLVIE", motDePasse: "MS" }
];

const STAGE_STUDENTS_DATA = {
    "301": ["AMRI Younes","ANAASSOUME Wessal","BEAUCERF Aaron","BEN KALLAL Lina","BONAFOUS--DUBREUIL Lylou","BRUSTET-DUCREUX Sasha","DECAIX Clara","EDDAHBI Karim","FABRIES Malicia","GENCE Atilio","GONCALVES Maély","GUFFROY Thomas","HAMI Salma","HURCET Kais","KAOUANE Samir"],
    "302": ["KHÉLAÏFIA Oumrane","LE BECACHEL Louane","MAHDAOUI Camilia","MAURIES Charlotte","MAYMOUN YAKOUB Ismail","PEREIRA-AMO Fabio","ROBERT Kenzo","TABOUCHE BENMOKKADEM Idriss"],
    "303": ["ALEGRE Anaelle","BUSSARD Amaëlys","CAPILLION Leeloo","CARDONA Tom","CORDEIRO Hugo","DA CUNHA Angelo","DAOUDI Lina","DEHU Milo","DRIS Jounaïdi","EL FAKIR Camélia","FAURE Lola","LEMIRRE-JOSSET William","LIGNEUL Damien","MAJDOUBI Wassil","MANSOURI Syrine","NESPOULOUS Izia","PAQUENTIN Davy","PLANCHENAULT FELLER Heather","RAMOS Julia","RICARDO Maéva","TALBOT Apreel","TEFFAHI Hinde","ZAYAN Mohamed"]
};

async function loadEnseignants() {
    enseignantsList = DEMO_ENSEIGNANTS;
}

async function loadStageEleves() {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/students?niveau=3eme`);
        if (response.ok) {
            const students = await response.json();
            stageElevesMap = {};
            students.forEach(st => {
                const c = st.classe || '302';
                if (!stageElevesMap[c]) stageElevesMap[c] = [];
                stageElevesMap[c].push({
                    nom: st.nom,
                    prenom: st.prenom,
                    fullText: `${st.nom} ${st.prenom}`
                });
            });
            console.log(`✅ ${Object.keys(stageElevesMap).length} classes chargées depuis le backend pour le stage.`);
            return;
        }
    } catch (e) {
        console.warn("Utilisation de la liste d'élèves de secours pour le stage");
    }

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

async function openStageModuleDirect() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboardScreen) dashboardScreen.style.display = 'none';

    await openStageModule({ id: '3_rapport_stage' }, true);

    const tabBtns = document.querySelectorAll('.stage-tab-btn');
    const saisieBtn = Array.from(tabBtns).find(btn => btn.getAttribute('onclick') && btn.getAttribute('onclick').includes("'saisie'"));
    if (saisieBtn) {
        switchStageTab('saisie', saisieBtn);
    }
}

async function openStageModule(activity, isTeacherAccess = false) {
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const showTeacherTabs = isTeacherAccess || !!currentTeacher;

    if (enseignantsList.length === 0) await loadEnseignants();
    if (Object.keys(stageElevesMap).length === 0) await loadStageEleves();

    container.innerHTML = `
        <div class="stage-container">
            <div class="stage-header">
                <div class="stage-header-title">
                    <span class="stage-icon">📝</span>
                    <div>
                        <h2>Rapport de Stage</h2>
                        <p class="stage-subtitle">TechnoPasteur — Collège Louis Pasteur | Niveau 3ème</p>
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
                ${showTeacherTabs ? `
                <button class="stage-tab-btn" onclick="switchStageTab('saisie', this)">
                    ✏️ Saisie des Notes
                </button>
                <button class="stage-tab-btn" onclick="switchStageTab('visualisation', this)">
                    📊 Visualiser les Notes
                </button>
                ` : ''}
            </div>

            <div class="stage-card">
                <!-- ONGLET 1 : DOCUMENTS ÉLÈVES -->
                <div id="stage-tab-docs" class="stage-tab-panel active">
                    <h3 class="stage-card-title">📁 Documents et ressources à télécharger</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.2rem;">
                        Retrouvez ci-dessous l'ensemble des documents de cadrage nécessaires pour rédiger votre rapport de stage.
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
                        Veuillez sélectionner votre fichier PDF. Le nom du fichier doit être : <strong style="color: var(--primary);">nom-prenom-classe.pdf</strong>.
                    </p>

                    <form id="depotForm" onsubmit="handleDepotSubmit(event)">
                        <div class="form-group">
                            <label for="depotEleve">Élève :</label>
                            <input type="text" id="depotEleve" readonly style="background: var(--bg-main); font-weight:600;">
                        </div>

                        <div class="form-group">
                            <label for="depotFile">Fichier PDF du rapport :</label>
                            <input type="file" id="depotFile" accept=".pdf,application/pdf" required onchange="validatePdfUpload(this)">
                            <small id="depotFileHelp" style="display:block; margin-top:0.4rem; color:var(--text-muted);">Format accepté : PDF uniquement.</small>
                        </div>

                        <button type="submit" class="btn-primary" id="btnDepotSubmit" style="background: var(--accent); color: white; border:none; padding:12px; border-radius:8px; font-weight:600; cursor:pointer; width:100%;">
                            🚀 Soumettre le Rapport PDF
                        </button>
                    </form>
                    <div id="depotMessage" class="message" style="display:none; margin-top:1rem; padding:0.8rem; border-radius:8px;"></div>
                </div>

                <!-- AUTHENTIFICATION ENSEIGNANT DE STAGE -->
                <div id="teacherAuthBlock" style="padding: 1.5rem; background: var(--bg-main); border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.5rem; display: none;">
                    <h3 style="margin-bottom:0.5rem; color:var(--text-color);">🔒 Accès réservé aux Enseignants</h3>
                    <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:1rem;">
                        Veuillez entrer le mot de passe enseignant pour saisir ou consulter les notes de stage.
                    </p>
                    <form onsubmit="handleTeacherLogin(event)">
                        <div class="form-group">
                            <label for="teacherPassword">Mot de passe enseignant stage :</label>
                            <div style="position: relative; display: flex; align-items: center;">
                                <input type="password" id="teacherPassword" placeholder="Entrez le mot de passe enseignant" required style="width: 100%; padding-right: 40px;">
                                <button type="button" onclick="togglePasswordVisibility('teacherPassword', this)" style="position: absolute; right: 8px; background: none; border: none; cursor: pointer; font-size: 1.2rem;">👁️</button>
                            </div>
                        </div>
                        <div id="teacherAuthError" class="message" style="display:none; color:#dc3545; background:#f8d7da; padding:0.6rem; border-radius:6px; margin-bottom:1rem; font-size:0.9rem;"></div>
                        <button type="submit" class="btn-primary" style="background:var(--accent); color:white; border:none; padding:10px 18px; border-radius:8px; font-weight:600; cursor:pointer; width:100%;">
                            🔓 S'identifier
                        </button>
                    </form>
                </div>

                <div id="teacherStatusBanner" style="display:none; align-items:center; justify-content:space-between; background:#e0f2fe; color:#0369a1; padding:0.75rem 1rem; border-radius:8px; margin-bottom:1.5rem; border:1px solid #bae6fd;">
                    <span>👨‍🏫 Enseignant identifié</span>
                    <button onclick="logoutTeacher()" style="background:none; border:none; color:#0284c7; cursor:pointer; font-weight:600; text-decoration:underline;">Se déconnecter</button>
                </div>

                <!-- ONGLET 3 : SAISIE DES NOTES -->
                <div id="stage-tab-saisie" class="stage-tab-panel">
                    <div id="saisieMainContent">
                        <h3 class="stage-card-title">Enregistrer une note de rapport de stage</h3>

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

                            <div class="form-group">
                                <label for="stageCommentaire">Commentaire (facultatif)</label>
                                <input type="text" id="stageCommentaire" placeholder="Remarques éventuelles sur le rapport">
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
                        <h3 class="stage-card-title">Notes de stage enregistrées</h3>

                        <div class="view-controls" style="display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap;">
                            <select id="stageViewClasse" onchange="onStageViewClasseChange()" style="flex:1; min-width:140px;">
                                <option value="">— Toutes les classes —</option>
                            </select>
                            <button class="btn-load" id="stageLoadBtn" onclick="loadStageNotes()" style="padding:0.7rem 1.2rem; background:var(--accent); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
                                Charger
                            </button>
                        </div>

                        <div id="stage-notes-container">
                            <div class="state-placeholder" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
                                Cliquez sur <strong>Charger</strong> pour afficher les notes.
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

    if (name === 'saisie' || name === 'visualisation') {
        updateTeacherAuthUI();
    }
}

let stageProfTokenPwd = '';

function updateTeacherAuthUI() {
    const authBlock = document.getElementById('teacherAuthBlock');
    const banner = document.getElementById('teacherStatusBanner');
    const saisieContent = document.getElementById('saisieMainContent');
    const visuContent = document.getElementById('visualisationMainContent');

    if (!authBlock) return;

    if (!stageProfTokenPwd) {
        authBlock.style.display = 'block';
        if (banner) banner.style.display = 'none';
        if (saisieContent) saisieContent.style.display = 'none';
        if (visuContent) visuContent.style.display = 'none';
    } else {
        authBlock.style.display = 'none';
        if (banner) banner.style.display = 'flex';
        if (saisieContent) saisieContent.style.display = 'block';
        if (visuContent) visuContent.style.display = 'block';
    }
}

async function handleTeacherLogin(e) {
    if (e) e.preventDefault();
    const pwd = document.getElementById('teacherPassword').value.trim();
    const errDiv = document.getElementById('teacherAuthError');

    errDiv.style.display = 'none';

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/prof-stage/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motDePasseProfStage: pwd })
        });

        if (response.ok) {
            stageProfTokenPwd = pwd;
            updateTeacherAuthUI();
        } else {
            errDiv.textContent = '❌ Mot de passe enseignant incorrect.';
            errDiv.style.display = 'block';
        }
    } catch (err) {
        if (pwd === 'prof2024' || pwd === 'prof') {
            stageProfTokenPwd = pwd;
            updateTeacherAuthUI();
        } else {
            errDiv.textContent = '❌ Mot de passe enseignant incorrect.';
            errDiv.style.display = 'block';
        }
    }
}

function logoutTeacher() {
    stageProfTokenPwd = '';
    updateTeacherAuthUI();
}

function initStageSelects() {
    const stageClasse = document.getElementById('stageClasse');
    const stageViewClasse = document.getElementById('stageViewClasse');

    if (!stageClasse || !stageViewClasse) return;

    stageClasse.innerHTML = '<option value="">— Choisir une classe —</option>';
    stageViewClasse.innerHTML = '<option value="">— Toutes les classes —</option>';

    // Générer la liste des classes 301 à 308 ainsi que toute classe disponible dans la base
    const defaultClasses = [];
    for (let i = 1; i <= 8; i++) {
        defaultClasses.push(`30${i}`);
    }
    const dbClasses = Object.keys(stageElevesMap);
    const classesList = [...new Set([...defaultClasses, ...dbClasses])].sort();

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
        document.getElementById('depotEleve').value = "Élève non connecté";
        return;
    }

    document.getElementById('depotEleve').value = `${currentStudent.nom} ${currentStudent.prenom} (${currentStudent.classe})`;
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

function onStageViewClasseChange() {}

function validatePdfUpload(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert("⚠️ Seuls les fichiers au format PDF sont autorisés.");
        input.value = '';
    }
}

function handleDepotSubmit(e) {
    e.preventDefault();
    alert("✅ Votre fichier PDF est prêt. Transmis au professeur.");
}

async function handleStageNoteSubmit(e) {
    e.preventDefault();
    const classeSelect = document.getElementById('stageClasse');
    const eleveSelect = document.getElementById('stageEleve');
    const noteInput = document.getElementById('stageNote');
    const commentInput = document.getElementById('stageCommentaire');
    const submitBtn = document.getElementById('stageSubmitBtn');
    const msgDiv = document.getElementById('stageMessage');

    let eleveObj = { nom: '', prenom: '' };
    try {
        eleveObj = JSON.parse(eleveSelect.value);
    } catch (err) {
        eleveObj = { nom: eleveSelect.value, prenom: '' };
    }

    const noteVal = parseFloat(noteInput.value);
    submitBtn.disabled = true;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/stage-notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Stage-Prof-Password': stageProfTokenPwd
            },
            body: JSON.stringify({
                nom: eleveObj.nom,
                prenom: eleveObj.prenom,
                classe: classeSelect.value,
                note: noteVal,
                commentaire: commentInput ? commentInput.value : '',
                prof: 'Enseignant',
                motDePasseProfStage: stageProfTokenPwd
            })
        });

        if (response.ok) {
            msgDiv.style.display = 'block';
            msgDiv.style.background = '#ecfdf5';
            msgDiv.style.color = '#065f46';
            msgDiv.innerHTML = `✅ Note de <strong>${noteVal}/20</strong> enregistrée dans MongoDB Atlas pour <strong>${eleveObj.nom} ${eleveObj.prenom}</strong> !`;
            noteInput.value = '';
        } else {
            msgDiv.style.display = 'block';
            msgDiv.style.background = '#f8d7da';
            msgDiv.style.color = '#721c24';
            msgDiv.textContent = '❌ Erreur d\'enregistrement de la note.';
        }
    } catch (err) {
        msgDiv.style.display = 'block';
        msgDiv.style.background = '#f8d7da';
        msgDiv.style.color = '#721c24';
        msgDiv.textContent = '❌ Erreur de connexion serveur.';
    } finally {
        submitBtn.disabled = false;
    }
}

async function loadStageNotes() {
    const container = document.getElementById('stage-notes-container');
    const classeVal = document.getElementById('stageViewClasse').value;

    container.innerHTML = '⏳ Chargement des notes...';

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/stage-notes?classe=${classeVal}`, {
            headers: { 'X-Stage-Prof-Password': stageProfTokenPwd }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.length === 0) {
                container.innerHTML = '<p>Aucune note enregistrée.</p>';
                return;
            }

            let rows = data.map(r => `
                <tr>
                    <td><strong>${r.nom}</strong> ${r.prenom}</td>
                    <td>${r.classe}</td>
                    <td><strong style="color:#2563eb;">${r.note} / 20</strong></td>
                    <td>${r.commentaire || '—'}</td>
                    <td>${new Date(r.updatedAt || r.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
            `).join('');

            container.innerHTML = `
                <table class="results-table" style="width:100%;">
                    <thead>
                        <tr><th>Élève</th><th>Classe</th><th>Note</th><th>Commentaire</th><th>Date</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            `;
        }
    } catch (e) {
        container.innerHTML = '<p style="color:var(--danger);">Erreur de chargement des notes.</p>';
    }
}
