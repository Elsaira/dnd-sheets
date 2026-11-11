// Classe : Rôdeur (Ranger) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/rodeur), relevés le 2026-10-18.
// Vagabond féerique et profils du compagnon primitif : absents d'AideDD, saisis de mémoire, à vérifier.
// Journal de la classe : classes/rodeur.md
(function () {
  const lvl = (c) => c.classLevel("ranger");
  const wis = "wis";
  const DC = (c) => 8 + c.pb + c.mod.wis;
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const sg = (n) => DND.engine.signed(n);
  const rangerSkills = ["animal-handling", "athletics", "insight", "investigation", "nature", "perception", "stealth", "survival"];
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const armorOf = (c) => {
    const it = c.character.inventory.find((i) => i.equipped && DND.data.armor[i.id] && DND.data.armor[i.id].category !== "shield");
    return it ? DND.data.armor[it.id] : null;
  };
  const noHeavyArmor = (c) => { const a = armorOf(c); return !a || a.category !== "heavy"; };
  const subclassSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: wis, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");

  // Style de combat : un don de style de combat, ou l'option Combattant druidique
  registerList("ranger-fighting-style", [
    { id: "druidic-warrior", name: { fr: "Combattant druidique", en: "Druidic Warrior" },
      description: "Deux sorts mineurs de druide (Assistance et Poussière d'étoile recommandés), qui comptent comme sorts de rôdeur (Sagesse).",
      effects: [{ type: "choice", id: "cantrips", label: "Sorts mineurs du Combattant druidique", count: 2, from: "spells", filter: { level: 0, list: "druid" },
        grant: { type: "spell", spell: "{value}", ability: wis } }] },
  ]);

  // Compagnon primitif (Belluaire) : profils saisis de mémoire, à vérifier dans le Manuel des joueurs.
  const ATK = (c) => sg(c.pb + c.mod.wis);
  const beast = (id, fr, en, hp, speed, lines) => ({ id, name: { fr, en }, ac: (c) => 13 + c.mod.wis, hp, speed,
    traits: (c) => [
      "Caractéristiques : FOR 14 (+2), DEX 14 (+2), CON 15 (+2), INT 8 (−1), SAG 14 (+2), CHA 11 (+0)",
      "Lien primitif : ajoutez votre bonus de maîtrise (" + sg(c.pb) + ") à ses tests et jets de sauvegarde",
    ].concat(lines(c)),
    url: "https://www.aidedd.org/regles-24/classes/rodeur/" });
  const BEASTS = [
    beast("land", "Bête des terres", "Beast of the Land", (c) => 5 + 5 * lvl(c), "12 m, escalade 12 m", (c) => [
      "Frappe bestiale : " + ATK(c) + " au toucher, allonge 1,5 m, 1d8 + 2 " + sg(c.mod.wis) + " contondant, perforant ou tranchant" + (lvl(c) >= 7 ? " (ou force)" : ""),
      "Charge : après 6 m en ligne droite vers la cible, +1d6 dégâts ; JS de Force DD " + DC(c) + " ou À terre (taille G ou moins)",
      "Sens : vision dans le noir 18 m"]),
    beast("sea", "Bête des mers", "Beast of the Sea", (c) => 5 + 5 * lvl(c), "1,5 m, nage 18 m", (c) => [
      "Frappe bestiale : " + ATK(c) + " au toucher, allonge 1,5 m, 1d6 + 2 " + sg(c.mod.wis) + " contondant ou perforant" + (lvl(c) >= 7 ? " (ou force)" : "") + " ; la cible est Agrippée (évasion DD " + DC(c) + ")",
      "Amphibie : respire dans l'air et l'eau",
      "Sens : vision dans le noir 27 m"]),
    beast("sky", "Bête des cieux", "Beast of the Sky", (c) => 4 + 4 * lvl(c), "3 m, vol 18 m", (c) => [
      "Frappe bestiale : " + ATK(c) + " au toucher, allonge 1,5 m, 1d4 + 3 " + sg(c.mod.wis) + " tranchant" + (lvl(c) >= 7 ? " (ou force)" : ""),
      "Vol rasant : pas d'attaque d'opportunité quand elle quitte l'allonge d'un ennemi en volant",
      "Sens : vision dans le noir 18 m"]),
  ];

  const GLOOM = { 3: ["disguise-self"], 5: ["rope-trick"], 9: ["fear"], 13: ["greater-invisibility"], 17: ["seeming"] };
  const FEY = { 3: ["charm-person"], 5: ["misty-step"], 9: ["summon-fey"], 13: ["dimension-door"], 17: ["mislead"] };

  registerModule({
    kind: "class", id: "ranger",
    name: { fr: "Rôdeur", en: "Ranger" },
    color: "#2f6b45", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 10,
    savingThrows: ["str", "dex"],
    subclassLevel: 3,
    multiclassRequirement: [["dex", "wis"]],
    proficiencies: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"],
      skills: { choose: 3, from: rangerSkills } },
    multiclassProficiencies: { armor: ["light", "medium", "shield"], weapons: ["martial"], skills: { choose: 1, from: rangerSkills } },
    spellcasting: {
      progression: "half", rounding: "up", ability: wis, list: "ranger",
      cantrips: {},
      prepared: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 7: 7, 9: 9, 11: 10, 13: 11, 15: 12, 17: 14, 19: 15 },
    },
    features: [
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur la Sagesse, focaliseur druidique. Après chaque repos long, vous pouvez remplacer un sort préparé. Les sorts toujours préparés (Ennemi juré, sous-classe) ne comptent pas." },
      { level: 1, id: "favored-enemy", combat: true, name: { fr: "Ennemi juré", en: "Favored Enemy" },
        description: "Marque du chasseur est toujours préparé. Vous pouvez le lancer sans emplacement 2 fois (3 au niveau 5, 4 au niveau 9), utilisations récupérées au repos long.",
        effects: [{ type: "spell", spell: "hunters-mark", ability: wis, freeCast: { max: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 }, recharge: "long" } },
          { type: "note", text: "Ennemi juré : Marque du chasseur, +1d6 dégâts de force par attaque qui touche la cible marquée." }] },
      { level: 1, id: "weapon-mastery", combat: (c) => DND.masteryLines(((c.character.classes.find((x) => x.id === "ranger") || {}).choices || {}).masteries, c),
        name: { fr: "Bottes d'arme", en: "Weapon Mastery" },
        description: "Vous utilisez la botte de deux types d'armes que vous maîtrisez. Après un repos long, vous pouvez en changer.",
        effects: [{ type: "choice", id: "masteries", label: "Bottes d'arme", from: "weapons", count: 2,
          grant: { type: "proficiency", target: "mastery.{value}" },
          help: "La botte s'affiche sur l'attaque de l'arme dans l'onglet Combat." }] },
      { level: 2, id: "deft-explorer", name: { fr: "Fin explorateur", en: "Deft Explorer" },
        description: "Expertise dans une compétence que vous maîtrisez, et deux langues de votre choix (cochez-les dans Langues).",
        effects: [{ type: "choice", id: "expertise", label: "Expertise (compétences maîtrisées)", from: "skills", count: { 2: 1, 9: 3 },
          grant: { type: "proficiency", target: "{value}", expertise: true } }] },
      { level: 2, id: "fighting-style", name: { fr: "Style de combat", en: "Fighting Style" },
        description: "Un don de Style de combat, ou l'option Combattant druidique (deux sorts mineurs de druide, Sagesse).",
        effects: [{ type: "choice", id: "fightingStyle", label: "Style de combat", from: "feats+list:ranger-fighting-style", filter: { category: "fighting-style" } }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de rôdeur", en: "Ranger Subclass" },
        description: "Choisissez votre sous-classe dans la partie Création." },
      asi(4),
      { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
        description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
        effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
      { level: 6, id: "roving", name: { fr: "Arpenteur", en: "Roving" },
        description: "Votre Vitesse augmente de 3 m si vous ne portez pas d'armure lourde. Vitesses d'escalade et de nage égales à votre Vitesse. Calculé sur la fiche.",
        effects: [{ type: "bonus", target: "speed", value: 10, when: noHeavyArmor, label: "Arpenteur" },
          { type: "speed", mode: "climb", value: "walk" }, { type: "speed", mode: "swim", value: "walk" }] },
      asi(8),
      { level: 9, id: "expertise", name: { fr: "Expertise", en: "Expertise" },
        description: "Expertise dans deux autres compétences que vous maîtrisez (le choix de Fin explorateur passe à 3)." },
      { level: 10, id: "tireless", name: { fr: "Infatigable", en: "Tireless" },
        description: "Action : PV temporaires égaux à 1d8 + Sagesse (minimum 1). Utilisations égales à votre modificateur de Sagesse (minimum 1), récupérées au repos long. Après un repos court, votre niveau d'Épuisement diminue de 1.",
        effects: [
          { type: "resource", id: "tireless", name: { fr: "Infatigable", en: "Tireless" }, max: wisMin1, recharge: "long" },
          { type: "action", name: { fr: "Infatigable", en: "Tireless" }, actionType: "action", resource: "tireless",
            description: (c) => "Gagnez 1d8 " + sg(c.mod.wis) + " PV temporaires (minimum 1)." },
          { type: "note", text: "Infatigable : après un repos court, Épuisement −1 (à faire à la main dans la carte États)." },
        ] },
      { level: 13, id: "relentless-hunter", name: { fr: "Chasseur implacable", en: "Relentless Hunter" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "beast-master", name: { fr: "Belluaire", en: "Beast Master" },
        features: [
          { level: 3, id: "primal-companion", name: { fr: "Compagnon primitif", en: "Primal Companion" },
            description: "Une bête primitive amicale qui vous obéit (terres, mers ou cieux) et disparaît si vous mourez. En combat, elle agit à votre tour : elle se déplace et utilise sa réaction, mais ne prend que l'action Esquive sauf si vous prenez une action bonus pour lui ordonner une action. Vous pouvez aussi renoncer à une de vos attaques pour qu'elle fasse sa Frappe bestiale. Si vous êtes Incapable d'agir, elle agit librement. Morte depuis moins d'une heure : action Magie et un emplacement de sort, elle revient après 1 minute avec tous ses PV. Après un repos long, vous pouvez invoquer une autre bête. (Profils saisis de mémoire, à vérifier.)",
            effects: [
              { type: "companion", id: "primal-companion", name: { fr: "Compagnon primitif", en: "Primal Companion" }, forms: BEASTS,
                description: "CA, PV et attaques se calculent avec votre Sagesse et votre niveau. Profils saisis de mémoire : vérifiez dans le Manuel des joueurs." },
              { type: "action", name: { fr: "Ordre au compagnon", en: "Command Companion" }, actionType: "bonus",
                description: (c) => "Le compagnon prend une action de son profil (Frappe bestiale, etc.) ; sinon il Esquive." +
                  (lvl(c) >= 7 ? " Coordination facilitée : il peut aussi prendre Pointe, Désengagement, Esquive ou Soutien avec son action bonus." : "") },
            ] },
          { level: 7, id: "exceptional-training", name: { fr: "Coordination facilitée", en: "Exceptional Training" },
            description: "Quand vous ordonnez une action à votre compagnon par une action bonus, il peut aussi prendre Pointe, Désengagement, Esquive ou Soutien avec son action bonus. Ses attaques peuvent infliger des dégâts de force au lieu de leur type normal." },
          { level: 11, id: "bestial-fury", name: { fr: "Fureur bestiale", en: "Bestial Fury" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absent d'AideDD (« Voir le Manuel des Joueurs ») : saisi de mémoire, noms et valeurs à vérifier dans le livre.
        id: "fey-wanderer", name: { fr: "Vagabond féerique", en: "Fey Wanderer" }, source: "PHB 2024",
        features: [
          { level: 3, id: "dreadful-strikes", combat: true, name: { fr: "Frappes redoutables", en: "Dreadful Strikes" },
            description: "Une fois par tour, quand vous touchez une créature avec une arme, +1d4 dégâts psychiques (1d6 au niveau 11). (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "note", text: (c) => "Frappes redoutables : une fois par tour, +1d" + (lvl(c) >= 11 ? 6 : 4) + " dégâts psychiques en touchant avec une arme." }] },
          { level: 3, id: "fey-wanderer-spells", name: { fr: "Sorts du Vagabond féerique", en: "Fey Wanderer Spells" },
            description: "Sorts toujours préparés : " + spellNames(FEY) + ". (Saisi de mémoire, à vérifier.)",
            effects: subclassSpells(FEY) },
          { level: 3, id: "otherworldly-glamour", name: { fr: "Charme surnaturel", en: "Otherworldly Glamour" },
            description: "Vos tests de Charisme gagnent un bonus égal à votre modificateur de Sagesse (minimum +1). Maîtrise d'une compétence au choix : Tromperie, Représentation ou Persuasion. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "bonus", target: "check.cha", value: wisMin1, label: "Charme surnaturel" },
              { type: "choice", id: "glamourSkill", label: "Compétence (Charme surnaturel)", from: ["skill.deception", "skill.performance", "skill.persuasion"] },
            ] },
          { level: 7, id: "beguiling-twist", name: { fr: "Retournement ensorcelant", en: "Beguiling Twist" },
            description: "Avantage aux JS contre Charmé et Effrayé. Réaction quand une créature visible à 36 m réussit un JS contre Charmé ou Effrayé : une autre créature visible à 36 m fait un JS de Sagesse contre votre DD des sorts ou est Charmée ou Effrayée (au choix) pendant 1 minute (nouveau JS à la fin de chacun de ses tours). (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "advantage", target: "condition.charmed" }, { type: "advantage", target: "condition.frightened" },
              { type: "action", name: { fr: "Retournement ensorcelant", en: "Beguiling Twist" }, actionType: "reaction",
                description: (c) => "Une créature à 36 m réussit un JS contre Charmé/Effrayé : une autre créature à 36 m, JS de Sagesse DD " + DC(c) + " ou Charmée ou Effrayée 1 minute." },
            ] },
          { level: 11, id: "fey-reinforcements", name: { fr: "Renforts féeriques", en: "Fey Reinforcements" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "gloom-stalker", name: { fr: "Traqueur des ténèbres", en: "Gloom Stalker" },
        features: [
          { level: 3, id: "dread-ambusher", combat: true, name: { fr: "Embuscade effrayante", en: "Dread Ambusher" },
            description: "Prestesse de l'embusqué : +3 m de Vitesse pendant votre premier tour de chaque combat. Frappe effroyable : une fois par tour, quand vous touchez avec une arme, +2d6 dégâts psychiques ; utilisations égales à votre modificateur de Sagesse (minimum 1), récupérées au repos long. Bonus d'Initiative : votre modificateur de Sagesse s'ajoute à l'Initiative (calculé).",
            effects: [
              { type: "bonus", target: "initiative", value: (c) => c.mod.wis, label: "Embuscade effrayante" },
              { type: "resource", id: "dreadfulStrike", name: { fr: "Frappe effroyable", en: "Dreadful Strike" }, max: wisMin1, recharge: "long",
                description: "+2d6 psychiques, une fois par tour." },
              { type: "action", name: { fr: "Frappe effroyable", en: "Dreadful Strike" }, actionType: "free", resource: "dreadfulStrike",
                description: "Vous touchez avec une arme : +2d6 dégâts psychiques (une fois par tour)." },
              { type: "note", text: "Prestesse de l'embusqué : +3 m de Vitesse pendant votre premier tour de combat." },
            ] },
          { level: 3, id: "gloom-stalker-spells", name: { fr: "Sorts de Traqueur des ténèbres", en: "Gloom Stalker Spells" },
            description: "Sorts toujours préparés : " + spellNames(GLOOM) + ".",
            effects: subclassSpells(GLOOM) },
          { level: 3, id: "umbral-sight", name: { fr: "Vision ombreuse", en: "Umbral Sight" },
            description: "Vision dans le noir 18 m (+18 m si vous l'avez déjà). Entièrement dans les Ténèbres, vous êtes Invisible pour les créatures qui comptent sur la Vision dans le noir pour vous voir.",
            effects: [{ type: "sense", sense: "darkvision", range: 60 },
              { type: "note", text: "Vision ombreuse : dans les Ténèbres, Invisible pour qui vous cherche avec la Vision dans le noir." }] },
          { level: 7, id: "iron-mind", name: { fr: "Mental d'acier", en: "Iron Mind" },
            description: "Maîtrise des jets de sauvegarde de Sagesse (si vous l'avez déjà, d'Intelligence ou de Charisme au choix : utilisez un ajustement manuel).",
            effects: [{ type: "proficiency", target: "save.wis" }] },
          { level: 11, id: "stalkers-flurry", name: { fr: "Rafale du traqueur", en: "Stalker's Flurry" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "hunter", name: { fr: "Chasseur", en: "Hunter" },
        features: [
          { level: 3, id: "hunters-lore", name: { fr: "Savoir du chasseur", en: "Hunter's Lore" },
            description: "Tant qu'une créature est marquée par votre Marque du chasseur, vous connaissez ses Immunités, Résistances et Vulnérabilités." },
          { level: 3, id: "hunters-prey", combat: true, name: { fr: "Proie du chasseur", en: "Hunter's Prey" },
            description: "Une option, modifiable après un repos court ou long. Goût du sang : une fois par tour, +1d8 dégâts à une créature qui n'a pas tous ses PV. Briseur de hordes : une fois par tour, une attaque supplémentaire avec la même arme contre une autre créature à 1,5 m de la cible.",
            effects: [{ type: "choice", id: "prey", label: "Proie du chasseur", from: [
              { id: "colossus-slayer", name: { fr: "Goût du sang", en: "Colossus Slayer" }, description: "Une fois par tour, +1d8 dégâts si la cible n'a pas tous ses PV.",
                effects: [{ type: "note", text: "Goût du sang : une fois par tour, +1d8 dégâts avec une arme contre une créature blessée." }] },
              { id: "horde-breaker", name: { fr: "Briseur de hordes", en: "Horde Breaker" }, description: "Une fois par tour, une attaque de plus contre une autre créature à 1,5 m de la cible.",
                effects: [{ type: "note", text: "Briseur de hordes : une fois par tour, une attaque de plus avec la même arme contre une autre créature à 1,5 m de la cible." }] },
            ] }] },
          { level: 7, id: "defensive-tactics", combat: true, name: { fr: "Tactiques défensives", en: "Defensive Tactics" },
            description: "Une option, modifiable après un repos court ou long. Cauchemar de la horde : les attaques d'opportunité contre vous ont le Désavantage. Défense contre les attaques multiples : une créature qui vous touche a le Désavantage à ses autres attaques contre vous ce tour-ci.",
            effects: [{ type: "choice", id: "tactics", label: "Tactiques défensives", from: [
              { id: "escape-the-horde", name: { fr: "Cauchemar de la horde", en: "Escape the Horde" }, description: "Désavantage aux attaques d'opportunité contre vous.",
                effects: [{ type: "note", text: "Cauchemar de la horde : Désavantage aux attaques d'opportunité contre vous." }] },
              { id: "multiattack-defense", name: { fr: "Défense contre les attaques multiples", en: "Multiattack Defense" }, description: "Une créature qui vous touche a le Désavantage à ses autres attaques contre vous ce tour-ci.",
                effects: [{ type: "note", text: "Défense contre les attaques multiples : qui vous touche a le Désavantage à ses autres attaques contre vous ce tour-ci." }] },
            ] }] },
          { level: 11, id: "superior-hunters-prey", name: { fr: "Proie du chasseur supérieure", en: "Superior Hunter's Prey" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
