// Don général : Athlète (Athlete) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/athlete)
registerModule({
  kind: "feat", id: "athlete", category: "general", aidedd: "athlete",
  name: { fr: "Athlète", en: "Athlete" },
  description: "+1 For ou Dex. Octroie une Vitesse d'escalade. 1,50 m pour se remettre sur pied. Saut après une course de 1,50 m",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "athlete", combat: true, name: { fr: "Athlète", en: "Athlete" },
      description: "Vitesse d'escalade : Vous gagnez une Vitesse d'escalade égale à votre Vitesse. Rétablissement : Lorsque vous êtes en À terre, vous pouvez vous redresser avec seulement 1,50 mètre de mouvement. Saut : Vous pouvez effectuer un saut en longueur ou en hauteur après avoir parcouru seulement 1,50 mètre.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "speed", mode: "climb", value: "walk" },
      ] },
  ],
});
