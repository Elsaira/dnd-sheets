// Historique : Marin (Sailor) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "sailor",
  name: { fr: "Marin", en: "Sailor" },
  description: "Force, Dextérité, Sagesse · Bagarreur de tavernes · Acrobaties, Perception · Instruments de navigateur.",
  features: [
    { id: "sailor", name: { fr: "Marin", en: "Sailor" },
      description: "Équipement : (A) Dague, instruments de navigateur, corde, tenue de voyage, 20 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "dex", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "tavern-brawler" },
        { type: "proficiency", target: "skill.acrobatics" },
        { type: "proficiency", target: "skill.perception" },
        { type: "proficiency", target: "tool.navigators-tools" },
      ] },
  ],
});
