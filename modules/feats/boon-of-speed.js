// Don de faveur épique : Faveur de vitesse (Boon of Speed) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-vitesse)
registerModule({
  kind: "feat", id: "boon-of-speed", category: "epic-boon", aidedd: "faveur-de-vitesse",
  name: { fr: "Faveur de vitesse", en: "Boon of Speed" },
  description: "+1 à une caractéristique (max 30). Vitesse +9 m, Désengagement en action Bonus",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-speed", name: { fr: "Faveur de vitesse", en: "Boon of Speed" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Rapidité : votre vitesse augmente de 9 m. Évasion : par une action Bonus, vous pouvez prendre l'action Désengagement, qui met aussi fin à l'état Agrippé sur vous.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "bonus", target: "speed", value: 30, label: "Faveur de vitesse" },
        { type: "action", actionType: "bonus", name: { fr: "Esquive rapide", en: "Escape Artist" }, description: "Prendre l'action Désengagement, qui met aussi fin à l'état Agrippé sur vous." },
      ] },
  ],
});
