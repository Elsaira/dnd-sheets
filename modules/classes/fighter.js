// Classe : Guerrier (Fighter) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/guerrier), relevés le 2026-10-15.
// Journal de la classe : classes/guerrier.md
(function () {
  const lvl = (c) => c.classLevel("fighter");
  const fighterSkills = ["acrobatics", "animal-handling", "athletics", "history", "insight", "intimidation", "persuasion", "perception", "survival"];
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin", "fighting-style"] } }] });
  const fightingStyle = (id, label) => ({ type: "choice", id, label, from: "feats", filter: { category: "fighting-style" } });

  // --- Manœuvres du Maître de guerre (AideDD) ---
  // DD des manœuvres : 8 + bonus de maîtrise + Force ou Dextérité (la meilleure)
  const maneuverDC = (c) => 8 + c.pb + Math.max(c.mod.str, c.mod.dex);
  const die = (c) => (lvl(c) >= 18 ? "d12" : lvl(c) >= 10 ? "d10" : "d8");
  const M = (id, fr, en, actionType, text) => ({ id, name: { fr, en }, description: text,
    effects: [{ type: "action", name: { fr, en }, actionType, resource: "superiorityDice",
      description: (c) => "Dé de supériorité (" + die(c) + "). " + text.replace(/\{DD\}/g, "DD " + maneuverDC(c)) }] });
  registerList("fighter-maneuvers", [
    M("menacing-attack", "Attaque menaçante", "Menacing Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; JS de Sagesse {DD} ou la cible est Effrayée jusqu'à la fin de votre prochain tour."),
    M("precision-attack", "Attaque précise", "Precision Attack", "free", "Après un jet d'attaque raté : ajoutez le dé au jet, ce qui peut le faire toucher."),
    M("commanding-presence", "Autorité naturelle", "Commanding Presence", "free", "Ajoutez le dé à un test de Charisme (Intimidation, Représentation ou Persuasion)."),
    M("sweeping-attack", "Balayage", "Sweeping Attack", "free", "Après avoir touché au corps à corps : une autre créature à 1,5 m de la cible et à votre allonge subit le dé en dégâts si l'attaque l'aurait touchée."),
    M("pushing-attack", "Bélier", "Pushing Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; une cible G ou plus petite fait un JS de Force {DD} ou est repoussée de 4,5 m."),
    M("bait-and-switch", "Chassé-croisé", "Bait and Switch", "free", "Échangez votre place avec une créature consentante à 1,5 m (sans attaque d'opportunité) ; vous ou elle gagnez le dé en bonus de CA jusqu'au début de votre prochain tour."),
    M("trip-attack", "Croc-en-jambe", "Trip Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; une cible G ou plus petite fait un JS de Force {DD} ou tombe À terre."),
    M("disarming-attack", "Désarmement", "Disarming Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; JS de Force {DD} ou la cible lâche un objet de votre choix."),
    M("distracting-strike", "Diversion", "Distracting Strike", "free", "Après avoir touché : ajoutez le dé aux dégâts ; la prochaine attaque d'un autre que vous contre la cible a l'Avantage (avant votre prochain tour)."),
    M("ambush", "Embuscade", "Ambush", "free", "Ajoutez le dé à un test de Dextérité (Discrétion) ou à l'Initiative."),
    M("tactical-assessment", "Évaluation tactique", "Tactical Assessment", "free", "Ajoutez le dé à un test d'Intelligence (Histoire ou Investigation) ou de Sagesse (Intuition)."),
    M("feinting-attack", "Feinte", "Feinting Attack", "bonus", "Contre une créature à 1,5 m : Avantage à votre prochaine attaque contre elle ce tour-ci ; si elle touche, ajoutez le dé aux dégâts."),
    M("lunging-attack", "Fente", "Lunging Attack", "bonus", "Prenez l'action Pointe ; si vous avancez de 1,5 m en ligne droite juste avant une attaque au corps à corps ce tour-ci, ajoutez le dé aux dégâts."),
    M("commanders-strike", "Instruction", "Commander's Strike", "free", "Remplacez une de vos attaques : un allié qui vous voit ou vous entend attaque avec sa Réaction et ajoute le dé aux dégâts."),
    M("evasive-footwork", "Jeu de jambes défensif", "Evasive Footwork", "bonus", "Prenez l'action Désengagement et ajoutez le dé à votre CA jusqu'au début de votre prochain tour."),
    M("maneuvering-attack", "Manœuvre tactique", "Maneuvering Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; un allié peut se déplacer de la moitié de sa Vitesse par sa Réaction sans attaque d'opportunité de la cible."),
    M("parry", "Parade", "Parry", "reaction", "Quand une attaque au corps à corps vous inflige des dégâts : réduisez-les du dé + votre modificateur de Force ou de Dextérité."),
    M("goading-attack", "Provocation", "Goading Attack", "free", "Après avoir touché : ajoutez le dé aux dégâts ; JS de Sagesse {DD} ou la cible a le Désavantage contre les autres que vous jusqu'à la fin de votre prochain tour."),
    M("rally", "Regain", "Rally", "bonus", "Un allié à 9 m qui vous voit ou vous entend gagne le dé + la moitié de votre niveau de guerrier en PV temporaires."),
    M("riposte", "Riposte", "Riposte", "reaction", "Quand une créature vous rate au corps à corps : attaquez-la au corps à corps ; si vous touchez, ajoutez le dé aux dégâts."),
  ]);

  // --- Soldat psi : dés d'énergie psionique (saisi de mémoire, à vérifier dans le Manuel des joueurs) ---
  const psiDie = (c) => (lvl(c) >= 17 ? "d12" : lvl(c) >= 11 ? "d10" : lvl(c) >= 5 ? "d8" : "d6");
  const intMod = (c) => Math.max(1, c.mod.int);

  registerModule({
    kind: "class", id: "fighter",
    name: { fr: "Guerrier", en: "Fighter" },
    color: "#7a2e22", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 10,
    savingThrows: ["str", "con"],
    subclassLevel: 3,
    multiclassRequirement: [["str"], ["dex"]],
    proficiencies: { armor: ["light", "medium", "heavy", "shield"], weapons: ["simple", "martial"],
      skills: { choose: 2, from: fighterSkills } },
    multiclassProficiencies: { armor: ["light", "medium", "shield"], weapons: ["martial"] },
    features: [
      { level: 1, id: "fighting-style", name: { fr: "Style de combat", en: "Fighting Style" },
        description: "Un don de Style de combat de votre choix (Défense est recommandé). À chaque niveau de guerrier, vous pouvez le remplacer par un autre.",
        effects: [fightingStyle("fightingStyle", "Style de combat")] },
      { level: 1, id: "second-wind", name: { fr: "Second souffle", en: "Second Wind" },
        description: "Action bonus : regagnez 1d10 + votre niveau de guerrier en PV. 2 utilisations (3 au niveau 4, 4 au niveau 10) ; une utilisation récupérée au repos court, toutes au repos long.",
        effects: [
          { type: "resource", id: "secondWind", name: { fr: "Second souffle", en: "Second Wind" }, max: { 1: 2, 4: 3, 10: 4 }, recharge: "long", shortRegain: 1,
            description: "Action bonus : 1d10 + niveau de guerrier PV." },
          { type: "action", name: { fr: "Second souffle", en: "Second Wind" }, actionType: "bonus", resource: "secondWind",
            description: (c) => "Regagnez 1d10 + " + lvl(c) + " PV." + (lvl(c) >= 5 ? " Décalage tactique : déplacez-vous ensuite de la moitié de votre Vitesse sans provoquer d'attaque d'opportunité." : "") },
        ] },
      { level: 1, id: "weapon-mastery", combat: (c) => DND.masteryLines(((c.character.classes.find((x) => x.id === "fighter") || {}).choices || {}).masteries, c), name: { fr: "Bottes d'arme", en: "Weapon Mastery" },
        description: "Vous utilisez la botte de trois types d'armes courantes ou de guerre (4 au niveau 4, 5 au niveau 10, 6 au niveau 16). Après un repos long, vous pouvez en changer une.",
        effects: [{ type: "choice", id: "masteries", label: "Bottes d'arme", from: "weapons", count: { 1: 3, 4: 4, 10: 5, 16: 6 },
          grant: { type: "proficiency", target: "mastery.{value}" },
          help: "La botte s'affiche sur l'attaque de l'arme dans l'onglet Combat." }] },
      { level: 2, id: "action-surge", name: { fr: "Fougue", en: "Action Surge" },
        description: "À votre tour, vous pouvez prendre une action supplémentaire (sauf l'action Magie). Une fois par repos court ou long ; deux fois à partir du niveau 17 (une seule par tour).",
        effects: [
          { type: "resource", id: "actionSurge", name: { fr: "Fougue", en: "Action Surge" }, max: { 2: 1, 17: 2 }, recharge: "short",
            description: "Une action supplémentaire (pas l'action Magie)." },
          { type: "action", name: { fr: "Fougue", en: "Action Surge" }, actionType: "free", resource: "actionSurge",
            description: "Prenez une action supplémentaire ce tour-ci, sauf l'action Magie." },
        ] },
      { level: 2, id: "tactical-mind", name: { fr: "Sens tactique", en: "Tactical Mind" },
        description: "En cas d'échec à un test de caractéristique, vous pouvez dépenser un Second souffle : lancez 1d10 et ajoutez-le au test. Si le test échoue quand même, l'utilisation n'est pas dépensée.",
        effects: [{ type: "action", name: { fr: "Sens tactique", en: "Tactical Mind" }, actionType: "free", resource: "secondWind",
          description: "Test de caractéristique raté : +1d10 en dépensant un Second souffle (rendu si le test échoue encore)." }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de guerrier", en: "Fighter Subclass" },
        description: "Choisissez votre sous-classe dans la partie Création." },
      asi(4),
      { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
        description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
        effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
      { level: 5, id: "tactical-shift", name: { fr: "Décalage tactique", en: "Tactical Shift" },
        description: "Quand vous activez Second souffle par une action bonus, vous pouvez vous déplacer de la moitié de votre Vitesse sans provoquer d'attaques d'opportunité." },
      asi(6),
      asi(8),
      { level: 9, id: "indomitable", name: { fr: "Inflexible", en: "Indomitable" },
        description: (c) => "Si vous ratez un jet de sauvegarde, relancez-le avec un bonus de +" + lvl(c) + " (votre niveau de guerrier) ; vous devez garder le nouveau jet. Une fois par repos long (deux au niveau 13, trois au niveau 17).",
        effects: [
          { type: "resource", id: "indomitable", name: { fr: "Inflexible", en: "Indomitable" }, max: { 9: 1, 13: 2, 17: 3 }, recharge: "long",
            description: "Relancer un JS raté avec un bonus égal au niveau de guerrier." },
          { type: "action", name: { fr: "Inflexible", en: "Indomitable" }, actionType: "free", resource: "indomitable",
            description: (c) => "JS raté : relancez-le avec +" + lvl(c) + " et gardez le nouveau résultat." },
        ] },
      { level: 9, id: "tactical-master", combat: true, name: { fr: "Botte tactique", en: "Tactical Master" },
        description: "Quand vous attaquez avec une arme dont vous utilisez la botte, vous pouvez la remplacer par Poussée, Sape ou Ralentissement pour cette attaque.",
        effects: [{ type: "note", text: "Botte tactique : remplacez la botte de l'arme par Poussée, Sape ou Ralentissement." }] },
      { level: 11, id: "two-extra-attacks", name: { fr: "Double attaque supplémentaire", en: "Two Extra Attacks" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "champion", name: { fr: "Champion", en: "Champion" },
        features: [
          { level: 3, id: "improved-critical", combat: true, name: { fr: "Critique amélioré", en: "Improved Critical" },
            description: "Vos jets d'attaque avec des armes et vos Frappes à mains nues obtiennent un Coup critique sur 19 ou 20.",
            effects: [{ type: "note", text: "Critique amélioré : coup critique sur 19 ou 20 (armes et mains nues)." }] },
          { level: 3, id: "remarkable-athlete", combat: true, name: { fr: "Athlète accompli", en: "Remarkable Athlete" },
            description: "Avantage aux jets d'Initiative et de Force (Athlétisme). Juste après un Coup critique, vous pouvez vous déplacer de la moitié de votre Vitesse sans provoquer d'attaques d'opportunité.",
            effects: [
              { type: "advantage", target: "initiative", note: "Athlète accompli" },
              { type: "advantage", target: "skill.athletics", note: "Athlète accompli" },
            ] },
          { level: 7, id: "additional-fighting-style", name: { fr: "Style de combat supplémentaire", en: "Additional Fighting Style" },
            description: "Vous gagnez un autre don de Style de combat de votre choix.",
            effects: [fightingStyle("fightingStyle2", "Style de combat supplémentaire")] },
          { level: 10, id: "heroic-warrior", combat: true, name: { fr: "Héros du champ d'honneur", en: "Heroic Warrior" },
            description: "Pendant un combat, vous pouvez vous octroyer l'Inspiration héroïque chaque fois que vous commencez votre tour sans en avoir.",
            effects: [{ type: "note", text: "Héros du champ d'honneur : en combat, cochez l'Inspiration héroïque au début de votre tour si vous ne l'avez pas." }] },
          { level: 15, id: "superior-critical", name: { fr: "Critique supérieur", en: "Superior Critical" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "eldritch-knight", name: { fr: "Chevalier occulte", en: "Eldritch Knight" },
        // Incantation de tiers : table propre quand c'est la seule classe à emplacements, sinon règle du multiclassage (niveau ÷ 3).
        spellcasting: {
          progression: "third", ability: "int", list: "wizard",
          cantrips: { 3: 2, 10: 3 },
          prepared: { 3: 3, 4: 4, 7: 5, 8: 6, 10: 7, 11: 8, 13: 9, 14: 10, 16: 11, 19: 12, 20: 13 },
          slotTable: { 3: [2], 4: [3], 7: [4, 2], 10: [4, 3], 13: [4, 3, 2], 16: [4, 3, 3], 19: [4, 3, 3, 1] },
        },
        features: [
          { level: 3, id: "eldritch-knight-spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
            description: "Sorts de magicien, Intelligence. Deux sorts mineurs (Rayon de givre et Poigne électrique recommandés), un de plus au niveau 10. Sorts préparés de magicien d'un niveau pour lequel vous avez des emplacements ; vous pouvez en changer un à chaque niveau de guerrier. Focaliseur arcanique possible." },
          { level: 3, id: "war-bond", name: { fr: "Arme occulte", en: "War Bond" },
            description: "Rituel d'une heure (possible pendant un repos court) qui vous lie à une arme, jusqu'à deux armes. Vous ne pouvez en être désarmé que si vous êtes Incapable d'agir, et vous pouvez invoquer une arme liée dans votre main par une action bonus si elle est sur le même plan.",
            effects: [{ type: "action", name: { fr: "Arme occulte", en: "War Bond" }, actionType: "bonus",
              description: "Une de vos armes liées se téléporte dans votre main (même plan d'existence)." }] },
          { level: 7, id: "war-magic", combat: true, name: { fr: "Magie de guerre", en: "War Magic" },
            description: "Quand vous prenez l'action Attaque, vous pouvez remplacer une des attaques par un sort mineur de magicien dont le temps d'incantation est d'une action.",
            effects: [{ type: "note", text: "Magie de guerre : une attaque de l'action Attaque peut être remplacée par un sort mineur de magicien (1 action)." }] },
          { level: 10, id: "eldritch-strike", combat: true, name: { fr: "Fragilisation occulte", en: "Eldritch Strike" },
            description: "Quand vous touchez une créature avec une arme, elle a le Désavantage à son prochain JS contre un de vos sorts avant la fin de votre prochain tour.",
            effects: [{ type: "note", text: "Fragilisation occulte : une créature touchée par votre arme a le Désavantage au prochain JS contre votre sort (avant la fin de votre prochain tour)." }] },
          { level: 15, id: "arcane-charge", name: { fr: "Charge arcanique", en: "Arcane Charge" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "battle-master", name: { fr: "Maître de guerre", en: "Battle Master" },
        features: [
          { level: 3, id: "student-of-war", name: { fr: "Disciple martial", en: "Student of War" },
            description: "Maîtrise d'un type d'outils d'artisan et d'une compétence parmi celles du guerrier.",
            effects: [
              { type: "choice", id: "artisanTool", label: "Outils d'artisan (Disciple martial)", from: "tools.artisan" },
              { type: "choice", id: "skill", label: "Compétence (Disciple martial)", from: fighterSkills.map((s) => "skill." + s) },
            ] },
          { level: 3, id: "combat-superiority", combat: true, name: { fr: "Supériorité martiale", en: "Combat Superiority" },
            description: (c) => "Manœuvres (3, puis 5 au niveau 7, 7 au niveau 10, 9 au niveau 15), une seule par attaque. Dés de supériorité : " +
              DND.byLevel({ 3: 4, 7: 5, 15: 6 }, lvl(c)) + " " + die(c) + ", récupérés au repos court ou long. DD des manœuvres : " + maneuverDC(c) + " (8 + maîtrise + Force ou Dextérité).",
            effects: [
              { type: "resource", id: "superiorityDice", name: { fr: "Dés de supériorité", en: "Superiority Dice" }, max: { 3: 4, 7: 5, 15: 6 }, recharge: "short",
                description: (c) => "Dés de supériorité : " + die(c) + "." },
              { type: "choice", id: "maneuvers", label: "Manœuvres", from: "list:fighter-maneuvers", count: { 3: 3, 7: 5, 10: 7, 15: 9 }, showChosen: true,
                help: "Chaque manœuvre choisie apparaît dans les actions de l'onglet Combat, avec votre DD." },
              { type: "note", text: (c) => "Dés de supériorité : " + die(c) + " ; DD des manœuvres " + maneuverDC(c) + "." },
            ] },
          { level: 7, id: "know-your-enemy", name: { fr: "Observation de l'ennemi", en: "Know Your Enemy" },
            description: "Action bonus : vous apprenez les immunités, résistances et vulnérabilités d'une créature visible à 9 m. Une fois par repos long, ou en dépensant un dé de supériorité.",
            effects: [
              { type: "resource", id: "knowYourEnemy", name: { fr: "Observation de l'ennemi", en: "Know Your Enemy" }, max: 1, recharge: "long",
                description: "Ou dépenser un dé de supériorité." },
              { type: "action", name: { fr: "Observation de l'ennemi", en: "Know Your Enemy" }, actionType: "bonus", resource: "knowYourEnemy",
                description: "Une créature visible à 9 m : vous apprenez ses immunités, résistances et vulnérabilités." },
            ] },
          { level: 10, id: "improved-combat-superiority", combat: true, name: { fr: "Supériorité martiale améliorée", en: "Improved Combat Superiority" },
            description: "Vos dés de supériorité deviennent des d10." },
          { level: 15, id: "relentless", name: { fr: "Implacable", en: "Relentless" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absent du texte d'AideDD (« Voir le Manuel des Joueurs ») : saisi de mémoire, noms et valeurs à vérifier dans le livre.
        id: "psi-warrior", name: { fr: "Soldat psi", en: "Psi Warrior" }, source: "PHB 2024",
        features: [
          { level: 3, id: "psionic-power", name: { fr: "Pouvoir psionique", en: "Psionic Power" },
            description: (c) => "Dés d'énergie psionique : " + DND.byLevel({ 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, lvl(c)) + " " + psiDie(c) +
              ". Un dé récupéré au repos court, tous au repos long. Champ protecteur, Frappe psionique et Mouvement télékinétique. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "psionicDice", name: { fr: "Dés d'énergie psionique", en: "Psionic Energy Dice" },
                max: { 3: 4, 5: 6, 9: 8, 13: 10, 17: 12 }, recharge: "long", shortRegain: 1,
                description: (c) => "Dés d'énergie psionique : " + psiDie(c) + "." },
              { type: "action", name: { fr: "Champ protecteur", en: "Protective Field" }, actionType: "reaction", resource: "psionicDice",
                description: (c) => "Vous ou une créature visible à 9 m subissez des dégâts : réduisez-les de 1" + psiDie(c) + " + " + intMod(c) + "." },
              { type: "action", name: { fr: "Frappe psionique", en: "Psionic Strike" }, actionType: "free", resource: "psionicDice",
                description: (c) => "Une fois par tour, après avoir touché une cible à 9 m avec une arme : +1" + psiDie(c) + " + " + intMod(c) + " dégâts de force." +
                  (lvl(c) >= 7 ? " Poussée télékinétique : JS de Force DD " + (8 + c.pb + c.mod.int) + " ou la cible tombe À terre ou est repoussée de 3 m." : "") },
              { type: "resource", id: "telekineticMovement", name: { fr: "Mouvement télékinétique", en: "Telekinetic Movement" }, max: 1, recharge: "short",
                description: "Ou dépenser un dé d'énergie psionique." },
              { type: "action", name: { fr: "Mouvement télékinétique", en: "Telekinetic Movement" }, actionType: "action", resource: "telekineticMovement",
                description: "Action Magie : déplacez de 9 m un objet ou une créature consentante de taille G ou plus petite, à 9 m de vous." },
            ] },
          { level: 7, id: "telekinetic-adept", name: { fr: "Adepte de la télékinésie", en: "Telekinetic Adept" },
            description: "Bond psionique : action bonus, Vitesse de vol égale au double de votre Vitesse jusqu'à la fin du tour (une fois par repos court, ou en dépensant un dé). Poussée télékinétique : la cible de votre Frappe psionique fait un JS de Force ou tombe À terre ou est repoussée de 3 m. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "psiLeap", name: { fr: "Bond psionique", en: "Psi-Powered Leap" }, max: 1, recharge: "short",
                description: "Ou dépenser un dé d'énergie psionique." },
              { type: "action", name: { fr: "Bond psionique", en: "Psi-Powered Leap" }, actionType: "bonus", resource: "psiLeap",
                description: "Vitesse de vol égale au double de votre Vitesse jusqu'à la fin du tour." },
            ] },
          { level: 10, id: "guarded-mind", combat: true, name: { fr: "Esprit protégé", en: "Guarded Mind" },
            description: "Résistance aux dégâts psychiques. Si vous commencez votre tour Charmé ou Effrayé, vous pouvez dépenser un dé d'énergie psionique pour mettre fin à ces états. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "resistance", damage: "psychic" },
              { type: "note", text: "Esprit protégé : début de tour Charmé ou Effrayé, dépensez un dé psionique pour y mettre fin." }] },
          { level: 15, id: "bulwark-of-force", name: { fr: "Rempart de force", en: "Bulwark of Force" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
