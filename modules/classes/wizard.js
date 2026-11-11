// Classe : Magicien (Wizard) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/magicien), relevés le 2026-10-18 (les 4 sous-classes y sont).
// Journal de la classe : classes/magicien.md
(function () {
  const lvl = (c) => c.classLevel("wizard");
  const int = "int";
  const DC = (c) => 8 + c.pb + c.mod.int;
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  // Grimoire : 6 sorts au niveau 1, puis 2 de plus par niveau. Le choix est seulement noté (effet « spellbook » sans calcul) :
  // préparer un sort se fait dans l'onglet Sorts comme pour les autres classes.
  const bookCount = {};
  for (let n = 1; n <= 20; n++) bookCount[n] = 6 + 2 * (n - 1);
  // Érudit : deux sorts de l'école (niveau 2 au plus) ajoutés gratuitement au grimoire, puis un par nouveau niveau d'emplacements.
  const savant = (id, fr, en, school, schoolFr) => ({ level: 3, id: id + "-savant", name: { fr, en },
    description: "Deux sorts de magicien d'" + schoolFr + " de niveau 2 au plus ajoutés gratuitement à votre grimoire. Chaque fois que vous gagnez un nouveau niveau d'emplacements, un sort d'" + schoolFr + " de plus (d'un niveau que vous pouvez lancer).",
    effects: [{ type: "choice", id: "savant", label: fr + " (sorts ajoutés au grimoire)", optional: true,
      count: { 3: 2, 5: 3, 7: 4, 9: 5 }, from: "spells", filter: { list: "wizard", school, level: [1, 2, 3, 4, 5] },
      grant: { type: "spellbook", spell: "{value}" },
      help: "Deux sorts de niveau 1 ou 2, puis un sort d'un niveau que vous pouvez lancer aux niveaux 5, 7 et 9. Préparez-les ensuite dans l'onglet Sorts." }] });
  // Évocation améliorée : +Intelligence aux dégâts des sorts d'évocation de magicien
  const evocationDamage = Object.values(DND.data.spells).filter((s) => s.school === "evocation" && s.damage && s.lists.includes("wizard")).map((s) => s.id);

  registerModule({
    kind: "class", id: "wizard",
    name: { fr: "Magicien", en: "Wizard" },
    color: "#2c4f9e", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 6,
    savingThrows: ["int", "wis"],
    subclassLevel: 3,
    multiclassRequirement: [["int"]],
    proficiencies: { weapons: ["simple"],
      skills: { choose: 2, from: ["arcana", "history", "insight", "investigation", "medicine", "nature", "religion"] } },
    multiclassProficiencies: {},
    spellcasting: {
      progression: "full", ability: int, list: "wizard",
      cantrips: { 1: 3, 4: 4, 10: 5 },
      prepared: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 12: 16, 13: 17, 14: 18, 15: 19, 16: 21, 17: 22, 18: 23, 19: 24, 20: 25 },
    },
    features: [
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur l'Intelligence, focaliseur arcanique ou grimoire. Vos sorts préparés viennent de votre grimoire ; vous pouvez les changer après chaque repos long. Un sort mineur peut être remplacé après chaque repos long. Recopier un sort trouvé : 2 heures et 50 po par niveau.",
        effects: [{ type: "choice", id: "spellbook", label: "Grimoire (sorts de niveau 1 et plus)", optional: true, count: bookCount,
          from: "spells", filter: { list: "wizard", level: [1, 2, 3, 4, 5, 6, 7, 8, 9] }, grant: { type: "spellbook", spell: "{value}" },
          help: "Facultatif : notez ici les sorts de votre grimoire (6 au niveau 1, 2 de plus par niveau, plus ceux recopiés). Les sorts préparés se choisissent dans l'onglet Sorts." }] },
      { level: 1, id: "ritual-adept", name: { fr: "Savoir rituel", en: "Ritual Adept" },
        description: "Vous pouvez lancer comme rituel tout sort à rituel de votre grimoire sans le préparer, en lisant le livre." },
      { level: 1, id: "arcane-recovery", name: { fr: "Restauration magique", en: "Arcane Recovery" },
        description: (c) => "Une fois par repos long, après un repos court : récupérez des emplacements de sort dont le total des niveaux vaut au plus " + Math.ceil(lvl(c) / 2) + " (moitié de votre niveau de magicien arrondie au supérieur, aucun de niveau 6+).",
        effects: [{ type: "resource", id: "arcaneRecovery", name: { fr: "Restauration magique", en: "Arcane Recovery" }, max: 1, recharge: "long",
          description: (c) => "Après un repos court : jusqu'à " + Math.ceil(lvl(c) / 2) + " niveaux d'emplacements (rendez-les avec les pastilles)." }] },
      { level: 2, id: "scholar", name: { fr: "Érudition", en: "Scholar" },
        description: "Expertise dans une compétence que vous maîtrisez parmi Arcanes, Histoire, Investigation, Médecine, Nature et Religion.",
        effects: [{ type: "choice", id: "scholar", label: "Érudition (expertise)", from: ["arcana", "history", "investigation", "medicine", "nature", "religion"].map((s) => "skill." + s),
          grant: { type: "proficiency", target: "{value}", expertise: true } }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de magicien", en: "Wizard Subclass" },
        description: "Choisissez votre sous-classe dans la partie Création." },
      asi(4),
      { level: 5, id: "memorize-spell", name: { fr: "Mémorisation de sort", en: "Memorize Spell" },
        description: "Après un repos court, vous pouvez remplacer un de vos sorts préparés de niveau 1+ par un autre sort de niveau 1+ de votre grimoire." },
      asi(8),
      { level: 18, id: "spell-mastery", name: { fr: "Maîtrise des sorts", en: "Spell Mastery" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "abjurer", name: { fr: "Abjurateur", en: "Abjurer" },
        features: [
          savant("abjuration", "Abjurateur érudit", "Abjuration Savant", "abjuration", "Abjuration"),
          { level: 3, id: "arcane-ward", name: { fr: "Égide arcanique", en: "Arcane Ward" },
            description: (c) => "Quand vous lancez un sort d'Abjuration avec un emplacement, vous pouvez créer une égide (une fois par repos long) qui dure jusqu'au repos long. PV max de l'égide : " + (2 * lvl(c) + c.mod.int) +
              " (2 × niveau + Intelligence). Elle subit les dégâts à votre place (Résistances et Vulnérabilités appliquées avant). Chaque sort d'Abjuration avec emplacement lui rend 2 × le niveau de l'emplacement ; en action bonus, vous pouvez aussi dépenser un emplacement pour la même récupération.",
            effects: [
              { type: "resource", id: "arcaneWard", name: { fr: "Égide arcanique (PV)", en: "Arcane Ward" }, max: (c) => Math.max(1, 2 * lvl(c) + c.mod.int), recharge: "long",
                description: "Pastilles = PV de l'égide : dépensez-en quand elle absorbe des dégâts, rendez-en quand vous la rechargez (2 × niveau de l'emplacement)." },
              { type: "action", name: { fr: "Recharger l'égide", en: "Arcane Ward" }, actionType: "bonus",
                description: "Dépensez un emplacement : l'égide regagne 2 × son niveau en PV (gratuit en lançant un sort d'Abjuration avec emplacement)." },
            ] },
          { level: 6, id: "projected-ward", name: { fr: "Égide projetée", en: "Projected Ward" },
            description: "Réaction quand une créature visible à 9 m subit des dégâts : votre Égide arcanique absorbe ces dégâts à sa place.",
            effects: [{ type: "action", name: { fr: "Égide projetée", en: "Projected Ward" }, actionType: "reaction",
              description: "Une créature visible à 9 m subit des dégâts : votre égide les absorbe (le surplus va à la créature)." }] },
          { level: 10, id: "spell-breaker", name: { fr: "Briseur de sorts", en: "Spell Breaker" },
            description: "Contresort et Dissipation de la magie sont toujours préparés. Dissipation de la magie en action bonus, avec votre bonus de maîtrise au test. Si l'un de ces sorts échoue à arrêter un sort, l'emplacement n'est pas dépensé.",
            effects: [
              { type: "spell", spell: "counterspell", ability: int },
              { type: "spell", spell: "dispel-magic", ability: int },
              { type: "note", text: (c) => "Briseur de sorts : Dissipation de la magie en action bonus, " + DND.engine.signed(c.mod.int + c.pb) + " au test ; emplacement conservé si Contresort ou Dissipation échoue." },
            ] },
          { level: 14, id: "spell-resistance", name: { fr: "Résistance aux sorts", en: "Spell Resistance" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "diviner", name: { fr: "Devin", en: "Diviner" },
        features: [
          savant("divination", "Devin érudit", "Divination Savant", "divination", "Divination"),
          { level: 3, id: "portent", name: { fr: "Présage", en: "Portent" },
            description: "Après chaque repos long, lancez deux d20 et notez-les. Avant un jet de d20 fait par vous ou une créature visible, vous pouvez le remplacer par un de ces jets (une fois par tour). Les jets non utilisés sont perdus au repos long suivant.",
            effects: [{ type: "resource", id: "portent", name: { fr: "Présage", en: "Portent" }, max: { 3: 2, 14: 3 }, recharge: "long",
              description: "Notez vos jets de présage dans Notes de session." }] },
          { level: 6, id: "expert-divination", name: { fr: "Divination experte", en: "Expert Divination" },
            description: "Quand vous lancez un sort de Divination avec un emplacement de niveau 2+, vous récupérez un emplacement dépensé de niveau inférieur (5 au maximum).",
            effects: [{ type: "note", text: "Divination experte : un sort de Divination avec un emplacement de niveau 2+ vous rend un emplacement de niveau inférieur (5 max)." }] },
          { level: 10, id: "the-third-eye", name: { fr: "Troisième Œil", en: "The Third Eye" },
            description: "Action bonus, une fois par repos court ou long, jusqu'à votre prochain repos : Vision dans le noir 36 m, ou lire n'importe quelle langue, ou lancer Détection de l'invisibilité sans emplacement.",
            effects: [
              { type: "resource", id: "thirdEye", name: { fr: "Troisième Œil", en: "The Third Eye" }, max: 1, recharge: "short" },
              { type: "action", name: { fr: "Troisième Œil", en: "The Third Eye" }, actionType: "bonus", resource: "thirdEye",
                description: "Jusqu'à votre prochain repos : Vision dans le noir 36 m, ou lecture de toutes les langues, ou Détection de l'invisibilité sans emplacement." },
            ] },
          { level: 14, id: "greater-portent", name: { fr: "Présage renforcé", en: "Greater Portent" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "evoker", name: { fr: "Évocateur", en: "Evoker" },
        features: [
          savant("evocation", "Évocateur érudit", "Evocation Savant", "evocation", "Évocation"),
          { level: 3, id: "potent-cantrip", combat: true, name: { fr: "Sort mineur appuyé", en: "Potent Cantrip" },
            description: "Quand votre jet d'attaque rate avec un sort mineur, ou que la cible réussit son JS contre lui, elle subit quand même la moitié des dégâts (sans autre effet).",
            effects: [{ type: "note", text: "Sort mineur appuyé : attaque ratée ou JS réussi contre un sort mineur, la cible subit quand même la moitié des dégâts." }] },
          { level: 6, id: "sculpt-spells", combat: true, name: { fr: "Façonneur de sorts", en: "Sculpt Spells" },
            description: "Quand vous lancez un sort d'Évocation qui affecte d'autres créatures visibles, choisissez-en 1 + le niveau du sort : elles réussissent automatiquement leur JS et ne subissent aucun dégât s'il en aurait infligé la moitié.",
            effects: [{ type: "note", text: "Façonneur de sorts : sort d'Évocation, 1 + niveau du sort créatures réussissent leur JS sans aucun dégât." }] },
          { level: 10, id: "empowered-evocation", name: { fr: "Évocation améliorée", en: "Empowered Evocation" },
            description: "Vous ajoutez votre modificateur d'Intelligence à un jet de dégâts de vos sorts de magicien d'Évocation (calculé sur les sorts).",
            effects: evocationDamage.map((id) => ({ type: "bonus", target: "spellDamage." + id, value: (c) => c.mod.int, label: "Évocation améliorée" })) },
          { level: 14, id: "overchannel", name: { fr: "Surcharge magique", en: "Overchannel" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "illusionist", name: { fr: "Illusionniste", en: "Illusionist" },
        features: [
          savant("illusion", "Illusionniste érudit", "Illusion Savant", "illusion", "Illusion"),
          { level: 3, id: "improved-illusions", name: { fr: "Illusions améliorées", en: "Improved Illusions" },
            description: "Vos sorts d'Illusion n'ont pas besoin de composante verbale, et ceux de portée 3 m ou plus gagnent 18 m de portée. Vous connaissez Illusion mineure (sans le compter ; si vous le connaissiez, choisissez un autre sort mineur de magicien), avec un son et une image à la fois, lançable en action bonus.",
            effects: [
              { type: "spell", spell: "minor-illusion", ability: int },
              { type: "note", text: "Illusions améliorées : sorts d'Illusion sans composante verbale, +18 m de portée (si 3 m ou plus) ; Illusion mineure en action bonus, son et image ensemble." },
            ] },
          { level: 6, id: "phantasmal-creatures", name: { fr: "Créatures fantasmagoriques", en: "Phantasmal Creatures" },
            description: "Convocation de bête et Convocation de fée toujours préparés. Vous pouvez en faire des sorts d'Illusion : une fois par repos long chacun, sans emplacement, mais la créature a moitié moins de PV.",
            effects: [
              { type: "spell", spell: "summon-beast", ability: int, freeCast: { max: 1, recharge: "long" } },
              { type: "spell", spell: "summon-fey", ability: int, freeCast: { max: 1, recharge: "long" } },
              { type: "note", text: "Créatures fantasmagoriques : version Illusion sans emplacement (une fois chacune par repos long), PV de la créature divisés par deux." },
            ] },
          { level: 10, id: "illusory-self", name: { fr: "Calque illusoire", en: "Illusory Self" },
            description: "Réaction quand une créature vous touche avec un jet d'attaque : un double illusoire s'interpose, l'attaque rate. Une fois par repos court ou long, ou en dépensant un emplacement de niveau 2+.",
            effects: [
              { type: "resource", id: "illusorySelf", name: { fr: "Calque illusoire", en: "Illusory Self" }, max: 1, recharge: "short",
                description: "Ou dépenser un emplacement de niveau 2 ou plus." },
              { type: "action", name: { fr: "Calque illusoire", en: "Illusory Self" }, actionType: "reaction", resource: "illusorySelf",
                description: "Une attaque vous touche : elle rate automatiquement." },
            ] },
          { level: 14, id: "illusory-reality", name: { fr: "Réalité chimérique", en: "Illusory Reality" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
