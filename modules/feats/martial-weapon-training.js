// Don général : Formation aux armes de guerre (Martial Weapon Training) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/formation-aux-armes-de-guerre)
registerModule({
  kind: "feat", id: "martial-weapon-training", category: "general", aidedd: "formation-aux-armes-de-guerre",
  name: { fr: "Formation aux armes de guerre", en: "Martial Weapon Training" },
  description: "+1 For ou Dex. Octroie la maîtrise des armes de guerre",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "martial-weapon-training", name: { fr: "Formation aux armes de guerre", en: "Martial Weapon Training" },
      description: "Maîtrise des armes : Vous maîtrisez les armes de guerre.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "proficiency", target: "weapon.martial" },
      ] },
  ],
});
