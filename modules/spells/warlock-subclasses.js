// Sorts des protecteurs Céleste et Grand Ancien (Player's Handbook 2024).
// Mécaniques relevées sur AideDD le 2026-10-15 ; la description complète s'ouvre via le lien de la fiche.
// Utilise le même helper S(...) que data/spells.js.
DND.registerSpells([
  // Protecteur Céleste
  S("light", "Lumière", "Light", 0, "evocation", "action", "touch", "V, M", "1 heure",
    ["bard", "cleric", "sorcerer", "wizard"], { material: "une luciole ou de la mousse phosphorescente" }),
  S("sacred-flame", "Flamme sacrée", "Sacred Flame", 0, "evocation", "action", 60, "V, S", "Instantanée",
    ["cleric"], { save: "dex", damage: { dice: "1d8", type: "radiant" }, scaling: "cantrip" }),
  S("cure-wounds", "Soins", "Cure Wounds", 1, "abjuration", "action", "touch", "V, S", "Instantanée",
    ["bard", "cleric", "druid", "paladin", "ranger"]),
  S("guiding-bolt", "Rayon traçant", "Guiding Bolt", 1, "evocation", "action", 120, "V, S", "1 round",
    ["cleric"], { attack: "ranged", damage: { dice: "4d6", type: "radiant" } }),
  S("aid", "Aide", "Aid", 2, "abjuration", "action", 30, "V, S, M", "8 heures",
    ["bard", "cleric", "druid", "paladin", "ranger"], { material: "une bandelette de tissu blanc" }),
  S("lesser-restoration", "Restauration partielle", "Lesser Restoration", 2, "abjuration", "bonus", "touch", "V, S", "Instantanée",
    ["bard", "cleric", "druid", "paladin", "ranger"]),
  S("daylight", "Lumière du jour", "Daylight", 3, "evocation", "action", 60, "V, S", "1 heure",
    ["cleric", "druid", "paladin", "ranger", "sorcerer"]),
  S("revivify", "Retour à la vie", "Revivify", 3, "necromancy", "action", "touch", "V, S, M", "Instantanée",
    ["cleric", "druid", "paladin", "ranger"], { material: "un diamant d'une valeur minimale de 300 po, que le sort consomme" }),
  S("guardian-of-faith", "Gardien de la foi", "Guardian of Faith", 4, "conjuration", "action", 30, "V", "8 heures",
    ["cleric"], { save: "dex" }),
  S("greater-restoration", "Restauration suprême", "Greater Restoration", 5, "abjuration", "action", "touch", "V, S, M", "Instantanée",
    ["bard", "cleric", "druid", "paladin", "ranger"], { material: "poudre de diamant d'une valeur minimale de 100 po, que le sort consomme" }),
  S("summon-celestial", "Convocation de céleste", "Summon Celestial", 5, "conjuration", "action", 90, "V, S, M", "1 heure",
    ["cleric", "paladin"], { concentration: true, material: "un reliquaire d'une valeur minimale de 500 po" }),

  // Protecteur Grand Ancien
  S("dissonant-whispers", "Murmures dissonants", "Dissonant Whispers", 1, "enchantment", "action", 60, "V", "Instantanée",
    ["bard"], { save: "wis", damage: { dice: "3d6", type: "psychic" } }),
  S("detect-thoughts", "Détection des pensées", "Detect Thoughts", 2, "divination", "action", "self", "V, S, M", "1 minute",
    ["bard", "sorcerer", "wizard"], { concentration: true, save: "wis", material: "une pièce de cuivre" }),
  S("clairvoyance", "Clairvoyance", "Clairvoyance", 3, "divination", "10 minutes", "1,5 km", "V, S, M", "10 minutes",
    ["bard", "cleric", "sorcerer", "wizard"], { concentration: true,
      material: "un focaliseur d'une valeur minimale de 100 po ; une corne ornée pour écouter ou un oeil de verre pour observer" }),
  S("confusion", "Confusion", "Confusion", 4, "enchantment", "action", 90, "V, S, M", "1 minute",
    ["bard", "druid", "sorcerer", "wizard"], { concentration: true, save: "wis", material: "trois coquilles de noix" }),
  S("modify-memory", "Modification de mémoire", "Modify Memory", 5, "enchantment", "action", 30, "V, S", "1 minute",
    ["bard", "wizard"], { concentration: true, save: "wis" }),
  S("telekinesis", "Télékinésie", "Telekinesis", 5, "transmutation", "action", 60, "V, S", "10 minutes",
    ["sorcerer", "wizard"], { concentration: true, save: "str" }),
]);
