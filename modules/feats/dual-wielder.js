// Don général : Combattant à deux armes (Dual Wielder) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/combattant-a-deux-armes)
registerModule({
  kind: "feat", id: "dual-wielder", category: "general", aidedd: "combattant-a-deux-armes",
  name: { fr: "Combattant à deux armes", en: "Dual Wielder" },
  description: "+1 For ou Dex. Attaque extra avec une arme de corps à corps sans la propriété Deux mains. Dégainer ou ranger deux armes",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "dual-wielder", combat: true, name: { fr: "Combattant à deux armes", en: "Dual Wielder" },
      description: "Combat à deux armes amélioré : Lorsque vous prenez l'action Attaque pendant votre tour et attaquez avec une arme qui possède la propriété Légère, vous pouvez effectuer une attaque supplémentaire en tant qu'action Bonus plus tard au cours du même tour avec une arme différente, qui doit être une arme de corps à corps sans la propriété Deux mains. Vous n'ajoutez pas votre modificateur de caractéristique aux dégâts de l'attaque supplémentaire, sauf si ce modificateur est négatif. Dégainage rapide : Vous pouvez dégainer ou ranger deux armes sans la propriété Deux mains alors que vous ne pourriez normalement n'en dégainer ou ranger qu'une seule.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
