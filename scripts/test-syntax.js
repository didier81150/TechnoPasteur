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
    'js/systemes_automatiques.js',
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

console.log("🛡️ Vérification des assertions de sécurité...");

// Test 1: Absence de hash admin en dur dans le JS
const profJsContent = fs.readFileSync(path.join(jsDir, 'prof.js'), 'utf8');
const stageJsContent = fs.readFileSync(path.join(jsDir, 'stage.js'), 'utf8');

if (profJsContent.includes('ADMIN_PASSWORD_HASH') || stageJsContent.includes('ADMIN_PASSWORD_HASH')) {
    console.error("❌ ÉCHEC SÉCURITÉ: 'ADMIN_PASSWORD_HASH' trouvé dans le code frontend.");
    process.exit(1);
}

// Test 2: Absence de master passwords
const annuaireJsContent = fs.readFileSync(path.join(jsDir, 'annuaire.js'), 'utf8');
if (annuaireJsContent.includes('isMasterPassword') || annuaireJsContent.includes('prof2024')) {
    console.error("❌ ÉCHEC SÉCURITÉ: Mots de passe master trouvés dans annuaire.js.");
    process.exit(1);
}

// Test 3: Absence de données élèves réelles dans stage.js
if (stageJsContent.includes('AMRI Younes') || stageJsContent.includes('BEAUCERF Aaron')) {
    console.error("❌ ÉCHEC SÉCURITÉ: Données nominatives d'élèves réels trouvées dans stage.js.");
    process.exit(1);
}

// Test 4: Présence du helper escapeHTML dans config.js
const configJsContent = fs.readFileSync(path.join(jsDir, 'config.js'), 'utf8');
if (!configJsContent.includes('function escapeHTML')) {
    console.error("❌ ÉCHEC SÉCURITÉ: Fonction 'escapeHTML' absente de config.js.");
    process.exit(1);
}

console.log("✅ Toutes les assertions de sécurité sont validées.");
console.log("🎉 Validation complète et tests de sécurité réussis ! Le projet est prêt.");
