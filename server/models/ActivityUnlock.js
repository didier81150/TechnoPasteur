const mongoose = require('mongoose');

const activityUnlockSchema = new mongoose.Schema({
    activityCode: { type: String, required: true },
    niveau: { type: String, required: true },
    classe: { type: String, default: 'ALL' }, // 'ALL' signifie pour toute la classe ou toutes les classes
    unlocked: { type: Boolean, required: true }
}, {
    timestamps: true
});

activityUnlockSchema.index({ activityCode: 1, niveau: 1, classe: 1 }, { unique: true });

module.exports = mongoose.model('ActivityUnlock', activityUnlockSchema);
