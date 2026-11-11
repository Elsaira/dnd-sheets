// Don général : Télépathe (Telepathic) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/telepathe)
// Détection des pensées n'est pas encore dans le catalogue des sorts : on l'ajoute ici si besoin.
if (!DND.data.spells["detect-thoughts"]) DND.registerSpells([{ id: "detect-thoughts", name: { fr: "Détection des pensées", en: "Detect Thoughts" },
  level: 2, school: "divination", castingTime: "action", range: "self", components: "V, S, M", duration: "1 minute",
  lists: ["bard", "sorcerer", "wizard"], concentration: true, ritual: false, save: "wis" }]);
registerModule({
  kind: "feat", id: "telepathic", category: "general", aidedd: "telepathe",
  name: { fr: "Télépathe", en: "Telepathic" },
  description: "+1 Int, Sag ou Cha. Paroles télépathiques à 18 m. Détection des pensées préparé. Se lance gratuitement 1/Repos long",
  prerequisite: DND.feat.requires({ level: 4 }, "Niveau 4"),
  features: [
    { id: "telepathic", name: { fr: "Télépathe", en: "Telepathic" },
      description: "Parole télépathique : Vous pouvez parler par télépathie à toute créature que vous pouvez voir dans un rayon de 18 mètres. Vos paroles télépathiques sont dans une langue que vous connaissez, et la créature ne vous comprend que si elle connaît cette langue. Votre communication ne lui confère pas la capacité de vous répondre par télépathie. Détection des pensées : Vous avez toujours le sort détection des pensées préparé. Vous pouvez le lancer sans emplacement de sort ni composantes de sort, et vous devez terminer un Repos long avant de pouvoir le lancer à nouveau de cette manière. Vous pouvez également le lancer en utilisant vos emplacements de sorts du niveau approprié. Votre caractéristique d'incantation pour le sort est la caractéristique augmentée par ce don.",
      effects: [
        DND.feat.ability(["int", "wis", "cha"]),
        { type: "spell", spell: "detect-thoughts", ability: "{choice:ability}", freeCast: { max: 1, recharge: "long" } },
      ] },
  ],
});
