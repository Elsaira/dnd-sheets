// Don de style de combat : Interception (Interception) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/interception)
registerModule({
  kind: "feat", id: "interception", category: "fighting-style", aidedd: "interception",
  name: { fr: "Interception", en: "Interception" },
  description: "Lorsqu'un allié à 1,50 m est touché, Réaction pour réduire les dégâts subis de 1d10 + bonus de maîtrise (bouclier ou arme)",
  features: [
    { id: "interception", name: { fr: "Interception", en: "Interception" },
      description: "Lorsqu'une créature que vous pouvez voir touche une autre créature à 1,50 m ou moins de vous lors d'un jet d'attaque, vous pouvez prendre une Réaction pour réduire les dégâts infligés à la cible de 1d10 plus votre bonus de maîtrise. Vous devez tenir un bouclier ou une arme courante ou de guerre pour utiliser cette Réaction.",
      effects: [
        { type: "action", actionType: "reaction", name: { fr: "Interception", en: "Interception" }, description: (c) => "Une créature à 1,50 m ou moins de vous est touchée : réduisez les dégâts de 1d10 + " + c.pb + ". Bouclier ou arme courante ou de guerre en main." },
      ] },
  ],
});
