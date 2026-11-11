// Don général : Mobile (Speedy) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/mobile)
registerModule({
  kind: "feat", id: "speedy", category: "general", aidedd: "mobile",
  name: { fr: "Mobile", en: "Speedy" },
  description: "+1 Dex ou Con. Vitesse +3 m. Pointe ignore un terrain difficile. Les attaques d'opportunité contre vous ont un Désavantage",
  prerequisite: DND.feat.requires({ level: 4, scores: ["dex", "con"] }, "Niveau 4, Dextérité ou Constitution 13"),
  features: [
    { id: "speedy", combat: true, name: { fr: "Mobile", en: "Speedy" },
      description: "Vitesse améliorée : Votre vitesse augmente de 3 mètres. Pointe sur Terrain difficile : Lorsque vous prenez l'action Pointe pendant votre tour, un terrain difficile ne vous coûte pas un mouvement supplémentaire pour le reste de ce tour. Déplacement agile : Les attaques d'opportunité ont un Désavantage contre vous.",
      effects: [
        DND.feat.ability(["dex", "con"]),
        { type: "bonus", target: "speed", value: 10, label: "Mobile" },
      ] },
  ],
});
