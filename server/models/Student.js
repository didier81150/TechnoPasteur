const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    niveau: { type: String, required: true, enum: ['5eme', '4eme', '3eme'] },
    classe: { type: String, required: true },
    nom: { type: String, required: true, uppercase: true, trim: true },
    prenom: { type: String, required: true, trim: true },
    codeSecret: { type: String, required: true }, // Stocké sous forme de hash bcrypt
    ppa: { type: Boolean, default: false },
    pap: { type: Boolean, default: false },
    actif: { type: Boolean, default: true }
}, {
    timestamps: true
});

studentSchema.index({ niveau: 1, classe: 1, nom: 1, prenom: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
