// Don général : Observateur (Observant) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/observateur)
registerModule({
  kind: "feat", id: "observant", category: "general", aidedd: "observateur",
  name: { fr: "Observateur", en: "Observant" },
  description: "+1 Int ou Sag. Octroie maîtrise/expertise en Intuition, Investigation ou Perception. Action Cherche en action Bonus",
  prerequisite: DND.feat.requires({ level: 4, scores: ["int", "wis"] }, "Niveau 4, Intelligence ou Sagesse 13"),
  features: [
    { id: "observant", name: { fr: "Observateur", en: "Observant" },
      description: "Observateur attentif : Choisissez l'une des compétences suivantes : Intuition, Investigation ou Perception. Si vous ne maîtrisez pas la compétence choisie, vous la maîtrisez ; si vous la maîtrisez déjà, vous gagnez Expertise pour celle-ci. Observation rapide : Vous pouvez prendre l'action Observation en tant qu'action Bonus.",
      effects: [
        DND.feat.ability(["int", "wis"]),
        DND.feat.profOrExpertise(["insight", "investigation", "perception"]),
      ] },
  ],
});
