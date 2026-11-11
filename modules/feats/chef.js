// Don général : Chef cuisinier (Chef) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/chef-cuisinier)
registerModule({
  kind: "feat", id: "chef", category: "general", aidedd: "chef-cuisinier",
  name: { fr: "Chef cuisinier", en: "Chef" },
  description: "+1 Con ou Sag. Maîtrise des ustensiles. Repos court pour cuisiner donne +1d8 pv aux Dés de Vie. Friandises pour pv temporaires",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "chef", name: { fr: "Chef cuisinier", en: "Chef" },
      description: "Ustensiles de cuisinier : Vous maîtrisez les ustensiles de cuisinier si vous ne les maîtrisez pas déjà. Repas reconstituant : Lors d'un Repos court, vous pouvez cuisiner des plats spéciaux si vous avez des ingrédients et des ustensiles de cuisinier sous la main. Vous pouvez préparer suffisamment de nourriture pour un nombre de créatures égal à 4 plus votre bonus de maîtrise. À la fin du Repos court, toute créature qui mange ces plats et dépense un ou plusieurs DV pour regagner des points de vie regagne 1d8 points de vie supplémentaires. Friandises galvanisantes : Après 1 heure de travail ou lorsque vous terminez un Repos long, vous pouvez cuisiner un nombre de friandises égal à votre bonus de maîtrise si vous avez des ingrédients et des ustensiles de cuisinier sous la main. Ces friandises spéciales se gardent 8 heures après leur préparation. Une créature peut utiliser une action Bonus pour en manger une et gagner un nombre de points de vie temporaires égal à votre bonus de maîtrise.",
      effects: [
        DND.feat.ability(["con", "wis"]),
        { type: "proficiency", target: "tool.cooks-utensils" },
      ] },
  ],
});
