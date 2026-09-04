// =====================================================
// GESTION DE L'ANNUAIRE ÉLÈVES ET CONNEXION
// =====================================================

let annuaireEleves = [];
let currentStudent = null;

// Bascule d'affichage du mot de passe
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (btn) btn.textContent = '🙈';
    } else {
        input.type = 'password';
        if (btn) btn.textContent = '👁️';
    }
}

// Charge l'annuaire depuis le Google Sheet (avec secours démo en cas de problème réseau)
async function loadAnnuaire() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Chargement de l'annuaire...";
    }

    annuaireEleves = [];

    const urls = CONFIG.ANNUAIRE_CSV_URLS || { '4eme': CONFIG.ANNUAIRE_CSV_URL };

    for (const [nivKey, url] of Object.entries(urls)) {
        try {
            const response = await fetch(url);
            if (!response.ok) continue;
            const csvData = await response.text();

            const lines = csvData.split('\n').filter(l => l.trim() !== '');
            if (lines.length < 2) continue;

            const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));

            const nomIndex = headers.findIndex(h => h === 'nom');
            const prenomIndex = headers.findIndex(h => h === 'prénom' || h === 'prenom');
            const classeIndex = headers.findIndex(h => h === 'classe');
            const pwdIndex = headers.findIndex(h => h === 'mot_de_passe' || h === 'mot de passe' || h === 'code_secret' || h === 'password' || h.includes('pass'));
            const ppaIndex = headers.findIndex(h => h === 'ppa' || h === 'pap');

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
                if (values[nomIndex]) {
                    const classeVal = values[classeIndex] || '';
                    let niveauVal = nivKey;
                    if (classeVal.includes('5')) niveauVal = '5eme';
                    else if (classeVal.includes('3')) niveauVal = '3eme';
                    else if (classeVal.includes('4')) niveauVal = '4eme';

                    const isPap = ppaIndex !== -1 ? ['o', 'oui', 'true', '1'].includes((values[ppaIndex] || '').toLowerCase()) : false;

                    annuaireEleves.push({
                        nom: values[nomIndex],
                        prenom: values[prenomIndex] || '',
                        classe: classeVal,
                        niveau: niveauVal,
                        motDePasse: pwdIndex !== -1 ? values[pwdIndex] : '1234',
                        ppa: isPap,
                        pap: isPap
                    });
                }
            }
        } catch (err) {
            console.warn(`Erreur chargement annuaire ${nivKey}:`, err);
        }
    }

    if (annuaireEleves.length === 0) {
        console.warn("⚠️ Utilisation de l'annuaire démo de secours:");
        loadDemoAnnuaire();
    } else {
        console.log(`✅ ${annuaireEleves.length} élèves chargés au total depuis les annuaires`);
    }

    if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Se connecter';
    }
}

function loadDemoAnnuaire() {
    annuaireEleves = [
        { nom: "DUPONT", prenom: "Lucas", classe: "4ème A", niveau: "4eme", motDePasse: "1234", ppa: false, pap: false },
        { nom: "MARTIN", prenom: "Emma", classe: "4ème B", niveau: "4eme", motDePasse: "1234", ppa: true, pap: true },
        { nom: "BERNARD", prenom: "Léo", classe: "5ème A", niveau: "5eme", motDePasse: "1234", ppa: false, pap: false },
        { nom: "PETIT", prenom: "Chloé", classe: "3ème A", niveau: "3eme", motDePasse: "1234", ppa: false, pap: false }
    ];
}

// Remplissage en cascade (Niveau -> Classe -> Élève)
function onNiveauChange() {
    const niveau = document.getElementById('selectNiveau').value;
    const selectClasse = document.getElementById('selectClasse');
    const selectEleve = document.getElementById('selectEleve');

    selectEleve.innerHTML = '<option value="">-- Sélectionnez d\'abord la classe --</option>';
    selectEleve.disabled = true;

    if (!niveau) {
        selectClasse.innerHTML = '<option value="">-- Sélectionnez d\'abord le niveau --</option>';
        selectClasse.disabled = true;
        return;
    }

    const classes = [...new Set(annuaireEleves.filter(e => e.niveau === niveau).map(e => e.classe))].sort();
    selectClasse.innerHTML = '<option value="">-- Choisir la classe --</option>';
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls;
        option.textContent = cls;
        selectClasse.appendChild(option);
    });
    selectClasse.disabled = false;
}

function onClasseChange() {
    const niveau = document.getElementById('selectNiveau').value;
    const classe = document.getElementById('selectClasse').value;
    const selectEleve = document.getElementById('selectEleve');

    if (!classe) {
        selectEleve.innerHTML = '<option value="">-- Sélectionnez d\'abord la classe --</option>';
        selectEleve.disabled = true;
        return;
    }

    const eleves = annuaireEleves.filter(e => e.niveau === niveau && e.classe === classe).sort((a, b) => a.nom.localeCompare(b.nom));
    selectEleve.innerHTML = '<option value="">-- Choisir votre nom & prénom --</option>';
    eleves.forEach(e => {
        const option = document.createElement('option');
        option.value = `${e.nom}___${e.prenom}`;
        option.textContent = `${e.nom} ${e.prenom}`;
        selectEleve.appendChild(option);
    });
    selectEleve.disabled = false;
}

// Connexion de l'élève
function handleLogin(event) {
    if (event) event.preventDefault();

    const niveau = document.getElementById('selectNiveau').value;
    const classe = document.getElementById('selectClasse').value;
    const eleveVal = document.getElementById('selectEleve').value;
    const motDePasse = document.getElementById('codeSecret').value.trim();

    if (!niveau || !classe || !eleveVal) {
        showLoginError('⚠️ Veuillez renseigner le niveau, la classe et votre nom.');
        return;
    }
    if (!motDePasse) {
        showLoginError('⚠️ Veuillez entrer le mot de passe donné par votre professeur.');
        return;
    }

    const [nom, prenom] = eleveVal.split('___');
    const eleve = annuaireEleves.find(e => e.niveau === niveau && e.classe === classe && e.nom === nom && e.prenom === prenom);

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
        if (document.getElementById('selectNiveau')) document.getElementById('selectNiveau').value = '';
        onNiveauChange();
    }
}
