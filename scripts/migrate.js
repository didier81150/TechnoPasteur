require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const Student = require('../server/models/Student');
const Activity = require('../server/models/Activity');
const StageNote = require('../server/models/StageNote');
const Result = require('../server/models/Result');

// URLs des Google Sheets intégrées dans le front-end
const ANNUAIRE_CSV_URLS = {
    '5eme': 'https://docs.google.com/spreadsheets/d/1HRz8G2-i8Pn9dOLHWQgGrbycfJNx6BzcaLsgmA3tCks/export?format=csv',
    '4eme': 'https://docs.google.com/spreadsheets/d/1-u2cr0GIEheeC4C4aSozYghTIE-H_EtsPt9ZGmdict4/export?format=csv',
    '3eme': 'https://docs.google.com/spreadsheets/d/12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w/export?format=csv'
};

const STAGE_NOTES_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR99nXZ-5Y6l52AludzKXoOz8sHjCcOTT05qXSyj6IzoEAmBI9f57zxwrmqMwuP87JMS8F3NB2MMJIn/pub?output=csv';
const RESULTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1mjbyJjB3hlp6hg-uw6IzV5W6c3kZXTT7jW5EWA9pRBU/export?format=csv';

// Base d'activités par défaut
const DEFAULT_ACTIVITIES = [
    { code: "5_qcm_besoins", niveau: "5eme", titre: "QCM – Objets, Besoins & Fonctions", type: "qcm", description: "Évaluation sur l'analyse du besoin, la fonction d'usage et la fonction d'estime des objets techniques.", defaultUnlocked: true, quizId: "demo_5", ordre: 1 },
    { code: "5_pdf_cours", niveau: "5eme", titre: "Fiche Synthèse – Les Familles de Matériaux", type: "pdf", description: "Document de cours récapitulatif sur l'origine et le classement des matériaux.", defaultUnlocked: true, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", ordre: 2 },
    { code: "5_video_energies", niveau: "5eme", titre: "Vidéo – Chaîne d'Énergie & Matériaux", type: "video", description: "Capsule vidéo explicative sur la chaîne d'énergie et l'isolation.", defaultUnlocked: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", ordre: 3 },
    { code: "4_analyse_fonctionnelle", niveau: "4eme", titre: "Analyse Fonctionnelle – Expression du Besoin", type: "analyse", description: "Cours, entraînement au graphe des prestations (bête à cornes) et évaluation QCM.", defaultUnlocked: false, pdfUrl: "https://drive.google.com", ordre: 1 },
    { code: "4_qcm_materiaux_1", niveau: "4eme", titre: "Score 1 – QCM Type Objets", type: "qcm", description: "Évaluation sur les caractéristiques fondamentales des objets et des alliages.", defaultUnlocked: true, quizId: 1, ordre: 2 },
    { code: "4_qcm_materiaux_2", niveau: "4eme", titre: "Score 2 – QCM Objets & Matériaux 1", type: "qcm", description: "Évaluation approfondie : caractéristiques mécaniques et traitements thermiques.", defaultUnlocked: true, quizId: 2, ordre: 3 },
    { code: "4_qcm_materiaux_3", niveau: "4eme", titre: "Score 3 – QCM Objets & Matériaux 2", type: "qcm", description: "Évaluation avancée : propriétés des polymères, métaux et résilience.", defaultUnlocked: true, quizId: 3, ordre: 4 },
    { code: "4_pdf_materiaux", niveau: "4eme", titre: "Fiche Synthèse – Propriétés des Matériaux", type: "pdf", description: "Fiche de cours résumant conductivité, masse volumique et tenue mécanique.", defaultUnlocked: true, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", ordre: 5 },
    { code: "3_qcm_automatismes", niveau: "3eme", titre: "QCM – Automatismes & Prototypage", type: "qcm", description: "Évaluation sur la chaîne d'information, les capteurs et microcontrôleurs.", defaultUnlocked: true, quizId: "demo_3", ordre: 1 },
    { code: "3_pdf_revisions", niveau: "3eme", titre: "Fiche Synthèse – Fiche Brevet Technologie", type: "pdf", description: "Synthèse complète des révisions pour l'épreuve du Brevet des Collèges.", defaultUnlocked: true, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", ordre: 2 },
    { code: "3_video_robotique", niveau: "3eme", titre: "Vidéo – Prototypage & Impression 3D", type: "video", description: "Vidéo de présentation des techniques de fabrication additive et CFAO.", defaultUnlocked: false, videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", ordre: 3 },
    { code: "3_rapport_stage", niveau: "3eme", titre: "Rapport de Stage", type: "stage", description: "Espace Rapport de Stage : documents ressource, dépôt du rapport PDF et gestion des évaluations.", defaultUnlocked: true, ordre: 4 },
    { code: "3_eval_competences", niveau: "3eme", titre: "Évaluation Compétences 3ème", type: "eval_competences", description: "Évaluation globale des compétences 3ème (90 questions). Accès déverrouillé par l'enseignant.", defaultUnlocked: false, ordre: 5 }
];

async function fetchCsvText(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.text();
    } catch (e) {
        return null;
    }
}

function parseCsv(csvText) {
    if (!csvText) return [];
    const lines = csvText.split('\n').filter(l => l.trim() !== '');
    if (lines.length < 2) return [];

    const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(/[;,]/).map(v => v.trim().replace(/"/g, ''));
        const row = {};
        headers.forEach((h, idx) => {
            row[h] = values[idx] || '';
        });
        rows.push({ _headers: headers, _raw: values, ...row });
    }
    return rows;
}

async function migrateStudents() {
    console.log('🔄 Migration des élèves depuis les Google Sheets...');
    let count = 0;

    for (const [nivKey, url] of Object.entries(ANNUAIRE_CSV_URLS)) {
        let csvText = await fetchCsvText(url);

        // Si indisponible en ligne, vérifier si un fichier local existe (ex: data/annuaire_5eme.csv)
        if (!csvText) {
            const localFile = path.join(__dirname, `../data/annuaire_${nivKey}.csv`);
            if (fs.existsSync(localFile)) {
                console.log(`📂 Lecture du fichier CSV local : ${localFile}`);
                csvText = fs.readFileSync(localFile, 'utf8');
            }
        }

        if (!csvText) {
            console.warn(`⚠️ Impossible de télécharger l'annuaire pour le niveau ${nivKey}`);
            continue;
        }

        const rows = parseCsv(csvText);
        console.log(`📋 ${rows.length} lignes trouvées pour le niveau ${nivKey}`);

        for (const row of rows) {
            const headers = row._headers;
            const values = row._raw;

            const nomIdx = headers.findIndex(h => h === 'nom' || h.includes('nom'));
            const prenomIdx = headers.findIndex(h => h.includes('prenom') || h.includes('prénom'));
            const classeIdx = headers.findIndex(h => h.includes('classe'));
            const pwdIdx = headers.findIndex(h => h.includes('pass') || h.includes('code') || h.includes('mot') || h.includes('secret'));
            const ppaIdx = headers.findIndex(h => h === 'ppa' || h === 'pap' || h.includes('ppa') || h.includes('pap'));

            const nom = nomIdx !== -1 ? values[nomIdx] : row.nom;
            const prenom = prenomIdx !== -1 ? values[prenomIdx] : (row.prenom || row['prénom']);
            let classe = classeIdx !== -1 ? values[classeIdx] : row.classe;
            const rawPwd = pwdIdx !== -1 ? values[pwdIdx] : (row.code_secret || row.mot_de_passe || '1234');
            const ppaRaw = ppaIdx !== -1 ? values[ppaIdx] : (row.ppa || row.pap || '');

            if (!nom || !nom.trim()) continue;

            const cleanNom = nom.trim().toUpperCase();
            const cleanPrenom = prenom ? prenom.trim() : '';

            if (!classe || !classe.trim()) {
                classe = `${nivKey.replace('eme', 'ème')} A`;
            } else {
                classe = classe.trim();
            }

            let niveau = nivKey;
            if (classe.includes('5')) niveau = '5eme';
            else if (classe.includes('4')) niveau = '4eme';
            else if (classe.includes('3')) niveau = '3eme';

            const isPpa = ['o', 'oui', 'true', '1', 'vrai'].includes((ppaRaw || '').toLowerCase().trim());
            const plainPassword = rawPwd && rawPwd.trim() ? rawPwd.trim() : '1234';
            const hashedCode = await bcrypt.hash(plainPassword, 10);

            await Student.findOneAndUpdate(
                { niveau, classe, nom: cleanNom, prenom: cleanPrenom },
                {
                    niveau,
                    classe,
                    nom: cleanNom,
                    prenom: cleanPrenom,
                    codeSecret: hashedCode,
                    ppa: isPpa,
                    pap: isPpa,
                    actif: true
                },
                { upsert: true, new: true }
            );

            count++;
        }
    }
    console.log(`✅ ${count} élèves migrés ou mis à jour avec mots de passe hachés (bcrypt).`);
}

async function migrateActivities() {
    console.log('🔄 Initialisation des activités dans MongoDB...');
    for (const act of DEFAULT_ACTIVITIES) {
        await Activity.findOneAndUpdate(
            { code: act.code },
            act,
            { upsert: true, new: true }
        );
    }
    console.log(`✅ ${DEFAULT_ACTIVITIES.length} activités enregistrées.`);
}

async function migrateStageNotes() {
    console.log('🔄 Tentative d\'importation des notes de stage historiques...');
    const csvText = await fetchCsvText(STAGE_NOTES_CSV_URL);
    if (!csvText) {
        console.log('ℹ️ Aucune note de stage distante trouvée ou sheet non accessible.');
        return;
    }

    const rows = parseCsv(csvText);
    let count = 0;

    for (const row of rows) {
        const headers = row._headers;
        const values = row._raw;

        const nomIdx = headers.findIndex(h => h.includes('nom') && !h.includes('prenom'));
        const prenomIdx = headers.findIndex(h => h.includes('prenom') || h.includes('prénom'));
        const noteIdx = headers.findIndex(h => h.includes('note'));
        const dateIdx = headers.findIndex(h => h.includes('date'));

        const nom = nomIdx !== -1 ? values[nomIdx] : row.nom;
        const prenom = prenomIdx !== -1 ? values[prenomIdx] : (row.prenom || row['prénom']);
        const noteVal = parseFloat(noteIdx !== -1 ? values[noteIdx] : row.note);

        if (nom && !isNaN(noteVal)) {
            const cleanNom = nom.trim().toUpperCase();
            const cleanPrenom = prenom ? prenom.trim() : '';

            // Trouver l'élève pour déduire la classe
            const student = await Student.findOne({ nom: cleanNom, prenom: cleanPrenom });
            const classe = student ? student.classe : '302';

            await StageNote.findOneAndUpdate(
                { nom: cleanNom, prenom: cleanPrenom, classe },
                {
                    studentId: student ? student._id : undefined,
                    nom: cleanNom,
                    prenom: cleanPrenom,
                    niveau: '3eme',
                    classe,
                    note: noteVal,
                    prof: 'Import Google Sheet',
                    dateSaisie: dateIdx !== -1 && values[dateIdx] ? new Date(values[dateIdx]) : new Date()
                },
                { upsert: true, new: true }
            );
            count++;
        }
    }
    console.log(`✅ ${count} notes de stage historiques importées.`);
}

async function run() {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        console.error('❌ MONGODB_URI non définie. Veuillez définir la variable d\'environnement MONGODB_URI avant d\'exécuter le script.');
        process.exit(1);
    }

    try {
        console.log('🔌 Connexion à MongoDB Atlas...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté avec succès !');

        await migrateActivities();
        await migrateStudents();
        await migrateStageNotes();

        console.log('🎉 Migration globale terminée avec succès !');
        process.exit(0);
    } catch (err) {
        console.error('❌ Erreur lors de la migration :', err);
        process.exit(1);
    }
}

run();
