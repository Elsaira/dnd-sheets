// Don général : Maître des armures lourdes (Heavy Armor Master) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/maitre-des-armures-lourdes)
registerModule({
  kind: "feat", id: "heavy-armor-master", category: "general", aidedd: "maitre-des-armures-lourdes",
  name: { fr: "Maître des armures lourdes", en: "Heavy Armor Master" },
  description: "+1 For ou Con. En armure lourde, réduisez les dégâts contondants, perforants et tranchants de votre bonus de maîtrise",
  prerequisite: DND.feat.requires({ level: 4, armor: "heavy" }, "Niveau 4, formation aux armures lourdes"),
  features: [
    { id: "heavy-armor-master", combat: true, name: { fr: "Maître des armures lourdes", en: "Heavy Armor Master" },
      description: "Réduction des dégâts : Lorsque vous êtes touché par une attaque alors que vous portez une armure lourde, les dégâts contondants, perforants et tranchants infligés par cette attaque sont réduits d'un montant égal à votre bonus de maîtrise.",
      effects: [
        DND.feat.ability(["str", "con"]),
      ] },
  ],
});
