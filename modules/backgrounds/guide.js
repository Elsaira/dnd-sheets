// Historique : Guide — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "guide",
  name: { fr: "Guide", en: "Guide" },
  description: "Dextérité, Constitution, Sagesse · Initié à la magie · Discrétion, Survie · Outils de cartographe.",
  features: [
    { id: "guide", name: { fr: "Guide", en: "Guide" },
      description: "Équipement : (A) Arc court, 20 flèches, outils de cartographe, sac de couchage, carquois, tente, tenue de voyage, 3 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["dex", "con", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "magic-initiate", preset: { spellList: "druid" } },
        { type: "proficiency", target: "skill.stealth" },
        { type: "proficiency", target: "skill.survival" },
        { type: "proficiency", target: "tool.cartographers-tools" },
      ] },
  ],
});
