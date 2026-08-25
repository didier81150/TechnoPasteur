// =====================================================
// MODULE RAPPORT DE STAGE (DOCUMENTS, DÉPÔT & EVALUATION)
// =====================================================

const STAGE_DOCUMENTS = [
    {
        titre: "Consignes & Guide du Rapport de Stage",
        description: "Document d'instructions et méthodologie pour rédiger votre rapport.",
        icon: "📘",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
        titre: "Modèle / Trame de Rapport (PDF)",
        description: "Trame officielle à suivre pour la structure des parties.",
        icon: "📄",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
        titre: "Grille d'Évaluation de la Soutenance & du Rapport",
        description: "Critères de notation appliqués par l'équipe pédagogique.",
        icon: "📊",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    }
];

// Données des élèves par classe (fallback si non connecté)
const STAGE_STUDENTS_DATA = {
    "302": ["AMRI Younes","ANAASSOUME Wessal","BEAUCERF Aaron","BEN KALLAL Lina","BONAFOUS--DUBREUIL Lylou","BRUSTET-DUCREUX Sasha","DECAIX Clara","EDDAHBI Karim","FABRIES Malicia","GENCE Atilio","GONCALVES Maély","GUFFROY Thomas","HAMI Salma","HURCET Kais","KAOUANE Samir","KHÉLAÏFIA Oumrane","LE BECACHEL Louane","MAHDAOUI Camilia","MAURIES Charlotte","MAYMOUN YAKOUB Ismail","PEREIRA-AMO Fabio","ROBERT Kenzo","TABOUCHE BENMOKKADEM Idriss"],
    "303": ["ALEGRE Anaelle","BUSSARD Amaëlys","CAPILLION Leeloo","CARDONA Tom","CORDEIRO Hugo","DA CUNHA Angelo","DAOUDI Lina","DEHU Milo","DRIS Jounaïdi","EL FAKIR Camélia","FAURE Lola","LEMIRRE-JOSSET William","LIGNEUL Damien","MAJDOUBI Wassil","MANSOURI Syrine","NESPOULOUS Izia","PAQUENTIN Davy","PLANCHENAULT FELLER Heather","RAMOS Julia","RICARDO Maéva","TALBOT Apreel","TEFFAHI Hinde","ZAYAN Mohamed"],
    "304": ["BLASCO-STEVANOVIC Nolan","BONNOT SPENLE Owen","BOUQUIN Noah","BOUSSEDRA Naim","CHAFAI Salim","CRUZ-SOUET Tao","DUBAC Kelian","EL HALFAOUI Kamélia","HENNON Oscar","IDIRI Yaëlle","JULIEN-CALVET Aude","KERARMI Shayma","KHELLAFI--KAMRAOUI Sohane","KHITER Tesnime","MESSOUDI KIKI Wassima","MONNIER-BENETEAU DE LAPRAIRIE Lylia","MULLER Ines","PLAIRE Emrys","RIBEIRO Elsa","ROMIEU Neïla","ROQUES Kewanee","SERY Loanne","TOUSET Ilena","ZAOUBAI Hamza"],
    "305": ["AZEROUAL Mouna","BAISSE Charlotte","BARITAUD Alycia","BATEHO Elikia Nolan","BAYOL Rhaiss","BRISEPIERRE-RODRIGUEZ Loucas","CAUHEPE Thyméo","CHASSAGNAT Luca","DROCOURT Lena","ENJALBERT Chloé","ENJALBERT Emma","ETTANICH BAUDRUN Lila","FEDOU Rachelle","GOGUERY Roxane","LAMRABTI Sidi-Brahim","MARECHAL Abraham","PAULIN Loréna","PAUTHE Lucie","POUGET LORETO Kalliste","RAMIER Emmie","RIOU Djavan","THEMINES Maëva","THEVENIN Aaron","VINCENT Mickaël"],
    "306": ["ABEJEAN Ethan","AROUROU Dora","BAHMAD SOUIRI Hafssa","BATIGNE Leona","BENMANSOUR Fares","BIRBES Mathias","CHERKAOUI Marwane","DE BAERDEMACKER VIDAL Yhan","DEGREMONT Esteban","GIENDAJ-LARROCHE Lohan","HERAL Yael","JOFFRE Jade","MAGRON Juliette","METAHRI Rida","NEANI Sana","ORFAO Cassandra","OUNIR BADDOU Maryam","OUSIDI Aymann","PAULIN Auriane","PETIT HOUGUENADE Sean","REMAUD Loénie","SALEM Maxime","VIGUIER Léna"],
    "307": ["ABDAOUI Abdelmoughith","AFKIR Amine","AMPONSAH Emmanuel","AZOUGAGH Saoussen","AZRAGUE Manal","BELLIERES Cassandra","CHANCELLE Enzo","CNUDDE LECLER Cerise","DANDINE Maxime","FERREIRA Dynis","KESSEIRI Fatma","LOPEZ Lucie","LOPEZ Raphaël","MANSOURI Rehanna","MARCUS Diego","MASSON Eunice","MAZANIELLO Nino","PAU Louise","PEREZ-MICOULAS Alyzée","RODRIGUES VALERIO Alyssia","SALVAN Quentin","TORRES JARIA Leonor","VIVES Chloé"]
};

const STAGE_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyK-jpEmdTMKGDvBq5yrtU606qXe7tU2mScvbSB41ElXxn1MVg99DPg_4eniFa-p9cVGg/exec';

function openStageModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

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

                <!-- ONGLET 3 : SAISIE DES NOTES -->
                <div id="stage-tab-saisie" class="stage-tab-panel">
                    <h3 class="stage-card-title">Enregistrer une note</h3>

                    <div id="stage-prof-lock-msg" style="display:${typeof isProfLoggedIn !== 'undefined' && isProfLoggedIn ? 'none' : 'block'}; text-align:center; padding:2rem; background:var(--bg-main); border-radius:10px;">
                        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔒</div>
                        <h4 style="margin-bottom:0.5rem;">Réservé aux enseignants</h4>
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.2rem;">
                            Seuls les enseignants connectés peuvent saisir et modifier les notes des devoirs de stage.
                        </p>
                        <button onclick="openProfModal()" class="btn-primary" style="background:var(--accent); color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
                            🔐 Se connecter comme enseignant
                        </button>
                    </div>

                    <div id="stage-prof-form-container" style="display:${typeof isProfLoggedIn !== 'undefined' && isProfLoggedIn ? 'block' : 'none'};">
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
                                    <option value="">— Choisir un élève —</option>
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
                    <h3 class="stage-card-title">Notes enregistrées</h3>

                    <div id="stage-prof-view-lock-msg" style="display:${typeof isProfLoggedIn !== 'undefined' && isProfLoggedIn ? 'none' : 'block'}; text-align:center; padding:2rem; background:var(--bg-main); border-radius:10px;">
                        <div style="font-size:2.5rem; margin-bottom:0.5rem;">🔒</div>
                        <h4 style="margin-bottom:0.5rem;">Réservé aux enseignants</h4>
                        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.2rem;">
                            La consultation des notes de stage enregistrées est réservée aux enseignants.
                        </p>
                        <button onclick="openProfModal()" class="btn-primary" style="background:var(--accent); color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
                            🔐 Se connecter comme enseignant
                        </button>
                    </div>

                    <div id="stage-prof-view-container" style="display:${typeof isProfLoggedIn !== 'undefined' && isProfLoggedIn ? 'block' : 'none'};">
                        <div class="view-controls" style="display:flex; gap:0.75rem; margin-bottom:1.5rem; flex-wrap:wrap;">
                            <select id="stageViewClasse" onchange="onStageViewClasseChange()" style="flex:1; min-width:140px;">
                                <option value="">— Toutes les classes —</option>
                            </select>
                            <select id="stageViewEleve" disabled onchange="loadStageNotes()" style="flex:1; min-width:140px;">
                                <option value="">— Tous les élèves —</option>
                            </select>
                            <button class="btn-load" id="stageLoadBtn" onclick="loadStageNotes()" style="padding:0.7rem 1.2rem; background:var(--accent); color:white; border:none; border-radius:8px; font-weight:600; cursor:pointer;">
                                Charger
                            </button>
                        </div>

                        <div id="stage-stats-bar" class="stats-bar" style="display:none; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-count" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" style="font-size:0.75rem; color:var(--text-muted);">Notes</div>
                            </div>
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-avg" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" style="font-size:0.75rem; color:var(--text-muted);">Moyenne</div>
                            </div>
                            <div class="stat-card" style="background:var(--bg-main); border-radius:8px; padding:0.75rem; text-align:center;">
                                <div class="stat-value" id="stage-stat-max" style="font-weight:bold; font-size:1.4rem;">—</div>
                                <div class="stat-label" style="font-size:0.75rem; color:var(--text-muted);">Max</div>
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
}

// ── Initialisation des listes déroulantes (Saisie et Visualisation) ──
function initStageSelects() {
    const stageClasse = document.getElementById('stageClasse');
    const stageViewClasse = document.getElementById('stageViewClasse');

    if (!stageClasse || !stageViewClasse) return;

    const classesList = Object.keys(STAGE_STUDENTS_DATA);

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

    if (classeSelect.value && STAGE_STUDENTS_DATA[classeSelect.value]) {
        STAGE_STUDENTS_DATA[classeSelect.value].forEach(e => {
            const o = document.createElement('option');
            o.value = e; o.textContent = e;
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

    if (viewClasse.value && STAGE_STUDENTS_DATA[viewClasse.value]) {
        STAGE_STUDENTS_DATA[viewClasse.value].forEach(e => {
            const o = document.createElement('option');
            o.value = e; o.textContent = e;
            viewEleve.appendChild(o);
        });
        viewEleve.disabled = false;
    } else {
        viewEleve.disabled = true;
    }

    // Charger automatiquement les notes dès que la classe est sélectionnée
    loadStageNotes();
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
        alert("Veuillez sélectionner un fichier PDF à déposer.");
        return;
    }

    const file = input.files[0];
    if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert("⚠️ Le fichier doit impérativement être au format PDF.");
        return;
    }

    // Nom de fichier attendu : nom-prenom-classe.pdf
    let expectedFilename = "";
    if (currentStudent) {
        const cleanNom = sanitizeString(currentStudent.nom);
        const cleanPrenom = sanitizeString(currentStudent.prenom);
        const cleanClasse = sanitizeString(currentStudent.classe);
        expectedFilename = `${cleanNom}-${cleanPrenom}-${cleanClasse}.pdf`;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "⏳ Conversion & Envoi sur Google Drive...";
    msgDiv.style.display = 'none';

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64Data = evt.target.result.split(',')[1];
        const payload = {
            action: 'upload_pdf',
            filename: file.name,
            expectedFilename: expectedFilename,
            nom: currentStudent ? currentStudent.nom : '',
            prenom: currentStudent ? currentStudent.prenom : '',
            classe: currentStudent ? currentStudent.classe : '',
            fileData: base64Data
        };

        fetch(STAGE_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            msgDiv.style.display = 'block';
            msgDiv.style.background = '#ecfdf5';
            msgDiv.style.color = '#065f46';
            msgDiv.style.border = '1px solid #a7f3d0';
            msgDiv.innerHTML = `✅ Le rapport PDF <strong>${file.name}</strong> a été transmis vers votre Google Drive avec succès !`;
            input.value = '';
        })
        .catch(err => {
            msgDiv.style.display = 'block';
            msgDiv.style.background = '#fef2f2';
            msgDiv.style.color = '#7f1d1d';
            msgDiv.style.border = '1px solid #fca5a5';
            msgDiv.textContent = '❌ Erreur lors de l\'envoi vers Google Drive.';
        })
        .finally(() => {
            btnSubmit.disabled = false;
            btnSubmit.textContent = "🚀 Soumettre le Rapport PDF";
        });
    };

    reader.readAsDataURL(file);
}

// ── Submission de la Note ──
function handleStageNoteSubmit(e) {
    e.preventDefault();
    const classeSelect = document.getElementById('stageClasse');
    const eleveSelect = document.getElementById('stageEleve');
    const noteInput = document.getElementById('stageNote');
    const submitBtn = document.getElementById('stageSubmitBtn');
    const msgDiv = document.getElementById('stageMessage');

    const data = {
        classe: classeSelect.value,
        eleve: eleveSelect.value,
        note: noteInput.value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi…";
    msgDiv.style.display = 'none';

    fetch(STAGE_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(() => {
        msgDiv.style.display = 'block';
        msgDiv.style.background = '#ecfdf5';
        msgDiv.style.color = '#065f46';
        msgDiv.style.border = '1px solid #a7f3d0';
        msgDiv.textContent = 'Note enregistrée pour ' + data.eleve + ' ✓';
        noteInput.value = '';
    })
    .catch(() => {
        msgDiv.style.display = 'block';
        msgDiv.style.background = '#fef2f2';
        msgDiv.style.color = '#7f1d1d';
        msgDiv.style.border = '1px solid #fca5a5';
        msgDiv.textContent = 'Erreur lors de l\'enregistrement.';
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enregistrer la note';
    });
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

    let url = STAGE_WEB_APP_URL + '?action=get';
    if (classeVal) url += '&classe=' + encodeURIComponent(classeVal);
    if (eleveVal) url += '&eleve=' + encodeURIComponent(eleveVal);

    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const json = await resp.json();
        renderStageNotes(json);
    } catch (err) {
        container.innerHTML = `
            <div class="state-placeholder" style="text-align:center; padding:2.5rem 1rem; color:var(--text-muted);">
                <div class="icon" style="font-size:2rem; margin-bottom:0.5rem;">⚠️</div>
                Impossible de charger les notes.<br>
                <small style="color:var(--text-muted); margin-top:0.4rem; display:block;">Vérifiez que votre Apps Script expose un doGet() et retourne du JSON.</small>
            </div>`;
    } finally {
        loadBtn.disabled = false;
        loadBtn.textContent = 'Charger';
    }
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

        document.getElementById('stage-stat-count').textContent = notes.length;
        document.getElementById('stage-stat-avg').textContent = avg.toFixed(2).replace('.', ',');
        document.getElementById('stage-stat-max').textContent = max.toFixed(2).replace('.', ',');
        document.getElementById('stage-stat-avg').style.color = avg >= 14 ? '#28a745' : avg >= 10 ? '#ffc107' : '#dc3545';
        statsBar.style.display = 'grid';
    }

    let rows = data.map(r => {
        const v = parseFloat(r.note);
        const cls = v >= 14 ? 'badge-qcm' : v >= 10 ? 'badge-pdf' : 'badge-video';
        return `
            <tr>
                <td>${r.classe || '—'}</td>
                <td>${r.eleve || '—'}</td>
                <td><span class="activity-badge-type ${cls}">${v.toFixed(2).replace('.', ',')} / 20</span></td>
            </tr>`;
    }).join('');

    container.innerHTML = `
        <div style="overflow-x:auto;">
            <table class="results-table" style="width:100%;">
                <thead>
                    <tr>
                        <th>Classe</th>
                        <th>Élève</th>
                        <th>Note</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>`;
}
