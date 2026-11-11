// Don de faveur épique : Faveur de compétence (Boon of Skill) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-competence)
registerModule({
  kind: "feat", id: "boon-of-skill", category: "epic-boon", aidedd: "faveur-de-competence",
  name: { fr: "Faveur de compétence", en: "Boon of Skill" },
  description: "+1 à une caractéristique (max 30). Maîtrise de toutes les compétences, une expertise",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-skill", name: { fr: "Faveur de compétence", en: "Boon of Skill" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Touche-à-tout : vous maîtrisez toutes les compétences. Expertise : choisissez une compétence, vous gagnez l'expertise.",
      effects: [
        DND.feat.ability("abilities", 30),
        ...Object.keys(DND.data.skills).map((id) => ({ type: "proficiency", target: "skill." + id })),
        { type: "choice", id: "expertise", label: "Expertise", from: "skills", grant: { type: "proficiency", target: "{value}", expertise: true } },
      ] },
  ],
});
