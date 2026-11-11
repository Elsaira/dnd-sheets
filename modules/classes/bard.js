// Classe : Barde (Bard) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/barde), relevés le 2026-10-18 (les 4 collèges y sont).
// Journal de la classe : classes/barde.md
(function () {
  const lvl = (c) => c.classLevel("bard");
  const cha = "cha";
  const DC = (c) => 8 + c.pb + c.mod.cha;
  const chaMin1 = (c) => Math.max(1, c.mod.cha);
  const die = (c) => DND.byLevel({ 1: "d6", 5: "d8", 10: "d10", 15: "d12" }, lvl(c));
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const bi = { resource: "bardicInspiration" };
  // Ni armure ni bouclier (Pirouettes éblouissantes)
  const unarmored = (c) => !c.character.inventory.some((i) => i.equipped && DND.data.armor[i.id]);
  // Touche-à-tout : moitié du bonus de maîtrise aux compétences non maîtrisées
  const jackOfAllTrades = Object.keys(DND.data.skills).map((id) => ({ type: "bonus", target: "skill." + id, label: "Touche-à-tout",
    value: (c) => (c.prof && c.prof["skill." + id] ? 0 : Math.floor(c.pb / 2)) }));

  registerModule({
    kind: "class", id: "bard",
    name: { fr: "Barde", en: "Bard" },
    color: "#a8326e", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 8,
    savingThrows: ["dex", "cha"],
    subclassLevel: 3,
    multiclassRequirement: [["cha"]],
    proficiencies: { armor: ["light"], weapons: ["simple"], skills: { choose: 3, from: "any" } },
    multiclassProficiencies: { armor: ["light"], skills: { choose: 1, from: "any" } },
    spellcasting: {
      progression: "full", ability: cha, list: "bard",
      cantrips: { 1: 2, 4: 3, 10: 4 },
      prepared: { 1: 4, 2: 5, 3: 6, 4: 7, 5: 9, 6: 10, 7: 11, 8: 12, 9: 14, 10: 15, 11: 16, 13: 17, 15: 18, 17: 19, 18: 20, 19: 21, 20: 22 },
    },
    features: [
      { level: 1, id: "instruments", name: { fr: "Instruments de musique", en: "Musical Instruments" },
        description: "Maîtrise de trois instruments de musique (un seul si le barde est pris en multiclasse).",
        effects: [{ type: "choice", id: "instruments", label: "Instruments de musique", from: "tools.musical", count: 3, min: 1 }] },
      { level: 1, id: "bardic-inspiration", name: { fr: "Inspiration bardique", en: "Bardic Inspiration" },
        description: (c) => "Action bonus : une créature à 18 m qui vous voit ou vous entend gagne un dé d'Inspiration bardique (" + die(c) +
          "). Dans l'heure, si elle rate un jet de d20, elle peut lancer le dé et l'ajouter. Une créature n'a qu'un dé à la fois. Utilisations égales à votre modificateur de Charisme (minimum 1), récupérées au repos long (au repos court aussi à partir du niveau 5).",
        effects: [
          { type: "resource", id: "bardicInspiration", name: { fr: "Inspiration bardique", en: "Bardic Inspiration" }, max: chaMin1, recharge: { 1: "long", 5: "short" },
            description: (c) => "Dé d'Inspiration bardique : " + die(c) + "." + (lvl(c) >= 5 ? " Source d'inspiration : dépensez un emplacement de sort pour récupérer une utilisation." : "") },
          { type: "action", name: { fr: "Inspiration bardique", en: "Bardic Inspiration" }, actionType: "bonus", ...bi,
            description: (c) => "Une créature à 18 m qui vous voit ou vous entend gagne un " + die(c) + " à ajouter à un jet de d20 raté dans l'heure." },
        ] },
      { level: 1, id: "spellcasting", name: { fr: "Sorts", en: "Spellcasting" },
        description: "Incantation basée sur le Charisme, instrument de musique comme focaliseur. À chaque niveau de barde, vous pouvez remplacer un sort mineur et un sort préparé. Les sorts toujours préparés (collège) ne comptent pas." },
      { level: 2, id: "expertise", name: { fr: "Expertise", en: "Expertise" },
        description: "Expertise dans deux compétences que vous maîtrisez (Représentation et Persuasion recommandées), deux autres au niveau 9.",
        effects: [{ type: "choice", id: "expertise", label: "Expertise (compétences maîtrisées)", from: "skills", count: { 2: 2, 9: 4 },
          grant: { type: "proficiency", target: "{value}", expertise: true } }] },
      { level: 2, id: "jack-of-all-trades", name: { fr: "Touche-à-tout", en: "Jack of All Trades" },
        description: "Vous ajoutez la moitié de votre bonus de maîtrise (arrondie à l'inférieur) aux tests de compétences que vous ne maîtrisez pas (calculé dans les compétences).",
        effects: jackOfAllTrades },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de barde", en: "Bard Subclass" },
        description: "Choisissez votre collège dans la partie Création." },
      asi(4),
      { level: 5, id: "font-of-inspiration", name: { fr: "Source d'inspiration", en: "Font of Inspiration" },
        description: "Vous récupérez toutes vos utilisations d'Inspiration bardique au repos court. Vous pouvez aussi dépenser un emplacement de sort (sans action) pour récupérer une utilisation.",
        effects: [{ type: "action", name: { fr: "Source d'inspiration", en: "Font of Inspiration" }, actionType: "free",
          description: "Dépensez un emplacement de sort : récupérez une utilisation d'Inspiration bardique (rendez-la avec les pastilles)." }] },
      { level: 7, id: "countercharm", name: { fr: "Contre-charme", en: "Countercharm" },
        description: "Si vous ou une créature à 9 m ratez un JS contre un effet qui impose Charmé ou Effrayé, vous pouvez prendre une réaction pour faire relancer le JS avec l'Avantage.",
        effects: [{ type: "action", name: { fr: "Contre-charme", en: "Countercharm" }, actionType: "reaction",
          description: "Vous ou une créature à 9 m ratez un JS contre Charmé ou Effrayé : relance avec Avantage." }] },
      asi(8),
      { level: 10, id: "magical-secrets", name: { fr: "Secrets magiques", en: "Magical Secrets" },
        description: "Vos nouveaux sorts préparés peuvent venir des listes de barde, de clerc, de druide ou de magicien ; ils comptent comme des sorts de barde. Le menu « Ajouter un sort » propose ces quatre listes.",
        effects: [{ type: "extraSpellList", lists: ["cleric", "druid", "wizard"] }] },
      { level: 18, id: "superior-inspiration", name: { fr: "Inspiration supérieure", en: "Superior Inspiration" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "dance", name: { fr: "Collège de la Danse", en: "College of Dance" },
        features: [
          { level: 3, id: "dazzling-footwork", combat: true, name: { fr: "Pirouettes éblouissantes", en: "Dazzling Footwork" },
            description: "Sans armure ni bouclier : Avantage aux tests de Charisme (Représentation) en dansant ; CA de base 10 + Dextérité + Charisme ; quand vous dépensez une Inspiration bardique dans une action, action bonus ou réaction, vous pouvez y ajouter une Frappe à mains nues ; vos Frappes à mains nues peuvent utiliser la Dextérité et infliger votre dé d'Inspiration bardique + Dextérité en dégâts contondants (sans dépenser le dé). Calculé sur la fiche.",
            effects: [
              { type: "acFormula", label: "Pirouettes éblouissantes", base: 10, abilities: ["dex", "cha"], noShield: true },
              { type: "unarmedStrike", die: (c) => "1" + die(c), abilities: ["dex"], when: unarmored, label: "Danse" },
              { type: "note", text: "Pirouettes éblouissantes : sans armure ni bouclier, Frappe à mains nues avec le dé d'Inspiration + DEX ; une Frappe à mains nues s'ajoute quand vous dépensez une Inspiration dans une action, action bonus ou réaction." },
            ] },
          { level: 6, id: "inspiring-movement", name: { fr: "Déplacement exaltant", en: "Inspiring Movement" },
            description: "Quand un ennemi visible termine son tour à 1,5 m de vous : réaction et une Inspiration bardique pour vous déplacer de la moitié de votre Vitesse ; un allié à 9 m peut aussi se déplacer de la moitié de sa Vitesse avec sa réaction. Aucune attaque d'opportunité.",
            effects: [{ type: "action", name: { fr: "Déplacement exaltant", en: "Inspiring Movement" }, actionType: "reaction", ...bi,
              description: "Un ennemi termine son tour à 1,5 m : vous et un allié à 9 m vous déplacez de la moitié de votre Vitesse, sans attaque d'opportunité." }] },
          { level: 6, id: "tandem-footwork", name: { fr: "Pirouettes coordonnées", en: "Tandem Footwork" },
            description: "En lançant l'Initiative (si vous n'êtes pas Incapable d'agir), dépensez une Inspiration bardique : vous et chaque allié à 9 m qui vous voit ou vous entend ajoutez le résultat du dé à l'Initiative.",
            effects: [{ type: "action", name: { fr: "Pirouettes coordonnées", en: "Tandem Footwork" }, actionType: "free", ...bi,
              description: (c) => "Jet d'Initiative : vous et vos alliés à 9 m ajoutez 1" + die(c) + " à l'Initiative." }] },
          { level: 14, id: "leading-evasion", name: { fr: "Esquive cavalière", en: "Leading Evasion" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "lore", name: { fr: "Collège du Savoir", en: "College of Lore" },
        features: [
          { level: 3, id: "bonus-proficiencies", name: { fr: "Maîtrises supplémentaires", en: "Bonus Proficiencies" },
            description: "Maîtrise de trois compétences de votre choix.",
            effects: [{ type: "choice", id: "loreSkills", label: "Compétences (Collège du Savoir)", from: "skills", count: 3 }] },
          { level: 3, id: "cutting-words", name: { fr: "Mots cinglants", en: "Cutting Words" },
            description: "Quand une créature visible à 18 m fait un jet de dégâts ou réussit un test de caractéristique ou un jet d'attaque, réaction et Inspiration bardique : soustrayez votre dé d'Inspiration bardique de son jet.",
            effects: [{ type: "action", name: { fr: "Mots cinglants", en: "Cutting Words" }, actionType: "reaction", ...bi,
              description: (c) => "Une créature à 18 m fait un jet de dégâts ou réussit un test ou une attaque : soustrayez 1" + die(c) + " de son jet." }] },
          { level: 6, id: "magical-discoveries", name: { fr: "Découvertes magiques", en: "Magical Discoveries" },
            description: "Deux sorts des listes de clerc, de druide ou de magicien, toujours préparés : sorts mineurs ou d'un niveau pour lequel vous avez des emplacements. À chaque niveau de barde, vous pouvez en remplacer un.",
            effects: [{ type: "choice", id: "discoveries", label: "Découvertes magiques (sorts mineurs ou d'un niveau que vous pouvez lancer)", count: 2,
              from: "spells", filter: { list: ["cleric", "druid", "wizard"] }, grant: { type: "spell", spell: "{value}", ability: cha } }] },
          { level: 14, id: "peerless-skill", name: { fr: "Compétence hors pair", en: "Peerless Skill" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "glamour", name: { fr: "Collège de la Séduction", en: "College of Glamour" },
        features: [
          { level: 3, id: "beguiling-magic", name: { fr: "Magie envoûtante", en: "Beguiling Magic" },
            description: "Charme-personne et Image miroir toujours préparés. Juste après avoir lancé un sort d'Enchantement ou d'Illusion avec un emplacement, une créature visible à 18 m fait un JS de Sagesse contre votre DD des sorts ou elle est Charmée ou Effrayée (au choix) pendant 1 minute (nouveau JS à la fin de chacun de ses tours). Une fois par repos long, ou en dépensant une Inspiration bardique.",
            effects: [
              { type: "spell", spell: "charm-person", ability: cha },
              { type: "spell", spell: "mirror-image", ability: cha },
              { type: "resource", id: "beguilingMagic", name: { fr: "Magie envoûtante", en: "Beguiling Magic" }, max: 1, recharge: "long",
                description: "Ou dépenser une Inspiration bardique." },
              { type: "action", name: { fr: "Magie envoûtante", en: "Beguiling Magic" }, actionType: "free", resource: "beguilingMagic",
                description: (c) => "Après un sort d'Enchantement ou d'Illusion avec emplacement : une créature à 18 m, JS de Sagesse DD " + DC(c) + " ou Charmée ou Effrayée 1 minute." },
            ] },
          { level: 3, id: "mantle-of-inspiration", name: { fr: "Mante d'inspiration", en: "Mantle of Inspiration" },
            description: "Action bonus et une Inspiration bardique : lancez le dé ; jusqu'à votre modificateur de Charisme (minimum 1) créatures autres que vous à 18 m gagnent deux fois le résultat en PV temporaires, puis peuvent se déplacer de leur Vitesse avec leur réaction sans attaque d'opportunité.",
            effects: [{ type: "action", name: { fr: "Mante d'inspiration", en: "Mantle of Inspiration" }, actionType: "bonus", ...bi,
              description: (c) => chaMin1(c) + " créature(s) à 18 m : 2 × 1" + die(c) + " PV temporaires, puis déplacement de leur Vitesse par réaction, sans attaque d'opportunité." }] },
          { level: 6, id: "mantle-of-majesty", name: { fr: "Mante de majesté", en: "Mantle of Majesty" },
            description: "Injonction toujours préparé. Action bonus : lancez Injonction sans emplacement et prenez une apparence surnaturelle pendant 1 minute (Concentration) ; pendant ce temps, Injonction en action bonus sans emplacement. Les créatures que vous avez charmées ratent automatiquement leur JS. Une fois par repos long, ou en dépensant un emplacement de niveau 3+.",
            effects: [
              { type: "spell", spell: "command", ability: cha },
              { type: "resource", id: "mantleOfMajesty", name: { fr: "Mante de majesté", en: "Mantle of Majesty" }, max: 1, recharge: "long",
                description: "Ou dépenser un emplacement de niveau 3 ou plus." },
              { type: "action", name: { fr: "Mante de majesté", en: "Mantle of Majesty" }, actionType: "bonus", resource: "mantleOfMajesty",
                description: (c) => "Injonction sans emplacement (DD " + DC(c) + "), puis de nouveau en action bonus pendant 1 minute (Concentration) ; les créatures charmées par vous ratent le JS." },
            ] },
          { level: 14, id: "unbreakable-majesty", name: { fr: "Majesté souveraine", en: "Unbreakable Majesty" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "valor", name: { fr: "Collège de la Vaillance", en: "College of Valor" },
        features: [
          { level: 3, id: "combat-inspiration", combat: true, name: { fr: "Inspiration martiale", en: "Combat Inspiration" },
            description: "Une créature qui a votre dé d'Inspiration bardique peut aussi l'utiliser ainsi. Défense : touchée par une attaque, elle prend sa réaction pour ajouter le dé à sa CA contre cette attaque. Attaque : juste après avoir touché, elle ajoute le dé aux dégâts.",
            effects: [{ type: "note", text: "Inspiration martiale : le dé d'Inspiration peut aussi s'ajouter à la CA (réaction, quand on est touché) ou aux dégâts (juste après avoir touché)." }] },
          { level: 3, id: "martial-training", name: { fr: "Formation martiale", en: "Martial Training" },
            description: "Maîtrise des armes de guerre et formation aux armures intermédiaires et aux boucliers. Une arme courante ou de guerre peut servir de focaliseur pour vos sorts de barde.",
            effects: [{ type: "proficiency", target: "weapon.martial" }, { type: "proficiency", target: "armor.medium" }, { type: "proficiency", target: "armor.shield" }] },
          { level: 6, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
            description: "Vous attaquez deux fois quand vous prenez l'action Attaque à votre tour. Vous pouvez remplacer une de ces attaques par un sort mineur dont le temps d'incantation est d'une action.",
            effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque ; une peut être remplacée par un sort mineur (1 action)." }] },
          { level: 14, id: "battle-magic", name: { fr: "Magie de guerre", en: "Battle Magic" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
