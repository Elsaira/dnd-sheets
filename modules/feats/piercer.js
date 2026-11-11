// Don général : Empaleur (Piercer) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/empaleur-perforateur)
registerModule({
  kind: "feat", id: "piercer", category: "general", aidedd: "empaleur-perforateur",
  name: { fr: "Empaleur", en: "Piercer" },
  description: "+1 For ou Dex. Si dégâts perforants, relancer un dé (1/tour). Critique perforant ajoute un dé de dégâts supplémentaire",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "piercer", combat: true, name: { fr: "Empaleur", en: "Piercer" },
      description: "Aussi appelé « Perforateur ». Perforation : Une fois par tour, lorsque vous touchez une créature avec une attaque infligeant des dégâts perforants, vous pouvez relancer l'un des dés de dégâts de l'attaque et vous devez utiliser le nouveau jet. Critique renforcé : Lorsque vous réussissez un Coup critique infligeant des dégâts perforants à une créature, vous pouvez lancer un dé de dégâts supplémentaire pour déterminer les dégâts perforants supplémentaires subis par la cible.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
