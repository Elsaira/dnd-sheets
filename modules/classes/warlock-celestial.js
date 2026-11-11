// Sous-classe d'Occultiste : Protecteur Céleste (Celestial Patron) — Player's Handbook 2024 (hors SRD).
// Noms et règles relevés sur AideDD (regles-24/classes/occultiste) le 2026-10-15.
// Ajoutée sans modifier warlock.js, grâce à "subclass:warlock".
(function () {
  const cha = "cha";
  const maxDice = (c) => Math.max(1, c.mod.cha);
  registerList("subclass:warlock", [{
    id: "celestial", name: { fr: "Protecteur Céleste", en: "Celestial Patron" }, source: "PHB 2024",
    features: [
      { level: 3, id: "celestial-spells", name: { fr: "Sorts du Céleste", en: "Celestial Spells" },
        description: "Sorts toujours préparés : Aide, Soins, Rayon traçant, Restauration partielle, Lumière, Flamme sacrée (niv. 3) ; Lumière du jour, Retour à la vie (niv. 5) ; Gardien de la foi, Mur de feu (niv. 7) ; Restauration suprême, Convocation de céleste (niv. 9).",
        effects: [
          ...["aid", "cure-wounds", "guiding-bolt", "lesser-restoration", "light", "sacred-flame"].map((spell) => ({ type: "spell", spell, ability: cha })),
          ...["daylight", "revivify"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 5 })),
          ...["guardian-of-faith", "wall-of-fire"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 7 })),
          ...["greater-restoration", "summon-celestial"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 9 })),
        ] },
      { level: 3, id: "healing-light", name: { fr: "Lumière guérisseuse", en: "Healing Light" },
        description: (c, l) => "Réserve de " + (1 + l) + "d6 (1 + niveau d'occultiste), reconstituée au repos long. Par une action Bonus, vous soignez vous-même ou une créature visible à 18 m en dépensant jusqu'à " +
          maxDice(c) + " dé(s) de la réserve (modificateur de Charisme, minimum 1) : la cible récupère le total des dés en PV.",
        effects: [
          { type: "resource", id: "healingLight", name: { fr: "Lumière guérisseuse (d6)", en: "Healing Light" },
            max: (c, l) => 1 + l, recharge: "long", description: "Un point = un d6 de soins." },
          { type: "action", name: { fr: "Lumière guérisseuse", en: "Healing Light" }, actionType: "bonus", resource: "healingLight",
            description: (c) => "Soigne vous ou une créature visible à 18 m : dépensez jusqu'à " + maxDice(c) + "d6 de la réserve et lancez-les." },
        ] },
      { level: 6, id: "radiant-soul", combat: true, name: { fr: "Âme radiante", en: "Radiant Soul" },
        description: (c) => "Résistance aux dégâts radiants. Une fois par tour, quand un sort que vous lancez inflige des dégâts radiants ou de feu, ajoutez votre modificateur de Charisme (" +
          DND.engine.signed(c.mod.cha) + ") aux dégâts de ce sort contre l'une de ses cibles.",
        effects: [
          { type: "resistance", damage: "radiant" },
          { type: "note", text: (c) => "Âme radiante : une fois par tour, " + DND.engine.signed(c.mod.cha) + " aux dégâts radiants ou de feu d'un sort, contre une cible." },
        ] },
      { level: 10, id: "celestial-resilience", name: { fr: "Résilience céleste", en: "Celestial Resilience" },
        description: (c, l) => "Quand vous utilisez Rouerie magique ou terminez un repos court ou long, vous gagnez " + Math.max(0, l + c.mod.cha) +
          " PV temporaires (niveau d'occultiste + Charisme), et jusqu'à cinq créatures visibles en gagnent " + Math.max(0, Math.floor(l / 2) + c.mod.cha) + " (moitié du niveau + Charisme).",
        effects: [{ type: "note", text: (c, l) => "Après un repos ou Rouerie magique : " + Math.max(0, l + c.mod.cha) + " PV temporaires pour vous, " +
          Math.max(0, Math.floor(l / 2) + c.mod.cha) + " pour jusqu'à cinq créatures visibles (à saisir dans PV temporaires)." }] },
      { level: 14, id: "searing-vengeance", name: { fr: "Vengeance aveuglante", en: "Searing Vengeance" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
  }]);
})();
