// Don général : Maître-arbalétrier (Crossbow Expert) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-arbaletrier)
registerModule({
  kind: "feat", id: "crossbow-expert", category: "general", aidedd: "maitre-arbaletrier",
  name: { fr: "Maître-arbalétrier", en: "Crossbow Expert" },
  description: "+1 Dex. Ignore le Chargement des arbalètes. Pas de Désavantage au contact. Ajoute mod. aux dégâts d'attaque extra d'arme Légère",
  prerequisite: DND.feat.requires({ level: 4, scores: ["dex"] }, "Niveau 4, Dextérité 13"),
  features: [
    { id: "crossbow-expert", combat: true, name: { fr: "Maître-arbalétrier", en: "Crossbow Expert" },
      description: "Chargement rapide : Vous ignorez la propriété Chargement de l'arbalète de poing, de l'arbalète lourde et de l'arbalète légère (toutes appelées arbalètes par la suite dans ce don). Si vous tenez l'une d'elles, vous pouvez charger une munition même sans main libre. Tir au corps à corps : Être à 1,50 mètre ou moins d'un ennemi n'inflige pas de Désavantage à vos jets d'attaque avec des arbalètes. Arbalète secondaire : Lorsque vous effectuez l'attaque supplémentaire de la propriété Légère, vous pouvez ajouter votre modificateur de caractéristique aux dégâts de l'attaque supplémentaire si cette attaque est effectuée avec une arbalète qui possède la propriété Légère et que vous n'ajoutez pas déjà ce modificateur aux dégâts.",
      effects: [
        DND.feat.ability(["dex"]),
      ] },
  ],
});
