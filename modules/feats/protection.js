// Don de style de combat : Protection (Protection) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/protection)
registerModule({
  kind: "feat", id: "protection", category: "fighting-style", aidedd: "protection",
  name: { fr: "Protection", en: "Protection" },
  description: "Interposez un bouclier pour imposer un Désavantage aux attaques contre un allié à 1,50 m jusqu'à votre prochain tour",
  features: [
    { id: "protection", name: { fr: "Protection", en: "Protection" },
      description: "Lorsqu'une créature que vous pouvez voir attaque une cible autre que vous située à 1,50 mètre ou moins de vous, vous pouvez prendre une Réaction pour interposer votre bouclier si vous en tenez un. Vous infligez un Désavantage au jet d'attaque déclencheur et à tous les autres jets d'attaque contre la cible jusqu'au début de votre prochain tour si vous restez à 1,50 mètre ou moins de la cible.",
      effects: [
        { type: "action", actionType: "reaction", name: { fr: "Protection", en: "Protection" }, description: "Une créature attaque une autre cible à 1,50 m ou moins de vous : avec un bouclier, imposez le désavantage à cette attaque et aux suivantes contre la cible jusqu'à votre prochain tour." },
      ] },
  ],
});
