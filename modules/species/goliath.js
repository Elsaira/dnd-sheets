// Espèce : Goliath — SRD 5.2
(function () {
  const giant = (id, fr, en, actionType, text) => ({
    id, name: { fr, en }, description: text,
    effects: [{ type: "action", name: { fr, en }, actionType, resource: "giantAncestry", description: text }],
  });
  registerModule({
    kind: "species", id: "goliath",
    name: { fr: "Goliath", en: "Goliath" },
    size: "medium", speed: 35,
    description: "Descendants des géants : pouvoir d'ascendance, forme de grande taille au niveau 5.",
    features: [
      { id: "giant-ancestry", name: { fr: "Ascendance de géant", en: "Giant Ancestry" },
        description: "Un pouvoir surnaturel lié à vos ancêtres, utilisable un nombre de fois égal au bonus de maîtrise (repos long).",
        effects: [
          { type: "resource", id: "giantAncestry", name: { fr: "Ascendance de géant", en: "Giant Ancestry" }, max: (c) => c.pb, recharge: "long" },
          { type: "choice", id: "ancestry", label: "Ascendance", from: [
            giant("cloud", "Bond des nuages", "Cloud's Jaunt", "bonus", "Action bonus : téléportation jusqu'à 9 m vers un espace inoccupé visible."),
            giant("fire", "Brûlure du feu", "Fire's Burn", "free", "Quand vous touchez avec une attaque et infligez des dégâts : +1d10 dégâts de feu."),
            giant("frost", "Morsure du givre", "Frost's Chill", "free", "Quand vous touchez avec une attaque et infligez des dégâts : +1d6 dégâts de froid et vitesse de la cible −3 m jusqu'au début de votre prochain tour."),
            giant("hill", "Culbute des collines", "Hill's Tumble", "free", "Quand vous touchez une créature Grande ou plus petite avec une attaque et infligez des dégâts : elle tombe À terre."),
            giant("stone", "Endurance de la pierre", "Stone's Endurance", "reaction", "Réaction quand vous subissez des dégâts : lancez 1d12 + mod. de Constitution et réduisez les dégâts d'autant."),
            giant("storm", "Tonnerre de la tempête", "Storm's Thunder", "reaction", "Réaction quand une créature à 18 m ou moins vous inflige des dégâts : elle subit 1d8 dégâts de tonnerre."),
          ] },
        ] },
      { id: "large-form", level: 5, name: { fr: "Forme de grande taille", en: "Large Form" },
        description: "Action bonus : vous devenez Grand pendant 10 minutes (si l'espace le permet). Avantage aux tests de Force, vitesse +3 m. Une fois par repos long.",
        effects: [{ type: "resource", id: "largeForm", name: { fr: "Forme de grande taille", en: "Large Form" }, max: 1, recharge: "long" }] },
      { id: "powerful-build", name: { fr: "Carrure puissante", en: "Powerful Build" },
        description: "Avantage aux tests pour mettre fin à l'état Agrippé. Vous comptez comme une taille de plus pour la capacité de charge.",
        effects: [{ type: "bonus", target: "carrySize", value: 1 }] },
    ],
  });
})();
