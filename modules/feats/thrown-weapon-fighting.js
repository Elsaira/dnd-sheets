// Don de style de combat : Arme de lancer (Thrown Weapon Fighting) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/arme-de-lancer)
registerModule({
  kind: "feat", id: "thrown-weapon-fighting", category: "fighting-style", aidedd: "arme-de-lancer",
  name: { fr: "Arme de lancer", en: "Thrown Weapon Fighting" },
  description: "Octroie un bonus de +2 aux dégâts lorsque vous touchez avec une arme à distance ayant la propriété Lancer",
  features: [
    { id: "thrown-weapon-fighting", combat: true, name: { fr: "Arme de lancer", en: "Thrown Weapon Fighting" },
      description: "Lorsque vous touchez lors d'un jet d'attaque à distance avec une arme dotée de la propriété Lancer, vous obtenez un bonus de +2 aux dégâts.",
      effects: [
        { type: "bonus", target: "damage.weapon", value: 2, label: "Arme de lancer", weapon: (w) => w.type === "ranged" && w.props.includes("thrown") },
      ] },
  ],
});
