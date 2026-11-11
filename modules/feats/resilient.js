// Don général : Résilient (Resilient) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/resilient)
registerModule({
  kind: "feat", id: "resilient", category: "general", aidedd: "resilient",
  name: { fr: "Résilient", en: "Resilient" },
  description: "+1 dans une caractéristique sans maîtrise des JdS. Octroie la maîtrise des jets de sauvegarde pour cette caractéristique",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "resilient", name: { fr: "Résilient", en: "Resilient" },
      description: "Maîtrise des jets de sauvegarde : Vous gagnez la maîtrise des jets de sauvegarde avec la caractéristique choisie.",
      effects: [
        { type: "choice", id: "ability", label: "Caractéristique (+1 et maîtrise du jet de sauvegarde)",
        from: DND.data.abilities.map((a) => ({ id: a, name: { fr: DND.label(a), en: DND.labelEn(a) },
          effects: [{ type: "ability", ability: a, value: 1, max: 20 }, { type: "proficiency", target: "save." + a }] })) },
      ] },
  ],
});
