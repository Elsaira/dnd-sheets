// Don général : Protection lourde (Heavily Armored) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/protection-lourde)
registerModule({
  kind: "feat", id: "heavily-armored", category: "general", aidedd: "protection-lourde",
  name: { fr: "Protection lourde", en: "Heavily Armored" },
  description: "+1 For ou Con. Octroie la maîtrise des armures lourdes",
  prerequisite: DND.feat.requires({ level: 4, armor: "medium" }, "Niveau 4, formation aux armures intermédiaires"),
  features: [
    { id: "heavily-armored", name: { fr: "Protection lourde", en: "Heavily Armored" },
      description: "Formation aux armures : Vous recevez la formation aux armures lourdes.",
      effects: [
        DND.feat.ability(["str", "con"]),
        { type: "proficiency", target: "armor.heavy" },
      ] },
  ],
});
