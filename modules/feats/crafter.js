// Don d'origine : Façonneur (Crafter) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "crafter", category: "origin",
  name: { fr: "Façonneur", en: "Crafter" },
  description: "Trois outils d'artisan, 20 % de réduction, fabrication rapide au repos long.",
  features: [
    { id: "crafter", name: { fr: "Façonneur", en: "Crafter" },
      description: "Maîtrise d'outils : trois outils d'artisan différents de la table Fabrication rapide. Ristourne : 20 % de réduction sur tout objet non magique acheté. Façonnage rapide : à la fin d'un repos long, vous pouvez fabriquer un objet de la table Fabrication rapide si vous possédez et maîtrisez les outils associés ; il dure jusqu'à la fin de votre prochain repos long. Table : bricoleur (boîte à amadou, cloche, pelle), charpentier (échelle, torche), forgeron (billes, chausse-trappes, grappin, pot en fer, seau), maçon (palan), menuisier (gourdin, masse, bâton de combat), potier (cruche, lampe), tanneur (étui, sacoche), tisserand (corde, filet, panier, tente).",
      effects: [{ type: "choice", id: "tools", label: "Outils d'artisan (Fabrication rapide)", count: 3,
        from: ["tool.tinkers-tools", "tool.carpenters-tools", "tool.smiths-tools", "tool.masons-tools", "tool.woodcarvers-tools", "tool.potters-tools", "tool.leatherworkers-tools", "tool.weavers-tools"] }] },
  ],
});
