// Espèce : Halfelin (Halfling) — SRD 5.2
registerModule({
  kind: "species", id: "halfling",
  name: { fr: "Halfelin", en: "Halfling" },
  size: "small", speed: 30,
  description: "Petits, courageux et chanceux.",
  features: [
    { id: "brave", name: { fr: "Brave", en: "Brave" },
      description: "Avantage aux jets de sauvegarde pour éviter ou mettre fin à l'état Effrayé.",
      effects: [{ type: "advantage", target: "condition.frightened" }] },
    { id: "halfling-nimbleness", name: { fr: "Agilité halfeline", en: "Halfling Nimbleness" },
      description: "Vous pouvez traverser l'espace de toute créature d'une taille supérieure à la vôtre, sans vous y arrêter.",
      combat: "Vous pouvez traverser l'espace des créatures plus grandes que vous (sans vous y arrêter)." },
    { id: "luck", name: { fr: "Chanceux", en: "Luck" },
      description: "Quand vous obtenez 1 au d20 d'un test d20, vous pouvez relancer le dé et devez garder le nouveau résultat.",
      combat: "Un 1 au d20 d'un test d20 (attaque, test de caractéristique, JS) : relancez le dé et gardez le nouveau résultat." },
    { id: "naturally-stealthy", name: { fr: "Discrétion naturelle", en: "Naturally Stealthy" },
      description: "Vous pouvez faire l'action Se cacher même si vous n'êtes masqué que par une créature au moins une taille plus grande que vous.",
      combat: "Vous pouvez vous cacher derrière une créature plus grande que vous." },
  ],
});
