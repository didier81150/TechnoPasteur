// =====================================================
// VISIONNEUSES DE MÉDIAS (PDF ET VIDÉO UNIFIÉES)
// =====================================================

function openPdfViewer(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const safeTitle = escapeHTML(activity.titre);
    const safeDesc = escapeHTML(activity.description);

    if (activity.pdfList && Array.isArray(activity.pdfList) && activity.pdfList.length > 0) {
        const cardsHTML = activity.pdfList.map((doc, idx) => {
            const rawUrl = doc.url || '';
            const previewUrl = typeof formatGoogleDriveUrl === 'function' ? formatGoogleDriveUrl(rawUrl, "preview") : rawUrl;
            const viewUrl = typeof formatGoogleDriveUrl === 'function' ? formatGoogleDriveUrl(rawUrl, "view") : rawUrl;
            const safeDocTitle = escapeHTML(doc.titre || `Document ${idx + 1}`);

            return `
                <div class="stage-doc-card" style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; justify-space-between; gap: 12px; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; items-center; gap: 10px;">
                        <span style="font-size: 2rem;">📄</span>
                        <div>
                            <h4 style="margin: 0; color: var(--navy); font-size: 1.05rem; font-weight: 700;">${safeDocTitle}</h4>
                            <p style="margin: 4px 0 0 0; color: var(--text-muted); font-size: 0.85rem;">Fiche de synthèse PDF</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
                        <a href="${escapeHTML(viewUrl)}" target="_blank" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none; padding: 8px 12px; font-size: 0.88rem; background: var(--primary); color: white; border-radius: 6px;">
                            👁️ Consulter
                        </a>
                        <a href="${escapeHTML(viewUrl)}" target="_blank" download class="btn-download-doc" style="flex: 1; text-align: center; text-decoration: none; padding: 8px 12px; font-size: 0.88rem; background: var(--accent); color: white; border-radius: 6px;">
                            ⬇️ Télécharger
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="media-container" style="max-width: 950px; margin: 0 auto;">
                <div class="media-header" style="margin-bottom: 25px;">
                    <div>
                        <h2 class="media-title">📚 ${safeTitle}</h2>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">${safeDesc}</p>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                    ${cardsHTML}
                </div>
                <div style="margin-top: 30px; text-align: center;">
                    <button class="btn-menu" onclick="showDashboard(currentStudent ? currentStudent.niveau : '4eme')" style="padding: 10px 24px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer;">
                        ↩️ Retour au tableau de bord
                    </button>
                </div>
            </div>
        `;
    } else {
        const safePdfUrl = escapeHTML(activity.pdfUrl || '');
        container.innerHTML = `
            <div class="media-container">
                <div class="media-header">
                    <div>
                        <h2 class="media-title">📄 ${safeTitle}</h2>
                        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">${safeDesc}</p>
                    </div>
                    <a href="${safePdfUrl}" target="_blank" download class="btn-start-activity" style="text-decoration: none;">
                        ⬇️ Télécharger le PDF
                    </a>
                </div>
                <iframe class="pdf-viewer-frame" src="${safePdfUrl}">
                    <p>Votre navigateur ne prend pas en charge l'affichage direct des PDF.
                    <a href="${safePdfUrl}">Cliquez ici pour télécharger le document.</a></p>
                </iframe>
            </div>
        `;
    }

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================================================
// MODULE : À LA DÉCOUVERTE DU MBOT
// =====================================================

const MBOT_VIDEOS = [
    {
        num: 1,
        titre: "1 - Présentation de mBot, robot programmable",
        embedUrl: "https://www.youtube.com/embed/EWs8s4jpgag"
    },
    {
        num: 2,
        titre: "2 - Constitution de mBot, robot programmable",
        embedUrl: "https://www.youtube.com/embed/IzBJlIKpPWo?start=42"
    },
    {
        num: 3,
        titre: "3 - Les actionneurs de mBot, robot programmable",
        embedUrl: "https://www.youtube.com/embed/t9htG1XMEzA"
    },
    {
        num: 4,
        titre: "4 - Les capteurs de mBot, robot programmable",
        embedUrl: "https://www.youtube.com/embed/lNie493d7oE?start=12"
    },
    {
        num: 5,
        titre: "5 - Piloter manuellement mBot, robot programmable",
        embedUrl: "https://www.youtube.com/embed/7V8-Y7hDejk"
    },
    {
        num: 6,
        titre: "6 - Fonctionnement de mBot, chaîne d'énergie et chaîne d'information",
        embedUrl: "https://www.youtube.com/embed/BhbyP-C--I0?start=117"
    }
];

let currentMbotVideoIndex = 0;

function openMbotModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    currentMbotVideoIndex = 0;
    renderMbotModuleView(container);

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderMbotModuleView(container) {
    if (!container) container = document.getElementById('activityContent');
    const activeVideo = MBOT_VIDEOS[currentMbotVideoIndex] || MBOT_VIDEOS[0];

    const buttonsHTML = MBOT_VIDEOS.map((vid, idx) => {
        const isActive = idx === currentMbotVideoIndex;
        return `
            <button
                onclick="selectMbotVideo(${idx})"
                style="padding: 12px 16px; border-radius: 12px; border: 2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}; background: ${isActive ? 'var(--primary)' : 'white'}; color: ${isActive ? 'white' : 'var(--navy)'}; font-weight: 700; text-align: left; cursor: pointer; transition: all 0.2s; font-size: 0.92rem; display: flex; align-items: center; gap: 8px; box-shadow: ${isActive ? 'var(--shadow-md)' : 'none'};"
            >
                <span style="background: ${isActive ? 'rgba(255,255,255,0.2)' : 'var(--bg-main)'}; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem;">🎬 ${vid.num}</span>
                <span>${escapeHTML(vid.titre)}</span>
            </button>
        `;
    }).join('');

    container.innerHTML = `
        <div class="media-container" style="max-width: 950px; margin: 0 auto; padding: 25px 15px;">
            <div class="media-header" style="text-align: center; margin-bottom: 25px; background: linear-gradient(135deg, #0F172A, #1E293B); padding: 25px; border-radius: 16px; color: white;">
                <h1 style="margin: 0; font-size: 1.8rem; font-weight: 800;">🤖 À la découverte du MBOT</h1>
                <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 1.1rem; color: #5EEAD4; font-weight: 600;">Mais comment ça marche ?</p>
                <p style="margin: 10px 0 0 0; opacity: 0.8; font-size: 0.88rem;">Suivez les 6 capsules vidéo dans l'ordre pour tout comprendre sur le robot mBot.</p>
            </div>

            <!-- Boutons de sélection des vidéos -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; margin-bottom: 25px;">
                ${buttonsHTML}
            </div>

            <!-- Lecteur Vidéo Principal -->
            <div style="background: white; border-radius: 16px; padding: 20px; box-shadow: var(--shadow-md); border: 1px solid var(--border);">
                <h3 style="margin: 0 0 15px 0; color: var(--navy); font-size: 1.2rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                    <span style="background: var(--accent); color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.85rem;">Vidéo en cours</span>
                    ${escapeHTML(activeVideo.titre)}
                </h3>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000;">
                    <iframe
                        src="${escapeHTML(activeVideo.embedUrl)}"
                        title="${escapeHTML(activeVideo.titre)}"
                        style="position: absolute; top:0; left:0; width: 100%; height: 100%; border:0;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-menu" onclick="showDashboard(currentStudent ? currentStudent.niveau : '4eme')" style="padding: 10px 24px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer;">
                    ↩️ Retour au tableau de bord
                </button>
            </div>
        </div>
    `;
}

function selectMbotVideo(index) {
    currentMbotVideoIndex = index;
    const container = document.getElementById('activityContent');
    renderMbotModuleView(container);
}

function openVideoPlayer(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const safeTitle = escapeHTML(activity.titre);
    const safeDesc = escapeHTML(activity.description);
    const safeVideoUrl = escapeHTML(activity.videoUrl);

    container.innerHTML = `
        <div class="media-container">
            <div class="media-header">
                <div>
                    <h2 class="media-title">🎬 ${safeTitle}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">${safeDesc}</p>
                </div>
            </div>
            <div class="video-player-container">
                <video controls autoplay preload="metadata">
                    <source src="${safeVideoUrl}" type="video/mp4">
                    Votre navigateur ne prend pas en charge le lecteur vidéo HTML5.
                </video>
            </div>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
