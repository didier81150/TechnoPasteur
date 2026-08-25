# 📗 GUIDE CONFIGURATION GOOGLE APPS SCRIPT & GOOGLE DRIVE

Ce guide vous explique pas à pas comment installer le script dans votre compte Google pour :
1. **Créer un dossier Google Drive** où seront automatiquement enregistrés tous les rapports de stage PDF déposés par vos élèves.
2. **Enregistrer et consulter les notes** de vos élèves dans une feuille de calcul Google Sheets.

---

## 🛠️ ÉTAPE 1 : Créer le dossier Google Drive & le Google Sheet

1. Ouvrez [Google Drive](https://drive.google.com).
2. Créez un nouveau dossier nommé **`Rapports de Stage - 3ème`**.
3. Ouvrez ce dossier, puis copiez son **ID de dossier** depuis l'URL de votre navigateur :
   - Exemple d'URL : `https://drive.google.com/drive/folders/1abc23xyz_ID_DU_DOSSIER_ICI`
   - L'ID est la suite de caractères après `/folders/`.
4. Dans ce même dossier (ou dans votre Drive), créez un Google Sheet nommé **`Notes_Rapports_Stage`**.
5. Dans ce Google Sheet, créez une feuille nommée `Notes` avec la ligne d'en-tête suivante sur la ligne 1 :
   - Colonne A : `Classe`
   - Colonne B : `Élève`
   - Colonne C : `Note`
   - Colonne D : `Date`

---

## 💻 ÉTAPE 2 : Intégrer le Code Google Apps Script

1. Dans votre Google Sheet (ou directement sur [script.google.com](https://script.google.com)), cliquez sur **Extensions > Apps Script**.
2. Remplacez tout le contenu par le code ci-dessous :

```javascript
// =================================================================
// GOOGLE APPS SCRIPT - GESTION DES DÉPÔTS DE RAPPORTS PDF & NOTES
// =================================================================

// ⚠️ REMPLACEZ CET ID PAR L'ID DE VOTRE DOSSIER GOOGLE DRIVE
const DRIVE_FOLDER_ID = "VOTRE_ID_DE_DOSSIER_GOOGLE_DRIVE_ICI";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // 1. GESTION DU DÉPÔT DE FICHIER PDF DANS GOOGLE DRIVE
    if (data.action === "upload_pdf" || data.fileData) {
      const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
      const decodedData = Utilities.base64Decode(data.fileData);

      // Nom du fichier : utilise le nom fourni ou reconstruit nom-prenom-classe.pdf
      let fileName = data.filename || (data.expectedFilename || "rapport.pdf");
      if (!fileName.toLowerCase().endsWith(".pdf")) {
        fileName += ".pdf";
      }

      const blob = Utilities.newBlob(decodedData, "application/pdf", fileName);
      const file = folder.createFile(blob);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Fichier PDF enregistré dans Google Drive",
        fileUrl: file.getUrl()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. GESTION DE LA SAISIE DE NOTE (PRONOTE)
    if (data.classe && data.eleve && data.note !== undefined) {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Notes") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow([
        data.classe,
        data.eleve,
        data.note,
        new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR')
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Note enregistrée avec succès"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action non reconnue" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Notes") || SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }

    const classeFilter = e.parameter.classe;
    const eleveFilter = e.parameter.eleve;

    const results = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const classe = row[0];
      const eleve = row[1];
      const note = row[2];

      if (classeFilter && classe.toString() !== classeFilter.toString()) continue;
      if (eleveFilter && eleve.toString() !== eleveFilter.toString()) continue;

      results.push({ classe: classe, eleve: eleve, note: note });
    }

    return ContentService.createTextOutput(JSON.stringify(results))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🚀 ÉTAPE 3 : Déployer l'Apps Script en Application Web

1. Dans Apps Script, cliquez en haut à droite sur **Déployer > Nouveau déploiement**.
2. Cliquez sur l'icône d'engrenage ⚙️ à côté de *Sélect. type* et choisissez **Application Web**.
3. Renseignez la configuration suivante :
   - **Description** : `API Rapport de Stage`
   - **Exécuter en tant que** : `Moi (votre_email@gmail.com)`
   - **Qui a accès** : `Tout le monde` *(indispensable pour que le site puisse envoyer les rapports sans demander une connexion Google aux élèves)*.
4. Cliquez sur **Déployer**, validez les autorisations Google (cliquez sur *Paramètres avancés* > *Accéder au projet (non sécurisé)*).
5. Copiez l'**URL de l'application Web** générée (qui se termine par `/exec`).
6. Collez cette URL dans vos fichiers du projet `site-techno` :
   - Dans `js/config.js` -> `RESULTS_WEB_APP_URL`
   - Dans `js/stage.js` -> `STAGE_WEB_APP_URL`
