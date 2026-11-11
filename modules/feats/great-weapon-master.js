// Don général : Maître des armes lourdes (Great Weapon Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-des-armes-lourdes-cogneur-lourd)
registerModule({
  kind: "feat", id: "great-weapon-master", category: "general", aidedd: "maitre-des-armes-lourdes-cogneur-lourd",
  name: { fr: "Maître des armes lourdes", en: "Great Weapon Master" },
  description: "+1 For. Arme Lourde inflige des dégâts extra (Bonus de Maîtrise). Critique ou réduit à 0 pv donne une attaque Bonus",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str"] }, "Niveau 4, Force 13"),
  features: [
    { id: "great-weapon-master", combat: true, name: { fr: "Maître des armes lourdes", en: "Great Weapon Master" },
      description: "Aussi appelé « Cogneur lourd ». Expert en armes lourdes : Lorsque vous touchez une créature avec une arme possédant la propriété Lourde lors de l'action Attaque à votre tour, vous pouvez infliger des dégâts supplémentaires à la cible. Ces dégâts supplémentaires sont égaux à votre bonus de maîtrise. Abattage : Immédiatement après avoir réussi un Coup critique avec une arme de corps à corps ou réduit une créature à 0 point de vie avec une telle arme, vous pouvez effectuer une attaque avec la même arme en tant qu'action Bonus.",
      effects: [
        DND.feat.ability(["str"]),
      ] },
  ],
});
