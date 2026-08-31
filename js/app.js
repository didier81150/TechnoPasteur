// =====================================================
// APPLICATION PRINCIPALE & LOGIQUE DU TABLEAU DE BORD
// =====================================================

let currentActiveLevel = "4eme";

document.addEventListener('DOMContentLoaded', function() {
    loadAnnuaire();
});

// Affichage et gestion du Tableau de Bord (Dashboard)
function showDashboard(niveau) {
    if (niveau) {
        currentActiveLevel = niveau;
    }

    document.getElementById('activityScreen').style.display = 'none';

    if (!currentStudent) {
        document.getElementById('dashboardScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';
    } else {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'block';
        updateStudentBar();
        switchLevelTab(currentActiveLevel);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStudentBar() {
    if (!currentStudent) return;

    document.getElementById('displayNameBar').textContent = `${currentStudent.nom} ${currentStudent.prenom}`;
    document.getElementById('displayClassBar').textContent = `Classe : ${currentStudent.classe}`;

    const levelLabel = currentStudent.niveau === '5eme' ? '5ème' : (currentStudent.niveau === '4eme' ? '4ème' : '3ème');
    document.getElementById('displayLevelBar').textContent = `Niveau : ${levelLabel}`;

    const ppaBadge = document.getElementById('displayPPABar');
    if (ppaBadge) {
        ppaBadge.style.display = currentStudent.ppa ? 'inline-block' : 'none';
    }
}

function switchLevelTab(level) {
    currentActiveLevel = level;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    refreshCurrentDashboard();
}

function refreshCurrentDashboard() {
    const grid = document.getElementById('activitiesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const activities = ACTIVITIES_DATABASE.filter(act => act.niveau === currentActiveLevel);

    // Vérification de la correspondance du niveau élève
    const isStudentLevelMatch = !currentStudent || currentStudent.niveau === currentActiveLevel;

    if (activities.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted); padding: 40px 0;">Aucune activité disponible pour ce niveau.</p>';
        return;
    }

    activities.forEach(act => {
        const unlockedByProf = isActivityUnlocked(act.id);
        const accessible = isStudentLevelMatch && unlockedByProf;

        const card = document.createElement('div');
        card.className = `activity-card ${accessible ? '' : 'locked'}`;
        if (!isStudentLevelMatch) {
            card.style.opacity = '0.55';
            card.style.filter = 'grayscale(80%)';
        }

        let statusText = '🟢 Accessible';
        if (!isStudentLevelMatch) {
            const levelLabel = currentActiveLevel === '5eme' ? '5ème' : (currentActiveLevel === '4eme' ? '4ème' : '3ème');
            statusText = `🚫 Réservé aux ${levelLabel}`;
        } else if (!unlockedByProf) {
            statusText = '🔒 Verrouillé par le prof';
        }

        card.innerHTML = `
            <div>
                <span class="activity-badge-type ${act.badgeClass}">${act.badgeText}</span>
                <h3 class="activity-title">${act.titre}</h3>
                <p class="activity-desc">${act.description}</p>
            </div>
            <div class="activity-footer">
                <span class="activity-status ${accessible ? 'status-unlocked' : 'status-locked'}">
                    ${statusText}
                </span>
                <button class="btn-start-activity" ${accessible ? '' : 'disabled'} onclick="launchActivity('${act.id}')">
                    ${accessible ? 'Accéder →' : 'Inaccessible'}
                </button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function launchActivity(activityId) {
    const act = ACTIVITIES_DATABASE.find(a => a.id === activityId);
    if (!act) return;

    if (!isActivityUnlocked(act.id)) {
        alert("Cette activité est actuellement verrouillée par votre professeur.");
        return;
    }

    if (act.type === 'qcm') {
        startQuiz(act.quizId);
    } else if (act.type === 'pdf') {
        openPdfViewer(act);
    } else if (act.type === 'video') {
        openVideoPlayer(act);
    } else if (act.type === 'stage') {
        openStageModule(act);
    } else if (act.type === 'analyse') {
        openAnalyseModule(act);
    } else if (act.type === 'eval_competences') {
        openEvalCompetencesModule();
    }
}
