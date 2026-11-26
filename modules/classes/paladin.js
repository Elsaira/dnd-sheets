// Classe : Paladin — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/paladin), relevés le 2026-10-15.
// Journal de la classe : classes/paladin.md
(function () {
  const lvl = (c) => c.classLevel("paladin");
  const cha = "cha";
  const DC = (c) => 8 + c.pb + c.mod.cha;
  const chaMin1 = (c) => Math.max(1, c.mod.cha);
  const aura = (c) => (lvl(c) >= 18 ? "9 m" : "3 m");
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin", "fighting-style"] } }] });
  // Sorts de serment toujours préparés : { 3: [...], 5: [...], 9: [...], 13: [...], 17: [...] }
  const oathSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: cha, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");
  const oathFeature = (id, fr, en, table) => ({ level: 3, id: id + "-spells", name: { fr, en },
    description: "Sorts toujours préparés : " + spellNames(table) + ".", effects: oathSpells(table) });
  const cd = { resource: "channelDivinity" };

  const OATHS = {
    ancients: { 3: ["ensnaring-strike", "speak-with-animals"], 5: ["misty-step", "moonbeam"], 9: ["plant-growth", "protection-from-energy"], 13: ["ice-storm", "stoneskin"], 17: ["commune-with-nature", "tree-stride"] },
    devotion: { 3: ["protection-from-evil-and-good", "shield-of-faith"], 5: ["aid", "zone-of-truth"], 9: ["beacon-of-hope", "dispel-magic"], 13: ["freedom-of-movement", "guardian-of-faith"], 17: ["commune", "flame-strike"] },
    glory: { 3: ["guiding-bolt", "heroism"], 5: ["enhance-ability", "magic-weapon"], 9: ["haste", "protection-from-energy"], 13: ["compulsion", "freedom-of-movement"], 17: ["legend-lore", "yolandes-regal-presence"] },
    vengeance: { 3: ["bane", "hunters-mark"], 5: ["hold-person", "misty-step"], 9: ["haste", "protection-from-energy"], 13: ["banishment", "dimension-door"], 17: ["hold-monster", "scrying"] },
  };

  // Style de combat : un don de style de combat, ou l'option Combattant béni
  registerList("paladin-fighting-style", [
    { id: "blessed-warrior", name: { fr: "Combattant béni", en: "Blessed Warrior" },
      description: "Deux sorts mineurs de clerc (Assistance et Flamme sacrée recommandés), qui comptent comme sorts de paladin (Charisme).",
      effects: [{ type: "choice", id: "cantrips", label: "Sorts mineurs du Combattant béni", count: 2, from: "spells", filter: { level: 0, list: "cleric" },
        grant: { type: "spell", spell: "{value}", ability: cha } }] },
  ]);

  registerModule({
    kind: "class", id: "paladin",
    name: { fr: "Paladin", en: "Paladin" },
    color: "#b58a2c", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 10,
    savingThrows: ["wis", "cha"],
    subclassLevel: 3,
    multiclassRequirement: [["str", "cha"]],
    proficiencies: { armor: ["light", "medium", "heavy", "shield"], weapons: ["simple", "martial"],
      skills: { choose: 2, from: ["athletics", "insight", "intimidation", "medicine", "persuasion", "religion"] } },
    multiclassProficiencies: { armor: ["light", "medium", "shield"], weapons: ["martial"] },
    // Demi-lanceur : emplacements dès le niveau 1, niveau ÷ 2 arrondi au supérieur (table commune)
    spellcasting: {
      progression: "half", rounding: "up", ability: cha, list: "paladin",
      cantrips: {},
      prepared: { 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 7: 7, 9: 9, 11: 10, 13: 11, 15: 12, 17: 14, 19: 15 },
    },
    features: [
      { level: 1, id: "lay-on-hands", name: { fr: "Imposition des mains", en: "Lay On Hands" },
        description: "Réserve de guérison de 5 × votre niveau de paladin PV, reconstituée au repos long. Action bonus : touchez une créature (vous compris) et rendez-lui des PV pris dans la réserve. 5 points de la réserve suppriment l'état Empoisonné.",
        effects: [
          { type: "resource", id: "layOnHands", name: { fr: "Imposition des mains", en: "Lay On Hands" }, max: (c) => 5 * lvl(c), recharge: "long",
            description: "Réserve de PV de soin (5 points = retirer Empoisonné)." },
          { type: "action", name: { fr: "Imposition des mains", en: "Lay On Hands" }, actionType: "bonus", resource: "layOnHands",
            description: (c) => "Touchez une créature : rendez des PV pris dans la réserve (" + 5 * lvl(c) + " au maximum), ou dépensez 5 points pour retirer Empoisonné." +
              (lvl(c) >= 14 ? " Toucher réparateur : 5 points par état retiré (Assourdi, Aveuglé, Charmé, Effrayé, Étourdi, Paralysé)." : "") },
        ] },
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur le Charisme, symbole sacré comme focaliseur. Après chaque repos long, vous pouvez remplacer un sort préparé. Les sorts toujours préparés (serment, Châtiment divin, Appel de destrier) ne comptent pas." },
      { level: 1, id: "weapon-mastery", combat: (c) => DND.masteryLines(((c.character.classes.find((x) => x.id === "paladin") || {}).choices || {}).masteries, c), name: { fr: "Bottes d'arme", en: "Weapon Mastery" },
        description: "Vous utilisez la botte de deux types d'armes que vous maîtrisez. Après un repos long, vous pouvez en changer.",
        effects: [{ type: "choice", id: "masteries", label: "Bottes d'arme", from: "weapons", count: 2,
          grant: { type: "proficiency", target: "mastery.{value}" },
          help: "La botte s'affiche sur l'attaque de l'arme dans l'onglet Combat." }] },
      { level: 2, id: "fighting-style", name: { fr: "Style de combat", en: "Fighting Style" },
        description: "Un don de Style de combat, ou l'option Combattant béni (deux sorts mineurs de clerc, Charisme).",
        effects: [{ type: "choice", id: "fightingStyle", label: "Style de combat", from: "feats+list:paladin-fighting-style", filter: { category: "fighting-style" } }] },
      { level: 2, id: "paladins-smite", combat: true, name: { fr: "Châtiment de paladin", en: "Paladin's Smite" },
        description: "Châtiment divin est toujours préparé. Vous pouvez le lancer une fois sans emplacement de sort par repos long.",
        effects: [{ type: "spell", spell: "divine-smite", ability: cha, freeCast: { max: 1, recharge: "long" } }] },
      { level: 3, id: "channel-divinity", name: { fr: "Conduit divin", en: "Channel Divinity" },
        description: "Deux utilisations (3 au niveau 11) ; une récupérée au repos court, toutes au repos long. Effet de base : Perception divine. DD = DD des sorts de paladin.",
        effects: [
          { type: "resource", id: "channelDivinity", name: { fr: "Conduit divin", en: "Channel Divinity" }, max: { 3: 2, 11: 3 }, recharge: "long", shortRegain: 1, spellTab: true,
            description: "Perception divine et effets du serment." },
          { type: "action", name: { fr: "Perception divine", en: "Divine Sense" }, actionType: "bonus", ...cd,
            description: "Conduit divin : pendant 10 minutes, vous savez où sont les Célestes, Fiélons et Morts-vivants à 18 m, et détectez les lieux ou objets consacrés ou profanés." },
        ] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de paladin", en: "Paladin Subclass" },
        description: "Choisissez votre serment dans la partie Création." },
      asi(4),
      { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
        description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
        effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
      { level: 5, id: "faithful-steed", name: { fr: "Fidèle destrier", en: "Faithful Steed" },
        description: "Appel de destrier est toujours préparé ; vous pouvez le lancer une fois sans emplacement par repos long.",
        effects: [{ type: "spell", spell: "find-steed", ability: cha, freeCast: { max: 1, recharge: "long" } }] },
      { level: 6, id: "aura-of-protection", combat: true, name: { fr: "Aura de protection", en: "Aura of Protection" },
        description: "Émanation de 3 m (9 m au niveau 18), inactive si vous êtes Incapable d'agir : vous et vos alliés dans l'aura ajoutez votre modificateur de Charisme (minimum +1) à vos jets de sauvegarde. Une créature ne profite que d'une Aura de protection à la fois.",
        effects: [
          { type: "bonus", target: "save.all", value: chaMin1, label: "Aura de protection" },
          { type: "note", text: (c) => "Aura de protection (" + aura(c) + ") : vos alliés dans l'aura gagnent +" + chaMin1(c) + " à leurs JS (déjà compté dans vos JS)." },
        ] },
      asi(8),
      { level: 9, id: "abjure-foes", name: { fr: "Abjuration d'ennemis", en: "Abjure Foes" },
        description: "Action Magie, Conduit divin : un nombre de créatures visibles à 18 m égal à votre modificateur de Charisme (minimum 1) fait un JS de Sagesse ou est Effrayé pendant 1 minute ou jusqu'à subir des dégâts ; une cible effrayée ne peut que se déplacer, prendre une action ou une action bonus à son tour.",
        effects: [{ type: "action", name: { fr: "Abjuration d'ennemis", en: "Abjure Foes" }, actionType: "action", ...cd,
          description: (c) => "Conduit divin : jusqu'à " + chaMin1(c) + " créature(s) visible(s) à 18 m, JS de Sagesse DD " + DC(c) + " ou Effrayée(s) 1 minute (fin si dégâts) ; une seule chose par tour : se déplacer, une action ou une action bonus." }] },
      { level: 10, id: "aura-of-courage", combat: true, name: { fr: "Aura de courage", en: "Aura of Courage" },
        description: "Vous et vos alliés êtes immunisés contre l'état Effrayé dans votre Aura de protection. Un allié effrayé qui y entre n'en subit pas l'effet tant qu'il y reste.",
        effects: [{ type: "immunity", condition: "frightened", note: "Aura de courage, vous et vos alliés dans l'aura" }, { type: "note", text: "Aura de courage : vous et vos alliés dans l'aura ne pouvez pas être Effrayés." }] },
      { level: 11, id: "radiant-strikes", name: { fr: "Frappes radiantes", en: "Radiant Strikes" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "ancients", name: { fr: "Serment des Anciens", en: "Oath of the Ancients" },
        features: [
          { level: 3, id: "natures-wrath", name: { fr: "Courroux de la nature", en: "Nature's Wrath" },
            description: "Action Magie, Conduit divin : chaque créature de votre choix visible à 4,5 m fait un JS de Force ou est Entravée pendant 1 minute (nouveau JS à la fin de chacun de ses tours).",
            effects: [{ type: "action", name: { fr: "Courroux de la nature", en: "Nature's Wrath" }, actionType: "action", ...cd,
              description: (c) => "Conduit divin : créatures choisies à 4,5 m, JS de Force DD " + DC(c) + " ou Entravées 1 minute (nouveau JS à la fin de chacun de leurs tours)." }] },
          oathFeature("ancients", "Sorts du Serment des Anciens", "Oath of the Ancients Spells", OATHS.ancients),
          { level: 7, id: "aura-of-warding", combat: true, name: { fr: "Aura de garde", en: "Aura of Warding" },
            description: "Vous et vos alliés dans votre Aura de protection avez la Résistance aux dégâts nécrotiques, psychiques et radiants.",
            effects: ["necrotic", "psychic", "radiant"].map((damage) => ({ type: "resistance", damage }))
              .concat([{ type: "note", text: "Aura de garde : vos alliés dans l'aura résistent aussi aux dégâts nécrotiques, psychiques et radiants." }]) },
          { level: 15, id: "undying-sentinel", name: { fr: "Sentinelle impérissable", en: "Undying Sentinel" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "devotion", name: { fr: "Serment de Dévotion", en: "Oath of Devotion" },
        features: [
          oathFeature("devotion", "Sorts du Serment de Dévotion", "Oath of Devotion Spells", OATHS.devotion),
          { level: 3, id: "sacred-weapon", name: { fr: "Arme sacrée", en: "Sacred Weapon" },
            description: "En prenant l'action Attaque, dépensez un Conduit divin : pendant 10 minutes, une arme de corps à corps que vous tenez ajoute votre modificateur de Charisme (minimum +1) à ses jets d'attaque et peut infliger des dégâts radiants. Elle émet une Lumière vive sur 6 m.",
            effects: [{ type: "action", name: { fr: "Arme sacrée", en: "Sacred Weapon" }, actionType: "free", ...cd,
              description: (c) => "Conduit divin, avec l'action Attaque : pendant 10 minutes, +" + chaMin1(c) + " aux attaques avec l'arme de corps à corps tenue, dégâts radiants possibles, lumière vive sur 6 m." }] },
          { level: 7, id: "aura-of-devotion", combat: true, name: { fr: "Aura de dévotion", en: "Aura of Devotion" },
            description: "Vous et vos alliés êtes immunisés contre l'état Charmé dans votre Aura de protection.",
            effects: [{ type: "immunity", condition: "charmed", note: "Aura de dévotion, vous et vos alliés dans l'aura" }, { type: "note", text: "Aura de dévotion : vous et vos alliés dans l'aura ne pouvez pas être Charmés." }] },
          { level: 15, id: "smite-of-protection", name: { fr: "Châtiment de protection", en: "Smite of Protection" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "glory", name: { fr: "Serment de Gloire", en: "Oath of Glory" },
        features: [
          { level: 3, id: "inspiring-smite", name: { fr: "Châtiment d'exaltation", en: "Inspiring Smite" },
            description: "Juste après avoir lancé Châtiment divin, dépensez un Conduit divin : répartissez 2d8 + votre niveau de paladin en PV temporaires entre des créatures de votre choix à 9 m (vous compris).",
            effects: [{ type: "action", name: { fr: "Châtiment d'exaltation", en: "Inspiring Smite" }, actionType: "free", ...cd,
              description: (c) => "Après Châtiment divin, Conduit divin : répartissez 2d8 + " + lvl(c) + " PV temporaires entre des créatures à 9 m." }] },
          oathFeature("glory", "Sorts du Serment de Gloire", "Oath of Glory Spells", OATHS.glory),
          { level: 3, id: "peerless-athlete", name: { fr: "Athlète d'exception", en: "Peerless Athlete" },
            description: "Action bonus, Conduit divin : pendant 1 heure, Avantage aux tests de Force (Athlétisme) et de Dextérité (Acrobaties), et vos sauts gagnent 3 m.",
            effects: [{ type: "action", name: { fr: "Athlète d'exception", en: "Peerless Athlete" }, actionType: "bonus", ...cd,
              description: "Conduit divin : 1 heure d'Avantage en Athlétisme et Acrobaties ; sauts en longueur et en hauteur +3 m." }] },
          { level: 7, id: "aura-of-alacrity", combat: true, name: { fr: "Aura d'entrain", en: "Aura of Alacrity" },
            description: "Votre Vitesse augmente de 3 m. Un allié qui entre dans votre Aura de protection ou y commence son tour gagne 3 m de Vitesse jusqu'à la fin de son prochain tour.",
            effects: [{ type: "bonus", target: "speed", value: 10, label: "Aura d'entrain" },
              { type: "note", text: "Aura d'entrain : un allié qui entre ou commence son tour dans l'aura gagne 3 m de Vitesse." }] },
          { level: 15, id: "glorious-defense", name: { fr: "Défense glorieuse", en: "Glorious Defense" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "vengeance", name: { fr: "Serment de Vengeance", en: "Oath of Vengeance" },
        features: [
          oathFeature("vengeance", "Sorts du Serment de Vengeance", "Oath of Vengeance Spells", OATHS.vengeance),
          { level: 3, id: "vow-of-enmity", name: { fr: "Vœu d'hostilité", en: "Vow of Enmity" },
            description: "En prenant l'action Attaque, dépensez un Conduit divin contre une créature visible à 9 m : Avantage à vos jets d'attaque contre elle pendant 1 minute. Si elle tombe à 0 PV, vous pouvez transférer le vœu à une autre créature à 9 m.",
            effects: [{ type: "action", name: { fr: "Vœu d'hostilité", en: "Vow of Enmity" }, actionType: "free", ...cd,
              description: "Conduit divin, avec l'action Attaque : Avantage contre une créature visible à 9 m pendant 1 minute ; transférable si elle tombe à 0 PV." }] },
          { level: 7, id: "relentless-avenger", combat: true, name: { fr: "Vengeur implacable", en: "Relentless Avenger" },
            description: "Quand vous touchez une créature avec une attaque d'opportunité, sa Vitesse tombe à 0 jusqu'à la fin du tour, et vous pouvez vous déplacer de la moitié de votre Vitesse dans la même Réaction, sans provoquer d'attaques d'opportunité.",
            effects: [{ type: "note", text: "Vengeur implacable : attaque d'opportunité réussie = Vitesse de la cible à 0, et vous vous déplacez de la moitié de votre Vitesse." }] },
          { level: 15, id: "soul-of-vengeance", name: { fr: "Esprit de la vengeance", en: "Soul of Vengeance" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
