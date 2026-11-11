// Historique : Soldat (Soldier) — SRD 5.2
registerModule({
  kind: "background", id: "soldier",
  name: { fr: "Soldat", en: "Soldier" },
  description: "Force, Dextérité, Constitution · Sauvagerie martiale · Athlétisme, Intimidation · une boîte de jeux.",
  features: [
    { id: "soldier", name: { fr: "Soldat", en: "Soldier" },
      description: "Équipement : (A) Lance, arc court, 20 flèches, boîte de jeux (identique à ci-dessus), trousse de soins, carquois, tenue de voyage, 14 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "dex", "con"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "savage-attacker" },
        { type: "proficiency", target: "skill.athletics" },
        { type: "proficiency", target: "skill.intimidation" },
        { type: "choice", id: "gamingSet", label: "Boîte de jeux maîtrisée", from: "tools.gaming" },
      ] },
  ],
});
