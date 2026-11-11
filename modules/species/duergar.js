// Espèce : Duergar — Monsters of the Multiverse (règles 2024 : pas d'augmentation de caractéristiques d'espèce)
// Noms français : traduction AideDD (règles 2014) quand elle existe.
(function () {
  const ability = "{choice:spellAbility}";
  registerModule({
    kind: "species", id: "duergar",
    name: { fr: "Duergar", en: "Duergar" },
    size: "medium", speed: 30,
    description: "Nains gris de l'Outreterre : vision dans le noir étendue, résilience, esprit fortifié et magie innée (agrandissement, invisibilité).",
    features: [
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 36 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 120 }] },
      { id: "duergar-magic", name: { fr: "Magie duergar", en: "Duergar Magic" },
        description: "Au niveau 3, Agrandissement/rapetissement sur vous-même ; au niveau 5, Invisibilité sur vous-même. Sans composante matérielle, chacun une fois sans emplacement par repos long (ou avec un emplacement).",
        effects: [
          { type: "choice", id: "spellAbility", label: "Caractéristique d'incantation (Magie duergar)", from: ["int", "wis", "cha"] },
          { type: "spell", spell: "enlarge-reduce", ability, minLevel: 3, freeCast: { max: 1, recharge: "long" } },
          { type: "spell", spell: "invisibility", ability, minLevel: 5, freeCast: { max: 1, recharge: "long" } },
        ] },
      { id: "dwarven-resilience", name: { fr: "Résilience naine", en: "Dwarven Resilience" },
        description: "Résistance aux dégâts de poison. Avantage aux jets de sauvegarde pour éviter ou mettre fin à l'état Empoisonné.",
        effects: [{ type: "resistance", damage: "poison" }, { type: "advantage", target: "condition.poisoned" }] },
      { id: "psionic-fortitude", name: { fr: "Force psionique", en: "Psionic Fortitude" },
        description: "Avantage aux jets de sauvegarde pour éviter ou mettre fin aux états Charmé et Étourdi.",
        effects: [{ type: "advantage", target: "condition.charmed" }, { type: "advantage", target: "condition.stunned" }] },
    ],
  });
})();
