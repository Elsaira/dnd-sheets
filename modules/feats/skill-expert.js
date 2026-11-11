// Don général : Expert (Skill Expert) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/expert)
registerModule({
  kind: "feat", id: "skill-expert", category: "general", aidedd: "expert",
  name: { fr: "Expert", en: "Skill Expert" },
  description: "+1 dans une caractéristique. Octroie la maîtrise d'une compétence. Octroie Expertise dans une compétence maîtrisée",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "skill-expert", name: { fr: "Expert", en: "Skill Expert" },
      description: "Maîtrise de compétence : Vous maîtrisez une compétence de votre choix. Expertise : Choisissez une compétence que vous maîtrisez, mais pour laquelle vous n'avez pas Expertise. Vous gagnez Expertise dans cette compétence.",
      effects: [
        DND.feat.ability("abilities"),
        { type: "choice", id: "skill", label: "Compétence maîtrisée", from: "skills" },
        { type: "choice", id: "expertise", label: "Expertise (compétence déjà maîtrisée)", from: "skills", grant: { type: "proficiency", target: "{value}", expertise: true } },
      ] },
  ],
});
