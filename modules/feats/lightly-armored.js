// Don général : Protection légère (Lightly Armored) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/protection-legere)
registerModule({
  kind: "feat", id: "lightly-armored", category: "general", aidedd: "protection-legere",
  name: { fr: "Protection légère", en: "Lightly Armored" },
  description: "+1 For ou Dex. Octroie la maîtrise des armures légères et des boucliers",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "lightly-armored", name: { fr: "Protection légère", en: "Lightly Armored" },
      description: "Formation aux armures : Vous recevez la formation aux armures légères et aux boucliers.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "proficiency", target: "armor.light" },
        { type: "proficiency", target: "armor.shield" },
      ] },
  ],
});
