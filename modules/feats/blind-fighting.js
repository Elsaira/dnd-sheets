// Don de style de combat : Combat en aveugle (Blind Fighting) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/combat-en-aveugle)
registerModule({
  kind: "feat", id: "blind-fighting", category: "fighting-style", aidedd: "combat-en-aveugle",
  name: { fr: "Combat en aveugle", en: "Blind Fighting" },
  description: "Octroie Vision Aveugle avec une portée de 3 m",
  features: [
    { id: "blind-fighting", combat: true, name: { fr: "Combat en aveugle", en: "Blind Fighting" },
      description: "Vous possédez Vision aveugle avec une portée de 3 mètres.",
      effects: [
        { type: "sense", sense: "blindsight", range: 10 },
      ] },
  ],
});
