// Classe : Barbare (Barbarian) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/barbare), relevés le 2026-10-18.
// Voie du Zélateur : absente d'AideDD (« Voir le Manuel des Joueurs »), saisie de mémoire, à vérifier.
// Journal de la classe : classes/barbare.md
(function () {
  const lvl = (c) => c.classLevel("barbarian");
  const barbarianSkills = ["animal-handling", "athletics", "intimidation", "nature", "perception", "survival"];
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  // Armure portée (hors bouclier), pour Déplacement rapide
  const armorOf = (c) => {
    const it = c.character.inventory.find((i) => i.equipped && DND.data.armor[i.id] && DND.data.armor[i.id].category !== "shield");
    return it ? DND.data.armor[it.id] : null;
  };
  const noHeavyArmor = (c) => { const a = armorOf(c); return !a || a.category !== "heavy"; };
  const rageDamage = (c) => DND.byLevel({ 1: 2, 9: 3, 16: 4 }, lvl(c));
  const strDC = (c) => 8 + c.pb + c.mod.str;
  const rage = { resource: "rage" };

  registerModule({
    kind: "class", id: "barbarian",
    name: { fr: "Barbare", en: "Barbarian" },
    color: "#9c4a1a", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 12,
    savingThrows: ["str", "con"],
    subclassLevel: 3,
    multiclassRequirement: [["str"]],
    proficiencies: { armor: ["light", "medium", "shield"], weapons: ["simple", "martial"],
      skills: { choose: 2, from: barbarianSkills } },
    multiclassProficiencies: { armor: ["shield"], weapons: ["martial"] },
    features: [
      { level: 1, id: "rage", name: { fr: "Rage", en: "Rage" },
        description: (c) => "Action bonus, sans armure lourde. Pendant la Rage : Résistance aux dégâts contondants, perforants et tranchants ; +" + rageDamage(c) +
          " aux dégâts des attaques utilisant la Force (arme ou Frappe à mains nues) ; Avantage aux tests et JS de Force ; ni Concentration ni sorts. Dure jusqu'à la fin de votre prochain tour, prolongée si vous attaquez un ennemi, forcez un ennemi à faire un JS ou prenez une action bonus pour la prolonger (10 minutes au maximum). Fin si vous portez une armure lourde ou êtes Incapable d'agir. Une utilisation récupérée au repos court, toutes au repos long.",
        effects: [
          { type: "resource", id: "rage", name: { fr: "Rage", en: "Rage" }, max: { 1: 2, 3: 3, 6: 4, 12: 5, 17: 6 }, recharge: "long", shortRegain: 1,
            description: (c) => "Action bonus. Dégâts de Rage : +" + rageDamage(c) + "." },
          { type: "action", name: { fr: "Rage", en: "Rage" }, actionType: "bonus", ...rage,
            description: (c) => "Résistance contondant/perforant/tranchant, +" + rageDamage(c) + " aux dégâts des attaques de Force, Avantage aux tests et JS de Force ; ni sorts ni Concentration." +
              (lvl(c) >= 7 ? " Bond agressif : déplacez-vous de la moitié de votre Vitesse avec cette action bonus." : "") },
          { type: "note", text: (c) => "Dégâts de Rage : +" + rageDamage(c) + " aux attaques utilisant la Force tant que la Rage est active." },
        ] },
      { level: 1, id: "unarmored-defense", name: { fr: "Défense sans armure", en: "Unarmored Defense" },
        description: "Sans armure, votre CA de base est égale à 10 + vos modificateurs de Dextérité et de Constitution. Le bouclier reste utilisable.",
        effects: [{ type: "acFormula", label: "Défense sans armure", base: 10, abilities: ["dex", "con"] }] },
      { level: 1, id: "weapon-mastery", combat: (c) => DND.masteryLines(((c.character.classes.find((x) => x.id === "barbarian") || {}).choices || {}).masteries, c),
        name: { fr: "Bottes d'arme", en: "Weapon Mastery" },
        description: "Vous utilisez la botte de deux types d'armes courantes ou de guerre de corps à corps (3 au niveau 4, 4 au niveau 10). Après un repos long, vous pouvez en changer une.",
        effects: [{ type: "choice", id: "masteries", label: "Bottes d'arme", from: "weapons", count: { 1: 2, 4: 3, 10: 4 },
          grant: { type: "proficiency", target: "mastery.{value}" },
          help: "La botte s'affiche sur l'attaque de l'arme dans l'onglet Combat." }] },
      { level: 2, id: "danger-sense", name: { fr: "Sens du danger", en: "Danger Sense" },
        description: "Avantage aux jets de sauvegarde de Dextérité, sauf si vous êtes Incapable d'agir.",
        effects: [{ type: "advantage", target: "save.dex", note: "Sens du danger (sauf Incapable d'agir)" }] },
      { level: 2, id: "reckless-attack", name: { fr: "Témérité", en: "Reckless Attack" },
        description: "Lors de votre premier jet d'attaque du tour, vous pouvez attaquer de manière téméraire : Avantage aux jets d'attaque utilisant la Force jusqu'au début de votre prochain tour, mais les jets d'attaque contre vous ont aussi l'Avantage.",
        effects: [{ type: "action", name: { fr: "Témérité", en: "Reckless Attack" }, actionType: "free",
          description: (c) => "Premier jet d'attaque du tour : Avantage aux attaques de Force jusqu'au début de votre prochain tour ; les attaques contre vous ont l'Avantage." +
            (lvl(c) >= 9 ? " Coup brutal : renoncez à l'Avantage sur une attaque de Force pour +1d10 dégâts et un effet (voir Coup brutal)." : "") }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de barbare", en: "Barbarian Subclass" },
        description: "Choisissez votre voie dans la partie Création." },
      { level: 3, id: "primal-knowledge", name: { fr: "Savoir primal", en: "Primal Knowledge" },
        description: "Maîtrise d'une compétence supplémentaire parmi celles du barbare. Pendant votre Rage, vos tests d'Acrobaties, Intimidation, Perception, Discrétion et Survie peuvent être faits en Force.",
        effects: [
          { type: "choice", id: "primalSkill", label: "Compétence (Savoir primal)", from: barbarianSkills.map((s) => "skill." + s) },
          { type: "note", text: "Savoir primal : en Rage, Acrobaties, Intimidation, Perception, Discrétion et Survie peuvent se faire en Force." },
        ] },
      asi(4),
      { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
        description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
        effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
      { level: 5, id: "fast-movement", name: { fr: "Déplacement rapide", en: "Fast Movement" },
        description: "Votre Vitesse augmente de 3 mètres si vous ne portez pas d'armure lourde (calculé sur la fiche).",
        effects: [{ type: "bonus", target: "speed", value: 10, when: noHeavyArmor, label: "Déplacement rapide" }] },
      { level: 7, id: "feral-instinct", name: { fr: "Instinct sauvage", en: "Feral Instinct" },
        description: "Avantage aux jets d'initiative.",
        effects: [{ type: "advantage", target: "initiative", note: "Instinct sauvage" }] },
      { level: 7, id: "instinctive-pounce", name: { fr: "Bond agressif", en: "Instinctive Pounce" },
        description: "Avec l'action bonus qui active votre Rage, vous pouvez vous déplacer de la moitié de votre Vitesse." },
      asi(8),
      { level: 9, id: "brutal-strike", combat: true, name: { fr: "Coup brutal", en: "Brutal Strike" },
        description: "Si vous utilisez Témérité, vous pouvez renoncer à l'Avantage sur un jet d'attaque de Force de votre choix (sans Désavantage). S'il touche : +1d10 dégâts du type de l'arme et un effet. Coup appuyé : la cible est repoussée de 4,5 m, puis vous pouvez avancer vers elle de la moitié de votre Vitesse sans attaque d'opportunité. Coup au jarret : sa Vitesse diminue de 4,5 m jusqu'au début de votre prochain tour.",
        effects: [{ type: "note", text: "Coup brutal : avec Témérité, renoncez à l'Avantage sur une attaque de Force ; si elle touche, +1d10 dégâts et Coup appuyé (repoussée de 4,5 m) ou Coup au jarret (−4,5 m de Vitesse)." }] },
      { level: 11, id: "relentless-rage", name: { fr: "Rage implacable", en: "Relentless Rage" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "world-tree", name: { fr: "Voie de l'Arbre-Monde", en: "Path of the World Tree" },
        features: [
          { level: 3, id: "vitality-of-the-tree", combat: true, name: { fr: "Vitalité de l'arbre", en: "Vitality of the Tree" },
            description: "Sève cosmique : en activant votre Rage, vous gagnez des PV temporaires égaux à votre niveau de barbare. Force vivifiante : au début de chacun de vos tours en Rage, une autre créature à 3 m gagne des PV temporaires (autant de d6 que votre bonus de dégâts de Rage), perdus à la fin de la Rage.",
            effects: [{ type: "note", text: (c) => "Vitalité de l'arbre : en entrant en Rage, " + lvl(c) + " PV temporaires ; au début de vos tours en Rage, une autre créature à 3 m gagne " + rageDamage(c) + "d6 PV temporaires." }] },
          { level: 6, id: "branches-of-the-tree", name: { fr: "Branches de l'Arbre", en: "Branches of the Tree" },
            description: "En Rage, réaction quand une créature visible commence son tour à 9 m : JS de Force (DD 8 + Force + maîtrise) ou elle est téléportée dans un espace libre à 1,5 m de vous ; vous pouvez ensuite réduire sa Vitesse à 0 jusqu'à la fin du tour.",
            effects: [{ type: "action", name: { fr: "Branches de l'Arbre", en: "Branches of the Tree" }, actionType: "reaction",
              description: (c) => "En Rage : une créature visible commence son tour à 9 m ; JS de Force DD " + strDC(c) + " ou téléportée à 1,5 m de vous, Vitesse 0 jusqu'à la fin du tour." }] },
          { level: 10, id: "battering-roots", combat: true, name: { fr: "Rosée de racines", en: "Battering Roots" },
            description: "À votre tour, votre allonge augmente de 3 m avec les armes de corps à corps Lourdes ou Polyvalentes. Quand vous touchez avec une telle arme à votre tour, vous pouvez activer la botte Poussée ou Renversement en plus d'une autre botte.",
            effects: [{ type: "note", text: "Rosée de racines : +3 m d'allonge à votre tour avec une arme Lourde ou Polyvalente ; en touchant, Poussée ou Renversement en plus de l'autre botte." }] },
          { level: 14, id: "travel-along-the-tree", name: { fr: "Voyage au gré de l'arbre", en: "Travel along the Tree" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "berserker", name: { fr: "Voie du Berserker", en: "Path of the Berserker" },
        features: [
          { level: 3, id: "frenzy", combat: true, name: { fr: "Frénésie", en: "Frenzy" },
            description: "Si vous utilisez Témérité pendant votre Rage, la première cible que vous touchez à votre tour avec une attaque de Force subit des dégâts supplémentaires : autant de d6 que votre bonus de dégâts de Rage, du type de l'arme ou de la Frappe à mains nues.",
            effects: [{ type: "note", text: (c) => "Frénésie : en Rage avec Témérité, +" + rageDamage(c) + "d6 dégâts à la première cible touchée à votre tour (attaque de Force)." }] },
          { level: 6, id: "mindless-rage", combat: true, name: { fr: "Rage aveugle", en: "Mindless Rage" },
            description: "Immunité aux états Charmé et Effrayé pendant votre Rage. Si vous êtes charmé ou effrayé en entrant en Rage, l'état prend fin.",
            effects: [{ type: "immunity", condition: "charmed", note: "Rage aveugle, pendant la Rage" }, { type: "immunity", condition: "frightened", note: "Rage aveugle, pendant la Rage" },
              { type: "note", text: "Rage aveugle : immunisé contre Charmé et Effrayé pendant la Rage (l'état prend fin en entrant en Rage)." }] },
          { level: 10, id: "retaliation", name: { fr: "Représailles", en: "Retaliation" },
            description: "Quand une créature à 1,5 m vous inflige des dégâts, vous pouvez prendre une réaction pour l'attaquer au corps à corps (arme ou Frappe à mains nues).",
            effects: [{ type: "action", name: { fr: "Représailles", en: "Retaliation" }, actionType: "reaction",
              description: "Une créature à 1,5 m vous inflige des dégâts : attaque au corps à corps contre elle." }] },
          { level: 14, id: "intimidating-presence", name: { fr: "Présence intimidante", en: "Intimidating Presence" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "wild-heart", name: { fr: "Voie du Cœur sauvage", en: "Path of the Wild Heart" },
        features: [
          { level: 3, id: "animal-speaker", name: { fr: "Orateur animal", en: "Animal Speaker" },
            description: "Vous pouvez lancer Perception bestiale et Communication avec les animaux, seulement comme rituels. La Sagesse est votre caractéristique d'incantation pour ces sorts.",
            effects: [
              { type: "spell", spell: "beast-sense", ability: "wis" },
              { type: "spell", spell: "speak-with-animals", ability: "wis" },
              { type: "note", text: "Orateur animal : Perception bestiale et Communication avec les animaux seulement en rituel." },
            ] },
          { level: 3, id: "rage-of-the-wild", combat: true, name: { fr: "Rage du prédateur", en: "Rage of the Wild" },
            description: "En activant votre Rage, choisissez une option. Ours : Résistance à tous les dégâts sauf force, nécrotiques, psychiques et radiants. Aigle : prenez les actions Désengagement et Pointe avec l'action bonus de la Rage, puis par une action bonus tant que la Rage dure. Loup : vos alliés ont l'Avantage aux jets d'attaque contre les ennemis à 1,5 m de vous.",
            effects: [{ type: "note", text: "Rage du prédateur (à choisir en entrant en Rage) : Ours (Résistance à tout sauf force, nécrotique, psychique, radiant) ; Aigle (Désengagement + Pointe en action bonus) ; Loup (alliés avec Avantage contre les ennemis à 1,5 m de vous)." }] },
          { level: 6, id: "aspect-of-the-wilds", name: { fr: "Aspect de faune", en: "Aspect of the Wilds" },
            description: "Une option au choix, modifiable après chaque repos long. Chouette : Vision dans le noir 18 m (ou +18 m si vous l'avez déjà). Panthère : Vitesse d'escalade égale à votre Vitesse. Saumon : Vitesse de nage égale à votre Vitesse.",
            effects: [{ type: "choice", id: "aspect", label: "Aspect de faune", from: [
              { id: "owl", name: { fr: "Chouette", en: "Owl" }, description: "Vision dans le noir 18 m (ou +18 m si vous l'avez déjà : corrigez dans Options si besoin).",
                effects: [{ type: "sense", sense: "darkvision", range: 60 }] },
              { id: "panther", name: { fr: "Panthère", en: "Panther" }, description: "Vitesse d'escalade égale à votre Vitesse.",
                effects: [{ type: "speed", mode: "climb", value: "walk" }] },
              { id: "salmon", name: { fr: "Saumon", en: "Salmon" }, description: "Vitesse de nage égale à votre Vitesse.",
                effects: [{ type: "speed", mode: "swim", value: "walk" }] },
            ] }] },
          { level: 10, id: "nature-speaker", name: { fr: "Orateur de la nature", en: "Nature Speaker" },
            description: "Vous pouvez lancer Communion avec la nature, seulement comme rituel. La Sagesse est votre caractéristique d'incantation pour ce sort.",
            effects: [{ type: "spell", spell: "commune-with-nature", ability: "wis" }] },
          { level: 14, id: "power-of-the-wilds", name: { fr: "Puissance de la faune", en: "Power of the Wilds" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absente d'AideDD (« Voir le Manuel des Joueurs ») : saisie de mémoire, noms et valeurs à vérifier dans le livre.
        id: "zealot", name: { fr: "Voie du Zélateur", en: "Path of the Zealot" }, source: "PHB 2024",
        features: [
          { level: 3, id: "divine-fury", combat: true, name: { fr: "Fureur divine", en: "Divine Fury" },
            description: "En Rage, la première créature que vous touchez à chacun de vos tours avec une arme ou une Frappe à mains nues subit 1d6 + la moitié de votre niveau de barbare en dégâts supplémentaires nécrotiques ou radiants (au choix). (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "note", text: (c) => "Fureur divine : en Rage, première cible touchée à votre tour : +1d6 + " + Math.floor(lvl(c) / 2) + " dégâts nécrotiques ou radiants." }] },
          { level: 3, id: "warrior-of-the-gods", name: { fr: "Guerrier des dieux", en: "Warrior of the Gods" },
            description: "Réserve de d12 (4, puis 5 au niveau 6, 6 au niveau 12, 7 au niveau 17), récupérée au repos long. Action bonus : dépensez des dés de la réserve, lancez-les et regagnez autant de PV. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "warriorOfTheGods", name: { fr: "Guerrier des dieux (d12)", en: "Warrior of the Gods" }, max: { 3: 4, 6: 5, 12: 6, 17: 7 }, recharge: "long",
                description: "Dés de soin (d12)." },
              { type: "action", name: { fr: "Guerrier des dieux", en: "Warrior of the Gods" }, actionType: "bonus", resource: "warriorOfTheGods",
                description: "Dépensez des d12 de la réserve : regagnez le total en PV." },
            ] },
          { level: 6, id: "fanatical-focus", name: { fr: "Concentration fanatique", en: "Fanatical Focus" },
            description: "Une fois par Rage, si vous ratez un jet de sauvegarde, vous pouvez le relancer avec un bonus égal à vos dégâts de Rage ; vous gardez le nouveau jet. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Concentration fanatique", en: "Fanatical Focus" }, actionType: "free",
              description: (c) => "Une fois par Rage : relancez un JS raté avec +" + rageDamage(c) + "." }] },
          { level: 10, id: "zealous-presence", name: { fr: "Présence zélée", en: "Zealous Presence" },
            description: "Action bonus : jusqu'à dix autres créatures de votre choix à 18 m ont l'Avantage aux jets d'attaque et de sauvegarde jusqu'au début de votre prochain tour. Une fois par repos long, ou en dépensant une utilisation de Rage. (Saisi de mémoire, à vérifier.)",
            effects: [
              { type: "resource", id: "zealousPresence", name: { fr: "Présence zélée", en: "Zealous Presence" }, max: 1, recharge: "long",
                description: "Ou dépenser une utilisation de Rage." },
              { type: "action", name: { fr: "Présence zélée", en: "Zealous Presence" }, actionType: "bonus", resource: "zealousPresence",
                description: "Jusqu'à 10 créatures à 18 m : Avantage aux jets d'attaque et de sauvegarde jusqu'au début de votre prochain tour." },
            ] },
          { level: 14, id: "rage-of-the-gods", name: { fr: "Rage des dieux", en: "Rage of the Gods" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
