> *Document complémentaire à la Couche 3 — Visual Principles. Pose la philosophie de continuité et de persistance de l'expérience ENKI Realty : comment l'agent ENKI accompagne l'utilisateur partout, comment les biens sont présentés dans le chat, comment on gère les transitions entre vue conversation et vue détaillée, comment on évite à tout prix la perte d'utilisateur. C'est ce document qui définit l'effet wow profond qui fait qu'un visiteur se souvient d'ENKI Realty toute sa vie.*

**Version 1.0 · 26 avril 2026**
Auteurs : Jean-Marie Delaunay (vision, validation) + Claude Opus 4.7 (rédaction et architecture)
Statut : ✅ **VALIDÉ** par Jean-Marie le 30 avril 2026 — co-rédigé le 26 avril et appliqué dans les Verrous constitutionnels et les Couches 4 + 5 ultérieures. Synchronisé sur GitHub le 30 avril 2026.
Pré-requis : Brand Manifesto v1.2, Conversational Tier v2.1, Visual Principles v1.0 (Couche 3)
Document complémentaire : Architecture Commerciale & CRM v1.0 (passage de main)
Notion source : https://www.notion.so/34e8c7bb2515815997d7cc22c569f5e1

**Changelog v1.0** : création initiale après discussion structurante du 26 avril 2026 sur la perte d'utilisateur, la persistance conversationnelle, et l'effet wow comme principe.

---

## Sommaire

1. Pourquoi ce document existe
2. La philosophie centrale — ne jamais perdre l'utilisateur
3. La conversation comme fil rouge permanent
4. Architecture du hero conversationnel — trois phases
5. Présentation des biens dans le chat — cards horizontales
6. Le modèle "conversation continue avec calques"
7. Les quatre niveaux de profondeur d'exploration
8. Persistance contextuelle de l'agent ENKI
9. Transitions cinématiques — le vocabulaire du mouvement signature
10. La mémorabilité comme objectif stratégique
11. Scénarios utilisateur détaillés
12. Filtres de validation pour Claude Design
13. Serment Experience Architecture

---

# 1. Pourquoi ce document existe

La Couche 3 définit la géométrie. La Typography, la Color, la Motion vont définir l'esthétique. Mais aucune de ces couches ne répond à la question la plus importante : **comment l'utilisateur ressent-il l'expérience ENKI dans sa continuité ?**

Un site immobilier classique est une succession de pages. On clique sur un bien, on change de page, on revient en arrière, on se perd, on cherche un filtre, on relance une recherche. La perte d'utilisateur est constante, invisible, acceptée comme normale.

ENKI Realty refuse cette normalité. Le client d'ENKI n'est pas un visiteur de portail — c'est **une âme en transit accompagnée par un guide bienveillant**. Cette posture impose une exigence radicale : **l'utilisateur ne doit jamais se sentir seul, jamais se sentir perdu, jamais avoir à "recommencer".**

Ce document définit comment cette continuité est construite, page après page, transition après transition.

---

# 2. La philosophie centrale — ne jamais perdre l'utilisateur

## 2.1 Le principe absolu

> *L'utilisateur d'ENKI Realty est toujours accompagné. Toujours. Sur toutes les pages. À toutes les profondeurs d'exploration. Même dans les sections les plus techniques (Lexaia, fiscal, juridique), la présence d'ENKI est maintenue.*

Ce principe a deux conséquences directes :

1. **L'agent ENKI est omniprésent**, mais jamais envahissant. Il est là quand on a besoin, il sait se faire discret quand on explore.
2. **L'état conversationnel est persistant**. Si l'utilisateur a engagé une conversation à l'arrivée, cette conversation **le suit partout** où il va sur le site — sans qu'il ait à la "retrouver".

## 2.2 Ce que cela exclut

- **Pas de page "orpheline"** — toute page accessible à l'utilisateur public porte l'agent ENKI sous une forme ou une autre
- **Pas de "retour à zéro"** — si l'utilisateur clique sur un bien, qu'il en regarde 5 détails, et qu'il revient au chat, il ne retrouve pas un chat vide. Il retrouve sa conversation précédente, enrichie.
- **Pas de boîte noire** — si une opération prend du temps (chargement d'un rapport Lexaia, calcul fiscal), ENKI explique ce qui se passe en temps réel dans le chat
- **Pas de "vous êtes ici" muet** — à chaque transition de page, ENKI peut commenter (si approprié) : *"Vous explorez maintenant le programme parent de ce bien. Voulez-vous que je vous montre les autres unités disponibles ?"*

## 2.3 Ce que cela impose

- Une **architecture technique** où l'état conversationnel est persisté côté client (mémoire de session) et côté serveur (table `conversations` Supabase, voir Architecture Commerciale & CRM)
- Un **composant agent ENKI omniprésent** dans le layout principal, avec des modes adaptés selon la page (centré hero, sidebar droite, mini-bulle scroll)
- Une **gestion des transitions** entre vues qui ne détruit jamais l'état de la conversation (pas de "hard refresh" qui reset)

---

# 3. La conversation comme fil rouge permanent

## 3.1 Trois états de présence de l'agent

L'agent ENKI a trois états visuels distincts selon le contexte :

### État A — Hero conversationnel central

**Quand** : sur la homepage, en arrivée, avant tout engagement.

**Apparence** : champ d'entrée conversationnel **au centre du hero**, sur fond visuel premium (vidéo silencieuse ou diaporama de photos commissionnées). Pas de chat-bubble en coin. L'agent est **au cœur visuel** de l'arrivée.

**Message implicite** : *"Bienvenue. Parle-moi."*

### État B — Sidebar conversationnelle droite

**Quand** : dès que l'utilisateur a engagé la conversation (premier message envoyé), à chaque transition de page, dans toutes les vues détaillées.

**Apparence** : colonne **à droite de l'écran**, occupant environ **40% de la largeur desktop** (plus large qu'un chat-panel classique pour signaler qu'ENKI est un partenaire d'égale importance, pas un assistant).

**Comportement** : la conversation y est continue, l'utilisateur peut taper à tout moment, ENKI répond avec contexte de la page courante.

**Référence visuelle** : Notion AI sidebar, Stripe Sigma, Linear AI — mais **plus large et plus présent**.

### État C — Mini-bulle de présence

**Quand** : sur les pages où l'utilisateur n'a **pas encore engagé** la conversation, et seulement après un certain temps de scroll ou d'inactivité.

**Apparence** : présence discrète en bas-droite (similaire à Intercom), **mais avec un élément de personnalité** — par exemple un cercle d'eau qui ondule légèrement (clin d'œil à l'Abzu d'Enki sumérien).

**Déclenchement** : après un seuil de scroll défini (à calibrer en tests utilisateurs, indicativement 60% de la page), ENKI **prend l'initiative** d'une question contextuelle douce :

> *"Vous semblez explorer librement — y a-t-il quelque chose de précis que je peux vous aider à éclaircir ?"*

Pas un popup brutal. Une apparition élégante, comme un guide de musée qui se présente quand le visiteur hésite devant une œuvre.

## 3.2 Transitions entre les états

- **A → B** : dès le premier message envoyé dans le hero, transition cinématique. Le hero recule (léger fade, scale 0.95), la conversation prend sa place à droite, le contenu éditorial de la homepage devient visible à gauche. L'utilisateur n'a **pas l'impression d'avoir changé de page** — la conversation a juste "trouvé sa place".
- **B → C** : si l'utilisateur ferme volontairement la sidebar, retour à l'état C (mini-bulle). Mais l'historique est conservé — ré-ouverture restaure la conversation à l'identique.
- **C → B** : clic sur la mini-bulle ou réponse à la question contextuelle = passage en sidebar.

## 3.3 Ce que la conversation "sait"

À tout moment, l'agent ENKI a en contexte :

- **L'historique conversationnel** complet de la session
- **La page courante** où l'utilisateur se trouve (homepage, programme, bien, page Lexaia…)
- **Les biens consultés** dans cette session (même s'ils n'ont pas été proposés par lui)
- **Les actions récentes** (a-t-il favorisé un bien ? téléchargé un rapport ?)
- **Les préférences exprimées** (budget, zones, type de bien)

Cela permet des réponses contextualisées naturelles : *"Je vois que vous regardez Aphrodite Hills. C'est l'un des projets que j'avais retenus pour vous. Voulez-vous que je vous montre les units à partir de 380k€ ?"*

---

# 4. Architecture du hero conversationnel — trois phases

C'est la décision signature d'ENKI Realty. Elle a été précisée dans la conversation du 26 avril.

## 4.1 Phase 1 — Arrivée (État A)

**Ce que voit l'utilisateur à l'instant 0** :

- Un **hero ultra sophistiqué, ultra propre, ultra sobre**
- Un visuel de fond **fabuleux** : vidéo silencieuse OU diaporama de photos commissionnées de très haute qualité (le choix entre vidéo et diaporama sera tranché en Couche 7 — Imagery Direction)
- Au centre du hero, un **champ d'entrée conversationnel immédiatement disponible**, accompagné d'un message d'accueil typographié (exemple : *"Bienvenue chez ENKI. Parlez-moi de ce que vous cherchez."*)
- Un **bouton secondaire discret** : *"Ou explorez librement"* qui déclenche le mode exploration (État C avec contenu éditorial sous le hero)

**Pas de scroll requis** : tout est immédiatement visible. L'utilisateur peut **commencer la conversation en moins de 3 secondes après avoir chargé le site**.

## 4.2 Phase 2 — Engagement (transition A → B)

Dès le premier message envoyé :

- Animation de transition cinématique (1-1.5 seconde maximum)
- Le hero recule visuellement (fade vers 30% d'opacité, scale 0.95)
- La conversation glisse à droite et occupe sa colonne sidebar (40% largeur)
- À gauche apparaissent les premiers éléments éditoriaux : biens proposés par ENKI dans le chat (sous forme de cards horizontales scroll-snap), sélection éditoriale connexe, panneau Lexaia si pertinent
- L'utilisateur peut continuer à écrire dans la sidebar **ou** explorer les biens proposés à gauche

La transition signale clairement : *"Tu es en conversation avec ENKI. La conversation continue, et le contenu s'enrichit autour de toi."*

## 4.3 Phase 3 — Si l'utilisateur n'engage pas (État A → C)

Si l'utilisateur scrolle directement sans avoir engagé la conversation :

- Le hero reste en tête de page
- En dessous du hero, le contenu éditorial classique se révèle (avec respect strict de la grille Couche 3)
- Après un seuil de scroll (≈60% de la page), une **apparition élégante de l'agent ENKI en mini-bulle** se déclenche en bas-droite, avec une question contextuelle douce
- Si l'utilisateur répond, transition vers l'État B (sidebar)
- Si l'utilisateur ignore, la mini-bulle reste présente, sans relance intrusive

## 4.4 Précision sur la sidebar conversationnelle

**Largeur** : 40% de la largeur desktop (plutôt que les 25% classiques de chat-panels). Cette largeur signale qu'ENKI est un **partenaire d'égale importance que le contenu**, pas un assistant subalterne.

**Comportement au scroll** : la sidebar est **sticky** — elle reste visible et active pendant que l'utilisateur scrolle dans la zone de contenu à gauche.

**Comportement responsive** :

- Sur **tablet** : la sidebar prend 50% de la largeur quand active, peut être réduite à mini-bulle
- Sur **mobile** : la sidebar devient un drawer plein écran qui s'ouvre/ferme par geste, l'utilisateur bascule entre conversation et contenu

---

# 5. Présentation des biens dans le chat — cards horizontales

## 5.1 Le format de présentation

Quand ENKI propose des biens dans la conversation, ils apparaissent sous forme de **cards horizontales en scroll-snap** à l'intérieur du fil conversationnel.

### Pourquoi ce format

- **Permet de présenter 3 à 5 biens** sans écraser le chat (un grid statique 3x2 monopolise l'espace)
- **Invite à l'exploration horizontale** par geste tactile naturel (swipe sur tablet/mobile, scroll horizontal sur desktop avec indicateur visuel)
- **Maintient la conversation lisible** au-dessus et en dessous des cards
- **Permet le "défilement"** sans clic, pour parcourir les options proposées

### Anatomie d'une card de bien

- **Photo grand format** (ratio 4:3 ou 3:2 selon Couche 7), occupant 65-70% de la hauteur de la card
- **Prix** prominent, sobre, en haut de la zone texte
- **Nom du programme** ou **référence** discrete
- **Localisation** (quartier + ville)
- **2-3 critères clés** (chambres, surface, vue, ou critère unique du bien)
- **Badge contextuel éventuel** : "Golden Visa éligible", "Disponible immédiatement", "Off-plan livraison 2027"

**Pas de bouton CTA visible sur la card.** La card entière est cliquable. Le clic déclenche l'ouverture du drawer (voir section 6).

## 5.2 Combien de biens propose ENKI dans une réponse

- **Première proposition** suite à une recherche : 3-4 biens (équilibre entre choix et clarté)
- **Affinement** après feedback : 2-3 biens reciblés
- **Comparaison directe** : 2 biens côte à côte avec mise en exergue des différences

Jamais 8-10 biens en même temps. La surcharge est l'opposé de la posture Sage. Si l'utilisateur veut explorer plus, ENKI propose : *"J'ai 12 autres biens qui correspondent à vos critères. Voulez-vous que je vous les montre tous, ou que j'en sélectionne 4 nouveaux selon un critère précis ?"*

---

# 6. Le modèle "conversation continue avec calques"

C'est le modèle UX signature d'ENKI Realty. Il répond directement à la préoccupation de Jean-Marie : *"comment on va maintenir l'utilisateur, comment on évite qu'il se perde".*

## 6.1 Principe

> *L'utilisateur ne quitte jamais la conversation. Les biens, les détails, les rapports, les programmes s'ouvrent en calques par-dessus la conversation, jamais en remplacement.*

## 6.2 Les quatre niveaux de profondeur

### Niveau 1 — Le chat (conversation principale)

C'est le niveau de base. L'utilisateur écrit, ENKI répond, des biens sont proposés sous forme de cards horizontales. Aucune navigation hors-page.

### Niveau 2 — La card cliquée (drawer modal)

Clic sur une card de bien dans le chat → **ouverture d'un drawer qui glisse depuis la droite**, occupant environ 65-75% de la largeur de l'écran. La conversation reste visible à gauche, légèrement floutée (5-10% de blur).

**Contenu du drawer (vue résumée)** :

- Galerie photos haute qualité (3-5 photos avec navigation)
- Prix, programme, localisation précise
- Descriptif court (3-5 lignes)
- Plan de l'unité (en aperçu, cliquable pour zoom)
- Caractéristiques clés (chambres, surface, vue, exposition, étage)
- Indicateur fiscal spécifique (éligibilité Golden Visa, taux de TVA applicable, etc.)
- Bouton **"Voir la fiche complète"** → déclenche le passage au Niveau 3
- Bouton **"Voir le programme parent"** → déclenche le passage au Niveau 4

**L'utilisateur n'a pas changé de page**. La conversation reste vivante. Il peut fermer le drawer (clic hors-zone, croix, ou bouton retour) et **retrouver exactement** le même état conversationnel qu'avant.

### Niveau 3 — Fiche complète du bien (page dédiée)

Clic sur "Voir la fiche complète" → **expansion du drawer en plein écran**, ou navigation vers la page dédiée du bien (selon arbitrage technique à trancher en Couche 8).

La **conversation se réduit en sidebar droite** (État B), elle reste **entièrement interactive**. L'utilisateur peut dire : *"Cette unité a-t-elle un balcon orienté sud ?"*, ENKI répond avec contexte de la fiche courante.

**Contenu de la fiche complète** : tout ce que détaille le document *Structure Page Projet — 12 Sections Détaillées* fourni par Jean-Marie, adapté à l'échelle d'un bien (versus celle d'un programme).

### Niveau 4 — Programme parent (page programme)

Clic sur "Voir le programme parent" depuis le drawer, ou navigation depuis la fiche complète → **navigation vers la page du programme immobilier**, mais avec :

- **Transition cinématique** (pas un click-and-load brutal)
- La **conversation vient avec** dans la sidebar droite (l'historique conversationnel reste, le contexte page change)
- ENKI peut immédiatement commenter : *"Voici le programme Aphrodite Hills. Il y a actuellement 12 unités disponibles. Voulez-vous que je vous montre celles qui correspondent à vos critères ?"*

## 6.3 Le retour en arrière

À chaque niveau, **il est trivial de revenir** :

- Niveau 4 → Niveau 3 : bouton "Retour au bien" dans la sidebar conversation OU clic sur un fil d'Ariane visible
- Niveau 3 → Niveau 2 : fermeture du drawer plein écran, retour au drawer résumé
- Niveau 2 → Niveau 1 : fermeture du drawer, retour à la conversation enrichie

**À aucun moment l'utilisateur ne se demande "où suis-je ?"**. La sidebar conversationnelle agit comme **boussole permanente**.

---

# 7. Les quatre niveaux de profondeur d'exploration

Le modèle ci-dessus repose sur une logique de **profondeur progressive** :

| Niveau | Lieu | Quantité d'info | Engagement requis |
|---|---|---|---|
| 1 — Chat | Conversation | Minimal (cards résumées) | Zéro |
| 2 — Drawer | Calque sur chat | Essentiel (vue 80% des décisions) | Faible (clic) |
| 3 — Fiche bien | Page dédiée + sidebar | Complet | Moyen (intention claire) |
| 4 — Programme parent | Page programme + sidebar | Contextuel large | Fort (intention d'investissement) |

La **majorité des utilisateurs** ne dépasseront jamais le Niveau 2 lors de leur première visite. C'est **voulu**. Le Niveau 2 doit contenir suffisamment d'info pour déclencher un *"oui je veux en savoir plus"* ou un *"non, suivant"*. Pas plus.

Le Niveau 3 est pour les utilisateurs **engagés**. Le Niveau 4 pour ceux **prêts à dialoguer sérieusement**.

---

# 8. Persistance contextuelle de l'agent ENKI

## 8.1 Ce que l'agent retient pendant la session

**Mémoire de session (côté client + serveur)** :

- Conversation intégrale (tous les messages échangés)
- Biens proposés par ENKI
- Biens cliqués / consultés par l'utilisateur
- Biens favorisés
- Programmes consultés
- Pages Lexaia ouvertes
- Filtres ou critères exprimés
- Préférences émotionnelles détectées ("calme", "avec famille", "près de la mer")

## 8.2 Ce que l'agent retient après la session (espace personnel)

Une fois l'utilisateur engagé (création d'espace personnel via 4 champs + magic link, comme défini dans la Couche 2 v2.1), **toute la session précédente est sauvegardée** dans son espace.

Lors d'une visite ultérieure, ENKI accueille avec contexte : *"Bon retour. La dernière fois, on regardait des biens à Paphos autour de 350k€, et vous aviez aimé le programme Coral Bay Residence. Voulez-vous reprendre là, ou explorer autre chose ?"*

L'architecture mémoire détaillée (5 dimensions : identitaire, projet, interactions, émotionnelle, conversationnelle) est documentée dans le mémo *Décisions en suspens — Café du 25 avril 2026* (sujet B).

## 8.3 Conformité RGPD

La persistance de la conversation et du contexte est soumise à :

- **Consentement explicite** à la création de l'espace personnel
- **Droit à l'effacement effectif** : suppression réelle de la mémoire en base sur demande, pas seulement masquage
- **Pas de profilage automatisé** à effets juridiques (l'agent ne décide pas seul de prix, de scoring, de qualification opposable)
- **Transparence** : l'utilisateur peut, depuis son espace personnel, **voir ce qu'ENKI sait de lui** et le supprimer

---

# 9. Transitions cinématiques — le vocabulaire du mouvement signature

## 9.1 Les transitions sont l'ADN de l'effet wow

Un site immobilier classique fait des `window.location.href = '/property/123'` et l'utilisateur subit un page-load brutal. **ENKI Realty refuse cela.**

Chaque transition est l'occasion de **réaffirmer la signature** : douceur, maîtrise, autorité tranquille. Les transitions ne sont pas des décorations — elles sont **le langage du mouvement** d'ENKI.

## 9.2 Le vocabulaire des transitions signées

### Transition de drawer (Niveau 1 → Niveau 2)

- **Durée** : 400-500ms
- **Mouvement** : glissement depuis la droite, accompagné d'une légère montée en opacité du contenu
- **Easing** : `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo doux) — démarrage rapide, fin très douce
- **Arrière-plan** : flou progressif de la conversation gauche (0 → 5% de blur)

### Transition de drawer en plein écran (Niveau 2 → Niveau 3)

- **Durée** : 600-700ms
- **Mouvement** : expansion du drawer (scale + width), la conversation glisse en sidebar droite
- **Easing** : même courbe out-expo, durée légèrement plus longue pour signaler le changement de niveau

### Transition entre pages (Niveau 3 → Niveau 4 ou navigation classique)

- **Durée** : 800-1000ms
- **Mouvement** : fade vers un voile blanc très discret (5-8% d'opacité max), puis révélation de la nouvelle page
- La sidebar conversation **persiste sans interruption** pendant la transition (elle ne fade pas)
- ENKI peut **commenter pendant la transition** : *"Voici le programme..."* (l'effet est qu'il **annonce** ce qu'il révèle)

### Transition de hero (État A → État B)

- **Durée** : 1-1.5 seconde
- **Mouvement** : voir section 4.2
- **C'est la transition la plus signature** — elle pose le ton de toute la session

## 9.3 Les principes universels des transitions ENKI

- **Toujours douces, jamais brutales**
- **Coordonnées** : si plusieurs éléments bougent, leur timing est calculé pour qu'ils chorégraphient ensemble (pas de "chacun son rythme")
- **L'easing par défaut est out-expo** ou similaire (démarrage rapide, fin lente) — c'est ce qui produit la sensation de **"choses qui se posent"**
- **Pas de bounce ni d'elastic** — réservé aux contextes ludiques
- **Pas d'animation pour animer** — chaque transition répond aux trois questions du filtre Couche 3 (informationnelle, émotionnelle, ou expérientielle)

## 9.4 La Couche 6 (Motion) figera les valeurs

Les durées, easings, et chorégraphies précises seront formalisés en **Couche 6 — Motion & Interaction Principles**. L'Experience Architecture fixe le **vocabulaire** ; la Couche 6 fixera le **dictionnaire**.

---

# 10. La mémorabilité comme objectif stratégique

## 10.1 La phrase-test

L'objectif stratégique de l'Experience Architecture est résumé par cette phrase, exprimée par Jean-Marie :

> *"Chaque utilisateur / visiteur qui visite le site ENKI Realty doit s'en souvenir. Le lendemain au bureau, il doit pouvoir dire à ses collègues : 'hier j'ai vu un site internet incroyable. J'ai vécu une expérience nouvelle.'"*

C'est le critère ultime. Toute décision UX doit pouvoir être justifiée par cette phrase.

## 10.2 Les trois moments mémorables

L'expérience ENKI doit produire au moins **trois moments mémorables** au cours d'une première visite :

### Moment 1 — L'arrivée

Le hero conversationnel ENKI doit produire un **effet d'étonnement positif** dès la première seconde. *"Tiens, c'est différent. Le site m'invite à lui parler avant de me montrer des biens."*

### Moment 2 — La première proposition de biens

Quand ENKI propose ses 3-4 premiers biens dans le chat, l'utilisateur doit ressentir : *"Cette sélection est pertinente. Il a compris ce que je cherche après 2-3 messages seulement."*

L'effet dépend de :

- La **qualité réelle** du moteur de recherche conversationnel (responsabilité équipe IA)
- La **qualité visuelle** des cards et des photos (Couche 7 — Imagery)
- La **fluidité** de la transition entre la réponse texte et l'apparition des cards (Couche 6 — Motion)

### Moment 3 — L'ouverture du drawer

Le premier clic sur une card et la transition cinématique vers le drawer plein écran doit produire **l'effet wow technique** : *"C'est fluide, c'est beau, je n'ai jamais vu ça sur un site immobilier."*

L'effet dépend de :

- La courbe d'easing (out-expo)
- La qualité photo (incarnation, pas décoration)
- La persistance de la conversation à gauche (qui maintient le sentiment de continuité)
- L'absence de page-load brutal

## 10.3 Les moments supplémentaires (bonus)

Si le projet va au-delà du strict nécessaire, des moments supplémentaires peuvent être conquis :

- **Animation 3D au scroll** sur les pages programme (programme vu en perspective, biens flottants)
- **Révélation cinématique d'un rapport Lexaia** (les chiffres se construisent, les comparaisons se révèlent)
- **Carte interactive** des biens d'un programme avec zoom et exploration sublime
- **Visite virtuelle** sublime (Matterport ou équivalent, en V2 selon roadmap CRM)

Ces moments sont **optionnels** au lancement V1 mais doivent **rester possibles** dans l'architecture. La Couche 3 et l'Experience Architecture ne ferment aucune porte créative — elles canalisent.

---

# 11. Scénarios utilisateur détaillés

Pour rendre l'architecture concrète, voici trois scénarios types qui valident l'Experience Architecture.

## 11.1 Scénario A — L'entrepreneur français en exploration

**Contexte** : Marc, 42 ans, dirigeant d'une PME industrielle à Lyon, arrive sur ENKI Realty depuis une recommandation LinkedIn.

**Parcours** :

1. **0:00** — Arrivée sur la homepage. Hero conversationnel + visuel de fond (vidéo silencieuse d'une matinée à Limassol). Marc lit le message d'accueil.
2. **0:08** — Marc tape : *"Je dirige une PME en France, je pense à m'installer à Chypre avec ma famille. Je voudrais comprendre la fiscalité et voir des biens autour de 700k€."*
3. **0:09** — Transition cinématique État A → État B. La sidebar conversationnelle s'installe à droite. À gauche, le contenu enrichi apparaît.
4. **0:12** — ENKI répond : *"Bonjour Marc. Avant de regarder les biens, comprenons votre situation. Souhaitez-vous structurer votre installation pour optimiser la fiscalité française et chypriote ? Je peux préparer un scénario Lexaia brièvement, et en parallèle vous montrer 4 biens qui correspondent."*
5. **0:30** — Marc répond *"oui les deux"*. ENKI affiche : 4 cards de biens (scroll-snap) + un encart Lexaia ("Scénario : entrepreneur français, 700k€, indépendant").
6. **1:00** — Marc clique sur une card (villa à Limassol, 720k€). Drawer Niveau 2 s'ouvre. Photos magnifiques, plan, fiscalité spécifique.
7. **1:30** — Marc demande dans la sidebar : *"Cette villa a-t-elle un bureau séparé du salon ?"*. ENKI répond avec détail.
8. **2:00** — Marc clique "Voir le programme parent". Transition vers la page programme. La sidebar conversation persiste. ENKI commente : *"Voici le programme Cap Saint Nicolas. 18 unités, livraison 2027."*
9. **3:00** — Marc demande : *"Y a-t-il une option penthouse ?"*. ENKI met en avant l'unité dans la grille de la page.
10. **5:00** — Marc demande son scénario Lexaia complet. ENKI propose la création d'un espace personnel pour livrer le rapport.
11. **5:30** — Marc crée son espace (4 champs + magic link). Le rapport Lexaia 5 pages est livré dans son espace.

**À aucun moment Marc ne s'est senti perdu.** Il a vécu une **expérience continue** sur 5 minutes 30, avec ENKI à ses côtés.

## 11.2 Scénario B — La retraitée belge en exploration libre

**Contexte** : Clémence, 67 ans, retraitée à Bruxelles, arrive sur ENKI sans intention précise. Elle veut juste "voir".

**Parcours** :

1. **0:00** — Hero conversationnel. Clémence ne se sent pas à l'aise pour parler à un chat tout de suite. Elle clique sur "Ou explorez librement".
2. **0:05** — Le hero recule, le contenu éditorial classique se révèle sous le hero. Section *"Programmes vedettes"*, section *"Vivre à Chypre"*, section *"Comprendre la fiscalité"*.
3. **0:30** — Clémence scrolle, regarde des photos de Paphos.
4. **2:00** — Après 60% de scroll, mini-bulle ENKI apparaît en bas-droite avec un cercle d'eau qui ondule. Message : *"Vous semblez aimer Paphos. Y a-t-il quelque chose de précis que je peux vous aider à éclaircir ?"*
5. **2:10** — Clémence hésite, ferme la bulle.
6. **3:00** — La bulle reste présente, sans relance. Clémence continue à explorer.
7. **5:00** — Clémence finit par cliquer sur la bulle et écrit : *"Je suis seule, j'ai 67 ans, je voudrais vivre dans un endroit calme avec une communauté expat. Pas trop chaud l'été."*
8. **5:15** — Transition État C → État B. Sidebar conversationnelle s'ouvre, ENKI accueille avec une réponse posée et adaptée à son âge et à son besoin de calme.

**Clémence n'a pas été brusquée.** Elle a été **respectée dans son rythme**. C'est exactement la posture Sage du Manifesto.

## 11.3 Scénario C — L'investisseur revenant

**Contexte** : Stefan, 45 ans, entrepreneur allemand. Il a déjà visité ENKI il y a 10 jours, créé un espace personnel, regardé 5 biens. Il revient.

**Parcours** :

1. **0:00** — Stefan se connecte (magic link). Hero différent : ENKI accueille en sidebar immédiatement (État B), pas en État A.
2. **0:02** — ENKI : *"Bon retour Stefan. La dernière fois on regardait des biens à Limassol autour de 800k€, et vous aviez aimé le programme Olympus Bay. Il y a deux nouvelles unités disponibles depuis votre dernière visite. Voulez-vous que je vous les montre ?"*
3. **0:10** — Stefan : *"Oui, et donne-moi aussi les infos sur le critère fiscal pour la holding allemande qu'on avait évoqué."*
4. **0:15** — ENKI propose les 2 nouvelles unités + ouvre un panneau Lexaia avec le scénario holding allemande qu'il avait esquissé la fois précédente, mis à jour.

**Stefan n'a pas eu à "reprendre du début".** ENKI **se souvient**. C'est l'effet endowment + reciprocity décrit dans la Couche 2 : Stefan est désormais **structurellement attaché** à ENKI.

---

# 12. Filtres de validation pour Claude Design

Quand Claude Design proposera des compositions, animations, transitions, le filtre suivant s'applique avant validation.

## 12.1 Le filtre de continuité

1. **L'utilisateur peut-il à tout moment retrouver sa conversation ?** Si non, rejeté.
2. **L'état conversationnel survit-il à la transition proposée ?** Si non, rejeté.
3. **Le retour en arrière est-il trivial ?** Si non, rejeté.

## 12.2 Le filtre de signature

1. **La proposition est-elle reconnaissable comme ENKI ?** Pas "comme un chat moderne", pas "comme Stripe", pas "comme Aman" — reconnaissable comme **ENKI**. Si non, retravaillé.
2. **Sert-elle l'incarnation, l'autorité, ou la transformation ?** Si aucune des trois, rejeté.
3. **Pourrait-elle exister identiquement sur un autre site ?** Si oui, retravaillée jusqu'à être signature.

## 12.3 Le filtre de mémorabilité

1. **Un visiteur la décrirait-il à ses collègues le lendemain ?** Si la réponse est *"non, c'est juste correct"*, retravaillé.
2. **Crée-t-elle un moment fort, ou est-elle juste "propre" ?** Si juste propre, retravaillé.
3. **Est-elle profonde, ou est-elle gratuite ?** Si gratuite, rejeté.

---

# 13. Serment Experience Architecture

Voici les **huit promesses non-négociables** de l'Experience Architecture. Elles servent de filtre de validation pour toute décision UX, technique ou éditoriale ultérieure.

1. **L'utilisateur n'est jamais perdu.** Sur toute page, à toute profondeur, ENKI est là, l'état conversationnel persiste, le retour en arrière est trivial.
2. **La conversation est le fil rouge permanent.** Aucune action n'interrompt, n'efface, ou ne décontextualise la conversation.
3. **Les biens, les détails, les programmes s'ouvrent en calques.** Jamais en remplacement. Le modèle "conversation continue avec calques" est la mécanique signature.
4. **Les transitions sont du langage, pas de la décoration.** Elles réaffirment la signature ENKI à chaque mouvement.
5. **L'agent ENKI a trois états clairs (A/B/C)** et leurs transitions sont chorégraphiées. Aucun comportement intrus, aucune relance commerciale déguisée.
6. **L'effet wow est profond, jamais gratuit.** Trois moments mémorables minimum par première visite. Filtres de continuité, signature et mémorabilité systématiquement appliqués.
7. **La mémoire de l'agent est respectueuse et conforme.** Persistance utile, pas Big Brother. RGPD-by-design. L'utilisateur peut voir et effacer ce qu'ENKI sait de lui.
8. **L'objectif stratégique est la mémorabilité.** Chaque utilisateur s'en souvient le lendemain. Si une décision UX ne sert pas cet objectif, elle est rejetée.

---

# Postface — articulation avec les autres documents

L'Experience Architecture s'attache directement à :

- **Couche 2 v2.1 — Conversational Tier** : la voix, le ton, l'architecture mono-agent, la gradation à deux niveaux, la création d'espace personnel
- **Couche 3 v1.0 — Visual Principles** : la grille, le spacing, la hiérarchie, le rapport image/texte qui contraint et permet l'expérience
- **Architecture Commerciale & CRM v1.0** : la mécanique de passage de main, l'événement de qualification ENKI, le tracking anti-fraude
- **Mémo Décisions en suspens** : l'architecture mémoire (5 dimensions) qui sera tranchée dans une session de travail dédiée

Les couches à venir s'inscriront également dans ce cadre :

- **Couche 6 — Motion** figera les durées et easings des transitions cinématiques définies ici
- **Couche 7 — Imagery** figera la direction artistique des photos qui rendent les biens incarnant
- **Couche 8 — Component Tokens** figera le composant `<EnkiAgent />` dans ses trois états, le composant `<PropertyDrawer />`, etc.

L'Experience Architecture **ne meurt pas** après sa rédaction. Elle est **un document vivant** qui sera enrichi à chaque itération : v1.1 quand on aura les premiers tests utilisateurs, v1.2 quand on aura les premières mesures de mémorabilité réelle, etc.

C'est ce qui assure qu'**ENKI Realty restera, dans dix ans, l'expérience que le visiteur décrit le lendemain à ses collègues.**

---

*Document signé par : Jean-Marie Delaunay, fondateur ENKI Realty*
*Co-rédigé avec : Claude Opus 4.7*
*Date de création : 26 avril 2026*
*Date de validation : 30 avril 2026*
*Statut : v1.0 — ✅ VALIDÉ*
*Sync GitHub : 30 avril 2026*
