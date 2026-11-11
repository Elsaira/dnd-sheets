// Don général : Figure de proue (Inspiring Leader) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/figure-de-proue)
registerModule({
  kind: "feat", id: "inspiring-leader", category: "general", aidedd: "figure-de-proue",
  name: { fr: "Figure de proue", en: "Inspiring Leader" },
  description: "+1 Sag ou Cha. Après un Repos, octroie à six alliés des pv temporaires égaux à votre niveau + modificateur de la carac",
  prerequisite: DND.feat.requires({ level: 4, scores: ["wis", "cha"] }, "Niveau 4, Sagesse ou Charisme 13"),
  features: [
    { id: "inspiring-leader", name: { fr: "Figure de proue", en: "Inspiring Leader" },
      description: "Représentation galvanisante : Lorsque vous terminez un Repos court ou long, vous pouvez donner une représentation inspirante : un discours, un chant ou une danse. Dans ce cas, choisissez jusqu'à six alliés (vous pouvez vous choisir) dans un rayon de 9 mètres qui assistent à la représentation. Les créatures choisies gagnent chacune des points de vie temporaires égaux à votre niveau de personnage plus le modificateur de la caractéristique augmentée par ce don.",
      effects: [
        DND.feat.ability(["wis", "cha"]),
      ] },
  ],
});
