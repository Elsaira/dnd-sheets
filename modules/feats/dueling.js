// Don de style de combat : Duel (Dueling) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/duel)
registerModule({
  kind: "feat", id: "dueling", category: "fighting-style", aidedd: "duel",
  name: { fr: "Duel", en: "Dueling" },
  description: "Lorsque vous tenez une arme de corps à corps dans une main et aucune autre, octroie un bonus de +2 aux dégâts avec cette arme",
  features: [
    { id: "dueling", combat: true, name: { fr: "Duel", en: "Dueling" },
      description: "Lorsque vous tenez une arme de corps à corps dans une main et aucune autre arme, vous obtenez un bonus de +2 aux dégâts infligés avec cette arme.",
      effects: [
        { type: "bonus", target: "damage.weapon", value: 2, label: "Duel",
          weapon: (w, x) => w.type === "melee" && !w.props.includes("two-handed") && !x.twoHanded && !x.others.length },
      ] },
  ],
});
