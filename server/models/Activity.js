const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true },
    niveau: { type: String, required: true, enum: ['5eme', '4eme', '3eme'] },
    titre: { type: String, required: true },
    type: { type: String, required: true }, // "qcm", "media", "pdf", "video", "analyse", "eval_competences", "stage"
    description: { type: String, default: '' },
    defaultUnlocked: { type: Boolean, default: true },
    pdfUrl: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    quizId: { type: mongoose.Schema.Types.Mixed, default: null },
    ordre: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
