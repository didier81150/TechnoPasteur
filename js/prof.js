// =====================================================
// GESTION DE L'ESPACE PROFESSEUR ET DÉVERROUILLAGE
// =====================================================

function openProfModal() {
    document.getElementById('profModalOverlay').classList.add('active');
    document.getElementById('profLoginView').style.display = 'block';
    document.getElementById('profResultsView').style.display = 'none';
    document.getElementById('profPassword').value = '';
    document.getElementById('profError').classList.remove('active');
}

function closeProfModal() {
    document.getElementById('profModalOverlay').classList.remove('active');
}

function checkProfPassword() {
    const pwd = document.getElementById('profPassword').value;
    if (pwd !== CONFIG.PROF_PASSWORD) {
        const err = document.getElementById('profError');
        err.textContent = '❌ Mot de passe incorrect.';
        err.classList.add('active');
        return;
    }
    showProfDashboardView();
}

let isProfLoggedIn = false;

function showProfDashboardView() {
    isProfLoggedIn = true;
    document.getElementById('profLoginView').style.display = 'none';
    document.getElementById('profResultsView').style.display = 'block';
    renderUnlockManagement();
    renderLocalResultsTable();

    // Si le module rapport de stage est ouvert, déverrouiller la saisie et la visualisation des notes
    const lockMsg = document.getElementById('stage-prof-lock-msg');
    const formContainer = document.getElementById('stage-prof-form-container');
    if (lockMsg && formContainer) {
        lockMsg.style.display = 'none';
        formContainer.style.display = 'block';
    }

    const viewLockMsg = document.getElementById('stage-prof-view-lock-msg');
    const viewContainer = document.getElementById('stage-prof-view-container');
    if (viewLockMsg && viewContainer) {
        viewLockMsg.style.display = 'none';
        viewContainer.style.display = 'block';
    }
}

// Gestion des verrous d'activités
function getUnlockedActivitiesState() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY_UNLOCKS);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Erreur lecture état verrous local", e);
    }
    const defaultState = {};
    ACTIVITIES_DATABASE.forEach(act => {
        defaultState[act.id] = act.defaultUnlocked;
    });
    return defaultState;
}

function saveUnlockedActivitiesState(state) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY_UNLOCKS, JSON.stringify(state));
    } catch (e) {
        console.error("Erreur sauvegarde état verrous local", e);
    }
}

function isActivityUnlocked(activityId) {
    const state = getUnlockedActivitiesState();
    return state[activityId] !== undefined ? state[activityId] : true;
}

function toggleActivityUnlock(activityId, isChecked) {
    const state = getUnlockedActivitiesState();
    state[activityId] = isChecked;
    saveUnlockedActivitiesState(state);
    if (currentStudent) {
        refreshCurrentDashboard();
    }
}

function renderUnlockManagement() {
    const container = document.getElementById('profUnlockContent');
    if (!container) return;

    const state = getUnlockedActivitiesState();
    let html = '<p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px;">Basculez les interrupteurs pour déverrouiller ou verrouiller les activités pour les élèves en temps réel :</p>';
    html += '<div class="unlock-toggle-list">';

    ACTIVITIES_DATABASE.forEach(act => {
        const isUnlocked = state[act.id] !== undefined ? state[act.id] : act.defaultUnlocked;
        const levelLabel = act.niveau === '5eme' ? '5ème' : (act.niveau === '4eme' ? '4ème' : '3ème');
        html += `
            <div class="unlock-item">
                <label>
                    <span class="level-badge" style="margin-right:8px; font-size:0.75rem;">${levelLabel}</span>
                    ${act.titre}
                </label>
                <label class="switch">
                    <input type="checkbox" ${isUnlocked ? 'checked' : ''} onchange="toggleActivityUnlock('${act.id}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Table des résultats locaux
function getStoredResults() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_RESULTS)) || [];
    } catch (e) {
        return [];
    }
}

function aggregateLocalResults() {
    const results = getStoredResults();
    const map = {};

    results.forEach(r => {
        const key = `${r.nom}|${r.prenom}|${r.classe}`;
        if (!map[key]) {
            map[key] = { nom: r.nom, prenom: r.prenom, classe: r.classe, score1: '', score2: '', score3: '', lastDate: r.date };
        }
        if (r.quizType == 1) map[key].score1 = r.score;
        if (r.quizType == 2) map[key].score2 = r.score;
        if (r.quizType == 3) map[key].score3 = r.score;
        map[key].lastDate = r.date;
    });

    return Object.values(map).map(row => {
        const scores = [row.score1, row.score2, row.score3].filter(s => s !== '');
        const total = scores.reduce((a, b) => a + Number(b), 0);
        const pourcentage = scores.length > 0 ? Math.round((total / (scores.length * 10)) * 100) : 0;
        return { ...row, pourcentage };
    });
}

function renderLocalResultsTable() {
    const content = document.getElementById('profResultsContent');
    if (!content) return;

    const rows = aggregateLocalResults();

    if (rows.length === 0) {
        content.innerHTML = '<p style="margin-top:15px; color:var(--text-muted);">Aucun résultat enregistré pour le moment.</p>';
        return;
    }

    let tableRows = rows.map(r => `
        <tr>
            <td>${r.nom}</td>
            <td>${r.prenom}</td>
            <td>${r.classe}</td>
            <td>${r.score1 !== '' ? r.score1 + '/10' : '—'}</td>
            <td>${r.score2 !== '' ? r.score2 + '/10' : '—'}</td>
            <td>${r.score3 !== '' ? r.score3 + '/10' : '—'}</td>
            <td>${r.pourcentage}%</td>
            <td>${r.lastDate}</td>
        </tr>
    `).join('');

    content.innerHTML = `
        <p style="margin-top:10px; font-size:0.85rem; color:#6C757D;">${rows.length} élève(s) avec au moins un résultat enregistré dans ce navigateur.</p>
        <table class="results-table">
            <thead>
                <tr><th>Nom</th><th>Prénom</th><th>Classe</th><th>Score 1</th><th>Score 2</th><th>Score 3</th><th>%</th><th>Date</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}

function exportCSV() {
    const rows = aggregateLocalResults();
    if (rows.length === 0) {
        alert('Aucun résultat à exporter.');
        return;
    }

    let csv = 'Nom;Prenom;Classe;Score 1;Score 2;Score 3;pourcentage;Date\n';
    rows.forEach(r => {
        csv += `${r.nom};${r.prenom};${r.classe};${r.score1};${r.score2};${r.score3};${r.pourcentage};${r.lastDate}\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultats_site_techno_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAllResults() {
    if (confirm('⚠️ Effacer définitivement tous les résultats enregistrés dans ce navigateur ? Cette action est irréversible.')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY_RESULTS);
        renderLocalResultsTable();
    }
}
