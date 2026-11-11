// Don d'origine : Attaquant sauvage (Savage Attacker) — SRD 5.2
registerModule({
  kind: "feat", id: "savage-attacker", category: "origin",
  name: { fr: "Sauvagerie martiale", en: "Savage Attacker" },
  description: "Relancer les dés de dégâts d'une arme une fois par tour.",
  features: [
    { id: "savage-attacker", combat: true, name: { fr: "Sauvagerie martiale", en: "Savage Attacker" },
      description: "Une fois par tour, quand vous touchez une cible avec une arme, vous pouvez lancer deux fois les dés de dégâts de l'arme et garder le résultat de votre choix." },
  ],
});
