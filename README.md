# ⚙️ TechnoPasteur – Plateforme Pédagogique Technologie Collège

**TechnoPasteur** est la plateforme web interactive pour l'enseignement de la Technologie au collège Louis Pasteur (5ème, 4ème, 3ème).

L'application est **100% statique** (sans serveur ni base de données complexe à gérer) et fonctionne directement via **GitHub Pages**, appuyée par **Google Sheets** pour la gestion des annuaires et **Google Apps Script Web Apps** pour l'enregistrement automatique des évaluations et des notes de stage.

---

## 🛠️ Architecture du Projet

Le projet est conçu pour une autonomie totale et une simplicité d'hébergement :

- `index.html` : Interface web utilisateur responsive (Theme Technologie Collège).
- `css/` : Styles CSS (`style.css`).
- `js/` : Logique front-end applicative :
  - `config.js` : Configuration des URLs Google Sheets CSV & Web Apps Google Apps Script.
  - `annuaire.js` : Authentification et connexion sécurisée des élèves.
  - `prof.js` : Espace Enseignant / Administrateur (gestion du déverrouillage des activités, suivi global et export CSV PRONOTE).
  - `stage.js` : Module Rapport de Stage (documents, dépôt de rapport PDF, saisie et visualisation des notes).
  - `fiches.js` : Fiches synthèses & Cartes mentales par chapitre.
  - `quiz.js`, `analyse.js`, `capteurs_actionneurs.js`, `objets_materiaux.js`, `eval_competences.js` : Modules pédagogiques et évaluations.
- `GUIDE_GOOGLE_SHEETS.md` : Guide complet de configuration Google Sheets & Apps Script.

---

## 🔐 Sécurité & Authentification

- **Accès Administrateur** : L'accès à l'espace d'administration et au tableau de suivi enseignant est protégé par mot de passe. Le mot de passe administrateur est sécurisé par un empreinte hachée SHA-256 dans le code JS front-end (Option A sans mot de passe en clair).
- **Accès Éléves** : Chaque élève s'authentifie avec son code secret individuel défini dans la feuille de calcul Google Sheets de la classe.

---

## 🚀 Hébergement & Déploiement (GitHub Pages)

Le site est hébergé gratuitement et sans maintenance sur **GitHub Pages** :
1. Publiez le code source sur le dépôt GitHub.
2. Activez GitHub Pages dans `Settings > Pages` (Source: Branche `main` / dossier root `/`).
3. Le site est immédiatement accessible en HTTPS.

---

## 📊 Configuration Google Sheets & Apps Script

Pour lier votre propre tableur Google Sheets et recevez les notes en temps réel :
1. Consultez le fichier [`GUIDE_GOOGLE_SHEETS.md`](./GUIDE_GOOGLE_SHEETS.md).
2. Reportez les URLs publiées CSV et l'URL Web App dans `js/config.js`.
