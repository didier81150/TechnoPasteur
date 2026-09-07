const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    niveau: { type: String, required: true },
    classe: { type: String, required: true },
    activityCode: { type: String, required: true },
    activityType: { type: String, default: 'qcm' },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    dureeSec: { type: Number, default: 0 },
    ppa: { type: Boolean, default: false },
    reponses: { type: Array, default: [] },
    dateStr: { type: String },
    heureStr: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
