// Classe : Clerc (Cleric) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/clerc), relevés le 2026-10-15.
// Journal de la classe : classes/clerc.md
(function () {
  const lvl = (c) => c.classLevel("cleric");
  const wis = "wis";
  const DC = (c) => 8 + c.pb + c.mod.wis;
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  // Sorts de domaine toujours préparés : { 3: [...], 5: [...], 7: [...], 9: [...] }
  const domainSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: wis, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");
  const cd = { resource: "channelDivinity" };

  // Incantation puissante : le modificateur de Sagesse s'ajoute aux tours de magie de clerc qui infligent des dégâts.
  const clericDamageCantrips = Object.values(DND.data.spells).filter((s) => s.level === 0 && s.damage && s.lists.includes("cleric")).map((s) => s.id);

  const DOMAINS = {
    life: { 3: ["aid", "bless", "cure-wounds", "lesser-restoration"], 5: ["mass-healing-word", "revivify"], 7: ["aura-of-life", "death-ward"], 9: ["greater-restoration", "mass-cure-wounds"] },
    light: { 3: ["burning-hands", "faerie-fire", "scorching-ray", "see-invisibility"], 5: ["daylight", "fireball"], 7: ["arcane-eye", "wall-of-fire"], 9: ["flame-strike", "scrying"] },
    trickery: { 3: ["charm-person", "disguise-self", "invisibility", "pass-without-trace"], 5: ["hypnotic-pattern", "nondetection"], 7: ["confusion", "dimension-door"], 9: ["dominate-person", "modify-memory"] },
    war: { 3: ["guiding-bolt", "magic-weapon", "shield-of-faith", "spiritual-weapon"], 5: ["crusaders-mantle", "spirit-guardians"], 7: ["fire-shield", "freedom-of-movement"], 9: ["hold-monster", "steel-wind-strike"] },
  };
  const domainFeature = (id, fr, en, table) => ({ level: 3, id: id + "-spells", name: { fr, en },
    description: "Sorts toujours préparés : " + spellNames(table) + ".", effects: domainSpells(table) });

  registerModule({
    kind: "class", id: "cleric",
    name: { fr: "Clerc", en: "Cleric" },
    color: "#a77a12", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 8,
    savingThrows: ["wis", "cha"],
    subclassLevel: 3,
    multiclassRequirement: [["wis"]],
    proficiencies: { armor: ["light", "medium", "shield"], weapons: ["simple"],
      skills: { choose: 2, from: ["history", "insight", "medicine", "persuasion", "religion"] } },
    multiclassProficiencies: { armor: ["light", "medium", "shield"] },
    spellcasting: {
      progression: "full", ability: wis, list: "cleric",
      cantrips: { 1: 3, 4: 4, 10: 5 },
      prepared: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 13: 17, 15: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    },
    features: [
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur la Sagesse, symbole sacré comme focaliseur. Après chaque repos long, vous pouvez changer vos sorts préparés. Les sorts toujours préparés (domaine) ne comptent pas dans le nombre de sorts préparés." },
      { level: 1, id: "divine-order", name: { fr: "Ordre divin", en: "Divine Order" },
        description: "Protecteur : maîtrise des armes de guerre et formation aux armures lourdes. Thaumaturge : un sort mineur de clerc supplémentaire et un bonus égal à votre modificateur de Sagesse (minimum +1) aux tests d'Intelligence (Arcanes ou Religion).",
        effects: [{ type: "choice", id: "divineOrder", label: "Ordre divin", from: [
          { id: "protector", name: { fr: "Protecteur", en: "Protector" }, description: "Maîtrise des armes de guerre et formation aux armures lourdes.",
            effects: [{ type: "proficiency", target: "weapon.martial" }, { type: "proficiency", target: "armor.heavy" }] },
          { id: "thaumaturge", name: { fr: "Thaumaturge", en: "Thaumaturge" }, description: "Un sort mineur de clerc en plus ; +Sagesse (min. +1) aux tests d'Arcanes et de Religion.",
            effects: [
              { type: "choice", id: "cantrip", label: "Sort mineur du Thaumaturge", from: "spells", filter: { level: 0, list: "cleric" },
                grant: { type: "spell", spell: "{value}", ability: wis } },
              { type: "bonus", target: "skill.arcana", value: wisMin1, label: "Thaumaturge" },
              { type: "bonus", target: "skill.religion", value: wisMin1, label: "Thaumaturge" },
            ] },
        ] }] },
      { level: 2, id: "channel-divinity", name: { fr: "Conduit divin", en: "Channel Divinity" },
        description: "Deux utilisations (3 au niveau 6, 4 au niveau 18) ; une récupérée au repos court, toutes au repos long. Effets : Étincelle divine et Renvoi des morts-vivants, plus ceux du domaine. DD = DD des sorts de clerc.",
        effects: [
          { type: "resource", id: "channelDivinity", name: { fr: "Conduit divin", en: "Channel Divinity" }, max: { 2: 2, 6: 3, 18: 4 }, recharge: "long", shortRegain: 1,
            description: "Étincelle divine, Renvoi des morts-vivants et effets du domaine." },
          { type: "action", name: { fr: "Étincelle divine", en: "Divine Spark" }, actionType: "action", ...cd,
            description: (c) => { const n = DND.byLevel({ 1: 1, 7: 2, 13: 3, 18: 4 }, lvl(c));
              return "Conduit divin, créature visible à 9 m : " + n + "d8 " + E(c.mod.wis) + " PV rendus, ou JS de Constitution DD " + DC(c) + " : autant de dégâts nécrotiques ou radiants (moitié si réussi)."; } },
          { type: "action", name: { fr: "Renvoi des morts-vivants", en: "Turn Undead" }, actionType: "action", ...cd,
            description: (c) => "Conduit divin : chaque mort-vivant à 9 m fait un JS de Sagesse DD " + DC(c) + " ; en cas d'échec, il est Effrayé et Incapable d'agir pendant 1 minute (fin s'il subit des dégâts)." +
              (lvl(c) >= 5 ? " Calcination : ceux qui ratent subissent " + wisMin1(c) + "d8 dégâts radiants." : "") },
        ] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de clerc", en: "Cleric Subclass" },
        description: "Choisissez votre domaine dans la partie Création." },
      asi(4),
      { level: 5, id: "sear-undead", combat: true, name: { fr: "Calcination de mort-vivant", en: "Sear Undead" },
        description: "Quand vous utilisez Renvoi des morts-vivants, chaque mort-vivant qui rate son JS subit un nombre de d8 dégâts radiants égal à votre modificateur de Sagesse (minimum 1d8). Ces dégâts ne mettent pas fin au renvoi." },
      { level: 7, id: "blessed-strikes", combat: true, name: { fr: "Frappes bénies", en: "Blessed Strikes" },
        description: "Frappe divine : une fois par tour, +1d8 dégâts nécrotiques ou radiants quand vous touchez avec une arme. Incantation puissante : ajoutez votre modificateur de Sagesse aux dégâts de vos sorts mineurs de clerc.",
        effects: [{ type: "choice", id: "blessedStrikes", label: "Frappes bénies", from: [
          { id: "divine-strike", name: { fr: "Frappe divine", en: "Divine Strike" }, description: "Une fois par tour, +1d8 nécrotiques ou radiants en touchant avec une arme.",
            effects: [{ type: "note", text: (c) => "Frappe divine : une fois par tour, +" + (lvl(c) >= 14 ? 2 : 1) + "d8 dégâts nécrotiques ou radiants en touchant avec une arme." }] },
          { id: "potent-spellcasting", name: { fr: "Incantation puissante", en: "Potent Spellcasting" }, description: "+Sagesse aux dégâts des sorts mineurs de clerc.",
            effects: clericDamageCantrips.map((id) => ({ type: "bonus", target: "spellDamage." + id, value: (c) => c.mod.wis, label: "Incantation puissante" })) },
        ] }] },
      asi(8),
      { level: 10, id: "divine-intervention", name: { fr: "Intervention divine", en: "Divine Intervention" },
        description: "Action Magie : lancez un sort de clerc de niveau 5 ou moins sans Réaction, sans emplacement ni composante matérielle. Une fois par repos long.",
        effects: [
          { type: "resource", id: "divineIntervention", name: { fr: "Intervention divine", en: "Divine Intervention" }, max: 1, recharge: "long",
            description: "Un sort de clerc de niveau 5 ou moins, gratuit." },
          { type: "action", name: { fr: "Intervention divine", en: "Divine Intervention" }, actionType: "action", resource: "divineIntervention",
            description: "Lancez un sort de clerc de niveau 5 ou moins (pas de Réaction) sans emplacement ni composante matérielle." },
        ] },
      { level: 14, id: "improved-blessed-strikes", name: { fr: "Impacts bénis améliorés", en: "Improved Blessed Strikes" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "life", name: { fr: "Domaine de la Vie", en: "Life Domain" },
        features: [
          { level: 3, id: "disciple-of-life", combat: true, name: { fr: "Disciple de la Vie", en: "Disciple of Life" },
            description: "Quand un sort lancé avec un emplacement rend des PV à une créature, elle récupère en plus 2 + le niveau de l'emplacement.",
            effects: [{ type: "note", text: "Disciple de la Vie : sort de soin avec emplacement, +2 + niveau de l'emplacement PV." }] },
          domainFeature("life", "Sorts du Domaine de la Vie", "Life Domain Spells", DOMAINS.life),
          { level: 3, id: "preserve-life", name: { fr: "Survivance", en: "Preserve Life" },
            description: "Action Magie, Conduit divin : répartissez 5 × votre niveau de clerc PV entre des créatures En péril à 9 m (pas au-delà de la moitié de leur maximum).",
            effects: [{ type: "action", name: { fr: "Survivance", en: "Preserve Life" }, actionType: "action", ...cd,
              description: (c) => "Conduit divin : répartissez " + 5 * lvl(c) + " PV entre des créatures En péril à 9 m (jusqu'à la moitié de leur maximum)." }] },
          { level: 6, id: "blessed-healer", combat: true, name: { fr: "Guérisseur béni", en: "Blessed Healer" },
            description: "Juste après avoir soigné une autre créature avec un sort lancé avec un emplacement, vous récupérez 2 + le niveau de l'emplacement en PV.",
            effects: [{ type: "note", text: "Guérisseur béni : en soignant un autre avec un emplacement, vous récupérez 2 + niveau de l'emplacement PV." }] },
          { level: 17, id: "supreme-healing", name: { fr: "Guérison suprême", en: "Supreme Healing" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "light", name: { fr: "Domaine de la Lumière", en: "Light Domain" },
        features: [
          domainFeature("light", "Sorts du Domaine de la Lumière", "Light Domain Spells", DOMAINS.light),
          { level: 3, id: "radiance-of-the-dawn", name: { fr: "Radiance de l'Aube", en: "Radiance of the Dawn" },
            description: "Action Magie, Conduit divin : émanation de 9 m qui dissipe les ténèbres magiques ; les créatures choisies font un JS de Constitution ou subissent 2d10 + votre niveau de clerc dégâts radiants (moitié si réussi).",
            effects: [{ type: "action", name: { fr: "Radiance de l'Aube", en: "Radiance of the Dawn" }, actionType: "action", ...cd,
              description: (c) => "Conduit divin, émanation de 9 m : dissipe les ténèbres magiques ; JS de Constitution DD " + DC(c) + ", 2d10 + " + lvl(c) + " dégâts radiants (moitié si réussi)." }] },
          { level: 3, id: "warding-flare", name: { fr: "Éclat protecteur", en: "Warding Flare" },
            description: "Réaction quand une créature visible à 9 m fait un jet d'attaque : elle a le Désavantage. Utilisations égales au modificateur de Sagesse (minimum 1), récupérées au repos long (au repos court aussi à partir du niveau 6).",
            effects: [
              { type: "resource", id: "wardingFlare", name: { fr: "Éclat protecteur", en: "Warding Flare" }, max: wisMin1, recharge: { 1: "long", 6: "short" },
                description: "Désavantage à un jet d'attaque." },
              { type: "action", name: { fr: "Éclat protecteur", en: "Warding Flare" }, actionType: "reaction", resource: "wardingFlare",
                description: (c) => "Une créature visible à 9 m fait un jet d'attaque : elle a le Désavantage." +
                  (lvl(c) >= 6 ? " La cible de l'attaque gagne 2d6 " + E(c.mod.wis) + " PV temporaires." : "") },
            ] },
          { level: 6, id: "improved-warding-flare", name: { fr: "Éclat protecteur amélioré", en: "Improved Warding Flare" },
            description: "Vous récupérez vos utilisations d'Éclat protecteur au repos court ou long. Chaque utilisation donne aussi à la cible de l'attaque 2d6 + votre modificateur de Sagesse en PV temporaires.",
            effects: [{ type: "note", text: "Éclat protecteur : utilisations récupérées au repos court ou long (automatique)." }] },
          { level: 17, id: "corona-of-light", name: { fr: "Auréole", en: "Corona of Light" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "trickery", name: { fr: "Domaine de la Ruse", en: "Trickery Domain" },
        features: [
          { level: 3, id: "blessing-of-the-trickster", name: { fr: "Faveur du filou", en: "Blessing of the Trickster" },
            description: "Action Magie : vous ou une créature consentante à 9 m avez l'Avantage aux tests de Dextérité (Discrétion) jusqu'à votre prochain repos long ou une nouvelle utilisation.",
            effects: [{ type: "action", name: { fr: "Faveur du filou", en: "Blessing of the Trickster" }, actionType: "action",
              description: "Vous ou une créature consentante à 9 m : Avantage en Discrétion jusqu'à votre repos long." }] },
          { level: 3, id: "invoke-duplicity", name: { fr: "Invocation de réplique", en: "Invoke Duplicity" },
            description: "Action bonus, Conduit divin : illusion de vous à 9 m pendant 1 minute. Vous pouvez lancer des sorts depuis son espace, avez l'Avantage contre une créature à 1,5 m de vous deux, et la déplacez de 9 m par une action bonus (à 36 m de vous maximum).",
            effects: [{ type: "action", name: { fr: "Invocation de réplique", en: "Invoke Duplicity" }, actionType: "bonus", ...cd,
              description: (c) => "Conduit divin : illusion de vous à 9 m pendant 1 minute ; sorts lancés depuis son espace, Avantage contre une créature à 1,5 m de vous deux ; action bonus pour la déplacer de 9 m" +
                (lvl(c) >= 6 ? " et échanger votre place avec elle (Troc du filou)." : ".") }] },
          domainFeature("trickery", "Sorts du Domaine de la Ruse", "Trickery Domain Spells", DOMAINS.trickery),
          { level: 6, id: "tricksters-transposition", name: { fr: "Troc du filou", en: "Trickster's Transposition" },
            description: "Quand vous créez ou déplacez l'illusion d'Invocation de réplique par une action bonus, vous pouvez vous téléporter en échangeant votre place avec elle." },
          { level: 17, id: "improved-duplicity", name: { fr: "Réplique améliorée", en: "Improved Duplicity" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "war", name: { fr: "Domaine de la Guerre", en: "War Domain" },
        features: [
          { level: 3, id: "guided-strike", name: { fr: "Frappe guidée", en: "Guided Strike" },
            description: "Quand vous ou une créature à 9 m ratez un jet d'attaque, dépensez un Conduit divin pour lui donner +10 (Réaction si c'est une autre créature).",
            effects: [{ type: "action", name: { fr: "Frappe guidée", en: "Guided Strike" }, actionType: "free", ...cd,
              description: "Conduit divin : +10 à un jet d'attaque raté (le vôtre, ou celui d'une créature à 9 m par votre Réaction)." }] },
          domainFeature("war", "Sorts du Domaine de la Guerre", "War Domain Spells", DOMAINS.war),
          { level: 3, id: "war-priest", name: { fr: "Prêtre de guerre", en: "War Priest" },
            description: "Action bonus : une attaque avec une arme ou à mains nues. Utilisations égales au modificateur de Sagesse (minimum 1), récupérées au repos court ou long.",
            effects: [
              { type: "resource", id: "warPriest", name: { fr: "Prêtre de guerre", en: "War Priest" }, max: wisMin1, recharge: "short",
                description: "Une attaque par action bonus." },
              { type: "action", name: { fr: "Prêtre de guerre", en: "War Priest" }, actionType: "bonus", resource: "warPriest",
                description: "Une attaque avec une arme ou à mains nues." },
            ] },
          { level: 6, id: "war-gods-blessing", name: { fr: "Bénédiction du dieu de la guerre", en: "War God's Blessing" },
            description: "Dépensez un Conduit divin pour lancer Bouclier de la foi ou Arme spirituelle sans emplacement. Le sort ne demande pas de Concentration et dure 1 minute.",
            effects: [{ type: "action", name: { fr: "Bénédiction du dieu de la guerre", en: "War God's Blessing" }, actionType: "bonus", ...cd,
              description: "Conduit divin : Bouclier de la foi ou Arme spirituelle sans emplacement ni Concentration (1 minute)." }] },
          { level: 17, id: "avatar-of-battle", name: { fr: "Avatar de la bataille", en: "Avatar of Battle" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });

  function E(n) { return DND.engine.signed(n); }
})();
