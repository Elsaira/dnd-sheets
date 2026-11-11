// Don de faveur épique : Faveur de l'esprit nocturne (Boon of the Night Spirit) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-l-esprit-nocturne)
registerModule({
  kind: "feat", id: "boon-of-the-night-spirit", category: "epic-boon", aidedd: "faveur-de-l-esprit-nocturne",
  name: { fr: "Faveur de l'esprit nocturne", en: "Boon of the Night Spirit" },
  description: "+1 à une caractéristique (max 30). Invisible et résistant dans l'ombre",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-the-night-spirit", name: { fr: "Faveur de l'esprit nocturne", en: "Boon of the Night Spirit" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Fusion avec les ombres : dans une lumière faible ou les ténèbres, par une action Bonus, vous devenez Invisible jusqu'à ce que vous preniez une action, une action Bonus ou une Réaction. Forme ténébreuse : dans une lumière faible ou les ténèbres, vous avez la résistance à tous les dégâts sauf psychiques et radiants.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "action", actionType: "bonus", name: { fr: "Fusion avec les ombres", en: "Merge with Shadows" }, description: "Dans une lumière faible ou les ténèbres : devenir Invisible jusqu'à ce que vous preniez une action, une action Bonus ou une Réaction." },
      ] },
  ],
});
