// Don général : Duelliste défensif (Defensive Duelist) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/duelliste-defensif)
registerModule({
  kind: "feat", id: "defensive-duelist", category: "general", aidedd: "duelliste-defensif",
  name: { fr: "Duelliste défensif", en: "Defensive Duelist" },
  description: "+1 Dex. Si vous tenez une arme de Finesse, Réaction si touché au corps à corps pour ajouter votre bonus de maîtrise à la CA",
  prerequisite: DND.feat.requires({ level: 4, scores: ["dex"] }, "Niveau 4, Dextérité 13"),
  features: [
    { id: "defensive-duelist", name: { fr: "Duelliste défensif", en: "Defensive Duelist" },
      description: "Parade : Si vous tenez une arme de Finesse et qu'une autre créature vous touche au corps à corps, vous pouvez prendre une Réaction pour ajouter votre bonus de maîtrise à votre Classe d'Armure, ce qui peut faire en sorte que l'attaque vous rate. Vous bénéficiez de ce bonus à votre CA contre les attaques au corps à corps jusqu'au début de votre prochain tour.",
      effects: [
        DND.feat.ability(["dex"]),
        { type: "action", actionType: "reaction", name: { fr: "Parade", en: "Parry" }, description: (c) => "Si vous tenez une arme de Finesse et qu'une créature vous touche au corps à corps : +" + c.pb + " à la CA contre les attaques au corps à corps jusqu'au début de votre prochain tour." },
      ] },
  ],
});
