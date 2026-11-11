// Don général : Tueur de mages (Mage Slayer) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/tueur-de-mages)
registerModule({
  kind: "feat", id: "mage-slayer", category: "general", aidedd: "tueur-de-mages",
  name: { fr: "Tueur de mages", en: "Mage Slayer" },
  description: "+1 For ou Dex. Toucher une cible concentrée lui donne un Désavantage au JdS. Réussite auto des JdS ratés d'Int/Sag/Cha 1/Repos",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "mage-slayer", combat: true, name: { fr: "Tueur de mages", en: "Mage Slayer" },
      description: "Briseur de concentration : Lorsque vous infligez des dégâts à une créature en concentration, celle-ci a un Désavantage au jet de sauvegarde qu'elle effectue pour maintenir sa Concentration. Esprit préservé : Si vous ratez un jet de sauvegarde d'Intelligence, de Sagesse ou de Charisme, vous pouvez le transformer en succès. Une fois cet avantage utilisé, vous ne pouvez plus l'utiliser avant d'avoir terminé un Repos court ou long.",
      effects: [
        DND.feat.ability(["str", "dex"]),
        { type: "resource", id: "guardedMind", name: { fr: "Esprit préservé", en: "Guarded Mind" }, max: 1, recharge: "short" },
      ] },
  ],
});
