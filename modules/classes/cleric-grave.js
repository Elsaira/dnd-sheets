(function () {
  const lvl = (c) => c.classLevel("cleric");
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const cd = { resource: "channelDivinity" };
  const GRAVE = { 3: ["detect-evil-and-good", "false-life", "gentle-repose", "ray-of-enfeeblement", "spare-the-dying"], 5: ["revivify", "vampiric-touch"], 7: ["blight", "death-ward"], 9: ["dispel-evil-and-good", "raise-dead"] };
  const name = (id) => DND.data.spells[id].name.fr;
  const n = (fr, en) => ({ fr, en });
  const pull = (c) => (lvl(c) >= 11 ? "1d6" : "1d4");

  registerList("subclass:cleric", [{
    id: "grave", name: n("Domaine de la Tombe", "Grave Domain"), source: "Ravenloft: The Horrors Within (2026)",
    features: [
      { level: 3, id: "grave-spells", name: n("Sorts du Domaine de la Tombe", "Grave Domain Spells"),
        description: "Sorts toujours préparés : " + Object.entries(GRAVE).map(([l, ids]) => ids.map(name).join(", ") + " (niv. " + l + ")").join(" ; ") + ".",
        effects: [].concat(...Object.entries(GRAVE).map(([l, ids]) => ids.map((spell) => ({ type: "spell", spell, ability: "wis", minLevel: Number(l) })))) },
      { level: 3, id: "circle-of-mortality", combat: true, name: n("Le cercle de la mort", "Circle of Mortality"),
        description: "Repousser la mort : une fois par tour, quand un sort ou une attaque qui touche inflige des dégâts à une créature qui n'a pas tous ses PV, +1d4 dégâts nécrotiques (1d6 au niveau 11). Revenir à la vie : Stabilisation se lance par une action bonus ; les dés de soin d'un sort ou du Conduit divin sur une créature à 0 PV donnent leur maximum.",
        effects: [{ type: "note", text: (c) => "Repousser la mort : 1×/tour, +" + pull(c) + " nécrotiques contre une créature blessée. Stabilisation en action bonus. Soins sur une créature à 0 PV : dés au maximum." }] },
      { level: 3, id: "path-to-the-grave", name: n("Le chemin de la tombe", "Path to the Grave"),
        description: "Action bonus, Conduit divin : une créature visible à 9 m est maudite jusqu'au début de votre prochain tour (Désavantage à ses attaques et JS). Quand vous ou un allié visible la touchez, vous pouvez finir la malédiction : + niveau de clerc dégâts nécrotiques ou radiants.",
        effects: [{ type: "action", name: n("Le chemin de la tombe", "Path to the Grave"), actionType: "bonus", ...cd,
          description: (c) => "Conduit divin : malédiction sur une créature visible à 9 m jusqu'au début de votre prochain tour, Désavantage à ses attaques et JS. Quand vous ou un allié visible la touchez : fin de la malédiction, +" + lvl(c) + " dégâts nécrotiques ou radiants." }] },
      { level: 6, id: "sentinel-at-deaths-door", name: n("La sentinelle au seuil de la mort", "Sentinel at Death's Door"),
        description: "Réaction quand vous ou une créature En péril visible à 18 m êtes touché par une attaque : dégâts divisés par deux (arrondi inférieur), et les effets d'un coup critique sont annulés. Utilisations : modificateur de Sagesse (min. 1), repos long.",
        effects: [
          { type: "resource", id: "sentinelAtDeathsDoor", name: n("Sentinelle au seuil de la mort", "Sentinel at Death's Door"), max: wisMin1, recharge: "long", description: "Dégâts d'une attaque divisés par deux." },
          { type: "action", name: n("Sentinelle au seuil de la mort", "Sentinel at Death's Door"), actionType: "reaction", resource: "sentinelAtDeathsDoor",
            description: "Vous ou une créature En péril visible à 18 m êtes touché par une attaque : dégâts divisés par deux (arrondi inférieur), effets du critique annulés." },
        ] },
      { level: 17, id: "divine-reaper", name: n("Faucheur divin", "Divine Reaper"),
        description: "Nécromancie améliorée : un sort de nécromancie de niveau 5 ou moins qui cible une créature, ou un sort de domaine, peut cibler une seconde créature en dépensant un Conduit divin. Gardien des âmes : quand un ennemi meurt à 18 m, vous ou une créature visible à 18 m récupérez 2 × niveau de clerc PV (pas si Incapable d'agir), 1 fois par repos court ou long, ou en dépensant un emplacement de niveau 6+.",
        effects: [
          { type: "resource", id: "keeperOfSouls", name: n("Gardien des âmes", "Keeper of Souls"), max: 1, recharge: "short", description: (c) => 2 * lvl(c) + " PV à la mort d'un ennemi à 18 m. Recharge aussi avec un emplacement de niveau 6+." },
          { type: "note", text: "Nécromancie améliorée : Conduit divin pour une seconde cible (sort de nécromancie niv. ≤ 5 ou sort de domaine)." },
        ] },
    ],
  }]);
})();
