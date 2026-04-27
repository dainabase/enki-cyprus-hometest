# 🤝 Architecture Commerciale & CRM Commission Tracking — ENKI Realty v1.0

> *Document fondateur de l'architecture commerciale d'ENKI Realty. Définit le passage de main entre l'agent ENKI (acquisition + qualification du lead) et la société de vente affiliée (closing + transaction), le CRM fourni à cette société, et le mécanisme de tracking anti-fraude commission qui protège ENKI Realty.*

> **Version 1.0 · 25 avril 2026 — VALIDÉE le 27 avril 2026**
> Auteurs : Jean-Marie Delaunay (vision business + architecture B2B2C) + Claude Opus 4.7 (rédaction et structure)
> Statut : v1.0 — VALIDÉE (validation déléguée à Claude par Jean-Marie le 27 avril 2026, par cohérence avec la Couche 2 v2.1 à laquelle ce document est rattaché)
> Pré-requis : Brand Manifesto v1.2 + Couche 2 v2.1 (Conversational Tier)
> Notion source : <https://www.notion.so/34d8c7bb251581928e34c067bd299df9>
> Liens transversaux : ce document est référencé par la Couche 2 v2.1 (passage de main, section 15.8) et impacte le futur Couche 8 — Component Tokens (composants CRM)

---

## Sommaire

**PARTIE I — ARCHITECTURE COMMERCIALE B2B2C**
1. Préambule — Pourquoi ce document existe
2. La structure capitalistique invisible
3. Le passage de main : du lead qualifié à la vente
4. Le risque commission et pourquoi le tracking est non-négociable

**PARTIE II — LE CRM FOURNI À LA SOCIÉTÉ DE VENTE**
5. Philosophie produit : un CRM digne des meilleurs au monde
6. Modules fonctionnels du CRM
7. Le tracking anti-fraude commission
8. Synchronisation entre ENKI Realty et le CRM de la société de vente
9. Roadmap CRM : V1, V2, V3

**PARTIE III — IMPLICATIONS**
10. Implications juridiques et contractuelles
11. Métriques de succès et indicateurs de fraude
12. Risques identifiés et plans de mitigation

---

# PARTIE I — ARCHITECTURE COMMERCIALE B2B2C

## 1. Préambule

ENKI Realty n'est pas une agence immobilière. ENKI Realty est une **plateforme technologique** qui :

1. Acquiert des visiteurs européens via son site public et son agent conversationnel ENKI
2. Les qualifie en leads chauds via la conversation et les rapports Lexaia
3. Les transmet à une **société de vente immobilière** affiliée (la « société de vente ») qui détient la licence d'agent immobilier chypriote nécessaire pour conclure les transactions et toucher les commissions développeur.

Cette architecture B2B2C présente un avantage stratégique majeur : ENKI Realty se concentre sur ce qu'elle fait le mieux (technologie, expérience client, qualification IA) tandis que la société de vente se concentre sur ce qu'elle fait le mieux (closing, suivi commercial, exécution juridique chypriote).

Mais cette architecture présente aussi un **risque structurel critique** : la société de vente, légalement, encaisse les commissions développeur. ENKI Realty est rémunérée par la société de vente sur la base d'un accord de partage. **Sans tracking complet, indépendant et opposable, la société de vente peut occulter des transactions réussies et priver ENKI Realty de ses commissions légitimes.**

Ce document pose l'architecture qui rend cette occultation impossible.

---

## 2. La structure capitalistique invisible

### 2.1 Les trois entités

**Entité A — ENKI Realty**
La plateforme technologique. Site public, agent conversationnel, Lexaia, espace personnel client. Reçoit les visiteurs, les qualifie, les transmet à la société de vente. Pas de licence immobilière chypriote. Modèle économique : revenue share avec la société de vente.

**Entité B — La société de vente immobilière**
Entreprise de droit chypriote, titulaire de la licence d'agent immobilier requise. C'est elle qui apparaît officiellement comme l'agent immobilier dans les transactions, qui contractualise avec les développeurs, qui touche les commissions développeur, et qui reverse à ENKI Realty sa part contractuellement définie.

**Entité C — Crona Group**
Développeur immobilier chypriote, partenaire commercial d'ENKI Realty. Crona figure publiquement parmi les développeurs listés sur la plateforme, comme tout autre développeur. **Mais Crona est aussi, de manière non publique, actionnaire partiel de la société de vente (Entité B).**

### 2.2 La règle de discrétion absolue

La relation capitalistique entre Crona Group et la société de vente n'est jamais rendue publique sur la plateforme ENKI Realty. Concrètement :

- Sur le site public, Crona apparaît comme développeur normal parmi les autres
- La société de vente, lorsqu'elle est mentionnée (mentions légales, contrats, communications client), est présentée comme l'opérateur commercial neutre d'ENKI Realty
- **Aucune communication publique ne lie Crona à la société de vente**
- Aucun signal visuel, éditorial, ou structurel ne suggère cette relation

Cette règle protège trois choses :
- L'apparence d'égalité de traitement entre tous les développeurs listés sur la plateforme
- La confiance des autres développeurs partenaires (qui ne tolèreraient pas que leur principal concurrent capte une partie de leurs commissions)
- L'attractivité de la plateforme pour les visiteurs (qui ne veulent pas être vendus à un développeur en particulier mais conseillés de façon objective)

### 2.3 Implications éditoriales

Le Brand Manifesto v1.2, dans son serment (promesse 8), pose la règle de discrétion. Cette promesse a une signification précise :

**Ce qui doit rester invisible** : la structure capitalistique. Le fait que Crona est actionnaire de la société de vente. Le fait qu'une partie des commissions développeur générées par les ventes des concurrents de Crona reviennent indirectement à Crona via la société de vente.

**Ce qui n'a pas à être caché** : l'existence de Crona comme développeur listé. Crona apparaît comme tout autre développeur sur la plateforme, ses biens sont présentés comme tout autre bien, l'agent ENKI peut nommer Crona comme constructeur d'un bien lorsqu'un client le demande.

Cette nuance opérationnelle doit être strictement respectée : ne pas confondre « Crona n'existe pas » (faux et impossible à tenir) avec « la structure capitalistique reste confidentielle » (vrai et opérationnellement tenable).

---

## 3. Le passage de main : du lead qualifié à la vente

### 3.1 Les cinq étapes du parcours client

**Étape 1 — Découverte (anonyme)**
Le visiteur arrive sur le site public ENKI Realty. Il discute avec l'agent ENKI. Il consulte des biens. Il pose des questions fiscales générales et reçoit les aperçus de Niveau 1.
Responsabilité : **ENKI Realty** (plateforme technologique).

**Étape 2 — Qualification (création d'espace personnel)**
Le visiteur demande un rapport synthétique Lexaia, ce qui déclenche la création de son espace personnel. Il fournit les 4 champs initiaux. Le rapport Lexaia est généré et déposé dans son espace.
Responsabilité : **ENKI Realty**.

**Étape 3 — Approfondissement (engagement)**
Le client utilise activement son espace personnel. Il sauvegarde des biens en favoris, consulte plusieurs rapports Lexaia, reprend des conversations avec l'agent ENKI. Il identifie un ou plusieurs biens qui l'intéressent vraiment.
Responsabilité : **ENKI Realty**.

**Étape 4 — Sélection d'un bien spécifique (déclencheur)**
Le client signale un intérêt concret pour un bien donné : il demande une visite virtuelle, il pose des questions précises sur les conditions d'achat, il sollicite la fiche technique complète, il demande à parler à un conseiller humain pour ce bien.

C'est **le déclencheur du passage de main**. À ce moment précis, le lead bascule du domaine de la plateforme technologique au domaine de la société de vente.
Responsabilité : transition de **ENKI Realty** vers **la société de vente**.

**Étape 5 — Closing et transaction**
Visite physique, négociation, signature du compromis, financement, signature de l'acte authentique, livraison du bien. Toute cette phase est gérée par la société de vente.
Responsabilité : **la société de vente**.

### 3.2 Le moment exact du passage de main

Le passage de main n'est pas une transition floue. Il est marqué par un **événement technique précis** dans le système :

- Le client clique sur « Demander une visite » ou « Parler à un conseiller pour ce bien » dans son espace personnel
- OU le client demande explicitement à l'agent ENKI un échange humain pour finaliser un projet sur un bien identifié
- OU le client passe plus de 7 jours à interagir activement avec un même bien (consultations multiples, partage avec un proche, ajout de notes personnelles)

À cet instant, un événement `lead_handoff` est enregistré dans le CRM avec :
- Identifiant unique du lead
- Identifiant unique du bien concerné
- Horodatage exact du déclenchement
- Trigger spécifique (clic visite, demande humain, seuil engagement)
- Snapshot complet de l'historique du lead jusqu'à cet instant
- Signature cryptographique de l'événement (pour opposabilité)

Cet événement est **immuable** et **opposable**. Il devient la preuve juridique qu'ENKI Realty a généré et qualifié le lead avant que la société de vente ne prenne la main.

### 3.3 Communication au client lors du passage de main

Le client ne doit pas avoir l'impression d'être passé d'une équipe à une autre. La continuité éditoriale est maintenue par l'agent ENKI lui-même (cf. Couche 2 v2.1, section 15.8).

### 3.4 Ce que voit le conseiller humain à la prise de main

Le conseiller humain de la société de vente, lorsqu'il prend en charge un lead, hérite immédiatement de :

- L'identité complète du lead (4 champs initiaux + tout enrichissement ultérieur)
- L'historique conversationnel complet avec l'agent ENKI
- Tous les rapports Lexaia générés pour ce lead
- Tous les biens consultés, favoris, et le bien spécifiquement déclencheur
- Le scoring d'engagement du lead (durée totale d'interaction, profondeur des questions, signaux émotionnels)
- Les notes personnelles que le client a éventuellement laissées dans son espace
- Les recommandations d'approche commerciale générées automatiquement (« ce client est sensible à X, évite de mentionner Y »)

**Aucun lead ne se présente nu**. Le conseiller arrive avec un dossier 360° qui rend le premier contact extrêmement efficace.

---

## 4. Le risque commission et pourquoi le tracking est non-négociable

### 4.1 Le scénario de fraude classique

Dans une architecture B2B2C où une plateforme génère des leads et les transmet à un opérateur de vente affilié, le risque de fraude commission est documenté et bien connu. Le scénario type :

1. ENKI Realty génère un lead qualifié et le transmet à la société de vente
2. Le conseiller humain de la société de vente prend en charge le lead
3. Le lead se transforme en client : il signe un compromis, puis un acte authentique
4. La société de vente touche la commission développeur (typiquement 1 à 3 % du prix de vente, soit 5 000 à 30 000 € sur un bien à 500 000 €)
5. **La société de vente déclare à ENKI Realty que le lead n'a pas converti** ou qu'il a converti via un autre canal (« il a finalement acheté en passant directement par le développeur ») ou que le bien acheté est différent de celui d'origine (« il a basculé sur un bien hors plateforme »)
6. ENKI Realty ne touche pas sa part de commission

Ce scénario peut se produire de bonne foi (mauvaise tenue du dossier) ou de mauvaise foi (décision délibérée d'occulter). Dans les deux cas, **sans tracking complet, ENKI Realty n'a aucun recours**.

### 4.2 Pourquoi un contrat ne suffit pas

Un contrat entre ENKI Realty et la société de vente peut prévoir le partage de commission, mais :

- Le contrat ne génère pas de preuve. C'est l'**exécution** qui génère la preuve.
- En cas de litige, la charge de la preuve repose sur ENKI Realty : c'est elle qui doit démontrer que le lead a effectivement été qualifié par sa plateforme avant transmission.
- Sans système de tracking opposable, le tribunal n'a que la parole d'ENKI contre la parole de la société de vente.
- Un contrat seul est donc une **promesse**. Le tracking est la **preuve**.

### 4.3 La discipline du tracking complet

Le principe directeur de l'architecture commerciale d'ENKI Realty est :

> **Tout événement commercial significatif doit être enregistré dans un système contrôlé par ENKI Realty, avec horodatage, signature cryptographique, et attribution traçable.**

Concrètement :
- Le passage de main (Étape 4) est enregistré côté ENKI
- Toutes les actions du conseiller humain dans le CRM (appels, emails, visites, notes) sont enregistrées dans un CRM hébergé par ENKI Realty
- Toute évolution du statut commercial du lead (en cours, visite planifiée, visite effectuée, offre faite, compromis signé, acte signé) est enregistrée et signée
- Le développeur (Crona ou autre) confirme indépendamment la transaction via une signature parallèle (mécanisme de double-signature, voir section 7.2)

C'est cette discipline qui rend la fraude **impossible techniquement**, pas juste **interdite contractuellement**.

---

# PARTIE II — LE CRM FOURNI À LA SOCIÉTÉ DE VENTE

## 5. Philosophie produit : un CRM digne des meilleurs au monde

### 5.1 Inspirations

Le CRM ENKI Realty s'inspire des meilleures pratiques observées dans les CRM immobiliers de référence en 2026 :

- **Follow Up Boss** (le standard du marché US) : speed-to-lead instantané, intégrations 250+ sources, accountability visible (réponse en moins de 5 minutes mesurée à la minute)
- **Wise Agent** : commission tracking intégré au pipeline, splits et frais broker dans le CRM même
- **Cloze.ai** : AI personal assistant, mobile-first, capture automatique de leads multi-sources
- **Real Geeks** : tracking comportemental des leads (quels biens consultés, quelle durée, signaux d'engagement)
- **Propertybase (Salesforce Real Estate)** : data model robuste, back-office complet, scalabilité enterprise
- **Lofty** : AI assistant pour automatisation, social management intégré
- **Market Leader** : lead intel et behavioral triggers, set-and-forget marketing automation
- **Pipedrive** : pipeline visuel intuitif, dashboard customizable
- **Rethink** (CRE) : data model immobilier sérieux, gestion des deals complexes multi-options
- **Station CRM** : pursuit tracking comme workflow first-class (les leads pré-deal qui méritent d'être suivis)

Le CRM ENKI Realty ne copie aucun de ces outils. Il s'inspire des meilleurs de chacun, en les adaptant à un contexte spécifique : **un CRM B2B2C où la plateforme et l'opérateur commercial sont deux entités distinctes avec des intérêts à protéger respectivement**.

### 5.2 Principes directeurs

**Principe 1 — Le CRM appartient à ENKI Realty, pas à la société de vente.**
Le CRM est hébergé dans l'infrastructure ENKI Realty. Les données générées dans le CRM appartiennent à ENKI Realty. La société de vente est utilisatrice, pas propriétaire. Cette inversion de la relation est le fondement de la protection commission.

**Principe 2 — Le CRM est aussi un cadeau à la société de vente.**
Malgré le principe 1, le CRM doit être **vraiment utile** à la société de vente. C'est ce qui garantit qu'elle l'utilise effectivement et n'essaie pas de tenir un CRM parallèle. Le CRM doit être tellement bien conçu qu'il devient la seule façon raisonnable de travailler. Pour la société de vente, c'est un outil de productivité de classe mondiale fourni gratuitement.

**Principe 3 — Speed-to-lead instantané.**
Quand un lead bascule en passage de main, le conseiller humain reçoit une notification dans la minute. Le standard de l'industrie est désormais sub-5-minutes. ENKI Realty vise le sub-2-minutes.

**Principe 4 — Aucune action commerciale n'est invisible.**
Chaque appel, email, SMS, visite, note, est tracé dans le CRM. Pas de canaux parallèles (téléphone personnel, WhatsApp non intégré, Gmail externe). Cette discipline n'est pas optionnelle, elle est **contractuelle** entre ENKI Realty et la société de vente.

**Principe 5 — Mobile-first et offline-tolerant.**
Les conseillers commerciaux travaillent en mobilité (visites, déplacements, terrain). Le CRM doit être pleinement fonctionnel sur smartphone, et tolérer les pertes de connexion (sync différée).

**Principe 6 — AI-augmented, pas AI-replaced.**
L'IA assiste le conseiller humain (résumés automatiques, suggestions de relance, transcription d'appels, scoring) mais ne remplace pas le jugement humain dans la conduite du dossier.

### 5.3 Différenciation par rapport aux CRM standard

Les CRM immobiliers standard (Follow Up Boss, Wise Agent, etc.) sont conçus pour qu'un agent travaille **ses propres leads** dans **son propre business**. Ils ne sont pas conçus pour qu'une plateforme externe garde la main sur les leads qu'elle a générés.

Le CRM ENKI Realty introduit une dimension nouvelle : **la transparence inverse**. Habituellement, c'est la plateforme qui voit ce que fait l'agent. Ici, c'est aussi le pourvoyeur de leads (ENKI Realty) qui doit pouvoir auditer ce que fait la société de vente sur les leads qu'il lui a transmis.

Cette dimension n'existe dans aucun CRM standard. Elle est centrale dans le nôtre.

---

## 6. Modules fonctionnels du CRM

Le CRM ENKI Realty s'organise en huit modules fonctionnels.

### 6.1 Module Leads

Gestion centralisée de tous les leads transmis par ENKI Realty à la société de vente.

**Fonctionnalités** :
- Vue liste avec filtres (statut, date de transmission, conseiller assigné, valeur estimée du dossier, score d'engagement, ancienneté)
- Vue détail par lead avec dossier 360° complet (historique conversationnel ENKI, rapports Lexaia, biens consultés, favoris, espace personnel)
- Assignation automatique au conseiller le plus pertinent (langue parlée, charge actuelle, expertise zone géographique)
- Réassignation manuelle possible avec traçabilité
- Tagging personnalisé (priorité, opportunité multi-bien, client référent potentiel)
- Notes du conseiller (visibles par ENKI Realty)

### 6.2 Module Pipeline

Vue Kanban des dossiers en cours, organisée par étapes commerciales.

**Étapes type** (paramétrables) :
1. Nouveau lead transmis (vient d'arriver, pas encore contacté)
2. Premier contact établi
3. Visite virtuelle planifiée
4. Visite virtuelle effectuée
5. Visite physique planifiée
6. Visite physique effectuée
7. Offre formulée
8. Négociation en cours
9. Compromis signé
10. Financement en cours
11. Acte signé (transaction conclue)
12. Livraison effectuée

Chaque transition d'étape génère un événement signé, horodaté, opposable.

### 6.3 Module Communications

Centralisation de toutes les communications avec le client après passage de main.

**Canaux intégrés** :
- Téléphone (click-to-call, enregistrement automatique des appels avec consentement, transcription IA)
- Email (depuis le CRM, threading complet)
- SMS
- WhatsApp Business (si autorisé par le client)
- Visioconférence (Google Meet, Zoom intégrés)

**Aucune communication ne se fait hors CRM**. Si un conseiller appelle depuis son téléphone personnel ou envoie un email depuis Gmail, l'événement n'est pas tracé — ce qui est une violation contractuelle qui peut faire perdre la commission.

### 6.4 Module Visites

Coordination des visites virtuelles et physiques.

**Fonctionnalités** :
- Calendrier intégré (synchronisation Google Calendar et Outlook)
- Visite virtuelle 3D (intégration Matterport ou équivalent)
- Réservation de visites physiques avec confirmation client
- Notes post-visite obligatoires (remplissage par le conseiller dans les 24h après la visite)
- Feedback client post-visite (envoyé automatiquement, optionnel pour le client)
- Tracking des visites annulées et de leurs raisons

### 6.5 Module Documents

Gestion des documents administratifs et contractuels du dossier.

**Types de documents** :
- Documents fournis par le client (passeport, justificatif domicile, avis d'imposition, statuts société)
- Documents générés par la société de vente (offre d'achat, compromis, acte authentique)
- Documents fournis par le développeur (plans, descriptifs, garanties, permis)
- Documents Lexaia (rapports patrimoniaux dans l'espace personnel client, accessibles en lecture par le conseiller)

Tous les documents sont :
- Stockés en encryption at rest
- Accessibles uniquement aux personnes explicitement autorisées par le client
- Tracés en audit log (qui a consulté, quand)
- Versionnés (chaque modification est conservée)

### 6.6 Module Commissions

Gestion intégrée des commissions développeur et du partage avec ENKI Realty.

**Fonctionnalités** :
- Configuration par développeur des taux de commission (négociés contractuellement)
- Calcul automatique de la commission attendue dès qu'un compromis est signé
- Calcul automatique de la part ENKI Realty selon l'accord de partage
- Tracking du paiement effectif de la commission par le développeur à la société de vente
- Tracking du reversement effectif de la part ENKI Realty par la société de vente
- Alertes en cas de retard de paiement ou d'écart entre commission attendue et commission reçue
- Tableau de bord financier pour ENKI Realty et la société de vente (vues séparées)

### 6.7 Module Reporting

Dashboards et rapports pour le management.

**Vues type** :
- Dashboard exécutif ENKI Realty : leads transmis, taux de conversion, commissions générées, écarts détectés
- Dashboard exécutif société de vente : pipeline en cours, performance par conseiller, prévisions de commission
- Performance par conseiller : nombre de leads traités, taux de conversion, durée moyenne du cycle, satisfaction client
- Performance par développeur : volume de transactions, taux de conversion des leads orientés vers ce développeur, retours clients
- Performance par bien : nombre de leads, nombre de visites, taux de conversion bien-spécifique
- Performance par zone géographique : Limassol, Paphos, Larnaca, Nicosia, autres
- Reporting fiscal et comptable trimestriel

### 6.8 Module AI Assistant

Assistant IA intégré au CRM, qui aide le conseiller dans son quotidien.

**Capacités** :
- Résumé automatique d'un dossier complexe (« Donne-moi un brief de ce client en 3 phrases »)
- Suggestions de relance (« Le client n'a pas répondu depuis 5 jours, voici 3 messages possibles »)
- Transcription et résumé automatique des appels
- Détection de signaux faibles (« Ce client a consulté 7 fois la même fiche cette semaine, c'est anormal »)
- Alerte sur incohérences (« Ce client a dit X dans une conversation et Y dans une autre »)
- Coaching commercial (« Voici les 3 questions que tu n'as pas encore posées et qui pourraient débloquer le dossier »)

L'AI Assistant ne prend jamais de décisions à la place du conseiller. Il propose, le conseiller dispose.

---

## 7. Le tracking anti-fraude commission

C'est la partie la plus critique du CRM. Elle est conçue spécifiquement pour rendre techniquement impossible la fraude commission décrite en section 4.

### 7.1 Les trois ancrages immuables

Chaque transaction immobilière passe par trois ancrages immuables qui, ensemble, forment une chaîne de preuve opposable.

**Ancrage 1 — L'événement de qualification ENKI Realty**
Généré côté ENKI Realty au moment du passage de main (Étape 4 en section 3.1). Contient l'identifiant du lead, l'identifiant du bien, l'horodatage exact, le snapshot complet du lead à cet instant, et une signature cryptographique opposable.

**Ancrage 2 — L'événement de signature compromis dans le CRM**
Généré dans le module Pipeline du CRM au moment où le conseiller marque le compromis comme signé. Contient l'identifiant du lead, l'identifiant du bien, l'horodatage, le montant de la transaction, le PDF du compromis signé en pièce jointe.

**Ancrage 3 — La confirmation indépendante du développeur**
Le développeur (Crona ou autre) confirme via une interface dédiée que la transaction a bien eu lieu et que la commission a été payée à la société de vente. Cette confirmation est faite directement depuis l'espace développeur d'ENKI Realty, sans passer par la société de vente.

**La triple coïncidence** des trois ancrages forme une preuve qu'aucune des trois parties (ENKI, société de vente, développeur) ne peut altérer seule. Si la société de vente prétend qu'il n'y a pas eu de vente, mais que le développeur confirme la vente et que l'événement de qualification ENKI existe, la commission est due.

### 7.2 Le mécanisme de double-signature

À chaque étape critique du dossier, deux signatures sont requises :
- **Signature interne** par le conseiller dans le CRM (qu'il appose en marquant l'étape comme franchie)
- **Signature externe** par une partie tierce (le client, le développeur, le notaire, selon l'étape)

Exemples :
- Visite physique : signature conseiller (rapport de visite) + signature client (feedback de visite)
- Compromis signé : signature conseiller (upload PDF compromis dans CRM) + signature notaire (validation indépendante)
- Acte authentique : signature conseiller + signature notaire + signature développeur (confirmation de réception du paiement et de la commission)
- Commission payée : signature société de vente (déclaration de réception) + signature développeur (confirmation indépendante du paiement effectué)

Une étape avec une seule signature reste en statut « non confirmé ». Une étape avec double signature passe en statut « validé immuable ».

### 7.3 La détection automatique de fraude

Le système analyse en continu les comportements pour détecter des patterns suspects.

**Signaux automatiques déclenchant une alerte ENKI Realty** :
- Un lead transmis à la société de vente qui passe en statut « perdu » sans qu'aucune communication ne soit tracée dans le CRM
- Un lead qui, après transmission, n'a aucune action commerciale enregistrée pendant plus de 7 jours (faux abandon)
- Un compromis signé chez le développeur (confirmé via son espace) sans correspondance dans le CRM de la société de vente
- Un écart entre la commission attendue (calcul automatique) et la commission déclarée payée (déclaration manuelle de la société de vente)
- Une activité commerciale inhabituellement faible sur un lead avec score d'engagement très élevé
- Une corrélation entre un lead transmis à un conseiller et une transaction du même bien réalisée par un autre canal (off-platform deal du même conseiller en parallèle)

Chaque alerte est investiguée par ENKI Realty. Plusieurs alertes sur un même conseiller ou sur la société de vente déclenchent un audit formel.

### 7.4 L'audit formel

L'audit formel est un mécanisme contractuel entre ENKI Realty et la société de vente. Il prévoit :

- Le droit d'ENKI Realty de demander un audit complet sur tout dossier suspect
- L'obligation pour la société de vente de fournir tous les documents demandés sous 7 jours
- En cas de refus ou de délai, présomption de fraude et rétention des paiements futurs
- Un audit indépendant par un cabinet tiers en cas de désaccord persistant, à la charge de la partie reconnue fautive

Ce mécanisme n'est pas seulement défensif. Il est aussi **dissuasif** : la connaissance de son existence rend la fraude statistiquement non rentable.

---

## 8. Synchronisation entre ENKI Realty et le CRM de la société de vente

### 8.1 Architecture technique

Il n'y a **pas deux CRM**. Il y a **un seul CRM** hébergé par ENKI Realty, avec deux interfaces utilisateur distinctes selon le rôle :

- **Interface ENKI Realty** : vue oversight, audit, reporting, gestion des leads pré-transmission, alertes fraude
- **Interface société de vente** : vue opérationnelle quotidienne, pipeline, communications, visites, documents

Les données sont les mêmes, mais les vues, les permissions et les workflows diffèrent.

### 8.2 Permissions et cloisonnement

**Ce que la société de vente voit** :
- Tous les leads qui lui ont été transmis (pas les leads encore en pré-qualification chez ENKI)
- Tous les dossiers en cours, archivés, conclus
- Toutes les communications, visites, documents, commissions liés à ses dossiers
- Son propre reporting et celui de ses conseillers

**Ce que la société de vente ne voit pas** :
- Les leads encore en phase de qualification chez ENKI Realty (pas encore transmis)
- Les conversations historiques de l'agent ENKI antérieures au passage de main (uniquement le résumé synthétique au moment du passage)
- Les rapports Lexaia complets (uniquement le scénario chiffré principal pertinent pour le bien acheté)
- Les autres clients d'ENKI Realty qui ne lui ont pas été transmis
- Les audits internes ENKI Realty
- Les alertes de détection de fraude

**Ce que ENKI Realty voit** :
- Tout. Y compris toutes les actions de la société de vente, en lecture seule.

### 8.3 Notification du client sur le partage de données

Dans le cadre RGPD, le client est informé au moment de la création de son espace personnel que ses données peuvent être partagées avec un partenaire commercial spécifique en cas de demande de mise en relation pour un bien donné. Le consentement est granulaire : le client peut accepter le partage uniquement pour le bien spécifique qui a déclenché la mise en relation, pas pour l'ensemble de son profil.

Ce niveau de granularité est exigeant techniquement mais protège juridiquement et éthiquement.

---

## 9. Roadmap CRM : V1, V2, V3

### 9.1 V1 — MVP au lancement

**Périmètre fonctionnel minimum pour ouvrir l'activité commerciale** :
- Module Leads (vue liste + détail, assignation manuelle)
- Module Pipeline (Kanban basique, 8 étapes principales, transitions tracées)
- Module Communications (email + SMS depuis CRM, intégration téléphone basique)
- Module Visites (calendrier basique, planification)
- Module Documents (upload, stockage encrypté, audit log)
- Module Commissions (calcul automatique, tracking paiement)
- Tracking anti-fraude (3 ancrages immuables, double-signature pour les étapes critiques)
- Reporting (dashboards exécutif basiques)
- Interface mobile responsive (pas d'app native)

**Effort estimé** : 12 à 16 semaines à temps plein avec une équipe de 2-3 développeurs

**Stack technique pressentie** :
- Backend : Supabase (cohérence avec ENKI Realty platform)
- Frontend : React + TypeScript + Tailwind + Shadcn/ui (cohérence design system)
- Téléphonie : Twilio Voice + Twilio SMS
- Email : Resend ou Postmark
- Stockage documents : Supabase Storage avec encryption
- Signatures cryptographiques : libsodium ou équivalent

### 9.2 V2 — Enrichissement opérationnel

**Périmètre additionnel après 3-6 mois d'opération** :
- WhatsApp Business intégré
- Visioconférence intégrée (Google Meet et Zoom)
- Visite virtuelle 3D (Matterport)
- Module AI Assistant V1 (résumés automatiques, suggestions de relance basiques, transcription d'appels)
- Détection automatique de signaux de fraude (V1 : règles basiques, alertes)
- App mobile native iOS et Android
- Synchronisation calendrier bi-directionnelle (Google Calendar, Outlook, iCloud)
- Module Documents avancé (e-signature intégrée via DocuSign ou équivalent)
- Reporting avancé (cohortes, prévisions, forecasting commission)

### 9.3 V3 — Plateforme commerciale complète

**Périmètre additionnel après 9-12 mois** :
- Module AI Assistant V2 (coaching commercial, détection de signaux faibles, scoring prédictif)
- Détection de fraude V2 (machine learning sur patterns historiques, scoring de risque par dossier)
- Audit formel automatisé (génération de dossier d'audit en un clic)
- Module Successoral (suivi post-acquisition, déclarations annuelles, échéances)
- Marketplace de services post-achat (gestion locative, assurance, déménagement)
- API publique pour intégrations (cabinet d'avocat, notaire, banque partenaire)
- Module Multi-développeurs avancé (gestion contractuelle des accords commission par développeur, négociation, reporting consolidé)
- Internationalisation : extension du modèle au-delà de Chypre (Grèce, Portugal, Malte, Dubaï)

### 9.4 Principe d'extensibilité dès la V1

Le CRM V1 doit être conçu avec **extensibilité technique** dès le départ, même si fonctionnellement il reste minimal. Concrètement :
- Architecture en modules indépendants (chaque module = un service ou un domaine logique distinct)
- API interne propre dès le départ (les modules communiquent via API, pas via accès direct à la base)
- Schéma de base de données prévu pour les modules V2 et V3 (champs préparés mais inutilisés en V1, plutôt que migrations massives plus tard)
- Hooks d'événements en place (chaque action génère un événement, ce qui permet de brancher de nouveaux modules sans toucher au cœur)
- Tests automatisés couvrant les chemins critiques (pour itérer en V2 sans régression)

C'est cette discipline qui permettra de faire évoluer rapidement le CRM sans tout réécrire à chaque V.

---

# PARTIE III — IMPLICATIONS

## 10. Implications juridiques et contractuelles

### 10.1 Le contrat ENKI Realty / société de vente

Le partenariat entre ENKI Realty et la société de vente est encadré par un **contrat-cadre commercial** qui prévoit notamment :

- L'objet du partenariat (génération de leads par ENKI Realty, conversion par la société de vente)
- La répartition de la commission développeur (pourcentage attribué à ENKI Realty et à la société de vente)
- L'obligation pour la société de vente d'utiliser exclusivement le CRM ENKI Realty pour tous les leads transmis
- L'interdiction de canaux de communication parallèles non tracés
- Le droit d'audit d'ENKI Realty
- Les pénalités en cas de violation (rétention de paiements futurs, dommages et intérêts, résiliation)
- La clause de confidentialité absolue sur la structure capitalistique (Crona invisible)
- Les conditions de résiliation et le sort des leads en cours en cas de rupture

Le contrat est rédigé par un avocat d'affaires chypriote, validé par les actionnaires des deux entités.

### 10.2 La conformité avec la réglementation immobilière chypriote

La société de vente est titulaire de la licence d'agent immobilier chypriote (Real Estate Agents Licensing Council). À ce titre, elle est soumise à la réglementation locale, notamment :

- Tenue de registres conformes
- Obligations KYC (Know Your Customer) pour les transactions au-dessus du seuil légal
- Obligations AML (Anti-Money Laundering)
- Régulation 17(3) et 28 du Cyprus Bar Association concernant les rétro-commissions à des avocats (interdites)

ENKI Realty, en tant que plateforme technologique, n'est pas titulaire de cette licence et ne peut donc pas conclure de transactions directement. Cette répartition des rôles est juridiquement nette.

### 10.3 Le RGPD appliqué au passage de main

Le transfert de données du client de l'environnement ENKI Realty vers l'environnement société de vente (au moment du passage de main) est un **traitement de données personnelles** soumis au RGPD. Conditions :

- Consentement préalable et explicite du client (au moment du clic « Demander une visite » ou équivalent)
- Information claire sur le périmètre du transfert (quelles données, à qui, pour quel usage)
- Limitation aux données strictement nécessaires (pas de transfert intégral du profil ENKI, mais des données pertinentes pour le bien spécifique)
- Droit du client de retirer son consentement à tout moment (avec conséquence : le dossier ne peut plus avancer)
- Droit à l'effacement effectif côté société de vente quand le client le demande

---

## 11. Métriques de succès et indicateurs de fraude

### 11.1 Métriques de succès commercial

- Taux de conversion lead transmis → compromis signé
- Durée moyenne du cycle commercial (passage de main → acte signé)
- Taux de réponse au premier contact (objectif : > 95 % en moins de 2h)
- Taux de visite physique parmi les leads transmis (objectif : > 60 %)
- Net Promoter Score post-acquisition
- Volume de commission ENKI Realty générée par lead transmis

### 11.2 Indicateurs de santé du tracking

- Taux de complétude des étapes pipeline (toutes les étapes ont-elles bien des événements signés ?)
- Taux de double-signature sur les étapes critiques (objectif : 100 %)
- Délai moyen entre une action commerciale réelle et son enregistrement dans le CRM (objectif : < 1h)
- Volume de communications hors CRM détectées (objectif : 0)

### 11.3 Indicateurs de fraude potentielle

- Nombre d'alertes automatiques par mois
- Nombre d'audits formels déclenchés
- Écart entre commission attendue et commission déclarée payée (objectif : 0 %)
- Nombre de transactions confirmées par développeur sans correspondance CRM (objectif : 0)
- Taux de leads perdus sans communication tracée (objectif : < 5 % — au-delà, c'est suspect)

---

## 12. Risques identifiés et plans de mitigation

### 12.1 Risque 1 — La société de vente refuse d'utiliser le CRM ENKI Realty

**Description** : la société de vente argumente qu'elle a déjà ses outils et refuse d'adopter le CRM imposé.

**Mitigation** :
- Obligation contractuelle dès le contrat-cadre : pas de CRM ENKI Realty, pas de leads transmis
- Le CRM doit être suffisamment bon pour être préféré à toute alternative (cf. principe 2 en section 5.2)
- Onboarding accompagné en V1 : ENKI Realty forme les conseillers et reste disponible pour support
- Migration assistée si la société de vente avait un CRM antérieur

### 12.2 Risque 2 — Communications hors CRM (téléphone perso, WhatsApp non intégré)

**Description** : un conseiller utilise son téléphone personnel ou WhatsApp non intégré pour contacter les clients, ce qui rend les communications invisibles dans le CRM.

**Mitigation** :
- Tous les conseillers reçoivent un téléphone professionnel intégré au CRM, ou une ligne virtuelle Twilio rattachée
- Le client est informé du canal officiel et est invité à ne communiquer que par ce canal
- Détection automatique : si un client signe un compromis sans aucune trace de communication CRM préalable, alerte automatique
- Sanctions contractuelles claires en cas de violation répétée

### 12.3 Risque 3 — Le développeur refuse la confirmation indépendante

**Description** : le développeur (Crona ou autre) ne joue pas le jeu de la confirmation indépendante des transactions, ce qui prive ENKI Realty d'un de ses trois ancrages.

**Mitigation** :
- Onboarding développeur inclut la signature d'un accord d'utilisation de l'espace développeur ENKI Realty avec obligation de confirmation
- L'espace développeur leur fournit aussi de la valeur (visibilité de leurs leads, statistiques, prévisions de pipeline) — il devient un outil utile pour eux, pas une contrainte
- En cas de refus de confirmation : l'événement CRM société de vente seul fait foi, et la commission est due selon le contrat

### 12.4 Risque 4 — Litige sur l'attribution d'un lead

**Description** : la société de vente argumente qu'un client a été acheté de manière indépendante (« il est revenu directement chez nous », « il avait été contacté par un autre canal en parallèle »).

**Mitigation** :
- L'événement de qualification ENKI Realty est horodaté et opposable. Si l'événement existe avant la transaction, c'est ENKI qui a généré le lead, point.
- Définition contractuelle stricte de la fenêtre d'attribution : tout client ayant un événement de qualification ENKI Realty est attribué ENKI pour une durée de 24 mois après le passage de main
- En cas de litige, le contrat prévoit l'arbitrage par un tiers indépendant

### 12.5 Risque 5 — Surcharge produit du CRM

**Description** : la tentation de construire toutes les fonctionnalités V2 et V3 dès la V1 retarde le lancement et disperse l'effort de développement.

**Mitigation** :
- Discipline stricte du périmètre V1 documentée en section 9.1
- Aucune feature V2 commencée tant que la V1 n'est pas en production avec au moins 50 dossiers actifs
- Architecture extensible dès la V1 (cf. section 9.4) qui permet d'ajouter sans refondre
- Revue mensuelle du périmètre par Jean-Marie

---

## Postface

Ce document pose l'architecture commerciale d'ENKI Realty.

Les décisions actées :

1. Architecture B2B2C avec trois entités distinctes (ENKI Realty, société de vente, développeurs)
2. Crona Group invisible au niveau capitalistique mais visible comme développeur listé
3. Passage de main déclenché par un événement technique précis avec signature cryptographique
4. CRM unique hébergé par ENKI Realty, mis à disposition de la société de vente
5. Tracking anti-fraude par triple ancrage immuable + double-signature + détection automatique
6. CRM digne des meilleurs au monde, inspiré des références marché (Follow Up Boss, Wise Agent, Cloze, etc.)
7. Roadmap V1 → V2 → V3 documentée avec extensibilité technique dès la V1
8. Encadrement juridique strict via contrat-cadre commercial et conformité RGPD

Le CRM n'est pas un outil annexe. C'est le **système nerveux de l'activité commerciale d'ENKI Realty**. Sa qualité de conception détermine directement la viabilité du modèle économique B2B2C et la capacité d'ENKI Realty à percevoir les commissions qui lui reviennent.

---

*Document signé par : Jean-Marie Delaunay, fondateur ENKI Realty*

*Co-rédigé avec : Claude Opus 4.7*

*Date : 25 avril 2026 — validée le 27 avril 2026*

*Statut : v1.0 — VALIDÉE*
