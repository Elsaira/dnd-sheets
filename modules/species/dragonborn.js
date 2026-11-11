// Espèce : Drakéide (Dragonborn) — SRD 5.2
(function () {
  const ANCESTRIES = [
    ["black", "Dragon noir", "Black", "acid"], ["blue", "Dragon bleu", "Blue", "lightning"],
    ["brass", "Dragon d'airain", "Brass", "fire"], ["bronze", "Dragon de bronze", "Bronze", "lightning"],
    ["copper", "Dragon de cuivre", "Copper", "acid"], ["gold", "Dragon d'or", "Gold", "fire"],
    ["green", "Dragon vert", "Green", "poison"], ["red", "Dragon rouge", "Red", "fire"],
    ["silver", "Dragon d'argent", "Silver", "cold"], ["white", "Dragon blanc", "White", "cold"],
  ];
  const dice = (level) => (level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1) + "d10";

  registerModule({
    kind: "species", id: "dragonborn",
    name: { fr: "Drakéide", en: "Dragonborn" },
    size: "medium", speed: 30,
    description: "Descendants des dragons : souffle, résistance, vol temporaire au niveau 5.",
    features: [
      { id: "draconic-ancestry", name: { fr: "Ascendance draconique", en: "Draconic Ancestry" },
        description: "Votre dragon ancestral détermine le type de dégâts de votre souffle et de votre résistance.",
        effects: [{ type: "choice", id: "ancestry", label: "Dragon ancestral", from: ANCESTRIES.map(([id, fr, en, damage]) => ({
          id, name: { fr: fr + " (" + DND.label(damage).toLowerCase() + ")", en: en + " Dragon" },
          effects: [
            { type: "resistance", damage },
            { type: "action", name: { fr: "Souffle", en: "Breath Weapon" }, actionType: "action", resource: "breath",
              description: (c) => "Remplace une attaque de l'action Attaque. Cône de 4,5 m ou ligne de 9 m (1,5 m de large). JS de Dextérité DD " +
                (8 + c.mod.con + c.pb) + " : " + dice(c.level) + " dégâts de " + DND.label(damage).toLowerCase() + ", moitié en cas de réussite." },
          ] })) }] },
      { id: "breath-weapon", name: { fr: "Souffle", en: "Breath Weapon" },
        description: "Utilisations égales à votre bonus de maîtrise, récupérées au repos long.",
        effects: [{ type: "resource", id: "breath", name: { fr: "Souffle", en: "Breath Weapon" }, max: (c) => c.pb, recharge: "long" }] },
      { id: "damage-resistance", name: { fr: "Résistance aux dégâts", en: "Damage Resistance" },
        description: "Résistance au type de dégâts de votre ascendance draconique." },
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "draconic-flight", level: 5, name: { fr: "Vol draconique", en: "Draconic Flight" },
        description: "Action bonus : des ailes spectrales vous donnent une vitesse de vol égale à votre vitesse pendant 10 minutes. Une fois par repos long.",
        effects: [{ type: "resource", id: "flight", name: { fr: "Vol draconique", en: "Draconic Flight" }, max: 1, recharge: "long" }] },
    ],
  });
})();
