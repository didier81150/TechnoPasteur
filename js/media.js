// =====================================================
// VISIONNEUSES DE MÉDIAS (PDF ET VIDÉO UNIFIÉES)
// =====================================================

function openPdfViewer(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    container.innerHTML = `
        <div class="media-container">
            <div class="media-header">
                <div>
                    <h2 class="media-title">📄 ${activity.titre}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">${activity.description}</p>
                </div>
                <a href="${activity.pdfUrl}" target="_blank" download class="btn-start-activity" style="text-decoration: none;">
                    ⬇️ Télécharger le PDF
                </a>
            </div>
            <iframe class="pdf-viewer-frame" src="${activity.pdfUrl}">
                <p>Votre navigateur ne prend pas en charge l'affichage direct des PDF.
                <a href="${activity.pdfUrl}">Cliquez ici pour télécharger le document.</a></p>
            </iframe>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openVideoPlayer(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    container.innerHTML = `
        <div class="media-container">
            <div class="media-header">
                <div>
                    <h2 class="media-title">🎬 ${activity.titre}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 4px;">${activity.description}</p>
                </div>
            </div>
            <div class="video-player-container">
                <video controls autoplay preload="metadata">
                    <source src="${activity.videoUrl}" type="video/mp4">
                    Votre navigateur ne prend pas en charge le lecteur vidéo HTML5.
                </video>
            </div>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
