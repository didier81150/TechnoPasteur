// =====================================================
// GESTION DE L'ANNUAIRE ÉLÈVES ET CONNEXION
// =====================================================

let annuaireEleves = [];
let currentStudent = null;

// Charge l'annuaire depuis les Google Sheets pour tous les niveaux (avec secours démo en cas de problème réseau)
async function loadAnnuaire() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Chargement de l'annuaire...";
    }

    const urls = CONFIG.ANNUAIRE_CSV_URLS || { '4eme': CONFIG.ANNUAIRE_CSV_URL };
    let loadedStudents = [];

    for (const [defaultNiveau, url] of Object.entries(urls)) {
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const csvData = await response.text();

            // Remplacement des sauts de ligne Windows \r\n et \r
            const cleanCsv = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
            const lines = cleanCsv.split('\n').filter(l => l.trim() !== '');
            if (lines.length < 2) continue;

            const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));

            const nomIndex = headers.findIndex(h => h === 'nom');
            const prenomIndex = headers.findIndex(h => h === 'prénom' || h === 'prenom');
            const classeIndex = headers.findIndex(h => h === 'classe');
            const pwdIndex = headers.findIndex(h => h === 'mot_de_passe' || h === 'mot de passe' || h === 'code_secret' || h === 'password');
            const ppaIndex = headers.findIndex(h => h === 'ppa');

            if (nomIndex === -1 || prenomIndex === -1 || classeIndex === -1 || pwdIndex === -1) {
                console.warn(`Colonnes introuvables pour la feuille ${defaultNiveau}`);
                continue;
            }

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
                if (values[nomIndex]) {
                    const classeVal = values[classeIndex] || '';
                    let niveauVal = defaultNiveau;
                    if (classeVal.startsWith('5') || classeVal.includes('5è')) niveauVal = '5eme';
                    else if (classeVal.startsWith('3') || classeVal.includes('3è')) niveauVal = '3eme';
                    else if (classeVal.startsWith('4') || classeVal.includes('4è')) niveauVal = '4eme';

                    loadedStudents.push({
                        nom: values[nomIndex].toUpperCase(),
                        prenom: values[prenomIndex],
                        classe: classeVal,
                        niveau: niveauVal,
                        motDePasse: values[pwdIndex],
                        ppa: ppaIndex !== -1 ? ['oui', 'true', '1', 'o'].includes((values[ppaIndex] || '').toLowerCase()) : false
                    });
                }
            }
        } catch (err) {
            console.warn(`⚠️ Erreur de chargement pour le niveau ${defaultNiveau}:`, err);
        }
    }

    if (loadedStudents.length > 0) {
        annuaireEleves = loadedStudents;
        console.log(`✅ ${annuaireEleves.length} élèves chargés depuis les annuaires (5ème, 4ème, 3ème)`);
    } else {
        console.warn("⚠️ Utilisation de l'annuaire démo de secours");
        loadDemoAnnuaire();
    }

    fillNomSelect();
    if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Se connecter';
    }
}

function loadDemoAnnuaire() {
    annuaireEleves = [
        { nom: "DUPONT", prenom: "Lucas", classe: "4ème A", niveau: "4eme", motDePasse: "1234", ppa: false },
        { nom: "MARTIN", prenom: "Emma", classe: "4ème B", niveau: "4eme", motDePasse: "1234", ppa: true },
        { nom: "BERNARD", prenom: "Léo", classe: "5ème A", niveau: "5eme", motDePasse: "1234", ppa: false },
        { nom: "PETIT", prenom: "Chloé", classe: "3ème A", niveau: "3eme", motDePasse: "1234", ppa: false }
    ];
}

// Remplissage en cascade (Nom -> Prénom -> Classe)
function fillNomSelect() {
    const select = document.getElementById('selectNom');
    if (!select) return;
    select.innerHTML = '<option value="">-- Choisir votre nom --</option>';
    const noms = [...new Set(annuaireEleves.map(e => e.nom))].sort();
    noms.forEach(nom => {
        const option = document.createElement('option');
        option.value = nom;
        option.textContent = nom;
        select.appendChild(option);
    });
}

function onNomChange() {
    const nom = document.getElementById('selectNom').value;
    const selectPrenom = document.getElementById('selectPrenom');
    const selectClasse = document.getElementById('selectClasse');

    selectClasse.innerHTML = '<option value="">-- Sélectionnez d\'abord votre prénom --</option>';
    selectClasse.disabled = true;

    if (!nom) {
        selectPrenom.innerHTML = '<option value="">-- Sélectionnez d\'abord votre nom --</option>';
        selectPrenom.disabled = true;
        return;
    }

    const prenoms = [...new Set(annuaireEleves.filter(e => e.nom === nom).map(e => e.prenom))].sort();
    selectPrenom.innerHTML = '<option value="">-- Choisir votre prénom --</option>';
    prenoms.forEach(prenom => {
        const option = document.createElement('option');
        option.value = prenom;
        option.textContent = prenom;
        selectPrenom.appendChild(option);
    });
    selectPrenom.disabled = false;

    if (prenoms.length === 1) {
        selectPrenom.value = prenoms[0];
        onPrenomChange();
    }
}

function onPrenomChange() {
    const nom = document.getElementById('selectNom').value;
    const prenom = document.getElementById('selectPrenom').value;
    const selectClasse = document.getElementById('selectClasse');

    if (!prenom) {
        selectClasse.innerHTML = '<option value="">-- Sélectionnez d\'abord votre prénom --</option>';
        selectClasse.disabled = true;
        return;
    }

    const classes = [...new Set(annuaireEleves.filter(e => e.nom === nom && e.prenom === prenom).map(e => e.classe))].sort();
    selectClasse.innerHTML = '<option value="">-- Choisir votre classe --</option>';
    classes.forEach(classe => {
        const option = document.createElement('option');
        option.value = classe;
        option.textContent = classe;
        selectClasse.appendChild(option);
    });
    selectClasse.disabled = false;

    if (classes.length === 1) {
        selectClasse.value = classes[0];
    }
}

// Connexion de l'élève
function handleLogin(event) {
    if (event) event.preventDefault();

    const nom = document.getElementById('selectNom').value;
    const prenom = document.getElementById('selectPrenom').value;
    const classe = document.getElementById('selectClasse').value;
    const motDePasse = document.getElementById('codeSecret').value.trim();

    if (!nom || !prenom || !classe) {
        showLoginError('⚠️ Veuillez renseigner votre nom, prénom et classe.');
        return;
    }
    if (!motDePasse) {
        showLoginError('⚠️ Veuillez entrer le mot de passe donné par votre professeur.');
        return;
    }

    const eleve = annuaireEleves.find(e => e.nom === nom && e.prenom === prenom && e.classe === classe);

    if (!eleve) {
        showLoginError("❌ Élève introuvable dans l'annuaire.");
        return;
    }
    if (eleve.motDePasse !== motDePasse) {
        showLoginError('❌ Mot de passe incorrect. Veuillez réessayer.');
        return;
    }

    currentStudent = eleve;
    showDashboard(eleve.niveau);
}

function togglePasswordVisibility() {
    const pwdInput = document.getElementById('codeSecret');
    const toggleBtn = document.querySelector('.btn-toggle-pwd');
    if (!pwdInput) return;

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        if (toggleBtn) toggleBtn.textContent = '🙈';
    } else {
        pwdInput.type = 'password';
        if (toggleBtn) toggleBtn.textContent = '👁️';
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 4000);
}

function logout() {
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        if (typeof stopQuizTimer === 'function') stopQuizTimer();
        currentStudent = null;

        document.getElementById('dashboardScreen').style.display = 'none';
        document.getElementById('activityScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';

        document.getElementById('codeSecret').value = '';
        document.getElementById('selectNom').value = '';
        onNomChange();
    }
}
