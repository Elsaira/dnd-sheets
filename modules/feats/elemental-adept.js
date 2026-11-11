// Don général : Adepte élémentaire (Elemental Adept) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/adepte-elementaire)
registerModule({
  kind: "feat", id: "elemental-adept", category: "general", repeatable: true, aidedd: "adepte-elementaire",
  name: { fr: "Adepte élémentaire", en: "Elemental Adept" },
  description: "+1 Int, Sag ou Cha. Les sorts ignorent la Résistance d'un type choisi et traitent ses 1 aux dés de dégâts comme des 2",
  prerequisite: DND.feat.requires({ level: 4, spellcasting: true }, "Niveau 4, capacité Sorts ou Magie de pacte"),
  features: [
    { id: "elemental-adept", combat: true, name: { fr: "Adepte élémentaire", en: "Elemental Adept" },
      description: "Maîtrise des énergies : Choisissez l'un des types de dégâts suivants : Acide, Froid, Feu, Foudre ou Tonnerre. Les sorts que vous lancez ignorent la Résistance aux dégâts du type choisi. De plus, lorsque vous lancez des dégâts pour un sort que vous lancez et qui inflige des dégâts de ce type, vous pouvez considérer n'importe quel 1 sur un dé de dégâts comme un 2.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "choice", id: "element", label: "Type de dégâts maîtrisé", from: ["acid", "cold", "fire", "lightning", "thunder"] },
      ] },
  ],
});
