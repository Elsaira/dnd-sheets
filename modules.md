# Modules transversaux : espèces, historiques, dons

Source : SRD 5.2 (règles 2024). Statut : **à tester par un joueur** pour tout ce qui suit.

## Espèces (`modules/species/`)
| Espèce | Fichier | Ce que la fiche calcule | Choix proposés |
|---|---|---|---|
| Aasimar (PHB 2024, hors SRD) | aasimar.js | Résistances nécrotique et radiante, vision 18 m, Mains guérisseuses, Lumière, Révélation céleste (niv. 3). Saisi de mémoire : à vérifier dans le livre | Taille |
| Drakéide | dragonborn.js | Résistance, souffle (DD, dégâts selon niveau, utilisations), vision 18 m, Vol draconique (niv. 5) | Dragon ancestral |
| Duergar (MotM) | duergar.js | Vision 36 m, résistance poison, Agrandissement/rapetissement (niv. 3) et Invisibilité (niv. 5) gratuits, avantage contre Empoisonné, Charmé et Étourdi (★ dans États) | Caractéristique d'incantation |
| Nain | dwarf.js | Vision 36 m, résistance poison, +1 PV/niveau, Connaissance de la pierre, avantage contre Empoisonné (★) | — |
| Elfe | elf.js | Vision 18 m (36 m drow), vitesse 10,5 m (elfe des bois), sorts de lignée aux niv. 1/3/5, avantage contre Charmé (★) | Lignée, caractéristique d'incantation, Sens aiguisés |
| Génasi (MotM) | genasi.js | Vision 18 m ; selon la lignée : air (vitesse 10,5 m, foudre), terre (Voile défensif en action bonus, bonus de maîtrise fois), feu (feu), eau (acide, nage) ; sorts aux niv. 1/3/5 | Taille, lignée, caractéristique d'incantation |
| Gnome | gnome.js | Petite taille, vision 18 m, avantage JS INT/SAG/CHA, sorts de lignée | Lignée, caractéristique d'incantation |
| Goliath | goliath.js | Vitesse 10,5 m, Ascendance de géant (utilisations), Forme de grande taille (niv. 5) | Ascendance |
| Halfelin | halfling.js | Petite taille, avantage contre Effrayé (★) ; Chanceux, Agilité halfeline et Discrétion naturelle rappelés dans Actions spéciales | — |
| Humain | human.js | Inspiration héroïque au repos long | Taille, compétence, don d'origine |
| Orc | orc.js | Vision 36 m, Poussée d'adrénaline (repos court), Endurance implacable (rappel dans Actions spéciales) | — |
| Shadar-kai (MotM) | shadar-kai.js | Vision 18 m, résistance nécrotique, avantage contre Charmé (★), Bénédiction de la Reine Corbeau (action bonus, bonus de maîtrise fois par repos long ; résistance à tous les dégâts dès le niv. 3, rappelée dans le texte), Transe (2 maîtrises d'arme/outil temporaires à noter à la main) | — |
| Tieffelin | tiefling.js | Vision 18 m, résistance et sorts de legs aux niv. 1/3/5, Thaumaturgie | Taille, legs, caractéristique d'incantation |

Duergar, Génasi et Shadar-kai viennent de *Monsters of the Multiverse* (hors SRD, livres du groupe) : mécaniques de MotM, sans augmentation de caractéristiques d'espèce (règles 2024). AideDD n'a que leur version 2014 : noms d'aptitudes repris de sa traduction, sorts vérifiés sur AideDD 2024. Sorts ajoutés dans `modules/spells/species-motm.js`. Shadar-kai : AideDD n'a pas de page pour cette espèce, aptitudes écrites de mémoire d'après MotM, **à vérifier dans le livre** (noms français « Bénédiction de la Reine Corbeau », « Résistance nécrotique », et la Transe avec maîtrises temporaires).

## Historiques (`modules/backgrounds/`)
Les 16 historiques du Manuel des joueurs 2024, textes vérifiés sur AideDD le 2026-10-15.
| Historique | Caractéristiques | Don | Compétences | Outil |
|---|---|---|---|---|
| Acolyte | INT, SAG, CHA | Initié à la magie (Clerc, imposé) | Intuition, Religion | Matériel de calligraphe |
| Artisan | FOR, DEX, INT | Façonneur | Investigation, Persuasion | Un outil d'artisan |
| Artiste | FOR, DEX, CHA | Musicien | Acrobaties, Représentation | Un instrument de musique |
| Charlatan | DEX, CON, CHA | Doué | Escamotage, Tromperie | Matériel de contrefaçon |
| Criminel | DEX, CON, INT | Vigilant | Escamotage, Discrétion | Outils de voleur |
| Ermite | CON, SAG, CHA | Guérisseur | Médecine, Religion | Matériel d'herboriste |
| Fermier | FOR, CON, SAG | Robuste | Dressage, Nature | Outils de charpentier |
| Garde | FOR, INT, SAG | Vigilant | Athlétisme, Perception | Une boîte de jeux |
| Guide | DEX, CON, SAG | Initié à la magie (Druide, imposé) | Discrétion, Survie | Outils de cartographe |
| Marchand | CON, INT, CHA | Chanceux | Dressage, Persuasion | Instruments de navigateur |
| Marin | FOR, DEX, SAG | Bagarreur de tavernes | Acrobaties, Perception | Instruments de navigateur |
| Noble | FOR, INT, CHA | Doué | Histoire, Persuasion | Une boîte de jeux |
| Sage | CON, INT, SAG | Initié à la magie (Magicien, imposé) | Arcanes, Histoire | Matériel de calligraphe |
| Scribe | DEX, INT, SAG | Doué | Investigation, Perception | Matériel de calligraphe |
| Soldat | FOR, DEX, CON | Sauvagerie martiale | Athlétisme, Intimidation | Une boîte de jeux au choix |
| Voyageur | DEX, SAG, CHA | Chanceux | Discrétion, Intuition | Outils de voleur |

L'équipement de départ (choix A ou 50 po) est affiché en texte dans la description de l'historique : on l'ajoute dans l'inventaire.

## Dons (`modules/feats/`)
Les 75 dons du Manuel des joueurs 2024 : 10 d'origine, 43 généraux, 10 de style de combat, 12 faveurs épiques.
Textes repris d'AideDD le 2026-10-15 (lien : `aidedd.org/feat/fr/<champ aidedd du module>`), sauf les faveurs épiques :
AideDD ne publie que leur nom, leur texte est un résumé de mémoire **à vérifier dans le livre**.

`modules/feats/helpers.js` (chargé en premier) fournit `DND.feat` : `ability()` pour le +1 de caractéristique,
`requires()` pour les prérequis (niveau, valeur 13, capacité Sorts, formation aux armures), `wearing()`, `spellOptions()`, `profOrExpertise()`.

Limites connues :
- Formation aux armures (prérequis) : vue via les maîtrises de classe et les dons Protection légère/intermédiaire/lourde seulement.
- Résilient : la fiche ne bloque pas une caractéristique dont le JS est déjà maîtrisé.
- Esprit affûté / Observateur : le joueur choisit « maîtrise » ou « expertise (déjà maîtrisée) ».
- Les styles de combat ne sont proposés que par l'aptitude Style de combat (Guerrier, Paladin… à venir) ; Défense (+1 CA en armure) et Archerie (+2 attaque à distance) sont calculés.
- Détection des pensées (Télépathe) est ajouté au catalogue des sorts par le module du don.

### Dons d'origine
| Don | Ce que la fiche calcule |
|---|---|
| Vigilant (Alert) | +bonus de maîtrise à l'initiative |
| Initié à la magie (Magic Initiate) | 2 tours de magie + 1 sort de niv. 1 avec lancer gratuit, liste et caractéristique au choix |
| Sauvagerie martiale (Savage Attacker) | Texte |
| Doué (Skilled) | 3 maîtrises de compétences ou d'outils |
| Façonneur (Crafter) | 3 outils d'artisan de la table Fabrication rapide, reste en texte |
| Guérisseur (Healer) | Texte |
| Chanceux (Lucky) | Points de chance = bonus de maîtrise, repos long |
| Musicien (Musician) | 3 instruments de musique, reste en texte |
| Bagarreur de tavernes (Tavern Brawler) | Texte (frappe 1d4 + FOR à appliquer à la main) |
| Robuste (Tough) | +2 PV maximum par niveau |

### Dons généraux (niveau 4+)
| Don | Prérequis | Ce que la fiche calcule (le reste en texte) |
|---|---|---|
| Amélioration de caractéristique (Ability Score Improvement) | Niveau 4 | +2 / +1+1, maximum 20 |
| Adepte élémentaire (Elemental Adept) | Niveau 4, capacité Sorts ou Magie de pacte | +1 carac., type de dégâts |
| Affinité féerique (Fey-Touched) | Niveau 4 | +1 carac., sorts |
| Affinité ombreuse (Shadow-Touched) | Niveau 4 | +1 carac., sorts |
| Athlète (Athlete) | Niveau 4, Force ou Dextérité 13 | +1 carac., vitesse d'escalade |
| Broyeur (Crusher) | Niveau 4 | +1 carac. |
| Chef cuisinier (Chef) | Niveau 4 | +1 carac., maîtrises |
| Combattant monté (Mounted Combatant) | Niveau 4 | +1 carac. |
| Combattant à deux armes (Dual Wielder) | Niveau 4, Force ou Dextérité 13 | +1 carac. |
| Comédien (Actor) | Niveau 4, Charisme 13 | +1 carac. |
| Discret (Skulker) | Niveau 4, Dextérité 13 | +1 carac., sens |
| Duelliste défensif (Defensive Duelist) | Niveau 4, Dextérité 13 | +1 carac., action sur la fiche |
| Empaleur (Piercer) | Niveau 4 | +1 carac. |
| Empoigneur (Grappler) | Niveau 4, Force ou Dextérité 13 | +1 carac. |
| Empoisonneur (Poisoner) | Niveau 4 | +1 carac., maîtrises |
| Esprit affûté (Keen Mind) | Niveau 4, Intelligence 13 | +1 carac., maîtrise ou expertise |
| Expert (Skill Expert) | Niveau 4 | +1 carac., maîtrises |
| Expert de la charge (Charger) | Niveau 4, Force ou Dextérité 13 | +1 carac. |
| Figure de proue (Inspiring Leader) | Niveau 4, Sagesse ou Charisme 13 | +1 carac. |
| Formation aux armes de guerre (Martial Weapon Training) | Niveau 4 | +1 carac., maîtrises |
| Gaillard (Durable) | Niveau 4 | +1 carac., action sur la fiche |
| Incantateur d'élite (Spell Sniper) | Niveau 4, capacité Sorts ou Magie de pacte | +1 carac. |
| Mage de guerre (War Caster) | Niveau 4, capacité Sorts ou Magie de pacte | +1 carac., avantage |
| Magie rituelle (Ritual Caster) | Niveau 4, Intelligence, Sagesse ou Charisme 13 | +1 carac., sorts, ressource |
| Maître d'armes (Weapon Master) | Niveau 4 | +1 carac. |
| Maître d'hast (Polearm Master) | Niveau 4, Force ou Dextérité 13 | +1 carac., action sur la fiche |
| Maître des armes lourdes (Great Weapon Master) | Niveau 4, Force 13 | +1 carac. |
| Maître des armures intermédiaires (Medium Armor Master) | Niveau 4, formation aux armures intermédiaires | +1 carac., CA |
| Maître des armures lourdes (Heavy Armor Master) | Niveau 4, formation aux armures lourdes | +1 carac. |
| Maître des boucliers (Shield Master) | Niveau 4, formation aux boucliers | +1 carac., action sur la fiche |
| Maître-arbalétrier (Crossbow Expert) | Niveau 4, Dextérité 13 | +1 carac. |
| Mobile (Speedy) | Niveau 4, Dextérité ou Constitution 13 | +1 carac., vitesse |
| Observateur (Observant) | Niveau 4, Intelligence ou Sagesse 13 | +1 carac., maîtrise ou expertise |
| Protection intermédiaire (Moderately Armored) | Niveau 4, formation aux armures légères | +1 carac., maîtrises |
| Protection lourde (Heavily Armored) | Niveau 4, formation aux armures intermédiaires | +1 carac., maîtrises |
| Protection légère (Lightly Armored) | Niveau 4 | +1 carac., maîtrises |
| Résilient (Resilient) | Niveau 4 | +1 carac., maîtrises |
| Sentinelle (Sentinel) | Niveau 4, Force ou Dextérité 13 | +1 carac. |
| Tireur d'élite (Sharpshooter) | Niveau 4, Dextérité 13 | +1 carac. |
| Trancheur (Slasher) | Niveau 4 | +1 carac. |
| Tueur de mages (Mage Slayer) | Niveau 4 | +1 carac., ressource |
| Télékinésiste (Telekinetic) | Niveau 4 | +1 carac., sorts, action sur la fiche |
| Télépathe (Telepathic) | Niveau 4 | +1 carac., Détection des pensées gratuite |

### Dons de style de combat
| Don | Prérequis | Ce que la fiche calcule (le reste en texte) |
|---|---|---|
| Archerie (Archery) | — | attaque à distance |
| Arme de lancer (Thrown Weapon Fighting) | — | texte |
| Arme à deux mains (Great Weapon Fighting) | — | texte |
| Combat en aveugle (Blind Fighting) | — | sens |
| Combat à deux armes (Two-Weapon Fighting) | — | texte |
| Combat à mains nues (Unarmed Fighting) | — | texte |
| Duel (Dueling) | — | texte |
| Défense (Defense) | — | CA |
| Interception (Interception) | — | action sur la fiche |
| Protection (Protection) | — | action sur la fiche |

### Faveurs épiques (niveau 19+, +1 caractéristique jusqu'à 30)
| Don | Prérequis | Ce que la fiche calcule (le reste en texte) |
|---|---|---|
| Faveur d'attaque irrésistible (Boon of Irresistible Offense) | Niveau 19 | +1 carac. |
| Faveur de compétence (Boon of Skill) | Niveau 19 | +1 carac., maîtrises |
| Faveur de déplacement dimensionnel (Boon of Dimensional Travel) | Niveau 19 | +1 carac. |
| Faveur de l'esprit nocturne (Boon of the Night Spirit) | Niveau 19 | +1 carac., action sur la fiche |
| Faveur de mémoire magique (Boon of Spell Recall) | Niveau 19, capacité Sorts | +1 carac., ressource |
| Faveur de prouesse martiale (Boon of Combat Prowess) | Niveau 19 | +1 carac. |
| Faveur de récupération (Boon of Recovery) | Niveau 19 | +1 carac., ressource |
| Faveur de résistance aux énergies (Boon of Energy Resistance) | Niveau 19 | +1 carac., action sur la fiche, résistances |
| Faveur de vigueur (Boon of Fortitude) | Niveau 19 | +1 carac., PV max |
| Faveur de vision véritable (Boon of Truesight) | Niveau 19 | +1 carac., sens |
| Faveur de vitesse (Boon of Speed) | Niveau 19 | +1 carac., action sur la fiche, vitesse |
| Faveur du destin (Boon of Fate) | Niveau 19 | +1 carac., ressource |

## Termes français à vérifier sur AideDD
AideDD n'était pas accessible au début du développement. Reste à confirmer :
- Maîtrises d'armes : Enchaînement, Écorchure, Coup double, Poussée, Sape, Ralentissement, Renversement, Ouverture.
- Dons : les 75 noms sont ceux d'AideDD (Grappler = Empoigneur, pas Lutteur). Textes des faveurs épiques à vérifier dans le livre.
- Goliath : noms des six ascendances (Bond des nuages, Brûlure du feu, etc.).
- Sorts : les 106 noms du catalogue ont été vérifiés sur AideDD le 2026-10-15 (voir DEVLOG).
- Format des liens AideDD pour les sorts 2024 : confirmé, les 106 liens ouvrent la bonne page.

## Rappels en jeu et avantages contre les états
- Dons rappelés dans Actions spéciales (2026-11-26) : ceux qui ont une action/réaction déclarée, plus Comédien, Chef cuisinier, Guérisseur, Esprit affûté, Observateur, Maître des boucliers et 6 faveurs épiques via `combat`.
- Une aptitude utile en partie mais sans calcul porte `combat: "texte court"` (ou `combat: true` pour reprendre sa description) : elle apparaît en « Passif » dans Actions spéciales (onglet Combat).
- Avantage aux JS contre un état : effet `{ type: "advantage", target: "condition.<id>" }` → ★ sur l'état. Immunité : `{ type: "immunity", condition: "<id>", note }` → ◆. Ids : ceux de `DND.data.conditions` (charmed, frightened, poisoned, stunned…).
- Objet libre : le joueur l'ajoute lui-même dans la carte États (« Avantages contre un état venant d'un objet »).

## Ajouter un élément
1. Créer le fichier dans `modules/species/`, `modules/backgrounds/` ou `modules/feats/` en copiant un existant.
2. Ajouter une ligne dans `modules/manifest.js`.
