// Don d'origine : Robuste (Tough) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "tough", category: "origin",
  name: { fr: "Robuste", en: "Tough" },
  description: "+2 PV maximum par niveau.",
  features: [
    { id: "tough", name: { fr: "Robuste", en: "Tough" },
      description: "Vos PV maximum augmentent de deux fois votre niveau de personnage, puis de 2 à chaque niveau suivant.",
      effects: [{ type: "bonus", target: "hpPerLevel", value: 2 }] },
  ],
});
