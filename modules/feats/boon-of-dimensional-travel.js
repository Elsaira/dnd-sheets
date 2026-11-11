// Don de faveur épique : Faveur de déplacement dimensionnel (Boon of Dimensional Travel) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-deplacement-dimensionnel)
registerModule({
  kind: "feat", id: "boon-of-dimensional-travel", category: "epic-boon", aidedd: "faveur-de-deplacement-dimensionnel",
  name: { fr: "Faveur de déplacement dimensionnel", en: "Boon of Dimensional Travel" },
  description: "+1 à une caractéristique (max 30). Téléportation de 9 m après l'action Attaque ou Magie",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-dimensional-travel", name: { fr: "Faveur de déplacement dimensionnel", en: "Boon of Dimensional Travel" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Pas de clignotement : juste après avoir pris l'action Attaque ou Magie, vous pouvez vous téléporter jusqu'à 9 m vers un espace inoccupé que vous voyez.",
      effects: [
        DND.feat.ability("abilities", 30),
      ] },
  ],
});
