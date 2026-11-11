// Classes factices pour les tests (non chargées par la fiche).
registerModule({
  kind: "class", id: "test-fighter", name: { fr: "Combattant test", en: "Test Fighter" },
  hitDie: 10, savingThrows: ["str", "con"], subclassLevel: 3,
  multiclassRequirement: [["str"], ["dex"]],
  proficiencies: { armor: ["light", "medium", "heavy", "shield"], weapons: ["simple", "martial"],
    skills: { choose: 2, from: ["athletics", "perception", "survival"] } },
  multiclassProficiencies: { armor: ["light", "medium", "shield"], weapons: ["martial"] },
  features: [
    { level: 1, id: "second-wind", name: { fr: "Second souffle", en: "Second Wind" },
      effects: [{ type: "resource", id: "secondWind", name: { fr: "Second souffle", en: "Second Wind" }, max: { 1: 2, 4: 3 }, recharge: "long", shortRegain: 1 }] },
    { level: 4, id: "asi4", name: { fr: "Don", en: "Feat" },
      effects: [{ type: "choice", id: "feat4", label: "Don", from: "feats", filter: { category: ["general", "origin"] } }] },
  ],
  subclasses: [{ id: "test-sub", name: { fr: "Sous-classe test", en: "Test Sub" },
    features: [{ level: 3, id: "sub3", name: { fr: "Aptitude test", en: "Test" }, effects: [{ type: "bonus", target: "ac", value: 1 }] }] }],
});
registerModule({
  kind: "class", id: "test-wizard", name: { fr: "Mage test", en: "Test Wizard" },
  hitDie: 6, savingThrows: ["int", "wis"], multiclassRequirement: [["int"]],
  proficiencies: { weapons: ["simple"], skills: { choose: 2, from: ["arcana", "history"] } },
  spellcasting: { progression: "full", ability: "int", list: "wizard", cantrips: { 1: 3, 4: 4 }, prepared: { 1: 4, 2: 5 } },
  features: [{ level: 1, id: "unarmored", name: { fr: "Test CA", en: "Test" },
    effects: [{ type: "acFormula", label: "Armure de mage", base: 13, abilities: ["dex"] }] }],
});
registerModule({
  kind: "class", id: "test-pact", name: { fr: "Pacte test", en: "Test Pact" },
  hitDie: 8, savingThrows: ["wis", "cha"], multiclassRequirement: [["cha"]],
  spellcasting: { progression: "pact", ability: "cha", list: "warlock", cantrips: { 1: 2 }, prepared: { 1: 2 },
    pactSlots: { 1: { count: 1, level: 1 }, 2: { count: 2, level: 1 }, 3: { count: 2, level: 2 } } },
  features: [],
});
