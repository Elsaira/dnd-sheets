// Don d'origine : Bagarreur de tavernes (Tavern Brawler) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "tavern-brawler", category: "origin",
  name: { fr: "Bagarreur de tavernes", en: "Tavern Brawler" },
  description: "Frappe à mains nues 1d4 + For, relance des 1, armes improvisées, repousser.",
  features: [
    { id: "tavern-brawler", combat: true, name: { fr: "Bagarreur de tavernes", en: "Tavern Brawler" },
      description: "Frappe à mains nues améliorée : vous pouvez infliger 1d4 + modificateur de Force dégâts contondants au lieu des dégâts normaux. Relancer des dégâts : relancez un 1 sur un dé de dégâts de Frappe à mains nues (gardez le nouveau résultat). Armement improvisé : vous maîtrisez les armes improvisées. Bourrade : une fois par tour, quand vous touchez avec une Frappe à mains nues lors de l'action Attaque, vous pouvez infliger les dégâts et repousser la cible de 1,50 m." },
  ],
});
