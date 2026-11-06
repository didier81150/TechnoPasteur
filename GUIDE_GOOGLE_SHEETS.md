# 📊 Guide de Configuration Google Sheets — TechnoPasteur

Ce guide vous explique pas à pas comment utiliser **Google Sheets** pour gérer l'annuaire de vos élèves, l'annuaire des enseignants, et la réception automatique des notes sans aucune dépendance à un serveur backend.

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
function doGet(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var action = e && e.parameter ? e.parameter.action : "";

    if (action === "getUnlocks") {
      var rawUnlocks = props.getProperty("site_techno_unlocks") || "{}";
      var unlocks = JSON.parse(rawUnlocks);
      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "unlocks": unlocks
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "ok"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "error": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Prise en charge de la synchronisation des déverrouillages d'activités
    if (data.type === "UNLOCK_UPDATE") {
      var props = PropertiesService.getScriptProperties();
      var rawUnlocks = props.getProperty("site_techno_unlocks") || "{}";
      var unlocksMap = JSON.parse(rawUnlocks);

      if (data.unlocks && typeof data.unlocks === "object") {
        for (var k in data.unlocks) {
          unlocksMap[k] = data.unlocks[k];
        }
      } else if (data.key) {
        unlocksMap[data.key] = Boolean(data.isUnlocked);
      }

      props.setProperty("site_techno_unlocks", JSON.stringify(unlocksMap));

      return ContentService.createTextOutput(JSON.stringify({
        "status": "success",
        "message": "Déverrouillages mis à jour",
        "unlocks": unlocksMap
      })).setMimeType(ContentService.MimeType.JSON);
    }

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

## Étape 3.4 : Script Google Apps Script Spécifique pour Les Systèmes Automatiques 3ème

Pour votre Google Sheet dédié au module **Resultats Les Systèmes Automatiques** ([Lien Google Sheet](https://docs.google.com/spreadsheets/d/1UDRPvXAzzGtxPSw1rbAl8I42U-TMj7xFOEhCu_pg0NU/edit?usp=sharing)) :

1. Ouvrez le tableau Google Sheet [1UDRPvXAzzGtxPSw1rbAl8I42U-TMj7xFOEhCu_pg0NU](https://docs.google.com/spreadsheets/d/1UDRPvXAzzGtxPSw1rbAl8I42U-TMj7xFOEhCu_pg0NU/edit?usp=sharing).
2. Assurez-vous que la première ligne du tableau contient exactement les en-têtes suivants :
   | Nom | Prenom | Classe | note /20 | Date |
   | :--- | :--- | :--- | :--- | :--- |
3. Allez dans **Extensions** ➡️ **Apps Script**.
4. Effacez le code existant et collez ce script Apps Script (qui fusionne automatiquement les résultats d'un même élève) :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Initialisation des en-têtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Nom", "Prenom", "Classe", "note /20", "Date"]);
    }

    var nom = (data.Nom || data.nom || "").toString().trim();
    var prenom = (data.Prenom || data.prenom || "").toString().trim();
    var classe = (data.Classe || data.classe || "").toString().trim();
    var note20 = (data["note /20"] || data.score20 || "").toString().trim();
    var dateVal = data.Date || data.date || new Date().toLocaleDateString('fr-FR');

    var lastRow = sheet.getLastRow();
    var foundRow = -1;

    // Recherche d'un élève existant pour la fusion automatique
    if (lastRow > 1) {
      var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = 0; i < values.length; i++) {
        var rNom = values[i][0].toString().trim();
        var rPrenom = values[i][1].toString().trim();
        var rClasse = values[i][2].toString().trim();

        if (rNom.toLowerCase() === nom.toLowerCase() &&
            rPrenom.toLowerCase() === prenom.toLowerCase() &&
            rClasse.toLowerCase() === classe.toLowerCase()) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      // Mise à jour de la note et de la date (fusion)
      sheet.getRange(foundRow, 4).setValue(note20);
      sheet.getRange(foundRow, 5).setValue(dateVal);
    } else {
      // Ajout d'une nouvelle ligne
      sheet.appendRow([nom, prenom, classe, note20, dateVal]);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Cliquez sur **Déployer** ➡️ **Nouveau déploiement** ➡️ **Application Web** (accès : *Tout le monde* / *Anyone*).
6. Copiez l'URL Web App générée et renseignez-la dans `CONFIG.SYSTEMES_AUTOMATIQUES_WEB_APP_URL` ou `CONFIG.GOOGLE_APPS_SCRIPT_URL` du fichier `js/config.js`.

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
8. Copiez l'URL Web App générée (ex: `https://script.google.com/macros/s/.../exec`) et collez-la dans `CONFIG.OBJET_MATERIAUX_WEB_APP_URL` du fichier `js/config.js`.

---

## Étape 3.6 : Script Google Apps Script Spécifique pour le Suivi des Connexions Élèves

Pour votre Google Sheet dédié au **Suivi des Connexions Élèves** :

1. Créez un nouveau classeur Google Sheets intitulé par exemple **"TechnoPasteur - Connexions Élèves"**.
2. Dans la première feuille, assurez-vous que la première ligne (ligne 1) contient exactement ces 5 colonnes :
   | Nom | Prenom | Classe | Date | Heure |
   | :--- | :--- | :--- | :--- | :--- |
3. Allez dans le menu **Extensions** ➡️ **Apps Script**.
4. Effacez le code existant et collez le script Google Apps Script suivant :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Initialisation automatique des en-têtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Nom", "Prenom", "Classe", "Date", "Heure"]);
    }

    var now = new Date();
    var nom = (data.Nom || data.nom || "").toString().trim();
    var prenom = (data.Prenom || data.prenom || "").toString().trim();
    var classe = (data.Classe || data.classe || "").toString().trim();
    var dateVal = (data.Date || data.date || Utilities.formatDate(now, "Europe/Paris", "dd/MM/yyyy")).toString().trim();
    var heureVal = (data.Heure || data.heure || Utilities.formatDate(now, "Europe/Paris", "HH:mm:ss")).toString().trim();

    // Ajout d'une nouvelle ligne d'historique de connexion
    sheet.appendRow([nom, prenom, classe, dateVal, heureVal]);

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success",
      "message": "Connexion enregistrée avec succès"
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Cliquez sur **Déployer** (bouton bleu en haut à droite) ➡️ **Nouveau déploiement**.
6. Cliquez sur l'icône d'engrenage ⚙️ à côté de *Sélectionner un type* et choisissez **Application Web** :
   - **Description** : `Suivi Connexions Élèves`
   - **Exécuter en tant que** : `Moi` (votre compte Google)
   - **Qui a accès** : `Tout le monde` (Anyone) *(très important pour que les postes élèves puissent envoyer leurs logs sans compte Google)*
7. Cliquez sur **Déployer** et autorisez l'accès si Google le demande.
8. Copiez l'**URL de l'application Web** générée (qui se termine par `/exec`).
9. Ouvrez le fichier `js/config.js` et collez cette URL dans :
   ```javascript
   LOG_CONNEXIONS_WEB_APP_URL: "https://script.google.com/macros/s/.../exec",
   ```

---

## Étape 3.5 : Script Google Apps Script Spécifique pour le Module "Les Robots" (Fiche interactive 3ème)

Pour votre Google Sheet dédié aux résultats du module **Les Robots** ([Lien Google Sheet 12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w](https://docs.google.com/spreadsheets/d/12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w/edit?usp=sharing)) :

1. Ouvrez le tableau Google Sheet [12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w](https://docs.google.com/spreadsheets/d/12WUptiE4s0Xev6BHTKAjgqUIRhIZRv3NJ0Fe_HK7K8w/edit?usp=sharing).
2. Assurez-vous que la première ligne contient exactement les en-têtes suivants :
   | nom | prénom | classe | date | résultat /20 |
   | :--- | :--- | :--- | :--- | :--- |
3. Allez dans **Extensions** ➡️ **Apps Script**.
4. Effacez le code existant et collez ce script Apps Script (fusion automatique des résultats d'un même élève) :

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Initialisation des en-têtes si la feuille est vide
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["nom", "prénom", "classe", "date", "résultat /20"]);
    }

    var nom = (data.nom || data.Nom || "").toString().trim();
    var prenom = (data["prénom"] || data.prenom || data.Prenom || "").toString().trim();
    var classe = (data.classe || data.Classe || "").toString().trim();
    var note20 = (data["résultat /20"] || data["resultat /20"] || data.score20 || data.note || "").toString().trim();
    var dateVal = data.date || data.Date || new Date().toLocaleDateString('fr-FR');

    var lastRow = sheet.getLastRow();
    var foundRow = -1;

    // Recherche d'un élève existant pour la fusion automatique
    if (lastRow > 1) {
      var values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = 0; i < values.length; i++) {
        var rNom = values[i][0].toString().trim();
        var rPrenom = values[i][1].toString().trim();
        var rClasse = values[i][2].toString().trim();

        if (rNom.toLowerCase() === nom.toLowerCase() &&
            rPrenom.toLowerCase() === prenom.toLowerCase() &&
            rClasse.toLowerCase() === classe.toLowerCase()) {
          foundRow = i + 2;
          break;
        }
      }
    }

    if (foundRow > 0) {
      // Mise à jour de la date et de la note ramenée sur 20 (fusion)
      sheet.getRange(foundRow, 4).setValue(dateVal);
      sheet.getRange(foundRow, 5).setValue(note20);
    } else {
      // Ajout d'une nouvelle ligne
      sheet.appendRow([nom, prenom, classe, dateVal, note20]);
    }

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. Cliquez sur **Déployer** ➡️ **Nouveau déploiement** ➡️ **Application Web** (accès : *Tout le monde* / *Anyone*).
6. Copiez l'URL Web App générée et renseignez-la dans `CONFIG.ROBOTS_WEB_APP_URL` ou `CONFIG.GOOGLE_APPS_SCRIPT_URL` du fichier `js/config.js`.

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
    OBJET_MATERIAUX_WEB_APP_URL: "https://script.google.com/macros/s/.../exec",
    LOG_CONNEXIONS_WEB_APP_URL: "https://script.google.com/macros/s/.../exec",

    // 4. URL du CSV Consultation des Notes de Stage
    GOOGLE_SHEET_STAGE_NOTES_CSV: "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv",
};
```

---

## Étape 5 : Procédure de Récupération des Notes Élèves Sauvegardées en Local

Si un élève a réalisé un sous-module ou une évaluation alors que l'URL Web App du Google Apps Script n'était pas encore configurée ou en cas de coupure réseau, les résultats sont **automatiquement conservés dans le stockage local (`localStorage`) de son navigateur**.

### Comment récupérer la note d'un élève sur son poste :

1. Sur le poste de l'élève concerné, ouvrez le navigateur et allez sur le site.
2. Ouvrez la **Console de développement** (Touche `F12` ou `Ctrl + Maj + I`, puis onglet **Console**).
3. Tapez la commande suivante puis appuyez sur `Entrée` :
   ```javascript
   Object.keys(localStorage).filter(k => k.startsWith('om_progress')).forEach(k => console.log(k, JSON.parse(localStorage.getItem(k))));
   ```
4. La console affichera les scores enregistrés pour chaque étape : `sub1_pct` (Type d'objet), `sub2_pct` (Objet & Matériaux 1), `sub3_pct` (Objet & Matériaux 2) ainsi que la `note_totale` sur 20.

Votre site est désormais 100% autonome et fonctionnera sans aucune interruption !
