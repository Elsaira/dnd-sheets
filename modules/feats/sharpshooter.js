// Don général : Tireur d'élite (Sharpshooter) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/tireur-d-elite)
registerModule({
  kind: "feat", id: "sharpshooter", category: "general", aidedd: "tireur-d-elite",
  name: { fr: "Tireur d'élite", en: "Sharpshooter" },
  description: "+1 Dex. Vos attaques à distance ignorent les Abris partiels et importants. Pas de Désavantage au contact ou à longue portée",
  prerequisite: DND.feat.requires({ level: 4, scores: ["dex"] }, "Niveau 4, Dextérité 13"),
  features: [
    { id: "sharpshooter", combat: true, name: { fr: "Tireur d'élite", en: "Sharpshooter" },
      description: "Contournement d'abri : Vos attaques à distance avec des armes ignorent les Abris partiels (1/2) et les Abris importants (3/4). Tir au corps à corps : Être à 1,50 mètre ou moins d'un ennemi n'inflige pas de Désavantage à vos jets d'attaque avec des armes à distance. Longue portée : Attaquer à longue portée n'inflige pas de Désavantage à vos jets d'attaque avec des armes à distance.",
      effects: [
        DND.feat.ability(["dex"]),
      ] },
  ],
});
