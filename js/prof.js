// =====================================================
// GESTION DE L'ESPACE PROFESSEUR, SUIVI GLOBAL & DÉVERROUILLAGE (100% GOOGLE SHEETS & LOCAL)
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
    const pwd = document.getElementById('profPassword').value.trim();
    const err = document.getElementById('profError');

    if (!pwd) {
        err.textContent = '⚠️ Veuillez entrer le mot de passe enseignant.';
        err.classList.add('active');
        return;
    }

    // Vérification du mot de passe administrateur
    if (pwd.toUpperCase() === 'TECHNOP@STEUR26') {
        currentProfPassword = pwd;
        showProfDashboardView();
        return;
    }

    // Vérification via Google Sheets CSV Enseignants
    if (CONFIG.GOOGLE_SHEET_ENSEIGNANTS_CSV && CONFIG.GOOGLE_SHEET_ENSEIGNANTS_CSV.trim() !== '') {
        try {
            const resp = await fetch(CONFIG.GOOGLE_SHEET_ENSEIGNANTS_CSV);
            if (resp.ok) {
                const text = await resp.text();
                const rows = typeof parseCSV === 'function' ? parseCSV(text) : [];
                const matchedTeacher = rows.find(r => {
                    const pass = (r.motdepasse || r.password || r.code || '').trim();
                    return pass && pass.toUpperCase() === pwd.toUpperCase();
                });

                if (matchedTeacher) {
                    currentProfPassword = pwd;
                    showProfDashboardView();
                    return;
                } else {
                    err.textContent = '❌ Mot de passe enseignant incorrect.';
                    err.classList.add('active');
                    return;
                }
            } else {
                err.textContent = '❌ Impossible de charger l\'annuaire des enseignants (erreur réseau).';
                err.classList.add('active');
                return;
            }
        } catch (e) {
            console.warn("⚠️ Échec de la vérification dans l'annuaire enseignant CSV :", e);
            err.textContent = '❌ Erreur de connexion lors de la vérification du mot de passe.';
            err.classList.add('active');
            return;
        }
    }

    err.textContent = '❌ Aucun annuaire enseignant configuré.';
    err.classList.add('active');
}

function onProfNiveauChange() {
    const nivSelect = document.getElementById('profSuiviNiveau');
    const classSelect = document.getElementById('profSuiviClasse');
    if (!nivSelect || !classSelect) return;

    const niv = nivSelect.value;
    const prefix = niv === '5eme' ? '50' : (niv === '4eme' ? '40' : '30');

    let html = '';
    for (let i = 1; i <= 8; i++) {
        const cls = `${prefix}${i}`;
        html += `<option value="${cls}">Classe ${cls}</option>`;
    }
    classSelect.innerHTML = html;
}

function showProfDashboardView() {
    document.getElementById('profLoginView').style.display = 'none';
    document.getElementById('profResultsView').style.display = 'block';
    switchProfTab('unlock');
}

function switchProfTab(tabName) {
    document.querySelectorAll('.prof-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.prof-tab-panel').forEach(p => p.style.display = 'none');

    const btn = document.getElementById(`tabBtn_${tabName}`);
    const panel = document.getElementById(`tabPanel_${tabName}`);

    if (btn) btn.classList.add('active');
    if (panel) panel.style.display = 'block';

    if (tabName === 'unlock') renderUnlockManagement();
    if (tabName === 'fiches' && typeof renderProfFichesManagement === 'function') renderProfFichesManagement();
}

// ----------------------------------------------------
// 1. DÉVERROUILLAGE LOCAL DES ACTIVITÉS
// ----------------------------------------------------
function getLocalUnlocks() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY_UNLOCKS)) || {};
    } catch (e) {
        return {};
    }
}

function renderUnlockManagement() {
    const container = document.getElementById('profUnlockContent');
    if (!container) return;

    const niveau = document.getElementById('profSuiviNiveau') ? document.getElementById('profSuiviNiveau').value : '4eme';
    const classe = document.getElementById('profSuiviClasse') ? document.getElementById('profSuiviClasse').value : 'ALL';

    const localUnlocks = getLocalUnlocks();
    const activities = ACTIVITIES_DATABASE.filter(a => a.niveau === niveau);

    const prefix = niveau === '5eme' ? '50' : (niveau === '4eme' ? '40' : '30');
    let classOptionsHTML = `<option value="ALL">Toutes les classes (${niveau})</option>`;
    for (let i = 1; i <= 8; i++) {
        const cls = `${prefix}${i}`;
        classOptionsHTML += `<option value="${cls}">Classe ${cls}</option>`;
    }

    let html = `
        <div style="margin-bottom:12px; display:flex; gap:10px; align-items:center;">
            <label style="font-weight:600;">Classe ciblée :</label>
            <select id="unlockClasseSelect" onchange="renderUnlockManagement()" style="padding:6px 12px; border-radius:6px;">
                ${classOptionsHTML}
            </select>
        </div>
        <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:12px;">Basculez les interrupteurs pour déverrouiller ou verrouiller les activités :</p>
        <div class="unlock-toggle-list">
    `;

    activities.forEach(act => {
        const actCode = act.code || act.id;
        const key = `${actCode}_${classe}`;
        const isUnlocked = localUnlocks[key] !== undefined ? localUnlocks[key] : (localUnlocks[actCode] !== undefined ? localUnlocks[actCode] : act.defaultUnlocked);
        const levelLabel = act.niveau === '5eme' ? '5ème' : (act.niveau === '4eme' ? '4ème' : '3ème');
        html += `
            <div class="unlock-item">
                <label>
                    <span class="level-badge" style="margin-right:8px; font-size:0.75rem;">${levelLabel}</span>
                    ${act.titre}
                </label>
                <label class="switch">
                    <input type="checkbox" ${isUnlocked ? 'checked' : ''} onchange="toggleActivityUnlockLocal('${actCode}', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function toggleActivityUnlockLocal(activityCode, isChecked) {
    const targetClasse = document.getElementById('unlockClasseSelect') ? document.getElementById('unlockClasseSelect').value : 'ALL';
    const localUnlocks = getLocalUnlocks();
    const key = `${activityCode}_${targetClasse}`;
    localUnlocks[key] = isChecked;
    localUnlocks[activityCode] = isChecked;
    localStorage.setItem(CONFIG.STORAGE_KEY_UNLOCKS, JSON.stringify(localUnlocks));

    if (typeof refreshCurrentDashboard === 'function') {
        refreshCurrentDashboard();
    }
}

// ----------------------------------------------------
// 2. TABLEAU DE SUIVI GLOBAL & PAR ÉLÈVE
// ----------------------------------------------------
function loadProfSuiviData() {
    const container = document.getElementById('profSuiviContent');
    if (!container) return;

    const niveau = document.getElementById('profSuiviNiveau').value;
    const classe = document.getElementById('profSuiviClasse').value;

    if (!niveau || !classe) {
        container.innerHTML = '<p style="color:var(--text-muted); margin-top:15px;">Veuillez choisir un niveau et une classe ci-dessus.</p>';
        return;
    }

    const filteredEleves = annuaireEleves ? annuaireEleves.filter(e => e.niveau === niveau && e.classe === classe) : [];
    const activitiesForLevel = ACTIVITIES_DATABASE.filter(a => a.niveau === niveau);

    const summary = filteredEleves.map(st => {
        const actScores = {};
        let nbDone = 0;

        activitiesForLevel.forEach(act => {
            const actCode = act.code || act.id;
            const results = getStoredResults().filter(r =>
                r.nom && st.nom && r.nom.toUpperCase() === st.nom.toUpperCase() &&
                r.prenom && st.prenom && r.prenom.toUpperCase() === st.prenom.toUpperCase() &&
                (r.activityCode === actCode || r.activityId === actCode || r.quizId === act.quizId || r.quizType === act.quizId)
            );
            if (results.length > 0) {
                const lastRes = results[results.length - 1];
                actScores[actCode] = {
                    score: lastRes.score,
                    maxScore: lastRes.maxScore || 10,
                    percentage: lastRes.percentage !== undefined ? lastRes.percentage : (lastRes.pourcentage !== undefined ? lastRes.pourcentage : Math.round((lastRes.score / (lastRes.maxScore || 10)) * 100)),
                    date: lastRes.dateStr || lastRes.date
                };
                nbDone++;
            }
        });

        return {
            id: st.id,
            nom: st.nom,
            prenom: st.prenom,
            classe: st.classe,
            ppa: st.ppa,
            codeSecret: st.codeSecret || st.code_secret || '—',
            activityScores: actScores,
            stageNote: null,
            nbActivitiesDone: nbDone
        };
    });

    renderProfSuiviTable({
        niveau,
        classe,
        activities: activitiesForLevel.map(a => ({ code: a.code || a.id, titre: a.titre })),
        summary
    });
}

let lastSuiviData = null;

function renderProfSuiviTable(data) {
    lastSuiviData = data;
    const container = document.getElementById('profSuiviContent');
    if (!container) return;

    if (!data.summary || data.summary.length === 0) {
        container.innerHTML = '<p style="margin-top:15px; color:var(--text-muted);">Aucun élève trouvé dans l\'annuaire pour cette classe.</p>';
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
            return `<td><span style="font-weight:700; color:${color};">${escapeHTML(res.score)}/${escapeHTML(res.maxScore)}</span> <small style="display:block; opacity:0.75;">(${escapeHTML(res.percentage)}%)</small></td>`;
        }).join('');

        let stageCell = is3eme ? `<td>${st.stageNote !== null ? `<strong style="color:#2563eb;">${escapeHTML(st.stageNote)}/20</strong>` : '—'}</td>` : '';

        const safeNom = escapeHTML(st.nom);
        const safePrenom = escapeHTML(st.prenom);
        const safeCodeSecret = escapeHTML(st.codeSecret);
        const safeClasse = escapeHTML(st.classe);
        const safeId = escapeHTML(st.id);

        return `
            <tr>
                <td><strong>${safeNom}</strong> ${safePrenom} ${st.ppa ? '🎓' : ''}</td>
                <td><code>${safeCodeSecret}</code></td>
                ${actCells}
                ${stageCell}
                <td><strong>${st.nbActivitiesDone} / ${data.activities.length}</strong></td>
                <td>
                    <button class="btn-primary" style="padding:4px 10px; font-size:0.8rem; background:var(--primary); color:white; border:none; border-radius:6px; cursor:pointer;" onclick="openStudentDetailModal('${safeId}', '${safeNom}', '${safePrenom}', '${safeClasse}')">🔎 Fiche</button>
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
// 3. EXPORT CSV
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
// 4. MODALE HISTORIQUE DÉTAILLÉ ÉLÈVE
// ----------------------------------------------------
function openStudentDetailModal(studentId, nom, prenom, classe) {
    let detailModal = document.getElementById('studentDetailModal');
    if (!detailModal) {
        detailModal = document.createElement('div');
        detailModal.id = 'studentDetailModal';
        detailModal.className = 'modal-overlay active';
        document.body.appendChild(detailModal);
    } else {
        detailModal.classList.add('active');
    }

    const results = getStoredResults().filter(r =>
        r.nom && nom && r.nom.toUpperCase() === nom.toUpperCase() &&
        r.prenom && prenom && r.prenom.toUpperCase() === prenom.toUpperCase()
    );

    let rowsHTML = results.length > 0 ? results.map((r, i) => `
        <tr>
            <td>#${results.length - i}</td>
            <td><strong>${escapeHTML(r.activityCode || r.quizType || 'QCM')}</strong></td>
            <td><strong style="color:${(r.percentage || 0) >= 70 ? '#28a745' : '#dc3545'}">${escapeHTML(r.score)} / ${escapeHTML(r.maxScore || 10)}</strong></td>
            <td>${escapeHTML(r.dateStr || r.date || '—')}</td>
        </tr>
    `).join('') : '<tr><td colspan="4" style="color:var(--text-muted); text-align:center;">Aucune tentative enregistrée localement dans le navigateur.</td></tr>';

    const safeNom = escapeHTML(nom);
    const safePrenom = escapeHTML(prenom);
    const safeClasse = escapeHTML(classe);

    detailModal.innerHTML = `
        <div class="modal-box" style="max-width: 650px;">
            <h3>📊 Historique de ${safeNom} ${safePrenom} (${safeClasse})</h3>
            <div id="studentDetailContent" style="margin-top:15px; max-height:400px; overflow-y:auto;">
                <table class="results-table" style="width:100%; font-size:0.85rem;">
                    <thead>
                        <tr><th>N°</th><th>Activité</th><th>Score</th><th>Date</th></tr>
                    </thead>
                    <tbody>${rowsHTML}</tbody>
                </table>
            </div>
            <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <button onclick="resetStudentOmProgress('${safeNom}', '${safePrenom}', '${safeClasse}')" style="background:#dc3545; color:white; border:none; padding:8px 14px; border-radius:6px; font-weight:600; cursor:pointer; font-size:0.85rem;">
                    🗑️ Réinitialiser tentatives Objets & Matériaux
                </button>
                <button class="btn-close-modal" onclick="document.getElementById('studentDetailModal').classList.remove('active')" style="margin-top:0;">Fermer</button>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// 5. RÉSULTATS LOCAUX (STOCKAGE BROWSER)
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
            <td>${escapeHTML(r.nom)}</td>
            <td>${escapeHTML(r.prenom)}</td>
            <td>${escapeHTML(r.classe)}</td>
            <td>${r.score1 !== '' ? escapeHTML(r.score1) + '/10' : '—'}</td>
            <td>${r.score2 !== '' ? escapeHTML(r.score2) + '/10' : '—'}</td>
            <td>${r.score3 !== '' ? escapeHTML(r.score3) + '/10' : '—'}</td>
            <td>${escapeHTML(r.pourcentage)}%</td>
            <td>${escapeHTML(r.lastDate)}</td>
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

function resetStudentOmProgress(nom, prenom, classe) {
    if (confirm(`Voulez-vous réinitialiser les tentatives du module Objets & Matériaux pour l'élève ${nom} ${prenom} ?`)) {
        const key4 = `om_progress_4eme_${classe}_${nom}_${prenom}`.toLowerCase().replace(/\s+/g, '_');
        const key5 = `om_progress_5eme_${classe}_${nom}_${prenom}`.toLowerCase().replace(/\s+/g, '_');
        const key3 = `om_progress_3eme_${classe}_${nom}_${prenom}`.toLowerCase().replace(/\s+/g, '_');

        localStorage.removeItem(key4);
        localStorage.removeItem(key5);
        localStorage.removeItem(key3);

        alert(`Les tentatives de ${nom} ${prenom} ont été réinitialisées avec succès.`);
        const modal = document.getElementById('studentDetailModal');
        if (modal) modal.classList.remove('active');
        if (typeof loadProfSuiviData === 'function') loadProfSuiviData();
    }
}
