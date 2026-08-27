# Site-Techno – Portail & Évaluations Technologie Collège

## 📌 Présentation
**Site-Techno** est la plateforme pédagogique unifiée pour l'enseignement de la Technologie au collège (niveaux 5ème, 4ème et 3ème).

Elle regroupe :
- Un système d'identification personnalisé par élève (Nom, Prénom, Classe, Mot de passe).
- La gestion des aménagements pédagogiques (temps tiers-temps / PPA +15%).
- Des parcours d'apprentissage par niveau (5ème, 4ème, 3ème) incluant QCM, fiches PDF de synthèse et ressources vidéo.
- Un espace professeur pour le déverrouillage d'activités, la consultation et l'export CSV des résultats.
- La synchronisation automatique avec Google Sheets & Google Apps Script.

---

## 🔀 Fusion des sites : Quel site conserver ?

> **Site à conserver : `site-techno`**

Le site **`site-techno`** intègre désormais l'intégralité des fonctionnalités et contenus de l'ancien site isolé **Matériaux** (notamment les évaluations et QCM Score 1, Score 2, Score 3 de 4ème).

### Recommandations :
1. **Conserver et déployer uniquement `site-techno`** (via GitHub Pages ou votre serveur d'hébergement).
2. **Archiver ou rediriger le dépôt `Matériaux`** vers l'URL de `site-techno`.
3. **Mettre à jour vos favoris / liens** transmis aux élèves pour qu'ils pointent vers `site-techno`.

---

## 📝 Configuration Google Apps Script — Saisie des Notes du Rapport de Stage

Pour enregistrer automatiquement les notes directement dans votre Google Sheet (`https://docs.google.com/spreadsheets/d/1hVYXc11P_UCaindsid74sjz_m68ElHRLvETqhNtzV4c`), suivez ces étapes :

### 1. Code Google Apps Script
Ouvrez votre Google Sheet, allez dans **Extensions > Apps Script** et collez le code suivant :

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // ACTION 1 : Dépôt du rapport PDF dans Google Drive
    if (data.action === "upload_stage_report") {
      var folderName = "Rapports de Stage 3ème";
      var folders = DriveApp.getFoldersByName(folderName);
      var folder;
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }

      var contentType = data.fileType || "application/pdf";
      var blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), contentType, data.fileName);
      var file = folder.createFile(blob);

      return ContentService
        .createTextOutput(JSON.stringify({ status: 'success', url: file.getUrl() }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // ACTION 2 : Saisie des notes du rapport de stage
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var nom = data.nom || '';
    var prenom = data.prenom || '';
    var note = data.note !== undefined ? data.note : '';
    var dateSaisie = data.date || new Date().toLocaleDateString('fr-FR');

    sheet.appendRow([nom, prenom, note, dateSaisie]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 2. Procédure de déploiement
1. Cliquez sur **Déployer > Nouveau déploiement**.
2. Sélectionnez le type **Application Web**.
3. **Exécuter en tant que** : *Moi*.
4. **Qui a accès** : *Tout le monde* (Anyone).
5. Cliquez sur **Déployer** et copiez l'URL de l'application Web générée.
6. Reportez cette URL dans `js/config.js` au niveau du champ `STAGE_WEB_APP_URL`.
