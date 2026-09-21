// =====================================================
// GESTION DES FICHES SYNTHÈSES & CARTES MENTALES
// =====================================================

let currentFichesTab = "cat_1";
let currentProfFichesTab = "cat_1";

// Normalisation des URLs Google Drive pour intégration / téléchargement
function formatGoogleDriveUrl(url, type = "preview") {
    if (!url || typeof url !== 'string') return url;
    let cleanUrl = url.trim();

    // Extraire l'ID du fichier Google Drive
    let fileId = null;
    const matchFileId = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const matchIdQuery = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (matchFileId && matchFileId[1]) {
        fileId = matchFileId[1];
    } else if (matchIdQuery && matchIdQuery[1]) {
        fileId = matchIdQuery[1];
    }

    if (fileId) {
        if (type === "preview") {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        } else if (type === "view") {
            return `https://drive.google.com/file/d/${fileId}/view`;
        } else if (type === "download") {
            return `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
    }

    return cleanUrl;
}

// Récupérer les fiches stockées en LocalStorage (ou tableau vide par défaut)
function getStoredFichesData() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY_FICHES);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Erreur lors de la lecture des fiches dans localStorage:", e);
    }

    // Structure par défaut avec exemples si vide
    const defaultData = {};
    FICHES_CATEGORIES.forEach(cat => {
        defaultData[cat.id] = [];
    });
    return defaultData;
}

// Enregistrer les fiches dans LocalStorage
function saveFichesData(data) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY_FICHES, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Erreur lors de la sauvegarde des fiches dans localStorage:", e);
        return false;
    }
}

// Open the Fiches Module in Student View
function openFichesModule() {
    const activityScreen = document.getElementById('activityScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const activityContent = document.getElementById('activityContent');

    if (dashboardScreen) dashboardScreen.style.display = 'none';
    if (activityScreen) activityScreen.style.display = 'block';

    renderStudentFichesView(activityContent);
}

// Render Student View
function renderStudentFichesView(container) {
    if (!container) return;

    const data = getStoredFichesData();

    let html = `
        <div class="fiches-container">
            <div class="fiches-header">
                <h2>📚 Fiches Synthèses & Cartes Mentales</h2>
                <p>Consultez et téléchargez vos fiches de cours et la carte mentale globale du collège (Cycle 4).</p>
            </div>

            <div class="fiches-nav-tabs">
    `;

    FICHES_CATEGORIES.forEach(cat => {
        const isActive = cat.id === currentFichesTab ? 'active' : '';
        const count = (data[cat.id] || []).length;
        html += `
            <button class="fiches-tab-btn ${isActive}" onclick="switchStudentFichesTab('${cat.id}')">
                <span class="tab-icon">${cat.icon}</span>
                <span class="tab-title">${cat.title}</span>
                <span class="tab-count">${count}</span>
            </button>
        `;
    });

    html += `
            </div>

            <div class="fiches-content-panel">
                <div class="fiches-panel-header">
                    <h3>${FICHES_CATEGORIES.find(c => c.id === currentFichesTab)?.icon || ''} ${FICHES_CATEGORIES.find(c => c.id === currentFichesTab)?.title || ''}</h3>
                </div>
                <div class="fiches-grid" id="fichesGrid">
    `;

    const currentList = data[currentFichesTab] || [];

    if (currentList.length === 0) {
        html += `
            <div class="fiches-empty-state">
                <p>📂 Aucun document n'est disponible pour le moment dans cet onglet.</p>
                <p style="font-size:0.9rem; opacity:0.8;">Votre professeur ajoutera progressivement les fiches de cours.</p>
            </div>
        `;
    } else {
        currentList.forEach((item, index) => {
            const previewUrl = formatGoogleDriveUrl(item.url, "preview");
            const viewUrl = formatGoogleDriveUrl(item.url, "view");

            const safeTitle = escapeHTML(item.title || `Document ${index + 1}`);
            const safeDesc = escapeHTML(item.description || "Fiche de synthèse consultable en ligne.");
            const safeViewUrl = escapeHTML(viewUrl);

            html += `
                <div class="fiche-card">
                    <div class="fiche-card-header">
                        <span class="fiche-badge">📄 PDF</span>
                        <h4 class="fiche-title">${safeTitle}</h4>
                    </div>
                    <div class="fiche-card-body">
                        <p class="fiche-desc">${safeDesc}</p>
                    </div>
                    <div class="fiche-card-actions">
                        <button class="btn-fiche-view" onclick="openFicheViewerModal('${encodeURIComponent(item.title || '')}', '${encodeURIComponent(previewUrl)}')">
                            👁️ Consulter
                        </button>
                        <a href="${safeViewUrl}" target="_blank" class="btn-fiche-external" title="Ouvrir dans Google Drive">
                            ↗️
                        </a>
                    </div>
                </div>
            `;
        });
    }

    html += `
                </div>
            </div>
        </div>

        <!-- Modal de consultation PDF iframe -->
        <div class="modal-overlay" id="ficheViewerModal" style="display:none;">
            <div class="modal-box fiche-viewer-box">
                <div class="fiche-modal-header">
                    <h3 id="ficheModalTitle">Document</h3>
                    <button class="btn-close-modal" onclick="closeFicheViewerModal()">✖</button>
                </div>
                <div class="fiche-modal-body">
                    <iframe id="ficheModalIframe" src="" frameborder="0" allow="autoplay"></iframe>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function switchStudentFichesTab(tabId) {
    currentFichesTab = tabId;
    const container = document.getElementById('activityContent');
    renderStudentFichesView(container);
}

function openFicheViewerModal(title, previewUrl) {
    const modal = document.getElementById('ficheViewerModal');
    const titleEl = document.getElementById('ficheModalTitle');
    const iframe = document.getElementById('ficheModalIframe');

    if (modal && titleEl && iframe) {
        titleEl.textContent = decodeURIComponent(title);
        iframe.src = decodeURIComponent(previewUrl);
        modal.style.display = 'flex';
    }
}

function closeFicheViewerModal() {
    const modal = document.getElementById('ficheViewerModal');
    const iframe = document.getElementById('ficheModalIframe');
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
}

// =====================================================
// ESPACE ENSEIGNANT - GESTION DES FICHES
// =====================================================

function renderProfFichesManagement() {
    const container = document.getElementById('profFichesContent');
    if (!container) return;

    const data = getStoredFichesData();

    let html = `
        <div class="prof-fiches-mgmt">
            <p style="margin-bottom: 15px; color: #475569; font-size: 0.95rem;">
                Ajoutez facilement vos liens Google Drive pour chacune des 6 catégories. Vous pouvez ajouter jusqu'à 20 documents par catégorie.
            </p>

            <!-- Navigation des onglets dans l'espace prof -->
            <div class="prof-fiches-tabs" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px;">
    `;

    FICHES_CATEGORIES.forEach(cat => {
        const isActive = cat.id === currentProfFichesTab ? 'active' : '';
        const count = (data[cat.id] || []).length;
        html += `
            <button class="prof-tab-btn ${isActive}" onclick="switchProfFichesTab('${cat.id}')">
                ${cat.icon} ${cat.title.split('.')[1] || cat.title} (${count})
            </button>
        `;
    });

    html += `
            </div>

            <!-- Formulaire d'ajout rapide de lien Drive -->
            <div style="background:#f1f5f9; padding:15px; border-radius:10px; margin-bottom:20px; border:1px solid #cbd5e1;">
                <h4 style="margin-top:0; margin-bottom:10px; color:#0f172a;">➕ Ajouter un document PDF / Drive dans : <em>${FICHES_CATEGORIES.find(c => c.id === currentProfFichesTab)?.title}</em></h4>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Titre du document :</label>
                        <input type="text" id="newFicheTitle" placeholder="ex: Fiche Synthèse n°1 - Design" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Lien Google Drive :</label>
                        <input type="url" id="newFicheUrl" placeholder="https://drive.google.com/file/d/..." style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                    </div>
                </div>
                <div style="margin-bottom:12px;">
                    <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Description / Note (optionnel) :</label>
                    <input type="text" id="newFicheDesc" placeholder="ex: À réviser pour le devoir de synthèse" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #cbd5e1;">
                </div>
                <button type="button" onclick="addFicheDocument()" style="background:#10b981; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:600; cursor:pointer;">
                    ➕ Ajouter le document
                </button>
            </div>

            <!-- Liste des documents actuels dans cet onglet -->
            <h4 style="color:#0f172a; margin-bottom:10px;">📋 Documents enregistrés (${(data[currentProfFichesTab] || []).length}) :</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
    `;

    const currentDocs = data[currentProfFichesTab] || [];

    if (currentDocs.length === 0) {
        html += `<p style="color:#64748b; font-style:italic;">Aucun document ajouté dans cet onglet.</p>`;
    } else {
        currentDocs.forEach((doc, idx) => {
            const safeTitle = escapeHTML(doc.title || 'Sans titre');
            const safeUrl = escapeHTML(doc.url);
            const safeDesc = doc.description ? escapeHTML(doc.description) : '';
            const safeViewUrl = escapeHTML(formatGoogleDriveUrl(doc.url, "view"));

            html += `
                <div style="display:flex; align-items:center; justify-content:space-between; background:white; padding:12px 16px; border-radius:8px; border:1px solid #e2e8f0;">
                    <div style="flex:1; padding-right:15px;">
                        <strong style="color:#0f172a; display:block;">📄 ${safeTitle}</strong>
                        <span style="font-size:0.82rem; color:#64748b; word-break:break-all;">${safeUrl}</span>
                        ${safeDesc ? `<p style="font-size:0.85rem; color:#475569; margin:4px 0 0 0;">${safeDesc}</p>` : ''}
                    </div>
                    <div style="display:flex; gap:8px;">
                        <a href="${safeViewUrl}" target="_blank" style="background:#e2e8f0; color:#0f172a; text-decoration:none; padding:6px 10px; border-radius:6px; font-size:0.85rem; font-weight:600;">👁️ Tester</a>
                        <button onclick="deleteFicheDocument(${idx})" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:0.85rem; font-weight:600; cursor:pointer;">🗑️ Supprimer</button>
                    </div>
                </div>
            `;
        });
    }

    html += `
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function switchProfFichesTab(tabId) {
    currentProfFichesTab = tabId;
    renderProfFichesManagement();
}

function addFicheDocument() {
    const titleInput = document.getElementById('newFicheTitle');
    const urlInput = document.getElementById('newFicheUrl');
    const descInput = document.getElementById('newFicheDesc');

    if (!titleInput || !urlInput) return;

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();
    const description = descInput ? descInput.value.trim() : '';

    if (!title || !url) {
        alert("Veuillez saisir un titre et un lien Google Drive valide.");
        return;
    }

    const data = getStoredFichesData();

    if (!data[currentProfFichesTab]) {
        data[currentProfFichesTab] = [];
    }

    if (data[currentProfFichesTab].length >= 20) {
        alert("Vous avez atteint la limite maximale de 20 documents pour cette catégorie.");
        return;
    }

    data[currentProfFichesTab].push({
        title: title,
        url: url,
        description: description,
        dateAdded: new Date().toLocaleDateString('fr-FR')
    });

    if (saveFichesData(data)) {
        titleInput.value = '';
        urlInput.value = '';
        if (descInput) descInput.value = '';
        renderProfFichesManagement();
    } else {
        alert("Erreur lors de l'enregistrement du document.");
    }
}

function deleteFicheDocument(index) {
    if (!confirm("Voulez-vous vraiment supprimer ce document ?")) return;

    const data = getStoredFichesData();
    if (data[currentProfFichesTab] && data[currentProfFichesTab][index] !== undefined) {
        data[currentProfFichesTab].splice(index, 1);
        saveFichesData(data);
        renderProfFichesManagement();
    }
}
