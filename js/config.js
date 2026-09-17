// =====================================================
// CONFIGURATION GLOBALE & BASE DE DONNÉES DES ACTIVITÉS
// =====================================================

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
};

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
    // --- 5ème ---
    {
        id: "5_qcm_besoins",
        niveau: "5eme",
        titre: "QCM – Objets, Besoins & Fonctions",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation sur l'analyse du besoin, la fonction d'usage et la fonction d'estime des objets techniques.",
        defaultUnlocked: true,
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
        defaultUnlocked: true,
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
        id: "4_module_objets_materiaux",
        niveau: "4eme",
        titre: "Module – Objets & Matériaux",
        type: "objets_materiaux",
        badgeText: "Module",
        badgeClass: "badge-qcm",
        description: "Parcours en 3 étapes : Type d'objet, Objet & Matériaux 1, et Objet & Matériaux 2 avec déverrouillage progressif.",
        defaultUnlocked: true
    },
    {
        id: "4_pdf_materiaux",
        niveau: "4eme",
        titre: "Fiche Synthèse – Propriétés des Matériaux",
        type: "pdf",
        badgeText: "PDF",
        badgeClass: "badge-pdf",
        description: "Fiche de cours résumant conductivité, masse volumique et tenue mécanique.",
        defaultUnlocked: true,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },

    // --- 3ème ---
    {
        id: "3_qcm_automatismes",
        niveau: "3eme",
        titre: "QCM – Automatismes & Prototypage",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation sur la chaîne d'information, les capteurs et microcontrôleurs.",
        defaultUnlocked: true,
        quizId: "demo_3"
    },
    {
        id: "3_pdf_revisions",
        niveau: "3eme",
        titre: "Fiche Synthèse – Fiche Brevet Technologie",
        type: "pdf",
        badgeText: "PDF",
        badgeClass: "badge-pdf",
        description: "Synthèse complète des révisions pour l'épreuve du Brevet des Collèges.",
        defaultUnlocked: true,
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
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
        defaultUnlocked: true
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
