// Don général : Discret (Skulker) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/discret)
registerModule({
  kind: "feat", id: "skulker", category: "general", aidedd: "discret",
  name: { fr: "Discret", en: "Skulker" },
  description: "+1 Dex. Vision aveugle sur 3 m. Avantage aux jets de Discrétion en combat. Attaque manquée en étant caché ne vous révèle pas",
  prerequisite: DND.feat.requires({ level: 4, scores: ["dex"] }, "Niveau 4, Dextérité 13"),
  features: [
    { id: "skulker", combat: true, name: { fr: "Discret", en: "Skulker" },
      description: "Vision aveugle : Vous obtenez de Vision aveugle avec une portée de 3 mètres. Brouillard de guerre : Vous exploitez les distractions du combat et obtenez un Avantage à chaque jet de Dextérité (Discrétion) effectué lors de l'action Furtivité pendant le combat. Tireur discret : Si vous effectuez un jet d'attaque caché et que celui-ci échoue, votre position n'est pas révélée.",
      effects: [
        DND.feat.ability(["dex"]),
        { type: "sense", sense: "blindsight", range: 10 },
      ] },
  ],
});
