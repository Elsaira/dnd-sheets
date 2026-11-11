// Don général : Empoigneur (Grappler) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/empoigneur)
registerModule({
  kind: "feat", id: "grappler", category: "general", aidedd: "empoigneur",
  name: { fr: "Empoigneur", en: "Grappler" },
  description: "+1 For ou Dex. Frappe à mains nues permet Dégâts + Lutte (1/tour). Avantage contre une cible agrippée. Déplacer une cible agrippée",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "grappler", combat: true, name: { fr: "Empoigneur", en: "Grappler" },
      description: "Frappe et empoignade : Lorsque vous touchez une créature avec une Frappe à mains nues lors de votre action Attaque pendant votre tour, vous pouvez utiliser à la fois les options Dégâts et Lutte. Vous ne pouvez utiliser cet avantage qu'une fois par tour. Attaque avec Avantage : Vous bénéficiez d'un Avantage aux jets d'attaque contre une créature que vous agrippez. Lutteur rapide : Vous n'avez pas besoin de dépenser un mouvement supplémentaire pour déplacer une créature que vous agrippez si celle-ci est de votre taille ou plus petite.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
