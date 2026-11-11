// Classe : Druide (Druid) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/druide), relevés le 2026-10-18.
// Cercle des Astres : absent d'AideDD (« Voir le Manuel des Joueurs »), saisi de mémoire, à vérifier.
// Journal de la classe : classes/druide.md
(function () {
  const lvl = (c) => c.classLevel("druid");
  const wis = "wis";
  const DC = (c) => 8 + c.pb + c.mod.wis;
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const sg = (n) => DND.engine.signed(n);
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const subclassOf = (c) => ((c.character.classes.find((x) => x.id === "druid") || {}).subclass || "");
  const ws = { resource: "wildShape" };
  // Sorts de cercle toujours préparés : { 3: [...], 5: [...], 7: [...], 9: [...] }
  const circleSpells = (table) => [].concat(...Object.entries(table).map(([level, spells]) =>
    spells.map((spell) => ({ type: "spell", spell, ability: wis, minLevel: Number(level) }))));
  const spellNames = (table) => Object.entries(table).map(([level, spells]) =>
    spells.map((id) => (DND.data.spells[id] ? DND.data.spells[id].name.fr : id)).join(", ") + " (niv. " + level + ")").join(" ; ");
  // Incantation puissante : le modificateur de Sagesse s'ajoute aux sorts mineurs de druide qui infligent des dégâts.
  const druidDamageCantrips = Object.values(DND.data.spells).filter((s) => s.level === 0 && s.damage && s.lists.includes("druid")).map((s) => s.id);

  // --- Formes de Bête pour Forme sauvage (FP et déplacements d'après le Manuel des monstres ; profils complets sur AideDD) ---
  const B = (id, fr, en, cr, speed) => ({ id, name: { fr: fr + " (FP " + cr + ")", en }, description: "FP " + cr + " · " + speed + (/vol/.test(speed) ? " · vol : niveau 8 (Cercle de la Lune compris)" : "") });
  registerList("druid-beasts", [
    B("rat", "Rat", "Rat", "0", "6 m"), B("cat", "Chat", "Cat", "0", "12 m, escalade 9 m"), B("spider", "Araignée", "Spider", "0", "6 m, escalade 6 m"),
    B("frog", "Grenouille", "Frog", "0", "6 m, nage 6 m"), B("crab", "Crabe", "Crab", "0", "6 m, nage 6 m"), B("lizard", "Lézard", "Lizard", "0", "6 m, escalade 6 m"),
    B("goat", "Chèvre", "Goat", "0", "12 m"), B("hyena", "Hyène", "Hyena", "0", "15 m"), B("deer", "Cerf", "Deer", "0", "15 m"), B("jackal", "Chacal", "Jackal", "0", "12 m"),
    B("baboon", "Babouin", "Baboon", "0", "9 m, escalade 9 m"), B("badger", "Blaireau", "Badger", "0", "6 m, fouissement 1,5 m"), B("octopus", "Pieuvre", "Octopus", "0", "1,5 m, nage 9 m"),
    B("owl", "Chouette", "Owl", "0", "1,5 m, vol 18 m"), B("bat", "Chauve-souris", "Bat", "0", "1,5 m, vol 9 m"), B("raven", "Corbeau", "Raven", "0", "3 m, vol 15 m"),
    B("hawk", "Faucon", "Hawk", "0", "3 m, vol 18 m"), B("eagle", "Aigle", "Eagle", "0", "3 m, vol 18 m"),
    B("venomous-snake", "Serpent venimeux", "Venomous Snake", "1/8", "9 m, nage 9 m"), B("mastiff", "Molosse", "Mastiff", "1/8", "12 m"), B("pony", "Poney", "Pony", "1/8", "12 m"),
    B("mule", "Mule", "Mule", "1/8", "12 m"), B("camel", "Chameau", "Camel", "1/8", "15 m"), B("giant-weasel", "Belette géante", "Giant Weasel", "1/8", "12 m"),
    B("giant-rat", "Rat géant", "Giant Rat", "1/8", "9 m"), B("giant-crab", "Crabe géant", "Giant Crab", "1/8", "9 m, nage 9 m"),
    B("flying-snake", "Serpent volant", "Flying Snake", "1/8", "9 m, vol 18 m, nage 9 m"),
    B("wolf", "Loup", "Wolf", "1/4", "12 m"), B("riding-horse", "Cheval de selle", "Riding Horse", "1/4", "18 m"), B("draft-horse", "Cheval de trait", "Draft Horse", "1/4", "12 m"),
    B("boar", "Sanglier", "Boar", "1/4", "12 m"), B("panther", "Panthère", "Panther", "1/4", "15 m, escalade 12 m"), B("elk", "Élan", "Elk", "1/4", "15 m"),
    B("giant-wolf-spider", "Araignée-loup géante", "Giant Wolf Spider", "1/4", "12 m, escalade 12 m"), B("constrictor-snake", "Serpent constricteur", "Constrictor Snake", "1/4", "9 m, nage 9 m"),
    B("giant-frog", "Grenouille géante", "Giant Frog", "1/4", "9 m, nage 9 m"), B("giant-lizard", "Lézard géant", "Giant Lizard", "1/4", "9 m, escalade 9 m"),
    B("giant-badger", "Blaireau géant", "Giant Badger", "1/4", "9 m, fouissement 3 m"), B("giant-centipede", "Mille-pattes géant", "Giant Centipede", "1/4", "9 m, escalade 9 m"),
    B("giant-owl", "Chouette géante", "Giant Owl", "1/4", "1,5 m, vol 18 m"), B("giant-bat", "Chauve-souris géante", "Giant Bat", "1/4", "3 m, vol 18 m"),
    B("pteranodon", "Ptéranodon", "Pteranodon", "1/4", "3 m, vol 18 m"),
    B("ape", "Grand singe", "Ape", "1/2", "9 m, escalade 9 m"), B("black-bear", "Ours noir", "Black Bear", "1/2", "12 m, escalade 9 m"), B("crocodile", "Crocodile", "Crocodile", "1/2", "6 m, nage 9 m"),
    B("giant-goat", "Chèvre géante", "Giant Goat", "1/2", "12 m"), B("warhorse", "Cheval de guerre", "Warhorse", "1/2", "18 m"), B("reef-shark", "Requin de récif", "Reef Shark", "1/2", "nage 12 m"),
    B("giant-seahorse", "Hippocampe géant", "Giant Seahorse", "1/2", "nage 12 m"), B("giant-wasp", "Guêpe géante", "Giant Wasp", "1/2", "3 m, vol 15 m"),
    B("brown-bear", "Ours brun", "Brown Bear", "1", "12 m, escalade 9 m"), B("lion", "Lion", "Lion", "1", "15 m"), B("tiger", "Tigre", "Tiger", "1", "12 m"),
    B("dire-wolf", "Loup sanguinaire", "Dire Wolf", "1", "15 m"), B("giant-spider", "Araignée géante", "Giant Spider", "1", "9 m, escalade 9 m"), B("giant-hyena", "Hyène géante", "Giant Hyena", "1", "15 m"),
    B("giant-toad", "Crapaud géant", "Giant Toad", "1", "6 m, nage 12 m"), B("giant-octopus", "Pieuvre géante", "Giant Octopus", "1", "3 m, nage 18 m"),
    B("giant-eagle", "Aigle géant", "Giant Eagle", "1", "3 m, vol 24 m"), B("giant-vulture", "Vautour géant", "Giant Vulture", "1", "3 m, vol 18 m"),
    B("polar-bear", "Ours polaire", "Polar Bear", "2", "12 m, nage 9 m"), B("saber-toothed-tiger", "Tigre à dents de sabre", "Saber-Toothed Tiger", "2", "12 m"),
    B("giant-elk", "Élan géant", "Giant Elk", "2", "18 m"), B("giant-boar", "Sanglier géant", "Giant Boar", "2", "12 m"), B("rhinoceros", "Rhinocéros", "Rhinoceros", "2", "12 m"),
    B("plesiosaurus", "Plésiosaure", "Plesiosaurus", "2", "6 m, nage 12 m"), B("giant-constrictor-snake", "Serpent constricteur géant", "Giant Constrictor Snake", "2", "9 m, nage 9 m"),
    B("allosaurus", "Allosaure", "Allosaurus", "2", "18 m"), B("ankylosaurus", "Ankylosaure", "Ankylosaurus", "3", "9 m"), B("killer-whale", "Épaulard", "Killer Whale", "3", "nage 18 m"),
  ]);
  const maxCR = (c) => (subclassOf(c) === "moon" && lvl(c) >= 3 ? String(Math.floor(lvl(c) / 3)) : DND.byLevel({ 2: "1/4", 4: "1/2", 8: "1" }, lvl(c)));

  // --- Cercle de la Terre : environnements ---
  const LANDS = {
    arid: { fr: "Terres arides", en: "Arid Land", resist: "fire", spells: { 3: ["blur", "burning-hands", "fire-bolt"], 5: ["fireball"], 7: ["blight"], 9: ["wall-of-stone"] } },
    polar: { fr: "Terres polaires", en: "Polar Land", resist: "cold", spells: { 3: ["fog-cloud", "hold-person", "ray-of-frost"], 5: ["sleet-storm"], 7: ["ice-storm"], 9: ["cone-of-cold"] } },
    temperate: { fr: "Terres tempérées", en: "Temperate Land", resist: "lightning", spells: { 3: ["misty-step", "shocking-grasp", "sleep"], 5: ["lightning-bolt"], 7: ["freedom-of-movement"], 9: ["tree-stride"] } },
    tropical: { fr: "Terres tropicales", en: "Tropical Land", resist: "poison", spells: { 3: ["acid-splash", "ray-of-sickness", "web"], 5: ["stinking-cloud"], 7: ["polymorph"], 9: ["insect-plague"] } },
  };
  const MOON = { 3: ["cure-wounds", "moonbeam", "starry-wisp"], 5: ["conjure-animals"], 7: ["fount-of-moonlight"], 9: ["mass-cure-wounds"] };
  const SEA = { 3: ["fog-cloud", "gust-of-wind", "ray-of-frost", "thunderwave"], 5: ["lightning-bolt", "water-breathing"], 7: ["control-water", "ice-storm"], 9: ["conjure-elemental", "hold-monster"] };

  registerModule({
    kind: "class", id: "druid",
    name: { fr: "Druide", en: "Druid" },
    color: "#4f7a2a", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 8,
    savingThrows: ["int", "wis"],
    subclassLevel: 3,
    multiclassRequirement: [["wis"]],
    proficiencies: { armor: ["light", "shield"], weapons: ["simple"], tools: ["herbalism-kit"],
      skills: { choose: 2, from: ["animal-handling", "arcana", "insight", "medicine", "nature", "perception", "religion", "survival"] } },
    multiclassProficiencies: { armor: ["light", "shield"] },
    spellcasting: {
      progression: "full", ability: wis, list: "druid",
      cantrips: { 1: 2, 4: 3, 10: 4 },
      prepared: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 13: 17, 15: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    },
    features: [
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur la Sagesse, focaliseur druidique. Après chaque repos long, vous pouvez changer vos sorts préparés. Les sorts toujours préparés (cercle, Druidique) ne comptent pas." },
      { level: 1, id: "druidic", name: { fr: "Druidique", en: "Druidic" },
        description: "Vous connaissez le druidique, la langue secrète des druides, et Communication avec les animaux est toujours préparé. Un message caché en druidique se repère avec un test d'Intelligence (Investigation) DD 15, mais ne se lit pas sans magie.",
        effects: [{ type: "proficiency", target: "language.druidic" }, { type: "spell", spell: "speak-with-animals", ability: wis }] },
      { level: 1, id: "primal-order", name: { fr: "Ordre primitif", en: "Primal Order" },
        description: "Mage : un sort mineur de druide supplémentaire et un bonus égal à votre modificateur de Sagesse (minimum +1) aux tests d'Intelligence (Arcanes ou Nature). Gardien : maîtrise des armes de guerre et formation aux armures intermédiaires.",
        effects: [{ type: "choice", id: "primalOrder", label: "Ordre primitif", from: [
          { id: "magician", name: { fr: "Mage", en: "Magician" }, description: "Un sort mineur de druide en plus ; +Sagesse (min. +1) aux tests d'Arcanes et de Nature.",
            effects: [
              { type: "choice", id: "cantrip", label: "Sort mineur du Mage", from: "spells", filter: { level: 0, list: "druid" },
                grant: { type: "spell", spell: "{value}", ability: wis } },
              { type: "bonus", target: "skill.arcana", value: wisMin1, label: "Mage" },
              { type: "bonus", target: "skill.nature", value: wisMin1, label: "Mage" },
            ] },
          { id: "warden", name: { fr: "Gardien", en: "Warden" }, description: "Maîtrise des armes de guerre et formation aux armures intermédiaires.",
            effects: [{ type: "proficiency", target: "weapon.martial" }, { type: "proficiency", target: "armor.medium" }] },
        ] }] },
      { level: 2, id: "wild-shape", name: { fr: "Forme sauvage", en: "Wild Shape" },
        description: (c) => "Action bonus : vous prenez une forme de Bête connue pendant " + Math.floor(lvl(c) / 2) + " heure(s) (moitié de votre niveau), jusqu'à la réutilisation, l'état Incapable d'agir ou la mort ; action bonus pour la quitter. " +
          "Vous gagnez " + (subclassOf(c) === "moon" && lvl(c) >= 3 ? 3 * lvl(c) : lvl(c)) + " PV temporaires. Vous gardez vos PV, dés de vie, Int, Sag, Cha, capacités, langues, dons et maîtrises ; le reste du profil vient de la Bête. Pas d'incantation. " +
          "Formes connues : 4 (6 au niveau 4, 8 au niveau 8), FP maximum " + maxCR(c) + ", vol à partir du niveau 8. Une forme connue peut être remplacée après un repos long. Utilisations : 2 (3 au niveau 6), une récupérée au repos court, toutes au repos long.",
        effects: [
          { type: "resource", id: "wildShape", name: { fr: "Forme sauvage", en: "Wild Shape" }, max: { 2: 2, 6: 3, 17: 4 }, recharge: "long", shortRegain: 1,
            description: (c) => "FP maximum " + maxCR(c) + (lvl(c) >= 8 ? ", vol autorisé." : ", sans vol.") },
          { type: "action", name: { fr: "Forme sauvage", en: "Wild Shape" }, actionType: "bonus", ...ws,
            description: (c) => { const moon = subclassOf(c) === "moon" && lvl(c) >= 3;
              return "Forme de Bête connue (FP " + maxCR(c) + " max) pendant " + Math.floor(lvl(c) / 2) + " h ; " + (moon ? 3 * lvl(c) : lvl(c)) + " PV temporaires (à ajouter dans la carte PV)." +
                (moon ? " CA au moins " + (13 + c.mod.wis) + " (13 + Sagesse)." : "") + (moon && lvl(c) >= 6 ? " Attaques radiantes au choix, +" + c.mod.wis + " aux JS de Constitution." : "") + " Pas d'incantation."; } },
          { type: "choice", id: "beastForms", label: "Formes connues (Forme sauvage)", from: "list:druid-beasts", count: { 2: 4, 4: 6, 8: 8 }, showChosen: true,
            help: "Respectez le FP maximum et l'interdiction du vol avant le niveau 8 (voir l'aptitude Forme sauvage). Profils complets : Manuel des monstres ou AideDD." },
        ] },
      { level: 2, id: "wild-companion", name: { fr: "Compagnon sauvage", en: "Wild Companion" },
        description: "Action Magie : dépensez un emplacement de sort ou une utilisation de Forme sauvage pour lancer Appel de familier sans composante matérielle. Le familier est une Fée et disparaît à la fin de votre prochain repos long.",
        effects: [{ type: "action", name: { fr: "Compagnon sauvage", en: "Wild Companion" }, actionType: "action", ...ws,
          description: "Appel de familier sans composante matérielle (ou dépensez un emplacement de sort à la place) ; familier de type Fée jusqu'au repos long." }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de druide", en: "Druid Subclass" },
        description: "Choisissez votre cercle dans la partie Création." },
      asi(4),
      { level: 5, id: "wild-resurgence", name: { fr: "Regain sauvage", en: "Wild Resurgence" },
        description: "Une fois par tour, si vous n'avez plus d'utilisation de Forme sauvage, dépensez un emplacement de sort pour en récupérer une. Vous pouvez aussi dépenser une Forme sauvage pour gagner un emplacement de niveau 1 (une fois par repos long).",
        effects: [
          { type: "resource", id: "wildResurgence", name: { fr: "Regain sauvage (emplacement)", en: "Wild Resurgence" }, max: 1, recharge: "long",
            description: "Forme sauvage → un emplacement de niveau 1." },
          { type: "action", name: { fr: "Regain sauvage", en: "Wild Resurgence" }, actionType: "free",
            description: "Plus de Forme sauvage : dépensez un emplacement pour en regagner une (une fois par tour). Ou une Forme sauvage → un emplacement de niveau 1 (1/repos long, compteur ci-dessus)." },
        ] },
      { level: 7, id: "elemental-fury", name: { fr: "Fureur élémentaire", en: "Elemental Fury" },
        description: "Incantation puissante : votre modificateur de Sagesse s'ajoute aux dégâts de vos sorts mineurs de druide (calculé). Frappes primitives : une fois par tour, une attaque d'arme ou de Bête qui touche inflige 1d8 dégâts supplémentaires de froid, feu, foudre ou tonnerre.",
        effects: [{ type: "choice", id: "elementalFury", label: "Fureur élémentaire", from: [
          { id: "potent-spellcasting", name: { fr: "Incantation puissante", en: "Potent Spellcasting" }, description: "+Sagesse aux dégâts des sorts mineurs de druide.",
            effects: druidDamageCantrips.map((id) => ({ type: "bonus", target: "spellDamage." + id, value: (c) => c.mod.wis, label: "Incantation puissante" })) },
          { id: "primal-strike", name: { fr: "Frappes primitives", en: "Primal Strike" }, description: "Une fois par tour, +1d8 froid, feu, foudre ou tonnerre en touchant avec une arme ou une attaque de Bête.",
            effects: [{ type: "note", text: "Frappes primitives : une fois par tour, +1d8 dégâts de froid, feu, foudre ou tonnerre en touchant (arme ou forme de Bête)." }] },
        ] }] },
      asi(8),
      { level: 15, id: "improved-elemental-fury", name: { fr: "Fureur élémentaire améliorée", en: "Improved Elemental Fury" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "land", name: { fr: "Cercle de la Terre", en: "Circle of the Land" },
        features: [
          { level: 3, id: "circle-of-the-land-spells", name: { fr: "Sorts du Cercle de la Terre", en: "Circle of the Land Spells" },
            description: "Après chaque repos long, choisissez un environnement ; ses sorts (jusqu'à votre niveau) sont toujours préparés. " +
              Object.values(LANDS).map((l) => l.fr + " : " + spellNames(l.spells)).join(". ") + ".",
            effects: [{ type: "choice", id: "land", label: "Environnement (modifiable après un repos long)", from: Object.entries(LANDS).map(([id, l]) => ({
              id, name: { fr: l.fr, en: l.en }, description: spellNames(l.spells) + ". Niveau 10 : Résistance " + DND.label(l.resist).toLowerCase() + ".",
              effects: circleSpells(l.spells).concat([{ type: "resistance", damage: l.resist, minLevel: 10 }]) })) }] },
          { level: 3, id: "lands-aid", name: { fr: "Aval de la terre", en: "Land's Aid" },
            description: "Action Magie et une Forme sauvage : sphère de 3 m dans un rayon de 18 m. Les créatures choisies font un JS de Constitution contre votre DD des sorts (2d6 nécrotiques, moitié si réussi) ; une créature choisie récupère 2d6 PV. 3d6 au niveau 10.",
            effects: [{ type: "action", name: { fr: "Aval de la terre", en: "Land's Aid" }, actionType: "action", ...ws,
              description: (c) => { const d = lvl(c) >= 14 ? 4 : lvl(c) >= 10 ? 3 : 2;
                return "Sphère de 3 m à 18 m : JS de Constitution DD " + DC(c) + ", " + d + "d6 nécrotiques (moitié si réussi) ; une créature récupère " + d + "d6 PV."; } }] },
          { level: 6, id: "natural-recovery", name: { fr: "Ressourcement", en: "Natural Recovery" },
            description: (c) => "Une fois par repos long, lancez un sort de cercle préparé de niveau 1+ sans emplacement. Une fois par repos long, après un repos court, récupérez des emplacements dont le total des niveaux vaut au plus " + Math.ceil(lvl(c) / 2) + " (moitié du niveau arrondie au supérieur, aucun de niveau 6+).",
            effects: [
              { type: "resource", id: "naturalRecoveryCast", name: { fr: "Ressourcement (sort de cercle)", en: "Natural Recovery" }, max: 1, recharge: "long",
                description: "Un sort de cercle de niveau 1+ sans emplacement." },
              { type: "resource", id: "naturalRecovery", name: { fr: "Ressourcement (emplacements)", en: "Natural Recovery" }, max: 1, recharge: "long",
                description: (c) => "Après un repos court : jusqu'à " + Math.ceil(lvl(c) / 2) + " niveaux d'emplacements (rendez-les avec les pastilles)." },
            ] },
          { level: 10, id: "natures-ward", name: { fr: "Protégé de dame nature", en: "Nature's Ward" },
            description: "Immunité contre l'état Empoisonné, et Résistance au type de dégâts de votre environnement actuel : feu (aride), froid (polaire), foudre (tempéré), poison (tropical). La Résistance est calculée d'après l'environnement choisi.",
            effects: [{ type: "immunity", condition: "poisoned" }] },
          { level: 14, id: "natures-sanctuary", name: { fr: "Sanctuaire de dame Nature", en: "Nature's Sanctuary" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "moon", name: { fr: "Cercle de la Lune", en: "Circle of the Moon" },
        features: [
          { level: 3, id: "circle-forms", combat: true, name: { fr: "Formes du cercle", en: "Circle Forms" },
            description: "Sous Forme sauvage : FP maximum égal au tiers de votre niveau de druide (arrondi à l'inférieur) ; CA égale à 13 + votre modificateur de Sagesse si c'est mieux que celle de la Bête ; PV temporaires égaux à trois fois votre niveau de druide.",
            effects: [{ type: "note", text: (c) => "Formes du cercle : FP max " + Math.floor(lvl(c) / 3) + ", CA au moins " + (13 + c.mod.wis) + ", " + 3 * lvl(c) + " PV temporaires." }] },
          { level: 3, id: "circle-of-the-moon-spells", name: { fr: "Sorts du Cercle de la Lune", en: "Circle of the Moon Spells" },
            description: "Sorts toujours préparés, utilisables sous Forme sauvage : " + spellNames(MOON) + ".",
            effects: circleSpells(MOON) },
          { level: 6, id: "improved-circle-forms", combat: true, name: { fr: "Formes du cercle améliorées", en: "Improved Circle Forms" },
            description: "Sous Forme sauvage : vos attaques peuvent infliger des dégâts radiants au lieu de leur type normal ; vous ajoutez votre modificateur de Sagesse à vos JS de Constitution.",
            effects: [{ type: "note", text: (c) => "Formes du cercle améliorées : sous Forme sauvage, attaques radiantes au choix et " + sg(c.mod.wis) + " aux JS de Constitution." }] },
          { level: 10, id: "moonlight-step", name: { fr: "Foulée sélène", en: "Moonlight Step" },
            description: "Action bonus : téléportation jusqu'à 9 m dans un espace libre visible, et Avantage au prochain jet d'attaque de ce tour. Utilisations égales à votre modificateur de Sagesse (minimum 1), récupérées au repos long ; un emplacement de niveau 2+ rend une utilisation.",
            effects: [
              { type: "resource", id: "moonlightStep", name: { fr: "Foulée sélène", en: "Moonlight Step" }, max: wisMin1, recharge: "long",
                description: "Ou un emplacement de niveau 2+ par utilisation." },
              { type: "action", name: { fr: "Foulée sélène", en: "Moonlight Step" }, actionType: "bonus", resource: "moonlightStep",
                description: "Téléportation de 9 m ; Avantage au prochain jet d'attaque de ce tour." },
            ] },
          { level: 14, id: "lunar-form", name: { fr: "Forme lunaire", en: "Lunar Form" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "sea", name: { fr: "Cercle des Mers", en: "Circle of the Sea" },
        features: [
          { level: 3, id: "circle-of-the-sea-spells", name: { fr: "Sorts du Cercle des Mers", en: "Circle of the Sea Spells" },
            description: "Sorts toujours préparés : " + spellNames(SEA) + ".",
            effects: circleSpells(SEA) },
          { level: 3, id: "wrath-of-the-sea", name: { fr: "Courroux des mers", en: "Wrath of the Sea" },
            description: "Action bonus et une Forme sauvage : émanation d'embruns de 1,5 m (3 m au niveau 6) pendant 10 minutes. En la créant puis par une action bonus à vos tours suivants, une créature visible dans l'émanation fait un JS de Constitution contre votre DD des sorts : sinon dégâts de froid (autant de d6 que votre modificateur de Sagesse, minimum 1) et, si elle est de taille G ou moins, repoussée de 4,5 m.",
            effects: [{ type: "action", name: { fr: "Courroux des mers", en: "Wrath of the Sea" }, actionType: "bonus", ...ws,
              description: (c) => "Émanation de " + (lvl(c) >= 6 ? "3" : "1,5") + " m pendant 10 min ; à chaque action bonus, une créature dedans : JS de Constitution DD " + DC(c) + " ou " + wisMin1(c) + "d6 froid et repoussée de 4,5 m." +
                (lvl(c) >= 10 ? " Enfant des tempêtes : vol égal à votre Vitesse et Résistance au froid, à la foudre et au tonnerre tant qu'elle est active." : "") }] },
          { level: 6, id: "aquatic-affinity", name: { fr: "Affinité aquatique", en: "Aquatic Affinity" },
            description: "L'émanation du Courroux des mers passe à 3 m. Vitesse de nage égale à votre Vitesse.",
            effects: [{ type: "speed", mode: "swim", value: "walk" }] },
          { level: 10, id: "stormborn", combat: true, name: { fr: "Enfant des tempêtes", en: "Stormborn" },
            description: "Tant que votre Courroux des mers est actif : Vitesse de vol égale à votre Vitesse, Résistance aux dégâts de froid, de foudre et de tonnerre.",
            effects: [{ type: "note", text: "Enfant des tempêtes : Courroux des mers actif, vol égal à votre Vitesse et Résistance au froid, à la foudre et au tonnerre." }] },
          { level: 14, id: "oceanic-gift", name: { fr: "Offrande océanique", en: "Oceanic Gift" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absent d'AideDD (« Voir le Manuel des Joueurs ») : saisi de mémoire, noms et valeurs à vérifier dans le livre.
        id: "stars", name: { fr: "Cercle des Astres", en: "Circle of the Stars" }, source: "PHB 2024",
        features: [
          { level: 3, id: "star-map", name: { fr: "Carte stellaire", en: "Star Map" },
            description: "Une carte des étoiles sert de focaliseur. Assistance et Rayon traçant sont toujours préparés ; vous pouvez lancer Rayon traçant sans emplacement un nombre de fois égal à votre modificateur de Sagesse (minimum 1) par repos long. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "spell", spell: "guidance", ability: wis },
              { type: "spell", spell: "guiding-bolt", ability: wis, freeCast: { max: wisMin1, recharge: "long" } },
            ] },
          { level: 3, id: "starry-form", name: { fr: "Forme stellaire", en: "Starry Form" },
            description: "Action bonus et une Forme sauvage (au lieu de vous transformer) : forme stellaire pendant 10 minutes, Lumière vive sur 3 m. Choisissez une constellation. Archer : action bonus, attaque de sort à distance (18 m), 1d8 + Sagesse radiants. Calice : quand vous lancez un sort de soin avec un emplacement, vous ou une créature à 9 m regagnez 1d8 + Sagesse PV. Dragon : vos tests d'Intelligence et de Sagesse et vos JS de Constitution pour la Concentration traitent un 9 ou moins comme un 10. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Forme stellaire", en: "Starry Form" }, actionType: "bonus", ...ws,
              description: (c) => { const d = lvl(c) >= 10 ? "2d8" : "1d8";
                return "10 minutes. Archer : action bonus, " + sg(c.pb + c.mod.wis) + " au toucher, " + d + " " + sg(c.mod.wis) + " radiants. Calice : soin avec emplacement, +" + d + " " + sg(c.mod.wis) + " PV à vous ou une créature à 9 m. Dragon : 9 ou moins = 10 aux tests d'Int/Sag et JS de Concentration" +
                  (lvl(c) >= 10 ? ", vol 6 m (vol stationnaire). Changez de constellation au début de chaque tour." : "."); } }] },
          { level: 6, id: "cosmic-omen", name: { fr: "Présage cosmique", en: "Cosmic Omen" },
            description: "Après un repos long, lancez un dé : pair, Bonheur ; impair, Malheur. Réaction quand une créature visible à 9 m fait un test d20 : ajoutez (Bonheur) ou soustrayez (Malheur) 1d6. Utilisations égales à votre modificateur de Sagesse (minimum 1), récupérées au repos long. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "cosmicOmen", name: { fr: "Présage cosmique", en: "Cosmic Omen" }, max: wisMin1, recharge: "long",
                description: "Bonheur (+1d6) ou Malheur (−1d6) selon le jet du repos long." },
              { type: "action", name: { fr: "Présage cosmique", en: "Cosmic Omen" }, actionType: "reaction", resource: "cosmicOmen",
                description: "Une créature visible à 9 m fait un test d20 : +1d6 (Bonheur) ou −1d6 (Malheur)." },
            ] },
          { level: 10, id: "twinkling-constellations", name: { fr: "Constellations scintillantes", en: "Twinkling Constellations" },
            description: "Les 1d8 de l'Archer et du Calice passent à 2d8 ; le Dragon vous donne une Vitesse de vol de 6 m (vol stationnaire) ; au début de chacun de vos tours en forme stellaire, vous pouvez changer de constellation. (Saisi de mémoire, à vérifier.)" },
          { level: 14, id: "full-of-stars", name: { fr: "Plein d'étoiles", en: "Full of Stars" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
