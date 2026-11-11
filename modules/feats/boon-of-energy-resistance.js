// Don de faveur épique : Faveur de résistance aux énergies (Boon of Energy Resistance) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-resistance-aux-energies)
registerModule({
  kind: "feat", id: "boon-of-energy-resistance", category: "epic-boon", aidedd: "faveur-de-resistance-aux-energies",
  name: { fr: "Faveur de résistance aux énergies", en: "Boon of Energy Resistance" },
  description: "+1 à une caractéristique (max 30). Deux résistances, renvoyer l'énergie en Réaction",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-energy-resistance", name: { fr: "Faveur de résistance aux énergies", en: "Boon of Energy Resistance" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Résistances aux énergies : résistance à deux types de dégâts parmi acide, froid, feu, foudre, nécrotique, poison, psychique, radiant, tonnerre ; vous pouvez les changer à la fin d'un repos long. Redirection d'énergie : quand vous subissez des dégâts d'un de ces types, Réaction pour qu'une créature à 18 m ou moins fasse un JS de Dextérité (DD 8 + modificateur de la caractéristique du don + bonus de maîtrise) ou subisse 2d12 + ce modificateur dégâts de ce type.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "choice", id: "resistances", label: "Deux résistances (changeables au repos long)", count: 2,
        from: ["acid", "cold", "fire", "lightning", "necrotic", "poison", "psychic", "radiant", "thunder"], grant: { type: "resistance", damage: "{value}" } },
        { type: "action", actionType: "reaction", name: { fr: "Redirection d'énergie", en: "Energy Redirection" }, description: "Quand vous subissez des dégâts d'un de vos types de résistance : une créature à 18 m ou moins fait un JS de Dextérité (DD 8 + bonus de maîtrise + modificateur de la caractéristique du don) ou subit 2d12 + ce modificateur dégâts de ce type." },
      ] },
  ],
});
