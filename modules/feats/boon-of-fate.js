// Don de faveur épique : Faveur du destin (Boon of Fate) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-du-destin)
registerModule({
  kind: "feat", id: "boon-of-fate", category: "epic-boon", aidedd: "faveur-du-destin",
  name: { fr: "Faveur du destin", en: "Boon of Fate" },
  description: "+1 à une caractéristique (max 30). ±2d4 sur un test de d20 proche",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-fate", name: { fr: "Faveur du destin", en: "Boon of Fate" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Améliorer le destin : quand vous ou une créature à 18 m ou moins réussissez ou ratez un test de d20, vous pouvez lancer 2d4 et appliquer le total en bonus ou en malus. Ensuite, plus avant votre prochain jet d'initiative ou la fin d'un repos court ou long.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "resource", id: "improveFate", name: { fr: "Améliorer le destin", en: "Improve Fate" }, max: 1, recharge: "short" },
      ] },
  ],
});
