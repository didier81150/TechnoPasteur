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

        let videoHTML = '';
        if (activity.youtubeVideo) {
            const safeVidTitle = escapeHTML(activity.youtubeVideo.title);
            const safeEmbedUrl = escapeHTML(activity.youtubeVideo.embedUrl);
            const safeVidUrl = escapeHTML(activity.youtubeVideo.url);

            videoHTML = `
                <div style="background: white; border-radius: 16px; padding: 22px; margin-bottom: 25px; box-shadow: var(--shadow-md); border: 1px solid var(--border);">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
                        <h3 style="margin: 0; color: var(--navy); font-size: 1.2rem; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                            <span style="background: #EF4444; color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem;">🎬 Vidéo YouTube</span>
                            ${safeVidTitle}
                        </h3>
                        <a href="${safeVidUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 0.88rem; background: #FF0000; color: white; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                            ▶️ Voir la vidéo : ${safeVidTitle}
                        </a>
                    </div>
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 12px; background: #000;">
                        <iframe
                            src="${safeEmbedUrl}"
                            title="${safeVidTitle}"
                            style="position: absolute; top:0; left:0; width: 100%; height: 100%; border:0;"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="media-container" style="max-width: 950px; margin: 0 auto;">
                <div class="media-header" style="margin-bottom: 25px;">
                    <div>
                        <h2 class="media-title">📚 ${safeTitle}</h2>
                        <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 4px;">${safeDesc}</p>
                    </div>
                </div>
                ${videoHTML}
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

function openRobotsModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const pdfUrl = activity.pdfUrl || "https://drive.google.com/file/d/1JeJeG6JOY9ldXYv0LYj0q7NtgPHpw0Ra/view?usp=sharing";

    container.innerHTML = `
        <div class="media-container" style="max-width: 950px; margin: 0 auto; padding: 25px 15px; font-family: 'Plus Jakarta Sans', sans-serif;">

            <!-- En-tête de la séquence -->
            <div style="background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 35px 25px; border-radius: 16px; text-align: center; margin-bottom: 25px; box-shadow: var(--shadow-md);">
                <h1 style="margin: 0 0 6px 0; font-size: 2.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">🤖 Les Robots</h1>
                <p style="margin: 0; opacity: 0.9; font-size: 1.05rem;">Découverte, histoire, impact sociétal et environnemental</p>
            </div>

            <!-- Bannières Ressource et Fiche Élève -->
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;">
                <a href="${escapeHTML(pdfUrl)}" target="_blank" rel="noopener noreferrer" style="background: var(--accent, #F97316); color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm); transition: transform 0.2s, opacity 0.2s;">
                    📄 Télécharger la Fiche Élève (PDF)
                </a>
            </div>

            <!-- Introduction -->
            <div style="background: white; border-left: 5px solid var(--accent, #F97316); padding: 20px 24px; margin-bottom: 30px; border-radius: 12px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <p style="margin: 0; color: var(--navy); line-height: 1.7; font-size: 1rem;">
                    Aujourd'hui, les robots sont partout : dans les champs, les usines, l'espace, les fonds marins, nos jardins et même nos salons. Leur importance scientifique, industrielle et sociétale ne cesse de grandir. Certains pensent qu'au XXIe siècle, le robot occupera une place comparable à celle qu'a tenue l'automobile au siècle dernier.
                </p>
            </div>

            <!-- ACTIVITÉ 1 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">1</span>
                    Qu'est-ce qu'un robot ?
                </h2>
                <p style="margin: 10px 0;">✏️ Complète le tableau (page 1 de la fiche élève) afin d'identifier les différents types de robots et les tâches qu'ils sont capables d'accomplir.</p>
                <p style="margin: 10px 0 6px 0; font-weight: 700; color: var(--navy);">Robots à découvrir <small style="font-weight: 400; color: var(--text-muted);">(clique sur un nom pour ouvrir l'article)</small> :</p>
                <ul style="margin: 8px 0 0 20px; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 10px; list-style: none;">
                    <li><a href="https://www.usinenouvelle.com/article/asimo-le-coureur.N1855052" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🤖 Asimo, le coureur</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/bios-de-robots-unimate-le-premier-ouvrier-mecanique.N276769" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🏭 Unimate, le premier ouvrier mécanique</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/qui-est-rosa-one-le-robot-qui-repare-les-colonnes-vertebrales.N603558" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🏥 Rosa One, le réparateur de colonnes vertébrales</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/nao-la-mascotte.N1855082" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🤖 Nao, la mascotte</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/hulc-le-gi.N1855182" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🎖️ HULC, le G.I.</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/big-dog-le-mulet.N1855202" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🐕 Big Dog, le mulet</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/pepper-l-accompagnant.N1855067" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🤝 Pepper, l'accompagnant</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/kodomoroid-plus-vrai-que-nature.N1854887" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">👤 Kodomoroid, plus vrai que nature</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/curiosity-le-scientifique.N1855127" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-weight: 600;">🚀 Curiosity, le scientifique</a></li>
                </ul>
            </div>

            <!-- ACTIVITÉ 2 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">2</span>
                    La robotique hier et aujourd'hui
                </h2>
                <p style="margin: 10px 0;">✏️ Complète <a href="https://learningapps.org/watch?v=phyrdcknn20" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 700; text-decoration: underline;">ce texte à trous en ligne</a>, puis recopie-le une fois corrigé (page 1 de la fiche élève).</p>
            </div>

            <!-- ACTIVITÉ 3 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">3</span>
                    Frise chronologique de l'évolution des robots
                </h2>
                <p style="margin: 10px 0;">✏️ Réalise une frise chronologique présentant l'évolution des robots à l'aide des vignettes distribuées par ton professeur.</p>
                <ul style="margin: 10px 0 0 20px; padding: 0;">
                    <li style="margin-bottom: 6px;">Commence par compléter les vignettes à l'aide de <a href="https://www.gotronic.fr/blog/articles/histoire-de-la-robotique" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600; text-decoration: underline;">l'histoire de la robotique</a>.</li>
                    <li style="margin-bottom: 6px;">Réalise la frise (attention au calcul de l'échelle).</li>
                    <li style="margin-bottom: 6px;">Place sur la frise 3 <a href="https://drive.google.com/file/d/1xaRUQEXyg5c8JRXusNPeBil1sXLe6SLQ/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600; text-decoration: underline;">inventions majeures</a> qui ont permis l'évolution de la robotique.</li>
                </ul>
            </div>

            <!-- ACTIVITÉ 4 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">4</span>
                    Impacts de la robotisation sur la société
                </h2>
                <p style="margin: 10px 0;">✏️ Rappelle quelles sont <a href="https://www.youtube.com/watch?v=SJq7i_3UODM" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 700; text-decoration: underline;">les étapes du cycle de vie d'un produit</a>.</p>
            </div>

            <!-- ACTIVITÉ 5 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">5</span>
                    Pourquoi remplacer un objet ?
                </h2>
                <p style="margin: 10px 0;">✏️ Donne au moins deux raisons qui expliquent pourquoi on remplace un objet.</p>
            </div>

            <!-- ACTIVITÉ 6 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">6</span>
                    Réduire les impacts environnementaux
                </h2>
                <p style="margin: 10px 0;">✏️ Comment peut-on réduire les impacts d'un objet technique sur l'environnement ?</p>
            </div>

            <!-- ACTIVITÉ 7 -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 30px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    <span style="background: var(--primary, #0F172A); color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; flex-shrink: 0;">7</span>
                    Le cas du lithium
                </h2>
                <p style="margin: 10px 0; font-style: italic; color: var(--text-muted);">
                    Comme la plupart des appareils mobiles, les robots Pepper et Nao fonctionnent grâce à une batterie au lithium — un métal disponible en grande quantité, mais dont l'extraction est source de tensions.
                </p>
                <p style="margin: 10px 0;">✏️ Résume en quelques lignes l'impact sur l'environnement et sur la société bolivienne de <a href="https://vivredemain.fr/2019/01/10/le-lithium-un-fleau-pour-lenvironnement/" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 700; text-decoration: underline;">l'extraction du lithium</a>.</p>
            </div>

            <!-- TEST DE CONNAISSANCES -->
            <div style="background: linear-gradient(135deg, #1E1B4B, #312E81); color: white; border-radius: 16px; padding: 28px; text-align: center; margin-bottom: 30px; box-shadow: var(--shadow-md);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; margin-top: 0; margin-bottom: 12px; color: #38BDF8;">🧠 Je teste mes connaissances</h2>
                <p style="margin: 0 0 20px 0; opacity: 0.9;">Entraîne-toi avec le QCM interactif en ligne :</p>
                <a href="https://learningapps.org/watch?v=pdj6h9dz521" target="_blank" rel="noopener noreferrer" style="background: #10B981; color: white; text-decoration: none; padding: 12px 28px; border-radius: 25px; font-weight: 800; font-size: 1.05rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm);">
                    ▶️ Faire le QCM interactif
                </a>
            </div>

            <!-- POUR ALLER PLUS LOIN -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 30px; box-shadow: var(--shadow-sm); border: 1px solid var(--border);">
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--navy); margin-top: 0; margin-bottom: 15px; display: flex; align-items: center; gap: 8px;">
                    🚀 Pour aller plus loin
                </h2>
                <ul style="margin: 0; padding-left: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 10px;">
                    <li><a href="https://www.youtube.com/watch?v=BbwfTex0hk8" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">🎬 L'histoire des robots en 4 minutes</a></li>
                    <li><a href="https://ladigitale.dev/digiview/#/v/02b985e7a3b2f33f" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">💻 Robotique (Digiview)</a></li>
                    <li><a href="https://www.francetvinfo.fr/sciences/high-tech/technologie-faut-il-avoir-peur-des-robots_2660458.html" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">📰 Faut-il avoir peur des robots ?</a></li>
                    <li><a href="https://www.youtube.com/watch?v=tF4DML7FIWk" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">🤖 Atlas, le robot de Boston Dynamics</a></li>
                    <li><a href="https://www.lumni.fr/video/c-est-quoi-le-developpement-durable" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">🌱 C'est quoi le développement durable ?</a></li>
                    <li><a href="https://www.lumni.fr/jeu/histoires-d-inventions" target="_blank" rel="noopener noreferrer" style="color: #2563EB; font-weight: 600;">🎮 Histoires d'inventions</a></li>
                </ul>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-menu" onclick="showDashboard(currentStudent ? currentStudent.niveau : '3eme')" style="padding: 12px 28px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer; font-size: 0.95rem; box-shadow: var(--shadow-sm);">
                    ↩️ Retour au tableau de bord
                </button>
            </div>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openFastModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    container.innerHTML = `
        <div class="media-container" style="max-width: 900px; margin: 0 auto; padding: 25px 15px; font-family: 'Plus Jakarta Sans', sans-serif;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 35px 25px; border-radius: 16px; text-align: center; margin-bottom: 20px; box-shadow: var(--shadow-md);">
                <span style="background: rgba(6, 182, 212, 0.2); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.4); padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; letter-spacing: 0.5px;">Sciences de l'Ingénieur / Technologie — 3ème</span>
                <h1 style="margin: 12px 0 6px 0; font-size: 2.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">📐 Analyse Fonctionnelle & Diagramme FAST</h1>
                <p style="margin: 0; opacity: 0.9; font-size: 1.05rem;">10 exercices corrigés pour maîtriser la Bête à cornes, le Diagramme Pieuvre et le Diagramme FAST.</p>
            </div>

            <!-- Barre de progression sticky/fixe -->
            <div style="position: sticky; top: 10px; z-index: 100; background: white; border: 1px solid var(--border); border-radius: 12px; padding: 12px 20px; margin-bottom: 25px; text-align: center; font-weight: 700; color: var(--navy); box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>📊 Exercices consultés :</span>
                <span id="fastCompteur" style="color: #2563EB; font-size: 1.1rem;">0</span>
                <span>/ 10</span>
            </div>

            <!-- Rappel des notions clés -->
            <div style="background: white; border-radius: 14px; padding: 24px; margin-bottom: 30px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                <h2 style="margin-top: 0; color: #1E4FB8; font-family: 'Outfit', sans-serif; font-size: 1.3rem; display: flex; align-items: center; gap: 8px;">
                    🧭 Rappel des notions clés
                </h2>
                <div style="margin-bottom: 12px; line-height: 1.6; color: var(--text-dark);">
                    <strong style="color: var(--navy);">La Bête à cornes</strong> — sert à exprimer le besoin auquel répond un produit, en répondant à trois questions : <em>à qui rend-il service ? sur quoi agit-il ? dans quel but ?</em>
                </div>
                <div style="margin-bottom: 12px; line-height: 1.6; color: var(--text-dark);">
                    <strong style="color: var(--navy);">Le Diagramme Pieuvre</strong> — représente les relations entre le produit et les éléments de son milieu extérieur (utilisateur, énergie, normes...). On distingue les <em>fonctions principales</em> (FP), qui relient deux éléments extérieurs entre eux via le produit, et les <em>fonctions contraintes</em> (FC), qui adaptent le produit à un seul élément extérieur.
                </div>
                <div style="line-height: 1.6; color: var(--text-dark);">
                    <strong style="color: var(--navy);">Le Diagramme FAST</strong> — permet de passer d'une fonction de service à des solutions techniques concrètes, en répondant à <em>"Comment ?"</em> (vers la droite) et <em>"Pourquoi ?"</em> (vers la gauche).
                </div>
            </div>

            <!-- NIVEAU FACILE -->
            <div style="display: flex; align-items: center; gap: 10px; margin: 30px 0 15px 0;">
                <span style="background: #10B981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Facile</span>
                <h2 style="margin: 0; font-size: 1.3rem; font-family: 'Outfit', sans-serif; color: var(--navy);">Exercices 1 à 3</h2>
            </div>

            <!-- EXO 1 -->
            <div class="fast-exo" data-n="1" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 1 —</strong> Applique la Bête à cornes à une trottinette électrique. Identifie les trois éléments du diagramme.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700; transition: background 0.2s;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;">• À qui rend-elle service ? <strong style="color: #10B981;">À l'utilisateur.</strong></p>
                    <p style="margin: 4px 0;">• Sur quoi agit-elle ? <strong style="color: #10B981;">Sur les déplacements de l'utilisateur.</strong></p>
                    <p style="margin: 4px 0;">• Dans quel but ? <strong style="color: #10B981;">Permettre un déplacement rapide et autonome sur de courtes distances.</strong></p>
                </div>
            </div>

            <!-- EXO 2 -->
            <div class="fast-exo" data-n="2" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 2 —</strong> Pour un distributeur automatique de croquettes pour animaux, cite 5 éléments du milieu extérieur qui apparaîtraient sur un diagramme pieuvre.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">1. L'animal</strong> (destinataire des croquettes) — <strong style="color: #10B981;">2. L'utilisateur</strong> (qui programme l'appareil) — <strong style="color: #10B981;">3. L'énergie</strong> (secteur ou piles) — <strong style="color: #10B981;">4. Les croquettes</strong> (contenu à distribuer) — <strong style="color: #10B981;">5. Le smartphone</strong> (application de pilotage à distance).</p>
                </div>
            </div>

            <!-- EXO 3 -->
            <div class="fast-exo" data-n="3" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 3 —</strong> Quelle est la différence entre une fonction principale (FP) et une fonction contrainte (FC) ? Illustre avec un casque audio sans fil.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;">Une <strong style="color: #10B981;">FP</strong> relie deux éléments du milieu extérieur par l'intermédiaire du produit (ex : permettre à l'utilisateur d'écouter une musique diffusée par un smartphone).</p>
                    <p style="margin: 4px 0;">Une <strong style="color: #10B981;">FC</strong> relie le produit à un seul élément extérieur, souvent une contrainte à respecter (ex : s'adapter à la forme de la tête de l'utilisateur, ou respecter les normes d'exposition aux ondes).</p>
                </div>
            </div>

            <!-- NIVEAU MOYEN -->
            <div style="display: flex; align-items: center; gap: 10px; margin: 35px 0 15px 0;">
                <span style="background: #F59E0B; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Moyen</span>
                <h2 style="margin: 0; font-size: 1.3rem; font-family: 'Outfit', sans-serif; color: var(--navy);">Exercices 4 à 6</h2>
            </div>

            <!-- EXO 4 -->
            <div class="fast-exo" data-n="4" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 4 —</strong> Décris le diagramme pieuvre d'un aspirateur robot en donnant une FP1, une FC1 (liée à l'énergie) et une FC2 (liée à l'esthétique).
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FP1 :</strong> Permettre à l'utilisateur de nettoyer le sol sans intervention manuelle.</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FC1 :</strong> Se recharger automatiquement sur sa base électrique.</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FC2 :</strong> S'intégrer discrètement dans le décor d'un intérieur.</p>
                </div>
            </div>

            <!-- EXO 5 -->
            <div class="fast-exo" data-n="5" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 5 —</strong> Pour la fonction technique "Convertir l'énergie électrique en mouvement de rotation", propose deux solutions techniques différentes.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">Solution 1 :</strong> Moteur électrique à courant continu.</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">Solution 2 :</strong> Servomoteur.</p>
                    <p style="margin: 4px 0; font-style: italic; color: var(--text-muted);">Le choix dépend de la précision de mouvement recherchée et de la charge à entraîner.</p>
                </div>
            </div>

            <!-- EXO 6 -->
            <div class="fast-exo" data-n="6" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 6 —</strong> Pour un portail automatique, complète la chaîne FAST : [ ? ] → Transmettre le mouvement → [ ? ].
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;">Premier bloc (fonction technique) : <strong style="color: #10B981;">Convertir l'énergie électrique en mouvement.</strong></p>
                    <p style="margin: 4px 0;">Dernier bloc (solution technique) : <strong style="color: #10B981;">Vérin ou bras articulé du portail.</strong></p>
                </div>
            </div>

            <!-- NIVEAU DIFFICILE -->
            <div style="display: flex; align-items: center; gap: 10px; margin: 35px 0 15px 0;">
                <span style="background: #EF4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">Difficile</span>
                <h2 style="margin: 0; font-size: 1.3rem; font-family: 'Outfit', sans-serif; color: var(--navy);">Exercices 7 à 10</h2>
            </div>

            <!-- EXO 7 -->
            <div class="fast-exo" data-n="7" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 7 —</strong> Explique pourquoi on réalise la Bête à cornes avant le diagramme FAST lors de la conception d'un produit.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;">La Bête à cornes exprime le besoin de façon <strong style="color: #10B981;">abstraite</strong>, sans imposer de solution technique, ce qui laisse toute latitude pour imaginer différentes réponses possibles.</p>
                    <p style="margin: 4px 0;">Le FAST intervient ensuite pour organiser des solutions <strong style="color: #10B981;">concrètes</strong>. Commencer directement par le FAST risquerait d'orienter la conception vers une solution technique sans avoir vérifié qu'elle répond réellement au besoin.</p>
                </div>
            </div>

            <!-- EXO 8 -->
            <div class="fast-exo" data-n="8" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 8 —</strong> Pour la fonction contrainte "Résister aux chocs", propose un critère d'appréciation et un niveau chiffré.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">Critère :</strong> Indice de résistance aux chocs (norme IK).</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">Niveau :</strong> IK08 (résistance à un choc de 5 joules).</p>
                    <p style="margin: 4px 0; font-style: italic; color: var(--text-muted);">Cette caractérisation rend la fonction mesurable et testable lors de la validation du produit.</p>
                </div>
            </div>

            <!-- EXO 9 -->
            <div class="fast-exo" data-n="9" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 9 —</strong> Sur un vélo à assistance électrique, la fonction "Réguler la vitesse" se décompose en trois sous-fonctions techniques. Lesquelles ?
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">1. Acquérir la vitesse</strong> (capteur de rotation de roue).</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">2. Traiter l'information</strong> (carte électronique comparant la vitesse mesurée à la consigne).</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">3. Agir sur le moteur</strong> (réduction ou augmentation de l'assistance électrique).</p>
                </div>
            </div>

            <!-- EXO 10 -->
            <div class="fast-exo" data-n="10" style="background: white; border: 1px solid var(--border); border-radius: 12px; margin-bottom: 30px; overflow: hidden; box-shadow: var(--shadow-sm);">
                <div style="padding: 18px 20px; background: #EEF3FD; border-bottom: 1px solid var(--border);">
                    <strong style="color: #1E4FB8;">Exercice 10 —</strong> Un client souhaite un système pour "éclairer automatiquement une allée la nuit". Rédige la FP1 puis liste 3 FC en lien avec le milieu extérieur.
                </div>
                <button onclick="toggleFastCorrection(this)" style="width: 100%; text-align: left; background: none; border: none; padding: 12px 20px; font-size: 0.95rem; color: #2563EB; cursor: pointer; font-weight: 700;">
                    Afficher la correction ▾
                </button>
                <div class="fast-correction" style="display: none; padding: 16px 20px; background: #EAFAF3; border-top: 1px dashed #B6E3CD;">
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FP1 :</strong> Permettre à l'utilisateur de bénéficier d'un éclairage automatique en fonction de la luminosité ambiante.</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FC1 :</strong> Résister aux intempéries (pluie, gel).</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FC2 :</strong> Fonctionner de façon autonome en énergie (panneau solaire ou pile).</p>
                    <p style="margin: 4px 0;"><strong style="color: #10B981;">FC3 :</strong> S'installer facilement sans câblage complexe.</p>
                </div>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-menu" onclick="showDashboard(currentStudent ? currentStudent.niveau : '3eme')" style="padding: 12px 28px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer; font-size: 0.95rem; box-shadow: var(--shadow-sm);">
                    ↩️ Retour au tableau de bord
                </button>
            </div>
        </div>
    `;

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleFastCorrection(btn) {
    const corr = btn.nextElementSibling;
    if (!corr) return;
    const isHidden = corr.style.display === 'none';
    corr.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? 'Masquer la correction ▴' : 'Afficher la correction ▾';

    if (isHidden) {
        const exo = btn.closest('.fast-exo');
        if (exo && !exo.dataset.seen) {
            exo.dataset.seen = "1";
            const c = document.getElementById('fastCompteur');
            if (c) {
                c.textContent = parseInt(c.textContent, 10) + 1;
            }
        }
    }
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
