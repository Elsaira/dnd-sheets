// Don de faveur épique : Faveur de prouesse martiale (Boon of Combat Prowess) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-prouesse-martiale)
registerModule({
  kind: "feat", id: "boon-of-combat-prowess", category: "epic-boon", aidedd: "faveur-de-prouesse-martiale",
  name: { fr: "Faveur de prouesse martiale", en: "Boon of Combat Prowess" },
  description: "+1 à une caractéristique (max 30). Transformer un raté en touche, 1 fois par tour",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-combat-prowess", combat: true, name: { fr: "Faveur de prouesse martiale", en: "Boon of Combat Prowess" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Visée infaillible : quand vous ratez un jet d'attaque, vous pouvez toucher à la place. Une fois utilisé, pas avant le début de votre prochain tour.",
      effects: [
        DND.feat.ability("abilities", 30),
      ] },
  ],
});
