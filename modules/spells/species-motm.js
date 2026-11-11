// Sorts des espèces de Monsters of the Multiverse (Duergar, Génasi).
// Mécaniques relevées sur AideDD (sorts 2024) le 2026-10-15 ; la description complète s'ouvre via le lien de la fiche.
// Utilise le même helper S(...) que data/spells.js. Certains sorts existent aussi dans spells/fighter.js
// (définitions identiques) : chaque espèce reste ainsi utilisable sans dépendre d'un module de classe.
DND.registerSpells([
  S("acid-splash", "Aspersion d'acide", "Acid Splash", 0, "evocation", "action", 60, "V, S", "Instantanée",
    ["sorcerer", "wizard"], { save: "dex", damage: { dice: "1d6", type: "acid" }, scaling: "cantrip" }),
  S("produce-flame", "Flammes", "Produce Flame", 0, "conjuration", "bonus", "self", "V, S", "10 minutes",
    ["druid"], { attack: "ranged", damage: { dice: "1d8", type: "fire" }, scaling: "cantrip" }),
  S("shocking-grasp", "Poigne électrique", "Shocking Grasp", 0, "evocation", "action", "touch", "V, S", "Instantanée",
    ["sorcerer", "wizard"], { attack: "melee", damage: { dice: "1d8", type: "lightning" }, scaling: "cantrip" }),
  S("create-or-destroy-water", "Création ou destruction d'eau", "Create or Destroy Water", 1, "transmutation", "action", 30, "V, S, M", "Instantanée",
    ["cleric", "druid"], { material: "un mélange d'eau et de sable" }),
  S("feather-fall", "Feuille morte", "Feather Fall", 1, "transmutation", "reaction", 60, "V, M", "1 minute",
    ["bard", "sorcerer", "wizard"], { material: "une petite plume ou un peu de duvet" }),
  S("enlarge-reduce", "Agrandissement/rapetissement", "Enlarge/Reduce", 2, "transmutation", "action", 30, "V, S, M", "1 minute",
    ["bard", "druid", "sorcerer", "wizard"], { concentration: true, save: "con", material: "une pincée de poudre de fer" }),
  S("flame-blade", "Lame de feu", "Flame Blade", 2, "evocation", "bonus", "self", "V, S, M", "10 minutes",
    ["druid", "sorcerer"], { concentration: true, attack: "melee", damage: { dice: "3d6", type: "fire" }, material: "une feuille d'amarante" }),
  // Nom double comme sur AideDD (l'adresse du lien en dépend)
  S("water-walk", "Marche sur l'eau / Marche sur l'onde", "Water Walk", 3, "transmutation", "action", 30, "V, S, M", "1 heure",
    ["cleric", "druid", "ranger", "sorcerer"], { ritual: true, material: "un morceau de liège" }),
]);
