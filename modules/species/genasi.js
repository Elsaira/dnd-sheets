// Espèce : Génasi (Genasi) — Monsters of the Multiverse (règles 2024 : pas d'augmentation de caractéristiques d'espèce)
// Un seul module, la lignée (air, terre, feu, eau) est un choix. Noms français : traduction AideDD (règles 2014).
(function () {
  const ability = "{choice:spellAbility}";
  const lineageSpells = (cantrip, lvl3, lvl5) => [
    { type: "spell", spell: cantrip, ability },
    ...(lvl3 ? [{ type: "spell", spell: lvl3, ability, minLevel: 3, freeCast: { max: 1, recharge: "long" } }] : []),
    { type: "spell", spell: lvl5, ability, minLevel: 5, freeCast: { max: 1, recharge: "long" } },
  ];
  registerModule({
    kind: "species", id: "genasi",
    name: { fr: "Génasi", en: "Genasi" },
    size: "medium", speed: 30,
    description: "Descendants des génies : résistance et magie selon leur lignée élémentaire (air, terre, feu ou eau).",
    features: [
      { id: "size", name: { fr: "Taille", en: "Size" }, hidden: true,
        effects: [{ type: "choice", id: "size", label: "Taille", from: [
          { id: "medium", name: { fr: "Moyenne", en: "Medium" }, effects: [{ type: "size", value: "medium" }] },
          { id: "small", name: { fr: "Petite", en: "Small" }, effects: [{ type: "size", value: "small" }] }] }] },
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "elemental-lineage", name: { fr: "Lignée élémentaire", en: "Elemental Lineage" },
        description: "Votre lignée vous donne ses traits et sa magie : sorts lançables une fois sans emplacement par repos long (ou avec un emplacement), sans composante matérielle.",
        effects: [
          { type: "choice", id: "lineage", label: "Lignée", from: [
            { id: "air", name: { fr: "Génasi de l'air", en: "Air Genasi" },
              description: "Vitesse 10,5 m. Souffle sans fin : vous retenez votre respiration indéfiniment tant que vous n'êtes pas Neutralisé. Résistance à la foudre. Se mêler au vent : Poigne électrique, Feuille morte (niv. 3), Lévitation (niv. 5).",
              effects: [{ type: "speed", mode: "walk", value: 35 }, { type: "resistance", damage: "lightning" },
                ...lineageSpells("shocking-grasp", "feather-fall", "levitate")] },
            { id: "earth", name: { fr: "Génasi de la terre", en: "Earth Genasi" },
              description: "Marche de la terre : terrain difficile de terre ou de pierre sans coût de mouvement supplémentaire. Fusionner avec la pierre : Voile défensif, lançable par une action bonus (bonus de maîtrise fois par repos long) ; Passage sans trace (niv. 5).",
              effects: [...lineageSpells("blade-ward", null, "pass-without-trace"),
                { type: "resource", id: "mergeWithStone", name: { fr: "Voile défensif (action bonus)", en: "Merge with Stone" }, max: (c) => c.pb, recharge: "long" }] },
            { id: "fire", name: { fr: "Génasi du feu", en: "Fire Genasi" },
              description: "Résistance au feu. Atteindre le brasier : Flammes, Mains brûlantes (niv. 3), Lame de feu (niv. 5).",
              effects: [{ type: "resistance", damage: "fire" }, ...lineageSpells("produce-flame", "burning-hands", "flame-blade")] },
            { id: "water", name: { fr: "Génasi de l'eau", en: "Water Genasi" },
              description: "Résistance à l'acide. Amphibie : vous respirez dans l'air et sous l'eau. Vitesse de nage égale à votre vitesse. Appeler la vague : Aspersion d'acide, Création ou destruction d'eau (niv. 3), Marche sur l'eau (niv. 5).",
              effects: [{ type: "resistance", damage: "acid" }, { type: "speed", mode: "swim", value: "walk" },
                ...lineageSpells("acid-splash", "create-or-destroy-water", "water-walk")] },
          ] },
          { type: "choice", id: "spellAbility", label: "Caractéristique d'incantation de la lignée", from: ["int", "wis", "cha"] },
        ] },
    ],
  });
})();
