// Sorts du Domaine de la Tombe (sous-classe de Clerc) absents du catalogue — Player's Handbook 2024.
// Mécaniques relevées sur AideDD (aidedd.org/spell/fr/coquille-antivie) le 2026-10-15.
(function () {
  const add = (spells) => DND.registerSpells(spells.filter((s) => !DND.data.spells[s.id]));
  add([
    // Niveau 5
    S("antilife-shell", "Coquille antivie", "Antilife Shell", 5, "abjuration", "action", "self", "V, S", "1 heure",
      ["druid"], { concentration: true, notes: "Émanation de 3 m : seules les créatures artificielles et les morts-vivants peuvent la traverser." }),
  ]);
})();
