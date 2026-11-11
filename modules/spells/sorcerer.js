// Sorts de l'Ensorceleur (liste de niveau 0 à 5 et sorts de sous-classe) — Player's Handbook 2024.
// Mécaniques relevées sur AideDD le 2026-10-15 ; la description complète s'ouvre via le lien de la fiche.
// Fichier généré à partir des pages AideDD (une ligne par sort), avec le helper S(...) de data/spells.js.
// Un sort déjà au catalogue n'est pas réenregistré (on garde sa saisie) : seule la liste de classe lui est ajoutée.
(function () {
  const add = (spells) => DND.registerSpells(spells.filter((s) => !DND.data.spells[s.id]));
  add([
    // Tours de magie
    S("sorcerous-burst", "Éruption ensorcelée", "Sorcerous Burst", 0, "evocation", "action", 120, "V, S", "Instantanée",
      ["sorcerer"], { attack: "ranged", damage: { dice: "1d8", type: "type au choix" }, scaling: "cantrip", notes: "Acide, froid, feu, foudre, poison, psychique ou tonnerre. Chaque 8 obtenu ajoute 1d8 (jusqu'à votre mod. d'incantation en dés supplémentaires)." }),
    // Niveau 2
    S("flame-blade", "Lame de feu", "Flame Blade", 2, "evocation", "bonus", "self", "V, S, M", "10 minutes",
      ["druid", "sorcerer"], { concentration: true, attack: "melee", material: "une feuille d'amarante" }),
    // Niveau 3
    S("lightning-bolt", "Éclair", "Lightning Bolt", 3, "evocation", "action", "self", "V, S, M", "Instantanée",
      ["sorcerer", "wizard"], { save: "dex", damage: { dice: "8d6", type: "lightning" }, material: "une touffe de fourrure et une tige de cristal" }),
    S("slow", "Lenteur", "Slow", 3, "transmutation", "action", 120, "V, S, M", "1 minute",
      ["bard", "sorcerer", "wizard"], { concentration: true, save: "wis", material: "une goutte de mélasse" }),
    S("sleet-storm", "Tempête de neige", "Sleet Storm", 3, "conjuration", "action", 150, "V, S, M", "1 minute",
      ["druid", "sorcerer", "wizard"], { concentration: true, save: "dex", material: "un parapluie miniature" }),
    // Niveau 4
    S("summon-construct", "Convocation d'artificiel", "Summon Construct", 4, "conjuration", "action", 90, "V, S, M", "1 heure",
      ["wizard"], { concentration: true, material: "un coffre portatif d'une valeur minimale de 400 po" }),
    S("polymorph", "Métamorphose", "Polymorph", 4, "transmutation", "action", 60, "V, S, M", "1 heure",
      ["bard", "druid", "sorcerer", "wizard"], { concentration: true, save: "wis", material: "une chrysalide" }),
    S("vitriolic-sphere", "Sphère de vitriol", "Vitriolic Sphere", 4, "evocation", "action", 150, "V, S, M", "Instantanée",
      ["sorcerer", "wizard"], { save: "dex", damage: { dice: "10d4", type: "acid" }, material: "une goutte de bile" }),
    S("black-tentacles", "Tentacules noirs d'Evard", "Evard's Black Tentacles", 4, "conjuration", "action", 90, "V, S, M", "1 minute",
      ["wizard"], { concentration: true, save: "str", damage: { dice: "3d6", type: "bludgeoning" }, material: "un tentacule" }),
    // Niveau 5
    S("animate-objects", "Animation des objets", "Animate Objects", 5, "transmutation", "action", 120, "V, S", "1 minute",
      ["bard", "sorcerer", "wizard"], { concentration: true }),
    S("cloudkill", "Brume mortelle", "Cloudkill", 5, "conjuration", "action", 120, "V, S", "10 minutes",
      ["sorcerer", "wizard"], { concentration: true, save: "con", damage: { dice: "5d8", type: "poison" } }),
    S("cone-of-cold", "Cône de froid", "Cone of Cold", 5, "evocation", "action", "self", "V, S, M", "Instantanée",
      ["druid", "sorcerer", "wizard"], { save: "con", damage: { dice: "8d8", type: "cold" }, material: "petit cône de verre ou de cristal" }),
    S("summon-dragon", "Convocation de dragon", "Summon Dragon", 5, "conjuration", "action", 60, "V, S, M", "1 heure",
      ["wizard"], { concentration: true, material: "un objet gravé d'une représentation de dragon d'une valeur minimale de 500 po" }),
    S("creation", "Création", "Creation", 5, "illusion", "1 minute", 30, "V, S, M", "Spéciale",
      ["sorcerer", "wizard"], { material: "un pinceau" }),
    S("telepathic-bond", "Lien télépathique de Rary", "Rary's Telepathic Bond", 5, "divination", "action", 30, "V, S, M", "1 heure",
      ["bard", "wizard"], { ritual: true, material: "deux oeufs" }),
    S("arcane-hand", "Main de Bigby", "Bigby's Hand", 5, "evocation", "action", 120, "V, S, M", "1 minute",
      ["sorcerer", "wizard"], { concentration: true, attack: "melee", damage: { dice: "5d8", type: "force" }, material: "une coquille d'oeuf et un gant" }),
    S("wall-of-force", "Mur de force", "Wall of Force", 5, "evocation", "action", 120, "V, S, M", "10 minutes",
      ["wizard"], { concentration: true, material: "un éclat de verre" }),
    S("wall-of-stone", "Mur de pierre", "Wall of Stone", 5, "evocation", "action", 120, "V, S, M", "10 minutes",
      ["druid", "sorcerer", "wizard"], { concentration: true, save: "dex", material: "un cube de granit" }),
  ]);
})();
