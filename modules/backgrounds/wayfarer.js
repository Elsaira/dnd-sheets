// Historique : Voyageur (Wayfarer) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "wayfarer",
  name: { fr: "Voyageur", en: "Wayfarer" },
  description: "Dextérité, Sagesse, Charisme · Chanceux · Discrétion, Intuition · Outils de voleur.",
  features: [
    { id: "wayfarer", name: { fr: "Voyageur", en: "Wayfarer" },
      description: "Équipement : (A) 2 dagues, outils de voleur, boîte de jeux (au choix), sac de couchage, 2 sacoches, tenue de voyage, 16 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["dex", "wis", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "lucky" },
        { type: "proficiency", target: "skill.stealth" },
        { type: "proficiency", target: "skill.insight" },
        { type: "proficiency", target: "tool.thieves-tools" },
      ] },
  ],
});
