// Espèce : Nain (Dwarf) — SRD 5.2
registerModule({
  kind: "species", id: "dwarf",
  name: { fr: "Nain", en: "Dwarf" },
  size: "medium", speed: 30,
  description: "Robustes et endurants : vision dans le noir étendue, résistance au poison, PV supplémentaires.",
  features: [
    { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 36 m.",
      effects: [{ type: "sense", sense: "darkvision", range: 120 }] },
    { id: "dwarven-resilience", name: { fr: "Résilience naine", en: "Dwarven Resilience" },
      description: "Résistance aux dégâts de poison. Avantage aux jets de sauvegarde pour éviter ou mettre fin à l'état Empoisonné.",
      effects: [{ type: "resistance", damage: "poison" }, { type: "advantage", target: "condition.poisoned" }] },
    { id: "dwarven-toughness", name: { fr: "Robustesse naine", en: "Dwarven Toughness" },
      description: "Vos PV maximum augmentent de 1 par niveau.",
      effects: [{ type: "bonus", target: "hpPerLevel", value: 1 }] },
    { id: "stonecunning", name: { fr: "Connaissance de la pierre", en: "Stonecunning" },
      description: "Action bonus : perception des vibrations sur 18 m pendant 10 minutes, en étant sur une surface de pierre ou en la touchant. Utilisations égales au bonus de maîtrise, récupérées au repos long.",
      effects: [{ type: "resource", id: "stonecunning", name: { fr: "Connaissance de la pierre", en: "Stonecunning" }, max: (c) => c.pb, recharge: "long" }] },
  ],
});
