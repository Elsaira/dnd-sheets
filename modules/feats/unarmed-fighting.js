// Don de style de combat : Combat à mains nues (Unarmed Fighting) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/combat-a-mains-nues)
registerModule({
  kind: "feat", id: "unarmed-fighting", category: "fighting-style", aidedd: "combat-a-mains-nues",
  name: { fr: "Combat à mains nues", en: "Unarmed Fighting" },
  description: "Frappe à mains nues inflige 1d6 + mod.For (1d8 si mains libres). Inflige 1d4 dégâts contondants à une créature agrippée (1/tour)",
  features: [
    { id: "unarmed-fighting", combat: true, name: { fr: "Combat à mains nues", en: "Unarmed Fighting" },
      description: "Lorsque vous touchez avec votre Frappe à mains nues et infligez des dégâts, vous pouvez infliger des dégâts contondants égaux à 1d6 plus votre modificateur de Force au lieu des dégâts normaux d'une Frappe à mains nues. Si vous ne tenez ni arme ni bouclier lors du jet d'attaque, le d6 devient un d8. Au début de chacun de vos tours, vous pouvez infliger 1d4 dégâts contondants à une créature que vous agrippez." },
  ],
});
