// Don général : Expert de la charge (Charger) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/expert-de-la-charge)
registerModule({
  kind: "feat", id: "charger", category: "general", aidedd: "expert-de-la-charge",
  name: { fr: "Expert de la charge", en: "Charger" },
  description: "+1 For ou Dex. Vitesse en Pointe +3 m. Se déplacer de 3+ m avant de toucher pour infliger +1d8 ou repousser de 3 m (1/tour)",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "charger", combat: true, name: { fr: "Expert de la charge", en: "Charger" },
      description: "Pointe améliorée : Lorsque vous prenez l'action Pointe, votre vitesse augmente de 3 mètres pour cette action. Attaque de charge : Si vous vous déplacez d'au moins 3 mètres en ligne droite vers une cible juste avant de la toucher avec un jet d'attaque au corps à corps dans le cadre de l'action Attaque, choisissez l'un des effets suivants : vous obtenez un bonus de 1d8 aux dégâts de l'attaque, ou vous repoussez la cible jusqu'à 3 mètres si elle ne fait pas plus d'une taille de plus que vous. Vous ne pouvez utiliser cet avantage qu'une seule fois par tour.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
