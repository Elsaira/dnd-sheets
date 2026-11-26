// Don de faveur épique : Faveur de vigueur (Boon of Fortitude) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-vigueur)
registerModule({
  kind: "feat", id: "boon-of-fortitude", category: "epic-boon", aidedd: "faveur-de-vigueur",
  name: { fr: "Faveur de vigueur", en: "Boon of Fortitude" },
  description: "+1 à une caractéristique (max 30). +40 PV maximum",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-fortitude", combat: (c) => "Quand vous regagnez des PV : +" + c.mod.con + " PV en plus (une fois par tour).", name: { fr: "Faveur de vigueur", en: "Boon of Fortitude" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Robustesse : vos PV maximum augmentent de 40. De plus, quand vous regagnez des PV, vous pouvez en regagner en plus autant que votre modificateur de Constitution (une fois par tour).",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "bonus", target: "hpMax", value: 40, label: "Faveur de vigueur" },
      ] },
  ],
});
