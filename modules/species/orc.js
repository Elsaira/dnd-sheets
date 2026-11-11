// Espèce : Orc — SRD 5.2
registerModule({
  kind: "species", id: "orc",
  name: { fr: "Orc", en: "Orc" },
  size: "medium", speed: 30,
  description: "Endurants : poussée d'adrénaline et refus de tomber.",
  features: [
    { id: "adrenaline-rush", name: { fr: "Poussée d'adrénaline", en: "Adrenaline Rush" },
      description: "Action bonus : action Foncer, et vous gagnez des PV temporaires égaux à votre bonus de maîtrise. Utilisations égales au bonus de maîtrise, récupérées au repos court ou long.",
      effects: [
        { type: "resource", id: "adrenaline", name: { fr: "Poussée d'adrénaline", en: "Adrenaline Rush" }, max: (c) => c.pb, recharge: "short" },
        { type: "action", name: { fr: "Poussée d'adrénaline", en: "Adrenaline Rush" }, actionType: "bonus", resource: "adrenaline",
          description: (c) => "Foncer en action bonus et gagner " + c.pb + " PV temporaires." },
      ] },
    { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 36 m.",
      effects: [{ type: "sense", sense: "darkvision", range: 120 }] },
    { id: "relentless-endurance", name: { fr: "Endurance implacable", en: "Relentless Endurance" },
      description: "Quand vous tombez à 0 PV sans être tué sur le coup, vous pouvez tomber à 1 PV à la place. Une fois par repos long.",
      combat: "Tombé à 0 PV sans être tué sur le coup : restez à 1 PV à la place (une fois par repos long, case ci-contre).",
      effects: [{ type: "resource", id: "relentless", name: { fr: "Endurance implacable", en: "Relentless Endurance" }, max: 1, recharge: "long" }] },
  ],
});
