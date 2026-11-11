// Don général : Mage de guerre (War Caster) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/mage-de-guerre)
registerModule({
  kind: "feat", id: "war-caster", category: "general", aidedd: "mage-de-guerre",
  name: { fr: "Mage de guerre", en: "War Caster" },
  description: "+1 Int, Sag ou Cha. Avantage aux JdS de Concentration. Réaction pour lancer un sort au lieu d'AO. Somatiques les mains occupées",
  prerequisite: DND.feat.requires({ level: 4, spellcasting: true }, "Niveau 4, capacité Sorts ou Magie de pacte"),
  features: [
    { id: "war-caster", combat: true, name: { fr: "Mage de guerre", en: "War Caster" },
      description: "Concentration : Vous bénéficiez d'un Avantage aux jets de sauvegarde de Constitution que vous effectuez pour maintenir votre concentration. Sort réactif : Lorsqu'une créature provoque une Attaque d'opportunité de votre part en quittant votre allonge, vous pouvez prendre une Réaction pour lancer un sort sur elle, au lieu d'effectuer une Attaque d'opportunité. Le sort doit avoir un temps d'incantation d'une action et ne doit cibler que cette créature. Composantes somatiques : Vous pouvez exécuter les composantes somatiques des sorts même lorsque vous avez des armes ou un bouclier dans une ou deux mains.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "advantage", target: "save.con", note: "Concentration (Mage de guerre)" },
      ] },
  ],
});
