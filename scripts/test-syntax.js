const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("🔍 Validation de la structure du projet TechnoPasteur...");

const requiredFiles = [
    'index.html',
    'package.json',
    'README.md',
    'GUIDE_GOOGLE_SHEETS.md',
    'css/style.css',
    'js/config.js',
    'js/annuaire.js',
    'js/app.js',
    'js/prof.js',
    'js/stage.js',
    'js/quiz.js',
    'js/analyse.js',
    'js/capteurs_actionneurs.js',
    'js/objets_materiaux.js',
    'js/eval_competences.js',
    'js/fiches.js'
];

let missing = 0;
requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, '..', file))) {
        console.error(`❌ Fichier manquant: ${file}`);
        missing++;
    }
});

if (missing > 0) {
    console.error(`❌ Validation échouée: ${missing} fichier(s) manquant(s).`);
    process.exit(1);
}

console.log("✅ Tous les fichiers requis sont présents.");

console.log("🔍 Vérification de la syntaxe des fichiers JavaScript...");
const jsDir = path.join(__dirname, '..', 'js');
const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));

jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    try {
        execSync(`node -c "${filePath}"`);
        console.log(`  ✓ ${file} syntax OK`);
    } catch (err) {
        console.error(`❌ Erreur de syntaxe dans ${file}`);
        process.exit(1);
    }
});

console.log("🎉 Validation complète réussie ! Le projet est prêt.");
