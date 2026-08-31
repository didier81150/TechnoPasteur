// =====================================================
// CONFIGURATION GLOBALE & BASE DE DONNÉES DES ACTIVITÉS
// =====================================================

const CONFIG = {
    PROF_PASSWORD: "prof2024",
    TEMPS_PAR_QUESTION: 60, // secondes par question
    PPA_BONUS_PERCENTAGE: 15,
    STORAGE_KEY_RESULTS: "qcm_materiaux_resultats",
    STORAGE_KEY_UNLOCKS: "site_techno_unlocked_activities",

    // Annuaires 5ème / 4ème / 3ème : lus automatiquement depuis Google Sheets.
    ANNUAIRE_CSV_URLS: {
        '5eme': 'https://docs.google.com/spreadsheets/d/1HRz8G2-i8Pn9dOLHWQgGrbycfJNx6BzcaLsgmA3tCks/export?format=csv',
        '4eme': 'https://docs.google.com/spreadsheets/d/1-u2cr0GIEheeC4C4aSozYghTIE-H_EtsPt9ZGmdict4/export?format=csv',
        '3eme': 'https://docs.google.com/spreadsheets/d/12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w/export?format=csv'
    },
    ANNUAIRE_CSV_URL: 'https://docs.google.com/spreadsheets/d/1-u2cr0GIEheeC4C4aSozYghTIE-H_EtsPt9ZGmdict4/export?format=csv',

    // Annuaire Enseignants (pour la saisie des notes du rapport de stage)
    ENSEIGNANTS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSavhNL7HmwKMlP7ZttTOSP7cKAfI1Wt7N52P9UDlC_gsaVoxP43EbXsCGzm11bb39QQ5Yv1vqznb41/pub?output=csv',

    // Selection des eleves de 3eme pour le rapport de stage
    STAGE_ELEVES_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTWClG07V8mZ6eNvmURE1GE1tDBMRMT0zizYm7LsT-UbCOmQh2ScK9DRJbiUkJDR0TedBtx9KIE_oqi/pub?output=csv',

    // Sheet des notes du rapport de stage
    STAGE_NOTES_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR99nXZ-5Y6l52AludzKXoOz8sHjCcOTT05qXSyj6IzoEAmBI9f57zxwrmqMwuP87JMS8F3NB2MMJIn/pub?output=csv',

    // Sheet résultats (vérification et export)
    RESULTS_CSV_URL: 'https://docs.google.com/spreadsheets/d/1mjbyJjB3hlp6hg-uw6IzV5W6c3kZXTT7jW5EWA9pRBU/export?format=csv',

    // Apps Script Web App pour enregistrement des résultats
    RESULTS_WEB_APP_URL: 'COLLER_ICI_URL_APPS_SCRIPT_DEPLOYE',

    // Web App URL pour la saisie des notes du rapport de stage
    STAGE_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzTflLVPLu73homD9vQmmsTraSTdBZzw_xZZasWxfX0iHo23fBS646ML4f_LeOL0hSWbA/exec',

    // Web App URL pour l'Analyse Fonctionnelle 4ème
    ANALYSE_WEB_APP_URL: 'COLLER_ICI_URL_APPS_SCRIPT_ANALYSE',

    // Web App URL pour l'Évaluation des Compétences 3ème
    EVAL_3EME_WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzfd0l22_ICOtzv7BVgZAlQIC8yql1Sk4MFZTdLbZXWd092oxRJfnSFlMQ14VseOs-yqg/exec'
};

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
        id: "4_qcm_materiaux_1",
        niveau: "4eme",
        titre: "Score 1 – QCM Type Objets",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation sur les caractéristiques fondamentales des objets et des alliages.",
        defaultUnlocked: true,
        quizId: 1
    },
    {
        id: "4_qcm_materiaux_2",
        niveau: "4eme",
        titre: "Score 2 – QCM Objets & Matériaux 1",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation approfondie : caractéristiques mécaniques et traitements thermiques.",
        defaultUnlocked: true,
        quizId: 2
    },
    {
        id: "4_qcm_materiaux_3",
        niveau: "4eme",
        titre: "Score 3 – QCM Objets & Matériaux 2",
        type: "qcm",
        badgeText: "QCM",
        badgeClass: "badge-qcm",
        description: "Évaluation avancée : propriétés des polymères, métaux et résilience.",
        defaultUnlocked: true,
        quizId: 3
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
