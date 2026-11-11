// Don de faveur épique : Faveur de mémoire magique (Boon of Spell Recall) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-memoire-magique)
registerModule({
  kind: "feat", id: "boon-of-spell-recall", category: "epic-boon", aidedd: "faveur-de-memoire-magique",
  name: { fr: "Faveur de mémoire magique", en: "Boon of Spell Recall" },
  description: "+1 Int, Sag ou Cha (max 30). Un sort de niveau 1 à 4 gratuit par repos long",
  prerequisite: DND.feat.requires({ level: 19, spellcasting: true }, "Niveau 19, capacité Sorts"),
  features: [
    { id: "boon-of-spell-recall", name: { fr: "Faveur de mémoire magique", en: "Boon of Spell Recall" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Incantation gratuite : une fois par repos long, vous pouvez lancer un sort préparé avec un emplacement de niveau 1 à 4 sans dépenser l'emplacement.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"], 30),
        { type: "resource", id: "freeCasting", name: { fr: "Incantation gratuite", en: "Free Casting" }, max: 1, recharge: "long" },
      ] },
  ],
});
