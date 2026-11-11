// Don de style de combat : Défense (Defense) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/defense)
registerModule({
  kind: "feat", id: "defense", category: "fighting-style", aidedd: "defense",
  name: { fr: "Défense", en: "Defense" },
  description: "Lorsque vous portez une armure légère, intermédiaire ou lourde, octroie un bonus de +1 à la CA",
  features: [
    { id: "defense", name: { fr: "Défense", en: "Defense" },
      description: "Lorsque vous portez une armure légère, intermédiaire ou lourde, vous obtenez un bonus de +1 à la Classe d'Armure.",
      effects: [
        { type: "bonus", target: "ac", value: 1, label: "Défense", when: (c) => DND.feat.wearing(c, "any") },
      ] },
  ],
});
