// Don de style de combat : Combat à deux armes (Two-Weapon Fighting) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/combat-a-deux-armes)
registerModule({
  kind: "feat", id: "two-weapon-fighting", category: "fighting-style", aidedd: "combat-a-deux-armes",
  name: { fr: "Combat à deux armes", en: "Two-Weapon Fighting" },
  description: "Lors de l'attaque supplémentaire d'une arme avec la propriété Légère, ajoutez votre modificateur de caractéristique aux dégâts",
  features: [
    { id: "two-weapon-fighting", combat: true, name: { fr: "Combat à deux armes", en: "Two-Weapon Fighting" },
      description: "Lorsque vous effectuez une attaque supplémentaire grâce à une arme dotée de la propriété Légère, vous pouvez ajouter votre modificateur de caractéristique aux dégâts de cette attaque si vous ne l'ajoutez pas déjà." },
  ],
});
