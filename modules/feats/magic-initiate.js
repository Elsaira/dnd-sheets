// Don d'origine : Initié à la magie (Magic Initiate) — SRD 5.2
// L'historique peut imposer la liste (ex. Acolyte : Clerc) via preset: { spellList: "cleric" }.
registerModule({
  kind: "feat", id: "magic-initiate", category: "origin", repeatable: true,
  name: { fr: "Initié à la magie", en: "Magic Initiate" },
  description: "Deux tours de magie et un sort de niveau 1 de la liste du Clerc, du Druide ou du Magicien.",
  features: [
    { id: "magic-initiate", name: { fr: "Initié à la magie", en: "Magic Initiate" },
      description: "Vous apprenez deux tours de magie et un sort de niveau 1 de la liste choisie. Ce sort est toujours préparé ; vous pouvez le lancer une fois sans emplacement (récupéré au repos long), ou avec vos emplacements. Quand vous gagnez un niveau, vous pouvez remplacer un de ces sorts par un autre de même niveau de la même liste.",
      effects: [
        { type: "choice", id: "spellList", label: "Liste de sorts", from: [
          { id: "cleric", name: { fr: "Clerc", en: "Cleric" } },
          { id: "druid", name: { fr: "Druide", en: "Druid" } },
          { id: "wizard", name: { fr: "Magicien", en: "Wizard" } }] },
        { type: "choice", id: "ability", label: "Caractéristique d'incantation", from: ["int", "wis", "cha"] },
        { type: "choice", id: "cantrips", label: "Tours de magie", count: 2, from: "spells",
          filter: { level: 0, list: "{choice:spellList}" },
          grant: { type: "spell", spell: "{value}", ability: "{choice:ability}" } },
        { type: "choice", id: "spell", label: "Sort de niveau 1", from: "spells",
          filter: { level: 1, list: "{choice:spellList}" },
          grant: { type: "spell", spell: "{value}", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } } },
      ] },
  ],
});
