// Don général : Comédien (Actor) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/comedien)
registerModule({
  kind: "feat", id: "actor", category: "general", aidedd: "comedien",
  name: { fr: "Comédien", en: "Actor" },
  description: "+1 Cha. Avantage en Tromperie/Représentation si déguisé. Jet de Sagesse (Intuition) pour détecter vos imitations",
  prerequisite: DND.feat.requires({ level: 4, scores: ["cha"] }, "Niveau 4, Charisme 13"),
  features: [
    { id: "actor", name: { fr: "Comédien", en: "Actor" },
      description: "Imposture : Lorsque vous êtes déguisé en une personne, qu'elle soit réelle ou fictive, vous avez un Avantage aux jets de Charisme (Tromperie ou Représentation) pour convaincre les autres que vous êtes bien cette personne. Imitation : Vous pouvez imiter les bruits d'autres créatures, y compris la parole. Une créature qui entend ce mimétisme doit réussir un jet de Sagesse (Intuition) pour se rendre compte qu'il s'agit d'une imitation (DD 8 plus votre modificateur de Charisme et votre bonus de maîtrise).",
      effects: [
        DND.feat.ability(["cha"]),
      ] },
  ],
});
