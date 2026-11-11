// Historique : Noble — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "noble",
  name: { fr: "Noble", en: "Noble" },
  description: "Force, Intelligence, Charisme · Doué · Histoire, Persuasion · Une boîte de jeux.",
  features: [
    { id: "noble", name: { fr: "Noble", en: "Noble" },
      description: "Équipement : (A) Boîte de jeux (identique à ci-dessus), beaux habits, parfum, 29 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "int", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "skilled" },
        { type: "proficiency", target: "skill.history" },
        { type: "proficiency", target: "skill.persuasion" },
        { type: "choice", id: "tool", label: "Boîte de jeux maîtrisée", from: "tools.gaming" },
      ] },
  ],
});
