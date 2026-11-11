// Espèce : Elfe (Elf) — SRD 5.2
(function () {
  const ability = "{choice:spellAbility}";
  const lineageSpells = (cantrip, lvl3, lvl5) => [
    { type: "spell", spell: cantrip, ability },
    { type: "spell", spell: lvl3, ability, minLevel: 3, freeCast: { max: 1, recharge: "long" } },
    { type: "spell", spell: lvl5, ability, minLevel: 5, freeCast: { max: 1, recharge: "long" } },
  ];
  registerModule({
    kind: "species", id: "elf",
    name: { fr: "Elfe", en: "Elf" },
    size: "medium", speed: 30,
    description: "Peuple féerique : lignée drow, haut-elfe ou elfe des bois, chacune avec sa magie.",
    features: [
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m (36 m pour les drows).",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "elven-lineage", name: { fr: "Lignée elfique", en: "Elven Lineage" },
        description: "Votre lignée vous donne un tour de magie, puis un sort au niveau 3 et au niveau 5, chacun lançable une fois sans emplacement par repos long.",
        effects: [
          { type: "choice", id: "lineage", label: "Lignée", from: [
            { id: "drow", name: { fr: "Drow", en: "Drow" }, description: "Vision dans le noir 36 m. Lumières dansantes, Lueurs féeriques (niv. 3), Ténèbres (niv. 5).",
              effects: [{ type: "sense", sense: "darkvision", range: 120 }, ...lineageSpells("dancing-lights", "faerie-fire", "darkness")] },
            { id: "high-elf", name: { fr: "Haut-elfe", en: "High Elf" }, description: "Prestidigitation (remplaçable à chaque repos long par un autre tour de magie de Magicien), Détection de la magie (niv. 3), Foulée brumeuse (niv. 5).",
              effects: lineageSpells("prestidigitation", "detect-magic", "misty-step") },
            { id: "wood-elf", name: { fr: "Elfe des bois", en: "Wood Elf" }, description: "Vitesse 10,5 m. Druidisme, Grande foulée (niv. 3), Passage sans trace (niv. 5).",
              effects: [{ type: "speed", mode: "walk", value: 35 }, ...lineageSpells("druidcraft", "longstrider", "pass-without-trace")] },
          ] },
          { type: "choice", id: "spellAbility", label: "Caractéristique d'incantation de la lignée", from: ["int", "wis", "cha"] },
        ] },
      { id: "fey-ancestry", name: { fr: "Ascendance féerique", en: "Fey Ancestry" },
        description: "Avantage aux jets de sauvegarde pour éviter ou mettre fin à l'état Charmé.",
        effects: [{ type: "advantage", target: "condition.charmed" }] },
      { id: "keen-senses", name: { fr: "Sens aiguisés", en: "Keen Senses" },
        description: "Maîtrise d'Intuition, de Perception ou de Survie.",
        effects: [{ type: "choice", id: "keenSenses", label: "Sens aiguisés", from: ["skill.insight", "skill.perception", "skill.survival"] }] },
      { id: "trance", name: { fr: "Transe", en: "Trance" },
        description: "Vous ne dormez pas et la magie ne peut pas vous endormir. Un repos long vous demande 4 heures de méditation consciente." },
    ],
  });
})();
