// Historique : Marchand (Merchant) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "merchant",
  name: { fr: "Marchand", en: "Merchant" },
  description: "Constitution, Intelligence, Charisme · Chanceux · Dressage, Persuasion · Instruments de navigateur.",
  features: [
    { id: "merchant", name: { fr: "Marchand", en: "Merchant" },
      description: "Équipement : (A) Instruments de navigateur, 2 sacoches, tenue de voyage, 22 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["con", "int", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "lucky" },
        { type: "proficiency", target: "skill.animal-handling" },
        { type: "proficiency", target: "skill.persuasion" },
        { type: "proficiency", target: "tool.navigators-tools" },
      ] },
  ],
});
