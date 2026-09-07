# ⚙️ TechnoPasteur – Plateforme Pédagogique Technologie Collège (Backend & Front-end)

Ce projet est la plateforme web **TechnoPasteur** pour l'enseignement de la Technologie au collège (5ème, 4ème, 3ème). Il inclut un **serveur backend Node.js + Express** connecté à une **base de données MongoDB Atlas**, permettant de gérer la connexion sécurisée des élèves, le verrouillage/déverrouillage d'activités, l'enregistrement des évaluations, la saisie des notes de stage et un tableau de suivi enseignant avec export PRONOTE CSV.

---

## 🛠️ Structure du Projet

- `server/` : Le serveur API backend (Express + Mongoose)
  - `server/index.js` : Point d'entrée de l'application Express
  - `server/models/` : Modèles Mongoose (`Student`, `Activity`, `ActivityUnlock`, `Result`, `StageNote`, `ProfAction`)
- `scripts/` : Scripts d'administration
  - `scripts/migrate.js` : Script de migration automatique depuis Google Sheets/CSV vers MongoDB
- `js/` : Code JavaScript front-end navigateur (`config.js`, `annuaire.js`, `prof.js`, `stage.js`, `quiz.js`, etc.)
- `index.html` : Interface web utilisateur
- `.env.example` : Fichier modèle des variables d'environnement
- `package.json` : Fichier de configuration Node.js

---

## 🚀 GUIDE DE DÉPLOIEMENT GRATUIT PAS À PAS SUR RENDER

Vous allez héberger gratuitement votre serveur backend sur **Render.com** sans carte bancaire ni abonnement.

### Étape 1 : Publier votre code sur GitHub
1. Connectez-vous sur votre compte **GitHub**.
2. Envoyez toutes les modifications du projet sur votre dépôt GitHub (`TechnoPasteur`).

---

### Étape 2 : Créer le Web Service sur Render
1. Allez sur le site : [https://dashboard.render.com/](https://dashboard.render.com/) et connectez-vous (ou créez un compte gratuit).
2. Cliquez sur le bouton bleu **« New + »** en haut à droite, puis sélectionnez **« Web Service »**.
3. Choisissez l'option **« Build and deploy from a Git repository »** et cliquez sur **« Next »**.
4. Sélectionnez votre dépôt GitHub **`TechnoPasteur`** (ou cliquez sur **« Connect account »** pour lier votre compte GitHub).
5. Renseignez les champs comme suit :
   - **Name** : `technopasteur-backend` *(ou le nom de votre choix)*
   - **Region** : `Frankfurt (Europe)`
   - **Branch** : `main` *(ou master)*
   - **Root Directory** : *(Laissez ce champ vide)*
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server/index.js`
   - **Instance Type** : Choisissez **« Free »** (Gratuit, 0$/mois)

---

### Étape 3 : Ajouter les Variables Secrètes dans Render (Très Important)
1. Dans la même page (ou dans l'onglet **« Environment »** de votre Web Service sur Render), faites défiler jusqu'à la section **« Environment Variables »**.
2. Cliquez sur le bouton **« Add Environment Variable »** pour ajouter chacune des variables ci-dessous :

| Key (Nom de la variable) | Value (Valeur à saisir) |
| :--- | :--- |
| `MONGODB_URI` | Collez votre chaîne de connexion MongoDB Atlas complete :<br>`mongodb+srv://didierboivin81_db_user:<MOT_DE_PASSE>@cluster0.81kgxnh.mongodb.net/technopasteur?retryWrites=true&w=majority` |
| `MOT_DE_PASSE_PROF` | Saisissez votre mot de passe professeur pour le tableau de suivi (ex: `MonProfMdp2025!`) |
| `MOT_DE_PASSE_PROF_STAGE` | Saisissez le mot de passe pour les enseignants de stage (ex: `ProfStage2025!`) |
| `JWT_SECRET` | Saisissez une phrase secrète aléatoire de votre choix (ex: `SecretTechnoPasteurGraulhet2025`) |

3. Cliquez sur **« Create Web Service »** (ou **« Save Changes »**).

Render va automatiquement installer les dépendances et démarrer votre serveur backend en quelques secondes. Une URL HTTPS gratuite vous sera attribuée, par exemple :
`https://technopasteur-backend.onrender.com`

---

### Étape 4 : Lier le site front-end GitHub Pages à votre backend Render
Ouvrez le fichier `js/config.js` de votre site et mettez à jour l'URL de l'API avec votre adresse Render :
```javascript
API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://technopasteur-backend.onrender.com/api', // <-- Remplacez par votre URL Render
```

---

### Étape 5 : Lancer la Migration des Données Google Sheets vers MongoDB Atlas

Une fois votre cluster MongoDB Atlas en ligne et votre serveur déployé, lancez le script de migration depuis votre ordinateur :

1. Ouvrez un terminal dans le dossier de votre projet.
2. Créez un fichier `.env` sur votre ordinateur en copiant `.env.example` et saisissez vos vraies valeurs.
3. Exécutez la commande :
```bash
npm run migrate
```
Le script va importer automatiquement tous les élèves de 5ème, 4ème et 3ème, hacher leurs mots de passe avec `bcrypt`, créer la liste des activités et importer l'historique des notes de stage.

---

## ℹ️ Remarque sur l'offre gratuite Render
L'offre gratuite de Render met le serveur backend en veille après 15 minutes sans requête. Lorsque le premier élève ou le professeur se connecte après une période d'inactivité, le serveur peut mettre environ 30 secondes à se « réveiller ». Ce fonctionnement est totalement normal et n'entraîne aucune perte de données.
