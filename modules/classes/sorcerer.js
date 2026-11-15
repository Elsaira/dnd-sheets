// Classe : Ensorceleur (Sorcerer) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/ensorceleur), relevés le 2026-10-15.
// Sorcellerie aberrante et mécanique : absentes d'AideDD (« Voir le Manuel des Joueurs »), saisies de mémoire, à vérifier.
// Journal de la classe : classes/ensorceleur.md
(function () {
  const lvl = (c) => c.classLevel("sorcerer");
  const cha = "cha";
  const DC = (c) => 8 + c.pb + c.mod.cha;
  const chaMin1 = (c) => Math.max(1, c.mod.cha);
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const subSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: cha, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");
  const spellFeature = (id, fr, en, table, extra) => ({ level: 3, id: id + "-spells", name: { fr, en },
    description: "Sorts toujours préparés : " + spellNames(table) + "." + (extra || ""), effects: subSpells(table) });
  const sp = { resource: "sorceryPoints" };

  // --- Options de Métamagie (AideDD) ---
  const MM = (id, fr, en, cost, text) => ({ id, name: { fr, en }, description: "Coût : " + cost + " point" + (cost > 1 ? "s" : "") + " de sorcellerie. " + text,
    effects: [{ type: "action", name: { fr: fr + " (" + cost + " pt" + (cost > 1 ? "s" : "") + ")", en }, actionType: "free", ...sp,
      description: typeof text === "function" ? text : text }] });
  registerList("sorcerer-metamagic", [
    MM("quickened-spell", "Sort accéléré", "Quickened Spell", 2, "Un sort d'une action se lance par une action bonus. Pas d'autre sort de niveau 1+ ce tour-ci."),
    MM("distant-spell", "Sort ample", "Distant Spell", 1, "Portée doublée (au moins 1,5 m), ou 9 m pour un sort de contact."),
    MM("seeking-spell", "Sort chercheur", "Seeking Spell", 1, "Jet d'attaque de sort raté : relancez le d20. Cumulable avec une autre option."),
    MM("extended-spell", "Sort étendu", "Extended Spell", 1, "Durée doublée (1 minute ou plus, 24 h maximum) ; Avantage aux JS de Concentration de ce sort."),
    MM("heightened-spell", "Sort intensifié", "Heightened Spell", 2, "Une cible du sort a le Désavantage à ses JS contre lui."),
    MM("twinned-spell", "Sort jumeau", "Twinned Spell", 1, "Le niveau effectif d'un sort qui gagne une cible par niveau supplémentaire augmente de 1."),
    MM("careful-spell", "Sort prévenant", "Careful Spell", 1, "Jusqu'à votre mod. de Charisme (min. 1) créatures réussissent automatiquement leur JS et ne subissent aucun dégât si elles en subiraient la moitié."),
    MM("empowered-spell", "Sort renforcé", "Empowered Spell", 1, "Relancez jusqu'à votre mod. de Charisme (min. 1) dés de dégâts. Cumulable avec une autre option."),
    MM("subtle-spell", "Sort subtil", "Subtle Spell", 1, "Sans composantes verbale, somatique ou matérielle (sauf composante consommée ou avec un coût)."),
    MM("transmuted-spell", "Sort transmuté", "Transmuted Spell", 1, "Changez le type de dégâts entre acide, feu, foudre, froid, poison et tonnerre."),
  ]);

  // Création d'emplacements : niveau d'emplacement -> [coût, niveau d'ensorceleur minimum]
  const SLOT_COST = { 1: [2, 2], 2: [3, 3], 3: [5, 5], 4: [6, 7], 5: [7, 9] };
  const slotCreate = (c) => Object.fromEntries(Object.entries(SLOT_COST).filter(([, [, min]]) => lvl(c) >= min).map(([slot, [cost]]) => [slot, cost]));
  const slotCosts = (c) => Object.entries(slotCreate(c)).map(([slot, cost]) => "niv. " + slot + " : " + cost + " pts").join(", ");

  registerModule({
    kind: "class", id: "sorcerer",
    name: { fr: "Ensorceleur", en: "Sorcerer" },
    color: "#b0263a", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 6,
    savingThrows: ["con", "cha"],
    subclassLevel: 3,
    multiclassRequirement: [["cha"]],
    proficiencies: { weapons: ["simple"],
      skills: { choose: 2, from: ["arcana", "deception", "insight", "intimidation", "persuasion", "religion"] } },
    multiclassProficiencies: {},
    spellcasting: {
      progression: "full", ability: cha, list: "sorcerer",
      cantrips: { 1: 4, 4: 5, 10: 6 },
      prepared: { 1: 2, 2: 4, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 13: 17, 15: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    },
    features: [
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur le Charisme, focaliseur arcanique. À chaque niveau d'ensorceleur, vous pouvez remplacer un sort mineur et un sort préparé. Les sorts toujours préparés (sous-classe) ne comptent pas." },
      { level: 1, id: "innate-sorcery", name: { fr: "Sorcellerie innée", en: "Innate Sorcery" },
        description: "Action bonus : pendant 1 minute, le DD de vos sorts d'ensorceleur augmente de 1 et vous avez l'Avantage aux jets d'attaque de ces sorts. Deux utilisations par repos long.",
        effects: [
          { type: "resource", id: "innateSorcery", name: { fr: "Sorcellerie innée", en: "Innate Sorcery" }, max: 2, recharge: "long",
            description: "1 minute : DD +1 et Avantage aux attaques de sorts d'ensorceleur." },
          { type: "action", name: { fr: "Sorcellerie innée", en: "Innate Sorcery" }, actionType: "bonus", resource: "innateSorcery",
            description: (c) => "Pendant 1 minute : DD des sorts d'ensorceleur " + (DC(c) + 1) + " et Avantage aux attaques de sorts d'ensorceleur." +
              (lvl(c) >= 7 ? " Sorcellerie incarnée : sans utilisation restante, dépensez 2 points de sorcellerie ; jusqu'à deux options de Métamagie par sort." : "") },
        ] },
      { level: 2, id: "font-of-magic", name: { fr: "Réserve arcanique", en: "Font of Magic" },
        description: "Points de sorcellerie égaux à votre niveau d'ensorceleur, récupérés au repos long. Convertir un emplacement en points (autant que son niveau, sans action) ; créer un emplacement (action bonus, niveau 5 maximum) : niveau 1 = 2 pts, 2 = 3 pts, 3 = 5 pts (niv. 5), 4 = 6 pts (niv. 7), 5 = 7 pts (niv. 9). Les emplacements créés disparaissent au repos long.",
        effects: [
          { type: "resource", id: "sorceryPoints", name: { fr: "Points de sorcellerie", en: "Sorcery Points" }, max: (c) => lvl(c), recharge: "long",
            slotCreate, slotConvert: true, unit: ["pt", "pts"],
            description: "Métamagie, création d'emplacements, etc." },
          { type: "action", name: { fr: "Convertir un emplacement", en: "Converting Spell Slots" }, actionType: "free", ...sp,
            description: "Dépensez un emplacement de sort : gagnez autant de points de sorcellerie que son niveau (dans la limite du maximum). Boutons « Convertir » sous les points de sorcellerie." },
          { type: "action", name: { fr: "Créer un emplacement", en: "Creating Spell Slots" }, actionType: "bonus", ...sp,
            description: (c) => "Transformez des points en emplacement (" + slotCosts(c) + "). Il disparaît au repos long. Boutons « Créer » sous les points de sorcellerie." },
        ] },
      { level: 2, id: "metamagic", name: { fr: "Métamagie", en: "Metamagic" },
        description: "Deux options de Métamagie (4 au niveau 10, 6 au niveau 17), une seule par sort sauf mention contraire. À chaque niveau, vous pouvez en remplacer une.",
        effects: [{ type: "choice", id: "metamagic", label: "Options de Métamagie", from: "list:sorcerer-metamagic", count: { 2: 2, 10: 4, 17: 6 }, showChosen: true,
          help: "Chaque option choisie apparaît dans les actions de l'onglet Combat, avec son coût." }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe d'ensorceleur", en: "Sorcerer Subclass" },
        description: "Choisissez votre sous-classe dans la partie Création." },
      asi(4),
      { level: 5, id: "sorcerous-restoration", name: { fr: "Restauration ensorcelée", en: "Sorcerous Restoration" },
        description: "À la fin d'un repos court, récupérez des points de sorcellerie, jusqu'à la moitié de votre niveau d'ensorceleur (arrondi à l'inférieur). Une fois par repos long.",
        effects: [
          { type: "resource", id: "sorcerousRestoration", name: { fr: "Restauration ensorcelée", en: "Sorcerous Restoration" }, max: 1, recharge: "long",
            restores: { id: "sorceryPoints", amount: (c) => Math.floor(lvl(c) / 2), shortRest: true },
            description: (c) => "À la fin d'un repos court : récupérez jusqu'à " + Math.floor(lvl(c) / 2) + " points de sorcellerie (bouton dans la fenêtre Repos court)." },
        ] },
      { level: 7, id: "sorcery-incarnate", name: { fr: "Sorcellerie incarnée", en: "Sorcery Incarnate" },
        description: "Sans utilisation de Sorcellerie innée, vous pouvez l'activer pour 2 points de sorcellerie par une action bonus. Tant qu'elle est active, vous pouvez utiliser jusqu'à deux options de Métamagie par sort." },
      asi(8),
      { level: 10, id: "metamagic-10", name: { fr: "Métamagie", en: "Metamagic" },
        description: "Deux options de Métamagie supplémentaires (4 au total)." },
      { level: 20, id: "arcane-apotheosis", name: { fr: "Apothéose arcanique", en: "Arcane Apotheosis" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "draconic", name: { fr: "Sorcellerie draconique", en: "Draconic Sorcery" },
        features: [
          { level: 3, id: "draconic-resilience", name: { fr: "Résistance draconique", en: "Draconic Resilience" },
            description: "Vos PV maximum augmentent de 3, puis de 1 à chaque niveau d'ensorceleur. Sans armure, votre CA de base est 10 + Dextérité + Charisme.",
            effects: [
              { type: "bonus", target: "hpMax", value: (c) => lvl(c), label: "Résistance draconique" },
              { type: "acFormula", label: "Résistance draconique", base: 10, abilities: ["dex", "cha"] },
            ] },
          spellFeature("draconic", "Sorts draconiques", "Draconic Spells",
            { 3: ["alter-self", "chromatic-orb", "command", "dragons-breath"], 5: ["fear", "fly"], 7: ["arcane-eye", "charm-monster"], 9: ["legend-lore", "summon-dragon"] }),
          { level: 6, id: "elemental-affinity", combat: true, name: { fr: "Affinité élémentaire", en: "Elemental Affinity" },
            description: "Choisissez acide, froid, feu, foudre ou poison : vous y êtes résistant, et vous ajoutez votre modificateur de Charisme à un jet de dégâts des sorts de ce type.",
            effects: [
              { type: "choice", id: "affinity", label: "Affinité élémentaire", from: ["acid", "cold", "fire", "lightning", "poison"],
                grant: { type: "resistance", damage: "{value}" } },
              { type: "note", text: (c) => "Affinité élémentaire : +" + c.mod.cha + " à un jet de dégâts des sorts du type choisi." },
            ] },
          { level: 14, id: "dragon-wings", name: { fr: "Ailes draconiques", en: "Dragon Wings" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "wild-magic", name: { fr: "Sorcellerie sauvage", en: "Wild Magic Sorcery" },
        features: [
          { level: 3, id: "wild-magic-surge", combat: true, name: { fr: "Bouffée de Sorcellerie sauvage", en: "Wild Magic Surge" },
            description: "Une fois par tour, juste après avoir lancé un sort d'ensorceleur avec un emplacement, lancez 1d20 : sur un 20, jetez sur la table Bouffée de Sorcellerie sauvage (voir AideDD ou le livre).",
            effects: [{ type: "note", text: "Bouffée de Sorcellerie sauvage : après un sort d'ensorceleur avec emplacement, 1d20 ; sur 20, jet sur la table." }] },
          { level: 3, id: "tides-of-chaos", name: { fr: "Marée du chaos", en: "Tides of Chaos" },
            description: "Donnez-vous l'Avantage à un jet de d20 avant de le lancer. Récupéré quand vous lancez un sort d'ensorceleur avec un emplacement (qui déclenche alors automatiquement un jet sur la table) ou au repos long.",
            effects: [
              { type: "resource", id: "tidesOfChaos", name: { fr: "Marée du chaos", en: "Tides of Chaos" }, max: 1, recharge: "long",
                description: "Récupérée aussi en lançant un sort d'ensorceleur avec un emplacement (jet automatique sur la table)." },
              { type: "action", name: { fr: "Marée du chaos", en: "Tides of Chaos" }, actionType: "free", resource: "tidesOfChaos",
                description: "Avantage à un jet de d20, avant de le lancer." },
            ] },
          { level: 6, id: "bend-luck", name: { fr: "Comme par hasard", en: "Bend Luck" },
            description: "Réaction, juste après qu'une autre créature visible a lancé un d20 : dépensez 1 point de sorcellerie, lancez 1d4 et ajoutez-le ou retranchez-le au jet.",
            effects: [{ type: "action", name: { fr: "Comme par hasard (1 pt)", en: "Bend Luck" }, actionType: "reaction", ...sp,
              description: "Une autre créature visible vient de lancer un d20 : ±1d4 à son jet." }] },
          { level: 14, id: "controlled-chaos", name: { fr: "Chaos contrôlé", en: "Controlled Chaos" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Saisie de mémoire (AideDD renvoie au livre) : à vérifier.
        id: "aberrant", name: { fr: "Sorcellerie aberrante", en: "Aberrant Sorcery" }, source: "PHB 2024",
        features: [
          spellFeature("aberrant", "Sorts psioniques", "Psionic Spells",
            { 3: ["arms-of-hadar", "calm-emotions", "detect-thoughts", "dissonant-whispers", "mind-sliver"], 5: ["hunger-of-hadar", "sending"], 7: ["black-tentacles", "summon-aberration"], 9: ["telepathic-bond", "telekinesis"] },
            " (Saisi de mémoire, à vérifier.)"),
          { level: 3, id: "telepathic-speech", name: { fr: "Discours télépathique", en: "Telepathic Speech" },
            description: "Action bonus : lien télépathique avec une créature visible à 9 m. Vous pouvez communiquer par télépathie à une distance en kilomètres liée à votre Charisme, pendant un nombre de minutes égal à votre niveau d'ensorceleur. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Discours télépathique", en: "Telepathic Speech" }, actionType: "bonus",
              description: (c) => "Lien télépathique avec une créature visible à 9 m, pendant " + lvl(c) + " minutes, portée : " + chaMin1(c) + " mile(s) (≈ " + (chaMin1(c) * 1.5).toString().replace(".", ",") + " km)." }] },
          { level: 6, id: "psionic-sorcery", name: { fr: "Sorcellerie psionique", en: "Psionic Sorcery" },
            description: "Vous pouvez lancer un sort psionique de niveau 1 ou plus en dépensant autant de points de sorcellerie que son niveau au lieu d'un emplacement ; il se lance alors sans composante verbale ni somatique, ni matérielle sauf si elle est consommée ou a un coût. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Sorcellerie psionique", en: "Psionic Sorcery" }, actionType: "free", ...sp,
              description: "Sort psionique lancé avec des points de sorcellerie (autant que son niveau), sans composantes V, S ni M ordinaires." }] },
          { level: 6, id: "psychic-defenses", name: { fr: "Défenses psychiques", en: "Psychic Defenses" },
            description: "Résistance aux dégâts psychiques ; Avantage aux JS pour éviter ou terminer les états Charmé et Effrayé. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "resistance", damage: "psychic" },
              { type: "advantage", target: "condition.charmed" }, { type: "advantage", target: "condition.frightened" }] },
          { level: 14, id: "revelation-in-flesh", name: { fr: "Révélation charnelle", en: "Revelation in Flesh" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Saisie de mémoire (AideDD renvoie au livre) : à vérifier.
        id: "clockwork", name: { fr: "Sorcellerie mécanique", en: "Clockwork Sorcery" }, source: "PHB 2024",
        features: [
          spellFeature("clockwork", "Sorts mécaniques", "Clockwork Spells",
            { 3: ["aid", "alarm", "lesser-restoration", "protection-from-evil-and-good"], 5: ["dispel-magic", "protection-from-energy"], 7: ["freedom-of-movement", "summon-construct"], 9: ["greater-restoration", "wall-of-force"] },
            " (Saisi de mémoire, à vérifier.)"),
          { level: 3, id: "restore-balance", name: { fr: "Rétablir l'équilibre", en: "Restore Balance" },
            description: "Réaction, quand une créature visible à 18 m s'apprête à lancer un d20 avec l'Avantage ou le Désavantage : annulez-les. Utilisations égales au modificateur de Charisme (minimum 1), récupérées au repos long. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "restoreBalance", name: { fr: "Rétablir l'équilibre", en: "Restore Balance" }, max: chaMin1, recharge: "long",
                description: "Annuler l'Avantage ou le Désavantage d'un jet." },
              { type: "action", name: { fr: "Rétablir l'équilibre", en: "Restore Balance" }, actionType: "reaction", resource: "restoreBalance",
                description: "Une créature visible à 18 m va lancer un d20 avec Avantage ou Désavantage : le jet se fait normalement." },
            ] },
          { level: 6, id: "bastion-of-law", name: { fr: "Bastion de la loi", en: "Bastion of Law" },
            description: "Action Magie : dépensez de 1 à 5 points de sorcellerie pour protéger une créature visible à 9 m : elle reçoit autant de d8, qu'elle peut dépenser pour réduire les dégâts qu'elle subit. La protection dure jusqu'à votre repos long ou une nouvelle utilisation. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Bastion de la loi (1 à 5 pts)", en: "Bastion of Law" }, actionType: "action", ...sp,
              description: "Une créature visible à 9 m reçoit 1d8 de protection par point dépensé (5 maximum), à dépenser pour réduire des dégâts." }] },
          { level: 14, id: "trance-of-order", name: { fr: "Transe de l'ordre", en: "Trance of Order" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
