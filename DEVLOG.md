# Journal de développement : fiches D&D 5.5 (règles 2024)

## 2026-11-15 : Copier les jets pour le bot Discord

Le groupe lance les dés avec un bot Discord. Chaque jet de la fiche (tests et JS de caractéristique, compétences, initiative, attaques) a trois petits boutons N / A / D qui copient `/roll 1d20+x`, `/roll 2d20k1+x` ou `/roll 2d20kl1+x` (`E.rollCommand`) ; les dés des dégâts se cliquent aussi (`E.diceIn` : premier « XdY±n » du texte, « 2 rayons de 1d10 » copie `/roll 1d10`). Boutons masqués jusqu'au survol (toujours visibles sur écran tactile) ; A ou D coloré quand la fiche connaît un avantage ou un désavantage. Retour « Copié : … » 2 s (`App.toast` accepte une durée). Validé par Plouf sur captures. 501 tests.

## 2026-11-14 : Dégâts alternatifs des sorts (Glas)

Option générique `damage.alt: { dice, label }` sur un sort : le moteur la met à l'échelle comme les dégâts normaux (tour de magie, emplacement de pacte, bonus `spellDamage`) et l'affiche en petit gris après les dégâts, comme l'arme polyvalente (les attaques portent maintenant un champ `alt` commun aux deux). Glas : « (2d12 si blessée) » au niveau 5 ; Châtiment divin : « (3d8 contre fiélon ou mort-vivant) ». 493 tests.

## 2026-11-14 : Sorts de soin hors du noyau

Les listes `HEALING_SPELLS` / `HEALING_VALUES` quittent `core/view-play.js`. Chaque sort porte son champ `heal` (`{ dice, mod: true }` ou `{ text }`) dans `modules/spells/` ; le moteur calcule `sp.heal` (dés + modificateur d'incantation, + dés de l'emplacement de pacte) et la carte « Soins » liste les sorts qui en ont un. Plus de détection par le nom du sort.

## 2026-11-14 : AGENTS.md pour les autres IA

AGENTS.md décrit les règles du projet pour toute IA qui modifie le dépôt : aucun code propre à une classe dans `core/` (option générique côté noyau, données dans `modules/`), organisation des fichiers, style, sources de règles, vérifications avant chaque commit.

## 2026-11-14 : Fusion des corrections avec la carte Soins

Fusion de la branche de corrections avec les deux commits suivants de l'ami (carte « Soins », valeurs de soin). Grille attaques / soutien / soins : une colonne par défaut (le tableau des attaques garde toute la largeur), deux colonnes seulement à partir de 1900 px.

## 2026-11-14 : Domaine du Sépulcre (modifs d'un ami) et corrections
- Commits d'un ami sur main : noms de la VF (Domaine du Sépulcre, Cercle de mortalité, Empire funeste, Vigueur d'outre-tombe, Voie du Sépulcre), textes précisés, Gardien des âmes récupérable avec un emplacement de niveau 6+ ; sorts à dégâts de tout niveau dans les attaques avec lien AideDD ; carte « Sorts de soutien » ; couleurs des caractéristiques ; colonne gauche à 14rem.
- Corrections : le code propre au clerc quitte le noyau. Effet `resource` générique : `slotRegain: n` (boutons « Niv. X » pour récupérer une utilisation en dépensant un emplacement de niveau n+, `R.regainWithSlot`) et `blockedBy: "<état>"` (dépense refusée sous cet état). Les pastilles permettent de nouveau d'annuler un clic. Tableau des attaques en pleine largeur quand la place manque (`.attack-support-pair` en auto-fit 24rem), utile vers 1060 px. 488 tests.

## 2026-11-11 : Shadar-kai, Sens aiguisés

Ajout du trait Sens aiguisés (maîtrise de Perception) oublié dans species/shadar-kai.js.

## 2026-11-11 : Pastilles des ressources sur une ligne

`.resource` : le nom prend la place restante et passe à la ligne, les pastilles (ou le compteur) ne rétrécissent plus (`flex: 0 0 auto`, max 60 % de la largeur). Avant, un nom sur deux lignes faisait passer 3 pastilles sur deux lignes (Conduit divin à 1100 px).

## 2026-11-11 : Recherche dans les dons supplémentaires
- La carte « Dons supplémentaires » utilise le `picker` (étiquettes avec ×, champ « Chercher un don… », liste « Ajouter… » groupée par niveau requis). Demande de Plouf.
- Un don non répétable déjà pris (historique, niveau de classe ou carte) est grisé « déjà pris ». Les dons `repeatable` restent disponibles. 473 tests.

## 2026-11-11 : Domaine de la Tombe version 2024
- Le Domaine de la Tombe est repris dans *Ravenloft: The Horrors Within* (2026). `modules/classes/cleric-grave.js` suit maintenant le texte du livre (captures de Plouf), au lieu de Xanathar 2014 adapté.
- Changements : sorts de domaine (Détection du mal et du bien, Dissipation du mal et du bien ; Coquille antivie retirée), Repousser la mort (+1d4 puis 1d6 contre une créature blessée), Chemin de la tombe en action bonus (Désavantage, + niveau de clerc), Sentinelle qui divise les dégâts par deux, Faucheur divin (niv. 17). Œil de la tombe retiré. 473 tests.
- Fichier à copier : `modules/classes/cleric-grave.js`.

## 2026-11-10 : Durée de concentration

Carte Concentration (onglet Combat) : durée du sort en cours via `E.concentrationInfo(sheet, state)`. Durée augmentée calculée au niveau des emplacements de pacte ; sinon liste « Emplacement niv. X » (`ch.state.concentrationSlot = { name, level }`) quand le sort a une durée qui change avec le niveau.

## 2026-11-10 : Relecture complète et correctifs
Relecture du noyau, des six classes du groupe, des espèces, historiques, armes et dégâts des sorts : aucune erreur de règle dans les modules, cinq erreurs dans le noyau, corrigées.
- Bouclier non maîtrisé : le +2 de CA n'est plus compté (l'avertissement existait déjà). Le test du Moine avec bouclier attend donc 13.
- Multiclassage : `maxSpellLevel` de chaque classe vient de sa propre table (comme si elle était seule), plus des emplacements cumulés. Clerc 3 / Paladin 3 : sorts de niveau 2 et 1.
- 0 PV : la concentration prend fin (message). Dégâts massifs : trois échecs cochés, donc « Mort » affiché. Dégâts à 0 PV : réussites effacées (un personnage stable ne l'est plus) et un échec. Bouton « Stabiliser » dans le bloc Jets contre la mort (`R.stabilize`).
- Emplacements créés : `ch.state.slotsExtra` = `{ 3: 1 }`, ajoutés au maximum du niveau, perdus au repos long. Boutons + et − dans la carte Emplacements, visibles seulement si un effet `{ type: "extraSlots", maxLevel }` est actif (`sheet.extraSlots`, `R.addSlot`). Déclaré par l'Ensorceleur (Réserve arcanique, niveau selon la table de création) et l'Artificier (Vider un objet magique, niveaux 1 et 2).
- Épuisement : −2 par niveau retiré des bonus affichés (JS, compétences, initiative, attaques d'arme, à mains nues et de sort). DD des sorts et valeurs passives inchangés. `sheet.d20Penalty`.
- Arme Lourde équipée avec Force (corps à corps) ou Dextérité (distance) inférieure à 13 : avertissement.
- Moine : Déviation d'énergie passe du niveau 11 au niveau 13 (toujours non gérée).
- Nouvelle espèce Aasimar (`modules/species/aasimar.js`, manifeste) : taille au choix, résistances nécrotique et radiante, vision 18 m, Mains guérisseuses (bonus de maîtrise en d4, repos long), Lumière (Charisme), Révélation céleste au niveau 3 (ressource + action bonus, trois formes dans le texte). Saisie de mémoire, noms français à vérifier dans le livre.
- Dossier nettoyé : captures d'écran et `missing.json` supprimés de la racine.
- Fenêtre étroite (900 px ou moins), accord de Plouf : caractéristiques, puis bandeau CA, onglets et page, puis compétences, valeurs passives et maîtrises (`order` dans la règle @media de core/style.css). Au-delà de 900 px rien ne change (vérifié à 901, 1062 et 1400 px).
- Limites restantes : état « Mort » = trois échecs (pas de champ séparé) ; l'épuisement ne touche pas les textes d'actions qui citent un bonus d'attaque.
- Fichiers : core/engine.js, core/rules.js, core/view-play.js, core/style.css, modules/classes/sorcerer.js, artificer.js, monk.js, modules/species/aasimar.js, modules/manifest.js, tests. 469 tests ; affichage de toutes les classes et sous-classes aux niveaux 1/3/5/10, tous onglets, Jeu et Création : aucune erreur.

## 2026-10-29 : Choix de création compacts, sur le modèle des sorts
- Sélecteur générique `picker` dans core/view-build.js (demande de Plouf : moins de place prise). Seules les options choisies s'affichent, en étiquettes avec une croix. À côté : champ de recherche (au-delà de 8 options, sans accents, nom FR ou EN) et liste déroulante « Ajouter… », masqués quand le compteur est plein.
- La liste déroulante est groupée (optgroup, tri par nom dans chaque groupe) : compétences par caractéristique, outils par type (artisan, musique, jeux, autres), autres choix par niveau requis (`prerequisite.level`) ou par niveau de sort. Les options déjà maîtrisées ailleurs y sont grisées avec leur source, les prérequis non remplis aussi.
- Utilisé pour les choix multiples (compétences, manifestations, métamagie, manœuvres…), les choix uniques de plus de 8 options (dons, sorts) et les maîtrises supplémentaires (compétences et outils). Les choix uniques courts gardent leur liste déroulante simple.
- Les prérequis de niveau portent un champ `level` : `minLevel`/`needs` (Occultiste, Artificier) et `DND.feat.requires` (dons). Un prérequis écrit à la main peut faire `Object.assign(fn, { level: n })`.
- Séparation « Historique personnalisé et bonus du MJ » (`.build-divider`) avant les cartes hors création standard : dons, maîtrises et bonus de caractéristique supplémentaires, ajustements manuels.
- 457 tests.

## 2026-10-26 : Espèce Shadar-kai (MotM)
- Nouveau module `modules/species/shadar-kai.js` (ajouté au manifeste), sur le modèle du Duergar : vision 18 m, résistance nécrotique, Ascendance féerique (★ Charmé), Transe, Bénédiction de la Reine Corbeau = ressource (bonus de maîtrise / repos long) + action bonus dans Actions spéciales. La résistance à tous les dégâts (niv. 3+) reste un rappel textuel, pas un état calculé.
- Pas de page AideDD (espèces 2014 limitées) : textes de mémoire, à vérifier dans le livre (voir modules.md).
- Fichiers : modules/species/shadar-kai.js, modules/manifest.js, tests/run.js. 456 tests.

## 2026-10-24 : Maîtrises de l'historique et maîtrises supplémentaires
- Création, carte Origines : sous la description de l'historique, lignes « Compétences maîtrisées » et « Outils maîtrisés » calculées à partir des effets `proficiency` de l'historique (outil au choix : « un outil à choisir plus bas » tant qu'il n'est pas choisi).
- Rien d'équivalent n'existait (les ajustements manuels ne donnent que des bonus chiffrés). Nouvelle carte « Maîtrises supplémentaires » avant les ajustements : cases pour les 18 compétences et liste d'outils, pour un historique personnalisé ou un don du MJ. Stocké dans `ch.extraProfs` = `["skill.survival", "tool.herbalism-kit"]`, transformé en effets `proficiency` (source « Maîtrise ajoutée ») à la fin de `collect`, donc compté partout (bonus, passifs, « déjà maîtrisé » des choix).
- 2026-10-25 : compteurs indicatifs « Compétences n / 2 » et « Outil n / 1 » (un historique 2024 donne 2 compétences et 1 outil), vert à la valeur exacte, sans blocage. Les compétences déjà maîtrisées ailleurs y apparaissent cochées et grisées avec leur source (« historique », classe…).
- 2026-10-26 : carte « Bonus de caractéristique supplémentaires » sous les maîtrises : +/− par caractéristique (2 maximum chacune), compteur indicatif « Points n / 3 », plafond 20. Stocké dans `ch.extraAbilities` = `{ str: 2, dex: 1 }`, transformé en effets `ability` dans `collect`. S'ajoute aux bonus de l'historique s'il y en a un (le texte dit de laisser vide dans ce cas).
- 2026-10-26 : même présentation dans les choix à cases (compétences de classe, langues…) : une option déjà maîtrisée ailleurs est cochée, grisée et suivie de sa source au lieu de « (déjà maîtrisé) » (helper `profFrom`).
- Fichiers : core/engine.js, core/view-build.js, tests/run.js. 457 tests.

## 2026-10-24 : Objets harmonisés
- Inventaire : colonne « Harm. » (case à cocher, champ `attuned` de chaque objet) et ligne « Objets harmonisés : n / max » en tête de la carte Équipement.
- Maximum : 3 + effets `bonus` de cible `"attunement"` (calculé dans `sheet.attunement` = `{ count, max, auto }`). Le joueur peut saisir un autre maximum (`ch.settings.attunementMax`, vide = automatique).
- Au-delà du maximum : ligne en rouge + bandeau d'avertissement.
- Artificier 10 (Adepte des objets magiques) : la note devient `{ type: "bonus", target: "attunement", value: 1 }`, donc 4 automatiquement. Aucun code propre à une classe dans le noyau.
- Fichiers : core/engine.js, core/view-play.js, core/style.css, modules/classes/artificer.js, tests. 451 tests.

## 2026-10-24 : Jets de sauvegarde contre la mort
- Demande de Plouf : des cases pour les jets contre la mort dans la carte Points de vie. Le bloc existait déjà mais n'apparaît qu'à 0 PV ; un essai « toujours visible » a été annulé à la demande de Plouf (mieux seulement quand on est inconscient).
- Gardé : cases carrées (Réussites vertes, Échecs rouges), « Stable » à 3 réussites et « Mort » à 3 échecs à côté du titre, infobulle de règle (DD 10, 20 naturel = 1 PV, 1 naturel = deux échecs).
- Remise à zéro (inchangé, désormais testé) : soins reçus à 0 PV et repos long ; dégâts à 0 PV cochent un échec. 3 nouveaux tests.
- Fichiers : `core/view-play.js`, `core/style.css`, `tests/run.js`.

## 2026-10-24 : Dépenser et recevoir des pièces avec change automatique
- Demande de Plouf : dépenser par exemple 24 pa et que la bourse se décompte toute seule, en changeant des po en pa si besoin.
- Carte Bourse (onglet Inventaire) : champ montant + devise par défaut + boutons « Dépenser » (aussi Entrée) et « Recevoir ». Le champ accepte « 24 pa », « 24pa », « 1 po 5 pa », « 1 po et 5 pa » ou un nombre seul (devise du menu). Décimales refusées (« 2,5 po » : écrire « 2 po 5 pa »).
- Règles dans `core/rules.js` : `R.COINS` (change SRD, valeurs en pc : pp 1000, po 100, pe 50, pa 10, pc 1), `R.parseCoins`, `R.spendCoins`, `R.receiveCoins`, `R.formatCopper`.
- Ordre de paiement : 1) pièces de la devise demandée ; 2) on casse les pièces plus grosses, la plus petite d'abord (pe avant po avant pp), et la monnaie est rendue dans la devise dépensée (1 pp pour 3 pa → 97 pa), sans reconvertir le reste de la bourse ; 3) seulement si les grosses pièces ne suffisent pas, on complète avec les plus petites (pa, pc). Un montant mixte paie la plus grosse devise en premier.
- Fonds insuffisants : refus, bourse inchangée, la saisie est conservée, et le message donne le total disponible (« l'équivalent de 1 po 5 pa »). Sinon le message résume les mouvements (« 24 pa dépensés. Bourse : −2 po, −4 pa. »).
- 10 nouveaux tests (442) ; vérification d'affichage de toutes les classes et sous-classes aux niveaux 1/3/5/10, tous onglets, modes Jeu et Création, plus essai de la saisie dans le navigateur : aucune erreur.

## 2026-10-24 : Rappels en jeu et avantages contre les états
- Demande de Plouf : remplacer les rappels peu utiles en jeu (« Cochez Pacte sur l'arme liée dans l'inventaire ») par des détails utiles (Chanceux du Halfelin), et marquer dans l'encart États ceux contre lesquels on a l'avantage.
- Rappels : on réutilise `combat` (texte court) sur les aptitudes d'espèce et de don, qui s'affichent en « Passif » dans Actions spéciales. Ajouts : Halfelin (Chanceux, Agilité halfeline, Discrétion naturelle), Orc (Endurance implacable), dons Chanceux, Vigilant (échange d'initiative), Robuste (avantage contre la mort), Rôdeur, Rapide, Athlète. La note du Pacte de la lame donne maintenant ce que fait l'arme ; la consigne « cochez Pacte » est passée dans la description de l'aptitude (onglet Aptitudes).
- États (ajout générique au noyau) : `{ type: "advantage", target: "condition.<id>" }` = Avantage aux JS contre l'état (★), `{ type: "immunity", condition: "<id>" }` = immunité (◆), `note` facultative pour l'infobulle (sinon « aptitude · source »). Calcul dans `sheet.conditionDefenses` ; la puce de l'état porte la marque, l'infobulle et la liste des états actifs donnent la source.
- Objets libres : saisie manuelle dans la carte États (« Avantages contre un état venant d'un objet »), stockée dans `ch.conditionDefenses` = `[{ condition, kind: "advantage" | "immunity", label }]`.
- Modules marqués : Nain et Duergar (Empoisonné ; Duergar aussi Charmé et Étourdi), Elfe (Charmé), Halfelin (Effrayé), Rôdeur Vagabond féerique et Ensorceleur Aberrant (Charmé, Effrayé), immunités : Archifée niv. 10 (Charmé), Druide Terre niv. 10 (Empoisonné), Berserker Rage aveugle (pendant la Rage), Auras de courage et de dévotion du Paladin (dans l'aura). Les notes « À retenir » qui disaient la même chose ont été retirées.
- 5 nouveaux tests (432) ; vérification d'affichage de toutes les classes et sous-classes aux niveaux 1/3/5/10, tous onglets, modes Jeu et Création, avec états actifs et saisie manuelle : aucune erreur.

## 2026-10-24 : Sorts lancés avec un emplacement de niveau supérieur
- Signalé par Plouf : Maléfice lancé avec un emplacement de pacte niveau 2 dure jusqu'à 4 heures, la fiche affichait toujours 1 heure.
- Nouveau fichier de données `data/spell-upcast.js` (chargé après `data/spells.js`) : le texte « Emplacement de niveau supérieur » relevé sur AideDD pour les 116 sorts du catalogue qui en ont un, plus une version calculable quand c'est possible (`dice`, `heal`, `targets`, `amount`, `duration`, `noConcentration`, `levels`, `profile`). Un sort de `modules/spells/` peut porter son propre champ `upcast`.
- Noyau (générique, aucune classe en dur) : `E.upcast(spell, slotLevel)` et `E.addDice`. Quand le niveau de l'emplacement est connu d'avance (Magie de pacte : sort de la classe à pacte, d'une de ses aptitudes, ou d'un don/espèce chez un personnage qui n'a que des emplacements de pacte), la fiche calcule l'effet : durée remplacée dans la ligne du sort, dés de dégâts additionnés (Représailles infernales 3d10 au niv. 2), ligne « Emplacement de pacte niv. X : … ». Les sorts à volonté et ceux lancés au niveau du pacte n'affichent rien de plus.
- Lanceurs à emplacements classiques : le niveau se choisit au lancement, la fiche affiche seulement le texte de règle (« Niveau supérieur : … »).
- 11 nouveaux tests (427) ; vérification d'affichage de toutes les classes et sous-classes aux niveaux 1/3/5/10, tous onglets, modes Jeu et Création : aucune erreur.

## 2026-10-18 : Les 7 autres classes (niveaux 1 à 10)
- Nouvelles classes, chacune avec 4 sous-classes et sa fiche `classes/<classe>.md` : Barbare, Barde, Druide, Magicien, Moine, Rôdeur, Roublard (`modules/classes/barbarian.js`, `bard.js`, `druid.js`, `wizard.js`, `monk.js`, `ranger.js`, `rogue.js`).
- Saisis de mémoire car absents d'AideDD, à vérifier dans le Manuel des joueurs : Voie du Zélateur, Cercle des Astres, Credo de la Miséricorde, Vagabond féerique, profils du compagnon du Belluaire, Âme acérée.
- Noyau, extensions génériques (aucune n'est propre à une classe) :
  - `c.prof` disponible dans les fonctions des modules (Touche-à-tout).
  - `recharge` d'une ressource peut être une table par niveau, ex. `{1: "long", 5: "short"}` (Source d'inspiration).
  - Effet `extraSpellList` : ajoute des listes de classe à un lanceur (Secrets magiques) ; l'onglet Sorts en tient compte.
  - Filtre `school` dans les choix de sorts (savants du Magicien).
  - Effet `weaponAbility` : caractéristique et dé de remplacement pour certaines armes (Arts martiaux) ; effet `unarmedStrike` : Frappe à mains nues améliorée (Arts martiaux, Pirouettes éblouissantes). Étiquette sur l'attaque indiquant ce qui a servi au calcul.
- Clerc : Éclat protecteur se recharge désormais tout seul au repos court dès le niveau 6 (limite signalée le 2026-10-15, corrigée par la recharge par niveau).
- 31 sorts ajoutés (`modules/spells/bard-druid-ranger-wizard.js`, mécaniques d'après AideDD) : Moquerie cruelle, Crosse des druides, Baies nourricières, Convocation de bête, Flèche de foudre, Petite hutte de Léomund, Éveil, etc. Listes corrigées d'après AideDD : Bouclier de feu (druide), Dissipation de la magie (rôdeur), Détection de la magie et Communication avec les animaux (occultiste).
- Tests : `tests/classes2.js`, 416 tests au total. Rendu navigateur vérifié pour chaque classe et sous-classe aux niveaux 1, 3, 5 et 10 (Création et tous les onglets de Jeu) : aucune erreur.

## 2026-10-16 : Message clair si la fiche ne démarre pas
- Un ami de Plouf restait bloqué sur « Chargement… » sous Chrome ; reproduit en ouvrant index.html sans les dossiers à côté (cas d'un ouverture directe depuis le ZIP).
- index.html : petits scripts intégrés qui notent les fichiers introuvables et, si rien n'a démarré 1,5 s après le chargement, remplacent « Chargement… » par une explication (extraire le ZIP, dossiers core/data/modules) et le détail technique.

## 2026-10-16 : Bottes d'arme détaillées
- Dans « Actions spéciales », Bottes d'arme (Guerrier, Paladin) liste les armes choisies avec leur botte et son effet ; DD du Renversement calculé. Helper `DND.masteryLines(ids, c)` (data/equipment.js).
- `combat` d'une aptitude peut être une fonction (c, niveau) ; une description en tableau s'affiche en liste « Titre : texte » (même rendu que les traits de compagnon, `traitList`).

## 2026-10-16 : Combat épuré selon la classe
- Onglet Sorts masqué si le personnage n'a aucun sort (ni incantation de classe, ni sort d'espèce, de don ou ajouté) ; carte Concentration masquée s'il ne connaît aucun sort à concentration.
- Aptitudes passives utiles en combat dans « Actions spéciales » avec l'étiquette « Passif » : champ `combat: true` sur une aptitude (ou une option de liste avec showChosen), ou `combat: "texte court"`. Si l'aptitude a des effets `note`, leur texte calculé sert de description et ne s'affiche plus dans la carte Notes.
- Marqué : styles de combat et dons de combat (Duel, Sauvagerie martiale, Maître des armes lourdes, Sentinelle…), Attaque supplémentaire, bottes d'arme, auras du paladin, Frappes bénies, manifestations offensives de l'occultiste, etc.

## 2026-10-16 : Recherche dans les listes d'ajout ; style Classique retiré
- Champ « Chercher… » à côté de la liste « Ajouter un sort » (onglet Sorts) et de « Ajouter depuis le catalogue » (Inventaire) : filtre par morceau de nom, sans accents ni majuscules, nom français ou anglais. Le texte est vidé après un ajout. Côté noyau : attribut `data-input` (action appelée à chaque frappe), `App.ui.search` par liste.
- Style « Classique » retiré à la demande de Plouf (pas convaincu) : option et CSS supprimés.

## 2026-10-16 : Style « Classique » à l'essai (retiré ensuite)
- Options > Style de fiche : « Parchemin » (par défaut) ou « Classique (fiche 5e officielle) ». Préférence du navigateur (`dnd.sheetStyle`), vaut pour toutes les fiches.
- Purement visuel (classe `html.classic` dans style.css) : cadres à l'encre avec filet intérieur, titres en petites capitales centrées, valeur de caractéristique dans un ovale, CA en bouclier, bonus de compétence sur un trait, ronds de maîtrise noirs. Même disposition, mêmes couleurs de papier.

## 2026-10-15 : Inspiration héroïque plus visible
- Activée, la case Inspiration est remplie de la couleur d'accent de la classe, avec une bordure de 4 px et une étoile claire plus grande (remplace le doré).

## 2026-10-15 : Dés de vie du défenseur d'acier
- Effet `resource` : champ optionnel `companion: "<id>"` ; la ressource s'affiche alors sur la carte du compagnon au lieu de la carte Ressources.
- Défenseur d'acier : compteurs Réparation (3) et Dés de vie (d8, autant que le niveau d'Artificier) sur sa carte, rendus au repos long.

## 2026-10-15 : Défenseur d'acier lisible
- Compagnons : `traits` peut être un tableau de lignes « Libellé : texte », affiché en liste avec libellé en gras (`.companion-traits`).
- Défenseur d'acier : description découpée en 8 lignes (caractéristiques, type, lien d'acier, déchirure renforcée, réparation, détourner l'attaque, immunités, sens).

## 2026-10-15 : Compagnon à forme unique, lien du défenseur

- Un compagnon qui n'a qu'une forme (défenseur d'acier) la prend d'office : plus de liste « Choisir la forme ».
- Une forme peut donner son propre lien (`url`) ; le défenseur d'acier pointe vers 5e.tools (version Forge of the Artificer), et le texte du lien indique le site.

## 2026-10-15 : Correctif « bloqué sur Chargement »

- Bug introduit par le renommage de la colonne « Pacte » : l'étiquette de l'arme liée dans le tableau des attaques utilisait `App`, absent de cette fonction ; une fiche avec une arme de pacte cochée plantait au démarrage. Corrigé (`s.weaponBond`).
- `App.start` : si la fiche enregistrée ne s'affiche pas, l'application passe en mode Création et affiche l'erreur au lieu de rester sur « Chargement… ».
- Contrôle navigateur ajouté à la routine : chaque classe et sous-classe aux niveaux 1, 3, 5 et 10, dans chaque onglet des deux modes.

## 2026-10-15 : Clerc, Domaine de la Tombe

- Nouvelle sous-classe dans `modules/classes/cleric-grave.js` (via `subclass:cleric`, sans toucher au noyau ni à `cleric.js`), ajoutée au manifeste après `classes/cleric.js`. Sort manquant (Coquille antivie, AideDD 2024) dans `modules/spells/cleric-grave.js`, listé avant les classes.
- Source : mécaniques de la version Xanathar (2014). AideDD n'a que la version Arcanes exhumés, assez différente : seuls les noms français en viennent. Écarts détaillés dans `classes/clerc.md`, à vérifier dans le livre.
- Adaptation 2024 : aptitudes des niveaux 1 et 2 placées au niveau 3, sorts de domaine aux niveaux 3/5/7/9, Incantation puissante (niv. 8) non ajoutée car Frappes bénies (niv. 7) la donne déjà.
- 8 tests ajoutés (325 au total).

## 2026-10-15 : Ensorceleur, Sorcellerie des tempêtes

- Nouvelle sous-classe dans `modules/classes/sorcerer-storm.js` (via `subclass:sorcerer`, sans toucher au noyau ni à `sorcerer.js`), ajoutée au manifeste après `classes/sorcerer.js`. Source : Xanathar (2014), texte français d'AideDD (page Unearthed Arcana « Aventures maritimes », qui reprend la version officielle du Xanathar).
- Adaptation 2024 : Langage du vent et Magie tumultueuse (niveau 1 dans le Xanathar) sont placés au niveau 3, quand l'ensorceleur 2024 choisit sa sous-classe. Cœur de la tempête et Guide des tempêtes restent au niveau 6.
- Pas de liste de sorts de sous-classe (le Xanathar n'en donne pas) : aucun sort à ajouter, donc pas de fichier `modules/spells/sorcerer-storm.js`.
- 5 tests ajoutés (317 au total).

## 2026-10-15 : Colonne « Pacte » de l'inventaire

- La colonne n'apparaît qu'avec un effet `weaponBond` (Pacte de la lame, Forgeron de guerre). Son titre vient maintenant de l'effet (`column`) : « Pacte » pour l'occultiste, « INT » pour le Forgeron de guerre (Prêt au combat, arme magique seulement).

## 2026-10-15 : Artificier, 17 sorts manquants

- `modules/spells/artificer.js` : 13 sorts du Xanathar relevés sur AideDD (version 2014) et 4 sorts de Forge of the Artificer absents d'AideDD (entrées minimales sans lien, nom français provisoire, à vérifier : Sanctuaire silencieux d'Aundair, Déflagration de force, Artisanat magique, Serviteur homoncule). La liste de l'artificier compte 96 sorts.
- Les sorts du Xanathar sont seulement sur la liste de l'artificier (les autres classes suivent les listes 2024). Leur lien ouvre la fiche AideDD 2014 (champ `aidedd2014`, `DND.config.spellUrl` enveloppé dans le module de sorts, sans toucher au noyau).
- 2 tests ajoutés.

## 2026-10-15 : Artificier corrigé d'après le livre

- Plouf a fourni le texte de Forge of the Artificer : multiclasse (outils de bricoleur et 1 compétence, plus d'outils de voleur), Sorts (outils requis comme focaliseur), Magie de bricoleur (Réparation + liste des objets), Réplication d'objet magique (tables de plans du livre avec harmonisation), Bricolage d'objet magique, Éclair de génie (min. +1), Adepte des objets magiques.
- Alchimiste refait d'après le livre : matériel d'herboriste, Sphère de vitriol au lieu de Flétrissement, table d'élixirs qui évolue aux niveaux 9 et 15.
- Armurier, Artilleur, Forgeron de guerre refaits d'après le livre (noms des armes du modèle, Stature de géant INT fois, Champ défensif quand Ensanglanté, +1 au niveau 9, armes de guerre à distance de l'Artilleur, Détonation en réaction, Décharge arcanique une fois par tour). Nouvelle sous-classe Cartographe ; sort Appel de la foudre ajouté à `modules/spells/artificer.js`.
- Table de progression vérifiée sur la capture du livre : déjà conforme, rien à changer.
- Liste de sorts alignée sur celle du livre (fournie par Plouf) : Élémentalisme, Coup au but, Vigueur arcanique, Souffle du dragon, Cercle de pouvoir ajoutés ; Réparation retirée (connue par Magie de bricoleur). 17 sorts absents du catalogue en cours d'ajout par un autre fil.
- Canon occulte et Défenseur d'acier corrigés d'après les blocs du livre : défenseur CA 12 + INT, PV 5 + 5 × niveau (calculés), Déchirure renforcée 1d8 + INT, Réparation 3 fois par jour (compteur). Noyau : une valeur de forme de compagnon (CA, PV, traits) peut être une fonction du personnage.
- Le choix d'outils d'artisan du niveau 1 devient facultatif (en multiclasse il n'est pas accordé ; le noyau ne sait pas encore limiter une aptitude à la première classe).

## 2026-10-15 : Artificier niveaux 1 à 10

- Module `modules/classes/artificer.js` (couleur #b8622e) : Sorts (Intelligence, demi-lanceur arrondi au supérieur), Magie de bricoleur, Réplication d'objet magique (plans par niveau), Bricolage d'objet magique, Éclair de génie, Adepte des objets magiques. Sous-classes : Alchimiste, Armurier, Artilleur, Forgeron de guerre. Cartographe non inclus. Détail dans `classes/artificier.md`.
- **Tout est saisi de mémoire** (Forge of the Artificer, absent d'AideDD et du SRD) : à vérifier dans le livre.
- `modules/spells/artificer.js` : 10 sorts ajoutés, liste de l'artificier reconstituée de mémoire.
- 18 tests ajoutés dans `tests/classes.js`.

## 2026-10-15 : Ensorceleur niveaux 1 à 10

- Module `modules/classes/sorcerer.js` (couleur #b0263a) : Sorts (Charisme), Sorcellerie innée, Réserve arcanique (points, conversion, création d'emplacements avec coûts), 10 options de Métamagie (chacune devient une action), Restauration ensorcelée, Sorcellerie incarnée. Sous-classes : draconique et sauvage (AideDD), aberrante et mécanique (de mémoire, à vérifier). Détail dans `classes/ensorceleur.md`.
- `modules/spells/sorcerer.js` : 18 sorts ajoutés (liste de l'ensorceleur et sorts de sous-classe).
- Limite : les emplacements créés avec des points de sorcellerie ne peuvent pas dépasser le maximum affiché.
- 21 tests ajoutés dans `tests/classes.js`.

## 2026-10-15 : Paladin niveaux 1 à 10

- Module `modules/classes/paladin.js` (couleur #b58a2c) : Imposition des mains (réserve), Sorts (demi-lanceur arrondi au supérieur), Bottes d'arme, Style de combat ou Combattant béni, Châtiment de paladin, Conduit divin, Fidèle destrier, Aura de protection (calculée sur vos JS), Abjuration d'ennemis, Aura de courage. 4 serments d'AideDD : Anciens, Dévotion, Gloire, Vengeance. Détail dans `classes/paladin.md`.
- `modules/spells/paladin.js` : 25 sorts ajoutés (liste du paladin niveau 1 à 5 et sorts de serment).
- 23 tests ajoutés dans `tests/classes.js` (dont multiclassage Paladin/Clerc).

## 2026-10-15 : Clerc niveaux 1 à 10

- Module `modules/classes/cleric.js` (couleur #a77a12) : Sorts (Sagesse), Ordre divin (Protecteur / Thaumaturge), Conduit divin (1 au repos court) avec Étincelle divine et Renvoi des morts-vivants, Calcination, Frappes bénies (Incantation puissante calculée), Intervention divine. 4 domaines d'AideDD : Vie, Lumière, Ruse, Guerre. Détail dans `classes/clerc.md`.
- `modules/spells/cleric.js` : 52 sorts ajoutés (liste du clerc niveau 0 à 5 et sorts de domaine), Oeil du mage retiré de la liste du clerc.
- **Limite du noyau signalée** : une ressource ne peut pas changer de récupération avec le niveau (Éclat protecteur : repos long, puis court au niveau 6). Proposition : autoriser `maxLevel` sur un effet (une ligne dans `walkEffects`), pour déclarer deux versions de la ressource. Pas appliqué (règle : pas de modification du noyau sans accord).
- 23 tests ajoutés dans `tests/classes.js`.

## 2026-10-15 : Espèces Duergar et Génasi (Monsters of the Multiverse)
- Demandées par Plouf (un duergar et un génasi dans le groupe). Nouveaux fichiers `modules/species/duergar.js`, `modules/species/genasi.js`, `modules/spells/species-motm.js` ; ajoutés au manifeste. Aucun changement du noyau.
- Génasi = un seul module avec la lignée en choix (air, terre, feu, eau). Duergar = module séparé, pas une variante du Nain. Pas d'augmentation de caractéristiques d'espèce (règles 2024).
- Mécaniques de MotM (AideDD n'a que la version 2014) ; sorts relevés sur AideDD 2024 : Flammes (Produce Flame), Lame de feu, Création ou destruction d'eau, Marche sur l'eau / Marche sur l'onde (nom double pour que le lien AideDD fonctionne).
- Limites : Souffle sans fin, Amphibie, Marche de la terre, Force psionique et « sur vous-même » restent en texte.
- Tests : 10 de plus, `node tests/run.js` passe.

## 2026-10-15 : Guerrier niveaux 1 à 10

- Module `modules/classes/fighter.js` (couleur #7a2e22) : Style de combat (dons existants), Second souffle (1 au repos court), Bottes d'arme (choix d'armes, botte affichée sur l'attaque), Fougue, Sens tactique, dons aux niveaux 4, 6 et 8, Attaque supplémentaire, Décalage tactique, Inflexible, Botte tactique. Textes d'AideDD.
- 4 sous-classes : Champion, Chevalier occulte (incantation de tiers avec sa propre table, liste du magicien), Maître de guerre (20 manœuvres, chacune devient une action avec son DD), Soldat psi (saisi de mémoire, AideDD renvoie au livre). Détail dans `classes/guerrier.md`.
- Sorts : 302 sorts de niveau 0 à 5 relevés sur AideDD (fiches individuelles : classes, temps, portée, composantes, durée, JS, dégâts). `modules/spells/fighter.js` ajoute les 40 sorts de magicien de niveau 0 à 2 qui manquaient (pour le Chevalier occulte). Les sorts déjà au catalogue ne sont pas réenregistrés.
- Tests des nouvelles classes dans `tests/classes.js`, appelé par `tests/run.js` (26 vérifications pour le Guerrier). Aucune modification du noyau.

## 2026-10-15 : Noms d'aptitudes de l'Occultiste

- Quatre noms alignés sur AideDD : Rouerie magique, Communication avec le protecteur, Résistance fiélonne, Traversée des enfers. Identifiants inchangés, les personnages existants ne bougent pas.

## 2026-10-15 : Sous-classes de l'Occultiste (Archifée vérifiée, Céleste, Grand Ancien)
- Archifée vérifiée sur AideDD : mécaniques correctes, noms corrigés (Foulée des fées, Foulée revigorante / provocatrice, Échappatoire brumeuse, Foulée de disparition / effroyable, Charmantes défenses, Magie envoûtante). Les identifiants de ressources n'ont pas changé, les sauvegardes restent valides.
- Ajout de `modules/classes/warlock-celestial.js` et `modules/classes/warlock-great-old-one.js` (niveaux 3 à 10), sans toucher au noyau ni à `warlock.js`.
- Nouveau dossier `modules/spells/` : `warlock-subclasses.js` enregistre 17 sorts relevés sur AideDD, chargé avant les classes dans le manifeste.
- Limite du moteur repérée : `onRest` ne sait que rendre l'Inspiration héroïque ; Résilience céleste (PV temporaires après un repos) est donc un rappel chiffré.
- Noms de `warlock.js` qui diffèrent d'AideDD, non corrigés ici : Rouerie magique, Communication avec le protecteur, Résistance fiélonne, Traversée des enfers.
- Tests : 177 / 177.

## 2026-10-15 : États, épuisement, chiffres

- Les alertes (armure trop lourde, charge…) s'affichent dans la page, sous les onglets : les onglets ne bougent plus. L'effet de l'épuisement n'est plus une alerte mais un texte à côté du compteur, dans la carte États (`sheet.exhaustionText`).
- Carte États : l'effet de chaque état coché reste affiché sous les états (encadré rouge).
- Inspiration héroïque activée : la case garde son fond papier, avec un cadre et une étoile dorés (avant, le fond plein masquait le contenu).
- Chiffres : en-têtes de groupes de compétences en police normale (plus de petite serif), chiffres à chasse fixe partout.

## 2026-10-15 : Les 75 dons 2024 (AideDD)

- Demande de Plouf : la liste de dons du niveau 4 était trop courte. Ajout de tous les dons du Manuel des joueurs 2024 d'après AideDD : 43 généraux, 10 de style de combat, 12 faveurs épiques (en plus des 10 dons d'origine). Un fichier par don dans `modules/feats/`, déclarés dans le manifeste ; aucun changement du noyau.
- `modules/feats/helpers.js` (`DND.feat`) : +1 de caractéristique, prérequis (niveau, valeur 13, capacité Sorts ou Magie de pacte, formation aux armures), armure portée, options de sorts par école, choix « maîtrise ou expertise ».
- Calculé quand c'est possible : caractéristiques, maîtrises, sorts gratuits (Affinité féerique/ombreuse, Télépathe, Magie rituelle), vitesse (Mobile, Athlète), CA (Défense, Maître des armures intermédiaires), Archerie, vision aveugle, ressources (Tueur de mages, faveurs), réactions et actions bonus affichées. Le reste est en texte.
- Lutteur renommé Empoigneur (nom AideDD), même identifiant `grappler`. Détection des pensées ajouté au catalogue par le module Télépathe.
- Faveurs épiques : AideDD ne donne que les noms, textes résumés de mémoire, à vérifier dans le livre. Détails et limites dans `modules.md`.
- 166/166 tests (20 nouveaux sur les dons).

## 2026-10-15 : Compétences par caractéristique, papier sombre, couleurs de classe

- Compétences de la colonne de gauche regroupées sous FORCE, DEXTÉRITÉ, INTELLIGENCE, SAGESSE, CHARISME (avec le modificateur), triées par nom.
- Effet papier toujours actif. Un seul thème (choix de Plouf) : papier #dabe9c, entre le parchemin clair et le kraft, encre brun foncé, bureau #7a5f45. Les options d'effet papier et de thème clair/sombre sont retirées d'Options.
- Options › Couleur d'accent : « Ma classe », la couleur de chacune des 13 classes (`DND.data.accentPresets` en fin de `data/rules.js`) ou une couleur personnalisée.
- Liste des dons 2024 : confiée au fil « Dons depuis AideDD » (cette session n'a pas accès à AideDD).

## 2026-10-15 : Langues rares

- Demande de Plouf : l'infernal, le sylvestre, etc. n'étaient pas sélectionnables (seulement 2 langues standards à la création, règle 2024).
- Une seule liste « Langues » dans Création (demande de Plouf) : toutes les langues, rares marquées « (rare) », au moins 2 cochées, sans maximum. Les sauvegardes qui avaient la liste séparée « Autres langues » sont fusionnées à l'ouverture.
- Noyau : un choix peut avoir `min` (minimum exigé quand on peut en prendre davantage) ou `optional: true` (aucun minimum) ; il affiche « N choisies » et ne compte dans les choix en attente que sous le minimum. Réutilisable ailleurs.
- 146/146 tests.

## 2026-10-15 : Retours de test de Plouf (Occultiste)

- **Dés de vie** : simple compteur à pastilles (carte PV et fenêtre de repos court), sans jet dans la fiche puisque le groupe lance sur Discord. Le repos court permet d'ajouter les PV obtenus. Tous récupérés au repos long. Nouvelle règle `R.adjustHitDie` (`R.spendHitDie` reste pour les tests).
- **Familiers** : lien « Fiche complète sur AideDD » pour la forme choisie (`DND.config.monsterUrl`, adresse = nom français sans accents ; `form.aidedd` force une autre adresse si besoin).
- **Sorts** : pastilles V / S / M avec la règle en infobulle (texte de la composante matérielle si `spell.material` est renseigné). Bouton « Se concentrer » sur les sorts à concentration.
- **Concentration** : carte dédiée dans Combat (sort en cours avec suggestions, rappel de la règle 2024). Retirée de la carte États.
- **Inventaire** : catalogue d'équipement `DND.data.gear` (7 paquetages avec contenu, focaliseurs, équipement courant, sac sans fond) et poids des outils ; poids unitaire modifiable en kg sur chaque ligne ; poids des pièces (50 = 1 lb) ; carte Charge (FOR × 15 lb × taille, effet `bonus` `carrySize` utilisé par la Carrure puissante du goliath, `carry` pour un bonus fixe) ; colonne « Sac » quand un sac sans fond est porté (contenu exclu de la charge, plafond 500 lb). Calcul dans le moteur (`sheet.load`, `E.itemData`).
- **Apparence** : effet papier (feuilles de parchemin, onglets en intercalaires collés à la page, titres en serif), menu Options (thème, effet papier, couleur d'accent). Couleur d'accent = `color` du module de la classe de départ (Occultiste `#6b3fa0`), remplaçable par personnage (`ch.settings.accent`, exportée avec la fiche). Thème et papier sont des réglages du navigateur. Le bouton ◐ est remplacé par Options.
- Vérifié sur AideDD (`fiches-dnd-verif/equipement.md`) et intégré : contenu des paquetages (« Paquetage d'exploration souterraine »), artiste 29 kg, jeux de société sans poids, sac sans fond 2,5 kg / 250 kg, Squelette CA 14, Chat escalade 12 m, adresse du têtard de slaad (`slaad-tetard`), texte des 57 composantes matérielles (`MATERIALS` dans `data/spells.js`). Capacité de charge : règle du SRD 5.2 (non publiée sur AideDD).
- Tests : 11 vérifications ajoutées (charge, pièces, sac, goliath, petite taille, couleur, dés de vie). Test navigateur clair/sombre sans erreur JS.

## 2026-10-15 : Les 16 historiques du Manuel des joueurs 2024

- Demande de Plouf (Charlatan manquait). 12 historiques ajoutés d'après AideDD (regles-24 › Description des historiques) : Artisan, Artiste, Charlatan, Ermite, Fermier, Garde, Guide, Marchand, Marin, Noble, Scribe, Voyageur. Les 4 existants gardent leurs identifiants (sauvegardes compatibles) ; leur texte d'équipement est maintenant celui d'AideDD.
- 6 dons d'origine ajoutés, utilisés par ces historiques (et proposés à l'Humain) : Façonneur, Guérisseur, Chanceux (ressource Points de chance = bonus de maîtrise, repos long), Musicien (3 instruments), Bagarreur de tavernes, Robuste (+2 PV/niveau via `hpPerLevel`).
- `data/rules.js` : noms d'outils alignés sur AideDD (Outils de menuisier, Accessoires de déguisement, Matériel de contrefaçon / d'herboriste / d'empoisonneur, Boîte de jeux : …). L'outil générique « Instrument de musique » est remplacé par les 10 instruments 2024 (chacun est une maîtrise distincte). Le poids des instruments reste à ajouter dans `data/equipment.js` (fil Plan fiches D&D).
- Attaquant sauvage renommé Sauvagerie martiale (nom AideDD), identifiant inchangé.
- Aucune modification du noyau. Tests ajoutés (historiques, Doué, Robuste, Chanceux, Musicien, Guide), tous OK.

## 2026-10-15 : Noms de sorts vérifiés sur AideDD

- Accès réseau à www.aidedd.org ouvert par Plouf. 5e.tools reste illisible depuis le cloud (vérification anti-robot Cloudflare) et n'a pas les noms français.
- Les 106 sorts de `data/spells.js` comparés à la liste AideDD 2024 (par nom anglais) : 85 corrects, 21 corrigés.
- Corrections (ancien → AideDD) : Protection contre les armes → Voile défensif ; Amis → Amis / Faux amis ; Éclat mental → Piqûre mentale ; Bras d'Hadar → Tentacules de Hadar ; Fléau → Imprécation ; Écriture illusoire → Texte illusoire ; Nuage de dagues → Nuée de dagues ; Couronne de folie → Couronne du dément ; Envoûtement → Discours captivant ; Pointe mentale → Épine mentale ; Terreur → Peur / Terreur ; Faim d'Hadar → Voracité de Hadar ; Nuage puant → Nuage nauséabond ; Invocation de fée / de mort-vivant / d'aberration → Convocation de … ; Œil magique → Oeil du mage ; Contact avec un autre plan → Contact avec les plans ; Rêve → Songe ; Lien planaire → Entrave planaire ; Décharge synaptique → Perturbations synaptiques.
- AideDD donne deux traductions pour Friends et Fear (« Amis|Faux amis », « Peur|Terreur ») : affichées avec « / », le lien reste juste.
- Mêmes noms corrigés dans les descriptions de `warlock.js` et `classes/occultiste.md`.
- `DND.slug` (core/registry.js) convertit maintenant œ/æ en oe/ae (avant, « Œil » donnait le lien `il-...`).
- Les 106 liens générés ouvrent une vraie page AideDD ; 104/104 tests OK.

## 2026-10-15 : Occultiste niveaux 1 à 10 (étape 3)

### Ajouts
- Module `modules/classes/warlock.js` : Magie de pacte, 27 manifestations occultes avec prérequis, Astuce magique, dons des niveaux 4 et 8, Contacter le protecteur, sous-classe Protecteur fiélon. Détail dans `classes/occultiste.md`.
- Catalogue de sorts : liste complète de l'Occultiste (niveaux 0 à 5) et sorts accordés par ses aptitudes, soit 97 sorts au total.
- Noyau, nouveaux types d'effets réutilisables par les autres classes :
  - `companion` / `companionNote` : carte de compagnon (familier, plus tard compagnon de rôdeur, etc.) avec forme, CA, PV suivis à part.
  - `weaponBond` : arme liée qui utilise une autre caractéristique (arme de pacte ; servira pour d'autres classes).
  - `spell` avec `atWill` : sort lançable sans emplacement.
  - `note` : rappel affiché dans l'onglet Combat (« À retenir »).
  - option `showChosen` sur un choix : les options choisies apparaissent dans l'onglet Aptitudes.
  - filtres de sorts `ritual` et `damaging` ; sorts à rayons multiples (`scaling: "beams"`).
- Le format des liens AideDD est confirmé par Plouf : `aidedd.org/spell/fr/<nom-en-minuscules-sans-accents>`.

### Tests
- `node tests/run.js` : 99 vérifications, dont l'Occultiste réel du niveau 1 au 10 (emplacements, manifestations, familier, Décharge déchirante, Armure des ombres, Fiélon, multiclassage avec Magie de pacte séparée).
- Création complète d'un occultiste niveau 5 dans Chromium via l'interface, sans erreur.

### Incident
- Pendant la session, une erreur de script a vidé `core/engine.js` ; le fichier a été réécrit intégralement et vérifié par les tests. Une copie de sauvegarde du dossier est faite après chaque étape.

### Ajout : Protecteur Archifée
- L'occultiste de Plouf a un pacte avec l'Archifée (hors SRD) : sous-classe ajoutée dans un fichier séparé (`warlock-archfey.js`) via `registerList("subclass:warlock")`, sans modifier le noyau ni `warlock.js`. Saisie de mémoire, à vérifier.
- 9 sorts ajoutés au catalogue (Sommeil, Apaisement des émotions, Force fantasmagorique, Clignotement, Croissance végétale, Domination de bête, Invisibilité suprême, Domination de personne, Apparence trompeuse). 104 tests réussis.
- Accès à AideDD et 5e.tools : bloqué par le réseau de l'environnement cloud par défaut. Plouf peut autoriser ces domaines en créant un environnement dans les réglages du projet (effet sur les sessions suivantes).

### Prochaines étapes
- Plouf et le groupe testent l'Occultiste ; corrections selon les retours (termes, statistiques des familiers).
- Ensuite : Guerrier (styles de combat, maîtrise des armes, Second souffle, Fougue).

## 2026-10-15 : Noyau construit (étape 2)

### Ce qui fonctionne
- **Ouvrir la fiche** : double-clic sur `index.html` (Chrome, Firefox, Edge). Aucune installation.
- **Mode Création** : identité, caractéristiques de base (avec coût en achat de points), espèce, historique, classes et niveaux (multiclassage compris), sous-classe, tous les choix des modules avec compteur, dons supplémentaires, ajustements manuels.
- **Mode Jeu** : caractéristiques, JS, compétences (maîtrise / expertise), valeurs passives, sens, maîtrises et langues, CA détaillée (armure, bouclier, formules sans armure), initiative, vitesse, bonus de maîtrise, taille, inspiration héroïque.
- **Combat** : PV avec dégâts / soins / PV temporaires, jets contre la mort, dés de vie, repos court (lancer de dés de vie) et repos long, états préjudiciables avec résumé, épuisement, concentration (rappel du DD quand on subit des dégâts), attaques calculées (armes, mains nues, tours de magie offensifs), ressources, emplacements de sorts et Magie de pacte.
- **Sorts** : DD et attaque par classe, compteurs tours de magie / sorts préparés, ajout depuis le catalogue filtré par liste et niveau, sorts accordés (espèce, dons) avec utilisations gratuites, sorts personnalisés.
- **Aptitudes**, **Inventaire** (bourse, armes et armures du SRD, objets libres, bonus magique, poids en kg), **Notes**.
- **Sauvegarde** automatique dans le navigateur, plusieurs personnages, export / import JSON, thème clair / sombre.

### Décisions d'implémentation
- **PV** : on stocke les dégâts subis (`state.damage`), pas les PV actuels. Une montée de niveau ou une hausse de Constitution augmente donc aussi les PV actuels.
- **PV par niveau** : valeur moyenne (max au niveau 1 de la classe de départ). Un écart (PV lancés aux dés) passe par un ajustement manuel « PV maximum ».
- **Multiclassage** : JS et maîtrises complètes de la 1re classe seulement ; emplacements calculés par niveau de lanceur (moitié arrondie selon le module) ; Magie de pacte séparée ; avertissement si le prérequis de 13 n'est pas rempli.
- **Épuisement** : affiché en avertissement (−2 par niveau aux tests d20) ; la vitesse est réduite automatiquement, les bonus affichés ne le sont pas.
- **Avantages conditionnels** (ex. contre l'état Charmé) : dans le texte de l'aptitude, pas en marqueur sur les JS.
- **Choix imbriqués** : stockés à plat avec un chemin (`feat:magic-initiate/cantrips`). Un module peut imposer un choix (`preset`), ex. Acolyte impose la liste du Clerc à Initié à la magie.
- **Affichage** : redessin complet de la fiche à chaque changement, avec une fonction `morph` qui ne modifie que ce qui change (le focus et les clics sont préservés).

### Tests
- `node tests/run.js` : 47 vérifications du moteur (caractéristiques, CA, PV, compétences, dons, repos, dégâts, sorts accordés, multiclassage, aller-retour JSON). Les classes utilisées sont factices (`tests/fixtures.js`).
- Parcours complet testé dans Chromium (création, jeu, repos, sorts, rechargement), sans erreur JavaScript.

### Bugs connus et limites
- AideDD n'est pas accessible depuis mon environnement : les termes français viennent de mes connaissances. Termes à vérifier listés dans `modules.md`.
- Le catalogue de sorts ne contient pour l'instant que les sorts des espèces ; il grandira classe par classe. En attendant, les sorts manquants s'ajoutent en « sort personnalisé ».
- Pas encore de maîtrise d'armes (Weapon Mastery) sélectionnable : prévu avec le Guerrier.

### Prochaines étapes
- Étape 3 : module Occultiste niveaux 1 à 10, sorts de la liste d'Occultiste, familier (Pacte de la chaîne), `classes/occultiste.md`.

## 2026-10-15 : Proposition de stack et de modèle de données (validée)

### Cadre convenu
- On part de zéro. Sources : SRD 5.2 pour les règles, terminologie française d'[AideDD](https://www.aidedd.org/regles-24/), 5e.tools en recours. Hors SRD (ex. Artificier) : seulement les mécaniques utiles à la fiche.
- Fichier local ouvert d'un double-clic ; GitHub Pages possible plus tard sans rien changer.
- Première version : niveaux 1 à 10.
- Ordre des classes : Occultiste (pilote), Guerrier, Clerc, Paladin, Ensorceleur, Artificier.

### Stack proposée
**HTML + CSS + JavaScript « nature », sans framework, sans installation, sans compilation.**

- On ouvre `index.html` dans le navigateur, c'est tout. Rien à installer, ni pour toi ni pour le groupe.
- Pourquoi pas React/Vue/etc. : ils demandent un outil de compilation (Node, npm) ou ajoutent une couche à comprendre. Une fiche de personnage reste petite : redessiner la fiche entière à chaque changement est instantané, donc pas besoin de système réactif.
- Pourquoi des scripts classiques et pas des « modules ES » : les navigateurs bloquent les modules ES quand on ouvre un fichier local (`file://`). Les scripts classiques fonctionnent partout.
- Sauvegarde : `localStorage` du navigateur (plusieurs personnages possibles) + export/import d'un fichier `.json`.
- Le code est commenté en français là où ça aide à comprendre, noms de variables en anglais.

### Organisation des fichiers
```
fiches-dnd/
  index.html              page unique
  core/                   le noyau (ne change pas quand on ajoute une classe)
    engine.js             calculs : modificateurs, maîtrise, CA, DD, etc.
    rules.js              règles générales : repos, épuisement, conditions
    registry.js           enregistrement des modules
    render.js             affichage de la fiche
    storage.js            sauvegarde locale, export/import JSON
    style.css
  data/                   données SRD communes : compétences, conditions,
                          armes, armures, sorts
  modules/
    manifest.js           liste des modules à charger (une ligne par module)
    classes/warlock.js    un fichier par classe
    species/  backgrounds/  feats/
  classes/occultiste.md   journaux par classe
  modules.md
  DEVLOG.md
```
**Ajouter une classe** = ajouter `modules/classes/<classe>.js` + une ligne dans `manifest.js`. Le noyau n'est jamais touché.

### Principe central
**La sauvegarde ne contient que les choix et l'état, jamais les valeurs calculées.** On stocke « Charisme 16, Occultiste niveau 5 » ; le modificateur, le bonus de maîtrise, le DD des sorts, le nombre d'emplacements sont recalculés à chaque affichage. Résultat : impossible d'avoir une fiche incohérente, et une correction de règle s'applique à tous les personnages existants.

Seule exception : les **ajustements manuels** (`overrides`), pour un objet magique ou une décision du MJ que le système ne connaît pas. Ils sont affichés comme tels sur la fiche.

### Modèle du personnage (fichier sauvegardé)
```js
{
  schemaVersion: 1,               // pour faire évoluer le format sans casser les anciennes fiches
  id: "a1b2c3", name: "Morwen", player: "Plouf",

  abilities: { str: 8, dex: 14, con: 14, int: 10, wis: 12, cha: 15 }, // valeurs de base, avant historique
  species:    { id: "tiefling", choices: { legacy: "infernal" } },
  background: { id: "sage", choices: { abilityBonus: { cha: 2, con: 1 } } },
  classes: [                      // tableau : prêt pour le multiclassage
    { id: "warlock", level: 5, subclass: "fiend",
      choices: { "invocations": ["pact-of-the-chain", "agonizing-blast", "armor-of-shadows"],
                 "skills": ["arcana", "deception"] } }
  ],
  feats: [ { id: "magic-initiate", source: "background", choices: { list: "wizard", spells: [...] } } ],

  spells: [ { id: "hex", source: "warlock" }, { id: "eldritch-blast", source: "warlock" } ],
  inventory: [ { id: "leather-armor", qty: 1, equipped: true },
               { name: "Pendentif de ma mère", qty: 1, notes: "..." } ],   // objet libre
  coins: { pp: 0, gp: 45, ep: 0, sp: 3, cp: 0 },

  companions: [ { id: "familiar", form: "imp", hp: 7, notes: "" } ],    // familier, monture...

  state: {                        // ce qui bouge pendant la partie
    hp: 31, tempHp: 0,
    hitDiceSpent: { d8: 2 },
    slotsSpent: { 1: 0, 2: 0, 3: 0 },        // emplacements « normaux »
    resources: { "warlock.pactSlots": 1, "warlock.magicalCunning": 0 }, // utilisations dépensées
    conditions: ["poisoned"], exhaustion: 0,
    concentration: "hex", heroicInspiration: false,
    deathSaves: { success: 0, failure: 0 }
  },

  overrides: [ { target: "ac", value: 1, label: "Anneau de protection" } ],
  extraProfs: [ "skill.survival", "tool.herbalism-kit" ],
  notes: { personality: "", appearance: "", backstory: "", session: "" }
}
```

### Modèle d'un module (exemple simplifié : Occultiste)
Un module est un fichier JavaScript qui décrit une classe avec des **effets génériques** que le noyau sait interpréter.
```js
registerModule({
  kind: "class", id: "warlock",
  name: { fr: "Occultiste", en: "Warlock" },
  hitDie: 8,
  savingThrows: ["wis", "cha"],
  proficiencies: { armor: ["light"], weapons: ["simple"],
                   skills: { choose: 2, from: ["arcana", "deception", "history", ...] } },
  spellcasting: { type: "pact", ability: "cha", table: { 1: { slots: 1, slotLevel: 1, cantrips: 2, prepared: 2 }, ... } },

  features: [
    { level: 1, id: "eldritch-invocations", name: { fr: "Manifestations occultes", en: "Eldritch Invocations" },
      effects: [ { type: "choice", id: "invocations", from: "warlock-invocations",
                   count: { 1: 1, 2: 3, 5: 5, 7: 6, 9: 7 } } ] },
    { level: 2, id: "magical-cunning", name: { fr: "...", en: "Magical Cunning" },
      effects: [ { type: "resource", id: "magicalCunning", max: 1, recharge: "long" } ] },
    ...
  ],
  subclasses: [ { id: "fiend", name: { fr: "Protecteur Fiélon", en: "Fiend Patron" }, features: [...] } ]
});
```

**Types d'effets prévus dans le noyau** (la liste s'enrichira, mais chaque nouveau type sert à toutes les classes) :
| Type | Exemple |
|---|---|
| `resource` | emplacements de pacte, Second souffle, Imposition des mains (réserve de points) ; récupération repos court / long / partielle |
| `proficiency` | maîtrise ou expertise d'une compétence, sauvegarde, armure, outil |
| `bonus` | +X à la CA, vitesse, PV max, initiative, une compétence… |
| `acFormula` | Défense sans armure, Armure d'ombres (Armure du mage permanente) |
| `choice` | manifestations, style de combat, maîtrises d'armes, sorts de domaine |
| `spells` | sorts toujours préparés ou gratuits (domaine, sous-classe, manifestation) |
| `action` | une action affichée sur la fiche avec ses utilisations (ex. Conduit divin) |
| `companion` | familier, compagnon : mini-fiche avec ses propres PV |
| `modifier` | modifie un calcul existant (Décharge déchirante ajoute le mod. de Cha aux dégâts) |
| `note` | texte affiché, sans calcul |

Les valeurs variables (`max`, `value`) peuvent être un nombre ou une petite fonction lisible : `max: (c) => Math.max(1, c.mod.cha)`.

Les espèces, historiques et dons utilisent **exactement le même format** (`kind: "species"`, `"background"`, `"feat"`), avec les mêmes effets.

### Pourquoi l'Occultiste valide le modèle
- Magie de pacte = deuxième réserve d'emplacements qui se recharge au repos court → `spellcasting.type: "pact"`, séparée de `slotsSpent`.
- Manifestations = choix avec prérequis (niveau, pacte), certaines modifient d'autres calculs → `choice` + `modifier` + `acFormula`.
- Pacte de la chaîne = familier avec sa propre mini-fiche → `companion`.
- Les autres classes du groupe utilisent les mêmes briques : Guerrier (`resource`, `choice` style de combat), Clerc (`spells` de domaine, `action`), Paladin (réserve de points), Ensorceleur (points de sorcellerie convertibles), Artificier (infusions = `choice`).

### Choix par défaut que j'ai pris
- **Distances en mètres**, comme AideDD (9 m de vitesse, 1,5 m par case).
- **Création de personnage simple** : on saisit les 6 valeurs de base (achat de points, tableau standard ou dés, peu importe), l'historique applique ses bonus.
- **Montée de niveau** : on change le niveau, les nouveaux choix apparaissent à remplir.

### Décisions de Plouf
1. Sorts : catalogue SRD avec mécaniques en français, lien vers AideDD pour le texte complet.
2. Multiclassage : géré dès le noyau.
3. Armes et armures : celles du SRD intégrées, plus des objets libres.
