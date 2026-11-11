// Don de faveur épique : Faveur de vision véritable (Boon of Truesight) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-vision-veritable-vision-lucide)
registerModule({
  kind: "feat", id: "boon-of-truesight", category: "epic-boon", aidedd: "faveur-de-vision-veritable-vision-lucide",
  name: { fr: "Faveur de vision véritable", en: "Boon of Truesight" },
  description: "+1 à une caractéristique (max 30). Vision véritable 18 m",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-truesight", name: { fr: "Faveur de vision véritable", en: "Boon of Truesight" },
      description: "Aussi appelé « vision lucide ». Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Vision véritable : vous avez la vision véritable sur 18 m.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "sense", sense: "truesight", range: 60 },
      ] },
  ],
});
