// Don général : Télékinésiste (Telekinetic) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/telekinesiste)
registerModule({
  kind: "feat", id: "telekinetic", category: "general", aidedd: "telekinesiste",
  name: { fr: "Télékinésiste", en: "Telekinetic" },
  description: "+1 Int, Sag ou Cha. Main de mage (invisible, portée +9 m). Action Bonus pour pousser une créature de 1,50 m (JdS For)",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "telekinetic", name: { fr: "Télékinésiste", en: "Telekinetic" },
      description: "Télékinésie mineure : Vous apprenez le sort main de mage. Vous pouvez le lancer sans composantes verbale ou somatique, vous pouvez rendre la main spectrale invisible, et sa portée ainsi que la distance à laquelle elle peut se trouver augmentent de 9 mètres lorsque vous le lancez. La caractéristique d'incantation du sort est celle augmentée par ce don. Bourrade télékinétique : Par une action Bonus, vous pouvez pousser télékinétiquement une créature que vous pouvez voir dans un rayon de 9 mètres. Dans ce cas, la cible doit réussir un jet de sauvegarde de Force (DD 8 plus le modificateur de la caractéristique augmentée par ce don et votre bonus de maîtrise) ou être déplacée de 1,50 mètre vers vous ou loin de vous.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "spell", spell: "mage-hand", ability: "{choice:ability}" },
        { type: "action", actionType: "bonus", name: { fr: "Bourrade télékinétique", en: "Telekinetic Shove" }, description: "Une créature visible à 9 m ou moins fait un JS de Force (DD 8 + bonus de maîtrise + modificateur de la caractéristique du don) ou est déplacée de 1,50 m vers vous ou loin de vous." },
      ] },
  ],
});
