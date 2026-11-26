// Don général : Maître des boucliers (Shield Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-des-boucliers)
registerModule({
  kind: "feat", id: "shield-master", category: "general", aidedd: "maitre-des-boucliers",
  name: { fr: "Maître des boucliers", en: "Shield Master" },
  description: "+1 For. Coup de bouclier pour repousser de 1,50 m ou faire tomber À terre. Réaction pour annuler les dégâts si JdS de Dex réussi",
  prerequisite: DND.feat.requires({ level: 4, armor: "shield" }, "Niveau 4, formation aux boucliers"),
  features: [
    { id: "shield-master", combat: (c) => "Une fois par tour, bouclier équipé, quand vous touchez au corps à corps pendant l'action Attaque : JS de Force DD " + (8 + c.mod.str + c.pb) + " ou la cible est repoussée de 1,50 m ou tombe À terre.", name: { fr: "Maître des boucliers", en: "Shield Master" },
      description: "Coup de bouclier : Si vous attaquez une créature à 1,50 m ou moins de vous lors de l'action Attaque et que vous la touchez avec une arme de corps à corps, vous pouvez immédiatement frapper la cible avec votre bouclier si vous en êtes équipé, la forçant à effectuer un jet de sauvegarde de Force (DD 8 plus votre modificateur de Force et votre bonus de maîtrise). En cas d'échec, vous pouvez repousser la cible de 1,50 m ou la faire tomber À terre (au choix). Vous ne pouvez utiliser cet avantage qu'une seule fois par tour. Interposition de bouclier : Si vous êtes soumis à un effet vous permettant d'effectuer un jet de sauvegarde de Dextérité pour ne subir que la moitié des dégâts, vous pouvez prendre une Réaction pour ne subir aucun dégât si vous réussissez le jet de sauvegarde et que vous portez un bouclier.",
      effects: [
        DND.feat.ability(["str"]),
        { type: "action", actionType: "reaction", name: { fr: "Interposition de bouclier", en: "Interpose Shield" }, description: "Avec un bouclier, quand un effet permet un JS de Dextérité pour demi-dégâts : aucun dégât si vous réussissez." },
      ] },
  ],
});
