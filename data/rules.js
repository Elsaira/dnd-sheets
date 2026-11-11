// Données de règles générales (SRD 5.2). Termes français d'après AideDD.

DND.data.abilities = ["str", "dex", "con", "int", "wis", "cha"];

DND.registerLabels({
  str: { fr: "Force", en: "Strength", short: "FOR" },
  dex: { fr: "Dextérité", en: "Dexterity", short: "DEX" },
  con: { fr: "Constitution", en: "Constitution", short: "CON" },
  int: { fr: "Intelligence", en: "Intelligence", short: "INT" },
  wis: { fr: "Sagesse", en: "Wisdom", short: "SAG" },
  cha: { fr: "Charisme", en: "Charisma", short: "CHA" },
});

DND.data.skills = {
  acrobatics: { ability: "dex", fr: "Acrobaties", en: "Acrobatics" },
  "animal-handling": { ability: "wis", fr: "Dressage", en: "Animal Handling" },
  arcana: { ability: "int", fr: "Arcanes", en: "Arcana" },
  athletics: { ability: "str", fr: "Athlétisme", en: "Athletics" },
  deception: { ability: "cha", fr: "Tromperie", en: "Deception" },
  history: { ability: "int", fr: "Histoire", en: "History" },
  insight: { ability: "wis", fr: "Intuition", en: "Insight" },
  intimidation: { ability: "cha", fr: "Intimidation", en: "Intimidation" },
  investigation: { ability: "int", fr: "Investigation", en: "Investigation" },
  medicine: { ability: "wis", fr: "Médecine", en: "Medicine" },
  nature: { ability: "int", fr: "Nature", en: "Nature" },
  perception: { ability: "wis", fr: "Perception", en: "Perception" },
  performance: { ability: "cha", fr: "Représentation", en: "Performance" },
  persuasion: { ability: "cha", fr: "Persuasion", en: "Persuasion" },
  religion: { ability: "int", fr: "Religion", en: "Religion" },
  "sleight-of-hand": { ability: "dex", fr: "Escamotage", en: "Sleight of Hand" },
  stealth: { ability: "dex", fr: "Discrétion", en: "Stealth" },
  survival: { ability: "wis", fr: "Survie", en: "Survival" },
};
for (const [id, s] of Object.entries(DND.data.skills)) DND.registerLabels({ [id]: { fr: s.fr, en: s.en } });

DND.data.damageTypes = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic",
  "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];
DND.registerLabels({
  acid: { fr: "Acide", en: "Acid" }, bludgeoning: { fr: "Contondant", en: "Bludgeoning" },
  cold: { fr: "Froid", en: "Cold" }, fire: { fr: "Feu", en: "Fire" }, force: { fr: "Force", en: "Force" },
  lightning: { fr: "Foudre", en: "Lightning" }, necrotic: { fr: "Nécrotique", en: "Necrotic" },
  piercing: { fr: "Perforant", en: "Piercing" }, poison: { fr: "Poison", en: "Poison" },
  psychic: { fr: "Psychique", en: "Psychic" }, radiant: { fr: "Radiant", en: "Radiant" },
  slashing: { fr: "Tranchant", en: "Slashing" }, thunder: { fr: "Tonnerre", en: "Thunder" },
});

// États préjudiciables : résumé court pour l'infobulle (pas le texte officiel).
DND.data.conditions = {
  blinded: { fr: "Aveuglé", en: "Blinded", summary: "Rate les tests nécessitant la vue. Désavantage à ses attaques, avantage aux attaques contre lui." },
  charmed: { fr: "Charmé", en: "Charmed", summary: "Ne peut pas attaquer le charmeur. Le charmeur a l'avantage aux tests sociaux contre lui." },
  deafened: { fr: "Assourdi", en: "Deafened", summary: "Ne peut rien entendre, rate les tests nécessitant l'ouïe." },
  frightened: { fr: "Effrayé", en: "Frightened", summary: "Désavantage aux tests et attaques tant que la source est visible. Ne peut pas s'en approcher volontairement." },
  grappled: { fr: "Agrippé", en: "Grappled", summary: "Vitesse 0. Désavantage aux attaques contre toute cible autre que l'agrippeur." },
  incapacitated: { fr: "Neutralisé", en: "Incapacitated", summary: "Aucune action, action bonus ni réaction. Perd la concentration." },
  invisible: { fr: "Invisible", en: "Invisible", summary: "Avantage à l'initiative et à ses attaques, désavantage aux attaques contre lui." },
  paralyzed: { fr: "Paralysé", en: "Paralyzed", summary: "Neutralisé, vitesse 0. Rate les JS de FOR et DEX. Coup critique au contact à 1,5 m." },
  petrified: { fr: "Pétrifié", en: "Petrified", summary: "Transformé en pierre. Neutralisé, résistance à tous les dégâts, immunisé au poison." },
  poisoned: { fr: "Empoisonné", en: "Poisoned", summary: "Désavantage aux jets d'attaque et aux tests de caractéristique." },
  prone: { fr: "À terre", en: "Prone", summary: "Se déplace en rampant. Désavantage à ses attaques. Avantage aux attaques contre lui à 1,5 m, désavantage au-delà." },
  restrained: { fr: "Entravé", en: "Restrained", summary: "Vitesse 0. Désavantage à ses attaques et JS de DEX, avantage aux attaques contre lui." },
  stunned: { fr: "Étourdi", en: "Stunned", summary: "Neutralisé. Rate les JS de FOR et DEX, avantage aux attaques contre lui." },
  unconscious: { fr: "Inconscient", en: "Unconscious", summary: "Neutralisé et à terre, lâche ce qu'il tient. Rate les JS de FOR et DEX. Coup critique au contact à 1,5 m." },
};
for (const [id, c] of Object.entries(DND.data.conditions)) DND.registerLabels({ ["condition." + id]: { fr: c.fr, en: c.en } });

DND.data.languages = {
  common: { fr: "Commun", en: "Common", rare: false },
  "common-sign": { fr: "Langue des signes commune", en: "Common Sign Language", rare: false },
  draconic: { fr: "Draconique", en: "Draconic", rare: false },
  dwarvish: { fr: "Nain", en: "Dwarvish", rare: false },
  elvish: { fr: "Elfique", en: "Elvish", rare: false },
  giant: { fr: "Géant", en: "Giant", rare: false },
  gnomish: { fr: "Gnome", en: "Gnomish", rare: false },
  goblin: { fr: "Gobelin", en: "Goblin", rare: false },
  halfling: { fr: "Halfelin", en: "Halfling", rare: false },
  orc: { fr: "Orc", en: "Orc", rare: false },
  abyssal: { fr: "Abyssal", en: "Abyssal", rare: true },
  celestial: { fr: "Céleste", en: "Celestial", rare: true },
  "deep-speech": { fr: "Profond", en: "Deep Speech", rare: true },
  druidic: { fr: "Druidique", en: "Druidic", rare: true },
  infernal: { fr: "Infernal", en: "Infernal", rare: true },
  primordial: { fr: "Primordial", en: "Primordial", rare: true },
  sylvan: { fr: "Sylvestre", en: "Sylvan", rare: true },
  "thieves-cant": { fr: "Argot des voleurs", en: "Thieves' Cant", rare: true },
  undercommon: { fr: "Commun des profondeurs", en: "Undercommon", rare: true },
};
for (const [id, l] of Object.entries(DND.data.languages)) DND.registerLabels({ ["language." + id]: { fr: l.fr, en: l.en } });

DND.data.tools = {
  "alchemists-supplies": { fr: "Matériel d'alchimiste", en: "Alchemist's Supplies", artisan: true },
  "brewers-supplies": { fr: "Matériel de brasseur", en: "Brewer's Supplies", artisan: true },
  "calligraphers-supplies": { fr: "Matériel de calligraphe", en: "Calligrapher's Supplies", artisan: true },
  "carpenters-tools": { fr: "Outils de charpentier", en: "Carpenter's Tools", artisan: true },
  "cartographers-tools": { fr: "Outils de cartographe", en: "Cartographer's Tools", artisan: true },
  "cobblers-tools": { fr: "Outils de cordonnier", en: "Cobbler's Tools", artisan: true },
  "cooks-utensils": { fr: "Ustensiles de cuisinier", en: "Cook's Utensils", artisan: true },
  "glassblowers-tools": { fr: "Outils de souffleur de verre", en: "Glassblower's Tools", artisan: true },
  "jewelers-tools": { fr: "Outils de joaillier", en: "Jeweler's Tools", artisan: true },
  "leatherworkers-tools": { fr: "Outils de tanneur", en: "Leatherworker's Tools", artisan: true },
  "masons-tools": { fr: "Outils de maçon", en: "Mason's Tools", artisan: true },
  "painters-supplies": { fr: "Matériel de peintre", en: "Painter's Supplies", artisan: true },
  "potters-tools": { fr: "Outils de potier", en: "Potter's Tools", artisan: true },
  "smiths-tools": { fr: "Outils de forgeron", en: "Smith's Tools", artisan: true },
  "tinkers-tools": { fr: "Outils de bricoleur", en: "Tinker's Tools", artisan: true },
  "weavers-tools": { fr: "Outils de tisserand", en: "Weaver's Tools", artisan: true },
  "woodcarvers-tools": { fr: "Outils de menuisier", en: "Woodcarver's Tools", artisan: true },
  "disguise-kit": { fr: "Accessoires de déguisement", en: "Disguise Kit" },
  "forgery-kit": { fr: "Matériel de contrefaçon", en: "Forgery Kit" },
  "herbalism-kit": { fr: "Matériel d'herboriste", en: "Herbalism Kit" },
  "navigators-tools": { fr: "Instruments de navigateur", en: "Navigator's Tools" },
  "poisoners-kit": { fr: "Matériel d'empoisonneur", en: "Poisoner's Kit" },
  "thieves-tools": { fr: "Outils de voleur", en: "Thieves' Tools" },
  "dice-set": { fr: "Boîte de jeux : dés", en: "Dice Set", gaming: true },
  "dragonchess-set": { fr: "Boîte de jeux : échecs draconiques", en: "Dragonchess Set", gaming: true },
  "playing-card-set": { fr: "Boîte de jeux : cartes à jouer", en: "Playing Card Set", gaming: true },
  "three-dragon-ante-set": { fr: "Boîte de jeux : jeu des dragons", en: "Three-Dragon Ante Set", gaming: true },
  // Instruments de musique : chaque variante est une maîtrise distincte (noms AideDD)
  "bagpipes": { fr: "Cornemuse", en: "Bagpipes", musical: true },
  "drum": { fr: "Tambour", en: "Drum", musical: true },
  "dulcimer": { fr: "Tympanon", en: "Dulcimer", musical: true },
  "flute": { fr: "Flûte", en: "Flute", musical: true },
  "horn": { fr: "Cor", en: "Horn", musical: true },
  "lute": { fr: "Luth", en: "Lute", musical: true },
  "lyre": { fr: "Lyre", en: "Lyre", musical: true },
  "pan-flute": { fr: "Flûte de pan", en: "Pan Flute", musical: true },
  "shawm": { fr: "Chalemie", en: "Shawm", musical: true },
  "viol": { fr: "Viole", en: "Viol", musical: true },
};
for (const [id, t] of Object.entries(DND.data.tools)) DND.registerLabels({ ["tool." + id]: { fr: t.fr, en: t.en } });

DND.registerLabels({
  "armor.light": { fr: "Armures légères", en: "Light Armor" },
  "armor.medium": { fr: "Armures intermédiaires", en: "Medium Armor" },
  "armor.heavy": { fr: "Armures lourdes", en: "Heavy Armor" },
  "armor.shield": { fr: "Boucliers", en: "Shields" },
  "weapon.simple": { fr: "Armes courantes", en: "Simple Weapons" },
  "weapon.martial": { fr: "Armes de guerre", en: "Martial Weapons" },
  "size.tiny": { fr: "TP", en: "Tiny" }, "size.small": { fr: "Petite", en: "Small" },
  "size.medium": { fr: "Moyenne", en: "Medium" }, "size.large": { fr: "Grande", en: "Large" },
  "school.abjuration": { fr: "Abjuration", en: "Abjuration" },
  "school.conjuration": { fr: "Invocation", en: "Conjuration" },
  "school.divination": { fr: "Divination", en: "Divination" },
  "school.enchantment": { fr: "Enchantement", en: "Enchantment" },
  "school.evocation": { fr: "Évocation", en: "Evocation" },
  "school.illusion": { fr: "Illusion", en: "Illusion" },
  "school.necromancy": { fr: "Nécromancie", en: "Necromancy" },
  "school.transmutation": { fr: "Transmutation", en: "Transmutation" },
  "list.bard": { fr: "Barde", en: "Bard" }, "list.cleric": { fr: "Clerc", en: "Cleric" },
  "list.druid": { fr: "Druide", en: "Druid" }, "list.paladin": { fr: "Paladin", en: "Paladin" },
  "list.ranger": { fr: "Rôdeur", en: "Ranger" }, "list.sorcerer": { fr: "Ensorceleur", en: "Sorcerer" },
  "list.warlock": { fr: "Occultiste", en: "Warlock" }, "list.wizard": { fr: "Magicien", en: "Wizard" },
  "list.artificer": { fr: "Artificier", en: "Artificer" },
  "sense.darkvision": { fr: "Vision dans le noir", en: "Darkvision" },
  "sense.blindsight": { fr: "Vision aveugle", en: "Blindsight" },
  "sense.tremorsense": { fr: "Perception des vibrations", en: "Tremorsense" },
  "sense.truesight": { fr: "Vision véritable", en: "Truesight" },
  "sense.devils-sight": { fr: "Vision du diable", en: "Devil's Sight" },
  "speed.walk": { fr: "Marche", en: "Walk" }, "speed.fly": { fr: "Vol", en: "Fly" },
  "speed.swim": { fr: "Nage", en: "Swim" }, "speed.climb": { fr: "Escalade", en: "Climb" },
  "speed.burrow": { fr: "Fouissement", en: "Burrow" },
});

// Emplacements de sorts d'un lanceur complet (et du multiclassage) par niveau de lanceur.
DND.data.spellSlots = {
  1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
  8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2], 11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1], 14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1], 17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1], 20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

// Couleurs d'accent proposées dans Options (une par classe). Un module de classe peut
// déclarer sa propre `color`, utilisée par défaut pour les personnages de cette classe.
DND.data.accentPresets = [
  { id: "barbarian", fr: "Barbare", color: "#9c4a1a" },
  { id: "bard", fr: "Barde", color: "#a8326e" },
  { id: "cleric", fr: "Clerc", color: "#a77a12" },
  { id: "druid", fr: "Druide", color: "#4f7a2a" },
  { id: "sorcerer", fr: "Ensorceleur", color: "#b0263a" },
  { id: "fighter", fr: "Guerrier", color: "#7a2e22" },
  { id: "wizard", fr: "Magicien", color: "#2c4f9e" },
  { id: "monk", fr: "Moine", color: "#3e8a8a" },
  { id: "warlock", fr: "Occultiste", color: "#6b3fa0" },
  { id: "paladin", fr: "Paladin", color: "#b58a2c" },
  { id: "ranger", fr: "Rôdeur", color: "#2f6b45" },
  { id: "rogue", fr: "Roublard", color: "#4a4a5e" },
  { id: "artificer", fr: "Artificier", color: "#b8622e" },
];
