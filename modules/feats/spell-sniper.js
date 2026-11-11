// Don général : Incantateur d'élite (Spell Sniper) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/incantateur-d-elite)
registerModule({
  kind: "feat", id: "spell-sniper", category: "general", aidedd: "incantateur-d-elite",
  name: { fr: "Incantateur d'élite", en: "Spell Sniper" },
  description: "+1 Int, Sag ou Cha. Les attaques de sorts ignorent les Abris. Pas de Désavantage au contact. Portée (3+ m) augmentée de 18 m",
  prerequisite: DND.feat.requires({ level: 4, spellcasting: true }, "Niveau 4, capacité Sorts ou Magie de pacte"),
  features: [
    { id: "spell-sniper", combat: true, name: { fr: "Incantateur d'élite", en: "Spell Sniper" },
      description: "Contournement d'abri : Vos attaques à distance avec des sorts ignorent les Abris partiels (1/2) et les Abris importants (3/4). Incantation au corps à corps : Être à 1,50 mètre ou moins d'un ennemi n'inflige pas de Désavantage à vos jets d'attaque avec des sorts. Portée améliorée : Lorsque vous lancez un sort d'une portée d'au moins 3 mètres et qui nécessite un jet d'attaque, vous pouvez augmenter sa portée de 18 mètres.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
      ] },
  ],
});
