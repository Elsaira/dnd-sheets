// Historique : Garde (Guard) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "guard",
  name: { fr: "Garde", en: "Guard" },
  description: "Force, Intelligence, Sagesse · Vigilant · Athlétisme, Perception · Une boîte de jeux.",
  features: [
    { id: "guard", name: { fr: "Garde", en: "Guard" },
      description: "Équipement : (A) Lance, arbalète légère, 20 carreaux, boîte de jeux (identique à ci-dessus), lanterne à capote, menottes, carquois, tenue de voyage, 12 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "int", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "alert" },
        { type: "proficiency", target: "skill.athletics" },
        { type: "proficiency", target: "skill.perception" },
        { type: "choice", id: "tool", label: "Boîte de jeux maîtrisée", from: "tools.gaming" },
      ] },
  ],
});
