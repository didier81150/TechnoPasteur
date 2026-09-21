// =====================================================
// VISIONNEUSES DE MÉDIAS (PDF ET VIDÉO UNIFIÉES)
// =====================================================

function openPdfViewer(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const safeTitle = escapeHTML(activity.titre);
    const safeDesc = escapeHTML(activity.description);
    const safePdfUrl = escapeHTML(activity.pdfUrl);

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

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
