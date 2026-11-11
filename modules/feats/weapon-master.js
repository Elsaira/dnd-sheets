// Don général : Maître d'armes (Weapon Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-d-armes)
registerModule({
  kind: "feat", id: "weapon-master", category: "general", aidedd: "maitre-d-armes",
  name: { fr: "Maître d'armes", en: "Weapon Master" },
  description: "+1 For ou Dex. Utiliser la botte d'un type d'arme courante ou de guerre maîtrisée (changeable après un Repos long)",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "weapon-master", name: { fr: "Maître d'armes", en: "Weapon Master" },
      description: "Propriété botte : Votre formation aux armes vous permet d'utiliser la botte d'un type d'arme courante ou de guerre de votre choix, à condition de maîtriser ce type d'arme. À la fin d'un Repos long, vous pouvez changer de type d'arme pour un autre type d'arme éligible.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "choice", id: "weapon", label: "Arme dont vous utilisez la botte (changeable au repos long)", from: "weapons" },
      ] },
  ],
});
