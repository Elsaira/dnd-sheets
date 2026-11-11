// Historique : Fermier (Farmer) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "farmer",
  name: { fr: "Fermier", en: "Farmer" },
  description: "Force, Constitution, Sagesse · Robuste · Dressage, Nature · Outils de charpentier.",
  features: [
    { id: "farmer", name: { fr: "Fermier", en: "Farmer" },
      description: "Équipement : (A) Serpe, outils de charpentier, trousse de soins, pot en fer, pelle, tenue de voyage, 30 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "con", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "tough" },
        { type: "proficiency", target: "skill.animal-handling" },
        { type: "proficiency", target: "skill.nature" },
        { type: "proficiency", target: "tool.carpenters-tools" },
      ] },
  ],
});
