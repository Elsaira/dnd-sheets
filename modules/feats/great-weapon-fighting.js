// Don de style de combat : Arme à deux mains (Great Weapon Fighting) — Manuel des joueurs 2024, texte d'après AideDD (aidedd.org/feat/fr/arme-a-deux-mains)
registerModule({
  kind: "feat", id: "great-weapon-fighting", category: "fighting-style", aidedd: "arme-a-deux-mains",
  name: { fr: "Arme à deux mains", en: "Great Weapon Fighting" },
  description: "Lorsque vous lancez les dégâts d'une arme à deux mains ou versatile, traitez les 1 et les 2 des dés comme un 3",
  features: [
    { id: "great-weapon-fighting", combat: true, name: { fr: "Arme à deux mains", en: "Great Weapon Fighting" },
      description: "Lorsque vous lancez les dégâts pour une attaque effectuée avec une arme de corps à corps tenue à deux mains, vous pouvez considérer n'importe quel 1 ou 2 sur un dé de dégâts comme un 3. L'arme doit posséder la propriété Deux mains ou Polyvalente pour obtenir cet avantage." },
  ],
});
