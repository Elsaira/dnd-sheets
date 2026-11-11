// Sous-classe d'Occultiste : Protecteur Grand Ancien (Great Old One Patron) — Player's Handbook 2024 (hors SRD).
// Noms et règles relevés sur AideDD (regles-24/classes/occultiste) le 2026-10-15.
// Ajoutée sans modifier warlock.js, grâce à "subclass:warlock".
(function () {
  const cha = "cha";
  const DC = (c) => 8 + c.pb + c.mod.cha;
  const reach = (c) => String(Math.max(1, c.mod.cha) * 1.5).replace(".", ",") + " km";
  registerList("subclass:warlock", [{
    id: "great-old-one", name: { fr: "Protecteur Grand Ancien", en: "Great Old One Patron" }, source: "PHB 2024",
    features: [
      { level: 3, id: "awakened-mind", name: { fr: "Esprit éveillé", en: "Awakened Mind" },
        description: (c, l) => "Par une action Bonus, choisissez une créature visible à 9 m : vous communiquez par télépathie tant que vous êtes à " + reach(c) +
          " ou moins (Charisme × 1,5 km, minimum 1,5 km), dans une langue que l'autre connaît. Le lien dure " + l + " minute(s) (niveau d'occultiste) et prend fin si vous vous liez à une autre créature.",
        effects: [{ type: "action", name: { fr: "Esprit éveillé", en: "Awakened Mind" }, actionType: "bonus",
          description: (c, l) => "Lien télépathique avec une créature visible à 9 m : portée " + reach(c) + ", durée " + l + " min." }] },
      { level: 3, id: "great-old-one-spells", name: { fr: "Sorts du Grand Ancien", en: "Great Old One Spells" },
        description: "Sorts toujours préparés : Détection des pensées, Murmures dissonants, Force fantasmagorique, Fou rire de Tasha (niv. 3) ; Clairvoyance, Voracité de Hadar (niv. 5) ; Confusion, Convocation d'aberration (niv. 7) ; Modification de mémoire, Télékinésie (niv. 9).",
        effects: [
          ...["detect-thoughts", "dissonant-whispers", "phantasmal-force", "hideous-laughter"].map((spell) => ({ type: "spell", spell, ability: cha })),
          ...["clairvoyance", "hunger-of-hadar"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 5 })),
          ...["confusion", "summon-aberration"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 7 })),
          ...["modify-memory", "telekinesis"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 9 })),
        ] },
      { level: 3, id: "psychic-spells", combat: true, name: { fr: "Sorts psychiques", en: "Psychic Spells" },
        description: "Quand vous lancez un sort d'occultiste qui inflige des dégâts, vous pouvez changer son type de dégâts en psychique. Vos sorts d'occultiste d'Enchantement ou d'Illusion peuvent se lancer sans composante verbale ni somatique.",
        effects: [{ type: "note", text: "Sorts psychiques : dégâts de vos sorts d'occultiste convertibles en psychique ; Enchantement et Illusion sans composante V ni S." }] },
      { level: 6, id: "clairvoyant-combatant", name: { fr: "Combattant clairvoyant", en: "Clairvoyant Combatant" },
        description: "Quand vous établissez un lien avec Esprit éveillé, vous pouvez imposer à la créature un JS de Sagesse. En cas d'échec, pendant toute la durée du lien, elle a le désavantage aux attaques contre vous et vous avez l'avantage aux attaques contre elle. Utilisable de nouveau après un repos court ou long, ou en dépensant un emplacement de Magie de pacte (aucune action requise).",
        effects: [
          { type: "resource", id: "clairvoyantCombatant", name: { fr: "Combattant clairvoyant", en: "Clairvoyant Combatant" }, max: 1, recharge: "short",
            description: "Ou récupérer en dépensant un emplacement de Magie de pacte." },
          { type: "action", name: { fr: "Combattant clairvoyant", en: "Clairvoyant Combatant" }, actionType: "free", resource: "clairvoyantCombatant",
            description: (c) => "En créant le lien d'Esprit éveillé : JS de Sagesse DD " + DC(c) + ". Échec : désavantage à ses attaques contre vous, avantage aux vôtres contre elle, pendant le lien." },
        ] },
      { level: 10, id: "eldritch-hex", combat: true, name: { fr: "Maléfice occulte", en: "Eldritch Hex" },
        description: "Maléfice est toujours préparé. Quand vous lancez Maléfice et choisissez une caractéristique, la cible a aussi le désavantage aux jets de sauvegarde de cette caractéristique pendant toute la durée du sort.",
        effects: [
          { type: "spell", spell: "hex", ability: cha },
          { type: "note", text: "Maléfice occulte : la cible de Maléfice a aussi le désavantage aux JS de la caractéristique choisie." },
        ] },
      { level: 10, id: "thought-shield", name: { fr: "Bouclier mental", en: "Thought Shield" },
        description: "Vos pensées ne peuvent pas être lues par télépathie ou d'autres moyens sans votre consentement. Résistance aux dégâts psychiques ; quand une créature vous inflige des dégâts psychiques, elle subit autant de dégâts que vous.",
        effects: [
          { type: "resistance", damage: "psychic" },
          { type: "note", text: "Bouclier mental : pensées illisibles sans consentement ; qui vous inflige des dégâts psychiques en subit autant." },
        ] },
      { level: 14, id: "create-thrall", name: { fr: "Asservissement", en: "Create Thrall" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
  }]);
})();
