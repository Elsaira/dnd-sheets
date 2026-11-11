// Don général : Amélioration de caractéristique (Ability Score Improvement) — SRD 5.2
registerModule({
  kind: "feat", id: "ability-score-improvement", category: "general", repeatable: true,
  name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
  description: "+2 à une caractéristique ou +1 à deux caractéristiques (maximum 20).",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "asi", name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
      description: "Augmentez une caractéristique de 2, ou deux caractéristiques de 1. Une valeur ne peut pas dépasser 20 ainsi.",
      effects: [{ type: "choice", id: "asi", label: "+2 à une caractéristique ou +1 à deux", count: 2, maxPerOption: 2, from: "abilities",
        grant: { type: "ability", ability: "{value}", value: 1, max: 20 } }] },
  ],
});
