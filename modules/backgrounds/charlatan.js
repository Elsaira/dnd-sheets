// Historique : Charlatan — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "charlatan",
  name: { fr: "Charlatan", en: "Charlatan" },
  description: "Dextérité, Constitution, Charisme · Doué · Escamotage, Tromperie · Matériel de contrefaçon.",
  features: [
    { id: "charlatan", name: { fr: "Charlatan", en: "Charlatan" },
      description: "Équipement : (A) Matériel de contrefaçon, costume, beaux habits, 15 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["dex", "con", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "skilled" },
        { type: "proficiency", target: "skill.sleight-of-hand" },
        { type: "proficiency", target: "skill.deception" },
        { type: "proficiency", target: "tool.forgery-kit" },
      ] },
  ],
});
