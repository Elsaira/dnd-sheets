// Historique : Ermite (Hermit) — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "hermit",
  name: { fr: "Ermite", en: "Hermit" },
  description: "Constitution, Sagesse, Charisme · Guérisseur · Médecine, Religion · Matériel d'herboriste.",
  features: [
    { id: "hermit", name: { fr: "Ermite", en: "Hermit" },
      description: "Équipement : (A) Bâton de combat, matériel d'herboriste, sac de couchage, livre (philosophie), lampe, huile (3 flasques), tenue de voyage, 16 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["con", "wis", "cha"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "healer" },
        { type: "proficiency", target: "skill.medicine" },
        { type: "proficiency", target: "skill.religion" },
        { type: "proficiency", target: "tool.herbalism-kit" },
      ] },
  ],
});
