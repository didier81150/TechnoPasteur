// =====================================================
// CONFIGURATION GLOBALE & BASE DE DONNÉES DES ACTIVITÉS
// =====================================================

// Helper universel de sécurisation XSS contre les injections HTML
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

const CONFIG = {
    // Mode de fonctionnement (100% Google Sheets)
    USE_GOOGLE_SHEETS: true,

    // 1. URL du CSV Google Sheets pour l'Annuaire Élèves
    GOOGLE_SHEET_ELEVES_CSV: "https://docs.google.com/spreadsheets/d/1OjjJLMQRKO-Lu_3Wzz0VKOgCXX3I_W2Sv51ah4GYfhI/export?format=csv",

    // 2. URL du CSV Google Sheets pour l'Annuaire Enseignants
    GOOGLE_SHEET_ENSEIGNANTS_CSV: "https://docs.google.com/spreadsheets/d/1cABpA_7xuv1AmTgubnh21MnaV7XuKhM_0OVwSBWqcqI/export?format=csv",

    // 3. URL du Web App Google Apps Script pour l'enregistrement automatique des notes/activités/stage/évaluations
    GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycby9IW4WDgIY-rJTAYwl6JC2Ee0XDzUMfaVDXbyCTR4YgOCrJb0YgdOgnDjGugpZ6EqY/exec",
    EVAL_3EME_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbzb7kMOK4q8RaxMMRBi7gb6ni0no5cx75cxPKulaufgEdxi3RcWSbnz5xJCKQIXcNCSAw/exec",

    // 4. URL du CSV Google Sheets pour la consultation des Notes de Stage
    GOOGLE_SHEET_STAGE_NOTES_CSV: "https://docs.google.com/spreadsheets/d/1hVYXc11P_UCaindsid74sjz_m68ElHRLvETqhNtzV4c/export?format=csv",


    TEMPS_PAR_QUESTION: 60, // secondes par question
    PPA_BONUS_PERCENTAGE: 15,
    STORAGE_KEY_RESULTS: "qcm_materiaux_resultats",
    STORAGE_KEY_UNLOCKS: "site_techno_unlocked_activities",
    STORAGE_KEY_FICHES: "site_techno_fiches_syntheses",
};

// Chapitres et catégories pour les Fiches Synthèses & Cartes Mentales
const FICHES_CATEGORIES = [
    { id: "cat_1", title: "1. Design, innovation et créativité", icon: "🎨" },
    { id: "cat_2", title: "2. Objets techniques et changements induits dans la société", icon: "⚙️" },
    { id: "cat_3", title: "3. Modélisation et simulation des objets et systèmes techniques", icon: "📐" },
    { id: "cat_4", title: "4. Informatique et programmation", icon: "💻" },
    { id: "cat_5", title: "5. Éducation aux médias et à l'information", icon: "📰" },
    { id: "cat_6", title: "6. Toute la technologie en cartes mentales", icon: "🧠" }
];

// Helper global d'envoi de données vers Google Apps Script Web App
async function sendDataToGoogleAppsScript(payload, customUrl) {
    const targetUrl = customUrl || CONFIG.GOOGLE_APPS_SCRIPT_URL || CONFIG.EVAL_3EME_WEB_APP_URL;
    if (!targetUrl || targetUrl.trim() === '') {
        console.warn("⚠️ Aucune URL Web App Google Apps Script configurée dans CONFIG.GOOGLE_APPS_SCRIPT_URL.");
        return false;
    }

    try {
        await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        return true;
    } catch (err) {
        console.warn("⚠️ Premier essai POST Google Apps Script échoué, tentative no-cors...", err);
        try {
            await fetch(targetUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (err2) {
            console.error("❌ Échec envoi Google Apps Script :", err2);
            return false;
        }
    }
}

// Base de données unifiée des activités par niveau
const ACTIVITIES_DATABASE = [
    // --- Common Activities across levels ---
    {
        id: "5_fiches_synthese",
        niveau: "5eme",
        titre: "Fiches Synthèses & Cartes Mentales",
        type: "fiches",
        badgeText: "Fiches",
        badgeClass: "badge-pdf",
        description: "Accès aux 5 chapitres de fiches synthèses et à la carte mentale globale du collège.",
        defaultUnlocked: false
    },
    {
        id: "4_fiches_synthese",
        niveau: "4eme",
        titre: "Fiches Synthèses & Cartes Mentales",
        type: "fiches",
        badgeText: "Fiches",
        badgeClass: "badge-pdf",
        description: "Accès aux 5 chapitres de fiches synthèses et à la carte mentale globale du collège.",
        defaultUnlocked: false
    },
    {
        id: "3_fiches_synthese",
        niveau: "3eme",
        titre: "Fiches Synthèses & Cartes Mentales",
        type: "fiches",
        badgeText: "Fiches",
        badgeClass: "badge-pdf",
        description: "Accès aux 5 chapitres de fiches synthèses et à la carte mentale globale du collège.",
        defaultUnlocked: false
    },

    // --- 5ème ---
    {
        id: "5_qcm_besoins",
        niveau: "5eme",
        titre: "QCM – Objets, Besoins & Fonctions",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation sur l'analyse du besoin, la fonction d'usage et la fonction d'estime des objets techniques.",
        defaultUnlocked: false,
        quizId: "demo_5"
    },
    {
        id: "5_pdf_cours",
        niveau: "5eme",
        titre: "Fiche Synthèse – Les Familles de Matériaux",
        type: "pdf",
        badgeText: "PDF",
        badgeClass: "badge-pdf",
        description: "Document de cours récapitulatif sur l'origine et le classement des matériaux.",
        defaultUnlocked: false,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    {
        id: "5_video_energies",
        niveau: "5eme",
        titre: "Vidéo – Chaîne d'Énergie & Matériaux",
        type: "video",
        badgeText: "Vidéo",
        badgeClass: "badge-video",
        description: "Capsule vidéo explicative sur la chaîne d'énergie et l'isolation.",
        defaultUnlocked: false,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },

    // --- 4ème ---
    {
        id: "4_analyse_fonctionnelle",
        niveau: "4eme",
        titre: "Analyse Fonctionnelle – Expression du Besoin",
        type: "analyse",
        badgeText: "Analyse",
        badgeClass: "badge-quiz",
        description: "Cours, entraînement au graphe des prestations (bête à cornes) et évaluation QCM.",
        defaultUnlocked: false,
        pdfUrl: "https://drive.google.com"
    },
    {
        id: "4_capteurs_actionneurs",
        niveau: "4eme",
        titre: "Non, les robots n’ont pas de super-pouvoirs",
        type: "capteurs_actionneurs",
        badgeText: "Module",
        badgeClass: "badge-qcm",
        description: "Capteurs, détecteurs, actionneurs, interfaces… On explique clairement le rôle de chacun dans la chaîne d’un robot.",
        defaultUnlocked: false
    },
    {
        id: "4_module_objets_materiaux",
        niveau: "4eme",
        titre: "Module – Objets & Matériaux",
        type: "objets_materiaux",
        badgeText: "Module",
        badgeClass: "badge-qcm",
        description: "Parcours en 3 étapes : Type d'objet, Objet & Matériaux 1, et Objet & Matériaux 2 avec déverrouillage progressif.",
        defaultUnlocked: false
    },
    {
        id: "4_pdf_materiaux",
        niveau: "4eme",
        titre: "Fiche Synthèse – Propriétés des Matériaux",
        type: "pdf",
        badgeText: "PDF",
        badgeClass: "badge-pdf",
        description: "Documents et fiches de cours résumant les familles et propriétés des matériaux.",
        defaultUnlocked: false,
        youtubeVideo: {
            title: "Propriétés des matériaux en technologie",
            url: "https://www.youtube.com/watch?v=cpNMr0cZlRI&t=8s",
            embedUrl: "https://www.youtube.com/embed/cpNMr0cZlRI?start=8"
        },
        pdfList: [
            { titre: "Document 1 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/18xyaYbOk3_rr_HFoffTTj4g2opWDyzZL/view?usp=sharing" },
            { titre: "Document 2 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/1J7sQ6a89ZtAoxqcWq6fKucfED_p3EObV/view?usp=drive_link" },
            { titre: "Document 3 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/1lSx-KIS1Ygt1-7DdxG5k4ZhturMiTPXd/view?usp=drive_link" },
            { titre: "Document 4 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/1Bjs3WUbM_8uQpoNMKX_ftpb8VjHkHNdh/view?usp=drive_link" },
            { titre: "Document 5 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/1xjwRWG1xqopa4yf--8UlVb_peGvxUx8F/view?usp=drive_link" },
            { titre: "Document 6 – Propriétés des Matériaux", url: "https://drive.google.com/file/d/1Ro1BS2vfNQTs1OzN1JnhB0TcgrIdVXZO/view?usp=drive_link" }
        ]
    },
    {
        id: "4_mbot",
        niveau: "4eme",
        titre: "À la découverte du MBOT",
        type: "mbot",
        badgeText: "Vidéo",
        badgeClass: "badge-video",
        description: "Mais comment ça marche ? Découverte du robot programmable mBot à travers 6 capsules vidéo.",
        defaultUnlocked: false
    },

    // --- 3ème ---
    {
        id: "3_systemes_automatiques",
        niveau: "3eme",
        titre: "Les Systèmes Automatiques",
        type: "systemes_automatiques",
        badgeText: "Module",
        badgeClass: "badge-qcm",
        description: "Cours interactif & Évaluation — Composition, échanges et modes de commande ( cycle ouvert / fermé ).",
        defaultUnlocked: false
    },
    {
        id: "3_robots",
        niveau: "3eme",
        titre: "Les Robots",
        type: "robots",
        badgeText: "Module",
        badgeClass: "badge-qcm",
        description: "Découverte, histoire, impact sociétal et environnemental.",
        defaultUnlocked: false,
        pdfUrl: "https://drive.google.com/file/d/1JeJeG6JOY9ldXYv0LYj0q7NtgPHpw0Ra/view?usp=sharing"
    },
    {
        id: "3_diagramme_fast",
        niveau: "3eme",
        titre: "Analyse Fonctionnelle & Diagramme FAST",
        type: "fast",
        badgeText: "Module",
        badgeClass: "badge-quiz",
        description: "10 exercices corrigés pour maîtriser la Bête à cornes, le Diagramme Pieuvre et le Diagramme FAST.",
        defaultUnlocked: false
    },
    {
        id: "3_qcm_automatismes",
        niveau: "3eme",
        titre: "QCM – Automatismes & Prototypage",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation sur la chaîne d'information, les capteurs et microcontrôleurs.",
        defaultUnlocked: false,
        quizId: "demo_3"
    },
    {
        id: "3_pdf_revisions",
        niveau: "3eme",
        titre: "Fiches de cours",
        type: "pdf",
        badgeText: "PDF",
        badgeClass: "badge-pdf",
        description: "Documents et fiches de cours récapitulatifs pour le niveau 3ème.",
        defaultUnlocked: false,
        pdfList: [
            { titre: "La démarche projet", url: "https://drive.google.com/file/d/17s110QLzrUtOj4Jlp_XorY7OFmASmmxV/view?usp=sharing" },
            { titre: "Chaîne d’information et chaîne d’énergie d'un OT", url: "https://drive.google.com/file/d/1czYJS1h1cBAqJCOo6zajxg1FoLtRBhhB/view?usp=sharing" },
            { titre: "Le diagramme FAST", url: "https://docs.google.com/spreadsheets/d/12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w/edit?usp=sharing" }
        ]
    },
    {
        id: "3_video_robotique",
        niveau: "3eme",
        titre: "Vidéo – Prototypage & Impression 3D",
        type: "video",
        badgeText: "Vidéo",
        badgeClass: "badge-video",
        description: "Vidéo de présentation des techniques de fabrication additive et CFAO.",
        defaultUnlocked: false,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
        id: "3_rapport_stage",
        niveau: "3eme",
        titre: "Rapport de Stage",
        type: "stage",
        badgeText: "Stage",
        badgeClass: "badge-stage",
        description: "Espace Rapport de Stage : documents ressource, dépôt du rapport PDF et gestion des évaluations.",
        defaultUnlocked: false
    },
    {
        id: "3_eval_competences",
        niveau: "3eme",
        titre: "Évaluation Compétences 3ème",
        type: "eval_competences",
        badgeText: "Éval",
        badgeClass: "badge-qcm",
        description: "Évaluation globale des compétences 3ème (90 questions). Accès déverrouillé par l'enseignant.",
        defaultUnlocked: false
    }
];
