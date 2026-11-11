// Classe : Artificier (Artificer) — Eberron: Forge of the Artificer (2025), niveaux 1 à 10.
// Hors SRD et absent d'AideDD : corrigé le 2026-10-15 d'après le texte du livre fourni par Plouf (aptitudes, plans, sous-classes, canon, défenseur).
// Noms des objets magiques et des sorts : AideDD. Journal de la classe : classes/artificier.md
(function () {
  const lvl = (c) => c.classLevel("artificer");
  const int = "int";
  const DC = (c) => 8 + c.pb + c.mod.int;
  const ATK = (c) => DND.engine.signed(c.pb + c.mod.int);
  const intMin1 = (c) => Math.max(1, c.mod.int);
  // Arme spéciale de l'Armure arcanique : INT, +1 à partir du niveau 9 (Arsenal amélioré)
  const arsenal = (c) => (lvl(c) >= 9 ? 1 : 0);
  const ATK2 = (c) => DND.engine.signed(c.pb + c.mod.int + arsenal(c));
  const DMG = (c) => DND.engine.signed(c.mod.int + arsenal(c));
  const minLevel = (n) => Object.assign((c) => lvl(c) >= n || "Artificier niveau " + n, { level: n });
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  // Sorts de sous-classe toujours préparés aux niveaux 3, 5, 9, 13 et 17
  const subSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: int, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");
  const spellFeature = (id, fr, en, table) => ({ level: 3, id: id + "-spells", name: { fr, en },
    description: "Sorts toujours préparés : " + spellNames(table) + ".", effects: subSpells(table) });
  const toolFeature = (id, tools, extra) => ({ level: 3, id: id + "-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
    description: "Maîtrise : " + tools.map((t) => DND.data.tools[t].fr).join(", ") + "." + (extra || ""),
    effects: tools.map((t) => ({ type: "proficiency", target: "tool." + t })) });

  // Objets de Magie de bricoleur (Forge of the Artificer p. 8, texte fourni par Plouf)
  const TINKER_ITEMS = ["billes", "panier", "sac de couchage", "clochette", "couverture", "palan", "bouteille en verre", "seau",
    "chausse-trappes", "bougie", "pied-de-biche", "flasque", "grappin", "piège à mâchoires", "cruche", "lampe", "menottes", "filet",
    "huile", "papier", "parchemin", "perche", "bourse", "corde", "sac", "pelle", "pointes en fer", "ficelle", "boîte à amadou",
    "torche", "fiole"].join(", ");

  // --- Plans de Réplication d'objet magique (niveau d'artificier minimum) ---
  // Tables de Forge of the Artificer (texte fourni par Plouf le 2026-10-15). Noms anglais exacts ;
  // les noms français de la 4e colonne viennent d'AideDD quand ils sont connus (lien), sinon traduction provisoire (pas de lien).
  // [id, nom FR, nom EN, harmonisation, lien AideDD ?]
  const PLANS = {
    2: [["alchemy-jug", "Cruche alchimique", "Alchemy Jug", false, true], ["bag-of-holding", "Sac sans fond", "Bag of Holding", false, true],
      ["cap-of-water-breathing", "Capuchon de respiration aquatique", "Cap of Water Breathing", false, true],
      ["common-item-1", "Objet magique commun au choix (1)", "Common magic item", null], ["common-item-2", "Objet magique commun au choix (2)", "Common magic item", null],
      ["goggles-of-night", "Lunettes de nuit", "Goggles of Night", false, true], ["manifold-tool", "Outil polyvalent", "Manifold Tool", true],
      ["repeating-shot", "Tir à répétition", "Repeating Shot", true], ["returning-weapon", "Arme de retour", "Returning Weapon", false],
      ["rope-of-climbing", "Corde d'escalade", "Rope of Climbing", false, true], ["sending-stones", "Pierres messagères", "Sending Stones", false, true],
      ["shield-1", "Bouclier +1", "Shield +1", false], ["wand-of-magic-detection", "Baguette de détection de la magie", "Wand of Magic Detection", false, true],
      ["wand-of-secrets", "Baguette des secrets", "Wand of Secrets", false, true], ["wand-of-the-war-mage-1", "Baguette du mage de guerre +1", "Wand of the War Mage +1", true],
      ["weapon-1", "Arme +1", "Weapon +1", false], ["wraps-of-unarmed-power-1", "Bandelettes de puissance à mains nues +1", "Wraps of Unarmed Power +1", false]],
    6: [["armor-1", "Armure +1", "Armor +1", false], ["boots-of-elvenkind", "Bottes elfiques", "Boots of Elvenkind", false, true],
      ["boots-of-the-winding-path", "Bottes du chemin sinueux", "Boots of the Winding Path", true],
      ["cloak-of-elvenkind", "Cape elfique", "Cloak of Elvenkind", true, true], ["cloak-of-the-manta-ray", "Cape de la raie manta", "Cloak of the Manta Ray", true, true],
      ["dazzling-weapon", "Arme éblouissante", "Dazzling Weapon", true], ["eyes-of-charming", "Yeux charmeurs", "Eyes of Charming", true],
      ["eyes-of-minute-seeing", "Yeux de vision minutieuse", "Eyes of Minute Seeing", false], ["gloves-of-thievery", "Gants de chapardeur", "Gloves of Thievery", false, true],
      ["helm-of-awareness", "Heaume de vigilance", "Helm of Awareness", false], ["lantern-of-revealing", "Lanterne de révélation", "Lantern of Revealing", false, true],
      ["mind-sharpener", "Affûte-esprit", "Mind Sharpener", true], ["necklace-of-adaptation", "Collier d'adaptation", "Necklace of Adaptation", true, true],
      ["pipes-of-haunting", "Flûte terrifiante", "Pipes of Haunting", false], ["repulsion-shield", "Bouclier de répulsion", "Repulsion Shield", false],
      ["ring-of-swimming", "Anneau de nage", "Ring of Swimming", false, true], ["ring-of-water-walking", "Anneau de marche sur l'eau", "Ring of Water Walking", false, true],
      ["sentinel-shield", "Bouclier sentinelle", "Sentinel Shield", false], ["spell-refueling-ring", "Anneau de recharge de sorts", "Spell-Refueling Ring", true],
      ["wand-of-magic-missiles", "Baguette de projectiles magiques", "Wand of Magic Missiles", false, true], ["wand-of-web", "Baguette de toile d'araignée", "Wand of Web", true],
      ["weapon-of-warning", "Arme d'alerte", "Weapon of Warning", true]],
    10: [["armor-of-resistance", "Armure de résistance", "Armor of Resistance", true], ["dagger-of-venom", "Dague venimeuse", "Dagger of Venom", false],
      ["elven-chain", "Cotte de mailles elfique", "Elven Chain", false], ["ring-of-feather-falling", "Anneau de feuille morte", "Ring of Feather Falling", true, true],
      ["ring-of-jumping", "Anneau de saut", "Ring of Jumping", true, true], ["ring-of-mind-shielding", "Anneau de barrière mentale", "Ring of Mind Shielding", true, true],
      ["shield-2", "Bouclier +2", "Shield +2", false], ["uncommon-wondrous-1", "Objet merveilleux peu courant au choix (1)", "Uncommon Wondrous Item", null],
      ["uncommon-wondrous-2", "Objet merveilleux peu courant au choix (2)", "Uncommon Wondrous Item", null],
      ["wand-of-the-war-mage-2", "Baguette du mage de guerre +2", "Wand of the War Mage +2", true], ["weapon-2", "Arme +2", "Weapon +2", false],
      ["wraps-of-unarmed-power-2", "Bandelettes de puissance à mains nues +2", "Wraps of Unarmed Power +2", false]],
    14: [["armor-2", "Armure +2", "Armor +2", false], ["arrow-catching-shield", "Bouclier attrape-flèches", "Arrow-Catching Shield", true],
      ["flame-tongue", "Langue de feu", "Flame Tongue", true], ["rare-wondrous-1", "Objet merveilleux rare au choix (1)", "Rare Wondrous Item", null],
      ["ring-of-free-action", "Anneau d'action libre", "Ring of Free Action", true], ["ring-of-protection", "Anneau de protection", "Ring of Protection", true, true],
      ["ring-of-the-ram", "Anneau du bélier", "Ring of the Ram", true]],
  };
  const attuneText = (a) => (a === true ? " Harmonisation requise." : a === false ? " Sans harmonisation." : " Harmonisation selon l'objet ; notez l'objet choisi dans l'Inventaire (chaque objet différent compte comme un plan).");
  registerList("artificer-plans", [].concat(...Object.entries(PLANS).map(([level, items]) => items.map(([id, fr, en, attune, link]) => ({
    id, name: { fr, en }, prerequisite: minLevel(Number(level)),
    description: "Plan d'objet magique (artificier niveau " + level + ")." + attuneText(attune) +
      (link ? " Fiche complète : aidedd.org/magic-item/fr/" + DND.slug(fr) + "." : " Description dans le Guide du maître."),
  })))));

  registerModule({
    kind: "class", id: "artificer",
    name: { fr: "Artificier", en: "Artificer" },
    color: "#b8622e", // couleur d'accent de la fiche (modifiable dans Options)
    source: "Forge of the Artificer",
    hitDie: 8,
    savingThrows: ["con", "int"],
    subclassLevel: 3,
    multiclassRequirement: [["int"]],
    proficiencies: { armor: ["light", "medium", "shield"], weapons: ["simple"], tools: ["thieves-tools", "tinkers-tools"],
      skills: { choose: 2, from: ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight-of-hand"] } },
    multiclassProficiencies: { armor: ["light", "medium", "shield"], tools: ["tinkers-tools"],
      skills: { choose: 1, from: ["arcana", "history", "investigation", "medicine", "nature", "perception", "sleight-of-hand"] } },
    // Demi-lanceur arrondi au supérieur : emplacements dès le niveau 1
    spellcasting: {
      progression: "half", rounding: "up", ability: int, list: "artificer",
      cantrips: { 1: 2, 10: 3, 14: 4 },
      prepared: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 7: 7, 9: 9, 11: 10, 13: 11, 15: 12, 17: 14, 19: 15 },
    },
    features: [
      { level: 1, id: "artisan-tool", name: { fr: "Maîtrise d'outils", en: "Tool Proficiency" },
        description: "Outils de voleur, outils de bricoleur et un type d'outils d'artisan de votre choix. En multiclasse (Artificier pris en second), seulement les outils de bricoleur : ne choisissez pas d'outils d'artisan.",
        effects: [{ type: "choice", id: "artisanTool", label: "Outils d'artisan", from: "tools.artisan", optional: true,
          help: "Un type d'outils d'artisan si l'Artificier est votre première classe ; rien en multiclasse." }] },
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur l'Intelligence. Outils requis : vous devez tenir des outils de voleur, de bricoleur ou d'artisan que vous maîtrisez, qui servent de focaliseur (vos sorts d'artificier ont donc toujours une composante M). Tours de magie : deux au niveau 1 (Aspersion d'acide et Prestidigitation recommandés), un de plus aux niveaux 10 et 14 ; après un repos long, vous pouvez en remplacer un. Sorts préparés : deux de niveau 1 au départ (Soins et Graisse recommandés), selon la table ensuite ; après un repos long, vous pouvez changer la liste. Emplacements récupérés au repos long." },
      { level: 1, id: "tinkers-magic", name: { fr: "Magie de bricoleur", en: "Tinker's Magic" },
        description: "Vous connaissez le tour de magie Réparation. Action Magie en tenant des outils de bricoleur : créez un objet dans un espace inoccupé à 1,5 m, parmi : " + TINKER_ITEMS + ". L'objet disparaît à la fin de votre prochain repos long. Utilisations égales à votre modificateur d'Intelligence (minimum 1), récupérées au repos long.",
        effects: [
          { type: "spell", spell: "mending", ability: int },
          { type: "resource", id: "tinkersMagic", name: { fr: "Magie de bricoleur", en: "Tinker's Magic" }, max: intMin1, recharge: "long",
            description: "Créer un objet d'équipement courant." },
          { type: "action", name: { fr: "Magie de bricoleur", en: "Tinker's Magic" }, actionType: "action", resource: "tinkersMagic",
            description: "En tenant des outils de bricoleur : créez un objet de la liste à 1,5 m (corde, torche, sac, pied-de-biche…), jusqu'au prochain repos long." },
        ] },
      { level: 2, id: "replicate-magic-item", name: { fr: "Réplication d'objet magique", en: "Replicate Magic Item" },
        description: (c) => "Plans connus : 4 au niveau 2 (Sac sans fond, Capuchon de respiration aquatique, Pierres messagères et Baguette du mage de guerre +1 recommandés), puis selon la table ; à chaque niveau d'artificier, vous pouvez en remplacer un. Création : à la fin d'un repos long, outils de bricoleur en main, vous créez un ou deux objets magiques différents d'après vos plans (harmonisation immédiate possible). Au maximum " +
          DND.byLevel({ 2: 2, 6: 3, 10: 4, 14: 5, 18: 6 }, lvl(c)) + " objets en même temps : au-delà, le plus ancien disparaît. Si vous remplacez un plan, ses objets disparaissent ; à votre mort, ils disparaissent après 1d4 jours (le contenu d'un contenant réapparaît autour). Une baguette ou une arme créée ainsi peut servir de focaliseur.",
        effects: [
          { type: "choice", id: "plans", label: "Plans connus", from: "list:artificer-plans", count: { 2: 4, 6: 5, 10: 6, 14: 7, 18: 8 }, showChosen: true,
            help: "Les objets fabriqués s'ajoutent dans l'Inventaire (bonus magique sur l'arme ou le bouclier)." },
          { type: "note", text: (c) => "Réplication : " + DND.byLevel({ 2: 2, 6: 3, 10: 4, 14: 5, 18: 6 }, lvl(c)) + " objets répliqués au maximum en même temps." },
        ] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe d'artificier", en: "Artificer Subclass" },
        description: "Choisissez votre spécialité dans la partie Création." },
      asi(4),
      { level: 6, id: "magic-item-tinker", name: { fr: "Bricolage d'objet magique", en: "Magic Item Tinker" },
        description: "Recharger : action bonus, touchez un objet répliqué à charges à 1,5 m et dépensez un emplacement : il récupère autant de charges que le niveau de l'emplacement. Vider : action bonus, un objet répliqué à 1,5 m disparaît et devient un emplacement de sort de niveau 1 (objet commun) ou 2 (peu courant ou rare), perdu au prochain repos long ; une fois par repos long. Transmuter : action Magie, changez un objet répliqué à 1,5 m en un autre de vos plans ; une fois par repos long.",
        effects: [
          { type: "resource", id: "drainMagicItem", name: { fr: "Vider un objet magique", en: "Drain Magic Item" }, max: 1, recharge: "long",
            description: "Un objet répliqué disparaît : emplacement de niveau 1 (commun) ou 2 (peu courant, rare) jusqu'au repos long." },
          { type: "extraSlots", maxLevel: 2 },
          { type: "resource", id: "transmuteMagicItem", name: { fr: "Transmuter un objet magique", en: "Transmute Magic Item" }, max: 1, recharge: "long",
            description: "Changez un objet répliqué en un autre de vos plans." },
        ] },
      { level: 7, id: "flash-of-genius", name: { fr: "Éclair de génie", en: "Flash of Genius" },
        description: "Réaction, quand vous ou une créature visible à 9 m ratez un test de caractéristique ou un JS : ajoutez votre modificateur d'Intelligence (minimum +1) au jet. Utilisations égales au modificateur d'Intelligence (minimum 1), récupérées au repos long.",
        effects: [
          { type: "resource", id: "flashOfGenius", name: { fr: "Éclair de génie", en: "Flash of Genius" }, max: intMin1, recharge: "long",
            description: "+Intelligence à un test ou un JS." },
          { type: "action", name: { fr: "Éclair de génie", en: "Flash of Genius" }, actionType: "reaction", resource: "flashOfGenius",
            description: (c) => "Vous ou une créature visible à 9 m : +" + intMin1(c) + " à un test de caractéristique ou un JS raté." },
        ] },
      asi(8),
      { level: 10, id: "magic-item-adept", name: { fr: "Adepte des objets magiques", en: "Magic Item Adept" },
        description: "Vous pouvez vous harmoniser avec quatre objets magiques en même temps.",
        effects: [{ type: "bonus", target: "attunement", value: 1, label: "Adepte des objets magiques" }] },
      { level: 11, id: "spell-storing-item", name: { fr: "Objet de stockage de sort", en: "Spell-Storing Item" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "alchemist", name: { fr: "Alchimiste", en: "Alchemist" },
        features: [
          { level: 3, id: "alchemist-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
            description: "Maîtrise du matériel d'alchimiste et du matériel d'herboriste. Si vous maîtrisiez déjà l'un d'eux (ou les deux), un autre type d'outils d'artisan au choix (ou deux). Fabriquer une potion selon les règles du Guide du maître prend deux fois moins de temps.",
            effects: [
              { type: "proficiency", target: "tool.alchemists-supplies" }, { type: "proficiency", target: "tool.herbalism-kit" },
              { type: "choice", id: "extraTools", label: "Outils d'artisan de remplacement", from: "tools.artisan", count: 2, optional: true,
                help: "Seulement si vous maîtrisiez déjà le matériel d'alchimiste ou d'herboriste : un outil par maîtrise en double." },
            ] },
          spellFeature("alchemist", "Sorts d'alchimiste", "Alchemist Spells",
            { 3: ["healing-word", "ray-of-sickness"], 5: ["flaming-sphere", "acid-arrow"], 9: ["gaseous-form", "mass-healing-word"], 13: ["death-ward", "vitriolic-sphere"], 17: ["cloudkill", "raise-dead"] }),
          { level: 3, id: "experimental-elixir", name: { fr: "Élixir expérimental", en: "Experimental Elixir" },
            description: (c) => {
              const l = lvl(c), t = (a, b, d) => (l >= 15 ? d : l >= 9 ? b : a);
              return "À la fin d'un repos long, matériel d'alchimiste en main, vous produisez " + DND.byLevel({ 3: 2, 5: 3, 9: 4, 15: 5 }, l) +
                " élixirs ; lancez 1d6 pour l'effet de chacun. Action Magie : dépensez un emplacement de sort pour un élixir de plus, dont vous choisissez l'effet. Boire ou faire boire (créature à 1,5 m) : action bonus. Les élixirs restants disparaissent au repos long suivant. " +
                "1 Soins : " + t("2d8", "3d8", "4d8") + " " + DND.engine.signed(c.mod.int) + " PV. 2 Rapidité : +" + t("3", "4,5", "6") + " m de Vitesse pendant 1 heure. " +
                "3 Résilience : +1 CA pendant " + t("10 minutes", "1 heure", "8 heures") + ". 4 Audace : +1d4 aux jets d'attaque et de sauvegarde pendant " + t("1 minute", "10 minutes", "1 heure") + ". " +
                "5 Vol : vitesse de vol " + t("3", "6", "9") + " m pendant 10 minutes. 6 : choisissez un des autres effets.";
            },
            effects: [
              { type: "resource", id: "elixirs", name: { fr: "Élixirs gratuits", en: "Experimental Elixirs" }, max: { 3: 2, 5: 3, 9: 4, 15: 5 }, recharge: "long",
                description: "Produits à la fin d'un repos long (1d6 pour l'effet) ; d'autres avec un emplacement (effet au choix)." },
              { type: "action", name: { fr: "Élixir supplémentaire", en: "Create Elixir" }, actionType: "action",
                description: "Matériel d'alchimiste en main : dépensez un emplacement de sort, créez un élixir à l'effet choisi." },
              { type: "action", name: { fr: "Boire un élixir", en: "Drink Elixir" }, actionType: "bonus",
                description: "Boire un élixir ou le faire boire à une créature à 1,5 m." },
              { type: "note", text: (c) => "Élixir de soins : " + (lvl(c) >= 15 ? "4d8" : lvl(c) >= 9 ? "3d8" : "2d8") + " " + DND.engine.signed(c.mod.int) + " PV." },
            ] },
          { level: 5, id: "alchemical-savant", combat: true, name: { fr: "Savant alchimiste", en: "Alchemical Savant" },
            description: "Quand vous lancez un sort avec le matériel d'alchimiste comme focaliseur, ajoutez votre modificateur d'Intelligence (minimum +1) à un jet du sort : un jet de soins, ou de dégâts d'acide, de feu ou de poison.",
            effects: [{ type: "note", text: (c) => "Savant alchimiste : +" + intMin1(c) + " à un jet de soins ou de dégâts d'acide, de feu ou de poison (focaliseur : matériel d'alchimiste)." }] },
          { level: 9, id: "restorative-reagents", name: { fr: "Réactifs reconstituants", en: "Restorative Reagents" },
            description: "Vous pouvez lancer Restauration partielle sans emplacement et sans la préparer, avec le matériel d'alchimiste comme focaliseur, un nombre de fois égal à votre modificateur d'Intelligence (minimum 1) ; utilisations récupérées au repos long.",
            effects: [{ type: "spell", spell: "lesser-restoration", ability: int, freeCast: { max: intMin1, recharge: "long" } }] },
          { level: 15, id: "chemical-mastery", name: { fr: "Maîtrise chimique", en: "Chemical Mastery" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "armorer", name: { fr: "Armurier", en: "Armorer" },
        features: [
          { level: 3, id: "armorer-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
            description: "Formation aux armures lourdes. Maîtrise des outils de forgeron (si vous l'aviez déjà : un autre type d'outils d'artisan au choix). Fabriquer une armure, magique ou non, prend deux fois moins de temps.",
            effects: [
              { type: "proficiency", target: "armor.heavy" }, { type: "proficiency", target: "tool.smiths-tools" },
              { type: "choice", id: "extraTools", label: "Outils d'artisan de remplacement", from: "tools.artisan", optional: true,
                help: "Seulement si vous maîtrisiez déjà les outils de forgeron." },
            ] },
          spellFeature("armorer", "Sorts d'armurier", "Armorer Spells",
            { 3: ["magic-missile", "thunderwave"], 5: ["mirror-image", "shatter"], 9: ["hypnotic-pattern", "lightning-bolt"], 13: ["fire-shield", "greater-invisibility"], 17: ["passwall", "wall-of-force"] }),
          { level: 3, id: "arcane-armor", name: { fr: "Armure arcanique", en: "Arcane Armor" },
            description: "Action Magie, outils de forgeron en main : l'armure que vous portez devient une Armure arcanique, jusqu'à ce que vous en enfiliez une autre ou mouriez. Elle ignore la Force minimale, vous l'enfilez ou l'ôtez avec l'action Utiliser, elle ne peut pas vous être retirée contre votre gré et sert de focaliseur pour vos sorts d'artificier." },
          { level: 3, id: "armor-model", combat: true, name: { fr: "Modèle d'armure", en: "Armor Model" },
            description: "Choisissez le modèle de votre Armure arcanique : Cuirassé, Gardien ou Infiltrateur (modifiable à la fin d'un repos court ou long, outils de forgeron en main). L'arme spéciale du modèle utilise votre Intelligence pour l'attaque et les dégâts.",
            effects: [{ type: "choice", id: "model", label: "Modèle d'armure", from: [
              { id: "guardian", name: { fr: "Gardien", en: "Guardian" }, description: "Impulsion de tonnerre (1d8 tonnerre) et Champ défensif.",
                effects: [
                  { type: "action", name: { fr: "Impulsion de tonnerre", en: "Thunder Pulse" }, actionType: "action",
                    description: (c) => "Arme de corps à corps courante : " + ATK2(c) + " pour toucher, 1d8 " + DMG(c) + " tonnerre ; la cible a le Désavantage aux jets d'attaque contre d'autres que vous jusqu'au début de votre prochain tour." },
                  { type: "action", name: { fr: "Champ défensif", en: "Defensive Field" }, actionType: "bonus",
                    description: (c) => "Quand vous êtes Ensanglanté : gagnez " + lvl(c) + " PV temporaires (perdus si vous ôtez l'armure)." },
                ] },
              { id: "infiltrator", name: { fr: "Infiltrateur", en: "Infiltrator" }, description: "Lance-foudre (1d6 foudre), +1,5 m de Vitesse, Avantage en Discrétion.",
                effects: [
                  { type: "action", name: { fr: "Lance-foudre", en: "Lightning Launcher" }, actionType: "action",
                    description: (c) => "Arme à distance courante (27/90 m) : " + ATK2(c) + " pour toucher, 1d6 " + DMG(c) + " foudre ; une fois par tour, +1d6 foudre à une cible touchée." },
                  { type: "bonus", target: "speed", value: 5, label: "Pas propulsés" },
                  { type: "advantage", target: "skill.stealth", note: "Champ d'atténuation (annule le Désavantage de l'armure)" },
                ] },
              { id: "dreadnaught", name: { fr: "Cuirassé", en: "Dreadnaught" }, description: "Démolisseur de force (1d10 force, allonge) et Stature de géant.",
                effects: [
                  { type: "action", name: { fr: "Démolisseur de force", en: "Force Demolisher" }, actionType: "action",
                    description: (c) => "Arme de corps à corps courante avec allonge : " + ATK2(c) + " pour toucher, 1d10 " + DMG(c) + " force ; une créature touchée d'au moins une taille de moins que vous peut être poussée ou tirée de 3 m." },
                  { type: "resource", id: "giantStature", name: { fr: "Stature de géant", en: "Giant Stature" }, max: intMin1, recharge: "long",
                    description: "Action bonus : allonge +1,5 m et taille G pendant 1 minute." },
                  { type: "action", name: { fr: "Stature de géant", en: "Giant Stature" }, actionType: "bonus", resource: "giantStature",
                    description: "Pendant 1 minute : allonge augmentée de 1,5 m et, si vous êtes plus petit, taille G avec votre équipement (si l'espace le permet)." },
                ] },
            ] }] },
          { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
            description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
            effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
          { level: 9, id: "armor-modifications", name: { fr: "Armurier amélioré", en: "Improved Armorer" },
            description: "Réplication d'armure : un plan supplémentaire, de la catégorie Armure (remplaçable seulement par un autre plan d'armure), et un objet de plus avec Réplication d'objet magique, lui aussi une armure. Arsenal amélioré : +1 aux jets d'attaque et de dégâts avec l'arme spéciale de votre modèle (calculé).",
            effects: [{ type: "note", text: "Armurier amélioré : 1 plan d'armure et 1 objet répliqué (armure) en plus." }] },
          { level: 15, id: "perfected-armor", name: { fr: "Armure parfaite", en: "Perfected Armor" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "artillerist", name: { fr: "Artilleur", en: "Artillerist" },
        features: [
          { level: 3, id: "artillerist-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
            description: "Maîtrise des armes de guerre à distance et des outils de sculpteur sur bois (si vous l'aviez déjà : un autre type d'outils d'artisan au choix). Fabriquer une baguette magique prend deux fois moins de temps.",
            effects: [
              { type: "proficiency", target: "tool.woodcarvers-tools" },
              ...Object.values(DND.data.weapons).filter((w) => w.category === "martial" && w.type === "ranged").map((w) => ({ type: "proficiency", target: "weapon." + w.id })),
              { type: "choice", id: "extraTools", label: "Outils d'artisan de remplacement", from: "tools.artisan", optional: true,
                help: "Seulement si vous maîtrisiez déjà les outils de sculpteur sur bois." },
            ] },
          spellFeature("artillerist", "Sorts d'artilleur", "Artillerist Spells",
            { 3: ["shield", "thunderwave"], 5: ["scorching-ray", "shatter"], 9: ["fireball", "wind-wall"], 13: ["ice-storm", "wall-of-fire"], 17: ["cone-of-cold", "wall-of-force"] }),
          { level: 3, id: "eldritch-cannon", name: { fr: "Canon occulte", en: "Eldritch Cannon" },
            description: "Action Magie, outils de forgeron ou de sculpteur sur bois en main : créez un canon occulte de taille P ou TP sur une surface horizontale à 1,5 m (porté ou sur pieds ou roues). Il disparaît à 0 PV ou après 1 heure ; vous pouvez le congédier par une action Magie. Une création gratuite par repos long, ensuite en dépensant un emplacement de sort ; un seul canon à la fois. Objet de taille TP ou P : CA 18, PV égaux à 5 × votre niveau d'artificier, immunité aux dégâts de poison et psychiques ; lancer Réparation sur lui rend 2d6 PV. Action bonus (à 18 m ou moins) pour l'activer, et vous pouvez le déplacer de 4,5 m avant ou après.",
            effects: [
              { type: "resource", id: "eldritchCannon", name: { fr: "Canon occulte", en: "Eldritch Cannon" }, max: 1, recharge: "long",
                description: (c) => "Création gratuite (sinon un emplacement). CA 18, " + 5 * lvl(c) + " PV, immunité poison et psychique." },
              { type: "action", name: { fr: "Canon : Lance-flammes", en: "Flamethrower" }, actionType: "bonus",
                description: (c) => "Cône de 4,5 m : JS de Dextérité DD " + DC(c) + ", " + (lvl(c) >= 9 ? 3 : 2) + "d8 feu (moitié si réussi) ; enflamme les objets inflammables non portés." },
              { type: "action", name: { fr: "Canon : Baliste de force", en: "Force Ballista" }, actionType: "bonus",
                description: (c) => "Attaque de sort à distance depuis le canon (36 m) " + ATK(c) + ", " + (lvl(c) >= 9 ? 3 : 2) + "d8 force ; une créature touchée est repoussée de 1,5 m." },
              { type: "action", name: { fr: "Canon : Protecteur", en: "Protector" }, actionType: "bonus",
                description: (c) => "Le canon et les créatures choisies à 3 m de lui gagnent " + (lvl(c) >= 9 ? 2 : 1) + "d8 " + DND.engine.signed(intMin1(c)) + " PV temporaires." },
            ] },
          { level: 5, id: "arcane-firearm", combat: true, name: { fr: "Arme à feu arcanique", en: "Arcane Firearm" },
            description: "À la fin d'un repos long, avec des outils de sculpteur sur bois, vous gravez des sceaux sur un sceptre, un bâton, une baguette ou une arme de guerre à distance : c'est votre arme à feu arcanique (jusqu'à ce que vous en graviez une autre). Elle sert de focaliseur ; quand vous lancez un sort d'artificier par elle, lancez 1d8 et ajoutez le résultat à un jet de dégâts du sort.",
            effects: [{ type: "note", text: "Arme à feu arcanique : +1d8 à un jet de dégâts d'un sort d'artificier lancé par elle." }] },
          { level: 9, id: "explosive-cannon", name: { fr: "Canon explosif", en: "Explosive Cannon" },
            description: (c) => "Puissance de feu : les jets de dégâts du canon et les PV temporaires de Protecteur augmentent de 1d8. Détonation : quand le canon subit des dégâts et que vous êtes à 18 m ou moins, réaction pour le faire exploser ; chaque créature à 6 m fait un JS de Dextérité DD " + DC(c) + ", 3d10 force (moitié si réussi).",
            effects: [{ type: "action", name: { fr: "Canon : Détonation", en: "Detonate" }, actionType: "reaction",
              description: (c) => "Quand le canon subit des dégâts (vous à 18 m ou moins) : il explose, créatures à 6 m, JS de Dextérité DD " + DC(c) + ", 3d10 force (moitié si réussi)." }] },
        ],
      },
      {
        id: "battle-smith", name: { fr: "Forgeron de guerre", en: "Battle Smith" },
        features: [
          { level: 3, id: "battle-smith-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
            description: "Maîtrise des outils de forgeron (si vous l'aviez déjà : un autre type d'outils d'artisan au choix). Fabriquer une arme, magique ou non, prend deux fois moins de temps.",
            effects: [
              { type: "proficiency", target: "tool.smiths-tools" },
              { type: "choice", id: "extraTools", label: "Outils d'artisan de remplacement", from: "tools.artisan", optional: true,
                help: "Seulement si vous maîtrisiez déjà les outils de forgeron." },
            ] },
          spellFeature("battle-smith", "Sorts de forgeron de guerre", "Battle Smith Spells",
            { 3: ["heroism", "shield"], 5: ["shining-smite", "warding-bond"], 9: ["aura-of-vitality", "conjure-barrage"], 13: ["aura-of-purity", "fire-shield"], 17: ["banishing-smite", "mass-cure-wounds"] }),
          { level: 3, id: "battle-ready", combat: true, name: { fr: "Prêt au combat", en: "Battle Ready" },
            description: "Renforcement arcanique : quand vous attaquez avec une arme magique, vous pouvez utiliser l'Intelligence pour l'attaque et les dégâts (cochez la colonne « INT » de l'arme dans l'Inventaire, seulement pour une arme magique). Connaissance des armes : maîtrise des armes de guerre ; une arme que vous maîtrisez peut servir de focaliseur pour vos sorts d'artificier.",
            effects: [{ type: "proficiency", target: "weapon.martial" },
              { type: "weaponBond", ability: int, label: "Prêt au combat : arme magique à l'Intelligence", column: "INT" }] },
          { level: 3, id: "steel-defender", name: { fr: "Défenseur d'acier", en: "Steel Defender" },
            description: "Un compagnon amical qui vous obéit et disparaît si vous mourez. En combat, il agit à votre tour : il se déplace et utilise sa réaction seul, mais ne prend que l'action Esquiver sauf si vous dépensez une action bonus pour lui ordonner une action (si vous êtes Neutralisé, il agit librement). S'il est mort depuis moins d'une heure : action Magie, touchez-le et dépensez un emplacement, il revient après 1 minute avec tous ses PV. À la fin d'un repos long, outils de forgeron en main, vous pouvez créer un nouveau défenseur (l'ancien disparaît).",
            effects: [
              { type: "companion", id: "steel-defender", name: { fr: "Défenseur d'acier", en: "Steel Defender" },
                forms: [{ id: "steel-defender", name: { fr: "Défenseur d'acier", en: "Steel Defender" },
                  ac: (c) => 12 + c.mod.int, hp: (c) => 5 + 5 * lvl(c), speed: "12 m",
                  traits: (c) => {
                    const sg = DND.engine.signed;
                    return [
                      "Caractéristiques : FOR 14 (+2), DEX 12 (+1), CON 14 (+2), INT 4 (−3), SAG 10 (+0), CHA 6 (−2)",
                      "Type : créature artificielle de taille M ; " + lvl(c) + " dés de vie (d8)",
                      "Lien d'acier : " + sg(c.pb) + " à ses tests et jets de sauvegarde (votre bonus de maîtrise)",
                      "Déchirure renforcée : " + ATK(c) + " au toucher, allonge 1,5 m, 1d8 " + sg(c.mod.int) + " force",
                      "Réparation (3/jour) : lui-même, une créature artificielle ou un objet à 1,5 m récupère 2d8 " + sg(c.mod.int) + " PV",
                      "Détourner l'attaque (réaction) : une créature à 1,5 m de lui attaque quelqu'un d'autre ; Désavantage à ce jet",
                      "Immunités : poison ; Charmé, Empoisonné, Épuisement",
                      "Sens : vision dans le noir 18 m, Perception passive 10 ; comprend vos langues",
                    ];
                  },
                  url: "https://5e.tools/bestiary.html#steel%20defender_efa" }],
                description: "CA, PV et attaques se calculent avec votre Intelligence et votre niveau." },
              { type: "resource", id: "defenderRepair", companion: "steel-defender", name: { fr: "Réparation", en: "Repair" }, max: 3, recharge: "long",
                description: (c) => "Le défenseur rend 2d8 " + DND.engine.signed(c.mod.int) + " PV à lui-même, une créature artificielle ou un objet à 1,5 m." },
              { type: "resource", id: "defenderHitDice", companion: "steel-defender", name: { fr: "Dés de vie (d8)", en: "Hit Dice" }, max: (c) => lvl(c), recharge: "long",
                description: "Pendant un repos court, le défenseur peut dépenser des dés de vie : 1d8 + 2 PV par dé (Constitution +2)." },
              { type: "action", name: { fr: "Ordre au défenseur", en: "Command Defender" }, actionType: "bonus",
                description: "Le défenseur d'acier prend une action (Déchirure renforcée, Réparation…) ; sinon il ne fait qu'Esquiver." },
            ] },
          { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
            description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour. Vous pouvez renoncer à l'une de ces attaques pour ordonner à votre défenseur d'acier d'utiliser Déchirure renforcée.",
            effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque (l'une peut devenir la Déchirure renforcée du défenseur)." }] },
          { level: 9, id: "arcane-jolt", name: { fr: "Décharge arcanique", en: "Arcane Jolt" },
            description: "Quand vous touchez avec une arme magique ou que votre défenseur d'acier touche : énergie destructrice (+2d6 force à la cible) ou énergie réparatrice (2d6 PV rendus à une créature ou un objet visible à 9 m de la cible). Une fois par tour ; utilisations égales au modificateur d'Intelligence (minimum 1), récupérées au repos long.",
            effects: [
              { type: "resource", id: "arcaneJolt", name: { fr: "Décharge arcanique", en: "Arcane Jolt" }, max: intMin1, recharge: "long",
                description: "+2d6 force ou 2d6 PV rendus (une fois par tour)." },
              { type: "action", name: { fr: "Décharge arcanique", en: "Arcane Jolt" }, actionType: "free", resource: "arcaneJolt",
                description: "Votre arme magique ou votre défenseur touche : +2d6 force, ou 2d6 PV rendus à une créature ou un objet à 9 m de la cible. Une fois par tour." },
            ] },
        ],
      },
      {
        id: "cartographer", name: { fr: "Cartographe", en: "Cartographer" },
        features: [
          { level: 3, id: "cartographer-tools", name: { fr: "Outils du métier", en: "Tools of the Trade" },
            description: "Maîtrise du matériel de calligraphe et des outils de cartographe. Si vous maîtrisiez déjà l'un d'eux (ou les deux), un autre type d'outils d'artisan au choix (ou deux). Écrire un parchemin de sort selon les règles du Manuel des joueurs prend deux fois moins de temps.",
            effects: [
              { type: "proficiency", target: "tool.calligraphers-supplies" }, { type: "proficiency", target: "tool.cartographers-tools" },
              { type: "choice", id: "extraTools", label: "Outils d'artisan de remplacement", from: "tools.artisan", count: 2, optional: true,
                help: "Seulement si vous maîtrisiez déjà le matériel de calligraphe ou les outils de cartographe : un outil par maîtrise en double." },
            ] },
          spellFeature("cartographer", "Sorts de cartographe", "Cartographer Spells",
            { 3: ["faerie-fire", "guiding-bolt", "healing-word"], 5: ["locate-object", "mind-spike"], 9: ["call-lightning", "clairvoyance"], 13: ["banishment", "locate-creature"], 17: ["scrying", "teleportation-circle"] }),
          { level: 3, id: "adventurers-atlas", name: { fr: "Atlas de l'aventurier", en: "Adventurer's Atlas" },
            description: (c) => "À la fin d'un repos long, outils de cartographe en main, vous créez des cartes magiques en touchant de 2 à " + Math.max(2, 1 + c.mod.int) + " créatures (vous compris si vous voulez). Elles durent jusqu'à votre mort ou jusqu'à ce que vous recommenciez. Chaque porteur ajoute 1d4 à ses jets d'Initiative, sait où sont les autres porteurs sur le même plan et peut les cibler avec un sort ou un effet qui exige de voir la cible, sans ligne de vue ni abri, s'ils sont à portée.",
            effects: [{ type: "note", text: "Atlas de l'aventurier : +1d4 à l'Initiative tant que vous portez une carte (à ajouter à votre jet)." }] },
          { level: 3, id: "mapping-magic", name: { fr: "Magie cartographique", en: "Mapping Magic" },
            description: "Cartographie illuminée : vous lancez Lueurs féeriques sans emplacement, un nombre de fois égal à votre modificateur d'Intelligence (minimum 1) ; utilisations récupérées au repos long. Saut de portail : à votre tour, dépensez la moitié de votre Vitesse pour vous téléporter dans un espace inoccupé visible à 3 m, ou à 1,5 m d'un porteur de carte situé à 9 m ou moins (impossible si votre Vitesse est 0).",
            effects: [
              { type: "spell", spell: "faerie-fire", ability: int, freeCast: { max: intMin1, recharge: "long" } },
              { type: "action", name: { fr: "Saut de portail", en: "Portal Jump" }, actionType: "free",
                description: "Dépensez la moitié de votre Vitesse : téléportation à 3 m dans un espace visible, ou à 1,5 m d'un porteur de carte à 9 m ou moins." },
            ] },
          { level: 5, id: "guided-precision", combat: true, name: { fr: "Précision guidée", en: "Guided Precision" },
            description: "Une fois par tour, quand vous lancez un sort de votre liste de cartographe ou touchez avec un jet d'attaque une créature affectée par vos Lueurs féeriques, ajoutez votre modificateur d'Intelligence à un jet de dégâts. Subir des dégâts ne peut pas vous faire perdre la concentration sur Lueurs féeriques.",
            effects: [{ type: "note", text: (c) => "Précision guidée : " + DND.engine.signed(c.mod.int) + " à un jet de dégâts une fois par tour (sort de cartographe ou cible de vos Lueurs féeriques)." }] },
          { level: 9, id: "ingenious-movement", name: { fr: "Mouvement ingénieux", en: "Ingenious Movement" },
            description: "Quand vous utilisez Éclair de génie, vous ou une créature consentante visible à 9 m pouvez vous téléporter jusqu'à 9 m dans un espace inoccupé visible, dans la même réaction." },
        ],
      },
    ],
  });
})();
