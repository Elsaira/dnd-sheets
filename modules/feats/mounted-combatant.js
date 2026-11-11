// Don général : Combattant monté (Mounted Combatant) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/combattant-monte)
registerModule({
  kind: "feat", id: "mounted-combatant", category: "general", aidedd: "combattant-monte",
  name: { fr: "Combattant monté", en: "Mounted Combatant" },
  description: "+1 For, Dex ou Sag. Avantage vs créatures plus petites non montées. La monture prend la moitié des dégâts si JdS de Dex raté",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "mounted-combatant", combat: true, name: { fr: "Combattant monté", en: "Mounted Combatant" },
      description: "Frappe montée : Lorsque vous êtes sur une monture, vous bénéficiez d'un Avantage aux jets d'attaque contre toute créature non montée dans un rayon de 1,50 m autour de votre monture et dont la taille est inférieure d'au moins une taille à celle de votre monture. Pas de côté : Si votre monture est soumise à un effet qui lui permet d'effectuer un jet de sauvegarde de Dextérité pour ne subir que la moitié des dégâts, elle ne subit aucun dégât en cas de réussite au jet de sauvegarde et seulement la moitié en cas d'échec. Pour que votre monture bénéficie de cet avantage, vous devez la monter et aucun de vous deux ne doit être Incapable d'agir. Déviation : Lorsque vous êtes sur une monture, vous pouvez forcer une attaque qui touche votre monture à vous toucher à la place si vous n'êtes pas Incapable d'agir.",
      effects: [
        DND.feat.ability(["str", "dex", "wis"]),
      ] },
  ],
});
