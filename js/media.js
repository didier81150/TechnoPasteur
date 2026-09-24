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
// MODULE : SÉQUENCE 1 - 3ÈME : LES ROBOTS
// =====================================================

function openRobotsModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    container.innerHTML = `
        <div class="media-container" style="max-width: 950px; margin: 0 auto; padding: 20px 15px;">
            <div style="background: var(--navy, #1F1F1F); color: white; padding: 30px 20px; text-align: center; border-radius: 16px; margin-bottom: 25px;">
                <h1 style="margin: 0 0 8px 0; font-size: 2rem; font-weight: 800; text-transform: uppercase; color: #FFFFFF;">Séquence 1 - 3ème</h1>
                <p style="margin: 0; opacity: 0.9; font-size: 1.2rem; color: #5EEAD4; font-weight: 600;">Les robots</p>
            </div>

            <div style="background: #FFF3CD; border: 1px solid #FFE08A; padding: 14px 20px; border-radius: 10px; text-align: center; margin-bottom: 25px; font-size: 0.95rem; color: #856404; font-weight: 600;">
                🔒 Cette séquence est déverrouillée par le code fourni par ton professeur.
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 25px;">
                <a href="https://drive.google.com/file/d/1xaRUQEXyg5c8JRXusNPeBil1sXLe6SLQ/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="background: var(--primary, #DD3232); color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px;">
                    📄 Fiche élève (PDF)
                </a>
            </div>

            <div style="background: white; border-left: 5px solid var(--primary, #DD3232); padding: 20px 24px; margin-bottom: 30px; border-radius: 12px; box-shadow: var(--shadow-sm, 0 1px 4px rgba(0,0,0,0.08)); font-size: 0.98rem; line-height: 1.6;">
                <p style="margin: 0;">Aujourd'hui, les robots sont partout : dans les champs, les usines, l'espace, les fonds marins, nos jardins et même nos salons. Leur importance scientifique, industrielle et sociétale ne cesse de grandir. Certains pensent qu'au XXIe siècle, le robot occupera une place comparable à celle qu'a tenue l'automobile au siècle dernier.</p>
            </div>

            <!-- Activité 1 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">1</span>
                    Qu'est-ce qu'un robot ?
                </h2>
                <p style="margin: 0 0 12px 0;">✏️ Complète le tableau (page 1 de la fiche élève) afin d'identifier les différents types de robots et les tâches qu'ils sont capables d'accomplir.</p>
                <p style="margin: 0 0 10px 0;"><strong>Robots à découvrir</strong> (clique sur un nom pour ouvrir l'article) :</p>
                <ul style="margin: 10px 0 0 20px; padding: 0; line-height: 1.8;">
                    <li><a href="https://www.usinenouvelle.com/article/asimo-le-coureur.N1855052" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Asimo, le coureur</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/bios-de-robots-unimate-le-premier-ouvrier-mecanique.N276769" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Unimate, le premier ouvrier mécanique</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/qui-est-rosa-one-le-robot-qui-repare-les-colonnes-vertebrales.N603558" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Rosa One, le réparateur de colonnes vertébrales</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/nao-la-mascotte.N1855082" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Nao, la mascotte</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/hulc-le-gi.N1855182" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">HULC, le G.I.</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/big-dog-le-mulet.N1855202" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Big Dog, le mulet</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/pepper-l-accompagnant.N1855067" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Pepper, l'accompagnant</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/kodomoroid-plus-vrai-que-nature.N1854887" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Kodomoroid, plus vrai que nature</a></li>
                    <li><a href="https://www.usinenouvelle.com/article/curiosity-le-scientifique.N1855127" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Curiosity, le scientifique</a></li>
                </ul>
            </div>

            <!-- Activité 2 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">2</span>
                    La robotique hier et aujourd'hui
                </h2>
                <p style="margin: 0;">✏️ Complète <a href="https://learningapps.org/watch?v=phyrdcknn20" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 700; text-decoration: underline;">ce texte à trous en ligne</a>, puis recopie-le une fois corrigé (page 1 de la fiche élève).</p>
            </div>

            <!-- Activité 3 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">3</span>
                    Frise chronologique de l'évolution des robots
                </h2>
                <p style="margin: 0 0 10px 0;">✏️ Réalise une frise chronologique présentant l'évolution des robots à l'aide des vignettes distribuées par ton professeur.</p>
                <ul style="margin: 10px 0 0 20px; padding: 0; line-height: 1.8;">
                    <li>Commence par compléter les vignettes à l'aide de <a href="https://www.gotronic.fr/blog/articles/histoire-de-la-robotique" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">l'histoire de la robotique</a>.</li>
                    <li>Réalise la frise (attention au calcul de l'échelle).</li>
                    <li>Place sur la frise 3 <a href="https://drive.google.com/file/d/1xaRUQEXyg5c8JRXusNPeBil1sXLe6SLQ/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">inventions majeures</a> qui ont permis l'évolution de la robotique.</li>
                </ul>
            </div>

            <!-- Activité 4 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">4</span>
                    Impacts de la robotisation sur la société
                </h2>
                <p style="margin: 0;">✏️ Rappelle quelles sont <a href="https://www.youtube.com/watch?v=SJq7i_3UODM" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 700; text-decoration: underline;">les étapes du cycle de vie d'un produit</a>.</p>
            </div>

            <!-- Activité 5 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">5</span>
                    Pourquoi remplacer un objet ?
                </h2>
                <p style="margin: 0;">✏️ Donne au moins deux raisons qui expliquent pourquoi on remplace un objet.</p>
            </div>

            <!-- Activité 6 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">6</span>
                    Réduire les impacts environnementaux
                </h2>
                <p style="margin: 0;">✏️ Comment peut-on réduire les impacts d'un objet technique sur l'environnement ?</p>
            </div>

            <!-- Activité 7 -->
            <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0);">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--primary, #DD3232); margin: 0 0 12px 0; display: flex; align-items: center; gap: 10px; text-transform: uppercase;">
                    <span style="background: #64748B; color: white; width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">7</span>
                    Le cas du lithium
                </h2>
                <p style="margin: 0 0 10px 0;"><em>Comme la plupart des appareils mobiles, les robots Pepper et Nao fonctionnent grâce à une batterie au lithium — un métal disponible en grande quantité, mais dont l'extraction est source de tensions.</em></p>
                <p style="margin: 0;">✏️ Résume en quelques lignes l'impact sur l'environnement et sur la société bolivienne de <a href="https://vivredemain.fr/2019/01/10/le-lithium-un-fleau-pour-lenvironnement/" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 700; text-decoration: underline;">l'extraction du lithium</a>.</p>
            </div>

            <!-- Je teste mes connaissances -->
            <h2 style="font-size: 1.3rem; font-weight: 800; text-transform: uppercase; text-align: center; color: var(--navy); margin: 35px 0 15px 0;">Je teste mes connaissances</h2>
            <div style="background: white; border-radius: 12px; padding: 20px; text-align: center; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0); margin-bottom: 30px;">
                <a href="https://learningapps.org/watch?v=pdj6h9dz521" target="_blank" rel="noopener noreferrer" style="font-size: 1.1rem; font-weight: 700; color: white; background: var(--accent, #10B981); text-decoration: none; padding: 12px 24px; border-radius: 30px; display: inline-block;">
                    ▶ Faire le QCM
                </a>
            </div>

            <!-- Pour aller plus loin -->
            <h2 style="font-size: 1.3rem; font-weight: 800; text-transform: uppercase; text-align: center; color: var(--navy); margin: 35px 0 15px 0;">Pour aller plus loin</h2>
            <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: var(--shadow-sm); border: 1px solid var(--border, #E2E8F0); margin-bottom: 30px;">
                <ul style="margin: 0; padding-left: 20px; line-height: 1.9;">
                    <li><a href="https://www.youtube.com/watch?v=BbwfTex0hk8" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">L'histoire des robots en 4 minutes</a></li>
                    <li><a href="https://ladigitale.dev/digiview/#/v/02b985e7a3b2f33f" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Robotique</a></li>
                    <li><a href="https://www.francetvinfo.fr/sciences/high-tech/technologie-faut-il-avoir-peur-des-robots_2660458.html" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Faut-il avoir peur des robots ?</a></li>
                    <li><a href="https://www.youtube.com/watch?v=tF4DML7FIWk" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Atlas, le robot de Boston Dynamics</a></li>
                    <li><a href="https://www.lumni.fr/video/c-est-quoi-le-developpement-durable" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">C'est quoi le développement durable ?</a></li>
                    <li><a href="https://www.lumni.fr/jeu/histoires-d-inventions" target="_blank" rel="noopener noreferrer" style="color: var(--primary, #DD3232); font-weight: 600; text-decoration: underline;">Histoires d'inventions</a></li>
                </ul>
            </div>

            <div style="margin-top: 30px; text-align: center;">
                <button class="btn-menu" onclick="showDashboard(currentStudent ? currentStudent.niveau : '3eme')" style="padding: 10px 24px; border-radius: 20px; background: #64748B; color: white; border: none; font-weight: 700; cursor: pointer;">
                    ↩️ Retour au tableau de bord
                </button>
            </div>
        </div>
    `;

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
