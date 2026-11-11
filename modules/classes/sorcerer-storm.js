// Sous-classe d'Ensorceleur : Sorcellerie des tempêtes (Storm Sorcery) — Xanathar's Guide to Everything (règles 2014).
// Texte français d'après AideDD (dnd-5/unearthed-arcana/aventures-maritimes#tempete, version officielle de Xanathar), relevé le 2026-10-15.
// Adaptation 2024 : les sous-classes d'ensorceleur arrivent au niveau 3, donc les aptitudes du niveau 1 sont placées au niveau 3.
// Ajoutée sans modifier sorcerer.js, grâce à "subclass:sorcerer". Journal : classes/ensorceleur.md
(function () {
  const lvl = (c) => c.classLevel("sorcerer");
  const half = (c) => Math.floor(lvl(c) / 2);
  registerList("subclass:sorcerer", [{
    id: "storm", name: { fr: "Sorcellerie des tempêtes", en: "Storm Sorcery" }, source: "Xanathar (2014)",
    features: [
      { level: 3, id: "wind-speaker", name: { fr: "Langage du vent", en: "Wind Speaker" },
        description: "Vous parlez, lisez et écrivez le primordial, ce qui vous permet aussi de comprendre ses dialectes (aérien, aquatique, igné et terreux) et d'être compris de ceux qui les parlent. (Niveau 1 dans Xanathar.)",
        effects: [{ type: "proficiency", target: "language.primordial" }] },
      { level: 3, id: "tempestuous-magic", name: { fr: "Magie tumultueuse", en: "Tempestuous Magic" },
        description: "Par une action bonus, immédiatement avant ou après avoir lancé un sort de niveau 1 ou plus, des rafales d'air élémentaire vous entourent : vous volez sur 3 mètres sans provoquer d'attaques d'opportunité. (Niveau 1 dans Xanathar.)",
        effects: [{ type: "action", name: { fr: "Magie tumultueuse", en: "Tempestuous Magic" }, actionType: "bonus",
          description: "Juste avant ou après un sort de niveau 1+ : vol de 3 m sans attaque d'opportunité." }] },
      { level: 6, id: "heart-of-the-storm", combat: true, name: { fr: "Cœur de la tempête", en: "Heart of the Storm" },
        description: (c) => "Résistance aux dégâts de foudre et de tonnerre. Quand vous lancez un sort de niveau 1 ou plus qui inflige des dégâts de foudre ou de tonnerre, les créatures de votre choix visibles à 3 m de vous subissent " +
          half(c) + " dégâts de foudre ou de tonnerre (au choix à chaque fois ; moitié de votre niveau d'ensorceleur).",
        effects: [
          { type: "resistance", damage: "lightning" },
          { type: "resistance", damage: "thunder" },
          { type: "note", text: (c) => "Cœur de la tempête : sort de niveau 1+ de foudre ou de tonnerre, " + half(c) + " dégâts (foudre ou tonnerre) aux créatures choisies à 3 m." },
        ] },
      { level: 6, id: "storm-guide", name: { fr: "Guide des tempêtes", en: "Storm Guide" },
        description: "S'il pleut, une action fait cesser la pluie dans un rayon de 6 m centré sur vous (une action bonus y met fin). S'il y a du vent, une action bonus à chaque round choisit la direction du vent dans un rayon de 30 m jusqu'à la fin de votre prochain tour, sans changer sa vitesse.",
        effects: [
          { type: "action", name: { fr: "Guide des tempêtes : pluie", en: "Storm Guide: Rain" }, actionType: "action",
            description: "La pluie cesse dans un rayon de 6 m centré sur vous (fin par une action bonus)." },
          { type: "action", name: { fr: "Guide des tempêtes : vent", en: "Storm Guide: Wind" }, actionType: "bonus",
            description: "Choisissez la direction du vent dans un rayon de 30 m jusqu'à la fin de votre prochain tour." },
        ] },
      { level: 14, id: "storms-fury", name: { fr: "Fureur de la tempête", en: "Storm's Fury" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
  }]);
})();
