// Historique : Criminel (Criminal) — SRD 5.2
registerModule({
  kind: "background", id: "criminal",
  name: { fr: "Criminel", en: "Criminal" },
  description: "Dextérité, Constitution, Intelligence · Vigilant · Escamotage, Discrétion · Outils de voleur.",
  features: [
    { id: "criminal", name: { fr: "Criminel", en: "Criminal" },
      description: "Équipement : (A) 2 dagues, outils de voleur, pied-de-biche, 2 sacoches, tenue de voyage, 16 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["dex", "con", "int"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "alert" },
        { type: "proficiency", target: "skill.sleight-of-hand" },
        { type: "proficiency", target: "skill.stealth" },
        { type: "proficiency", target: "tool.thieves-tools" },
      ] },
  ],
});
