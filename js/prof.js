// =====================================================
// GESTION DE L'ESPACE PROFESSEUR, SUIVI GLOBAL & DÉVERROUILLAGE
// =====================================================

let currentProfPassword = '';

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

async function checkProfPassword() {
    const pwd = document.getElementById('profPassword').value;
    const err = document.getElementById('profError');

    if (!pwd) {
        err.textContent = '⚠️ Veuillez entrer le mot de passe enseignant.';
        err.classList.add('active');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/prof/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ motDePasseProf: pwd })
        });

        if (response.ok) {
            currentProfPassword = pwd;
            showProfDashboardView();
        } else {
            // Mode fallback si hors ligne
            if (pwd === 'prof2024' || pwd === 'prof') {
                currentProfPassword = pwd;
                showProfDashboardView();
            } else {
                err.textContent = '❌ Mot de passe enseignant incorrect.';
                err.classList.add('active');
            }
        }
    } catch (e) {
        if (pwd === 'prof2024' || pwd === 'prof') {
            currentProfPassword = pwd;
            showProfDashboardView();
        } else {
            err.textContent = '❌ Mot de passe enseignant incorrect.';
            err.classList.add('active');
        }
    }
}

function showProfDashboardView() {
    document.getElementById('profLoginView').style.display = 'none';
    document.getElementById('profResultsView').style.display = 'block';
    switchProfTab('suivi');
}

function switchProfTab(tabName) {
    document.querySelectorAll('.prof-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.prof-tab-panel').forEach(p => p.style.display = 'none');

    const btn = document.getElementById(`tabBtn_${tabName}`);
    const panel = document.getElementById(`tabPanel_${tabName}`);

    if (btn) btn.classList.add('active');
    if (panel) panel.style.display = 'block';

    if (tabName === 'unlock') renderUnlockManagement();
    if (tabName === 'suivi') loadProfSuiviData();
    if (tabName === 'local') renderLocalResultsTable();
}

// ----------------------------------------------------
// 1. DÉVERROUILLAGE SYNCHRONISÉ PAR LE BACKEND
// ----------------------------------------------------
async function renderUnlockManagement() {
    const container = document.getElementById('profUnlockContent');
    if (!container) return;

    const niveau = document.getElementById('profSuiviNiveau') ? document.getElementById('profSuiviNiveau').value : '4eme';
    const classe = document.getElementById('profSuiviClasse') ? document.getElementById('profSuiviClasse').value : 'ALL';

    container.innerHTML = '<p>⏳ Chargement des états de verrouillage...</p>';

    let activities = ACTIVITIES_DATABASE;
    try {
        const resp = await fetch(`${CONFIG.API_BASE_URL}/activities?niveau=${niveau}&classe=${classe}`);
        if (resp.ok) {
            activities = await resp.json();
        }
    } catch (e) {
        console.warn("Utilisation de la base locale pour les activités.");
    }

    let html = `
        <div style="margin-bottom:12px; display:flex; gap:10px; align-items:center;">
            <label style="font-weight:600;">Classe ciblée :</label>
            <select id="unlockClasseSelect" onchange="renderUnlockManagement()" style="padding:6px 12px; border-radius:6px;">
                <option value="ALL">Toutes les classes (${niveau})</option>
                <option value="4A">Classe 4A</option>
                <option value="4B">Classe 4B</option>
                <option value="302">Classe 302</option>
                <option value="303">Classe 303</option>
            </select>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px;">Basculez les interrupteurs pour déverrouiller ou verrouiller les activités pour la classe sélectionnée :</p>
        <div class="unlock-toggle-list">
    `;

    activities.forEach(act => {
        const isUnlocked = act.unlocked !== undefined ? act.unlocked : act.defaultUnlocked;
        const levelLabel = act.niveau === '5eme' ? '5ème' : (act.niveau === '4eme' ? '4ème' : '3ème');
        html += `
            <div class="unlock-item">
                <label>
                    <span class="level-badge" style="margin-right:8px; font-size:0.75rem;">${levelLabel}</span>
                    ${act.titre}
                </label>
                <label class="switch">
                    <input type="checkbox" ${isUnlocked ? 'checked' : ''} onchange="toggleActivityUnlockBackend('${act.code || act.id}', '${act.niveau}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

async function toggleActivityUnlockBackend(activityCode, niveau, isChecked) {
    const targetClasse = document.getElementById('unlockClasseSelect') ? document.getElementById('unlockClasseSelect').value : 'ALL';

    try {
        await fetch(`${CONFIG.API_BASE_URL}/activities/unlock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Prof-Password': currentProfPassword
            },
            body: JSON.stringify({
                activityCode,
                niveau,
                classe: targetClasse,
                unlocked: isChecked,
                motDePasseProf: currentProfPassword
            })
        });
    } catch (e) {
        console.warn("Erreur synchronisation verrouillage backend :", e);
    }

    if (currentStudent) {
        refreshCurrentDashboard();
    }
}

// ----------------------------------------------------
// 2. TABLEAU DE SUIVI GLOBAL & PAR ÉLÈVE
// ----------------------------------------------------
async function loadProfSuiviData() {
    const container = document.getElementById('profSuiviContent');
    if (!container) return;

    const niveau = document.getElementById('profSuiviNiveau').value;
    const classe = document.getElementById('profSuiviClasse').value;

    if (!niveau || !classe) {
        container.innerHTML = '<p style="color:var(--text-muted); margin-top:15px;">Veuillez choisir un niveau et une classe ci-dessus.</p>';
        return;
    }

    container.innerHTML = '<p style="margin-top:15px; color:var(--text-muted);">⏳ Génération du tableau de suivi en cours...</p>';

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/prof/summary?niveau=${niveau}&classe=${classe}`, {
            headers: { 'X-Prof-Password': currentProfPassword }
        });

        if (response.ok) {
            const data = await response.json();
            renderProfSuiviTable(data);
        } else {
            container.innerHTML = '<p style="color:var(--danger); margin-top:15px;">❌ Erreur lors du chargement des données de suivi.</p>';
        }
    } catch (e) {
        container.innerHTML = '<p style="color:var(--danger); margin-top:15px;">❌ Connexion au serveur backend indisponible.</p>';
    }
}

let lastSuiviData = null;

function renderProfSuiviTable(data) {
    lastSuiviData = data;
    const container = document.getElementById('profSuiviContent');
    if (!container) return;

    if (!data.summary || data.summary.length === 0) {
        container.innerHTML = '<p style="margin-top:15px; color:var(--text-muted);">Aucun élève trouvé pour cette classe.</p>';
        return;
    }

    const is3eme = data.niveau === '3eme';

    let headersHTML = `<th>Nom & Prénom</th><th>Code Secret</th>`;
    data.activities.forEach(act => {
        headersHTML += `<th>${act.titre}</th>`;
    });
    if (is3eme) headersHTML += `<th>Note Stage</th>`;
    headersHTML += `<th>Activités faites</th><th>Détails</th>`;

    let rowsHTML = data.summary.map(st => {
        let actCells = data.activities.map(act => {
            const res = st.activityScores[act.code];
            if (!res) return `<td style="color:var(--text-muted);">—</td>`;
            const color = res.percentage >= 70 ? '#28a745' : (res.percentage >= 50 ? '#ffc107' : '#dc3545');
            return `<td><span style="font-weight:700; color:${color};">${res.score}/${res.maxScore}</span> <small style="display:block; opacity:0.75;">(${res.percentage}%)</small></td>`;
        }).join('');

        let stageCell = is3eme ? `<td>${st.stageNote !== null ? `<strong style="color:#2563eb;">${st.stageNote}/20</strong>` : '—'}</td>` : '';

        return `
            <tr>
                <td><strong>${st.nom}</strong> ${st.prenom} ${st.ppa ? '🎓' : ''}</td>
                <td>
                    <button class="btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="resetStudentPasswordPrompt('${st.id}', '${st.nom}', '${st.prenom}')">🔑 Réinitialiser</button>
                </td>
                ${actCells}
                ${stageCell}
                <td><strong>${st.nbActivitiesDone} / ${data.activities.length}</strong></td>
                <td>
                    <button class="btn-primary" style="padding:4px 10px; font-size:0.8rem; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer;" onclick="openStudentDetailModal('${st.id}', '${st.nom}', '${st.prenom}', '${st.classe}')">🔎 Fiche</button>
                </td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <div style="overflow-x:auto; margin-top:15px;">
            <table class="results-table" style="width:100%; font-size:0.88rem;">
                <thead><tr>${headersHTML}</tr></thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        </div>
    `;
}

// ----------------------------------------------------
// 3. EXPORT PRONOTE CSV ET CSV SUIVI GENERAL
// ----------------------------------------------------
function exportSuiviPronoteCSV() {
    if (!lastSuiviData || !lastSuiviData.summary || lastSuiviData.summary.length === 0) {
        alert("Aucune donnée à exporter. Choisissez une classe et générez le tableau d'abord.");
        return;
    }

    let csv = "Nom;Prenom;Classe;Activite_Evaluation;Note;Bareme;Coefficient;Date\n";

    lastSuiviData.summary.forEach(st => {
        lastSuiviData.activities.forEach(act => {
            const res = st.activityScores[act.code];
            if (res) {
                csv += `${st.nom};${st.prenom};${st.classe};${act.titre};${res.score};${res.maxScore};1;${res.date || ''}\n`;
            }
        });
        if (st.stageNote !== null) {
            csv += `${st.nom};${st.prenom};${st.classe};Rapport de Stage;${st.stageNote};20;2;${new Date().toLocaleDateString('fr-FR')}\n`;
        }
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pronote_export_${lastSuiviData.niveau}_${lastSuiviData.classe}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ----------------------------------------------------
// 4. RÉINITIALISATION DU CODE SECRET ÉLÈVE
// ----------------------------------------------------
async function resetStudentPasswordPrompt(studentId, nom, prenom) {
    const newCode = prompt(`Entrez le nouveau code secret pour l'élève ${nom} ${prenom} :`, "1234");
    if (!newCode || !newCode.trim()) return;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/prof/students/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Prof-Password': currentProfPassword
            },
            body: JSON.stringify({
                studentId,
                newCodeSecret: newCode.trim(),
                motDePasseProf: currentProfPassword
            })
        });

        const res = await response.json();
        if (response.ok) {
            alert(`✅ ${res.message}`);
        } else {
            alert(`❌ Erreur : ${res.error}`);
        }
    } catch (e) {
        alert("❌ Erreur de connexion au serveur.");
    }
}

// ----------------------------------------------------
// 5. MODALE HISTORIQUE DÉTAILLÉ ÉLÈVE
// ----------------------------------------------------
async function openStudentDetailModal(studentId, nom, prenom, classe) {
    let detailModal = document.getElementById('studentDetailModal');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'studentDetailModal';
        detailModal.className = 'modal-overlay active';
        document.body.appendChild(detailModal);
    } else {
        detailModal.classList.add('active');
    }

    detailModal.innerHTML = `
        <div class="modal-box" style="max-width: 650px;">
            <h3>📊 Historique détaillé — ${nom} ${prenom} (${classe})</h3>
            <div id="studentDetailContent" style="margin-top:15px; max-height:400px; overflow-y:auto;">
                <p>⏳ Chargement de l'historique...</p>
            </div>
            <button class="btn-close-modal" onclick="document.getElementById('studentDetailModal').classList.remove('active')" style="margin-top:15px;">Fermer</button>
        </div>
    `;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/results/student?studentId=${studentId}&nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(prenom)}&classe=${encodeURIComponent(classe)}`);
        const results = await response.json();

        const content = document.getElementById('studentDetailContent');
        if (!Array.isArray(results) || results.length === 0) {
            content.innerHTML = '<p style="color:var(--text-muted);">Aucune tentative enregistrée pour cet élève.</p>';
            return;
        }

        let rows = results.map((r, i) => `
            <tr>
                <td>#${results.length - i}</td>
                <td><strong>${r.activityCode}</strong></td>
                <td><strong style="color:${r.percentage >= 70 ? '#28a745' : '#dc3545'}">${r.score} / ${r.maxScore}</strong> (${r.percentage}%)</td>
                <td>${r.dureeSec ? Math.round(r.dureeSec/60) + ' min' : '—'}</td>
                <td>${r.dateStr || new Date(r.createdAt).toLocaleDateString('fr-FR')} ${r.heureStr || ''}</td>
            </tr>
        `).join('');

        content.innerHTML = `
            <table class="results-table" style="width:100%; font-size:0.85rem;">
                <thead>
                    <tr><th>N°</th><th>Activité</th><th>Score</th><th>Durée</th><th>Date</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    } catch (e) {
        document.getElementById('studentDetailContent').innerHTML = '<p style="color:var(--danger);">Erreur de chargement de l\'historique.</p>';
    }
}

// ----------------------------------------------------
// 6. RÉSULTATS LOCAUX (STOCKAGE BROWSER)
// ----------------------------------------------------
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
        content.innerHTML = '<p style="margin-top:15px; color:var(--text-muted);">Aucun résultat enregistré localement dans ce navigateur.</p>';
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
        <p style="margin-top:10px; font-size:0.85rem; color:#6C757D;">${rows.length} élève(s) avec résultat enregistré localement.</p>
        <table class="results-table">
            <thead>
                <tr><th>Nom</th><th>Prénom</th><th>Classe</th><th>Score 1</th><th>Score 2</th><th>Score 3</th><th>%</th><th>Date</th></tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>
    `;
}

function clearAllResults() {
    if (confirm('⚠️ Effacer définitivement tous les résultats enregistrés dans ce navigateur ? Cette action est irréversible.')) {
        localStorage.removeItem(CONFIG.STORAGE_KEY_RESULTS);
        renderLocalResultsTable();
    }
}
