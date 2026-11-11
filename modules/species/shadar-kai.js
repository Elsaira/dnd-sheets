// Espèce : Shadar-kai — Monsters of the Multiverse (règles 2024 : pas d'augmentation de caractéristiques d'espèce)
(function () {
  const blessing = "Action bonus : téléportation jusqu'à 9 m vers un espace inoccupé visible. Dès le niveau 3, vous obtenez aussi la résistance à tous les dégâts jusqu'au début de votre prochain tour.";
  registerModule({
    kind: "species", id: "shadar-kai",
    name: { fr: "Shadar-kai", en: "Shadar-kai" },
    size: "medium", speed: 30,
    description: "Elfes liés à la Gisombre et à la Reine Corbeau : téléportation, résistance nécrotique, ascendance féerique.",
    features: [
      { id: "blessing-of-the-raven-queen", name: { fr: "Bénédiction de la Reine Corbeau", en: "Blessing of the Raven Queen" },
        description: blessing + " Utilisations : bonus de maîtrise par repos long.",
        effects: [
          { type: "resource", id: "ravenQueen", name: { fr: "Bénédiction de la Reine Corbeau", en: "Blessing of the Raven Queen" }, max: (c) => c.pb, recharge: "long" },
          { type: "action", name: { fr: "Bénédiction de la Reine Corbeau", en: "Blessing of the Raven Queen" }, actionType: "bonus", resource: "ravenQueen", description: blessing },
        ] },
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "fey-ancestry", name: { fr: "Ascendance féerique", en: "Fey Ancestry" },
        description: "Avantage aux jets de sauvegarde pour éviter ou mettre fin à l'état Charmé.",
        effects: [{ type: "advantage", target: "condition.charmed" }] },
      { id: "keen-senses", name: { fr: "Sens aiguisés", en: "Keen Senses" }, description: "Maîtrise de la compétence Perception.",
        effects: [{ type: "proficiency", target: "skill.perception" }] },
      { id: "necrotic-resistance", name: { fr: "Résistance nécrotique", en: "Necrotic Resistance" },
        description: "Résistance aux dégâts nécrotiques.",
        effects: [{ type: "resistance", damage: "necrotic" }] },
      { id: "trance", name: { fr: "Transe", en: "Trance" },
        description: "Vous ne dormez pas et la magie ne peut pas vous endormir. Un repos long vous demande 4 heures de méditation consciente. À la fin de cette transe, vous gagnez deux maîtrises d'arme ou d'outil de votre choix jusqu'à la fin de votre prochain repos long (à noter dans « Maîtrises supplémentaires »)." },
    ],
  });
})();
