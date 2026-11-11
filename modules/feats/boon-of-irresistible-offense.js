// Don de faveur épique : Faveur d'attaque irrésistible (Boon of Irresistible Offense) — Manuel des joueurs 2024 ; AideDD donne seulement le nom (aidedd.org/feat/fr/faveur-d-attaque-irresistible)
registerModule({
  kind: "feat", id: "boon-of-irresistible-offense", category: "epic-boon", aidedd: "faveur-d-attaque-irresistible",
  name: { fr: "Faveur d'attaque irrésistible", en: "Boon of Irresistible Offense" },
  description: "+1 For ou Dex (max 30). Ignore la résistance aux dégâts physiques, dégâts bonus sur un 20",
  prerequisite: DND.feat.requires({ level: 19 }, "Niveau 19"),
  features: [
    { id: "boon-of-irresistible-offense", combat: true, name: { fr: "Faveur d'attaque irrésistible", en: "Boon of Irresistible Offense" },
      description: "Résumé de mémoire (texte non disponible sur AideDD) : à vérifier dans le Manuel des joueurs. Vaincre les défenses : vos dégâts contondants, perforants et tranchants ignorent la résistance. Frappe écrasante : quand vous obtenez 20 au d20 d'un jet d'attaque, la cible subit des dégâts supplémentaires du même type égaux à la valeur de la caractéristique augmentée par ce don.",
      effects: [
        DND.feat.ability(["str", "dex"], 30),
      ] },
  ],
});
