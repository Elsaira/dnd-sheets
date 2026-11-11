// Don général : Protection intermédiaire (Moderately Armored) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/protection-intermediaire)
registerModule({
  kind: "feat", id: "moderately-armored", category: "general", aidedd: "protection-intermediaire",
  name: { fr: "Protection intermédiaire", en: "Moderately Armored" },
  description: "+1 For ou Dex. Octroie la maîtrise des armures intermédiaires",
  prerequisite: DND.feat.requires({ level: 4, armor: "light" }, "Niveau 4, formation aux armures légères"),
  features: [
    { id: "moderately-armored", name: { fr: "Protection intermédiaire", en: "Moderately Armored" },
      description: "Formation aux armures : Vous recevez la formation aux armures intermédiaires.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "proficiency", target: "armor.medium" },
      ] },
  ],
});
