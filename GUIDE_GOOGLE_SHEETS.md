# 📊 Guide de Configuration Google Sheets — TechnoPasteur

Ce guide vous explique pas à pas comment utiliser **Google Sheets** pour gérer l'annuaire de vos élèves, l'annuaire des enseignants, et la réception automatique des notes sans aucune dépendance à un serveur backend ou à MongoDB.

---

## Étape 1 : Créer la Feuille Google Sheets "Annuaire Élèves"

1. Ouvrez [Google Sheets](https://sheets.google.com/) et créez un nouveau tableau nommé **"TechnoPasteur - Annuaire Élèves"**.
2. Dans la première ligne (en-têtes), inscrivez exactement ces noms de colonnes :
   | Niveau | Classe | Nom | Prenom | MotDePasse | PPA | PAP |
   | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
3. Remplissez la liste de vos élèves. Exemple :
   - `5ème` | `501` | `MARTIN` | `Thomas` | `A1B2` | `Non` | `Non`
   - `4ème` | `402` | `DUPONT` | `Léa` | `C3D4` | `Oui` | `Non`
   - `3ème` | `301` | `BERNARD` | `Lucas` | `E5F6` | `Non` | `Oui`
4. Publiez le tableau au format CSV :
   - Cliquez sur **Fichier** ➡️ **Partager** ➡️ **Publier sur le web**.
   - Choisissez la feuille concernée et sélectionnez le format **Valeurs séparées par des virgules (.csv)**.
   - Cliquez sur **Publier** et copiez le lien généré.

---

## Étape 2 : Créer la Feuille Google Sheets "Annuaire Enseignants"

1. Créez un second tableau (ou un onglet) nommé **"TechnoPasteur - Enseignants"**.
2. Ajoutez les colonnes :
   | Nom | MotDePasse |
   | :--- | :--- |
3. Remplissez les identifiants des professeurs.
4. Publiez également cette feuille au format **CSV** et copiez son lien.

---

## Étape 3 : Configurer l'enregistrement automatique des notes (Google Apps Script)

Pour recevoir les notes saisies par les élèves et enseignants directement dans un Google Sheet :

1. Dans votre Google Sheet de réception des notes, allez dans le menu **Extensions** ➡️ **Apps Script**.
2. Remplacez le code par le script suivant :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.type || 'NOTE',
      data.nom || '',
      data.prenom || '',
      data.classe || '',
      data.note || data.score || '',
      data.commentaire || '',
      data.prof || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Cliquez sur **Déployer** ➡️ **Nouveau déploiement**.
4. Sélectionnez le type **Application Web** :
   - **Exécuter en tant que** : *Moi*
   - **Qui a accès** : *Tout le monde (Anyone)*
5. Cliquez sur **Déployer** et autorisez les accès. Copiez l'URL de l'application Web.

---

## Étape 3.2 : Script Google Apps Script Spécifique pour l'Évaluation des Compétences 3ème

Pour le Google Sheet dédié à l'**Évaluation des Compétences 3ème** ([Lien du Sheet](https://docs.google.com/spreadsheets/d/1FNWwGOkrjIP1V6qAobVF9KLfMNyepkEC3tqhlSst1sA/edit?usp=drivesdk)) :

1. Ouvrez votre tableau Google Sheet d'évaluation.
2. Allez dans **Extensions** ➡️ **Apps Script**.
3. Remplacez le code existant par :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Vérification / Ajout des en-têtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Nom", "Prenom", "Classe", "Score 90", "Score 20",
        "pourcentage", "Niveau 1", "Niveau 2", "Niveau 3", "Date"
      ]);
    }

    sheet.appendRow([
      data.nom || '',
      data.prenom || '',
      data.classe || '',
      data.score90 !== undefined ? data.score90 : '',
      data.score20 || '',
      data.pourcentage || '',
      data.niveau1 || '',
      data.niveau2 || '',
      data.niveau3 || '',
      data.date || new Date().toLocaleDateString('fr-FR')
    ]);

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Cliquez sur **Déployer** ➡️ **Nouveau déploiement** ➡️ **Application Web** (accès : *Tout le monde*).
5. Copiez l'URL de l'application Web et renseignez-la dans `CONFIG.GOOGLE_APPS_SCRIPT_URL` (ou `CONFIG.EVAL_3EME_WEB_APP_URL`) du fichier `js/config.js`.

---

## Étape 3.3 : Script Google Apps Script Spécifique pour l'Activité Objets & Matériaux

Pour votre Google Sheet dédié à **Objet et Matériaux** ([Lien Google Sheet](https://docs.google.com/spreadsheets/d/1mjbyJjB3hlp6hg-uw6IzV5W6c3kZXTT7jW5EWA9pRBU/edit?usp=sharing)) :

1. Ouvrez le tableau Google Sheet [1mjbyJjB3hlp6hg-uw6IzV5W6c3kZXTT7jW5EWA9pRBU](https://docs.google.com/spreadsheets/d/1mjbyJjB3hlp6hg-uw6IzV5W6c3kZXTT7jW5EWA9pRBU/edit?usp=sharing).
2. Assurez-vous que la première ligne du tableau contient exactement les en-têtes suivants (sensible à la casse) :
   | Nom | Prenom | Classe | type d'objet | note objet et materiaux 1 | note objet et materiaux 2 | note totale | Date |
   | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
3. Allez dans **Extensions** ➡️ **Apps Script**.
4. Effacez le code existant et collez ce script Apps Script :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Initialisation des en-têtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Nom", "Prenom", "Classe", "type d'objet",
        "note objet et materiaux 1", "note objet et materiaux 2",
        "note totale", "Date"
      ]);
    }

    var nom = (data.nom || "").toString().trim();
    var prenom = (data.prenom || "").toString().trim();
    var classe = (data.classe || "").toString().trim();

    var typeObjet = data["type d'objet"] || data.typeObjet || "";
    var noteMat1 = data["note objet et materiaux 1"] || data.noteMateriaux1 || "";
    var noteMat2 = data["note objet et materiaux 2"] || data.noteMateriaux2 || "";
    var noteTotale = data["note totale"] || data.noteTotale || "";
    var dateVal = data.date || new Date().toLocaleDateString('fr-FR');

    // Recherche si l'élève existe déjà dans la feuille (Mise à jour)
    var lastRow = sheet.getLastRow();
    var foundRow = -1;

    if (lastRow > 1) {
      var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = 0; i < values.length; i++) {
        var rNom = values[i][0].toString().trim();
        var rPrenom = values[i][1].toString().trim();
        var rClasse = values[i][2].toString().trim();

        if (rNom.toLowerCase() === nom.toLowerCase() &&
            rPrenom.toLowerCase() === prenom.toLowerCase() &&
            rClasse.toLowerCase() === classe.toLowerCase()) {
          foundRow = i + 2; // Ligne dans la feuille (décalage en-tête)
          break;
        }
      }
    }

    if (foundRow > 0) {
      // Mise à jour de la ligne existante
      if (typeObjet !== "") sheet.getRange(foundRow, 4).setValue(typeObjet);
      if (noteMat1 !== "") sheet.getRange(foundRow, 5).setValue(noteMat1);
      if (noteMat2 !== "") sheet.getRange(foundRow, 6).setValue(noteMat2);
      if (noteTotale !== "") sheet.getRange(foundRow, 7).setValue(noteTotale);
      sheet.getRange(foundRow, 8).setValue(dateVal);
    } else {
      // Ajout d'une nouvelle ligne
      sheet.appendRow([
        nom, prenom, classe,
        typeObjet, noteMat1, noteMat2,
        noteTotale, dateVal
      ]);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Cliquez sur **Déployer** ➡️ **Nouveau déploiement** (ou **Gérer les déploiements** ➡️ **Modifier** / **Nouvelle version**).
6. Sélectionnez **Application Web** :
   - **Exécuter en tant que** : *Moi*
   - **Qui a accès** : *Tout le monde (Anyone)*
7. Cliquez sur **Déployer** et autorisez l'accès.
8. Copiez l'URL Web App générée (ex: `https://script.google.com/macros/s/.../exec`) et collez-la dans `CONFIG.GOOGLE_APPS_SCRIPT_URL` du fichier `js/config.js`.

---

## Étape 4 : Renseigner les liens dans `js/config.js`

Collez simplement vos liens Google Sheets dans le fichier `js/config.js` de votre site :

```javascript
const CONFIG = {
    USE_GOOGLE_SHEETS: true,

    // 1. URL du CSV Annuaire Élèves
    GOOGLE_SHEET_ELEVES_CSV: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",

    // 2. URL du CSV Annuaire Enseignants
    GOOGLE_SHEET_ENSEIGNANTS_CSV: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",

    // 3. URL du Web App Google Apps Script
    GOOGLE_APPS_SCRIPT_URL: "https://script.google.com/macros/s/.../exec",

    // 4. URL du CSV Consultation des Notes de Stage
    GOOGLE_SHEET_STAGE_NOTES_CSV: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",
};
```

Votre site est désormais 100% autonome et fonctionnera sans aucune interruption !
