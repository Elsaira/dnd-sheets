// Don d'origine : Guérisseur (Healer) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "healer", category: "origin",
  name: { fr: "Guérisseur", en: "Healer" },
  description: "Soigner avec une trousse de soins, relancer les 1 sur les dés de soins.",
  features: [
    { id: "healer", combat: (c) => "Action Utilisation avec une trousse de soins : une créature à 1,50 m dépense un dé de vie, vous le lancez, elle récupère le résultat + " + c.pb + " PV. Relancez les 1 sur vos dés de soins.", name: { fr: "Guérisseur", en: "Healer" },
      description: "Médecin de combat : avec une trousse de soins, par l'action Utilisation, vous dépensez une utilisation de la trousse pour soigner une créature à 1,50 m ou moins ; elle peut dépenser un de ses dés de vie, vous lancez ce dé et elle récupère le résultat + votre bonus de maîtrise en PV. Relance des soins : quand vous lancez un dé pour les PV rendus par un sort ou par Médecin de combat, vous pouvez relancer un 1 (vous devez garder le nouveau résultat)." },
  ],
});
