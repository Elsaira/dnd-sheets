// Don de faveur épique : Faveur de récupération (Boon of Recovery) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-de-recuperation)
registerModule({
  kind: "feat", id: "boon-of-recovery", category: "epic-boon", aidedd: "faveur-de-recuperation",
  name: { fr: "Faveur de récupération", en: "Boon of Recovery" },
  description: "+1 à une caractéristique (max 30). Rester à 1 PV, réserve de 10d10 de soins",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-recovery", combat: "Tombé à 0 PV sans être tué : passez à 1 PV et regagnez la moitié de vos PV max (Dernier carré). Action Bonus : dépensez des d10 de la réserve et regagnez le total en PV.", name: { fr: "Faveur de récupération", en: "Boon of Recovery" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Dernier carré : quand vous tombez à 0 PV sans être tué, vous passez à 1 PV et regagnez la moitié de vos PV maximum (une fois par repos long). Récupération de vitalité : réserve de dix d10 ; par une action Bonus, dépensez-en et lancez-les pour regagner autant de PV. Réserve récupérée au repos long.",
      effects: [
        DND.feat.ability("abilities", 30),
        { type: "resource", id: "lastStand", name: { fr: "Dernier carré", en: "Last Stand" }, max: 1, recharge: "long" },
        { type: "resource", id: "recoverVitality", name: { fr: "Récupération de vitalité (d10)", en: "Recover Vitality" }, max: 10, recharge: "long" },
      ] },
  ],
});
