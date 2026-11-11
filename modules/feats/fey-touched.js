// Don général : Affinité féerique (Fey-Touched) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/affinite-feerique)
registerModule({
  kind: "feat", id: "fey-touched", category: "general", aidedd: "affinite-feerique",
  name: { fr: "Affinité féerique", en: "Fey-Touched" },
  description: "+1 Int, Sag ou Cha. Foulée brumeuse et un sort niv 1 Divination/Enchantement préparés. Lancés gratuitement 1/Repos long",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "fey-touched", name: { fr: "Affinité féerique", en: "Fey-Touched" },
      description: "Magie des fées : Choisissez un sort de niveau 1 de l'école de magie de Divination ou d'Enchantement. Vous avez toujours ce sort et le sort foulée brumeuse préparés. Vous pouvez lancer chacun de ces sorts sans dépenser d'emplacement de sort. Une fois l'un des sorts lancé de cette manière, vous ne pouvez plus le lancer de cette manière avant d'avoir terminé un Repos long. Vous pouvez également lancer ces sorts en utilisant des emplacements de sorts que vous possédez du niveau approprié. La caractéristique d'incantation de ces sorts est celle augmentée par ce don.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "spell", spell: "misty-step", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } },
        { type: "choice", id: "spell", label: "Sort de niveau 1 (Divination ou Enchantement)", from: DND.feat.spellOptions(1, ["divination", "enchantment"]),
        grant: { type: "spell", spell: "{value}", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } } },
      ] },
  ],
});
