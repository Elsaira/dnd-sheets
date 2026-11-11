// Don général : Magie rituelle (Ritual Caster) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/magie-rituelle)
registerModule({
  kind: "feat", id: "ritual-caster", category: "general", aidedd: "magie-rituelle",
  name: { fr: "Magie rituelle", en: "Ritual Caster" },
  description: "+1 Int, Sag ou Cha. Sort Rituels niv 1 (nbre=BM) préparés. Lancer un Rituel préparé rapidement et gratuitement 1/Repos long",
  prerequisite: DND.feat.requires({ level: 4, scores: ["int", "wis", "cha"] }, "Niveau 4, Intelligence, Sagesse ou Charisme 13"),
  features: [
    { id: "ritual-caster", name: { fr: "Magie rituelle", en: "Ritual Caster" },
      description: "Sorts rituels : Choisissez un nombre de sorts de niveau 1 qui possède l'étiquette Rituel égal à votre bonus de maîtrise. Vous avez toujours ces sorts préparés et vous pouvez les lancer avec n'importe quel emplacement de sort dont vous disposez. La caractéristique d'incantation de ces sorts est celle augmentée par ce don. Chaque fois que votre bonus de maîtrise augmente par la suite, vous pouvez ajouter un sort supplémentaire de niveau 1 avec l'étiquette Rituel aux sorts toujours préparés avec cette capacité. Rituel rapide : Grâce à cet avantage, vous pouvez lancer un sort Rituel que vous avez préparé en utilisant son temps d'incantation normal plutôt que le temps prolongé d'un rituel. Cela ne nécessite pas d'emplacement de sort. Une fois que vous avez lancé le sort de cette manière, vous ne pouvez plus utiliser cet avantage avant d'avoir terminé un Repos long.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "choice", id: "rituals", label: "Sorts rituels de niveau 1 (autant que le bonus de maîtrise)", count: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 },
        from: "spells", filter: { level: 1, ritual: true }, grant: { type: "spell", spell: "{value}", ability: "{choice:ability}" } },
        { type: "resource", id: "quickRitual", name: { fr: "Rituel rapide", en: "Quick Ritual" }, max: 1, recharge: "long" },
      ] },
  ],
});
