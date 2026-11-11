// Historique : Artiste (Entertainer) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "entertainer",
  name: { fr: "Artiste", en: "Entertainer" },
  description: "Force, Dextérité, Charisme · Musicien · Acrobaties, Représentation · Un instrument de musique.",
  features: [
    { id: "entertainer", name: { fr: "Artiste", en: "Entertainer" },
      description: "Équipement : (A) Instrument de musique (identique à ci-dessus), 2 costumes, miroir, parfum, tenue de voyage, 11 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "dex", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "musician" },
        { type: "proficiency", target: "skill.acrobatics" },
        { type: "proficiency", target: "skill.performance" },
        { type: "choice", id: "tool", label: "Instrument de musique maîtrisé", from: "tools.musical" },
      ] },
  ],
});
