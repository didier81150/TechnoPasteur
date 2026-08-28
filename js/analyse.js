// =====================================================
// MODULE ANALYSE FONCTIONNELLE (EXPRESSION DU BESOIN - 4ème)
// =====================================================

function openAnalyseModule(activity) {
    document.getElementById('dashboardScreen').style.display = 'none';
    const container = document.getElementById('activityContent');

    const studentInfo = currentStudent
        ? `${currentStudent.nom.toUpperCase()} ${currentStudent.prenom} (${currentStudent.classe})`
        : 'Anonyme';

    const pdfLink = activity && activity.pdfUrl ? activity.pdfUrl : 'https://drive.google.com';

    container.innerHTML = `
        <div class="container" style="max-width: 100%; padding: 0;">

            <!-- EN-TÊTE DU MODULE -->
            <header class="page-header" style="text-align: center; margin-bottom: 30px; padding: 25px 20px; background: linear-gradient(145deg, #1a365d, #2b6cb0); border-radius: 16px; color: #fff;">
                <h1 style="font-size: 2rem; font-weight: 700;">📐 Analyse Fonctionnelle</h1>
                <p class="subtitle" style="font-size: 1rem; opacity: 0.9; margin-top: 6px;">
                    Expression du besoin — <span style="background: rgba(255, 255, 255, 0.15); padding: 2px 12px; border-radius: 20px;">Graphe des prestations</span>
                </p>
            </header>

            <!-- MODULE 1 : THÉORIE -->
            <section id="module-theory" class="module module-theory" style="background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 30px; border-top: 6px solid #2d6a4f; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">
                    <span style="font-size: 1.5rem;">📖</span>
                    <span class="badge" style="background: #2d6a4f; color: #fff; font-size: 0.75rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">Module 1</span>
                    <h2 style="font-size: 1.4rem; color: #1a365d;">Les fondamentaux</h2>
                </div>

                <p style="margin-bottom: 16px;">
                    Un objet technique n'existe que parce qu'il répond à un <strong style="color: #2d6a4f;">besoin</strong>.
                    Avant toute conception, il faut définir ce besoin avec précision.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 18px 0;">
                    <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border-left: 5px solid #2b6cb0;">
                        <h3 style="font-size: 1rem; color: #1a365d; margin-bottom: 4px;">❓ À qui rend-il service ?</h3>
                        <p style="font-size: 0.9rem; color: #4a5568;">L'<strong>utilisateur</strong> (ou client) est la personne qui bénéficie du produit.</p>
                    </div>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border-left: 5px solid #2b6cb0;">
                        <h3 style="font-size: 1rem; color: #1a365d; margin-bottom: 4px;">⚙️ Sur quoi agit-il ?</h3>
                        <p style="font-size: 0.9rem; color: #4a5568;">La <strong>matière d'œuvre</strong> est l'élément sur lequel le produit agit.</p>
                    </div>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border-left: 5px solid #2b6cb0;">
                        <h3 style="font-size: 1rem; color: #1a365d; margin-bottom: 4px;">🎯 Dans quel but existe-t-il ?</h3>
                        <p style="font-size: 0.9rem; color: #4a5568;">La <strong>fonction d'usage</strong> est le besoin satisfait par le produit.</p>
                    </div>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border-left: 5px solid #2b6cb0;">
                        <h3 style="font-size: 1rem; color: #1a365d; margin-bottom: 4px;">🧩 Le produit lui-même</h3>
                        <p style="font-size: 0.9rem; color: #4a5568;">Son <strong>nom</strong> — ce que l'on étudie.</p>
                    </div>
                </div>

                <div style="background: #edf7f0; border-radius: 12px; padding: 18px; margin: 20px 0 16px; border: 2px solid #2d6a4f; border-left: 6px solid #2d6a4f;">
                    <h3 style="color: #1a365d; margin-bottom: 6px; font-size: 1.1rem;">📌 Graphe des prestations (bête à cornes)</h3>
                    <div style="background: #fff; padding: 12px 16px; border-radius: 8px; margin: 10px 0 6px; font-style: italic; border: 1px dashed #52b788;">
                        <strong>Phrase de vérification :</strong><br>
                        « L'objet technique nommé <strong>[produit]</strong> rend service à <strong>[utilisateur]</strong>
                        en agissant sur <strong>[matière d'œuvre]</strong> pour satisfaire le besoin de <strong>[fonction d'usage]</strong>. »
                    </div>
                    <div style="background: #fff; padding: 12px 16px; border-radius: 8px; margin-top: 10px; border-left: 4px solid #d69e2e;">
                        <strong>🏠 Exemple – une maison :</strong><br>
                        La maison rend service aux <strong>habitants</strong> en agissant sur le <strong>confort</strong>
                        pour satisfaire le besoin de <strong>se loger</strong>.
                    </div>
                </div>

                <a href="${pdfLink}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 8px; background: #1a365d; color: #fff; padding: 10px 24px; border-radius: 30px; font-weight: 600; text-decoration: none; font-size: 0.9rem;">
                    📥 Accéder à la fiche de cours
                </a>
            </section>

            <!-- MODULE 2 : PRATIQUE -->
            <section id="module-practice" class="module module-practice" style="background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 30px; border-top: 6px solid #52b788; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">
                    <span style="font-size: 1.5rem;">✏️</span>
                    <span class="badge" style="background: #52b788; color: #fff; font-size: 0.75rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">Module 2</span>
                    <h2 style="font-size: 1.4rem; color: #1a365d;">Entraînement guidé</h2>
                </div>

                <p style="margin-bottom: 12px; font-weight: 500;">
                    🎯 Choisissez un objet ci-dessous, puis construisez son graphe des prestations.
                </p>

                <div class="practice-items" id="practiceItems" style="display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0 20px;">
                    <button data-object="piscine" class="practice-btn active">🏊 Piscine municipale</button>
                    <button data-object="gare" class="practice-btn">🚉 Gare ferroviaire</button>
                    <button data-object="hopital" class="practice-btn">🏥 Hôpital</button>
                    <button data-object="bibliotheque" class="practice-btn">📚 Bibliothèque</button>
                    <button data-object="station" class="practice-btn">⛽ Station-service</button>
                    <button data-object="pont" class="practice-btn">🌉 Pont</button>
                    <button data-object="eglise" class="practice-btn">⛪ Église</button>
                    <button data-object="velo" class="practice-btn">🚲 Vélo</button>
                    <button data-object="smartphone" class="practice-btn">📱 Smartphone</button>
                </div>

                <!-- Zone de travail -->
                <div class="practice-area" id="practiceArea" style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 2px solid #e2e8f0;">
                    <p style="font-weight: 600; font-size: 1.05rem; margin-bottom: 14px;">
                        📌 Objet sélectionné : <span id="selectedObjectLabel" style="color: #2d6a4f; background: #dcfce7; padding: 2px 12px; border-radius: 20px;">Piscine municipale</span>
                    </p>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin-bottom: 14px;">
                        <div>
                            <label style="font-weight:600; display:block; margin-bottom:4px; font-size:0.85rem; color:#4a5568;">1. Quel est le produit ?</label>
                            <input type="text" id="pProduit" placeholder="Nom de l'objet" style="width:100%; padding:8px 12px; border:2px solid #cbd5e1; border-radius:8px;">
                        </div>
                        <div>
                            <label style="font-weight:600; display:block; margin-bottom:4px; font-size:0.85rem; color:#4a5568;">2. À qui rend-il service ?</label>
                            <input type="text" id="pUtilisateur" placeholder="Utilisateur / client" style="width:100%; padding:8px 12px; border:2px solid #cbd5e1; border-radius:8px;">
                        </div>
                        <div>
                            <label style="font-weight:600; display:block; margin-bottom:4px; font-size:0.85rem; color:#4a5568;">3. Sur quoi agit-il ?</label>
                            <input type="text" id="pMatiere" placeholder="Matière d'œuvre" style="width:100%; padding:8px 12px; border:2px solid #cbd5e1; border-radius:8px;">
                        </div>
                        <div>
                            <label style="font-weight:600; display:block; margin-bottom:4px; font-size:0.85rem; color:#4a5568;">4. Dans quel but ?</label>
                            <input type="text" id="pFonction" placeholder="Fonction d'usage" style="width:100%; padding:8px 12px; border:2px solid #cbd5e1; border-radius:8px;">
                        </div>
                    </div>
                    <div style="margin-bottom: 14px;">
                        <label style="font-weight:600; display:block; margin-bottom:4px; font-size:0.85rem; color:#4a5568;">5. Phrase de vérification complète :</label>
                        <input type="text" id="pPhrase" placeholder="L'objet technique ..." style="width:100%; padding:8px 12px; border:2px solid #cbd5e1; border-radius:8px; font-style:italic;">
                    </div>

                    <button id="showCorrectionBtn" style="background: #e2e8f0; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">💡 Voir un exemple de correction</button>
                    <div id="correctionExample" style="background: #f1f5f9; border-radius: 8px; padding: 14px; margin-top: 12px; border-left: 4px solid #52b788; display: none;">
                        <strong style="color: #1a365d;">✅ Exemple de correction pour ce produit :</strong>
                        <p id="correctionText" style="margin-top: 6px; font-size: 0.9rem;"></p>
                    </div>
                </div>
            </section>

            <!-- MODULE 3 : QUIZ -->
            <section id="module-quiz" class="module module-quiz" style="background: #fff; border-radius: 16px; padding: 24px; margin-bottom: 30px; border-top: 6px solid #d69e2e; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div class="module-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 18px; border-bottom: 2px solid #edf2f7; padding-bottom: 12px;">
                    <span style="font-size: 1.5rem;">🧪</span>
                    <span class="badge" style="background: #d69e2e; color: #fff; font-size: 0.75rem; padding: 4px 12px; border-radius: 20px; font-weight: 700;">Module 3</span>
                    <h2 style="font-size: 1.4rem; color: #1a365d;">Quiz – Analyse fonctionnelle</h2>
                </div>

                <p style="margin-bottom: 20px; color: #4a5568;">
                    Répondez aux deux QCM, validez vos réponses, puis envoyez votre note vers Google Sheets.
                </p>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">

                    <!-- QCM 1 -->
                    <div id="quiz1" style="background: #fafcff; border-radius: 12px; padding: 18px; border: 2px solid #e9edf2;">
                        <h3 style="font-size: 1.1rem; color: #1a365d; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
                            QCM 1 – Les questions clés
                            <span style="background: #2b6cb0; color: #fff; font-size: 0.75rem; padding: 2px 10px; border-radius: 12px;">4 questions</span>
                        </h3>

                        <div class="quiz-question" data-q="q1_1" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">1. Quand on demande <em>"Quel produit étudie-t-on ?"</em>, on recherche…</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_1" value="A"> A. La matière d'œuvre</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_1" value="B"> B. Le besoin satisfait</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_1" value="C"> C. L'utilisateur</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_1" value="D"> D. <strong>Le nom du produit</strong></label>
                        </div>

                        <div class="quiz-question" data-q="q1_2" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">2. Quand on demande <em>"À qui le produit rend-il service ?"</em>, on recherche…</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_2" value="A"> A. La matière d'œuvre</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_2" value="B"> B. Le besoin</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_2" value="C"> C. <strong>L'utilisateur</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_2" value="D"> D. Le nom du produit</label>
                        </div>

                        <div class="quiz-question" data-q="q1_3" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">3. Quand on demande <em>"Sur quoi le produit agit-il ?"</em>, on recherche…</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_3" value="A"> A. <strong>La matière d'œuvre</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_3" value="B"> B. L'utilisateur</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_3" value="C"> C. La fonction d'usage</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_3" value="D"> D. Le coût</label>
                        </div>

                        <div class="quiz-question" data-q="q1_4" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">4. Quand on demande <em>"Dans quel but le produit existe-t-il ?"</em>, on recherche…</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_4" value="A"> A. L'utilisateur</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_4" value="B"> B. <strong>La fonction d'usage (besoin)</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_4" value="C"> C. La matière d'œuvre</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q1_4" value="D"> D. Le prix de vente</label>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px;">
                            <button class="btn-check-quiz" data-quiz="1" style="background: #d69e2e; color: #fff; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">✅ Valider QCM 1</button>
                            <span style="font-weight: 700; font-size: 1rem;">📊 <span id="score1">0 / 4</span></span>
                        </div>
                    </div>

                    <!-- QCM 2 -->
                    <div id="quiz2" style="background: #fafcff; border-radius: 12px; padding: 18px; border: 2px solid #e9edf2;">
                        <h3 style="font-size: 1.1rem; color: #1a365d; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between;">
                            QCM 2 – Le graphe des prestations
                            <span style="background: #2b6cb0; color: #fff; font-size: 0.75rem; padding: 2px 10px; border-radius: 12px;">4 questions</span>
                        </h3>

                        <div class="quiz-question" data-q="q2_1" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">1. Qu'exprime un graphe des prestations (bête à cornes) ?</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_1" value="A"> A. Le coût de fabrication</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_1" value="B"> B. <strong>Le besoin auquel répond un produit</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_1" value="C"> C. Les étapes de construction</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_1" value="D"> D. La date de péremption</label>
                        </div>

                        <div class="quiz-question" data-q="q2_2" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">2. Dans le graphe des prestations, la <em>"matière d'œuvre"</em> correspond à :</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_2" value="A"> A. L'utilisateur</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_2" value="B"> B. <strong>L'élément sur lequel le produit agit</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_2" value="C"> C. Le besoin satisfait</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_2" value="D"> D. Le nom du produit</label>
                        </div>

                        <div class="quiz-question" data-q="q2_3" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">3. La phrase de vérification du graphe des prestations suit l'ordre :</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_3" value="A"> A. Utilisateur → Produit → Matière → Besoin</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_3" value="B"> B. <strong>Produit → Utilisateur → Matière → Besoin</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_3" value="C"> C. Besoin → Produit → Utilisateur → Matière</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_3" value="D"> D. Matière → Besoin → Produit → Utilisateur</label>
                        </div>

                        <div class="quiz-question" data-q="q2_4" style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #edf2f7;">
                            <p style="font-weight: 600; font-size: 0.9rem; margin-bottom: 6px;">4. La <em>"fonction d'usage"</em> est également appelée :</p>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_4" value="A"> A. La matière d'œuvre</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_4" value="B"> B. L'utilisateur</label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_4" value="C"> C. <strong>Le besoin satisfait</strong></label>
                            <label style="display: block; font-size: 0.85rem; margin: 2px 0;"><input type="radio" name="q2_4" value="D"> D. Le produit</label>
                        </div>

                        <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px;">
                            <button class="btn-check-quiz" data-quiz="2" style="background: #d69e2e; color: #fff; border: none; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">✅ Valider QCM 2</button>
                            <span style="font-weight: 700; font-size: 1rem;">📊 <span id="score2">0 / 4</span></span>
                        </div>
                    </div>

                </div>

                <!-- ZONE D'ENVOI GOOGLE SHEETS -->
                <div style="margin-top: 24px; display: flex; flex-wrap: wrap; align-items: center; gap: 14px; background: #f8fafc; padding: 18px 22px; border-radius: 14px; border: 2px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 250px;">
                        <label style="font-weight: 600; color: #4a5568;">👤 Élève :</label>
                        <input type="text" id="studentName" value="${studentInfo}" readonly style="padding: 8px 12px; border: 2px solid #cbd5e1; border-radius: 8px; font-weight: 600; background: #e2e8f0; color: #1a202c; flex: 1;">
                    </div>

                    <div style="font-weight: 700; font-size: 1.2rem; color: #1a365d; background: #edf2f7; padding: 4px 16px; border-radius: 20px;">
                        📊 Total : <span id="totalScoreDisplay">0</span> / 8
                    </div>

                    <span id="gradeDisplay" style="font-weight: 600; padding: 4px 14px; border-radius: 20px; font-size: 0.9rem; background: #fef2f2; color: #7f1d1d;">—</span>

                    <button id="sendToSheetBtn" disabled style="background: #2d6a4f; color: #fff; border: none; padding: 10px 24px; border-radius: 30px; font-weight: 700; font-size: 0.9rem; cursor: pointer; opacity: 0.5;">
                        📤 Envoyer vers Sheets
                    </button>

                    <div id="sendFeedback" style="font-size: 0.9rem; width: 100%; font-weight: 600;"></div>
                </div>
            </section>

        </div>
    `;

    initAnalyseLogic();
    document.getElementById('activityScreen').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initAnalyseLogic() {
    const corrections = {
        piscine: {
            produit: 'Piscine municipale',
            utilisateur: 'Les nageurs, le public',
            matiere: 'Le confort, la sécurité, l\'hygiène',
            fonction: 'Se baigner, se divertir, faire du sport',
            phrase: 'La piscine municipale rend service aux nageurs en agissant sur le confort et la sécurité pour satisfaire le besoin de se baigner.'
        },
        gare: {
            produit: 'Gare ferroviaire',
            utilisateur: 'Les voyageurs',
            matiere: 'Le déplacement, l\'organisation',
            fonction: 'Se déplacer, voyager en train',
            phrase: 'La gare ferroviaire rend service aux voyageurs en agissant sur le déplacement pour satisfaire le besoin de voyager en train.'
        },
        hopital: {
            produit: 'Hôpital',
            utilisateur: 'Les patients, les familles',
            matiere: 'La santé, le bien-être',
            fonction: 'Se soigner, guérir',
            phrase: 'L\'hôpital rend service aux patients en agissant sur la santé pour satisfaire le besoin de se soigner.'
        },
        bibliotheque: {
            produit: 'Bibliothèque municipale',
            utilisateur: 'Les lecteurs, les habitants',
            matiere: 'La culture, le savoir',
            fonction: 'Se documenter, lire, apprendre',
            phrase: 'La bibliothèque rend service aux lecteurs en agissant sur la culture pour satisfaire le besoin de se documenter.'
        },
        station: {
            produit: 'Station-service',
            utilisateur: 'Les automobilistes',
            matiere: 'Le carburant, l\'énergie',
            fonction: 'Faire le plein, se ravitailler',
            phrase: 'La station-service rend service aux automobilistes en agissant sur le carburant pour satisfaire le besoin de faire le plein.'
        },
        pont: {
            produit: 'Pont',
            utilisateur: 'Les automobilistes, les piétons',
            matiere: 'La traversée, le franchissement',
            fonction: 'Traverser un obstacle (rivière, vallée)',
            phrase: 'Le pont rend service aux automobilistes en agissant sur la traversée pour satisfaire le besoin de franchir un obstacle.'
        },
        eglise: {
            produit: 'Église',
            utilisateur: 'Les fidèles, la communauté',
            matiere: 'La spiritualité, le recueillement',
            fonction: 'Prier, se recueillir, célébrer',
            phrase: 'L\'église rend service aux fidèles en agissant sur la spiritualité pour satisfaire le besoin de se recueillir.'
        },
        velo: {
            produit: 'Vélo',
            utilisateur: 'Le cycliste',
            matiere: 'Le déplacement, l\'effort physique',
            fonction: 'Se déplacer, faire du sport, se promener',
            phrase: 'Le vélo rend service au cycliste en agissant sur le déplacement pour satisfaire le besoin de se déplacer.'
        },
        smartphone: {
            produit: 'Smartphone',
            utilisateur: 'L\'utilisateur, le propriétaire',
            matiere: 'La communication, l\'information',
            fonction: 'Communiquer, s\'informer, se divertir',
            phrase: 'Le smartphone rend service à l\'utilisateur en agissant sur la communication pour satisfaire le besoin de communiquer.'
        }
    };

    let currentObject = 'piscine';
    const practiceBtns = document.querySelectorAll('.practice-btn');
    const selectedLabel = document.getElementById('selectedObjectLabel');
    const correctionExample = document.getElementById('correctionExample');
    const correctionText = document.getElementById('correctionText');

    practiceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            practiceBtns.forEach(b => {
                b.style.background = '#f1f5f9';
                b.style.borderColor = '#e2e8f0';
            });
            this.style.background = '#dcfce7';
            this.style.borderColor = '#52b788';

            currentObject = this.dataset.object;
            const data = corrections[currentObject];
            if (selectedLabel) selectedLabel.textContent = data.produit;

            ['pProduit', 'pUtilisateur', 'pMatiere', 'pFonction', 'pPhrase'].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.value = '';
            });
            if (correctionExample) correctionExample.style.display = 'none';
        });
    });

    const showCorrectionBtn = document.getElementById('showCorrectionBtn');
    if (showCorrectionBtn) {
        showCorrectionBtn.addEventListener('click', function() {
            const data = corrections[currentObject];
            if (correctionText) {
                correctionText.innerHTML = `
                    <strong>Produit :</strong> ${data.produit}<br>
                    <strong>Utilisateur :</strong> ${data.utilisateur}<br>
                    <strong>Matière d'œuvre :</strong> ${data.matiere}<br>
                    <strong>Fonction d'usage :</strong> ${data.fonction}<br>
                    <strong>Phrase :</strong> <em>${data.phrase}</em>
                `;
            }
            if (correctionExample) correctionExample.style.display = 'block';
        });
    }

    // Logic Quiz
    const answers = {
        q1_1: 'D', q1_2: 'C', q1_3: 'A', q1_4: 'B',
        q2_1: 'B', q2_2: 'B', q2_3: 'B', q2_4: 'C'
    };
    let quizScores = { 1: 0, 2: 0 };
    let quizChecked = { 1: false, 2: false };

    function getGrade(score, max) {
        const pct = (score / max) * 100;
        if (pct >= 90) return { text: '🌟 Excellent !', bg: '#dcfce7', color: '#166534' };
        if (pct >= 70) return { text: '👍 Très bien !', bg: '#fef3c7', color: '#92400e' };
        if (pct >= 50) return { text: '📖 Peut mieux faire', bg: '#fee2e2', color: '#991b1b' };
        return { text: '🔁 À réviser', bg: '#fef2f2', color: '#7f1d1d' };
    }

    function checkQuiz(quizNum) {
        const container = document.getElementById(`quiz${quizNum}`);
        if (!container) return;
        const questions = container.querySelectorAll('.quiz-question');
        let correct = 0;

        questions.forEach(q => {
            const qName = q.dataset.q;
            const selected = q.querySelector('input[type="radio"]:checked');
            const userAnswer = selected ? selected.value : null;
            const correctAnswer = answers[qName];

            q.style.background = 'transparent';

            if (userAnswer === correctAnswer) {
                q.style.background = '#dcfce7';
                correct++;
            } else if (userAnswer !== null) {
                q.style.background = '#fee2e2';
            }
        });

        quizScores[quizNum] = correct;
        quizChecked[quizNum] = true;
        document.getElementById(`score${quizNum}`).textContent = `${correct} / ${questions.length}`;

        const total = quizScores[1] + quizScores[2];
        document.getElementById('totalScoreDisplay').textContent = total;
        const grade = getGrade(total, 8);
        const badge = document.getElementById('gradeDisplay');
        badge.textContent = grade.text;
        badge.style.background = grade.bg;
        badge.style.color = grade.color;

        const sendBtn = document.getElementById('sendToSheetBtn');
        if (quizChecked[1] && quizChecked[2]) {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
        }
    }

    document.querySelectorAll('.btn-check-quiz').forEach(btn => {
        btn.addEventListener('click', function() {
            checkQuiz(parseInt(this.dataset.quiz));
        });
    });

    // Envoi vers Google Sheets
    document.getElementById('sendToSheetBtn').addEventListener('click', async function() {
        const feedback = document.getElementById('sendFeedback');
        const btn = this;
        btn.disabled = true;
        btn.textContent = '⏳ Envoi en cours...';

        const total = quizScores[1] + quizScores[2];
        const studentName = document.getElementById('studentName').value;

        const details = [];
        document.querySelectorAll('.quiz-question').forEach(q => {
            const qName = q.dataset.q;
            const selected = q.querySelector('input[type="radio"]:checked');
            const userAnswer = selected ? selected.value : 'Non répondu';
            details.push({
                question: qName,
                userAnswer: userAnswer,
                correctAnswer: answers[qName],
                isCorrect: userAnswer === answers[qName]
            });
        });

        const payload = {
            timestamp: new Date().toISOString(),
            nom: currentStudent ? currentStudent.nom : '',
            prenom: currentStudent ? currentStudent.prenom : '',
            classe: currentStudent ? currentStudent.classe : '',
            studentName: studentName,
            score: total,
            maxScore: 8,
            percentage: Math.round((total / 8) * 100),
            quiz1: quizScores[1],
            quiz2: quizScores[2],
            grade: getGrade(total, 8).text,
            details: details
        };

        const targetUrl = (typeof CONFIG !== 'undefined' && CONFIG.ANALYSE_WEB_APP_URL)
            ? CONFIG.ANALYSE_WEB_APP_URL
            : '';

        if (!targetUrl || targetUrl === 'COLLER_ICI_URL_APPS_SCRIPT_ANALYSE') {
            feedback.textContent = '⚠️ Module prêt ! L\'enseignant doit configurer ANALYSE_WEB_APP_URL dans js/config.js.';
            feedback.style.color = '#d97706';
            btn.textContent = '✅ Validé (Local)';
            return;
        }

        try {
            await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payload)
            });

            feedback.textContent = '✅ Note envoyée avec succès vers Google Sheets !';
            feedback.style.color = '#16a34a';
            btn.textContent = '✅ Envoyé !';
        } catch (error) {
            console.error('Erreur d\'envoi :', error);
            feedback.textContent = '❌ Erreur lors de l\'envoi. Vérifiez la connexion et l\'URL Apps Script.';
            feedback.style.color = '#dc2626';
            btn.textContent = '📤 Réessayer';
            btn.disabled = false;
        }
    });
}
