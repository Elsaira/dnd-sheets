// Don général : Maître d'hast (Polearm Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-d-hast)
registerModule({
  kind: "feat", id: "polearm-master", category: "general", aidedd: "maitre-d-hast",
  name: { fr: "Maître d'hast", en: "Polearm Master" },
  description: "+1 For ou Dex. Action Bonus pour attaque (d4) avec l'extrémité opposée. Réaction pour attaque contre une créature dans l'allonge",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "polearm-master", name: { fr: "Maître d'hast", en: "Polearm Master" },
      description: "Frappe double : Immédiatement après avoir pris l'action Attaque et attaqué avec un Bâton, une Lance ou une arme possédant les propriétés Lourde et Allonge, vous pouvez utiliser une action Bonus pour effectuer une attaque au corps à corps avec l'extrémité opposée de l'arme. L'arme inflige des dégâts contondants, et le dé de dégâts de l'arme pour cette attaque est un d4. Frappe réactive : Lorsque vous tenez un Bâton, une Lance ou une arme possédant les propriétés Lourde et Allonge, vous pouvez prendre une Réaction pour effectuer une attaque au corps à corps contre une créature qui entre dans l'allonge de cette arme.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "action", actionType: "bonus", name: { fr: "Frappe double", en: "Pole Strike" }, description: "Juste après l'action Attaque avec un bâton, une lance ou une arme Lourde et Allonge : attaque avec l'autre extrémité (1d4 contondant)." },
        { type: "action", actionType: "reaction", name: { fr: "Frappe réactive", en: "Reactive Strike" }, description: "Attaque au corps à corps contre une créature qui entre dans l'allonge de votre bâton, lance ou arme Lourde et Allonge." },
      ] },
  ],
});
