// Don général : Empoisonneur (Poisoner) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/empoisonneur)
registerModule({
  kind: "feat", id: "poisoner", category: "general", aidedd: "empoisonneur",
  name: { fr: "Empoisonneur", en: "Poisoner" },
  description: "+1 Dex ou Int. Ignorer la Résistance au poison. Préparer des potions de poison (50 po/h) qui infligent 2d8 dégâts de poison",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "poisoner", combat: true, name: { fr: "Empoisonneur", en: "Poisoner" },
      description: "Poison virulent : Lorsque vous effectuez un jet de dégâts infligeant des dégâts de poison, ignorez la Résistance aux dégâts de poison. Préparation de poison : Vous maîtrisez le kit d'empoisonneur. En 1 heure de travail avec ce kit et en dépensant 50 po de matériaux, vous pouvez créer un nombre de doses de poison égal à votre bonus de maîtrise. Par une action Bonus, vous pouvez appliquer une dose de poison sur une arme ou une munition. Une fois appliqué, le poison conserve son efficacité pendant 1 minute ou jusqu'à ce que vous infligiez des dégâts avec l'objet empoisonné, selon la durée la plus courte. Lorsqu'une créature subit des dégâts de l'objet empoisonné, elle doit réussir un jet de sauvegarde de Constitution (DD 8 plus le modificateur de la caractéristique augmentée par ce don et votre bonus de maîtrise) ou subir 2d8 dégâts de poison et avoir l'état Empoisonné jusqu'à la fin de votre prochain tour.",
      effects: [
        DND.feat.ability(["dex", "int"]),
        { type: "proficiency", target: "tool.poisoners-kit" },
      ] },
  ],
});
