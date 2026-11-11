// Classe : Moine (Monk) — règles 2024, niveaux 1 à 10 détaillés.
// Textes et noms d'après AideDD (aidedd.org/regles-24/classes/moine), relevés le 2026-10-18.
// Credo de la Miséricorde : absent d'AideDD (« Voir le Manuel des Joueurs »), saisi de mémoire, à vérifier.
// Journal de la classe : classes/moine.md
(function () {
  const lvl = (c) => c.classLevel("monk");
  const wis = "wis";
  const DC = (c) => 8 + c.pb + c.mod.wis;
  const wisMin1 = (c) => Math.max(1, c.mod.wis);
  const sg = (n) => DND.engine.signed(n);
  const ma = (c) => DND.byLevel({ 1: "1d6", 5: "1d8", 11: "1d10", 17: "1d12" }, lvl(c));
  const maDie = (c) => ma(c).slice(1); // "d8"
  const asi = (n) => ({ level: n, id: "asi-" + n, name: { fr: "Amélioration de caractéristique", en: "Ability Score Improvement" },
    description: "Le don Amélioration de caractéristiques ou un autre don de votre choix pour lequel vous êtes qualifié.",
    effects: [{ type: "choice", id: "feat" + n, label: "Don du niveau " + n, from: "feats", filter: { category: ["general", "origin"] } }] });
  const focus = { resource: "focus" };
  // Ni armure ni bouclier (Arts martiaux, Défense et Déplacement sans armure)
  const unarmored = (c) => !c.character.inventory.some((i) => i.equipped && DND.data.armor[i.id]);
  // Armes de moine : armes courantes de corps à corps et armes de guerre de corps à corps Légères
  const monkWeapon = (w) => w.type === "melee" && (w.category === "simple" || w.props.includes("light"));
  const martialLight = Object.values(DND.data.weapons).filter((w) => w.category === "martial" && w.props.includes("light")).map((w) => w.id);

  registerModule({
    kind: "class", id: "monk",
    name: { fr: "Moine", en: "Monk" },
    color: "#3e8a8a", // couleur d'accent de la fiche (modifiable dans Options)
    hitDie: 8,
    savingThrows: ["str", "dex"],
    subclassLevel: 3,
    multiclassRequirement: [["dex", "wis"]],
    proficiencies: { weapons: ["simple"].concat(martialLight),
      skills: { choose: 2, from: ["acrobatics", "athletics", "history", "insight", "religion", "stealth"] } },
    multiclassProficiencies: {},
    features: [
      { level: 1, id: "tool", name: { fr: "Outils ou instrument", en: "Tool Proficiency" },
        description: "Maîtrise d'un type d'outils d'artisan ou d'un instrument de musique (pas en multiclasse).",
        effects: [{ type: "choice", id: "tool", label: "Outils d'artisan ou instrument", from: "tools.artisan+tools.musical", optional: true }] },
      { level: 1, id: "martial-arts", combat: true, name: { fr: "Arts martiaux", en: "Martial Arts" },
        description: (c) => "Armes de moine : armes courantes de corps à corps et armes de guerre de corps à corps Légères. Sans armure ni bouclier, désarmé ou avec des armes de moine : Frappe à mains nues en action bonus ; dé d'Arts martiaux (" + ma(c) +
          ") à la place des dégâts normaux ; Dextérité au lieu de la Force pour l'attaque et les dégâts (et pour le DD de Lutte ou Bousculade). Calculé dans les attaques.",
        effects: [
          { type: "unarmedStrike", die: ma, abilities: ["dex"], when: unarmored, label: "Arts martiaux" },
          { type: "weaponAbility", ability: "dex", die: ma, filter: monkWeapon, when: unarmored, label: "Arts martiaux" },
          { type: "action", name: { fr: "Frappe à mains nues (Arts martiaux)", en: "Martial Arts" }, actionType: "bonus",
            description: (c) => "Une Frappe à mains nues : " + sg(c.pb + Math.max(c.mod.dex, c.mod.str)) + " au toucher, " + ma(c) + " " + sg(Math.max(c.mod.dex, c.mod.str)) + " contondant." },
        ] },
      { level: 1, id: "unarmored-defense", name: { fr: "Défense sans armure", en: "Unarmored Defense" },
        description: "Sans armure ni bouclier, votre CA de base est égale à 10 + vos modificateurs de Dextérité et de Sagesse.",
        effects: [{ type: "acFormula", label: "Défense sans armure", base: 10, abilities: ["dex", "wis"], noShield: true }] },
      { level: 2, id: "monks-focus", name: { fr: "Credo du moine", en: "Monk's Focus" },
        description: (c) => "Points de Credo égaux à votre niveau de moine, tous récupérés au repos court ou long. DD des capacités : " + DC(c) + " (8 + Sagesse + maîtrise). Déluge de coups : 1 point, deux Frappes à mains nues en action bonus" + (lvl(c) >= 10 ? " (trois au niveau 10)" : "") +
          ". Patience défensive : Désengagement en action bonus, ou 1 point pour Désengagement et Esquive. Porté par le vent : Pointe en action bonus, ou 1 point pour Désengagement et Pointe et un saut doublé.",
        effects: [
          { type: "resource", id: "focus", name: { fr: "Points de Credo", en: "Focus Points" }, max: (c) => lvl(c), recharge: "short",
            description: (c) => "DD " + DC(c) + "." },
          { type: "action", name: { fr: "Déluge de coups", en: "Flurry of Blows" }, actionType: "bonus", ...focus,
            description: (c) => (lvl(c) >= 10 ? "Trois" : "Deux") + " Frappes à mains nues (" + ma(c) + " " + sg(Math.max(c.mod.dex, c.mod.str)) + ")." },
          { type: "action", name: { fr: "Patience défensive", en: "Patient Defense" }, actionType: "bonus",
            description: (c) => "Désengagement gratuit ; avec 1 point de Credo, Désengagement et Esquive." + (lvl(c) >= 10 ? " Avec le point : PV temporaires égaux à deux jets de " + ma(c) + "." : "") },
          { type: "action", name: { fr: "Porté par le vent", en: "Step of the Wind" }, actionType: "bonus",
            description: (c) => "Pointe gratuite ; avec 1 point de Credo, Désengagement et Pointe, saut doublé." + (lvl(c) >= 10 ? " Avec le point : emmenez une créature consentante de taille G ou moins à 1,5 m." : "") },
        ] },
      { level: 2, id: "unarmored-movement", name: { fr: "Déplacement sans armure", en: "Unarmored Movement" },
        description: "Sans armure ni bouclier, votre Vitesse augmente de 3 m (4,5 m au niveau 6, 6 m au niveau 10). Calculé sur la fiche.",
        effects: [{ type: "bonus", target: "speed", value: { 2: 10, 6: 15, 10: 20, 14: 25, 18: 30 }, when: unarmored, label: "Déplacement sans armure" }] },
      { level: 2, id: "uncanny-metabolism", name: { fr: "Métabolisme surnaturel", en: "Uncanny Metabolism" },
        description: "En lançant l'Initiative, vous pouvez récupérer tous vos points de Credo et regagner votre niveau de moine + un jet de dé d'Arts martiaux en PV. Une fois par repos long.",
        effects: [
          { type: "resource", id: "uncannyMetabolism", name: { fr: "Métabolisme surnaturel", en: "Uncanny Metabolism" }, max: 1, recharge: "long",
            description: "À l'Initiative : tous les points de Credo et des PV." },
          { type: "action", name: { fr: "Métabolisme surnaturel", en: "Uncanny Metabolism" }, actionType: "free", resource: "uncannyMetabolism",
            description: (c) => "Jet d'Initiative : récupérez tous vos points de Credo et " + ma(c) + " + " + lvl(c) + " PV." },
        ] },
      { level: 3, id: "deflect-attacks", name: { fr: "Déviation d'assaut", en: "Deflect Attacks" },
        description: "Réaction quand une attaque vous touche avec des dégâts contondants, perforants ou tranchants (tous types au niveau 10) : réduisez les dégâts de 1d10 + Dextérité + niveau de moine. À 0, dépensez 1 point de Credo pour rediriger : une créature visible (1,5 m au corps à corps, 18 m à distance) fait un JS de Dextérité ou subit deux dés d'Arts martiaux + Dextérité.",
        effects: [{ type: "action", name: { fr: "Déviation d'assaut", en: "Deflect Attacks" }, actionType: "reaction",
          description: (c) => "Attaque qui vous touche" + (lvl(c) >= 10 ? "" : " (contondant, perforant, tranchant)") + " : −1d10 " + sg(c.mod.dex + lvl(c)) + " dégâts. Réduits à 0 : 1 point de Credo, JS de Dextérité DD " + DC(c) + " ou 2" + maDie(c) + " " + sg(c.mod.dex) + " à une créature." }] },
      { level: 3, id: "subclass", name: { fr: "Sous-classe de moine", en: "Monk Subclass" },
        description: "Choisissez votre credo dans la partie Création." },
      asi(4),
      { level: 4, id: "slow-fall", name: { fr: "Chute ralentie", en: "Slow Fall" },
        description: "Réaction quand vous tombez : réduisez les dégâts de chute de cinq fois votre niveau de moine.",
        effects: [{ type: "action", name: { fr: "Chute ralentie", en: "Slow Fall" }, actionType: "reaction",
          description: (c) => "Dégâts de chute réduits de " + 5 * lvl(c) + "." }] },
      { level: 5, id: "extra-attack", combat: true, name: { fr: "Attaque supplémentaire", en: "Extra Attack" },
        description: "Vous attaquez deux fois, au lieu d'une, quand vous prenez l'action Attaque à votre tour.",
        effects: [{ type: "note", text: "Attaque supplémentaire : deux attaques par action Attaque." }] },
      { level: 5, id: "stunning-strike", name: { fr: "Frappe étourdissante", en: "Stunning Strike" },
        description: "Une fois par tour, quand vous touchez avec une arme de moine ou une Frappe à mains nues, 1 point de Credo : JS de Constitution ; échec, la cible est Étourdie jusqu'au début de votre prochain tour ; réussite, sa Vitesse est divisée par deux et la prochaine attaque contre elle a l'Avantage.",
        effects: [{ type: "action", name: { fr: "Frappe étourdissante", en: "Stunning Strike" }, actionType: "free", ...focus,
          description: (c) => "Après avoir touché : JS de Constitution DD " + DC(c) + " ou Étourdie jusqu'au début de votre prochain tour (sinon Vitesse ÷ 2 et prochaine attaque contre elle avec Avantage)." }] },
      { level: 6, id: "empowered-strikes", combat: true, name: { fr: "Frappes renforcées", en: "Empowered Strikes" },
        description: "Vos Frappes à mains nues peuvent infliger des dégâts de force au lieu de leur type normal.",
        effects: [{ type: "note", text: "Frappes renforcées : Frappes à mains nues de force au choix." }] },
      { level: 7, id: "evasion", combat: true, name: { fr: "Esquive totale", en: "Evasion" },
        description: "Effet avec JS de Dextérité pour moitié des dégâts : aucun dégât si réussi, moitié si raté (sauf si vous êtes Incapable d'agir).",
        effects: [{ type: "note", text: "Esquive totale : JS de Dextérité réussi = aucun dégât, raté = moitié." }] },
      asi(8),
      { level: 9, id: "acrobatic-movement", name: { fr: "Déplacement acrobatique", en: "Acrobatic Movement" },
        description: "Sans armure ni bouclier, vous pouvez vous déplacer à votre tour le long des surfaces verticales et sur les liquides sans tomber." },
      { level: 10, id: "heightened-focus", name: { fr: "Credo accru", en: "Heightened Focus" },
        description: "Déluge de coups : trois Frappes à mains nues. Patience défensive avec un point : PV temporaires égaux à deux jets du dé d'Arts martiaux. Porté par le vent avec un point : emmenez une créature consentante de taille G ou moins à 1,5 m (sans attaque d'opportunité)." },
      { level: 10, id: "self-restoration", name: { fr: "Autosubsistance", en: "Self-Restoration" },
        description: "À la fin de chacun de vos tours, vous pouvez mettre fin à un état Charmé, Effrayé ou Empoisonné qui vous affecte. Ne pas manger ni boire ne vous donne pas d'Épuisement. Déviation d'assaut fonctionne contre tous les types de dégâts.",
        effects: [{ type: "note", text: "Autosubsistance : fin de tour, mettez fin à Charmé, Effrayé ou Empoisonné." }] },
      { level: 13, id: "deflect-energy", name: { fr: "Déviation d'énergie", en: "Deflect Energy" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
    subclasses: [
      {
        id: "elements", name: { fr: "Credo des Éléments", en: "Warrior of the Elements" },
        features: [
          { level: 3, id: "elemental-attunement", name: { fr: "Lien élémentaire", en: "Elemental Attunement" },
            description: "Au début de votre tour, 1 point de Credo : énergie élémentaire pendant 10 minutes (fin si Incapable d'agir). Allonge de vos Frappes à mains nues +3 m. Frappes élémentaires : dégâts d'acide, froid, feu, foudre ou tonnerre au choix ; vous pouvez alors imposer un JS de Force ou attirer/repousser la cible de 3 m.",
            effects: [{ type: "action", name: { fr: "Lien élémentaire", en: "Elemental Attunement" }, actionType: "free", ...focus,
              description: (c) => "10 min : Frappes à mains nues avec +3 m d'allonge, acide/froid/feu/foudre/tonnerre au choix ; JS de Force DD " + DC(c) + " ou cible attirée ou repoussée de 3 m." }] },
          { level: 3, id: "manipulate-elements", name: { fr: "Manipulation des éléments", en: "Manipulate Elements" },
            description: "Vous connaissez le sort Élémentalisme (Sagesse).",
            effects: [{ type: "spell", spell: "elementalism", ability: wis }] },
          { level: 6, id: "elemental-burst", name: { fr: "Décharge élémentaire", en: "Elemental Burst" },
            description: "Action Magie, 2 points de Credo : sphère de 6 m de rayon centrée sur un point à 36 m ; type acide, froid, feu, foudre ou tonnerre. JS de Dextérité : trois dés d'Arts martiaux de dégâts, moitié si réussi.",
            effects: [{ type: "action", name: { fr: "Décharge élémentaire (2 points)", en: "Elemental Burst" }, actionType: "action", ...focus,
              description: (c) => "Sphère de 6 m à 36 m : JS de Dextérité DD " + DC(c) + ", 3" + maDie(c) + " (acide, froid, feu, foudre ou tonnerre), moitié si réussi." }] },
          { level: 11, id: "stride-of-the-elements", name: { fr: "Foulée élémentaire", en: "Stride of the Elements" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        // Absent d'AideDD (« Voir le Manuel des Joueurs ») : saisi de mémoire, noms et valeurs à vérifier dans le livre.
        id: "mercy", name: { fr: "Credo de la Miséricorde", en: "Warrior of Mercy" }, source: "PHB 2024",
        features: [
          { level: 3, id: "implements-of-mercy", name: { fr: "Instruments de la miséricorde", en: "Implements of Mercy" },
            description: "Maîtrise de l'Intuition, de la Médecine et du matériel d'herboriste. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "proficiency", target: "skill.insight" }, { type: "proficiency", target: "skill.medicine" }, { type: "proficiency", target: "tool.herbalism-kit" }] },
          { level: 3, id: "hand-of-harm", name: { fr: "Main blessante", en: "Hand of Harm" },
            description: "Une fois par tour, quand vous touchez avec une Frappe à mains nues, 1 point de Credo : +1 dé d'Arts martiaux + Sagesse en dégâts nécrotiques. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Main blessante", en: "Hand of Harm" }, actionType: "free", ...focus,
              description: (c) => "Frappe à mains nues qui touche : +" + ma(c) + " " + sg(c.mod.wis) + " nécrotiques." + (lvl(c) >= 6 ? " Toucher du médecin : la cible peut aussi être Empoisonnée jusqu'à la fin de votre prochain tour." : "") }] },
          { level: 3, id: "hand-of-healing", name: { fr: "Main guérisseuse", en: "Hand of Healing" },
            description: "Action Magie, 1 point de Credo : une créature touchée regagne un dé d'Arts martiaux + Sagesse en PV. Lors d'un Déluge de coups, vous pouvez remplacer une des Frappes par ce soin sans dépenser de point. (Saisi de mémoire, à vérifier.)",
            effects: [{ type: "action", name: { fr: "Main guérisseuse", en: "Hand of Healing" }, actionType: "action", ...focus,
              description: (c) => "Une créature touchée regagne " + ma(c) + " " + sg(c.mod.wis) + " PV (gratuit à la place d'une Frappe du Déluge de coups)." + (lvl(c) >= 6 ? " Toucher du médecin : met aussi fin à Aveuglé, Assourdi, Paralysé, Empoisonné ou Étourdi." : "") }] },
          { level: 6, id: "physicians-touch", name: { fr: "Toucher du médecin", en: "Physician's Touch" },
            description: "Main blessante peut aussi rendre la cible Empoisonnée jusqu'à la fin de votre prochain tour ; Main guérisseuse peut aussi mettre fin à Aveuglé, Assourdi, Paralysé, Empoisonné ou Étourdi. (Saisi de mémoire, à vérifier.)" },
          { level: 11, id: "flurry-of-healing-and-harm", name: { fr: "Déluge de soins et de blessures", en: "Flurry of Healing and Harm" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "shadow", name: { fr: "Credo de l'Ombre", en: "Warrior of Shadow" },
        features: [
          { level: 3, id: "shadow-arts", name: { fr: "Artiste des ombres", en: "Shadow Arts" },
            description: "Ténèbres : 1 point de Credo pour lancer Ténèbres sans composante ; vous voyez au travers et pouvez déplacer la zone de 18 m au début de vos tours. Vision dans le noir 18 m (+18 m si vous l'avez déjà). Vous connaissez Illusion mineure (Sagesse).",
            effects: [
              { type: "spell", spell: "darkness", ability: wis },
              { type: "spell", spell: "minor-illusion", ability: wis },
              { type: "sense", sense: "darkvision", range: 60 },
              { type: "action", name: { fr: "Ténèbres (Artiste des ombres)", en: "Shadow Arts" }, actionType: "action", ...focus,
                description: "Lancez Ténèbres sans composante ; vous voyez dans la zone et pouvez la déplacer de 18 m au début de vos tours." },
            ] },
          { level: 6, id: "shadow-step", name: { fr: "Foulée d'ombre", en: "Shadow Step" },
            description: "Entièrement dans une Lumière faible ou des Ténèbres : action bonus pour vous téléporter jusqu'à 18 m dans un espace libre lui aussi dans la pénombre ou les ténèbres, avec l'Avantage à votre prochaine attaque au corps à corps de ce tour.",
            effects: [{ type: "action", name: { fr: "Foulée d'ombre", en: "Shadow Step" }, actionType: "bonus",
              description: "De pénombre en pénombre, téléportation de 18 m ; Avantage à la prochaine attaque au corps à corps du tour." }] },
          { level: 11, id: "improved-shadow-step", name: { fr: "Foulée d'ombre améliorée", en: "Improved Shadow Step" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
      {
        id: "open-hand", name: { fr: "Credo de la Paume", en: "Warrior of the Open Hand" },
        features: [
          { level: 3, id: "open-hand-technique", combat: true, name: { fr: "Technique de la Paume", en: "Open Hand Technique" },
            description: "Quand vous touchez avec une attaque de votre Déluge de coups, un effet au choix. Hésitation : pas d'attaque d'opportunité avant son prochain tour. Bourrade : JS de Force ou repoussée de 4,5 m. Renversement : JS de Dextérité ou À terre.",
            effects: [{ type: "note", text: (c) => "Technique de la Paume (Déluge de coups) : Hésitation (pas d'attaque d'opportunité), Bourrade (JS de Force DD " + DC(c) + " ou repoussée de 4,5 m) ou Renversement (JS de Dextérité DD " + DC(c) + " ou À terre)." }] },
          { level: 6, id: "wholeness-of-body", name: { fr: "Plénitude physique", en: "Wholeness of Body" },
            description: "Action bonus : regagnez un dé d'Arts martiaux + Sagesse en PV (minimum 1). Utilisations égales à votre modificateur de Sagesse (minimum 1), récupérées au repos long.",
            effects: [
              { type: "resource", id: "wholenessOfBody", name: { fr: "Plénitude physique", en: "Wholeness of Body" }, max: wisMin1, recharge: "long" },
              { type: "action", name: { fr: "Plénitude physique", en: "Wholeness of Body" }, actionType: "bonus", resource: "wholenessOfBody",
                description: (c) => "Regagnez " + ma(c) + " " + sg(c.mod.wis) + " PV (minimum 1)." },
            ] },
          { level: 11, id: "fleet-step", name: { fr: "Pas véloce", en: "Fleet Step" },
            description: "Non géré pour l'instant (au-delà du niveau 10)." },
        ],
      },
    ],
  });
})();
