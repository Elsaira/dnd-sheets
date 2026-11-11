// Historique : Acolyte — SRD 5.2
registerModule({
  kind: "background", id: "acolyte",
  name: { fr: "Acolyte", en: "Acolyte" },
  description: "Intelligence, Sagesse, Charisme · Initié à la magie (Clerc) · Intuition, Religion · Matériel de calligraphe.",
  features: [
    { id: "acolyte", name: { fr: "Acolyte", en: "Acolyte" },
      description: "Équipement : (A) Matériel de calligraphe, livre (prières), symbole sacré, parchemin (10 feuilles), robe, 8 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["int", "wis", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "magic-initiate", preset: { spellList: "cleric" } },
        { type: "proficiency", target: "skill.insight" },
        { type: "proficiency", target: "skill.religion" },
        { type: "proficiency", target: "tool.calligraphers-supplies" },
      ] },
  ],
});
