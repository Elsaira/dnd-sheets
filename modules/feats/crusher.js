// Don général : Broyeur (Crusher) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/broyeur)
registerModule({
  kind: "feat", id: "crusher", category: "general", aidedd: "broyeur",
  name: { fr: "Broyeur", en: "Crusher" },
  description: "+1 For ou Con. Si dégâts contondants, repousse la cible de 1,50 m (1/tour). Critique contondant donne un Avantage aux attaques",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "crusher", combat: true, name: { fr: "Broyeur", en: "Crusher" },
      description: "Bourrade : Une fois par tour, lorsque vous touchez une créature avec une attaque infligeant des dégâts contondants, vous pouvez la déplacer de 1,50 mètre vers une case libre si la cible ne fait pas plus d'une taille de plus que vous. Critique renforcé : Lorsque vous réussissez un Coup critique infligeant des dégâts contondants à une créature, les jets d'attaque contre cette créature bénéficient d'un Avantage jusqu'au début de votre prochain tour.",
      effects: [
        DND.feat.ability(["str", "con"]),
      ] },
  ],
});
