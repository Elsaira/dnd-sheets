// Don général : Maître des armures intermédiaires (Medium Armor Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-des-armures-intermediaires)
registerModule({
  kind: "feat", id: "medium-armor-master", category: "general", aidedd: "maitre-des-armures-intermediaires",
  name: { fr: "Maître des armures intermédiaires", en: "Medium Armor Master" },
  description: "+1 For ou Dex. En armure intermédiaire, ajoutez 3 (au lieu de 2) à votre CA si votre Dextérité est de 16 ou plus",
  prerequisite: DND.feat.requires({ level: 4, armor: "medium" }, "Niveau 4, formation aux armures intermédiaires"),
  features: [
    { id: "medium-armor-master", name: { fr: "Maître des armures intermédiaires", en: "Medium Armor Master" },
      description: "Porteur agile : Lorsque vous portez une armure intermédiaire, vous pouvez ajouter 3 au lieu de 2 à votre CA si votre Dextérité est de 16 ou plus.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "bonus", target: "ac", value: 1, label: "Maître des armures intermédiaires", when: (c) => DND.feat.wearing(c, "medium") && c.score.dex >= 16 },
      ] },
  ],
});
