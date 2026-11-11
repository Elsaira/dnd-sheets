// Historique : Artisan — Manuel des joueurs 2024, d'après AideDD
registerModule({
  kind: "background", id: "artisan",
  name: { fr: "Artisan", en: "Artisan" },
  description: "Force, Dextérité, Intelligence · Façonneur · Investigation, Persuasion · Un outil d'artisan.",
  features: [
    { id: "artisan", name: { fr: "Artisan", en: "Artisan" },
      description: "Équipement : (A) Outils d'artisan (identiques à ci-dessus), 2 sacoches, tenue de voyage, 32 po ; ou (B) 50 po.",
      effects: [
        { type: "choice", id: "abilityBonus", label: "Augmentation de caractéristiques", help: "+2 à l'une et +1 à une autre, ou +1 aux trois.",
          from: ["str", "dex", "int"], count: 3, maxPerOption: 2, grant: { type: "ability", ability: "{value}", value: 1, max: 20 } },
        { type: "feat", id: "crafter" },
        { type: "proficiency", target: "skill.investigation" },
        { type: "proficiency", target: "skill.persuasion" },
        { type: "choice", id: "tool", label: "Outils d'artisan maîtrisés", from: "tools.artisan" },
      ] },
  ],
});
