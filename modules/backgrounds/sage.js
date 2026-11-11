// Historique : Sage — SRD 5.2
registerModule({
  kind: "background", id: "sage",
  name: { fr: "Sage", en: "Sage" },
  description: "Constitution, Intelligence, Sagesse · Initié à la magie (Magicien) · Arcanes, Histoire · Matériel de calligraphe.",
  features: [
    { id: "sage", name: { fr: "Sage", en: "Sage" },
      description: "Équipement : (A) Bâton, matériel de calligraphe, livre (histoire), parchemin (8 feuilles), robe, 8 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["con", "int", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "magic-initiate", preset: { spellList: "wizard" } },
        { type: "proficiency", target: "skill.arcana" },
        { type: "proficiency", target: "skill.history" },
        { type: "proficiency", target: "tool.calligraphers-supplies" },
      ] },
  ],
});
