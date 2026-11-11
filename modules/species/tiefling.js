// Espèce : Tieffelin (Tiefling) — SRD 5.2
(function () {
  const ability = "{choice:spellAbility}";
  const legacy = (id, fr, en, damage, cantrip, lvl3, lvl5, text) => ({
    id, name: { fr, en }, description: text,
    effects: [
      { type: "resistance", damage },
      { type: "spell", spell: cantrip, ability },
      { type: "spell", spell: lvl3, ability, minLevel: 3, freeCast: { max: 1, recharge: "long" } },
      { type: "spell", spell: lvl5, ability, minLevel: 5, freeCast: { max: 1, recharge: "long" } },
    ],
  });
  registerModule({
    kind: "species", id: "tiefling",
    name: { fr: "Tieffelin", en: "Tiefling" },
    size: "medium", speed: 30,
    description: "Héritage fiélon : résistance et magie selon votre legs (abyssal, chtonien ou infernal).",
    features: [
      { id: "size", name: { fr: "Taille", en: "Size" }, hidden: true,
        effects: [{ type: "choice", id: "size", label: "Taille", from: [
          { id: "medium", name: { fr: "Moyenne", en: "Medium" }, effects: [{ type: "size", value: "medium" }] },
          { id: "small", name: { fr: "Petite", en: "Small" }, effects: [{ type: "size", value: "small" }] }] }] },
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "fiendish-legacy", name: { fr: "Legs fiélon", en: "Fiendish Legacy" },
        description: "Une résistance et un tour de magie, puis un sort au niveau 3 et au niveau 5, chacun lançable une fois sans emplacement par repos long.",
        effects: [
          { type: "choice", id: "legacy", label: "Legs", from: [
            legacy("abyssal", "Abyssal", "Abyssal", "poison", "poison-spray", "ray-of-sickness", "hold-person",
              "Résistance au poison. Bouffée de poison, Rayon empoisonné (niv. 3), Immobilisation de personne (niv. 5)."),
            legacy("chthonic", "Chtonien", "Chthonic", "necrotic", "chill-touch", "false-life", "ray-of-enfeeblement",
              "Résistance nécrotique. Contact glacial, Simulacre de vie (niv. 3), Rayon affaiblissant (niv. 5)."),
            legacy("infernal", "Infernal", "Infernal", "fire", "fire-bolt", "hellish-rebuke", "darkness",
              "Résistance au feu. Trait de feu, Représailles infernales (niv. 3), Ténèbres (niv. 5)."),
          ] },
          { type: "choice", id: "spellAbility", label: "Caractéristique d'incantation du legs", from: ["int", "wis", "cha"] },
        ] },
      { id: "otherworldly-presence", name: { fr: "Présence d'outre-monde", en: "Otherworldly Presence" },
        description: "Vous connaissez le tour de magie Thaumaturgie, avec la même caractéristique que votre legs.",
        effects: [{ type: "spell", spell: "thaumaturgy", ability }] },
    ],
  });
})();
