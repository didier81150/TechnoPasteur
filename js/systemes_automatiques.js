// =====================================================
// MODULE : LES SYSTÈMES AUTOMATIQUES (NIVEAU 3ÈME)
// =====================================================

const SYSTEMES_AUTOMATIQUES_QUESTIONS = [
    // Partie 1 — Nature des systèmes
    {
        id: 1,
        partie: "Partie 1 — Nature des systèmes",
        question: "Dans un système mécanique, les opérations…",
        options: [
            "s'exécutent sans l'intervention de l'utilisateur",
            "sont assurées par la partie commande",
            "sont produites sans phénomène physique",
            "sont toutes commandées et contrôlées par l'utilisateur"
        ],
        correct: 3,
        explication: "Dans un système mécanique, c'est l'utilisateur qui commande et contrôle directement l'ensemble des opérations."
    },
    {
        id: 2,
        partie: "Partie 1 — Nature des systèmes",
        question: "Dans un système automatique, les opérations…",
        options: [
            "s'exécutent sans l'intervention de l'utilisateur",
            "sont assurées par la partie commande",
            "sont produites sans phénomène physique",
            "sont toutes commandées et contrôlées par l'utilisateur"
        ],
        correct: 0,
        explication: "Dans un système automatique, les opérations programmées s'exécutent et s'enchaînent automatiquement sans l'intervention continue de l'utilisateur."
    },
    {
        id: 3,
        partie: "Partie 1 — Nature des systèmes",
        question: "Dans un système automatique en cycle ouvert, les tâches…",
        options: [
            "se répètent continuellement sans vérification",
            "ne se déclenchent que lorsque c'est nécessaire",
            "s'arrêtent automatiquement si un capteur le détecte",
            "sont contrôlées par l'opérateur en temps réel"
        ],
        correct: 0,
        explication: "En cycle ouvert, le système répète une séquence d'opérations en boucle sans vérifier l'état de l'environnement (ex : feux de carrefour à durée fixe)."
    },
    {
        id: 4,
        partie: "Partie 1 — Nature des systèmes",
        question: "Dans un système automatique en cycle fermé, les tâches…",
        options: [
            "se répètent continuellement sans vérification",
            "ne se déclenchent que lorsque c'est nécessaire",
            "sont assurées par l'opérateur uniquement",
            "fonctionnent sans capteur"
        ],
        correct: 1,
        explication: "En cycle fermé, le système prend en compte l'état de son environnement grâce aux capteurs et ne déclenche les actions que lorsque nécessaire."
    },

    // Partie 2 — Composition d'un système automatique
    {
        id: 5,
        partie: "Partie 2 — Composition d'un système automatique",
        question: "Un système automatique est constitué…",
        options: [
            "d'un opérateur et d'un programme",
            "d'une partie commande et d'une partie opérative",
            "d'un dialogue d'exploitation et de capteurs",
            "d'actionneurs et d'un cycle de travail"
        ],
        correct: 1,
        explication: "Un système automatique se compose toujours de deux parties complémentaires : la Partie Commande (PC) et la Partie Opérative (PO)."
    },
    {
        id: 6,
        partie: "Partie 2 — Composition d'un système automatique",
        question: "La partie commande est composée…",
        options: [
            "de capteurs et d'actionneurs",
            "d'un opérateur et d'un phénomène physique",
            "d'une carte électronique (ou ordinateur)",
            "d'un dialogue de fonctionnement"
        ],
        correct: 2,
        explication: "La partie commande contient l'organe de traitement des informations, généralement un ordinateur ou une carte électronique programmée."
    },
    {
        id: 7,
        partie: "Partie 2 — Composition d'un système automatique",
        question: "Le rôle de la partie commande est…",
        options: [
            "d'effectuer les opérations attendues par le système",
            "d'assurer le pilotage et le contrôle du système",
            "de mesurer des grandeurs physiques",
            "d'alimenter l'utilisateur en énergie"
        ],
        correct: 1,
        explication: "La partie commande reçoit les consignes et comptes-rendus, traite le programme, puis donne les ordres à la partie opérative."
    },
    {
        id: 8,
        partie: "Partie 2 — Composition d'un système automatique",
        question: "La partie opérative est composée…",
        options: [
            "d'une carte électronique",
            "de capteurs et d'actionneurs",
            "d'un dialogue d'exploitation",
            "d'un opérateur et d'un phénomène physique"
        ],
        correct: 1,
        explication: "La partie opérative rassemble les actionneurs (qui produisent l'action) et les capteurs (qui détectent les événements)."
    },
    {
        id: 9,
        partie: "Partie 2 — Composition d'un système automatique",
        question: "Le rôle de la partie opérative est…",
        options: [
            "d'assurer le pilotage et le contrôle du système",
            "de commander le programme de la carte électronique",
            "d'effectuer les opérations attendues par le système",
            "de dialoguer avec l'utilisateur du système"
        ],
        correct: 2,
        explication: "La partie opérative réalise physiquement le travail et les actions du système en exécutant les ordres reçus."
    },

    // Partie 3 — Capteurs et actionneurs
    {
        id: 10,
        partie: "Partie 3 — Capteurs et actionneurs",
        question: "Un capteur est un élément de la partie opérative qui…",
        options: [
            "exécute les ordres reçus",
            "détecte un phénomène physique",
            "produit un phénomène physique",
            "dialogue avec l'opérateur"
        ],
        correct: 1,
        explication: "Le capteur mesure ou détecte une grandeur physique de l'environnement (présence, température, luminosité...)."
    },
    {
        id: 11,
        partie: "Partie 3 — Capteurs et actionneurs",
        question: "Un actionneur est un élément de la partie opérative qui…",
        options: [
            "envoie des comptes-rendus",
            "détecte un phénomène physique",
            "produit un phénomène physique",
            "stoppe le système"
        ],
        correct: 2,
        explication: "L'actionneur transforme l'énergie qu'il reçoit pour produire un phénomène physique (mouvement, son, lumière, chaleur...)."
    },
    {
        id: 12,
        partie: "Partie 3 — Capteurs et actionneurs",
        question: "Un capteur réagit en fonction…",
        options: [
            "d'un opérateur",
            "d'un type d'énergie",
            "d'une grandeur physique",
            "du système automatique"
        ],
        correct: 2,
        explication: "Les capteurs réagissent aux variations de grandeurs physiques (pression, présence, vitesse, niveau, etc.)."
    },
    {
        id: 13,
        partie: "Partie 3 — Capteurs et actionneurs",
        question: "Un actionneur transforme…",
        options: [
            "un phénomène physique en un opérateur",
            "un type d'énergie en un autre",
            "un capteur en actionneur",
            "un système automatique en système mécanique"
        ],
        correct: 1,
        explication: "Un actionneur convertit l'énergie reçue (électrique, pneumatique...) en un autre type d'énergie utile (mécanique, lumineuse, sonore...)."
    },

    // Partie 4 — Échanges d'informations
    {
        id: 14,
        partie: "Partie 4 — Échanges d'informations",
        question: "La partie commande reçoit…",
        options: [
            "des comptes-rendus et des consignes",
            "des ordres et des signaux",
            "des consignes et des ordres",
            "des comptes-rendus et des signaux"
        ],
        correct: 0,
        explication: "La partie commande reçoit les consignes données par l'opérateur et les comptes-rendus renvoyés par les capteurs."
    },
    {
        id: 15,
        partie: "Partie 4 — Échanges d'informations",
        question: "La partie commande envoie…",
        options: [
            "des comptes-rendus et des consignes",
            "des ordres et des signaux",
            "des consignes et des ordres",
            "des comptes-rendus et des signaux"
        ],
        correct: 1,
        explication: "La partie commande envoie des ordres à la partie opérative et des signaux d'information/d'état à l'opérateur."
    },
    {
        id: 16,
        partie: "Partie 4 — Échanges d'informations",
        question: "Le dialogue d'exploitation est composé…",
        options: [
            "d'ordres et de comptes-rendus",
            "de consignes et de signaux",
            "d'ordres et de consignes",
            "de signaux et de comptes-rendus"
        ],
        correct: 1,
        explication: "Le dialogue d'exploitation s'effectue entre l'opérateur et la partie commande (Consignes + Signaux)."
    },
    {
        id: 17,
        partie: "Partie 4 — Échanges d'informations",
        question: "Le dialogue de fonctionnement est composé…",
        options: [
            "d'ordres et de comptes-rendus",
            "de consignes et de signaux",
            "d'ordres et de consignes",
            "de signaux et de comptes-rendus"
        ],
        correct: 0,
        explication: "Le dialogue de fonctionnement s'effectue entre la partie commande et la partie opérative (Ordres + Comptes-rendus)."
    },
    {
        id: 18,
        partie: "Partie 4 — Échanges d'informations",
        question: "L'ensemble des échanges d'informations est contrôlé par…",
        options: [
            "l'opérateur",
            "la partie commande",
            "la partie opérative",
            "les capteurs"
        ],
        correct: 1,
        explication: "Le programme de la partie commande orchestre et régule l'intégralité des flux d'informations."
    }
];

let systemesActiveTab = "cours"; // "cours" ou "eval"
let systemesUserAnswers = {}; // { qId: optionIndex }
let systemesSubmitted = false;

function openSystemesAutomatiquesModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    systemesActiveTab = "cours";
    systemesUserAnswers = {};
    systemesSubmitted = false;

    renderSystemesAutomatiquesView(container);

    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchSystemesTab(tab) {
    systemesActiveTab = tab;
    const container = document.getElementById('activityContent');
    renderSystemesAutomatiquesView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSystemesAutomatiquesView(container) {
    if (!container) container = document.getElementById('activityContent');

    const coursActiveClass = systemesActiveTab === 'cours' ? 'background: #2563EB; color: white;' : 'background: #E2E8F0; color: #475569;';
    const evalActiveClass = systemesActiveTab === 'eval' ? 'background: #2563EB; color: white;' : 'background: #E2E8F0; color: #475569;';

    container.innerHTML = `
        <div class="media-container" style="max-width: 950px; margin: 0 auto; padding: 25px 15px; font-family: 'Plus Jakarta Sans', sans-serif;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 30px 25px; border-radius: 16px; text-align: center; margin-bottom: 25px; box-shadow: var(--shadow-md);">
                <span style="background: #38BDF8; color: #0F172A; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Automatisme • Cycle 4 • 3ème</span>
                <h1 style="margin: 12px 0 6px 0; font-size: 2.2rem; font-weight: 800; font-family: 'Outfit', sans-serif;">Les Systèmes Automatiques</h1>
                <p style="margin: 0; opacity: 0.9; font-size: 1.05rem;">Cours interactif & Évaluation — Composition, échanges et modes de commande</p>
            </div>

            <!-- Onglets Navigation -->
            <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 25px;">
                <button onclick="switchSystemesTab('cours')" style="${coursActiveClass} border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm);">
                    📖 Cours & Ressource
                </button>
                <button onclick="switchSystemesTab('eval')" style="${evalActiveClass} border: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm);">
                    📝 Évaluation QCM
                </button>
            </div>

            <div id="systemesTabContent">
                ${systemesActiveTab === 'cours' ? renderSystemesCoursHTML() : renderSystemesEvalHTML()}
            </div>
        </div>
    `;
}

function renderSystemesCoursHTML() {
    return `
        <!-- Section Présentation -->
        <div style="background: white; border-radius: 14px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
            <h2 style="margin-top: 0; color: var(--navy); font-family: 'Outfit', sans-serif; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;">
                ⚙️ Présentation
            </h2>
            <p style="color: var(--text-dark); line-height: 1.7; font-size: 1rem;">
                Bien que l'on puisse classer les objets techniques en plusieurs catégories (manuel, mécanique, électrique, automatique, informatique), il existe deux grandes familles : <strong>les systèmes mécaniques</strong> et <strong>les systèmes automatiques</strong>.
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; margin-top: 20px;">
                <!-- Système Mécanique -->
                <div style="background: #F8FAFC; border-left: 5px solid #64748B; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #334155; font-size: 1.15rem; font-weight: 800;">⚙️ Système mécanique</h3>
                    <p style="margin: 0; color: #475569; line-height: 1.6; font-size: 0.95rem;">
                        Dans un système mécanique, <strong>l'utilisateur commande et contrôle l'ensemble des opérations</strong>. Le système peut être simple (porte, ciseaux, bicyclette…) ou plus complexe et apporter de l'énergie à la place de l'utilisateur (machine à coudre, marteau-piqueur, voiture…).
                    </p>
                </div>

                <!-- Système Automatique -->
                <div style="background: #EFF6FF; border-left: 5px solid #2563EB; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #1E40AF; font-size: 1.15rem; font-weight: 800;">🤖 Système automatique</h3>
                    <p style="margin: 0; color: #1E3A8A; line-height: 1.6; font-size: 0.95rem;">
                        Dans un système automatique, <strong>les opérations programmées s'exécutent et s'enchaînent sans l'intervention de l'utilisateur</strong>. Un opérateur suit l'évolution du système, en contrôle le bon déroulement, assure la programmation, le démarrage et l'arrêt en cas de problème.
                    </p>
                </div>
            </div>

            <!-- Exemples -->
            <div style="margin-top: 22px; background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 10px; padding: 18px;">
                <h4 style="margin: 0 0 10px 0; color: #92400E; font-size: 1rem; font-weight: 800;">💡 Exemples de systèmes automatiques :</h4>
                <ul style="margin: 0; padding-left: 20px; color: #78350F; line-height: 1.6; font-size: 0.95rem;">
                    <li><strong>Convoyeur industriel</strong> (travaux pénibles et répétitifs)</li>
                    <li><strong>Ligne de montage automobile</strong> (cadence régulière)</li>
                    <li><strong>Atelier de peinture</strong> (environnement dangereux)</li>
                    <li><strong>Embouteillage automatisé</strong> (remplissage, capsulage, étiquetage)</li>
                    <li><strong>Réacteur nucléaire</strong> (endroit inaccessible)</li>
                </ul>
            </div>
        </div>

        <!-- Section Composition d'un système automatique -->
        <div style="background: white; border-radius: 14px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
            <h2 style="margin-top: 0; color: var(--navy); font-family: 'Outfit', sans-serif; font-size: 1.4rem;">
                🧩 Composition d'un système automatique
            </h2>
            <p style="color: var(--text-dark); line-height: 1.7; font-size: 1rem;">
                Un système automatique est toujours composé de deux parties principales : la <strong>Partie Commande</strong> et la <strong>Partie Opérative</strong>.
            </p>

            <!-- Schéma Synthétique -->
            <div style="background: #F1F5F9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
                <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 15px;">
                    <div style="background: #334155; color: white; padding: 12px 18px; border-radius: 8px; font-weight: 700;">👤 Opérateur</div>
                    <div style="color: #64748B; font-weight: 800;">⮂ (Consignes / Signaux) ⮂</div>
                    <div style="background: #2563EB; color: white; padding: 14px 22px; border-radius: 8px; font-weight: 800;">🧠 Partie Commande<br><small style="font-weight: 400; opacity: 0.9;">(Carte électronique / Microcontrôleur)</small></div>
                    <div style="color: #64748B; font-weight: 800;">⮂ (Ordres / Comptes-rendus) ⮂</div>
                    <div style="background: #10B981; color: white; padding: 14px 22px; border-radius: 8px; font-weight: 800;">⚙️ Partie Opérative<br><small style="font-weight: 400; opacity: 0.9;">(Capteurs + Actionneurs)</small></div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
                <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #0369A1; font-size: 1.1rem; font-weight: 800;">🧠 Partie Commande</h3>
                    <p style="margin: 0; color: #0C4A6E; line-height: 1.6; font-size: 0.92rem;">
                        Elle assure le pilotage et le contrôle du système. Elle est composée d'un ordinateur ou, plus souvent, d'une carte électronique réceptrice du programme.
                    </p>
                </div>

                <div style="background: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #047857; font-size: 1.1rem; font-weight: 800;">🛠️ Partie Opérative</h3>
                    <p style="margin: 0; color: #064E3B; line-height: 1.6; font-size: 0.92rem;">
                        Elle effectue les tâches physiques en agissant sur l'environnement. Elle regroupe les <strong>capteurs</strong> et les <strong>actionneurs</strong>.
                    </p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 18px;">
                <div style="background: #FAF5FF; border: 1px solid #E9D5FF; border-radius: 10px; padding: 18px;">
                    <h4 style="margin-top: 0; color: #7E22CE; font-size: 1.05rem; font-weight: 800;">📡 Capteur</h4>
                    <p style="margin: 0; color: #581C87; line-height: 1.6; font-size: 0.92rem;">
                        Élément qui détecte un phénomène physique (présence, distance, niveau, température, luminosité, vitesse...) et transmet l'information à la partie commande sous forme de compte-rendu.
                    </p>
                </div>

                <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 10px; padding: 18px;">
                    <h4 style="margin-top: 0; color: #C2410C; font-size: 1.05rem; font-weight: 800;">⚙️ Actionneur</h4>
                    <p style="margin: 0; color: #7C2D12; line-height: 1.6; font-size: 0.92rem;">
                        Élément qui produit un phénomène physique (déplacement, chaleur, lumière, son...) à partir de l'énergie reçue en exécutant un ordre. Il transforme un type d'énergie en un autre.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section Échange d'informations -->
        <div style="background: white; border-radius: 14px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
            <h2 style="margin-top: 0; color: var(--navy); font-family: 'Outfit', sans-serif; font-size: 1.4rem;">
                📡 Échange d'informations
            </h2>
            <p style="color: var(--text-dark); line-height: 1.7; font-size: 1rem;">
                L'ensemble des échanges d'informations est contrôlé par le programme de la partie commande. Deux types de dialogues s'établissent :
            </p>
            <ul style="margin: 10px 0 20px 20px; line-height: 1.7; color: var(--text-dark);">
                <li><strong>Dialogue d'exploitation</strong> entre l'opérateur et la partie commande (consignes + signaux).</li>
                <li><strong>Dialogue de fonctionnement</strong> entre la partie commande et la partie opérative (ordres + comptes-rendus).</li>
            </ul>

            <div style="background: #F8FAFC; border-left: 5px solid #3B82F6; border-radius: 10px; padding: 20px;">
                <h4 style="margin: 0 0 10px 0; color: #1E3A8A; font-size: 1.05rem; font-weight: 800;">🏢 Exemple concret : L'ascenseur</h4>
                <ul style="margin: 0; padding-left: 20px; color: #1E293B; line-height: 1.7; font-size: 0.95rem;">
                    <li><strong>Consigne :</strong> une personne appuie sur le bouton-poussoir de son étage.</li>
                    <li><strong>Ordre :</strong> la partie commande ordonne au moteur de tourner pour déplacer la cabine.</li>
                    <li><strong>Phénomène physique :</strong> la cabine monte ou descend.</li>
                    <li><strong>Compte-rendu :</strong> à chaque étage, un capteur détecte la présence de la cabine.</li>
                    <li><strong>Signal :</strong> un voyant indique à l'opérateur l'étage actuel de la cabine.</li>
                </ul>
            </div>
        </div>

        <!-- Section Modes de commande -->
        <div style="background: white; border-radius: 14px; padding: 25px; margin-bottom: 25px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
            <h2 style="margin-top: 0; color: var(--navy); font-family: 'Outfit', sans-serif; font-size: 1.4rem;">
                🔄 Modes de commande
            </h2>
            <p style="color: var(--text-dark); line-height: 1.7; font-size: 1rem;">
                Un système automatique peut exécuter une suite d'opérations selon deux modes :
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; margin-top: 15px;">
                <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #991B1B; font-size: 1.1rem; font-weight: 800;">🔓 Cycle ouvert</h3>
                    <p style="margin: 0; color: #7F1D1D; line-height: 1.6; font-size: 0.92rem;">
                        Les tâches se répètent continuellement sans vérification de l'état de l'environnement.<br>
                        <em>Exemple : feux de carrefour fonctionnant sur une minuterie fixe jour et nuit, sans tenir compte du trafic.</em>
                    </p>
                </div>

                <div style="background: #F0FDF4; border: 1px solid #86EFAC; border-radius: 10px; padding: 18px;">
                    <h3 style="margin-top: 0; color: #166534; font-size: 1.1rem; font-weight: 800;">🔒 Cycle fermé</h3>
                    <p style="margin: 0; color: #14532D; line-height: 1.6; font-size: 0.92rem;">
                        Les tâches ne se déclenchent que lorsque c'est nécessaire en prenant en compte l'état de l'environnement grâce aux capteurs.<br>
                        <em>Exemple : barrière de passage à niveau qui s'abaisse à la détection d'un train.</em>
                    </p>
                </div>
            </div>
        </div>

        <!-- Document PDF Ressource -->
        <div style="background: linear-gradient(135deg, #1E1B4B, #312E81); color: white; border-radius: 16px; padding: 25px; text-align: center; box-shadow: var(--shadow-md);">
            <h3 style="margin-top: 0; font-size: 1.3rem; font-weight: 800; color: #38BDF8;">📄 Document Ressource Complémentaire</h3>
            <p style="margin: 6px 0 20px 0; opacity: 0.9; font-size: 0.95rem;">
                Tout savoir sur les portails — exemple complet de système automatique (source : Académie de Martinique).
            </p>
            <a href="https://www.techno-logique.com/pdf/AUT-portails.pdf" target="_blank" rel="noopener noreferrer" style="background: #10B981; color: white; text-decoration: none; padding: 12px 28px; border-radius: 25px; font-weight: 800; font-size: 1rem; display: inline-flex; align-items: center; gap: 8px; box-shadow: var(--shadow-sm);">
                📄 Ouvrir le PDF — Les portails automatiques
            </a>
        </div>
    `;
}

function renderSystemesEvalHTML() {
    let currentPartie = "";
    let scoreHTML = "";

    if (systemesSubmitted) {
        let score = 0;
        SYSTEMES_AUTOMATIQUES_QUESTIONS.forEach(q => {
            if (systemesUserAnswers[q.id] === q.correct) {
                score++;
            }
        });

        const note20 = ((score / SYSTEMES_AUTOMATIQUES_QUESTIONS.length) * 20).toFixed(1);
        const pourcent = Math.round((score / SYSTEMES_AUTOMATIQUES_QUESTIONS.length) * 100);

        scoreHTML = `
            <div style="background: linear-gradient(135deg, #0F172A, #1E293B); color: white; padding: 25px; border-radius: 16px; text-align: center; margin-bottom: 25px; box-shadow: var(--shadow-md);">
                <h2 style="margin: 0; font-size: 1.8rem; font-weight: 800; color: #38BDF8;">Résultat de l'Évaluation</h2>
                <div style="font-size: 2.8rem; font-weight: 900; margin: 10px 0; color: #5EEAD4;">
                    ${score} / ${SYSTEMES_AUTOMATIQUES_QUESTIONS.length}
                </div>
                <div style="font-size: 1.2rem; font-weight: 700; opacity: 0.95;">
                    Note : <span style="color: #FACC15;">${note20} / 20</span> (${pourcent}%)
                </div>
                <p style="margin: 10px 0 0 0; opacity: 0.8; font-size: 0.9rem;">
                    Élève : ${currentStudent ? escapeHTML(currentStudent.nom + ' ' + currentStudent.prenom) : 'Invité'} | Classe : ${currentStudent ? escapeHTML(currentStudent.classe) : 'N/A'}
                </p>
            </div>
        `;
    }

    const questionsHTML = SYSTEMES_AUTOMATIQUES_QUESTIONS.map(q => {
        let partHeader = "";
        if (q.partie !== currentPartie) {
            currentPartie = q.partie;
            partHeader = `
                <div style="background: #2563EB; color: white; padding: 12px 18px; border-radius: 10px; font-weight: 800; font-size: 1.1rem; margin: 30px 0 15px 0;">
                    📌 ${escapeHTML(currentPartie)}
                </div>
            `;
        }

        const selectedOption = systemesUserAnswers[q.id];

        const optionsHTML = q.options.map((opt, idx) => {
            const isChecked = selectedOption === idx;
            let optStyle = "background: #F8FAFC; border: 1px solid var(--border);";

            if (systemesSubmitted) {
                if (idx === q.correct) {
                    optStyle = "background: #DCFCE7; border: 2px solid #16A34A; color: #14532D; font-weight: 700;";
                } else if (isChecked && idx !== q.correct) {
                    optStyle = "background: #FEE2E2; border: 2px solid #DC2626; color: #7F1D1D;";
                }
            } else if (isChecked) {
                optStyle = "background: #EFF6FF; border: 2px solid #2563EB; font-weight: 700; color: #1E40AF;";
            }

            return `
                <label style="display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 8px; cursor: ${systemesSubmitted ? 'default' : 'pointer'}; transition: all 0.2s; ${optStyle}">
                    <input
                        type="radio"
                        name="q_${q.id}"
                        value="${idx}"
                        ${isChecked ? 'checked' : ''}
                        ${systemesSubmitted ? 'disabled' : ''}
                        onchange="selectSystemesAnswer(${q.id}, ${idx})"
                        style="width: 18px; height: 18px; accent-color: #2563EB;"
                    >
                    <span>${escapeHTML(opt)}</span>
                </label>
            `;
        }).join('');

        let expHTML = "";
        if (systemesSubmitted) {
            expHTML = `
                <div style="margin-top: 12px; padding: 12px 16px; background: #F0FDFA; border-left: 4px solid #0D9488; border-radius: 6px; font-size: 0.9rem; color: #115E59;">
                    <strong>💡 Explication :</strong> ${escapeHTML(q.explication)}
                </div>
            `;
        }

        return `
            ${partHeader}
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);">
                <h3 style="margin: 0 0 14px 0; color: var(--navy); font-size: 1.05rem; font-weight: 700;">
                    Q.${q.id} — ${escapeHTML(q.question)}
                </h3>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${optionsHTML}
                </div>
                ${expHTML}
            </div>
        `;
    }).join('');

    return `
        <!-- Bannières d'information élève -->
        <div style="background: #F1F5F9; border: 1px solid #CBD5E1; border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px;">
            <div>
                <strong style="color: var(--navy);">👤 Élève connecté :</strong> ${currentStudent ? escapeHTML(currentStudent.nom + ' ' + currentStudent.prenom) : 'Non identifié'}
            </div>
            <div>
                <strong style="color: var(--navy);">🏫 Classe :</strong> ${currentStudent ? escapeHTML(currentStudent.classe) : 'N/A'}
            </div>
        </div>

        ${scoreHTML}

        <div>
            ${questionsHTML}
        </div>

        <!-- Boutons d'action -->
        <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 30px;">
            ${!systemesSubmitted ? `
                <button onclick="submitSystemesEval()" style="background: #10B981; color: white; border: none; padding: 14px 32px; border-radius: 30px; font-weight: 800; font-size: 1.05rem; cursor: pointer; box-shadow: var(--shadow-sm); transition: transform 0.2s;">
                    ✅ Valider et envoyer
                </button>
            ` : `
                <div style="background: #DCFCE7; border: 2px solid #16A34A; color: #14532D; padding: 14px 28px; border-radius: 30px; font-weight: 800; font-size: 1.05rem;">
                    ✅ Évaluation validée et résultats enregistrés
                </div>
            `}
        </div>
    `;
}

function selectSystemesAnswer(qId, optionIdx) {
    if (systemesSubmitted) return;
    systemesUserAnswers[qId] = optionIdx;
}

async function submitSystemesEval() {
    const totalQ = SYSTEMES_AUTOMATIQUES_QUESTIONS.length;
    const answeredCount = Object.keys(systemesUserAnswers).length;

    if (answeredCount < totalQ) {
        if (!confirm(`Vous n'avez répondu qu'à ${answeredCount} question(s) sur ${totalQ}. Voulez-vous quand même valider votre évaluation ?`)) {
            return;
        }
    }

    systemesSubmitted = true;

    let score = 0;
    SYSTEMES_AUTOMATIQUES_QUESTIONS.forEach(q => {
        if (systemesUserAnswers[q.id] === q.correct) {
            score++;
        }
    });

    const score20 = ((score / totalQ) * 20).toFixed(1);
    const percentage = Math.round((score / totalQ) * 100);

    // Envoi des résultats à Google Apps Script si élève connecté
    if (typeof currentStudent !== 'undefined' && currentStudent) {
        const payload = {
            type: "systemes_automatiques",
            Nom: currentStudent.nom || '',
            Prenom: currentStudent.prenom || '',
            Classe: currentStudent.classe || '',
            nom: currentStudent.nom || '',
            prenom: currentStudent.prenom || '',
            classe: currentStudent.classe || '',
            "note /20": score20,
            score20: score20,
            score: score,
            total: totalQ,
            pourcentage: percentage,
            Date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR'),
            date: new Date().toLocaleDateString('fr-FR') + ' ' + new Date().toLocaleTimeString('fr-FR')
        };

        const targetUrl = CONFIG.SYSTEMES_AUTOMATIQUES_WEB_APP_URL || CONFIG.GOOGLE_APPS_SCRIPT_URL;
        await sendDataToGoogleAppsScript(payload, targetUrl);
    }

    const container = document.getElementById('activityContent');
    renderSystemesAutomatiquesView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetSystemesEval() {
    systemesUserAnswers = {};
    systemesSubmitted = false;
    const container = document.getElementById('activityContent');
    renderSystemesAutomatiquesView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
