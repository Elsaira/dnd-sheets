// Don général : Trancheur (Slasher) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/trancheur)
registerModule({
  kind: "feat", id: "slasher", category: "general", aidedd: "trancheur",
  name: { fr: "Trancheur", en: "Slasher" },
  description: "+1 For ou Dex. Si dégâts tranchants, réduisez la Vitesse de 3 m (1/tour). Critique tranchant donne un Désavantage aux attaques",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "slasher", combat: true, name: { fr: "Trancheur", en: "Slasher" },
      description: "Coupe-jarret : Une fois par tour, lorsque vous touchez une créature avec une attaque infligeant des dégâts tranchants, vous pouvez réduire la vitesse de cette créature de 3 mètres jusqu'au début de votre prochain tour. Critique amélioré : Lorsque vous réussissez un Coup critique infligeant des dégâts tranchants à une créature, celle-ci subit un Désavantage aux jets d'attaque jusqu'au début de votre prochain tour.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
