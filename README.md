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

## 📝 Configuration Google Apps Script — Dépôt des Rapports PDF sur Drive & Saisie des Notes

Pour enregistrer automatiquement les rapports PDF dans le sous-dossier **`Dépôt rapport de stage`** de votre Google Drive et enregistrer les notes dans votre Google Sheet, suivez cette procédure pas-à-pas :

### 1. Code Google Apps Script mis à jour
Ouvrez votre Google Sheet associatrice, allez dans **Extensions > Apps Script** et remplacez le code existant dans `Code.gs` par le suivant :

```javascript
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // ACTION 1 : Dépôt du rapport PDF dans le sous-dossier Google Drive "Dépôt rapport de stage"
    if (data.action === "upload_stage_report") {
      var folderName = "Dépôt rapport de stage";
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

### 2. Procédure claire et pas-à-pas pour la mise à jour sur Google Apps Script

1. **Ouvrir le projet Apps Script :**
   - Accédez à votre Google Sheet et cliquez sur le menu **Extensions** > **Apps Script**.
2. **Mettre à jour le code :**
   - Collez le code ci-dessus dans le fichier `Code.gs` et cliquez sur l'icône de **Disquette (Enregistrer)**.
3. **Mettre à jour le déploiement de la Web App :**
   - Cliquez sur le bouton bleu **Déployer** (en haut à droite), puis sélectionnez **Gérer les déploiements**.
   - Cliquez sur l'icône de **Crayon (Modifier)** à côté de la version actuelle.
   - Dans le menu déroulant **Version**, sélectionnez **Nouvelle version**.
   - Vérifiez que :
     - **Exécuter en tant que** : *Moi* (`me@gmail.com` ou votre adresse académique).
     - **Qui a accès** : *Tout le monde* (*Anyone*).
   - Cliquez sur **Déployer**.
4. **Accorder les autorisations Google Drive (si demandé) :**
   - Si Google demande d'autoriser l'accès aux fichiers Drive, cliquez sur **Autoriser l'accès**, choisissez votre compte, cliquez sur **Paramètres avancés**, puis sur **Accéder à (nom du projet)** et validez les permissions.
5. **Report de l'URL dans le code du site :**
   - Copiez l'URL de l'application Web générée (`https://script.google.com/macros/s/.../exec`).
   - Assurez-vous qu'elle est bien renseignée dans `js/config.js` pour la clé `STAGE_WEB_APP_URL`.
