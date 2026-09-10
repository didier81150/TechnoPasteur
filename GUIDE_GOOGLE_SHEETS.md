# 📊 Guide d'Installation et Configuration 100% Google Sheets

Ce guide vous explique pas à pas comment configurer votre plateforme **TechnoPasteur** pour fonctionner à **100% avec Google Sheets et Google Apps Script** (sans aucune base de données externe ni serveur complexe).

---

## 📑 ÉTAPE 1 : Créer les Feuilles Google Sheets

Rendez-vous sur [Google Sheets](https://sheets.google.com) et créez vos 3 fichiers :

### 1. Fichier "Annuaire Élèves"
Créez un Google Sheet nommé **`Annuaire_Eleves`** avec une feuille contenant les colonnes suivantes sur la 1ère ligne :

| Niveau | Classe | Nom | Prenom | MotDePasse |
| :--- | :--- | :--- | :--- | :--- |
| 3ème | 301 | DUPONT | Thomas | A1B2 |
| 4ème | 401 | MARTIN | Emma | C3D4 |
| 5ème | 501 | BERNARD | Léo | E5F6 |

* Remarques :
  * La colonne **Niveau** accepte `5ème`, `5eme`, `5`, `4ème`, `3ème` etc.
  * La colonne **Classe** accepte `501` à `508`, `401` à `408`, `301` à `308`.
  * La colonne **MotDePasse** contient le code individuel transmis à l'élève.

### 2. Fichier "Annuaire Enseignants"
Créez un Google Sheet nommé **`Annuaire_Enseignants`** avec la structure suivante :

| Nom | MotDePasse |
| :--- | :--- |
| BOIVIN | DB2025! |
| MONASSON | MS2025! |

### 3. Fichier "Relevé des Notes & Activités"
Créez un Google Sheet nommé **`Releve_Notes_Techno`** pour recevoir automatiquement les résultats des QCM et les notes de stage.

---

## 🌐 ÉTAPE 2 : Publier les feuilles au format CSV

Pour que le site web puisse lire dynamiquement vos annuaires :

1. Ouvrez votre fichier Google Sheet (ex: `Annuaire_Eleves`).
2. Dans le menu, cliquez sur **Fichier ➡️ Partager ➡️ Publier sur le web**.
3. Dans la boîte de dialogue :
   * Choisissez **Feuille entière** (ou le nom de votre feuille).
   * Remplacez « Page Web » par **Valeurs séparées par des virgules (.csv)**.
4. Cliquez sur le bouton bleu **Publier**.
5. **Copiez le lien fourni** (il se termine par `output=csv`).
6. Répétez l'opération pour la feuille `Annuaire_Enseignants` et la feuille de consultation `Notes_Stage`.

---

## ⚙️ ÉTAPE 3 : Créer le Google Apps Script (Enregistrement automatique)

Pour enregistrer automatiquement les notes envoyées par le navigateur :

1. Ouvrez votre Google Sheet **`Releve_Notes_Techno`**.
2. Dans le menu, cliquez sur **Extensions ➡️ Apps Script**.
3. Supprimez tout le code présent et collez le code JavaScript ci-dessous :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Si la feuille est vide, créer les en-têtes
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Horodatage", "Type", "Niveau", "Classe", "Nom", "Prénom", "Activité/Note", "Score/Note", "Total/Barème", "Pourcentage", "Commentaire/Détails"]);
      sheet.getRange(1, 1, 1, 11).setFontWeight("bold").setBackground("#EFEFEF");
    }

    var timestamp = new Date();
    var type = data.type || "ACTIVITE";
    var niveau = data.niveau || "";
    var classe = data.classe || "";
    var nom = data.nom || "";
    var prenom = data.prenom || "";
    var activite = data.activityCode || data.prof || "Note/QCM";
    var score = data.score !== undefined ? data.score : (data.note !== undefined ? data.note : "");
    var maxScore = data.maxScore !== undefined ? data.maxScore : (data.type === "NOTE_STAGE" ? 20 : "");
    var percentage = data.percentage !== undefined ? data.percentage + "%" : "";
    var commentaire = data.commentaire || data.reponses || "";

    sheet.appendRow([
      timestamp,
      type,
      niveau,
      classe,
      nom,
      prenom,
      activite,
      score,
      maxScore,
      percentage,
      typeof commentaire === 'object' ? JSON.stringify(commentaire) : commentaire
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Le service Google Apps Script TechnoPasteur est en ligne.");
}
```

4. Cliquez sur l'icône **Enregistrer** (💾).
5. Cliquez sur le bouton bleu en haut à droite **Déployer ➡️ Nouveau déploiement**.
6. Cliquez sur le pignon ⚙️ (Sélectionner le type) et choisissez **Application Web**.
7. Remplissez les réglages :
   * **Description** : `API TechnoPasteur`
   * **Exécuter en tant que** : **Moi** *(votre adresse email)*
   * **Qui a accès** : **Tout le monde** *(Très important pour permettre l'envoi depuis le site)*
8. Cliquez sur **Déployer**, autorisez l'accès à votre compte Google, puis **copiez l'URL de l'application Web** (terminant par `/exec`).

---

## 🔗 ÉTAPE 4 : Renseigner les URL dans `js/config.js`

Ouvrez le fichier `js/config.js` de votre dépôt GitHub et collez vos liens dans l'objet `CONFIG` :

```javascript
const CONFIG = {
    USE_GOOGLE_SHEETS: true,

    // 1. Lien CSV de l'Annuaire Élèves
    GOOGLE_SHEET_ELEVES_CSV: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv",

    // 2. Lien CSV de l'Annuaire Enseignants
    GOOGLE_SHEET_ENSEIGNANTS_CSV: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=123&single=true&output=csv",

    // 3. Lien Web App Google Apps Script
    GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbx.../exec",

    // 4. Lien CSV de consultation des Notes de Stage (Optionnel)
    GOOGLE_SHEET_STAGE_NOTES_CSV: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=456&single=true&output=csv",

    // ...
};
```

---

## 🎉 C'est terminé !

Votre site web sur GitHub Pages est à présent configuré pour :
* Alimenter dynamiquement les listes déroulantes **Niveau ➡️ Classe ➡️ Élève** depuis votre Google Sheet.
* Authentifier les élèves et les enseignants.
* Enregistrer automatiquement toutes les notes d'activités et de stage directement dans votre Google Sheet en temps réel !
