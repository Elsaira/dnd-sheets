// Sorts du Paladin (liste de niveau 1 à 5 et sorts de serment) — Player's Handbook 2024.
// Mécaniques relevées sur AideDD le 2026-10-15 ; la description complète s'ouvre via le lien de la fiche.
// Fichier généré à partir des pages AideDD (une ligne par sort), avec le helper S(...) de data/spells.js.
// Un sort déjà au catalogue n'est pas réenregistré (on garde sa saisie) : seule la liste de classe lui est ajoutée.
(function () {
  const add = (spells) => DND.registerSpells(spells.filter((s) => !DND.data.spells[s.id]));
  add([
    // Niveau 1
    S("wrathful-smite", "Châtiment de courroux", "Wrathful Smite", 1, "necromancy", "bonus", "self", "V", "1 minute",
      ["paladin"], { save: "wis", damage: { dice: "1d6", type: "necrotic" } }),
    S("searing-smite", "Châtiment de fournaise", "Searing Smite", 1, "evocation", "bonus", "self", "V", "1 minute",
      ["paladin"], { save: "con", damage: { dice: "1d6", type: "fire" } }),
    S("thunderous-smite", "Châtiment de tonnerre", "Thunderous Smite", 1, "evocation", "bonus", "self", "V", "Instantanée",
      ["paladin"], { save: "str", damage: { dice: "2d6", type: "thunder" } }),
    S("divine-smite", "Châtiment divin", "Divine Smite", 1, "evocation", "bonus", "self", "V", "Instantanée",
      ["paladin"], { damage: { dice: "2d8", type: "radiant", alt: { dice: "3d8", label: "contre fiélon ou mort-vivant" } }, notes: "+1d8 par niveau d'emplacement supérieur." }),
    S("compelled-duel", "Duel forcé", "Compelled Duel", 1, "enchantment", "bonus", 30, "V", "1 minute",
      ["paladin"], { concentration: true, save: "wis" }),
    S("divine-favor", "Faveur divine", "Divine Favor", 1, "transmutation", "bonus", "self", "V, S", "1 minute",
      ["paladin"], { damage: { dice: "1d4", type: "radiant" } }),
    S("ensnaring-strike", "Frappe piégeuse", "Ensnaring Strike", 1, "conjuration", "bonus", "self", "V", "1 minute",
      ["ranger"], { concentration: true, save: "str", damage: { dice: "1d6", type: "piercing" } }),
    S("heroism", "Héroïsme", "Heroism", 1, "enchantment", "action", "touch", "V, S", "1 minute",
      ["bard", "paladin"], { concentration: true }),
    S("hunters-mark", "Marque du chasseur", "Hunter's Mark", 1, "divination", "bonus", 90, "V", "1 heure",
      ["ranger"], { concentration: true, damage: { dice: "1d6", type: "force" } }),
    // Niveau 2
    S("find-steed", "Appel de destrier", "Find Steed", 2, "conjuration", "action", 30, "V, S", "Instantanée",
      ["paladin"]),
    S("shining-smite", "Châtiment de révélation", "Shining Smite", 2, "transmutation", "bonus", "self", "V", "1 minute",
      ["paladin"], { concentration: true, damage: { dice: "2d6", type: "radiant" } }),
    S("moonbeam", "Rayon de lune", "Moonbeam", 2, "evocation", "action", 120, "V, S, M", "1 minute",
      ["druid"], { concentration: true, save: "con", damage: { dice: "2d10", type: "radiant" }, material: "une feuille de cocculus" }),
    // Niveau 3
    S("elemental-weapon", "Arme élémentaire", "Elemental Weapon", 3, "transmutation", "action", "touch", "V, S", "1 heure",
      ["druid", "paladin", "ranger"], { concentration: true }),
    S("crusaders-mantle", "Aura du croisé", "Crusader's Mantle", 3, "evocation", "action", "self", "V", "1 minute",
      ["paladin"], { concentration: true }),
    S("blinding-smite", "Châtiment de cécité", "Blinding Smite", 3, "evocation", "bonus", "self", "V", "1 minute",
      ["paladin"], { save: "con", damage: { dice: "3d8", type: "radiant" } }),
    S("haste", "Hâte", "Haste", 3, "transmutation", "action", 30, "V, S, M", "1 minute",
      ["sorcerer", "wizard"], { concentration: true, material: "un copeau de racine de réglisse" }),
    // Niveau 4
    S("staggering-smite", "Châtiment de stupeur", "Staggering Smite", 4, "enchantment", "bonus", "self", "V", "Instantanée",
      ["paladin"], { save: "wis", damage: { dice: "4d6", type: "psychic" } }),
    S("compulsion", "Compulsion", "Compulsion", 4, "enchantment", "action", 30, "V, S", "1 minute",
      ["bard"], { concentration: true, save: "wis" }),
    S("stoneskin", "Peau de pierre", "Stoneskin", 4, "transmutation", "action", "touch", "V, S, M", "1 heure",
      ["druid", "ranger", "sorcerer", "wizard"], { concentration: true, material: "poudre de diamant d'une valeur minimale de 100 po, que le sort consomme" }),
    S("ice-storm", "Tempête de grêle", "Ice Storm", 4, "evocation", "action", 300, "V, S, M", "Instantanée",
      ["druid", "sorcerer", "wizard"], { save: "dex", damage: { dice: "2d10", type: "bludgeoning" }, material: "une moufle" }),
    // Niveau 5
    S("banishing-smite", "Châtiment du ban", "Banishing Smite", 5, "conjuration", "bonus", "self", "V", "1 minute",
      ["paladin"], { concentration: true, save: "cha", damage: { dice: "5d10", type: "force" } }),
    S("commune-with-nature", "Communion avec la nature", "Commune with Nature", 5, "divination", "1 minute", "self", "V, S", "Instantanée",
      ["druid", "ranger"], { ritual: true }),
    S("tree-stride", "Passage par les arbres", "Tree Stride", 5, "conjuration", "action", "self", "V, S", "1 minute",
      ["druid", "ranger"], { concentration: true }),
    S("yolandes-regal-presence", "Présence royale de Yolane", "Yolande's Regal Presence", 5, "enchantment", "action", "self", "V, S, M", "1 minute",
      ["bard", "wizard"], { concentration: true, save: "wis", damage: { dice: "4d6", type: "psychic" }, material: "un diadème miniature" }),
    S("destructive-wave", "Vague destructrice", "Destructive Wave", 5, "evocation", "action", "self", "V", "Instantanée",
      ["paladin"], { save: "con", damage: { dice: "5d6", type: "thunder" } }),
  ]);
})();
