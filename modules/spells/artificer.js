// Sorts de l'Artificier : liste de classe de niveau 0 à 5 et sorts de sous-classe. Liste comparée le 2026-10-15 à celle fournie par Plouf (Forge of the Artificer).
// Réparation n'est pas sur la liste : l'artificier la connaît par Magie de bricoleur.
// Mécaniques relevées sur AideDD le 2026-10-15 ; la description complète s'ouvre via le lien de la fiche.
// Fichier généré à partir des pages AideDD (une ligne par sort), avec le helper S(...) de data/spells.js.
// Un sort déjà au catalogue n'est pas réenregistré (on garde sa saisie) : seule la liste de classe lui est ajoutée.
(function () {
  // Les sorts du Xanathar n'ont pas de page 2024 sur AideDD : on pointe vers la fiche 2014 (champ aidedd2014).
  const spellUrl = DND.config.spellUrl;
  DND.config.spellUrl = (spell) => (spell.aidedd2014 ? "https://www.aidedd.org/dnd/sorts.php?vf=" + spell.aidedd2014 : spellUrl(spell));
  const add = (spells) => DND.registerSpells(spells.filter((s) => !DND.data.spells[s.id]));
  add([
    // Tours de magie
    S("thorn-whip", "Fouet épineux", "Thorn Whip", 0, "transmutation", "action", 30, "V, S, M", "Instantanée",
      ["artificer", "druid"], { attack: "melee", damage: { dice: "1d6", type: "piercing" }, scaling: "cantrip", material: "une tige de plante épineuse" }),
    // Niveau 2
    S("heat-metal", "Métal brûlant", "Heat Metal", 2, "transmutation", "action", 60, "V, S, M", "1 minute",
      ["artificer", "bard", "druid"], { concentration: true, save: "con", damage: { dice: "2d8", type: "fire" }, material: "un bout de fer et une flamme" }),
    // Niveau 3
    S("conjure-barrage", "Invocation de projectiles / Hérissement", "Conjure Barrage", 3, "conjuration", "action", "self", "V, S, M", "Instantanée",
      ["ranger"], { save: "dex", damage: { dice: "5d8", type: "force" }, material: "une arme de corps à corps ou à distance d'une valeur minimale de 1 pc" }),
    S("wind-wall", "Mur de vent", "Wind Wall", 3, "evocation", "action", 120, "V, S, M", "1 minute",
      ["druid", "ranger"], { concentration: true, save: "str", damage: { dice: "4d8", type: "bludgeoning" }, material: "un éventail et une plume" }),
    S("call-lightning", "Appel de la foudre", "Call Lightning", 3, "conjuration", "action", 120, "V, S", "10 minutes",
      ["druid"], { concentration: true, save: "dex", damage: { dice: "3d10", type: "lightning" } }),
    // Niveau 4
    S("faithful-hound", "Chien de garde de Mordenkainen", "Mordenkainen's Faithful Hound", 4, "conjuration", "action", 30, "V, S, M", "8 heures",
      ["artificer", "wizard"], { save: "dex", damage: { dice: "4d8", type: "force" }, material: "un sifflet en argent" }),
    S("secret-chest", "Coffre secret de Léomund", "Leomund's Secret Chest", 4, "conjuration", "action", "touch", "V, S, M", "Instantanée",
      ["artificer", "wizard"], { material: "un coffre, de 90 cm par 60 cm par 60 cm, fait de matériaux rares d'une valeur minimale de 5000 po, et sa réplique de taille TP faite des mêmes matériaux d'une valeur minimale de 50 po" }),
    S("fabricate", "Fabrication", "Fabricate", 4, "transmutation", "10 minutes", 120, "V, S", "Instantanée",
      ["artificer", "wizard"]),
    S("private-sanctum", "Sanctuaire privé de Mordenkainen", "Mordenkainen's Private Sanctum", 4, "abjuration", "10 minutes", 120, "V, S, M", "24 heures",
      ["artificer", "wizard"], { material: "une feuille de plomb" }),
    S("resilient-sphere", "Sphère résiliente d'Otiluke", "Otiluke's Resilient Sphere", 4, "evocation", "action", 30, "V, S, M", "1 minute",
      ["artificer", "wizard"], { concentration: true, save: "dex", material: "une sphère de verre" }),
    // Sorts du Xanathar's Guide (version 2014 sur AideDD, lien vers la fiche 2014) : mécaniques relevées le 2026-10-15.
    // Seulement sur la liste de l'artificier : les autres classes suivent les listes 2024, où ces sorts ne figurent pas.
    S("create-bonfire", "Embrasement", "Create Bonfire", 0, "conjuration", "action", 60, "V, S", "1 minute",
      ["artificer"], { concentration: true, save: "dex", damage: { dice: "1d8", type: "fire" }, scaling: "cantrip", aidedd2014: "embrasement" }),
    S("frostbite", "Gelure", "Frostbite", 0, "evocation", "action", 60, "V, S", "Instantanée",
      ["artificer"], { save: "con", damage: { dice: "1d6", type: "cold" }, scaling: "cantrip", aidedd2014: "gelure" }),
    S("magic-stone", "Pierre magique", "Magic Stone", 0, "transmutation", "bonus", "touch", "V, S", "1 minute",
      ["artificer"], { attack: "ranged", damage: { dice: "1d6", type: "bludgeoning" }, notes: "Dégâts 1d6 + mod. d'incantation ; jusqu'à 3 cailloux, lancés à 18 m.", aidedd2014: "pierre-magique" }),
    S("absorb-elements", "Absorption des éléments", "Absorb Elements", 1, "abjuration", "reaction", "self", "S", "1 round",
      ["artificer"], { notes: "Résistance au type de dégâts subi ; +1d6 de ce type à la prochaine attaque au corps à corps.", aidedd2014: "absorption-des-elements" }),
    S("catapult", "Catapulte", "Catapult", 1, "transmutation", "action", 60, "S", "Instantanée",
      ["artificer"], { save: "dex", damage: { dice: "3d8", type: "bludgeoning" }, aidedd2014: "catapulte" }),
    S("snare", "Collet", "Snare", 1, "abjuration", "1 minute", "touch", "S, M", "8 heures",
      ["artificer"], { save: "dex", material: "7,5 m de corde, que le sort consomme", aidedd2014: "collet" }),
    S("pyrotechnics", "Pyrotechnie", "Pyrotechnics", 2, "transmutation", "action", 60, "V, S", "Instantanée",
      ["artificer"], { save: "con", aidedd2014: "pyrotechnie" }),
    S("skywrite", "Libellé aérien", "Skywrite", 2, "transmutation", "action", "À vue", "V, S", "1 heure",
      ["artificer"], { concentration: true, ritual: true, aidedd2014: "libelle-aerien" }),
    S("flame-arrows", "Flèches enflammées", "Flame Arrows", 3, "transmutation", "action", "touch", "V, S", "1 heure",
      ["artificer"], { concentration: true, notes: "+1d6 feu par munition tirée du carquois (12 munitions).", aidedd2014: "fleches-enflammees" }),
    S("tiny-servant", "Serviteur miniature", "Tiny Servant", 3, "transmutation", "1 minute", "touch", "V, S", "8 heures",
      ["artificer"], { aidedd2014: "serviteur-miniature" }),
    S("elemental-bane", "Fléau élémentaire", "Elemental Bane", 4, "transmutation", "action", 90, "V, S", "1 minute",
      ["artificer"], { concentration: true, save: "con", aidedd2014: "fleau-elementaire" }),
    S("skill-empowerment", "Amélioration de compétences", "Skill Empowerment", 5, "transmutation", "action", "touch", "V, S", "1 heure",
      ["artificer"], { concentration: true, aidedd2014: "amelioration-de-competences" }),
    S("transmute-rock", "Transmutation de la pierre", "Transmute Rock", 5, "transmutation", "action", 120, "V, S, M", "Jusqu'à dissipation",
      ["artificer"], { material: "de l'argile et de l'eau", aidedd2014: "transmutation-de-la-pierre" }),
    // Sorts de Forge of the Artificer absents d'AideDD : entrées minimales sans lien, nom français provisoire, à vérifier dans le livre
    S("aundairs-silent-sanctum", "Sanctuaire silencieux d'Aundair", "Aundair's Silent Sanctum", 0, "illusion", "action", "Personnelle (émanation de 1,5 m)", "à vérifier", "Concentration (durée à vérifier)",
      ["artificer"], { concentration: true, custom: true, notes: "Entrée minimale, à vérifier dans Forge of the Artificer." }),
    S("force-blast", "Déflagration de force", "Force Blast", 0, "evocation", "action", 180, "à vérifier", "Instantanée (à vérifier)",
      ["artificer"], { custom: true, notes: "Entrée minimale, à vérifier dans Forge of the Artificer." }),
    S("magecraft", "Artisanat magique", "Magecraft", 0, "divination", "action", "self", "à vérifier", "Concentration (durée à vérifier)",
      ["artificer"], { concentration: true, custom: true, notes: "Entrée minimale, à vérifier dans Forge of the Artificer." }),
    S("homunculus-servant", "Serviteur homoncule", "Homunculus Servant", 2, "conjuration", "1 heure", 10, "à vérifier", "à vérifier",
      ["artificer"], { ritual: true, custom: true, notes: "Entrée minimale, à vérifier dans Forge of the Artificer." }),
    // Niveau 5
    S("passwall", "Passe-muraille", "Passwall", 5, "transmutation", "action", 30, "V, S, M", "1 heure",
      ["wizard"], { material: "une pincée de graines de sésame" }),
  ]);
  // Sorts déjà au catalogue qui figurent aussi sur la liste de cette classe (AideDD)
  for (const id of ["elementalism", "true-strike", "arcane-vigor", "dragons-breath", "circle-of-power", "acid-splash", "aid", "alarm", "alter-self", "animate-objects", "arcane-eye", "arcane-hand", "arcane-lock", "blink", "blur", "continual-flame", "create-food-and-water", "creation", "cure-wounds", "dancing-lights", "darkvision", "detect-magic", "disguise-self", "dispel-magic", "elemental-weapon", "enhance-ability", "enlarge-reduce", "expeditious-retreat", "faerie-fire", "false-life", "feather-fall", "fire-bolt", "fly", "freedom-of-movement", "glyph-of-warding", "grease", "greater-restoration", "guidance", "haste", "identify", "invisibility", "jump", "lesser-restoration", "levitate", "light", "longstrider", "mage-hand", "magic-mouth", "magic-weapon", "message", "poison-spray", "prestidigitation", "protection-from-energy", "protection-from-poison", "purify-food-and-drink", "ray-of-frost", "resistance", "revivify", "rope-trick", "sanctuary", "see-invisibility", "shocking-grasp", "spare-the-dying", "spider-climb", "stone-shape", "stoneskin", "summon-construct", "thunderclap", "wall-of-stone", "water-breathing", "water-walk", "web"]) {
    const s = DND.data.spells[id];
    if (s && !s.lists.includes("artificer")) s.lists.push("artificer");
  }
})();
