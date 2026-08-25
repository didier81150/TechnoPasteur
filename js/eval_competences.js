// =====================================================
// MODULE ÉVALUATION DES COMPÉTENCES 3ÈME (90 QUESTIONS)
// =====================================================

const EVAL_COMPETENCES_CONFIG = {
    SUBMISSION_URL: "https://script.google.com/macros/s/AKfycbzfd0l22_ICOtzv7BVgZAlQIC8yql1Sk4MFZTdLbZXWd092oxRJfnSFlMQ14VseOs-yqg/exec",
    BASE_TIME: 60 * 60, // 60 minutes
    PAP_BONUS: 20 * 60  // 20 minutes supplémentaires
};

const EVAL_COMPETENCES_QUESTIONS = [
    // QCM 1
    { q: "Les informations obtenues lors d'une étude auprès des utilisateurs permettent de lister :", o: ["leurs insatisfactions et déterminer leurs besoins.", "les solutions techniques à choisir.", "les moyens de fabrication à utiliser."], c: 0 },
    { q: "La connaissance du besoin des utilisateurs permet de :", o: ["tester les objets.", "formuler les fonctions auxquelles le futur objet technique doit répondre.", "comprendre le fonctionnement de l'objet."], c: 1 },
    { q: "Le diagramme des cas d'utilisation indique :", o: ["le nom de l'objet, le ou les acteurs qui agissent sur lui et le ou les services qu'il rend.", "l'ensemble des éléments qui sont présents dans l'environnement de l'objet technique.", "les contraintes devant être respectées."], c: 0 },
    { q: "La fonction principale d'un objet technique correspond :", o: ["à la principale caractéristique technique de l'objet.", "au principe de fonctionnement de l'objet technique.", "à la principale action attendue par l'utilisateur pour répondre à son besoin."], c: 2 },
    { q: "Dans l'expression du besoin, les contraintes :", o: ["indiquent ce que l'objet ne doit surtout pas faire.", "précisent les conditions d'utilisation de l'objet technique pour remplir sa fonction principale, faciliter son utilisation, le rendre plus attrayant, l'utiliser en toute sûreté, répondre à un développement durable, être d'un coût correspondant au service et à la qualité proposée.", "listent les fonctions principales de l'objet."], c: 1 },
    { q: "Les familles de contraintes sont :", o: ["fonctionnelles, esthétiques, ergonomiques, de sûreté, environnementales et économiques.", "fonctionnelles, esthétiques et ergonomiques.", "environnementales et économiques."], c: 0 },
    // QCM 2
    { q: "Les tests qui contrôlent les niveaux de performance des objets techniques permettent :", o: ["de s'assurer que l'objet correspond bien au besoin pour lequel il a été conçu.", "de déterminer le coût de l'objet.", "de déterminer les moyens de fabrication à utiliser."], c: 0 },
    { q: "Les études menées auprès des utilisateurs permettent de :", o: ["tester les objets.", "connaître leurs insatisfactions et déterminer leurs besoins.", "comprendre le fonctionnement de l'objet."], c: 1 },
    { q: "Un cahier des charges est un document qui définit précisément :", o: ["les matériaux utilisés.", "le besoin attendu.", "les solutions techniques à mettre en œuvre."], c: 1 },
    { q: "Un cahier des charges indique :", o: ["les fonctions et contraintes auxquelles doit satisfaire un objet technique.", "uniquement la fonction principale d'un objet technique.", "les efforts maximums auxquels peut être soumis l'objet technique."], c: 0 },
    { q: "Dans un cahier des charges, les critères et les niveaux précisent :", o: ["la manière de choisir les solutions techniques.", "le principe de fonctionnement de chaque bloc fonctionnel.", "les performances de chaque fonction ou contrainte."], c: 2 },
    { q: "Les contraintes ergonomiques concernent :", o: ["la facilité d'utilisation de l'objet.", "l'esthétique de l'objet.", "l'utilisation en toute sécurité de l'objet."], c: 0 },
    // QCM 3
    { q: "L'expression du besoin d'un objet technique est formulé dans :", o: ["un cahier des charges.", "un dessin technique.", "un texte de loi."], c: 0 },
    { q: "Pour rendre plus attrayant un objet technique, on précise dans son cahier des charges :", o: ["des contraintes esthétiques.", "des contraintes ergonomiques.", "des contraintes économiques."], c: 0 },
    { q: "Pour caractériser un niveau de performance d'une fonction technique, on précise :", o: ["des solutions techniques qui permettent de faire des tests.", "uniquement des valeurs correspondant à des performances.", "des critères qui sont associés à des niveaux de performance à atteindre."], c: 2 },
    { q: "L'évolution des objets techniques est due :", o: ["à l'évolution du contexte économique et social.", "à l'évolution du nombre de consommateurs.", "à l'évolution des prix des objets techniques."], c: 0 },
    { q: "Les normes sont définies par :", o: ["les États ou des organismes internationaux.", "les consommateurs.", "les concepteurs."], c: 0 },
    { q: "Les normes des objets techniques liées à la sécurité des utilisateurs permettent :", o: ["de limiter les risques de pollution lors de leur fabrication.", "de limiter les dangers lors de leur utilisation.", "de concevoir des objets sans aucun danger pour les utilisateurs."], c: 2 },
    // QCM 4
    { q: "Un planning d'un projet indique :", o: ["les périodes de vacances scolaires de l'année.", "uniquement la liste des étapes à effectuer pour la réalisation du projet.", "l'ordre chronologique des opérations du projet selon un calendrier."], c: 2 },
    { q: "Pour établir un planning, il faut connaître :", o: ["la durée de chaque opération à planifier.", "uniquement la liste des opérations à planifier.", "les moyens de réalisation des opérations du projet."], c: 0 },
    { q: "Pour mener à bien un projet, les membres de l'équipe :", o: ["ne doivent pas communiquer entre eux.", "choisissent un espace de travail collaboratif (un ENT).", "utilisent uniquement un espace de stockage personnel."], c: 1 },
    { q: "Un ENT permet entre autre de :", o: ["communiquer entre les membres de l'équipe du projet.", "réaliser les opérations du projet.", "faire de la publicité pour le projet."], c: 0 },
    { q: "Les moments de réunion des membres de l'équipe d'un projet s'appellent des :", o: ["évaluations du projet.", "comptes rendus du projet.", "revues de projet."], c: 2 },
    { q: "Les membres de l'équipe d'un projet se réunissent pour :", o: ["indiquer la durée des étapes de production.", "coordonner leurs actions et prendre des décisions sur la suite du projet en cours.", "réaliser le planning du projet."], c: 1 },
    // QCM 5
    { q: "Pour mener à bien et respecter les délais d'achèvement du projet, les membres de l'équipe :", o: ["se répartissent les opérations entre eux.", "réalisent toutes les opérations.", "diminuent la durée de leurs vacances."], c: 0 },
    { q: "Les membres d'une même équipe :", o: ["travaillent chacun de leur côté.", "travaillent ensemble de manière collaborative dans un groupe projet.", "travaillent ensemble dans un groupe de paroles."], c: 1 },
    { q: "Pour mener à bien la communication au sein d'un projet, les membres de l'équipe organisent les données numériques dans :", o: ["des répertoires accessibles de tous.", "un répertoire personnel pour chaque membre de l'équipe.", "un espace de stockage public."], c: 0 },
    { q: "Les données numériques d'un projet sont stockées :", o: ["dans un fichier.", "dans un traitement de texte.", "selon une arborescence de répertoires."], c: 2 },
    { q: "Les fichiers utilisés pour la communication au sein du groupe projet :", o: ["doivent être dans un format lisible de tous les membres du groupe.", "ne peuvent pas provenir de logiciels différents.", "peuvent être nommés indifféremment."], c: 0 },
    { q: "Une charte graphique :", o: ["établit les normes de sécurité.", "permet de conserver une unité graphique à travers tous les documents du projet.", "est signée de tous les membres de l'équipe du projet."], c: 1 },
    // QCM 6
    { q: "Dans un projet, les aléas entraînent :", o: ["une modification du planning.", "une annulation du projet.", "la recherche d'un autre projet."], c: 0 },
    { q: "La modification d'un planning peut se traduire par :", o: ["toujours une date de fin du projet retardée.", "une exécution du projet bâclée.", "un décalage dans le temps de certaines opérations."], c: 2 },
    { q: "Définir des droits d'accès dans un ENT consiste à :", o: ["autoriser l'utilisation de données numériques en lecture et/ou en écriture aux membres du projet.", "donner l'adresse IP de l'ordinateur.", "diffuser des informations sur le réseau Internet."], c: 0 },
    { q: "Configurer un ENT consiste, entre autre, à :", o: ["télécharger des logiciels.", "définir l'ensemble des utilisateurs.", "choisir les composants d'un réseau informatique."], c: 1 },
    { q: "Préparer une présentation orale en équipe nécessite de :", o: ["réaliser le plan de l'exposé, répartir le temps de prise de parole de chacun et préparer les documents d'accompagnement.", "avertir tous les participants par téléphone.", "mettre à jour le planning du projet."], c: 0 },
    { q: "Les outils numériques de présentation sont des logiciels qui permettent de réaliser :", o: ["un planning du projet.", "le dessin d'ensemble du projet.", "une présentation assistée par ordinateur (PréAO), des pages Internet ou une publication papier."], c: 2 },
    // QCM 7
    { q: "Pour identifier les principaux composants qui participent à une solution technique et répondent au cahier des charges, on utilise :", o: ["un diagramme de définition des blocs.", "un diagramme des cas d'utilisation.", "un diagramme des exigences."], c: 0 },
    { q: "Parmi les interactions d'un objet avec son environnement, on distingue principalement :", o: ["les informations saisies par l'utilisateur, les informations techniques, l'énergie électrique fournie au système.", "les informations saisies par l'utilisateur, les informations fournies par l'environnement, la forme de l'énergie, les actions transmises par le système à l'utilisateur.", "les informations fournies par l'environnement, l'énergie mécanique fournie au système."], c: 1 },
    { q: "La représentation d'une solution par un algorithme permet de lister :", o: ["l'ensemble des composants d'un système technique.", "chronologiquement toutes les étapes de fabrication.", "chronologiquement l'ensemble des instructions qui commandent un système technique."], c: 2 },
    { q: "Dans un algorithme, une action est déclenchée :", o: ["par un événement toujours extérieur au système.", "à partir d'un événement.", "toujours par l'utilisateur."], c: 1 },
    { q: "La représentation d'une solution par un croquis permet de :", o: ["fabriquer des pièces.", "dégager l'essentiel de la forme de l'objet technique.", "représenter un schéma électrique."], c: 1 },
    { q: "Le design désigne :", o: ["le processus de conception et de création qui prend en compte la technique, l'art et l'évolution de la société pour produire de nouveaux objets.", "uniquement la forme de l'objet.", "un nouvel objet."], c: 0 },
    // QCM 8
    { q: "La représentation d'une solution sous forme de symboles décrivant les éléments essentiels du fonctionnement d'un objet est :", o: ["un schéma.", "un croquis à main levée.", "un modèle virtuel en 3D."], c: 0 },
    { q: "Une veille technologique est :", o: ["un ensemble de méthodes qui consiste à attendre le résultat d'une expérimentation.", "un ensemble de méthodes et d'actions pour s'informer des récentes inventions, innovations technologiques et découvertes scientifiques.", "un ensemble d'actions qui permettent de fabriquer un objet technologique."], c: 1 },
    { q: "Une représentation de solution par un diagramme des flux permet de préciser :", o: ["uniquement l'ensemble des composants d'un système technique.", "le choix des connecteurs permettant de relier les composants entre eux.", "les flux (échanges) d'information et d'énergie entre les différents composants d'un système."], c: 2 },
    { q: "La représentation d'une solution sous forme d'un diagramme de séquence :", o: ["liste l'ensemble des éléments qui participent à une solution.", "permet de détailler les différentes étapes que devra assurer un programme.", "décrit les flux d'information et d'énergie échangés."], c: 1 },
    { q: "La représentation d'une solution par un dessin représentant l'essentiel des formes d'un objet ou de ses différents composants est :", o: ["un schéma.", "un croquis.", "un modèle virtuel en 3D."], c: 1 },
    { q: "Une représentation volumique (3D) est réalisée grâce à un logiciel :", o: ["de CAO.", "de PAO.", "de FAO."], c: 0 },
    // QCM 9
    { q: "Le niveau de performance des différents composants de la solution choisie est précisé :", o: ["dans le cahier des charges ou le diagramme des exigences.", "dans le diagramme des blocs.", "dans le diagramme des blocs internes."], c: 0 },
    { q: "Comment appelle-t-on la superposition, en temps réel, d'un modèle virtuel (3D ou 2D pour une image) à la perception que nous avons naturellement du monde réel ?", o: ["La réalité virtuelle.", "La réalité augmentée.", "La fausse réalité."], c: 1 },
    { q: "À l'entrée d'un diagramme représentant des flux d'information, la présence du vent est :", o: ["un signal.", "une énergie.", "une information."], c: 2 },
    { q: "Dans un diagramme représentant des flux d'information, une tension variable est :", o: ["un signal.", "une énergie.", "une information."], c: 0 },
    { q: "Dans un diagramme représentant des flux d'énergie, un moteur électrique transforme :", o: ["une énergie hydraulique en énergie électrique.", "une énergie électrique en énergie mécanique.", "une énergie électrique en énergie hydraulique."], c: 1 },
    { q: "Dans un diagramme représentant des flux d'information et d'énergie, l'effet attendu est produit :", o: ["par la chaîne d'énergie.", "par la chaîne d'information.", "par la nature du signal."], c: 0 },
    // QCM 10
    { q: "Les procédés de réalisation des machines de prototypage sont :", o: ["l'enlèvement de matière pour la fraiseuse et l'ajout de matière pour l'imprimante 3D.", "l'enlèvement de matière pour l'imprimante 3D et l'ajout de matière pour la fraiseuse.", "l'enlèvement de matière pour la fraiseuse et la soudure pour l'imprimante 3D."], c: 0 },
    { q: "Le choix d'une machine de prototypage rapide est fait en fonction :", o: ["des formes et de la couleur de la pièce à réaliser.", "des formes et des dimensions de la pièce à réaliser.", "des dimensions et de la masse de la pièce à réaliser."], c: 1 },
    { q: "Les critères qui interviennent dans le choix d'une machine de prototypage sont :", o: ["le nombre d'opérateurs disponibles.", "le logiciel de modélisation et le format du fichier.", "le temps de réalisation et la précision."], c: 2 },
    { q: "Pour programmer un microcontrôleur, il faut :", o: ["que la carte programmable soit connectée à l'ordinateur en permanence.", "que la carte programmable soit en veille.", "que la carte programmable soit connectée à l'ordinateur au moment de téléverser."], c: 2 },
    { q: "Pour réaliser une fabrication à l'aide d'une machine de prototypage, il faut :", o: ["suivre un protocole de réalisation.", "suivre un protocole de test.", "suivre un programme."], c: 0 },
    { q: "Pour utiliser une machine de prototypage rapide sans danger, il faut :", o: ["respecter une distance de sécurité.", "respecter les règles de sécurité.", "appeler le professeur dès que la machine se met en mouvement."], c: 1 },
    // QCM 11
    { q: "Le choix d'un matériau pour réaliser la pièce d'un prototype se fait en fonction :", o: ["des contraintes auxquelles doit répondre la pièce.", "de la température de la salle dans laquelle on utilise la machine.", "de la complexité de la pièce."], c: 0 },
    { q: "Les matériaux utilisés en prototypage rapide sont :", o: ["compatibles avec toutes les machines : fraiseuse et imprimante 3D.", "non recyclables.", "à choisir en fonction de la machine utilisée."], c: 2 },
    { q: "L'objectif du prototypage rapide d'un circuit de commande est :", o: ["d'utiliser le maximum de capteurs possible.", "de valider rapidement la programmation d'un système technique.", "de faire fonctionner un système technique à une vitesse élevée."], c: 1 },
    { q: "Afin de faciliter le prototypage rapide de circuits de commande, on utilise :", o: ["des composants soudés sur la carte programmable.", "des cartes standards branchées avec des connecteurs.", "des cartes programmables possédant tous les capteurs et actionneurs."], c: 1 },
    { q: "L'organisation de la fabrication d'un prototype nécessite :", o: ["de disposer de plusieurs fraiseuses et imprimantes 3D.", "qu'il y ait un opérateur par machine.", "d'élaborer un planning d'occupation des machines."], c: 2 },
    { q: "Pour organiser la fabrication d'un prototype, il faut tenir compte :", o: ["de la préparation et du nettoyage de la machine.", "de la préparation et du nettoyage de la pièce.", "de la préparation et du nettoyage du laboratoire de technologie."], c: 0 },
    // QCM 12
    { q: "Lors de l'impression d'une pièce avec une imprimante 3D, il est possible de régler :", o: ["la densité de la pièce.", "le temps de séchage de la pièce.", "la densité du matériau."], c: 0 },
    { q: "Lors de l'usinage d'une pièce avec une fraiseuse, il est possible de régler :", o: ["la dimension des copeaux réalisés par la machine.", "la vitesse de rotation et la vitesse d'avance de l'outil.", "un changement de matériau."], c: 1 },
    { q: "Un composant qui réalise la fonction « acquérir » est :", o: ["une carte électronique équipée d'un microcontrôleur.", "un capteur.", "un actionneur."], c: 1 },
    { q: "Un composant qui réalise la fonction « traiter » est :", o: ["une carte électronique équipée d'un microcontrôleur.", "un capteur.", "une carte Wi-Fi ou Bluetooth."], c: 0 },
    { q: "Pour valider la structure et le circuit de commande d'un prototype, il faut que :", o: ["le système fonctionne selon les critères de la personne qui effectue les tests.", "le système fonctionne selon les critères du cahier des charges.", "le système fonctionne."], c: 1 },
    { q: "On choisit un capteur en fonction :", o: ["un protocole de communication.", "un effet attendu.", "une grandeur physique à utiliser."], c: 2 },
    // QCM 13
    { q: "Une famille d'objets techniques désigne un ensemble d'objets :", o: ["répondant à un même besoin.", "construits obligatoirement selon le même principe technique.", "vendus dans un même type de magasin."], c: 0 },
    { q: "Une lignée d'objets techniques désigne un ensemble d'objets :", o: ["répondant à différents besoins et construits selon un même principe.", "répondant à un même besoin et construits selon un même principe.", "construits à partir des mêmes éléments ou composants."], c: 1 },
    { q: "Une invention technique désigne :", o: ["la conception d'un nouveau modèle d'un objet technique connu.", "l'amélioration d'un objet.", "la création d'un objet, d'un dispositif ou d'un procédé qui n'existait pas."], c: 2 },
    { q: "La frise chronologique d'une famille d'objets permet de :", o: ["situer dans le temps des événements historiques.", "situer dans le temps des lignées d'objets de cette famille.", "définir les composants d'un objet."], c: 1 },
    { q: "Les lignées d'objets apparaissent ou disparaissent :", o: ["par décision de l'académie des technologies.", "en raison de découvertes scientifiques, d'inventions techniques, de nouvelles sources d'énergie ou de nouveaux usages.", "sans raison connue."], c: 1 },
    { q: "L'innovation technologique désigne :", o: ["l'introduction d'une nouveauté dans la conception ou la fabrication d'un objet technique.", "la création d'un objet jusque-là inconnu.", "la possibilité d'acquérir un nouvel objet."], c: 0 },
    // QCM 14
    { q: "La mécanisation d'un objet correspond à :", o: ["l'utilisation d'une source d'énergie à travers une chaîne d'énergie pour produire l'effet attendu.", "l'usage d'engrenages dans la réalisation de l'objet.", "l'utilisation d'un mouvement d'horlogerie."], c: 0 },
    { q: "L'automatisation d'un objet correspond à :", o: ["sa capacité d'autonomie en énergie.", "la présence d'une chaîne d'information et d'un programme pour assurer la commande de l'objet.", "l'utilisation d'une télécommande pour piloter l'objet."], c: 1 },
    { q: "L'évolution des objets se caractérise par :", o: ["l'utilisation de matériaux différents.", "la variation de leur prix d'achat.", "différents stades d'objets : mécanisés, automatisés et connectés, qui modifient leurs usages, leurs réactions à leur environnement et les relations avec les utilisateurs."], c: 2 },
    { q: "Les dispositifs de sécurité des objets permettent de :", o: ["diminuer leur usure.", "protéger les utilisateurs de tout contact avec les parties dangereuses : mécaniques, thermiques, électriques.", "ne pas les casser."], c: 1 },
    { q: "Une solution technique correspond à :", o: ["l'ensemble des matériaux utilisés pour fabriquer un objet.", "un ensemble de constituants et de matériaux qui permettent à l'objet d'assurer les fonctions et contraintes attendues.", "la manière de réaliser un objet."], c: 1 },
    { q: "Un principe technique désigne :", o: ["la règle ou l'idée (scientifique ou technique) mise en œuvre dans la conception et le fonctionnement d'un objet technique.", "une règle d'utilisation d'un objet.", "la possibilité d'améliorer un objet technique."], c: 0 },
    // QCM 15
    { q: "L'automatisation d'un objet correspond à :", o: ["sa capacité d'être autonome en énergie.", "la possibilité de piloter la chaîne d'énergie grâce à une chaîne d'information.", "la possibilité d'être commandé à distance."], c: 1 },
    { q: "Les objets automatiques :", o: ["prennent en charge une part de la commande des objets à la place des utilisateurs.", "diminuent les efforts physiques des utilisateurs.", "répètent le même mouvement indéfiniment."], c: 0 },
    { q: "Un objet connecté :", o: ["utilise un réseau informatique pour échanger des données numériques nécessaires à son fonctionnement.", "est toujours relié au secteur électrique par un fil.", "est relié à un seul autre objet."], c: 0 },
    { q: "Les objets connectés sont :", o: ["entièrement autonomes.", "rechargeables en énergie à distance.", "capables de s'adapter aux modifications de leur environnement."], c: 2 },
    { q: "Une découverte scientifique est :", o: ["l'invention d'une nouvelle loi de l'Univers.", "la mise en évidence d'une propriété susceptible d'être l'objet d'une approche scientifique.", "une nouveauté technique."], c: 1 },
    { q: "Une invention technique donne lieu :", o: ["au dépôt d'un brevet d'invention auprès d'un organisme officiel (INPI en France).", "à une cérémonie à l'académie des Technologies.", "à une découverte scientifique."], c: 0 }
];

const NIVEAU_CYCLE = [1, 2, 3];
function getEvalNiveau(questionIndex) {
    const qcmIndex = Math.floor(questionIndex / 6);
    return NIVEAU_CYCLE[qcmIndex % 3];
}

let evalState = {
    answers: new Array(EVAL_COMPETENCES_QUESTIONS.length).fill(null),
    currentGroupIndex: 0,
    timeLeft: EVAL_COMPETENCES_CONFIG.BASE_TIME,
    timer: null,
    isFinished: false
};

function openEvalCompetencesModule() {
    if (!currentStudent) {
        alert("Veuillez vous connecter pour accéder à l'évaluation des compétences.");
        return;
    }

    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');
    document.getElementById('activityScreen').style.display = 'block';

    const isPap = currentStudent.ppa || false;
    evalState.timeLeft = EVAL_COMPETENCES_CONFIG.BASE_TIME + (isPap ? EVAL_COMPETENCES_CONFIG.PAP_BONUS : 0);
    evalState.answers = new Array(EVAL_COMPETENCES_QUESTIONS.length).fill(null);
    evalState.currentGroupIndex = 0;
    evalState.isFinished = false;

    if (evalState.timer) clearInterval(evalState.timer);
    evalState.timer = setInterval(() => {
        evalState.timeLeft--;
        if (evalState.timeLeft <= 0) {
            finishEvalCompetences(true);
        }
        updateEvalTimerDisplay();
    }, 1000);

    renderEvalQuiz(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateEvalTimerDisplay() {
    const timerEl = document.getElementById('evalTimer');
    if (timerEl) {
        const mins = Math.floor(Math.max(evalState.timeLeft, 0) / 60);
        const secs = Math.max(evalState.timeLeft, 0) % 60;
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (evalState.timeLeft < 300) {
            timerEl.style.color = 'var(--accent-red, #dc3545)';
            timerEl.style.fontWeight = 'bold';
        }
    }
}

function renderEvalQuiz(container) {
    const questions = EVAL_COMPETENCES_QUESTIONS;
    const start = evalState.currentGroupIndex * 3;
    const groupQuestions = questions.slice(start, start + 3);
    const totalGroups = Math.ceil(questions.length / 3);
    const answeredCount = evalState.answers.filter(a => a !== null).length;
    const progressPct = Math.round((answeredCount / questions.length) * 100);

    const isPap = currentStudent ? currentStudent.ppa : false;

    container.innerHTML = `
        <div class="eval-container" style="max-width:850px; margin:0 auto; padding:1rem;">
            <!-- Header Sticky bar -->
            <div style="position:sticky; top:0; z-index:100; background:var(--bg-card, #ffffff); padding:1rem; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); margin-bottom:1.5rem; border:1px solid var(--border-color, #e2e8f0);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                    <div>
                        <span style="font-size:0.8rem; color:var(--text-muted);">Élève identifié :</span>
                        <div style="font-weight:700; font-size:1.05rem; color:var(--text-main);">${currentStudent.nom} ${currentStudent.prenom} (${currentStudent.classe})</div>
                        ${isPap ? '<span style="display:inline-block; font-size:0.75rem; background:#fff3cd; color:#856404; padding:2px 8px; border-radius:10px; font-weight:600; margin-top:2px;">⏱️ Tiers-temps PPA/PAP (+20 min incluses)</span>' : ''}
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:0.8rem; color:var(--text-muted);">Temps restant :</span>
                        <div id="evalTimer" style="font-family:monospace; font-size:1.6rem; font-weight:700; color:var(--primary);">--:--</div>
                    </div>
                </div>

                <div style="margin-top:0.75rem;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.3rem; color:var(--text-muted);">
                        <span>Progression globale : ${answeredCount} / ${questions.length} questions</span>
                        <span>${progressPct}%</span>
                    </div>
                    <div style="width:100%; height:8px; background:var(--bg-main, #f1f5f9); border-radius:10px; overflow:hidden;">
                        <div style="width:${progressPct}%; height:100%; background:var(--accent, #0066cc); transition:width 0.3s;"></div>
                    </div>
                </div>
            </div>

            <!-- Header Title -->
            <div style="margin-bottom:1.5rem; text-align:center;">
                <h2 style="font-size:1.5rem; font-weight:700; color:var(--text-main);">Évaluation des compétences — Technologie 3ème</h2>
                <p style="color:var(--text-muted); font-size:0.9rem;">Page ${evalState.currentGroupIndex + 1} / ${totalGroups} (Questions ${start + 1} à ${Math.min(start + 3, questions.length)})</p>
            </div>

            <!-- Group Questions -->
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
                ${groupQuestions.map((q, i) => {
                    const qIndex = start + i;
                    const selectedOpt = evalState.answers[qIndex];
                    return `
                        <div style="background:var(--bg-card, #fff); border-radius:12px; padding:1.5rem; box-shadow:0 2px 8px rgba(0,0,0,0.05); border:1px solid var(--border-color, #e2e8f0);">
                            <div style="display:flex; gap:0.75rem; margin-bottom:1rem; align-items:flex-start;">
                                <span style="background:var(--accent, #0066cc); color:white; min-width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.9rem;">${qIndex + 1}</span>
                                <h3 style="font-size:1.05rem; font-weight:600; color:var(--text-main); margin-top:3px;">${q.q}</h3>
                            </div>

                            <div style="display:flex; flex-direction:column; gap:0.6rem;">
                                ${q.o.map((opt, optIdx) => `
                                    <button
                                        type="button"
                                        onclick="selectEvalAnswer(${qIndex}, ${optIdx})"
                                        style="text-align:left; padding:0.9rem 1.1rem; border-radius:8px; border:2px solid ${selectedOpt === optIdx ? 'var(--accent, #0066cc)' : 'var(--border-color, #cbd5e1)'}; background:${selectedOpt === optIdx ? 'rgba(0,102,204,0.08)' : 'var(--bg-card, #fff)'}; color:var(--text-main); font-size:0.95rem; font-weight:${selectedOpt === optIdx ? '600' : '400'}; cursor:pointer; transition:all 0.15s;"
                                    >
                                        <span style="display:inline-block; width:22px; height:22px; border-radius:50%; border:2px solid ${selectedOpt === optIdx ? 'var(--accent, #0066cc)' : '#94a3b8'}; text-align:center; line-height:18px; font-size:0.75rem; margin-right:8px; background:${selectedOpt === optIdx ? 'var(--accent, #0066cc)' : 'transparent'}; color:${selectedOpt === optIdx ? '#fff' : '#64748b'}; font-weight:bold;">
                                            ${String.fromCharCode(65 + optIdx)}
                                        </span>
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Navigation Controls -->
            <div style="margin-top:2rem; padding-bottom:3rem; display:flex; justify-content:space-between; align-items:center;">
                <button
                    type="button"
                    onclick="prevEvalGroup()"
                    style="padding:0.75rem 1.5rem; border-radius:8px; border:1px solid var(--border-color, #cbd5e1); background:var(--bg-card, #fff); color:var(--text-main); font-weight:600; cursor:pointer;"
                    ${evalState.currentGroupIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}
                >
                    ← Précédent
                </button>

                <span style="font-size:0.9rem; color:var(--text-muted);">Page ${evalState.currentGroupIndex + 1} sur ${totalGroups}</span>

                ${evalState.currentGroupIndex === totalGroups - 1
                    ? `<button type="button" onclick="finishEvalCompetences(false)" style="padding:0.75rem 1.8rem; border-radius:8px; border:none; background:#28a745; color:white; font-weight:700; cursor:pointer; box-shadow:0 4px 10px rgba(40,167,69,0.3);">🚀 Terminer l'évaluation</button>`
                    : `<button type="button" onclick="nextEvalGroup()" style="padding:0.75rem 1.8rem; border-radius:8px; border:none; background:var(--accent, #0066cc); color:white; font-weight:700; cursor:pointer;">Suivant →</button>`
                }
            </div>
        </div>
    `;

    updateEvalTimerDisplay();
}

function selectEvalAnswer(qIndex, optIdx) {
    evalState.answers[qIndex] = optIdx;
    const container = document.getElementById('activityContent');
    renderEvalQuiz(container);
}

function nextEvalGroup() {
    const totalGroups = Math.ceil(EVAL_COMPETENCES_QUESTIONS.length / 3);
    if (evalState.currentGroupIndex < totalGroups - 1) {
        evalState.currentGroupIndex++;
        const container = document.getElementById('activityContent');
        renderEvalQuiz(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevEvalGroup() {
    if (evalState.currentGroupIndex > 0) {
        evalState.currentGroupIndex--;
        const container = document.getElementById('activityContent');
        renderEvalQuiz(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function computeEvalStats(answers) {
    const questions = EVAL_COMPETENCES_QUESTIONS;
    const parNiveau = {
        1: { correct: 0, total: 0 },
        2: { correct: 0, total: 0 },
        3: { correct: 0, total: 0 }
    };

    let correctTotal = 0;
    answers.forEach((ans, idx) => {
        const niv = getEvalNiveau(idx);
        parNiveau[niv].total++;
        if (ans === questions[idx].c) {
            correctTotal++;
            parNiveau[niv].correct++;
        }
    });

    const pourcentageNiveau = {};
    [1, 2, 3].forEach(n => {
        pourcentageNiveau[n] = parNiveau[n].total > 0
            ? Math.round((parNiveau[n].correct / parNiveau[n].total) * 100)
            : 0;
    });

    return {
        score: correctTotal,
        total: questions.length,
        score20: (correctTotal / questions.length * 20).toFixed(2),
        pourcentage: Math.round((correctTotal / questions.length) * 100),
        parNiveau,
        pourcentageNiveau
    };
}

async function finishEvalCompetences(autoSubmit = false) {
    if (!autoSubmit) {
        if (!confirm("Voulez-vous vraiment terminer l'évaluation ? Vos réponses seront transmises à votre professeur.")) {
            return;
        }
    }

    if (evalState.timer) {
        clearInterval(evalState.timer);
        evalState.timer = null;
    }

    evalState.isFinished = true;
    const stats = computeEvalStats(evalState.answers);

    const payload = {
        nom: currentStudent ? currentStudent.nom : '',
        prenom: currentStudent ? currentStudent.prenom : '',
        classe: currentStudent ? currentStudent.classe : '',
        score90: stats.score,
        score20: stats.score20,
        pourcentage: stats.pourcentage,
        niveau1_pourcentage: stats.pourcentageNiveau[1],
        niveau2_pourcentage: stats.pourcentageNiveau[2],
        niveau3_pourcentage: stats.pourcentageNiveau[3],
        niveau1_correct: stats.parNiveau[1].correct,
        niveau1_total: stats.parNiveau[1].total,
        niveau2_correct: stats.parNiveau[2].correct,
        niveau2_total: stats.parNiveau[2].total,
        niveau3_correct: stats.parNiveau[3].correct,
        niveau3_total: stats.parNiveau[3].total,
        timestamp: new Date().toISOString()
    };

    try {
        await fetch(EVAL_COMPETENCES_CONFIG.SUBMISSION_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(payload)
        });
    } catch (e) {
        console.error("Erreur lors de l'envoi des résultats d'évaluation:", e);
    }

    renderEvalResults();
}

function renderEvalResults() {
    const container = document.getElementById('activityContent');
    const stats = computeEvalStats(evalState.answers);

    const levelCardsHtml = [1, 2, 3].map(n => `
        <div style="background:var(--bg-main, #f8fafc); padding:1rem; border-radius:10px; border:1px solid var(--border-color, #e2e8f0); text-align:left;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                <span style="font-size:0.85rem; font-weight:600; color:var(--text-main);">Compétence Niveau ${n}</span>
                <span style="font-weight:700; color:var(--primary);">${stats.pourcentageNiveau[n]}%</span>
            </div>
            <div style="width:100%; background:#e2e8f0; height:8px; border-radius:10px; overflow:hidden; margin-bottom:0.4rem;">
                <div style="width:${stats.pourcentageNiveau[n]}%; height:100%; background:${stats.pourcentageNiveau[n] >= 70 ? '#28a745' : stats.pourcentageNiveau[n] >= 50 ? '#ffc107' : '#dc3545'};"></div>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">${stats.parNiveau[n].correct} / ${stats.parNiveau[n].total} réponses exactes</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div style="max-width:700px; margin:2rem auto; background:var(--bg-card, #fff); border-radius:16px; padding:2rem; box-shadow:0 4px 16px rgba(0,0,0,0.08); text-align:center;">
            <div style="font-size:3.5rem; margin-bottom:0.5rem;">🎓</div>
            <h2 style="font-size:1.8rem; font-weight:700; color:var(--text-main); margin-bottom:0.3rem;">Évaluation des compétences terminée</h2>
            <p style="color:var(--text-muted); font-size:0.95rem; margin-bottom:1.5rem;">Bravo ${currentStudent ? currentStudent.prenom : ''}, vos résultats ont été enregistrés et transmis.</p>

            <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem; margin-bottom:1.5rem;">
                <div style="background:var(--bg-main, #f8fafc); padding:1rem; border-radius:12px; border:1px solid var(--border-color, #e2e8f0);">
                    <div style="font-size:0.8rem; color:var(--text-muted);">Score global</div>
                    <div style="font-size:1.6rem; font-weight:700; color:var(--text-main);">${stats.score} / ${stats.total}</div>
                </div>
                <div style="background:var(--bg-main, #f8fafc); padding:1rem; border-radius:12px; border:1px solid var(--border-color, #e2e8f0);">
                    <div style="font-size:0.8rem; color:var(--text-muted);">Note / 20</div>
                    <div style="font-size:1.6rem; font-weight:700; color:var(--accent, #0066cc);">${stats.score20} / 20</div>
                </div>
                <div style="background:var(--bg-main, #f8fafc); padding:1rem; border-radius:12px; border:1px solid var(--border-color, #e2e8f0);">
                    <div style="font-size:0.8rem; color:var(--text-muted);">Taux de réussite</div>
                    <div style="font-size:1.6rem; font-weight:700; color:${stats.pourcentage >= 50 ? '#28a745' : '#dc3545'};">${stats.pourcentage}%</div>
                </div>
            </div>

            <div style="margin-bottom:1.5rem; text-align:left;">
                <h4 style="font-size:1rem; font-weight:700; margin-bottom:0.75rem; color:var(--text-main);">Détail par niveau de compétence</h4>
                <div style="display:grid; grid-template-columns:1fr; gap:0.75rem;">
                    ${levelCardsHtml}
                </div>
            </div>

            <button onclick="showDashboard(currentStudent ? currentStudent.niveau : '3eme')" style="padding:0.8rem 2rem; border-radius:10px; border:none; background:var(--accent, #0066cc); color:white; font-weight:600; font-size:1rem; cursor:pointer;">
                ↩️ Retour au tableau de bord
            </button>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
