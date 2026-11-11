// Tests des classes Barbare, Barde, Druide, Magicien, Moine, Rôdeur et Roublard (modules réels).
// Appelé depuis tests/run.js : require("./classes2.js")(DND, eq).
module.exports = function (DND, eq) {
  const E = DND.engine;
  const base = (abilities) => {
    const ch = E.newCharacter();
    Object.assign(ch.abilities, abilities);
    return ch;
  };
  const res = (s, id) => s.resources.find((r) => r.id === id);
  const act = (s, fr) => s.actions.find((a) => a.name.fr === fr);
  const unarmed = (s) => s.attacks.find((a) => a.kind === "unarmed");
  const weapon = (s, en) => s.attacks.find((a) => a.nameEn === en);
  const hasSpell = (s, id) => s.spells.some((x) => x.spell.id === id);

  // --- Barbare ---
  let ch = base({ str: 16, dex: 14, con: 16, int: 8, wis: 12, cha: 10 });
  ch.classes = [{ id: "barbarian", level: 1, subclass: "", choices: {
    skills: ["skill.athletics", "skill.perception"], masteries: ["greataxe", "handaxe"] } }];
  ch.inventory = [{ id: "greataxe", qty: 1, equipped: true }];
  let s = E.compute(ch);
  eq("Barbare 1 : PV 12 + CON 3", s.hp.max, 15);
  eq("Barbare 1 : Défense sans armure 10 + DEX 2 + CON 3", s.ac.value, 15);
  eq("Barbare 1 : Rage ×2, 1 au repos court", [res(s, "barbarian.rage").max, res(s, "barbarian.rage").shortRegain], [2, 1]);
  eq("Barbare 1 : botte de la hache à deux mains", !!weapon(s, "Greataxe").mastery, true);
  eq("Barbare 1 : couleur", s.accent, "#9c4a1a");
  eq("Barbare 1 : pas d'erreur", s.errors, []);
  ch.inventory.push({ id: "shield", qty: 1, equipped: true });
  eq("Barbare 1 : Défense sans armure avec bouclier", E.compute(ch).ac.value, 17);
  ch.classes[0].level = 7;
  s = E.compute(ch);
  eq("Barbare 7 : Rage ×4", res(s, "barbarian.rage").max, 4);
  eq("Barbare 7 : Déplacement rapide +3 m", s.speed.walk, 40);
  eq("Barbare 7 : Avantage à l'initiative et aux JS de DEX", [s.initiative.advantage.length > 0, s.abilities.dex.save.advantage.length > 0], [true, true]);
  ch.inventory.push({ id: "plate", qty: 1, equipped: true });
  eq("Barbare 7 : pas de Déplacement rapide en armure lourde", E.compute(ch).speed.walk, 30);
  ch.inventory.pop();
  ch.classes[0].subclass = "wild-heart";
  ch.classes[0].choices["sub:wild-heart/aspect"] = ["panther"];
  s = E.compute(ch);
  eq("Cœur sauvage : Panthère, escalade = Vitesse", s.speed.climb, 40);
  eq("Cœur sauvage : Communication avec les animaux", hasSpell(s, "speak-with-animals"), true);
  ch.classes[0].subclass = "zealot";
  s = E.compute(ch);
  eq("Zélateur 7 : Guerrier des dieux ×5", res(s, "barbarian.warriorOfTheGods").max, 5);

  // --- Barde ---
  ch = base({ str: 8, dex: 14, con: 14, int: 10, wis: 12, cha: 16 });
  ch.classes = [{ id: "bard", level: 2, subclass: "", choices: {
    skills: ["skill.performance", "skill.persuasion", "skill.deception"], instruments: ["tool.lute", "tool.flute", "tool.lyre"],
    expertise: ["skill.performance", "skill.persuasion"] } }];
  s = E.compute(ch);
  eq("Barde 2 : Inspiration bardique = CHA 3, repos long", [res(s, "bard.bardicInspiration").max, res(s, "bard.bardicInspiration").recharge], [3, "long"]);
  eq("Barde 2 : expertise Représentation (+3 +2×2)", s.skills.performance.bonus, 7);
  eq("Barde 2 : Touche-à-tout sur Athlétisme (−1 + 1)", s.skills.athletics.bonus, 0);
  eq("Barde 2 : Touche-à-tout pas sur Tromperie (maîtrisée)", s.skills.deception.bonus, 5);
  eq("Barde 2 : DD des sorts 13", s.casting[0].dc, 13);
  eq("Barde 2 : 2 sorts mineurs, 5 préparés", [s.casting[0].cantrips, s.casting[0].prepared], [2, 5]);
  eq("Barde 2 : luth maîtrisé", s.proficiencies.tools.includes("tool.lute"), true);
  ch.classes[0].level = 10;
  ch.classes[0].subclass = "dance";
  s = E.compute(ch);
  eq("Barde 5+ : Inspiration au repos court", res(s, "bard.bardicInspiration").recharge, "short");
  eq("Barde 10 : Secrets magiques (listes clerc, druide, magicien)", s.casting[0].lists, ["bard", "cleric", "druid", "wizard"]);
  eq("Danse : CA 10 + DEX 2 + CHA 3", s.ac.value, 15);
  eq("Danse : Frappe à mains nues 1d10 + DEX", [unarmed(s).damage, unarmed(s).toHit], ["1d10+2 contondant", 6]);
  ch.inventory = [{ id: "leather", qty: 1, equipped: true }];
  eq("Danse : en armure, Frappe à mains nues normale", unarmed(E.compute(ch)).damage, "0 contondant");
  ch.inventory = [];
  ch.classes[0].subclass = "glamour";
  s = E.compute(ch);
  eq("Séduction : Charme-personne, Image miroir, Injonction préparés", ["charm-person", "mirror-image", "command"].every((id) => hasSpell(s, id)), true);
  eq("Barde 10 : pas d'erreur", s.errors, []);

  // --- Druide ---
  ch = base({ str: 10, dex: 14, con: 14, int: 12, wis: 16, cha: 8 });
  ch.classes = [{ id: "druid", level: 2, subclass: "", choices: {
    skills: ["skill.nature", "skill.perception"], primalOrder: ["magician"], "primalOrder/magician/cantrip": ["druidcraft"] } }];
  s = E.compute(ch);
  eq("Druide 2 : druidique et Communication avec les animaux", [s.proficiencies.languages.includes("language.druidic"), hasSpell(s, "speak-with-animals")], [true, true]);
  eq("Druide 2 : Mage, +SAG 3 en Nature (+1 +2 +3)", s.skills.nature.bonus, 6);
  eq("Druide 2 : Forme sauvage ×2, 1 au repos court", [res(s, "druid.wildShape").max, res(s, "druid.wildShape").shortRegain], [2, 1]);
  eq("Druide 2 : 4 formes connues", s.choices.find((c) => c.key === "beastForms").count, 4);
  eq("Druide 2 : herboriste maîtrisé", s.proficiencies.tools.includes("tool.herbalism-kit"), true);
  ch.classes[0].level = 10;
  ch.classes[0].subclass = "land";
  ch.classes[0].choices["sub:land/land"] = ["polar"];
  s = E.compute(ch);
  eq("Terre polaire : sorts jusqu'au niveau 9", ["fog-cloud", "hold-person", "ray-of-frost", "sleet-storm", "ice-storm", "cone-of-cold"].every((id) => hasSpell(s, id)), true);
  eq("Terre polaire 10 : Résistance au froid", s.resistances.includes("cold"), true);
  eq("Druide 6 : Forme sauvage ×3", res(s, "druid.wildShape").max, 3);
  ch.classes[0].subclass = "moon";
  s = E.compute(ch);
  eq("Lune 10 : 30 PV temporaires et CA 16 dans l'action", /30 PV temporaires/.test(act(s, "Forme sauvage").description) && /CA au moins 16/.test(act(s, "Forme sauvage").description), true);
  eq("Lune 10 : Foulée sélène ×3", res(s, "druid.moonlightStep").max, 3);
  ch.classes[0].subclass = "sea";
  eq("Mers 6 : nage = Vitesse", E.compute(ch).speed.swim, 30);
  ch.classes[0].choices.elementalFury = ["potent-spellcasting"];
  ch.spells = [{ id: "starry-wisp", source: "druid" }];
  s = E.compute(ch);
  eq("Druide 7 : Incantation puissante sur Poussière d'étoile", s.spells.find((x) => x.spell.id === "starry-wisp").damage, "2d8+3 radiant");

  // --- Magicien ---
  ch = base({ str: 8, dex: 14, con: 14, int: 16, wis: 12, cha: 10 });
  ch.classes = [{ id: "wizard", level: 1, subclass: "", choices: { skills: ["skill.arcana", "skill.history"] } }];
  s = E.compute(ch);
  eq("Magicien 1 : PV 6 + CON 2", s.hp.max, 8);
  eq("Magicien 1 : 3 sorts mineurs, 4 préparés, DD 13", [s.casting[0].cantrips, s.casting[0].prepared, s.casting[0].dc], [3, 4, 13]);
  eq("Magicien 1 : grimoire facultatif (6 sorts)", [s.choices.find((c) => c.key === "spellbook").count, s.choices.find((c) => c.key === "spellbook").effect.optional], [6, true]);
  ch.classes[0].level = 10;
  ch.classes[0].subclass = "evoker";
  ch.classes[0].choices.scholar = ["skill.arcana"];
  ch.spells = [{ id: "fire-bolt", source: "wizard" }];
  s = E.compute(ch);
  eq("Magicien 10 : Érudition, expertise Arcanes (+3 +4×2)", s.skills.arcana.bonus, 11);
  eq("Évocateur 10 : +INT aux sorts d'évocation", s.spells.find((x) => x.spell.id === "fire-bolt").damage, "2d10+3 feu");
  eq("Évocateur érudit : sorts d'évocation seulement", s.choices.find((c) => c.key === "sub:evoker/savant").options.every((o) => o.school === "evocation"), true);
  ch.classes[0].subclass = "abjurer";
  s = E.compute(ch);
  eq("Abjurateur 10 : égide 2 × 10 + INT 3", res(s, "wizard.arcaneWard").max, 23);
  eq("Abjurateur 10 : Contresort et Dissipation préparés", [hasSpell(s, "counterspell"), hasSpell(s, "dispel-magic")], [true, true]);

  // --- Moine ---
  ch = base({ str: 10, dex: 16, con: 14, int: 8, wis: 14, cha: 10 });
  ch.classes = [{ id: "monk", level: 1, subclass: "", choices: { skills: ["skill.acrobatics", "skill.stealth"] } }];
  ch.inventory = [{ id: "quarterstaff", qty: 1, equipped: true }, { id: "shortsword", qty: 1, equipped: true }, { id: "longsword", qty: 1, equipped: true }];
  s = E.compute(ch);
  eq("Moine 1 : CA 10 + DEX 3 + SAG 2", s.ac.value, 15);
  eq("Moine 1 : Frappe à mains nues 1d6 + DEX", [unarmed(s).damage, unarmed(s).toHit, unarmed(s).option], ["1d6+3 contondant", 5, "Arts martiaux"]);
  eq("Moine 1 : bâton en DEX", [weapon(s, "Quarterstaff").toHit, weapon(s, "Quarterstaff").damage], [5, "1d6+3 contondant"]);
  eq("Moine 1 : épée courte maîtrisée (guerre, Légère)", weapon(s, "Shortsword").proficient, true);
  eq("Moine 1 : épée longue ni maîtrisée ni arme de moine", [weapon(s, "Longsword").proficient, weapon(s, "Longsword").ability], [false, "str"]);
  ch.classes[0].level = 6;
  s = E.compute(ch);
  eq("Moine 6 : dé d'Arts martiaux d8 sur le bâton", weapon(s, "Quarterstaff").damage, "1d8+3 contondant");
  eq("Moine 6 : 6 points de Credo, repos court", [res(s, "monk.focus").max, res(s, "monk.focus").recharge], [6, "short"]);
  eq("Moine 6 : Déplacement sans armure +4,5 m", s.speed.walk, 45);
  ch.inventory.push({ id: "shield", qty: 1, equipped: true });
  s = E.compute(ch);
  eq("Moine avec bouclier : pas de Défense ni Déplacement sans armure", [s.ac.value, s.speed.walk], [13, 30]);
  eq("Moine avec bouclier : Frappe à mains nues normale", unarmed(s).damage, "1 contondant");
  ch.inventory.pop();
  ch.classes[0].subclass = "shadow";
  s = E.compute(ch);
  eq("Ombre : vision dans le noir 18 m, Ténèbres", [s.senses.darkvision, hasSpell(s, "darkness")], [60, true]);
  eq("Moine 6 : pas d'erreur", s.errors, []);

  // --- Rôdeur ---
  ch = base({ str: 12, dex: 16, con: 14, int: 10, wis: 14, cha: 8 });
  ch.classes = [{ id: "ranger", level: 1, subclass: "", choices: {
    skills: ["skill.stealth", "skill.survival", "skill.perception"], masteries: ["longbow", "shortsword"] } }];
  s = E.compute(ch);
  eq("Rôdeur 1 : 2 emplacements de niveau 1", s.spellSlots.map((x) => x.max), [2]);
  eq("Rôdeur 1 : Marque du chasseur ×2 gratuite", [hasSpell(s, "hunters-mark"), res(s, "spell:ranger:hunters-mark").max], [true, 2]);
  eq("Rôdeur 1 : 2 sorts préparés, DD 12", [s.casting[0].prepared, s.casting[0].dc], [2, 12]);
  ch.classes[0].level = 6;
  ch.classes[0].subclass = "gloom-stalker";
  ch.classes[0].choices.fightingStyle = ["druidic-warrior"];
  ch.classes[0].choices["fightingStyle/druidic-warrior/cantrips"] = ["guidance", "starry-wisp"];
  s = E.compute(ch);
  eq("Rôdeur 6 : Arpenteur (+3 m, escalade et nage)", [s.speed.walk, s.speed.climb, s.speed.swim], [40, 40, 40]);
  eq("Rôdeur 5 : Marque du chasseur ×3", res(s, "spell:ranger:hunters-mark").max, 3);
  eq("Combattant druidique : 2 sorts mineurs de druide", [hasSpell(s, "guidance"), hasSpell(s, "starry-wisp")], [true, true]);
  eq("Traqueur : initiative DEX 3 + SAG 2", s.initiative.bonus, 5);
  eq("Traqueur : Déguisement et Corde enchantée", [hasSpell(s, "disguise-self"), hasSpell(s, "rope-trick")], [true, true]);
  ch.classes[0].subclass = "beast-master";
  ch.state.companions["primal-companion"] = { form: "land", damage: 0, custom: {} };
  s = E.compute(ch);
  eq("Belluaire 6 : bête des terres CA 15, PV 35", [s.companions[0].ac, s.companions[0].hpMax], [15, 35]);
  eq("Rôdeur 6 : pas d'erreur", s.errors, []);

  // --- Roublard ---
  ch = base({ str: 8, dex: 16, con: 14, int: 12, wis: 10, cha: 14 });
  ch.classes = [{ id: "rogue", level: 1, subclass: "", choices: {
    skills: ["skill.stealth", "skill.sleight-of-hand", "skill.acrobatics", "skill.perception"], expertise: ["skill.stealth", "skill.sleight-of-hand"],
    masteries: ["rapier", "shortbow"] } }];
  ch.inventory = [{ id: "rapier", qty: 1, equipped: true }];
  s = E.compute(ch);
  eq("Roublard 1 : rapière maîtrisée en DEX", [weapon(s, "Rapier").proficient, weapon(s, "Rapier").toHit], [true, 5]);
  eq("Roublard 1 : Discrétion en expertise (+3 +2×2)", s.skills.stealth.bonus, 7);
  eq("Roublard 1 : outils de voleur et argot", [s.proficiencies.tools.includes("tool.thieves-tools"), s.proficiencies.languages.includes("language.thieves-cant")], [true, true]);
  eq("Roublard 1 : Attaque sournoise 1d6", s.actions.some((a) => /\+1d6/.test(a.description) && a.name.fr === "Attaque sournoise"), true);
  ch.classes[0].level = 10;
  ch.classes[0].subclass = "arcane-trickster";
  s = E.compute(ch);
  eq("Roublard 10 : Attaque sournoise 5d6", s.actions.some((a) => /\+5d6/.test(a.description)), true);
  eq("Roublard 10 : dons aux niveaux 4, 8 et 10", ["feat4", "feat8", "feat10"].every((k) => s.choices.some((c) => c.key === k)), true);
  eq("Arnaqueur 10 : emplacements 4/3, Main de mage", [s.spellSlots.map((x) => x.max), hasSpell(s, "mage-hand")], [[4, 3], true]);
  ch.classes[0].subclass = "assassin";
  s = E.compute(ch);
  eq("Assassin : Avantage à l'initiative, kits", [s.initiative.advantage.length > 0, s.proficiencies.tools.includes("tool.poisoners-kit")], [true, true]);
  ch.classes[0].subclass = "soulknife";
  s = E.compute(ch);
  eq("Âme acérée 10 : 8 dés psioniques, 1 au repos court", [res(s, "rogue.psionicDice").max, res(s, "rogue.psionicDice").shortRegain], [8, 1]);
  eq("Roublard 10 : pas d'erreur", s.errors, []);

  // --- Noyau : recharge selon le niveau (Éclat protecteur du clerc de la Lumière) ---
  ch = base({ str: 10, dex: 10, con: 14, int: 10, wis: 16, cha: 10 });
  ch.classes = [{ id: "cleric", level: 3, subclass: "light", choices: {} }];
  eq("Éclat protecteur niv. 3 : repos long", res(E.compute(ch), "cleric.wardingFlare").recharge, "long");
  ch.classes[0].level = 6;
  eq("Éclat protecteur niv. 6 : repos court", res(E.compute(ch), "cleric.wardingFlare").recharge, "short");

  // --- Sorts ajoutés (AideDD 2024) ---
  eq("Sorts : Moquerie cruelle (barde)", DND.data.spells["vicious-mockery"].lists, ["bard"]);
  eq("Sorts : Bouclier de feu sur la liste du druide", DND.data.spells["fire-shield"].lists.includes("druid"), true);
  const count = (list, lv) => Object.values(DND.data.spells).filter((x) => x.level === lv && x.lists.includes(list)).length;
  eq("Sorts : liste du rôdeur niveaux 1 à 5", [1, 2, 3, 4, 5].map((n) => count("ranger", n)), [14, 18, 16, 7, 6]);
};
