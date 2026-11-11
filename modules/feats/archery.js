// Don de style de combat : Archerie (Archery) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/archerie)
registerModule({
  kind: "feat", id: "archery", category: "fighting-style", aidedd: "archerie",
  name: { fr: "Archerie", en: "Archery" },
  description: "Octroie un bonus de +2 aux jets d'attaque avec des armes à distance",
  features: [
    { id: "archery", combat: true, name: { fr: "Archerie", en: "Archery" },
      description: "Vous obtenez un bonus de +2 aux jets d'attaque effectués avec des armes à distance.",
      effects: [
        { type: "bonus", target: "attack.ranged", value: 2, label: "Archerie" },
      ] },
  ],
});
