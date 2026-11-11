// Espèce : Gnome — SRD 5.2
registerModule({
  kind: "species", id: "gnome",
  name: { fr: "Gnome", en: "Gnome" },
  size: "small", speed: 30,
  description: "Petits et ingénieux : avantage aux JS d'Intelligence, Sagesse et Charisme, lignée des forêts ou des roches.",
  features: [
    { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
      effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
    { id: "gnomish-cunning", name: { fr: "Ruse gnome", en: "Gnomish Cunning" },
      description: "Avantage aux jets de sauvegarde d'Intelligence, de Sagesse et de Charisme.",
      effects: ["int", "wis", "cha"].map((a) => ({ type: "advantage", target: "save." + a, note: "Ruse gnome" })) },
    { id: "gnomish-lineage", name: { fr: "Lignée gnome", en: "Gnomish Lineage" },
      description: "Votre lignée vous donne des sorts qui utilisent la caractéristique choisie.",
      effects: [
        { type: "choice", id: "lineage", label: "Lignée", from: [
          { id: "forest", name: { fr: "Gnome des forêts", en: "Forest Gnome" },
            description: "Illusion mineure. Communication avec les animaux toujours préparé, lançable sans emplacement un nombre de fois égal au bonus de maîtrise (repos long).",
            effects: [
              { type: "spell", spell: "minor-illusion", ability: "{choice:spellAbility}" },
              { type: "spell", spell: "speak-with-animals", ability: "{choice:spellAbility}", freeCast: { max: (c) => c.pb, recharge: "long" } },
            ] },
          { id: "rock", name: { fr: "Gnome des roches", en: "Rock Gnome" },
            description: "Réparation et Prestidigitation. En 10 minutes, vous pouvez fabriquer un petit mécanisme (CA 5, 1 PV) avec Prestidigitation ; trois au maximum à la fois.",
            effects: [
              { type: "spell", spell: "mending", ability: "{choice:spellAbility}" },
              { type: "spell", spell: "prestidigitation", ability: "{choice:spellAbility}" },
            ] },
        ] },
        { type: "choice", id: "spellAbility", label: "Caractéristique d'incantation de la lignée", from: ["int", "wis", "cha"] },
      ] },
  ],
});
