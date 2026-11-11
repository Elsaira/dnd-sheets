// Don général : Affinité ombreuse (Shadow-Touched) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/affinite-ombreuse)
registerModule({
  kind: "feat", id: "shadow-touched", category: "general", aidedd: "affinite-ombreuse",
  name: { fr: "Affinité ombreuse", en: "Shadow-Touched" },
  description: "+1 Int, Sag ou Cha. Invisibilité et un sort niv 1 Illusion/Nécromancie préparés. Lancés gratuitement 1/Repos long",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "shadow-touched", name: { fr: "Affinité ombreuse", en: "Shadow-Touched" },
      description: "Magie de l'Ombre : Choisissez un sort de niveau 1 de l'école de magie d'Illusion ou de Nécromancie. Vous avez toujours ce sort et le sort invisibilité préparés. Vous pouvez lancer chacun de ces sorts sans dépenser d'emplacement de sort. Une fois l'un des sorts lancé de cette manière, vous ne pouvez plus le lancer de cette manière avant d'avoir terminé un Repos long. Vous pouvez également lancer ces sorts en utilisant des emplacements de sorts que vous possédez du niveau approprié. La caractéristique d'incantation de ces sorts est celle augmentée par ce don.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "spell", spell: "invisibility", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } },
        { type: "choice", id: "spell", label: "Sort de niveau 1 (Illusion ou Nécromancie)", from: DND.feat.spellOptions(1, ["illusion", "necromancy"]),
        grant: { type: "spell", spell: "{value}", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } } },
      ] },
  ],
});
