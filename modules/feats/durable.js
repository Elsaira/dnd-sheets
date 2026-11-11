// Don général : Gaillard (Durable) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/gaillard)
registerModule({
  kind: "feat", id: "durable", category: "general", aidedd: "gaillard",
  name: { fr: "Gaillard", en: "Durable" },
  description: "+1 Con. Avantage aux jets de sauvegarde contre la mort. Action Bonus pour dépenser un Dé de Vie et regagner ces PV",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "durable", combat: "Avantage aux jets de sauvegarde contre la mort.", name: { fr: "Gaillard", en: "Durable" },
      description: "Trompe-la-mort : Vous bénéficiez d'un Avantage aux jets de sauvegarde contre la mort. Récupération rapide : Par une action Bonus, vous pouvez dépenser un de vos Dés de vie, lancer le dé et regagner un nombre de points de vie égal au résultat.",
      effects: [
        DND.feat.ability(["con"]),
        { type: "action", actionType: "bonus", name: { fr: "Récupération rapide", en: "Speedy Recovery" }, description: "Dépensez un de vos dés de vie, lancez-le et regagnez autant de PV." },
      ] },
  ],
});
