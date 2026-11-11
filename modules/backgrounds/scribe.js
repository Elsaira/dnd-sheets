// Historique : Scribe — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "scribe",
  name: { fr: "Scribe", en: "Scribe" },
  description: "Dextérité, Intelligence, Sagesse · Doué · Investigation, Perception · Matériel de calligraphe.",
  features: [
    { id: "scribe", name: { fr: "Scribe", en: "Scribe" },
      description: "Équipement : (A) Matériel de calligraphe, beaux habits, lampe, huile (3 flasques), parchemin (12 feuilles), 23 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["dex", "int", "wis"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "skilled" },
        { type: "proficiency", target: "skill.investigation" },
        { type: "proficiency", target: "skill.perception" },
        { type: "proficiency", target: "tool.calligraphers-supplies" },
      ] },
  ],
});
