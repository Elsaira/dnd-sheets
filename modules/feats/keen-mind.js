// Don général : Esprit affûté (Keen Mind) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/esprit-affute)
registerModule({
  kind: "feat", id: "keen-mind", category: "general", aidedd: "esprit-affute",
  name: { fr: "Esprit affûté", en: "Keen Mind" },
  description: "+1 Int. Octroie maîtrise/expertise en Arcanes, Histoire, Investigation, Nature ou Religion. Action Étude en action Bonus",
  prerequisite: DND.feat.requires({ level: 4, scores: ["int"] }, "Niveau 4, Intelligence 13"),
  features: [
    { id: "keen-mind", combat: "Action Étude en action Bonus.", name: { fr: "Esprit affûté", en: "Keen Mind" },
      description: "Érudition : Choisissez l'une des compétences suivantes : Arcanes, Histoire, Investigation, Nature ou Religion. Si vous ne maîtrisez pas la compétence choisie, vous la maîtrisez ; si vous la maîtrisez déjà, vous gagnez Expertise pour celle-ci. Étude rapide : Vous pouvez prendre l'action Étude en tant qu'action Bonus.",
      effects: [
        DND.feat.ability(["int"]),
        DND.feat.profOrExpertise(["arcana", "history", "investigation", "nature", "religion"]),
      ] },
  ],
});
