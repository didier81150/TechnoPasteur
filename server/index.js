require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Student = require('./models/Student');
const Activity = require('./models/Activity');
const ActivityUnlock = require('./models/ActivityUnlock');
const Result = require('./models/Result');
const StageNote = require('./models/StageNote');
const ProfAction = require('./models/ProfAction');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connexion MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connecté à MongoDB Atlas'))
        .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));
} else {
    console.warn('⚠️ MONGODB_URI non définie dans l\'environnement.');
}

// Helpers de vérification des mots de passe profs
function checkProfPassword(pwd) {
    const profPwd = process.env.MOT_DE_PASSE_PROF || 'prof2024';
    return pwd && pwd === profPwd;
}

function checkStageProfPassword(pwd) {
    const stagePwd = process.env.MOT_DE_PASSE_PROF_STAGE || process.env.MOT_DE_PASSE_PROF || 'prof2024';
    const mainPwd = process.env.MOT_DE_PASSE_PROF || 'prof2024';
    return pwd && (pwd === stagePwd || pwd === mainPwd);
}

// Middewares d'authentification Professeur
function authProfMiddleware(req, res, next) {
    const pwd = req.headers['x-prof-password'] || req.body.motDePasseProf;
    if (checkProfPassword(pwd)) {
        return next();
    }
    return res.status(401).json({ error: 'Accès non autorisé : Mot de passe professeur incorrect.' });
}

function authStageProfMiddleware(req, res, next) {
    const pwd = req.headers['x-prof-password'] || req.headers['x-stage-prof-password'] || req.body.motDePasseProfStage || req.body.motDePasseProf;
    if (checkStageProfPassword(pwd)) {
        return next();
    }
    return res.status(401).json({ error: 'Accès non autorisé : Mot de passe professeur stage incorrect.' });
}

// ----------------------------------------------------
// ROUTES HEALTH CHECK
// ----------------------------------------------------
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend TechnoPasteur opérationnel' });
});

// ----------------------------------------------------
// 1. ANNUAIRE & CONNEXION ÉLÈVES
// ----------------------------------------------------

// Liste des élèves filtrée par niveau et/ou classe
app.get('/api/students', async (req, res) => {
    try {
        const { niveau, classe } = req.query;
        const query = { actif: true };
        if (niveau) query.niveau = niveau;
        if (classe) query.classe = classe;

        // On n'envoie pas le champ codeSecret en clair
        const students = await Student.find(query, 'niveau classe nom prenom ppa pap actif createdAt').sort({ nom: 1, prenom: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des élèves' });
    }
});

// Connexion Élève (Vérification par bcrypt.compare)
app.post('/api/login', async (req, res) => {
    try {
        const { niveau, classe, nom, prenom, codeSecret } = req.body;

        if (!niveau || !classe || !nom || !codeSecret) {
            return res.status(400).json({ error: 'Champs manquants' });
        }

        const student = await Student.findOne({
            niveau,
            classe,
            nom: nom.trim().toUpperCase(),
            ...(prenom ? { prenom: prenom.trim() } : {})
        });

        if (!student) {
            return res.status(404).json({ error: 'Élève introuvable' });
        }

        const isMatch = await bcrypt.compare(codeSecret.trim(), student.codeSecret);
        if (!isMatch) {
            return res.status(401).json({ error: 'Code secret incorrect' });
        }

        res.json({
            id: student._id,
            niveau: student.niveau,
            classe: student.classe,
            nom: student.nom,
            prenom: student.prenom,
            ppa: student.ppa,
            pap: student.pap
        });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la connexion élève' });
    }
});

// ----------------------------------------------------
// 2. GESTION DES ACTIVITÉS & DÉVERROUILLAGE
// ----------------------------------------------------

// Récupérer la liste des activités pour un niveau donné avec statut déverrouillé dynamique
app.get('/api/activities', async (req, res) => {
    try {
        const { niveau, classe } = req.query;
        const query = {};
        if (niveau) query.niveau = niveau;

        const activities = await Activity.find(query).sort({ ordre: 1 });
        const unlocks = await ActivityUnlock.find(niveau ? { niveau } : {});

        // Mapper l'état déverrouillé selon la classe demandée ou 'ALL'
        const result = activities.map(act => {
            const actObj = act.toObject();
            let isUnlocked = act.defaultUnlocked;

            // Chercher une règle spécifique pour cette classe ou générale 'ALL'
            const classUnlock = unlocks.find(u => u.activityCode === act.code && (u.classe === classe || u.classe === 'ALL'));
            if (classUnlock) {
                isUnlocked = classUnlock.unlocked;
            }

            return {
                ...actObj,
                unlocked: isUnlocked
            };
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des activités' });
    }
});

// Déverrouiller/Verrouiller une activité (Professeur)
app.post('/api/activities/unlock', authProfMiddleware, async (req, res) => {
    try {
        const { activityCode, niveau, classe, unlocked, prof } = req.body;

        if (!activityCode || !niveau) {
            return res.status(400).json({ error: 'Données manquantes' });
        }

        const targetClasse = classe || 'ALL';

        await ActivityUnlock.findOneAndUpdate(
            { activityCode, niveau, classe: targetClasse },
            { unlocked: !!unlocked },
            { upsert: true, new: true }
        );

        // Journaliser l'action
        await ProfAction.create({
            type: unlocked ? 'unlock_activity' : 'lock_activity',
            activityCode,
            niveau,
            classe: targetClasse,
            prof: prof || 'Professeur'
        });

        res.json({ success: true, activityCode, niveau, classe: targetClasse, unlocked: !!unlocked });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la modification du verrouillage' });
    }
});

// ----------------------------------------------------
// 3. RÉSULTATS DES ACTIVITÉS
// ----------------------------------------------------

// Enregistrer un résultat d'activité
app.post('/api/results', async (req, res) => {
    try {
        const { studentId, nom, prenom, niveau, classe, activityCode, activityType, score, maxScore, percentage, dureeSec, ppa, reponses, dateStr, heureStr } = req.body;

        let student = null;
        if (studentId) {
            student = await Student.findById(studentId);
        } else if (nom && prenom && classe) {
            student = await Student.findOne({ nom: nom.toUpperCase(), prenom, classe });
        }

        const newResult = new Result({
            studentId: student ? student._id : new mongoose.Types.ObjectId(),
            nom: nom || (student ? student.nom : 'Inconnu'),
            prenom: prenom || (student ? student.prenom : ''),
            niveau: niveau || (student ? student.niveau : '4eme'),
            classe: classe || (student ? student.classe : ''),
            activityCode: activityCode || 'qcm',
            activityType: activityType || 'qcm',
            score: Number(score) || 0,
            maxScore: Number(maxScore) || 10,
            percentage: Number(percentage) || (maxScore ? Math.round((score / maxScore) * 100) : 0),
            dureeSec: Number(dureeSec) || 0,
            ppa: !!ppa,
            reponses: reponses || [],
            dateStr: dateStr || new Date().toLocaleDateString('fr-FR'),
            heureStr: heureStr || new Date().toLocaleTimeString('fr-FR')
        });

        await newResult.save();
        res.json({ success: true, result: newResult });
    } catch (err) {
        console.error('Erreur enregistrement résultat :', err);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du résultat' });
    }
});

// Récupérer les résultats pour une classe / activité
app.get('/api/results', authProfMiddleware, async (req, res) => {
    try {
        const { niveau, classe, activityCode } = req.query;
        const query = {};
        if (niveau) query.niveau = niveau;
        if (classe) query.classe = classe;
        if (activityCode) query.activityCode = activityCode;

        const results = await Result.find(query).sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur récupération résultats' });
    }
});

// Récupérer l'historique détaillé des résultats d'un élève
app.get('/api/results/student', async (req, res) => {
    try {
        const { studentId, nom, prenom, classe } = req.query;
        const query = {};

        if (studentId) {
            query.studentId = studentId;
        } else if (nom && prenom && classe) {
            query.nom = nom.toUpperCase();
            query.prenom = prenom;
            query.classe = classe;
        } else {
            return res.status(400).json({ error: 'Identifiant élève manquant' });
        }

        const results = await Result.find(query).sort({ createdAt: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Erreur récupération historique élève' });
    }
});

// ----------------------------------------------------
// 4. NOTES DE RAPPORT DE STAGE
// ----------------------------------------------------

// Saisir ou mettre à jour une note de stage
app.post('/api/stage-notes', authStageProfMiddleware, async (req, res) => {
    try {
        const { studentId, nom, prenom, classe, note, commentaire, prof, annee } = req.body;

        if (!nom || !classe || note === undefined) {
            return res.status(400).json({ error: 'Champs nom, classe et note obligatoires' });
        }

        const noteVal = Number(note);
        if (isNaN(noteVal) || noteVal < 0 || noteVal > 20) {
            return res.status(400).json({ error: 'La note doit être comprise entre 0 et 20' });
        }

        let stageNoteDoc = await StageNote.findOne({
            nom: nom.trim().toUpperCase(),
            prenom: prenom ? prenom.trim() : '',
            classe: classe.trim()
        });

        if (stageNoteDoc) {
            // Conserver l'historique de modification
            stageNoteDoc.history.push({
                note: stageNoteDoc.note,
                prof: stageNoteDoc.prof,
                commentaire: stageNoteDoc.commentaire,
                updatedAt: stageNoteDoc.updatedAt
            });
            stageNoteDoc.note = noteVal;
            stageNoteDoc.commentaire = commentaire || '';
            stageNoteDoc.prof = prof || 'Enseignant';
            stageNoteDoc.dateSaisie = new Date();
            await stageNoteDoc.save();
        } else {
            stageNoteDoc = new StageNote({
                studentId,
                nom: nom.trim().toUpperCase(),
                prenom: prenom ? prenom.trim() : '',
                classe: classe.trim(),
                annee: annee || '2025-2026',
                note: noteVal,
                commentaire: commentaire || '',
                prof: prof || 'Enseignant'
            });
            await stageNoteDoc.save();
        }

        // Journalisation
        await ProfAction.create({
            type: 'saisie_note_stage',
            niveau: '3eme',
            classe,
            prof: prof || 'Enseignant',
            details: { nom, prenom, note: noteVal }
        });

        res.json({ success: true, note: stageNoteDoc });
    } catch (err) {
        res.status(500).json({ error: 'Erreur enregistrement note de stage' });
    }
});

// Récupérer les notes de stage pour une classe / année
app.get('/api/stage-notes', authStageProfMiddleware, async (req, res) => {
    try {
        const { niveau, classe, annee } = req.query;
        const query = {};
        if (classe) query.classe = classe;
        if (annee) query.annee = annee;

        const notes = await StageNote.find(query).sort({ nom: 1, prenom: 1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: 'Erreur récupération notes de stage' });
    }
});

// ----------------------------------------------------
// 5. ESPACE PROFESSEUR & TABLEAU DE SUIVI GLOBAL
// ----------------------------------------------------

// Vérification de connexion Professeur Principal
app.post('/api/prof/login', (req, res) => {
    const { motDePasseProf } = req.body;
    if (checkProfPassword(motDePasseProf)) {
        res.json({ success: true, message: 'Authentification professeur réussie' });
    } else {
        res.status(401).json({ error: 'Mot de passe professeur incorrect' });
    }
});

// Connexion réservée pour l'Accès Enseignants Stage
app.post('/api/prof-stage/login', (req, res) => {
    const { motDePasseProfStage, motDePasseProf } = req.body;
    if (checkStageProfPassword(motDePasseProfStage || motDePasseProf)) {
        res.json({ success: true, message: 'Authentification enseignant stage réussie' });
    } else {
        res.status(401).json({ error: 'Mot de passe enseignant stage incorrect' });
    }
});

// Résumé de suivi complet pour une classe donnée (Professeur)
app.get('/api/prof/summary', authProfMiddleware, async (req, res) => {
    try {
        const { niveau, classe } = req.query;

        if (!niveau || !classe) {
            return res.status(400).json({ error: 'Veuillez préciser le niveau et la classe' });
        }

        // Récupérer tous les élèves actifs de cette classe
        const students = await Student.find({ niveau, classe, actif: true }).sort({ nom: 1, prenom: 1 });

        // Récupérer toutes les activités du niveau
        const activities = await Activity.find({ niveau }).sort({ ordre: 1 });

        // Récupérer tous les résultats des élèves de cette classe
        const results = await Result.find({ niveau, classe });

        // Récupérer toutes les notes de stage pour cette classe si niveau 3ème
        const stageNotes = (niveau === '3eme') ? await StageNote.find({ classe }) : [];

        // Assembler le tableau de synthèse par élève
        const summary = students.map(st => {
            const studentResults = results.filter(r => r.studentId.equals(st._id) || (r.nom === st.nom && r.prenom === st.prenom));

            const activityScores = {};
            activities.forEach(act => {
                const actRes = studentResults.filter(r => r.activityCode === act.code);
                if (actRes.length > 0) {
                    // Prendre la meilleure tentative ou la plus récente
                    const bestRes = actRes.reduce((prev, curr) => (curr.score > prev.score) ? curr : prev, actRes[0]);
                    activityScores[act.code] = {
                        score: bestRes.score,
                        maxScore: bestRes.maxScore,
                        percentage: bestRes.percentage,
                        date: bestRes.dateStr || bestRes.createdAt
                    };
                } else {
                    activityScores[act.code] = null;
                }
            });

            const stStageNote = stageNotes.find(sn => sn.nom === st.nom && sn.prenom === st.prenom);

            return {
                id: st._id,
                nom: st.nom,
                prenom: st.prenom,
                classe: st.classe,
                niveau: st.niveau,
                ppa: st.ppa,
                pap: st.pap,
                activityScores,
                nbActivitiesDone: Object.values(activityScores).filter(s => s !== null).length,
                stageNote: stStageNote ? stStageNote.note : null,
                stageCommentaire: stStageNote ? stStageNote.commentaire : '',
                stageProf: stStageNote ? stStageNote.prof : ''
            };
        });

        res.json({
            niveau,
            classe,
            activities,
            summary
        });
    } catch (err) {
        console.error('Erreur génération summary :', err);
        res.status(500).json({ error: 'Erreur lors de la génération du tableau de suivi' });
    }
});

// Réinitialisation sécurisée du code secret d'un élève (Professeur)
app.post('/api/prof/students/reset-password', authProfMiddleware, async (req, res) => {
    try {
        const { studentId, newCodeSecret } = req.body;

        if (!studentId || !newCodeSecret) {
            return res.status(400).json({ error: 'Identifiant élève et nouveau code secret requis' });
        }

        const hashedCode = await bcrypt.hash(newCodeSecret.trim(), 10);
        const student = await Student.findByIdAndUpdate(studentId, { codeSecret: hashedCode }, { new: true });

        if (!student) {
            return res.status(404).json({ error: 'Élève non trouvé' });
        }

        // Journalisation
        await ProfAction.create({
            type: 'reset_student_password',
            niveau: student.niveau,
            classe: student.classe,
            prof: req.body.prof || 'Professeur',
            details: { studentId, nom: student.nom, prenom: student.prenom }
        });

        res.json({ success: true, message: `Code secret réinitialisé avec succès pour ${student.nom} ${student.prenom}` });
    } catch (err) {
        res.status(500).json({ error: 'Erreur réinitialisation du code secret' });
    }
});

// Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur backend TechnoPasteur démarré sur le port ${PORT}`);
});
