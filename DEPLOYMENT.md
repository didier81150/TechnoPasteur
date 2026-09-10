# 🚀 Guide de Déploiement TechnoPasteur (Backend Render & Frontend GitHub Pages)

Ce guide simple et adapté aux débutants vous explique pas à pas comment déployer le serveur backend de **TechnoPasteur** sur **Render**, configurer les variables d'environnement secrètes, tester l'API, exécuter la migration de données et connecter votre site **GitHub Pages**.

---

## Étape 1 : Créer le service Render

1. Allez sur le site [Render.com](https://dashboard.render.com/) et connectez-vous avec votre compte.
2. Cliquez sur le bouton bleu **« New + »** (en haut à droite), puis choisissez **« Web Service »**.
3. Sélectionnez l'option **« Build and deploy from a Git repository »** et cliquez sur **« Next »**.
4. Connectez ou choisissez votre dépôt GitHub **`TechnoPasteur`**.
5. Renseignez la configuration suivante :
   - **Name** : `technopasteur-backend`
   - **Region** : `Frankfurt (Europe)` (ou la plus proche de chez vous)
   - **Branch** : `main` *(ou la branche principale de votre dépôt)*
   - **Root Directory** : *(Laissez ce champ vide)*
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `node server/index.js`
   - **Instance Type** : `Free` (Gratuit)

---

## Étape 2 : Ajouter les variables secrètes d'environnement

1. Dans la même page (ou dans l'onglet **« Environment »** de votre Web Service sur Render), allez à la section **« Environment Variables »**.
2. Cliquez sur **« Add Environment Variable »** pour ajouter les 4 variables suivantes :

| Nom de la variable (Key) | Valeur à saisir (Value) |
| :--- | :--- |
| `MONGODB_URI` | Collez votre chaîne de connexion MongoDB Atlas complète (ex: `mongodb+srv://utilisateur:motdepasse@cluster.mongodb.net/technopasteur?retryWrites=true&w=majority`) |
| `MOT_DE_PASSE_PROF` | Votre mot de passe pour l'Espace Professeur principal |
| `MOT_DE_PASSE_PROF_STAGE` | Votre mot de passe pour la saisie des notes de stage par les enseignants |
| `JWT_SECRET` | Une phrase secrète aléatoire de votre choix |

3. Cliquez sur **« Create Web Service »** (ou **« Save Changes »**).

Render va déployer automatiquement votre backend. Après 1 à 2 minutes, votre service sera en ligne et vous obtiendrez une URL HTTPS du type :
`https://technopasteur-backend.onrender.com`

---

## Étape 3 : Tester l'URL `/api/health`

1. Ouvrez votre navigateur internet.
2. Saisissez l'URL de votre backend Render suivie de `/api/health`, par exemple :
   `https://technopasteur-backend.onrender.com/api/health`
3. Vous devez recevoir un message au format JSON confirmant le bon fonctionnement :
   ```json
   { "status": "ok", "message": "Backend TechnoPasteur opérationnel" }
   ```

---

## Étape 4 : Lancer la migration des données depuis votre ordinateur

Une fois le backend en ligne et fonctionnel :

1. Sur votre ordinateur, créez (ou ouvrez) le fichier `.env` à la racine de votre projet TechnoPasteur.
2. Assurez-vous qu'il contient votre chaîne MongoDB Atlas complète :
   ```env
   MONGODB_URI=votre_chaine_mongodb_atlas_complete
   ```
3. Ouvrez votre terminal à la racine du projet et lancez la commande :
   ```bash
   npm run migrate
   ```
4. Le script va importer automatiquement tous les élèves depuis Google Sheets vers MongoDB Atlas (avec hachage des mots de passe `bcrypt`), ainsi que les activités et l'historique des notes de stage.

---

## Étape 5 : Connecter le site GitHub Pages au backend Render

1. Ouvrez le fichier `js/config.js` sur votre projet.
2. Vérifiez ou mettez à jour la valeur de `API_BASE_URL` avec l'URL exacte attribuée par Render :
   ```javascript
   API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:3000/api'
       : 'https://technopasteur-backend.onrender.com/api',
   ```
3. Envoyez vos modifications sur GitHub (`git commit` et `git push`).
4. Votre site hébergé sur **GitHub Pages** communiquera désormais en toute sécurité avec votre backend Render et votre base de données MongoDB Atlas !
