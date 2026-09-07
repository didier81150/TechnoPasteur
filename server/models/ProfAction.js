const mongoose = require('mongoose');

const profActionSchema = new mongoose.Schema({
    type: { type: String, required: true }, // ex: "unlock_activity", "lock_activity", "saisie_note_stage", "reset_student_password"
    activityCode: { type: String },
    niveau: { type: String },
    classe: { type: String },
    prof: { type: String },
    details: { type: mongoose.Schema.Types.Mixed },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('ProfAction', profActionSchema);
