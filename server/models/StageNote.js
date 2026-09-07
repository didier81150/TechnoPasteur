const mongoose = require('mongoose');

const stageNoteSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    nom: { type: String, required: true, uppercase: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    niveau: { type: String, default: '3eme' },
    classe: { type: String, required: true },
    annee: { type: String, default: '2025-2026' },
    note: { type: Number, required: true, min: 0, max: 20 },
    commentaire: { type: String, default: '' },
    prof: { type: String, default: 'Enseignant' },
    dateSaisie: { type: Date, default: Date.now },
    history: [{
        note: Number,
        prof: String,
        commentaire: String,
        updatedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('StageNote', stageNoteSchema);
