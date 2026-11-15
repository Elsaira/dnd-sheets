(function () {
  const lvl = (c) => c.classLevel("cleric");
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const cd = { resource: "channelDivinity" };
  const GRAVE = { 3: ["detect-evil-and-good", "false-life", "gentle-repose", "ray-of-enfeeblement", "spare-the-dying"], 5: ["revivify", "vampiric-touch"], 7: ["blight", "death-ward"], 9: ["dispel-evil-and-good", "raise-dead"] };
  const name = (id) => DND.data.spells[id].name.fr;
  const n = (fr, en) => ({ fr, en });
  const pull = (c) => (lvl(c) >= 11 ? "1d6" : "1d4");

  registerList("subclass:cleric", [{
    id: "grave", name: n("Domaine du Sépulcre", "Grave Domain"), source: "Ravenloft: The Horrors Within (2026)",
    features: [
      { level: 3, id: "grave-spells", name: n("Sorts du Domaine du Sépulcre", "Grave Domain Spells"),
        description: "Sorts toujours préparés : " + Object.entries(GRAVE).map(([l, ids]) => ids.map(name).join(", ") + " (niv. " + l + ")").join(" ; ") + ".",
        effects: [].concat(...Object.entries(GRAVE).map(([l, ids]) => ids.map((spell) => ({ type: "spell", spell, ability: "wis", minLevel: Number(l) })))) },
      { level: 3, id: "circle-of-mortality", combat: true, name: n("Cercle de mortalité", "Circle of Mortality"),
        description: "Empire funeste : une fois par tour, quand vous infligez des dégâts avec un sort ou une attaque qui touche une créature blessée, elle subit +1d4 dégâts nécrotiques (+1d6 au niveau 11). Vigueur d'outre-tombe : Stabilisation se lance par une action bonus ; quand un sort ou le Conduit divin vous fait lancer des dés pour soigner une créature à 0 PV, ces dés donnent leur maximum.",
        effects: [{ type: "castingTime", spell: "spare-the-dying", value: "bonus" }, { type: "note", text: (c) => "Empire funeste : 1×/tour, +" + pull(c) + " dégâts nécrotiques contre une créature blessée. Stabilisation en action bonus. Soins sur une créature à 0 PV : dés au maximum." }] },
      { level: 3, id: "path-to-the-grave", name: n("Voie du Sépulcre", "Path to the Grave"),
        description: "Action bonus, Conduit divin : une créature que vous voyez à 9 m est maudite jusqu'au début de votre prochain tour (désavantage à ses jets d'attaque et de sauvegarde). Quand vous ou un allié que vous voyez la touchez avec une attaque, vous pouvez mettre fin à la malédiction sans action requise : l'attaque inflige aussi des dégâts nécrotiques ou radiants (au choix) égaux à votre niveau de clerc.",
        effects: [{ type: "action", name: n("Voie du Sépulcre", "Path to the Grave"), actionType: "bonus", ...cd,
          description: (c) => "Conduit divin : maudissez une créature que vous voyez à 9 m jusqu'au début de votre prochain tour; elle subit le désavantage à ses jets d'attaque et de sauvegarde. Quand vous ou un allié que vous voyez la touchez avec une attaque, vous pouvez mettre fin à la malédiction sans action : l'attaque inflige aussi +" + lvl(c) + " dégâts nécrotiques ou radiants (au choix)." }] },
      { level: 6, id: "sentinel-at-deaths-door", name: n("La sentinelle au seuil de la mort", "Sentinel at Death's Door"),
        description: "Réaction quand vous ou une créature En péril visible à 18 m êtes touché par une attaque : dégâts divisés par deux (arrondi inférieur), et les effets d'un coup critique sont annulés. Utilisations : modificateur de Sagesse (min. 1), repos long.",
        effects: [
          { type: "resource", id: "sentinelAtDeathsDoor", name: n("Sentinelle au seuil de la mort", "Sentinel at Death's Door"), max: wisMin1, recharge: "long", description: "Dégâts d'une attaque divisés par deux." },
          { type: "action", name: n("Sentinelle au seuil de la mort", "Sentinel at Death's Door"), actionType: "reaction", resource: "sentinelAtDeathsDoor",
            description: "Vous ou une créature En péril visible à 18 m êtes touché par une attaque : dégâts divisés par deux (arrondi inférieur), effets du critique annulés." },
        ] },
      { level: 17, id: "divine-reaper", name: n("Faucheur divin", "Divine Reaper"),
        description: "Nécromancie améliorée : quand vous lancez un sort de nécromancie de niveau 5 ou moins qui cible une seule créature, ou un sort de la table Sorts du Domaine du Sépulcre, vous pouvez dépenser un Conduit divin pour cibler une seconde créature à portée. Les composantes matérielles coûteuses ou consommées sont fournies séparément pour chaque cible. Gardien des âmes : quand un ennemi meurt à 18 m, vous ou une créature que vous voyez à 18 m récupérez 2 × niveau de clerc PV. Vous ne pouvez pas utiliser cette aptitude si vous êtes Neutralisé. Après utilisation, vous devez terminer un repos court ou long, ou dépenser sans action un emplacement de sort de niveau 6 ou supérieur, avant de la réutiliser.",
        effects: [
          { type: "resource", id: "keeperOfSouls", name: n("Gardien des âmes", "Keeper of Souls"), max: 1, recharge: "short", slotRegain: 6, blockedBy: "incapacitated", description: (c) => 2 * lvl(c) + " PV à la mort d'un ennemi à 18 m. Recharge aussi avec un emplacement de niveau 6+." },
          { type: "note", text: "Nécromancie améliorée : dépensez un Conduit divin pour cibler une seconde créature à portée avec un sort de nécromancie niv. ≤ 5 qui ne cible qu'une créature, ou un sort du Domaine du Sépulcre. Fournissez les composantes coûteuses ou consommées pour chaque cible." },
        ] },
    ],
  }]);
})();
