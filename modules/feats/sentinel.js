// Don général : Sentinelle (Sentinel) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/sentinelle)
registerModule({
  kind: "feat", id: "sentinel", category: "general", aidedd: "sentinelle",
  name: { fr: "Sentinelle", en: "Sentinel" },
  description: "+1 For ou Dex. AO contre une créature que se désengage/frappe un allié. Une AO réussie réduit à 0 la Vitesse de la cible",
  prerequisite: DND.feat.requires({ level: 4, scores: ["str", "dex"] }, "Niveau 4, Force ou Dextérité 13"),
  features: [
    { id: "sentinel", combat: true, name: { fr: "Sentinelle", en: "Sentinel" },
      description: "Gardien : Immédiatement après qu'une créature à 1,50 mètre ou moins de vous prend l'action Désengagement ou touche une cible autre que vous avec une attaque, vous pouvez effectuer une attaque d'opportunité contre cette créature. Immobilisation : Lorsque vous touchez une créature avec une attaque d'opportunité, sa vitesse devient 0 pour le reste du tour en cours.",
      effects: [
        DND.feat.ability(["str", "dex"]),
      ] },
  ],
});
