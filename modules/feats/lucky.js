// Don d'origine : Chanceux (Lucky) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "lucky", category: "origin",
  name: { fr: "Chanceux", en: "Lucky" },
  description: "Points de chance (bonus de maîtrise) pour obtenir un avantage ou imposer un désavantage.",
  features: [
    { id: "lucky", combat: "Dépensez 1 point de chance : Avantage à votre jet de d20, ou Désavantage à une attaque contre vous.", name: { fr: "Chanceux", en: "Lucky" },
      description: "Points de chance : autant que votre bonus de maîtrise, récupérés à la fin d'un repos long. Avantage : quand vous lancez un d20 pour un jet de d20, dépensez 1 point pour avoir l'avantage. Désavantage : quand une créature lance un d20 pour un jet d'attaque contre vous, dépensez 1 point pour lui imposer le désavantage.",
      effects: [{ type: "resource", id: "luck", name: { fr: "Points de chance", en: "Luck Points" }, max: (c) => c.pb, recharge: "long" }] },
  ],
});
