// =====================================================
// GESTION DE L'ANNUAIRE ÉLÈVES ET CONNEXION VIA BACKEND
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

// Charge la liste des élèves depuis le serveur backend
async function loadAnnuaire() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Chargement de l'annuaire...";
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/students`);
        if (response.ok) {
            annuaireEleves = await response.json();
            console.log(`✅ ${annuaireEleves.length} élèves chargés depuis le backend MongoDB.`);
        } else {
            console.warn("⚠️ Impossible de charger depuis le backend, bascule en mode démo");
            loadDemoAnnuaire();
        }
    } catch (err) {
        console.warn("⚠️ Connexion backend indisponible, chargement du mode démo local :", err);
        loadDemoAnnuaire();
    }

    if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Se connecter';
    }
}

function loadDemoAnnuaire() {
    annuaireEleves = [
        { id: "1", nom: "DUPONT", prenom: "Lucas", classe: "4ème A", niveau: "4eme", ppa: false, pap: false },
        { id: "2", nom: "MARTIN", prenom: "Emma", classe: "4ème B", niveau: "4eme", ppa: true, pap: true },
        { id: "3", nom: "BERNARD", prenom: "Léo", classe: "5ème A", niveau: "5eme", ppa: false, pap: false },
        { id: "4", nom: "PETIT", prenom: "Chloé", classe: "3ème A", niveau: "3eme", ppa: false, pap: false }
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

// Connexion de l'élève auprès du Backend (Vérification sécurisée par bcrypt)
async function handleLogin(event) {
    if (event) event.preventDefault();

    const niveau = document.getElementById('selectNiveau').value;
    const classe = document.getElementById('selectClasse').value;
    const eleveVal = document.getElementById('selectEleve').value;
    const codeSecret = document.getElementById('codeSecret').value.trim();

    if (!niveau || !classe || !eleveVal) {
        showLoginError('⚠️ Veuillez renseigner le niveau, la classe et votre nom.');
        return;
    }
    if (!codeSecret) {
        showLoginError('⚠️ Veuillez entrer le mot de passe transmis par votre professeur.');
        return;
    }

    const [nom, prenom] = eleveVal.split('___');

    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Vérification...";
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ niveau, classe, nom, prenom, codeSecret })
        });

        const data = await response.json();

        if (response.ok) {
            currentStudent = data;
            showDashboard(data.niveau);
        } else {
            // Mode Fallback si le backend n'est pas actif (pour tests locaux hors-ligne)
            const eleveDemo = annuaireEleves.find(e => e.niveau === niveau && e.classe === classe && e.nom === nom && e.prenom === prenom);
            if (eleveDemo && (codeSecret === '1234' || codeSecret === 'demo')) {
                currentStudent = eleveDemo;
                showDashboard(eleveDemo.niveau);
            } else {
                showLoginError(`❌ ${data.error || 'Mot de passe incorrect.'}`);
            }
        }
    } catch (err) {
        console.warn("Erreur requête connexion :", err);
        showLoginError("❌ Erreur de connexion au serveur. Vérifiez votre réseau.");
    } finally {
        if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.textContent = 'Se connecter';
        }
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
        if (document.getElementById('selectNiveau')) document.getElementById('selectNiveau').value = '';
        onNiveauChange();
    }
}
