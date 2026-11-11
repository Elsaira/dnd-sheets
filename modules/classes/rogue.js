// Classe : Roublard (Rogue) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/roublard), relevés le 2026-10-18.
// Âme acérée : absente d'AideDD (« Voir le Manuel des Joueurs »), saisie de mémoire, à vérifier.
// Journal de la classe : classes/roublard.md
(function () {
  const lvl = (c) => c.classLevel("rogue");
  const sg = (n) => DND.engine.signed(n);
  const DC = (c) => 8 + c.pb + c.mod.dex;
  const sneak = (c) => Math.ceil(lvl(c) / 2) + "d6";
  const rogueSkills = ["acrobatics", "athletics", "deception", "insight", "intimidation", "investigation", "perception", "persuasion", "sleight-of-hand", "stealth"];
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const martialFinesseLight = Object.values(DND.data.weapons).filter((w) => w.category === "martial" && (w.props.includes("finesse") || w.props.includes("light"))).map((w) => w.id);
  // Âme acérée : dés d'énergie psionique (saisi de mémoire, à vérifier)
  const psiDie = (c) => (lvl(c) >= 17 ? "d12" : lvl(c) >= 11 ? "d10" : lvl(c) >= 5 ? "d8" : "d6");
  const psi = { resource: "psionicDice" };

  registerModule({
    kind: "class", id: "rogue",
    name: { fr: "Roublard", en: "Rogue" },
    color: "#4a4a5e", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 8,
    savingThrows: ["dex", "int"],
    subclassLevel: 3,
    multiclassRequirement: [["dex"]],
    proficiencies: { armor: ["light"], weapons: ["simple"].concat(martialFinesseLight), tools: ["thieves-tools"],
      skills: { choose: 4, from: rogueSkills } },
    multiclassProficiencies: { armor: ["light"], tools: ["thieves-tools"], skills: { choose: 1, from: rogueSkills } },
    features: [
      { level: 1, id: "expertise", name: { fr: "Expertise", en: "Expertise" },
        description: "Expertise dans deux compétences que vous maîtrisez (Escamotage et Discrétion recommandées), deux autres au niveau 6.",
        effects: [{ type: "choice", id: "expertise", label: "Expertise (compétences maîtrisées)", from: "skills", count: { 1: 2, 6: 4 },
          grant: { type: "proficiency", target: "{value}", expertise: true } }] },
      { level: 1, id: "sneak-attack", combat: true, name: { fr: "Attaque sournoise", en: "Sneak Attack" },
        description: (c) => "Une fois par tour, +" + sneak(c) + " dégâts (du type de l'arme) à une créature touchée par une attaque avec une arme de Finesse ou à distance, si vous avez l'Avantage, ou si un allié non Incapable d'agir est à 1,5 m de la cible et que vous n'avez pas le Désavantage.",
        effects: [{ type: "note", text: (c) => "Attaque sournoise : une fois par tour, +" + sneak(c) + " (arme de Finesse ou à distance ; Avantage, ou allié à 1,5 m de la cible sans Désavantage)." }] },
      { level: 1, id: "thieves-cant", name: { fr: "Argot des voleurs", en: "Thieves' Cant" },
        description: "Vous connaissez l'argot des voleurs et une autre langue de votre choix (cochez-la dans Langues).",
        effects: [{ type: "proficiency", target: "language.thieves-cant" }] },
      { level: 1, id: "weapon-mastery", combat: (c) => DND.masteryLines(((c.character.classes.find((x) => x.id === "rogue") || {}).choices || {}).masteries, c),
        name: { fr: "Bottes d'arme", en: "Weapon Mastery" },
        description: "Vous utilisez la botte de deux types d'armes que vous maîtrisez (dague et arc court par exemple). Après un repos long, vous pouvez en changer.",
        effects: [{ type: "choice", id: "masteries", label: "Bottes d'arme", from: "weapons", count: 2,
          grant: { type: "proficiency", target: "mastery.{value}" },
          help: "La botte s'affiche sur l'attaque de l'arme dans l'onglet Combat." }] },
      { level: 2, id: "cunning-action", name: { fr: "Ruse", en: "Cunning Action" },
        description: "À votre tour, vous pouvez prendre l'action Pointe, Désengagement ou Furtivité par une action bonus.",
        effects: [{ type: "action", name: { fr: "Ruse", en: "Cunning Action" }, actionType: "bonus", description: "Pointe, Désengagement ou Furtivité." }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de roublard", en: "Rogue Subclass" },
        description: "Choisissez votre sous-classe dans la partie Création." },
      { level: 3, id: "steady-aim", name: { fr: "Visée appliquée", en: "Steady Aim" },
        description: "Action bonus, si vous ne vous êtes pas déplacé ce tour : Avantage à votre prochain jet d'attaque du tour ; votre Vitesse tombe à 0 jusqu'à la fin du tour.",
        effects: [{ type: "action", name: { fr: "Visée appliquée", en: "Steady Aim" }, actionType: "bonus",
          description: (c) => "Sans vous être déplacé : Avantage à la prochaine attaque du tour" + (c.character.classes.some((x) => x.id === "rogue" && x.subclass === "assassin") && lvl(c) >= 9 ? " (Visée mobile : Vitesse conservée)." : ", Vitesse 0 jusqu'à la fin du tour.") }] },
      asi(4),
      { level: 5, id: "cunning-strike", combat: true, name: { fr: "Frappe malicieuse", en: "Cunning Strike" },
        description: (c) => "Quand vous infligez votre Attaque sournoise, vous pouvez retirer des dés pour un effet (DD " + DC(c) + " = 8 + Dextérité + maîtrise). Poison (1d6) : JS de Constitution ou Empoisonnée 1 minute (nouveau JS à chaque fin de tour ; matériel d'empoisonneur requis). Croc-en-jambe (1d6) : taille G ou moins, JS de Dextérité ou À terre. Repli (1d6) : déplacez-vous de la moitié de votre Vitesse sans attaque d'opportunité.",
        effects: [{ type: "note", text: (c) => "Frappe malicieuse (retirez 1d6 de l'Attaque sournoise, DD " + DC(c) + ") : Poison (JS CON ou Empoisonnée), Croc-en-jambe (JS DEX ou À terre), Repli (demi-Vitesse sans attaque d'opportunité)." +
          (c.character.classes.some((x) => x.id === "rogue" && x.subclass === "thief") && lvl(c) >= 9 ? " Attaque furtive (1d6) : l'attaque ne met pas fin à votre Invisibilité de Furtivité si vous finissez derrière un abri important." : "") }] },
      { level: 5, id: "uncanny-dodge", name: { fr: "Esquive instinctive", en: "Uncanny Dodge" },
        description: "Réaction quand un attaquant visible vous touche : les dégâts de l'attaque sont divisés par deux (arrondis à l'inférieur).",
        effects: [{ type: "action", name: { fr: "Esquive instinctive", en: "Uncanny Dodge" }, actionType: "reaction",
          description: "Un attaquant visible vous touche : dégâts divisés par deux." }] },
      { level: 7, id: "evasion", combat: true, name: { fr: "Esquive totale", en: "Evasion" },
        description: "Effet avec JS de Dextérité pour moitié des dégâts : aucun dégât si réussi, moitié si raté (sauf si vous êtes Incapable d'agir).",
        effects: [{ type: "note", text: "Esquive totale : JS de Dextérité réussi = aucun dégât, raté = moitié." }] },
      { level: 7, id: "reliable-talent", name: { fr: "Savoir-faire", en: "Reliable Talent" },
        description: "Pour un test de caractéristique avec une compétence ou un outil que vous maîtrisez, un 9 ou moins au d20 compte comme un 10.",
        effects: [{ type: "note", text: "Savoir-faire : compétence ou outil maîtrisé, un d20 de 9 ou moins compte comme 10." }] },
      asi(8),
      asi(10),
      { level: 11, id: "improved-cunning-strike", name: { fr: "Frappe malicieuse améliorée", en: "Improved Cunning Strike" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "arcane-trickster", name: { fr: "Arnaqueur arcanique", en: "Arcane Trickster" },
        // Incantation de tiers : table propre quand c'est la seule classe à emplacements, sinon règle du multiclassage (niveau ÷ 3).
        spellcasting: {
          progression: "third", ability: "int", list: "wizard",
          cantrips: { 3: 2, 10: 3 },
          prepared: { 3: 3, 4: 4, 7: 5, 8: 6, 10: 7, 11: 8, 13: 9, 14: 10, 16: 11, 19: 12, 20: 13 },
          slotTable: { 3: [2], 4: [3], 7: [4, 2], 10: [4, 3], 13: [4, 3, 2], 16: [4, 3, 3], 19: [4, 3, 3, 1] },
        },
        features: [
          { level: 3, id: "arcane-trickster-spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
            description: "Sorts de magicien, Intelligence. Main de mage (toujours connu, ajouté d'office) et deux autres sorts mineurs de magicien (Piqûre mentale et Illusion mineure recommandés), un de plus au niveau 10. Sorts préparés de magicien d'un niveau pour lequel vous avez des emplacements ; vous pouvez en changer un à chaque niveau de roublard. Focaliseur arcanique possible.",
            effects: [{ type: "spell", spell: "mage-hand", ability: "int" }] },
          { level: 3, id: "mage-hand-legerdemain", name: { fr: "Passe-passe à distance", en: "Mage Hand Legerdemain" },
            description: "Main de mage en action bonus, main invisible. Vous la contrôlez par une action bonus et pouvez faire des tests de Dextérité (Escamotage) par son biais.",
            effects: [{ type: "action", name: { fr: "Passe-passe à distance", en: "Mage Hand Legerdemain" }, actionType: "bonus",
              description: "Lancez ou contrôlez Main de mage (invisible) ; Escamotage possible par la main." }] },
          { level: 9, id: "magical-ambush", combat: true, name: { fr: "Embuscade magique", en: "Magical Ambush" },
            description: "Si vous êtes Invisible quand vous lancez un sort sur une créature, elle a le Désavantage à ses JS contre ce sort ce tour-ci.",
            effects: [{ type: "note", text: "Embuscade magique : Invisible en lançant un sort, la cible a le Désavantage à ses JS contre ce sort ce tour-ci." }] },
          { level: 13, id: "versatile-trickster", name: { fr: "Omniprésence", en: "Versatile Trickster" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "assassin", name: { fr: "Assassin", en: "Assassin" },
        features: [
          { level: 3, id: "assassinate", combat: true, name: { fr: "Assassinat", en: "Assassinate" },
            description: "Avantage aux jets d'Initiative. Au premier round de chaque combat, Avantage aux jets d'attaque contre toute créature qui n'a pas encore joué ; si votre Attaque sournoise touche pendant ce round, la cible subit des dégâts supplémentaires égaux à votre niveau de roublard.",
            effects: [
              { type: "advantage", target: "initiative", note: "Assassinat" },
              { type: "note", text: (c) => "Assassinat : premier round, Avantage contre qui n'a pas encore joué ; Attaque sournoise ce round-là : +" + lvl(c) + " dégâts." },
            ] },
          { level: 3, id: "assassins-tools", name: { fr: "Outils d'assassin", en: "Assassin's Tools" },
            description: "Vous obtenez des accessoires de déguisement et un matériel d'empoisonneur, et vous les maîtrisez.",
            effects: [{ type: "proficiency", target: "tool.disguise-kit" }, { type: "proficiency", target: "tool.poisoners-kit" }] },
          { level: 9, id: "infiltration-expertise", name: { fr: "Expertise en infiltration", en: "Infiltration Expertise" },
            description: "Mimétisme magistral : après une heure d'étude, vous imitez parfaitement la voix et l'écriture d'une personne. Visée mobile : Visée appliquée ne réduit plus votre Vitesse à 0." },
          { level: 13, id: "envenom-weapons", name: { fr: "Armes envenimées", en: "Envenom Weapons" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "thief", name: { fr: "Voleur", en: "Thief" },
        features: [
          { level: 3, id: "fast-hands", name: { fr: "Mains lestes", en: "Fast Hands" },
            description: "Action bonus : test de Dextérité (Escamotage) pour crocheter une serrure, désamorcer un piège ou faire les poches ; ou action Utilisation, ou action Magie pour un objet magique qui la demande.",
            effects: [{ type: "action", name: { fr: "Mains lestes", en: "Fast Hands" }, actionType: "bonus",
              description: "Escamotage (serrure, piège, poches), action Utilisation ou action Magie d'un objet magique." }] },
          { level: 3, id: "second-story-work", name: { fr: "Monte-en-l'air", en: "Second-Story Work" },
            description: "Vitesse d'escalade égale à votre Vitesse. Vous pouvez calculer votre distance de saut avec la Dextérité au lieu de la Force.",
            effects: [{ type: "speed", mode: "climb", value: "walk" }] },
          { level: 9, id: "supreme-sneak", name: { fr: "Furtivité suprême", en: "Supreme Sneak" },
            description: "Nouvelle option de Frappe malicieuse. Attaque furtive (1d6) : si vous êtes Invisible grâce à l'action Furtivité, cette attaque ne met pas fin à l'état si vous finissez le tour derrière un abri important ou total." },
          { level: 13, id: "use-magic-device", name: { fr: "Utilisation d'objets magiques", en: "Use Magic Device" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absente d'AideDD (« Voir le Manuel des Joueurs ») : saisie de mémoire, noms et valeurs à vérifier dans le livre.
        id: "soulknife", name: { fr: "Âme acérée", en: "Soulknife" }, source: "PHB 2024",
        features: [
          { level: 3, id: "psionic-power", name: { fr: "Pouvoir psionique", en: "Psionic Power" },
            description: (c) => "Dés d'énergie psionique : " + DND.byLevel({ 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, lvl(c)) + " " + psiDie(c) +
              ". Un dé récupéré au repos court, tous au repos long. Appui psionique : test raté avec une compétence ou un outil maîtrisé, ajoutez un dé (dépensé seulement si le test réussit). Murmures psychiques : action Magie, télépathie avec jusqu'à votre bonus de maîtrise créatures, pendant un nombre d'heures égal au jet d'un dé (la première fois gratuite chaque repos long). (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "psionicDice", name: { fr: "Dés d'énergie psionique", en: "Psionic Energy Dice" },
                max: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, recharge: "long", shortRegain: 1,
                description: (c) => "Dés d'énergie psionique : " + psiDie(c) + "." },
              { type: "action", name: { fr: "Appui psionique", en: "Psi-Bolstered Knack" }, actionType: "free", ...psi,
                description: (c) => "Test raté avec compétence ou outil maîtrisé : +1" + psiDie(c) + " (dé dépensé seulement si le test réussit)." },
              { type: "action", name: { fr: "Murmures psychiques", en: "Psychic Whispers" }, actionType: "action", ...psi,
                description: (c) => "Télépathie avec " + c.pb + " créatures pendant 1" + psiDie(c) + " heures (première utilisation gratuite par repos long)." },
            ] },
          { level: 3, id: "psychic-blades", combat: true, name: { fr: "Lames psychiques", en: "Psychic Blades" },
            description: "Quand vous prenez l'action Attaque ou faites une attaque d'opportunité, vous pouvez créer une lame psychique : arme courante de corps à corps, Finesse, Lancer (18 m), 1d6 psychiques + modificateur, botte Vexation. Juste après, une seconde lame en action bonus (1d4). (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "note", text: (c) => { const m = Math.max(c.mod.str, c.mod.dex);
              return "Lames psychiques : " + sg(c.pb + m) + " au toucher (Finesse, lancer 18 m), 1d6 " + sg(m) + " psychiques, botte Vexation ; seconde lame en action bonus 1d4 " + sg(m) + "."; } }] },
          { level: 9, id: "soul-blades", name: { fr: "Lames de l'âme", en: "Soul Blades" },
            description: "Frappes guidées : une attaque avec une lame psychique rate, lancez un dé psionique et ajoutez-le (dépensé seulement si elle touche). Téléportation psychique : action bonus, un dé psionique, lancez une lame et téléportez-vous jusqu'à 10 × le résultat en pieds (3 m par point). (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "action", name: { fr: "Frappes guidées", en: "Homing Strikes" }, actionType: "free", ...psi,
                description: (c) => "Attaque de lame psychique ratée : +1" + psiDie(c) + " au jet (dé dépensé si elle touche)." },
              { type: "action", name: { fr: "Téléportation psychique", en: "Psychic Teleportation" }, actionType: "bonus", ...psi,
                description: (c) => "Lancez 1" + psiDie(c) + " : téléportation de 3 m par point obtenu." },
            ] },
          { level: 13, id: "psychic-veil", name: { fr: "Voile psychique", en: "Psychic Veil" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
