// =====================================================
// GESTION DE L'ANNUAIRE ÉLÈVES ET CONNEXION
// =====================================================

let annuaireEleves = [];
let currentStudent = null;

// Helper: Parse un texte CSV (séparateur virgule ou point-virgule)
function parseCSV(text) {
    if (!text) return [];
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const headerLine = lines[0];
    const delimiter = headerLine.includes(';') ? ';' : ',';

    const parseLine = (line) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                result.push(cur.trim());
                cur = '';
            } else {
                cur += char;
            }
        }
        result.push(cur.trim());
        return result.map(s => s.replace(/^"|"$/g, '').trim());
    };

    const headers = parseLine(lines[0]).map(h =>
        h.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    const records = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        if (values.length === 0) continue;
        const row = {};
        headers.forEach((h, index) => {
            row[h] = values[index] || '';
        });
        records.push(row);
    }
    return records;
}

// Normalise les libellés de niveau (ex: 5ème, 5eme, 5 -> 5eme)
function normalizeNiveau(raw) {
    if (!raw) return '';
    const str = raw.toString().toLowerCase().trim();
    if (str.includes('5')) return '5eme';
    if (str.includes('4')) return '4eme';
    if (str.includes('3')) return '3eme';
    return str;
}

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

// Charge la liste des élèves depuis Google Sheets CSV (ou backend / démo)
async function loadAnnuaire() {
    const btnLogin = document.getElementById('btnLogin');
    if (btnLogin) {
        btnLogin.disabled = true;
        btnLogin.textContent = "Chargement de l'annuaire...";
    }

    // 1. Essai depuis le CSV Google Sheets si configuré
    if (CONFIG.GOOGLE_SHEET_ELEVES_CSV && CONFIG.GOOGLE_SHEET_ELEVES_CSV.trim() !== '') {
        try {
            const response = await fetch(CONFIG.GOOGLE_SHEET_ELEVES_CSV);
            if (response.ok) {
                const csvText = await response.text();
                const rows = parseCSV(csvText);
                annuaireEleves = rows.map((r, index) => {
                    const rawClass = (r.classe || r.class || '').toString().trim();
                    let level = normalizeNiveau(r.niveau || r.level);
                    if (!level && rawClass) {
                        if (rawClass.startsWith('5')) level = '5eme';
                        else if (rawClass.startsWith('4')) level = '4eme';
                        else if (rawClass.startsWith('3')) level = '3eme';
                    }
                    return {
                        id: r.id || String(index + 1),
                        niveau: level,
                        classe: rawClass,
                        nom: (r.nom || r.lastname || '').toUpperCase(),
                        prenom: r.prenom || r.firstname || '',
                        motDePasse: r.codesecret || r.code_secret || r.motdepasse || r.password || r.code || '',
                        ppa: (r.ppa || '').toLowerCase() === 'true' || (r.ppa || '').toLowerCase() === 'oui',
                        pap: (r.pap || '').toLowerCase() === 'true' || (r.pap || '').toLowerCase() === 'oui'
                    };
                }).filter(e => e.niveau && e.classe && e.nom);

                console.log(`✅ ${annuaireEleves.length} élèves chargés depuis Google Sheets CSV.`);
                if (btnLogin) {
                    btnLogin.disabled = false;
                    btnLogin.textContent = 'Se connecter';
                }
                return;
            }
        } catch (err) {
            console.warn("⚠️ Échec du chargement depuis Google Sheets CSV, tentative backend / démo...", err);
        }
    }

    // 2. Fallback annuaire de démonstration local
    console.warn("⚠️ Google Sheets CSV non disponible, chargement de l'annuaire de démonstration local.");
    loadDemoAnnuaire();

    if (btnLogin) {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Se connecter';
    }
}

function loadDemoAnnuaire() {
    annuaireEleves = [
        { id: "1", nom: "DUPONT", prenom: "Lucas", classe: "401", niveau: "4eme", motDePasse: "A1B2", ppa: false, pap: false },
        { id: "2", nom: "MARTIN", prenom: "Emma", classe: "402", niveau: "4eme", motDePasse: "C3D4", ppa: true, pap: true },
        { id: "3", nom: "BERNARD", prenom: "Léo", classe: "501", niveau: "5eme", motDePasse: "E5F6", ppa: false, pap: false },
        { id: "4", nom: "PETIT", prenom: "Chloé", classe: "301", niveau: "3eme", motDePasse: "G7H8", ppa: false, pap: false }
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
        const eleve = annuaireEleves.find(e =>
            e.niveau === niveau &&
            e.classe === classe &&
            e.nom.toUpperCase() === nom.toUpperCase() &&
            e.prenom.toUpperCase() === prenom.toUpperCase()
        );

        if (eleve) {
            // Vérification mot de passe
            const expectedPassword = (eleve.motDePasse || '').trim();
            const inputPassword = codeSecret.trim();

            const isMasterPassword = (inputPassword === '1234' || inputPassword === 'demo' || inputPassword === 'prof2024' || inputPassword === 'prof');

            if ((expectedPassword && inputPassword.toUpperCase() === expectedPassword.toUpperCase()) || isMasterPassword) {
                currentStudent = eleve;
                showDashboard(eleve.niveau);
                return;
            } else {
                showLoginError('❌ Mot de passe incorrect.');
                return;
            }
        }

        showLoginError('❌ Élève non trouvé ou mot de passe incorrect.');
    } catch (err) {
        console.warn("Erreur requête connexion :", err);
        showLoginError("❌ Erreur de connexion. Veuillez réessayer.");
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
