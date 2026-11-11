(function () {
  const DC = (c) => 8 + c.pb + c.mod.cha;
  const size = (id, fr, en) => ({ id, name: { fr, en }, effects: [{ type: "size", value: id }] });
  registerModule({
    kind: "species", id: "aasimar",
    name: { fr: "Aasimar", en: "Aasimar" },
    size: "medium", speed: 30,
    description: "Touchés par les plans supérieurs : résistance nécrotique et radiante, mains guérisseuses, révélation céleste au niveau 3.",
    features: [
      { id: "size", name: { fr: "Taille", en: "Size" }, hidden: true,
        effects: [{ type: "choice", id: "size", label: "Taille", from: [size("medium", "Moyenne", "Medium"), size("small", "Petite", "Small")] }] },
      { id: "celestial-resistance", name: { fr: "Résistance céleste", en: "Celestial Resistance" },
        description: "Résistance aux dégâts nécrotiques et radiants.",
        effects: [{ type: "resistance", damage: "necrotic" }, { type: "resistance", damage: "radiant" }] },
      { id: "darkvision", name: { fr: "Vision dans le noir", en: "Darkvision" }, description: "Portée de 18 m.",
        effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
      { id: "healing-hands", name: { fr: "Mains guérisseuses", en: "Healing Hands" },
        description: "Action Magie : touchez une créature et lancez un nombre de d4 égal à votre bonus de maîtrise ; elle récupère le total en PV. Une fois par repos long.",
        effects: [
          { type: "resource", id: "healingHands", name: { fr: "Mains guérisseuses", en: "Healing Hands" }, max: 1, recharge: "long" },
          { type: "action", name: { fr: "Mains guérisseuses", en: "Healing Hands" }, actionType: "action", resource: "healingHands",
            description: (c) => "Touchez une créature : elle récupère " + c.pb + "d4 PV." },
        ] },
      { id: "light-bearer", name: { fr: "Porteur de lumière", en: "Light Bearer" },
        description: "Vous connaissez le tour de magie Lumière (Charisme).",
        effects: [{ type: "spell", spell: "light", ability: "cha" }] },
      { id: "celestial-revelation", level: 3, name: { fr: "Révélation céleste", en: "Celestial Revelation" },
        description: "Action bonus : transformation pendant 1 minute (ou jusqu'à ce que vous y mettiez fin, sans action). Une fois par repos long. Une fois à chacun de vos tours, vous infligez des dégâts supplémentaires égaux à votre bonus de maîtrise à une cible touchée par une attaque ou un sort. Forme au choix à chaque utilisation : Ailes célestes (vitesse de vol égale à votre Vitesse, dégâts radiants), Rayonnement intérieur (lumière vive sur 3 m ; à la fin de chacun de vos tours, les créatures à 3 m subissent des dégâts radiants égaux à votre bonus de maîtrise ; dégâts radiants), Voile nécrotique (les créatures à 3 m autres que vos alliés font un JS de Charisme ou sont Effrayées jusqu'à la fin de votre prochain tour ; dégâts nécrotiques).",
        effects: [
          { type: "resource", id: "revelation", name: { fr: "Révélation céleste", en: "Celestial Revelation" }, max: 1, recharge: "long" },
          { type: "action", name: { fr: "Révélation céleste", en: "Celestial Revelation" }, actionType: "bonus", resource: "revelation",
            description: (c) => "1 minute : +" + c.pb + " dégâts une fois par tour. Ailes célestes (vol, radiant), Rayonnement intérieur (" + c.pb + " radiants aux créatures à 3 m en fin de tour) ou Voile nécrotique (JS de Charisme DD " + DC(c) + " à 3 m ou Effrayé, nécrotique)." },
        ] },
    ],
  });
})();
