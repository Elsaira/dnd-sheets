// Tests du moteur : node tests/run.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = { console, Math, JSON, Object, Array, Number, String, Set };
ctx.window = ctx;
vm.createContext(ctx);
const load = (f) => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
["core/registry.js", "data/rules.js", "data/equipment.js", "data/spells.js", "data/spell-upcast.js", "core/engine.js", "core/rules.js", "modules/manifest.js"].forEach(load);
for (const f of ctx.DND.manifest) load("modules/" + f);
load("tests/fixtures.js");
const { DND } = ctx;
const E = DND.engine;

let failures = 0, count = 0;
const eq = (label, actual, expected) => {
  count++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) { failures++; console.log("ÉCHEC  " + label + " : obtenu " + JSON.stringify(actual) + ", attendu " + JSON.stringify(expected)); }
};

// 1. Humain Soldat Combattant 1
let ch = E.newCharacter();
Object.assign(ch.abilities, { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 });
ch.species = { id: "human", choices: { size: ["medium"], skill: ["skill.perception"], originFeat: ["alert"] } };
ch.background = { id: "soldier", choices: { abilityBonus: ["str", "str", "con"], gamingSet: ["tool.dice-set"] } };
ch.classes = [{ id: "test-fighter", level: 1, subclass: "", choices: { skills: ["skill.athletics", "skill.survival"] } }];
ch.inventory = [{ id: "chain-mail", qty: 1, equipped: true }, { id: "shield", qty: 1, equipped: true }, { id: "longsword", qty: 1, equipped: true }];
let s = E.compute(ch);
eq("FOR après historique", s.abilities.str.score, 17);
eq("CON après historique", s.abilities.con.score, 15);
eq("bonus de maîtrise niv. 1", s.pb, 2);
eq("CA cotte de mailles + bouclier", s.ac.value, 18);
eq("PV niv. 1 (d10 + CON 2)", s.hp.max, 12);
eq("JS FOR maîtrisé", s.abilities.str.save.bonus, 5);
eq("JS DEX non maîtrisé", s.abilities.dex.save.bonus, 1);
eq("Athlétisme (classe + historique)", s.skills.athletics.bonus, 5);
eq("Perception (humain)", s.skills.perception.bonus, 3);
eq("Perception passive", s.passive.perception, 13);
eq("Initiative avec Vigilant", s.initiative.bonus, 3);
eq("Second souffle max", s.resources.find((r) => r.id === "test-fighter.secondWind").max, 2);
eq("Attaque épée longue", s.attacks[0].toHit, 5);
eq("Dégâts épée longue", s.attacks[0].damage, "1d8+3 tranchant");
eq("Épée longue à 2 mains", s.attacks[0].alt, "1d10+3 à 2 mains");
eq("Langue commune", s.proficiencies.languages.includes("language.common"), true);
eq("Choix restants (langues)", s.pendingChoices, 1);
eq("Pas d'erreur", s.errors, []);
eq("Jet normal", E.rollCommand(5), "1d20+5");
eq("Jet avec avantage", E.rollCommand(5, "adv"), "2d20 k1+5");
eq("Jet avec désavantage, bonus négatif", E.rollCommand(-1, "dis"), "2d20 kl1-1");
eq("Jet sans bonus", E.rollCommand(0), "1d20");
eq("Dés des dégâts d'arme", E.diceIn(s.attacks[0].damage).command, "1d8+3");
eq("Dés dans un texte", E.diceIn("2 rayons de 1d10 force").command, "1d10");
eq("Modificateur négatif", E.diceIn("1d6 − 1 contondant").command, "1d6-1");
eq("Pas de dés", E.diceIn("0 contondant"), null);

// 2. Montée de niveau, don au niveau 4, sous-classe
ch.classes[0].level = 4;
ch.classes[0].subclass = "test-sub";
ch.classes[0].choices.feat4 = ["ability-score-improvement"];
ch.classes[0].choices["feat4/ability-score-improvement/asi"] = ["str", "con"];
s = E.compute(ch);
eq("FOR 17 + 1 = 18", s.abilities.str.score, 18);
eq("CA avec sous-classe", s.ac.value, 19);
eq("PV niv. 4 : 10 + 3×6 + 4×CON 3", s.hp.max, 10 + 18 + 12);
eq("Second souffle niv. 4", s.resources.find((r) => r.id === "test-fighter.secondWind").max, 3);

// 3. Repos : Second souffle récupère 1 au repos court
ch.state.resources["test-fighter.secondWind"] = 3;
DND.rules.shortRest(ch, s);
eq("Repos court : 1 utilisation récupérée", ch.state.resources["test-fighter.secondWind"], 2);
DND.rules.longRest(ch, E.compute(ch));
eq("Repos long : tout récupéré", ch.state.resources["test-fighter.secondWind"], undefined);
eq("Humain : inspiration au repos long", ch.state.heroicInspiration, true);

// 4. Dégâts, PV temporaires, concentration
s = E.compute(ch);
ch.state.damage = 0;
DND.rules.setTempHp(ch, s, 5);
ch.state.concentration = "Bénédiction";
const msg = DND.rules.damage(ch, s, 8);
eq("PV temporaires absorbés", ch.state.tempHp, 0);
eq("PV après dégâts", E.compute(ch).hp.current, s.hp.max - 3);
ch.classes[0].level = 5;
eq("Montée de niveau : les PV gagnés s'ajoutent", E.compute(ch).hp.current, E.compute(ch).hp.max - 3);
ch.classes[0].level = 4;
eq("Rappel de concentration", /DD 10/.test(msg), true);
// Jets contre la mort : échec sur dégâts à 0 PV, remise à zéro aux soins et au repos long
{
  const c = E.newCharacter();
  Object.assign(c.abilities, { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  c.classes = [{ id: "test-fighter", level: 1, subclass: "", choices: {} }];
  DND.rules.damage(c, E.compute(c), 10);
  DND.rules.damage(c, E.compute(c), 2);
  eq("Dégâts à 0 PV : un échec", c.state.deathSaves, { success: 0, failure: 1 });
  c.state.deathSaves.success = 2;
  DND.rules.heal(c, E.compute(c), 3);
  eq("Soins depuis 0 PV : jets remis à zéro", c.state.deathSaves, { success: 0, failure: 0 });
  c.state.deathSaves = { success: 1, failure: 2 };
  DND.rules.longRest(c, E.compute(c));
  eq("Repos long : jets remis à zéro", c.state.deathSaves, { success: 0, failure: 0 });
}

// 5. Tieffelin Sage, mage : sorts accordés, Initié à la magie imposé (Magicien)
ch = E.newCharacter();
Object.assign(ch.abilities, { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 });
ch.species = { id: "tiefling", choices: { size: ["medium"], legacy: ["infernal"], spellAbility: ["int"] } };
ch.background = { id: "sage", choices: { abilityBonus: ["int", "int", "con"],
  "feat:magic-initiate/ability": ["int"], "feat:magic-initiate/cantrips": ["fire-bolt", "minor-illusion"], "feat:magic-initiate/spell": ["false-life"] } };
ch.classes = [{ id: "test-wizard", level: 5, choices: {} }];
s = E.compute(ch);
eq("INT 17", s.abilities.int.score, 17);
eq("Résistance au feu", s.resistances, ["fire"]);
eq("Liste imposée par l'historique (pas de choix affiché)", s.choices.some((c) => c.key.endsWith("spellList")), false);
const names = s.spells.map((x) => x.spell.id).sort();
eq("Sorts accordés", names, ["darkness", "false-life", "fire-bolt", "fire-bolt", "hellish-rebuke", "minor-illusion", "thaumaturgy"].sort());
eq("Trait de feu niv. 5 : 2d10", s.spells.find((x) => x.spell.id === "fire-bolt").damage, "2d10 feu");
eq("DD des sorts (8 + 3 + 3)", s.casting[0].dc, 14);
eq("Emplacements mage 5", s.spellSlots.map((x) => x.max), [4, 3, 2]);
eq("CA Armure de mage (13 + DEX)", s.ac.value, 15);
eq("Vision dans le noir 18 m", s.senses.darkvision, 60);
eq("Ressources de sorts gratuits", s.resources.filter((r) => r.id.startsWith("spell:")).length, 3);

// 6. Multiclassage : mage 3 / pacte 3 (emplacements séparés)
ch.classes = [{ id: "test-wizard", level: 3, choices: {} }, { id: "test-pact", level: 3, choices: {} }];
s = E.compute(ch);
eq("Emplacements multiclasse (mage 3 seul)", s.spellSlots.map((x) => x.max), [4, 2]);
eq("Magie de pacte séparée", [s.pact.count, s.pact.level], [2, 2]);
eq("JS de la 1re classe seulement", [s.abilities.int.save.proficient, s.abilities.cha.save.proficient], [true, false]);
eq("Avertissement prérequis", s.warnings.some((w) => /Multiclassage/.test(w)), true);
DND.rules.usePactSlot(ch, s, 1);
DND.rules.shortRest(ch, s);
eq("Pacte récupéré au repos court", ch.state.pactSpent, 0);

// 7. Nain Acolyte : PV par niveau, Initié à la magie (Clerc) sans choix de liste
ch = E.newCharacter();
ch.species = { id: "dwarf", choices: {} };
ch.background = { id: "acolyte", choices: {} };
ch.classes = [{ id: "test-fighter", level: 3, choices: {} }];
s = E.compute(ch);
eq("Nain : +1 PV/niveau", s.hp.max, 10 + 6 + 6 + 3);
eq("Options de tours de magie = liste du clerc", s.choices.find((c) => c.key === "feat:magic-initiate/cantrips").options.every((o) => o.lists.includes("cleric")), true);
eq("Vision dans le noir 36 m", E.meters(s.senses.darkvision), "36 m");

// 8. Export / import : le personnage est du JSON pur
const json = JSON.stringify(ch);
eq("Aller-retour JSON", E.compute(E.normalize(JSON.parse(json))).hp.max, s.hp.max);

// 9. Occultiste (module réel) niveaux 1 à 10
ch = E.newCharacter();
Object.assign(ch.abilities, { str: 8, dex: 14, con: 14, int: 10, wis: 12, cha: 15 });
ch.species = { id: "tiefling", choices: { size: ["medium"], legacy: ["infernal"], spellAbility: ["cha"] } };
ch.background = { id: "criminal", choices: { abilityBonus: ["dex", "con", "int"] } };
ch.classes = [{ id: "warlock", level: 1, subclass: "", choices: { invocations: ["pact-of-the-chain"] } }];
const expectedPact = [[1, 1], [2, 1], [2, 2], [2, 2], [2, 3], [2, 3], [2, 4], [2, 4], [2, 5], [2, 5]];
const expectedInv = [1, 3, 3, 3, 5, 5, 6, 6, 7, 7];
for (let L = 1; L <= 10; L++) {
  ch.classes[0].level = L;
  s = E.compute(ch);
  eq("Pacte niveau " + L, [s.pact.count, s.pact.level], expectedPact[L - 1]);
  eq("Manifestations niveau " + L, s.choices.find((x) => x.key === "invocations").count, expectedInv[L - 1]);
  eq("Pas d'erreur niveau " + L, s.errors, []);
}
ch.classes[0].level = 1;
s = E.compute(ch);
eq("PV occultiste 1 (8 + CON 2)", s.hp.max, 10);
eq("DD des sorts (8 + 2 + 2)", s.casting[0].dc, 12);
eq("Familier présent", s.companions.map((x) => x.id), ["familiar"]);
eq("Appel de familier à volonté", s.spells.find((x) => x.spell.id === "find-familiar").atWill, true);
const inv = s.choices.find((x) => x.key === "invocations");
eq("Décharge déchirante bloquée au niveau 1", inv.options.find((o) => o.id === "agonizing-blast").prerequisite(s.context), "Occultiste niveau 2");
ch.state.companions = { familiar: { form: "imp", damage: 4, custom: {} } };
eq("PV du diablotin", E.compute(ch).companions[0].hp, 17);

ch.classes[0] = { id: "warlock", level: 5, subclass: "fiend", choices: {
  invocations: ["pact-of-the-chain", "agonizing-blast", "armor-of-shadows", "investment-of-the-chain-master", "devils-sight"],
  "invocations/agonizing-blast/cantrip": ["eldritch-blast"],
  feat4: ["ability-score-improvement"], "feat4/ability-score-improvement/asi": ["cha", "cha"] } };
ch.spells = [{ id: "eldritch-blast", source: "warlock" }, { id: "hex", source: "warlock" }];
s = E.compute(ch);
eq("CHA 15 + 2 = 17", s.abilities.cha.score, 17);
eq("Décharge occulte niveau 5", s.spells.find((x) => x.spell.id === "eldritch-blast").damage, "2 rayons de 1d10+3 force");
eq("Armure des ombres (13 + DEX 2)", s.ac.value, 15);
eq("Sorts du Fiélon niveau 5", ["burning-hands", "fireball", "stinking-cloud"].every((id) => s.spells.some((x) => x.spell.id === id)), true);
eq("Pas encore Bouclier de feu", s.spells.some((x) => x.spell.id === "fire-shield"), false);
eq("Vision du diable 36 m", E.meters(s.senses["devils-sight"]), "36 m");
eq("Note d'investiture", s.companions[0].notes.length, 1);
eq("Bénédiction du Ténébreux", s.actions.some((a) => a.actionType === "passive" && /8 PV temporaires/.test(a.description)), true);
// Emplacement de niveau supérieur : Magie de pacte niveau 3 au niveau 5 de classe
const hexAt5 = s.spells.find((x) => x.spell.id === "hex");
eq("Maléfice avec un emplacement de pacte niv. 3", [hexAt5.upcast.slotLevel, hexAt5.upcast.duration], [3, "8 heures"]);
eq("Mains brûlantes à 3 (Fiélon)", s.spells.find((x) => x.spell.id === "burning-hands").damage, "5d6 feu");
eq("Boule de feu au niveau du pacte : rien à afficher", s.spells.find((x) => x.spell.id === "fireball").upcast, undefined);
eq("Texte de règle conservé", /24 heures/.test(hexAt5.upcast.text), true);
eq("Addition de dés", [E.addDice("2d10", "1d10"), E.addDice("3d6", "1d4")], ["3d10", "3d6 + 1d4"]);
eq("Sort d'un lanceur à emplacements normaux : texte seul", E.upcast(DND.data.spells["cure-wounds"]).summary, []);
{
  const sh = { spells: [{ spell: DND.data.spells["hex"] }], spellSlots: [{ level: 1, max: 4 }, { level: 2, max: 3 }, { level: 3, max: 2 }], pact: null };
  eq("Concentration : durée de base", E.concentrationInfo(sh, { concentration: "Maléfice" }), { duration: "1 heure", level: 1, levels: [1, 2, 3], noConcentration: false });
  eq("Concentration : durée à l'emplacement choisi", E.concentrationInfo(sh, { concentration: "Maléfice", concentrationSlot: { name: "Maléfice", level: 3 } }).duration, "8 heures");
  eq("Concentration : choix d'un autre sort ignoré", E.concentrationInfo(sh, { concentration: "Maléfice", concentrationSlot: { name: "Autre", level: 3 } }).duration, "1 heure");
  eq("Concentration : emplacement de pacte", E.concentrationInfo({ spells: [{ spell: DND.data.spells["hex"], upcast: E.upcast(DND.data.spells["hex"], 5) }], spellSlots: [], pact: { level: 5 } }, { concentration: "Maléfice" }), { duration: "24 heures", level: 5, levels: [], noConcentration: false });
  eq("Concentration : sort inconnu", E.concentrationInfo(sh, { concentration: "Truc" }), null);
}
{
  const c = E.newCharacter();
  c.abilities.wis = 16;
  c.classes = [{ id: "cleric", level: 5, subclass: "", choices: {} }];
  c.spells = ["cure-wounds", "prayer-of-healing", "aid", "bless"].map((id) => ({ id, source: "cleric" }));
  const sp = E.compute(c).spells;
  eq("Soins : valeur calculée sur le sort", ["cure-wounds", "prayer-of-healing", "aid", "bless"].map((id) => sp.find((x) => x.spell.id === id).heal), ["2d8+3 PV", "2d8 PV", "+5 PV max et actuels par cible", undefined]);
  const w = E.newCharacter();
  w.abilities.cha = 18;
  w.classes = [{ id: "warlock", level: 5, subclass: "celestial", choices: {} }];
  eq("Soins : emplacement de pacte niv. 3", E.compute(w).spells.find((x) => x.spell.id === "cure-wounds").heal, "2d8+4 (+4d8) PV");
}
eq("Image majeure niv. 4 sans concentration", E.upcast(DND.data.spells["major-image"], 4).noConcentration, true);
eq("Maléfice niv. 2", E.upcast(DND.data.spells.hex, 2).summary, ["durée jusqu'à 4 heures"]);
eq("Armure d'Agathys niv. 3", E.upcast(DND.data.spells["armor-of-agathys"], 3).summary, ["15 PV temporaires et dégâts de froid"]);
eq("Pacte au niveau du sort : rien", E.upcast(DND.data.spells["hold-person"], 2), null);
eq("Tous les sorts améliorés existent", Object.keys(DND.data.spellUpcast).filter((id) => !DND.data.spells[id]), []);
eq("Manifestations affichées en aptitudes", s.features.filter((f) => f.level === null).length, 5);

ch.classes[0].level = 10;
ch.classes[0].choices["sub:fiend/resilience"] = ["cold"];
s = E.compute(ch);
eq("Résistance fiélonne", s.resistances.sort(), ["cold", "fire"]);
eq("Chance du Ténébreux (CHA +3)", s.resources.find((r) => r.id === "warlock.darkLuck").max, 3);
eq("Communication avec le protecteur gratuit", s.resources.some((r) => r.id === "spell:warlock:contact-other-plane"), true);
eq("Tours de magie niveau 10", s.casting[0].cantrips, 4);
eq("Sorts préparés niveau 10", s.casting[0].prepared, 10);
eq("Rouerie magique sans emplacement dépensé : rien", /Aucun/.test(DND.rules.regainPact(ch, s, "warlock.magicalCunning")), true);
ch.state.pactSpent = 2;
s = E.compute(ch);
DND.rules.regainPact(ch, s, "warlock.magicalCunning");
s = E.compute(ch);
eq("Rouerie magique : 1 emplacement de pacte sur 2 récupéré, 1/repos long", [s.pact.spent, s.resources.find((r) => r.id === "warlock.magicalCunning").spent], [1, 1]);
DND.rules.regainPact(ch, s, "warlock.magicalCunning");
eq("Rouerie magique déjà utilisée", E.compute(ch).pact.spent, 1);

// 9 bis. Protecteur Archifée (sous-classe ajoutée par un fichier séparé)
ch.classes = [{ id: "warlock", level: 10, subclass: "archfey", choices: {} }];
s = E.compute(ch);
eq("Archifée disponible", E.subclassesOf(DND.modules.class.warlock).map((x) => x.id), ["fiend", "archfey", "celestial", "great-old-one"]);
eq("Sorts de l'Archifée niv. 9", ["sleep", "blink", "greater-invisibility", "seeming"].every((id) => s.spells.some((x) => x.spell.id === id)), true);
eq("Foulée des fées = mod. CHA (+2)", s.resources.find((r) => r.id === "warlock.stepsOfFey").max, 2);
eq("Charmantes défenses", s.resources.some((r) => r.id === "warlock.beguilingDefenses"), true);
eq("Pas d'erreur Archifée", s.errors, []);

// 9 bis (suite). Protecteurs Céleste et Grand Ancien (fichiers séparés)
ch.classes = [{ id: "warlock", level: 10, subclass: "celestial", choices: {} }];
s = E.compute(ch);
eq("Sorts du Céleste niv. 9", ["light", "sacred-flame", "cure-wounds", "revivify", "guardian-of-faith", "summon-celestial"].every((id) => s.spells.some((x) => x.spell.id === id)), true);
eq("Lumière guérisseuse = 1 + niveau (11 d6)", s.resources.find((r) => r.id === "warlock.healingLight").max, 11);
eq("Âme radiante : résistance radiant", s.resistances.includes("radiant"), true);
eq("Pas d'erreur Céleste", s.errors, []);
ch.classes = [{ id: "warlock", level: 5, subclass: "celestial", choices: {} }];
s = E.compute(ch);
eq("Céleste niv. 5 : pas encore Gardien de la foi", s.spells.some((x) => x.spell.id === "guardian-of-faith"), false);
eq("Céleste niv. 5 : pas encore Âme radiante", s.resistances.includes("radiant"), false);

ch.classes = [{ id: "warlock", level: 10, subclass: "great-old-one", choices: {} }];
s = E.compute(ch);
eq("Sorts du Grand Ancien niv. 9", ["detect-thoughts", "dissonant-whispers", "hideous-laughter", "clairvoyance", "confusion", "telekinesis", "hex"].every((id) => s.spells.some((x) => x.spell.id === id)), true);
eq("Combattant clairvoyant : repos court", s.resources.find((r) => r.id === "warlock.clairvoyantCombatant").recharge, "short");
eq("Bouclier mental : résistance psychique", s.resistances.includes("psychic"), true);
eq("Esprit éveillé : action bonus", s.actions.some((a) => a.name.fr === "Esprit éveillé" && a.actionType === "bonus"), true);
eq("Pas d'erreur Grand Ancien", s.errors, []);

// 9 ter. Historiques du Manuel des joueurs 2024 et leurs dons d'origine
for (const id of ["acolyte", "artisan", "charlatan", "criminal", "entertainer", "farmer", "guard", "guide", "hermit", "merchant", "noble", "sage", "sailor", "scribe", "soldier", "wayfarer"])
  eq("Historique chargé : " + id, !!DND.modules.background[id], true);
ch = E.newCharacter();
ch.species = { id: "human", choices: { size: ["medium"], skill: ["skill.arcana"], originFeat: ["tough"] } };
ch.background = { id: "charlatan", choices: { abilityBonus: ["cha", "cha", "dex"],
  "feat:skilled/proficiencies": ["skill.persuasion", "skill.insight", "tool.disguise-kit"] } };
ch.classes = [{ id: "test-fighter", level: 2, choices: {} }];
s = E.compute(ch);
eq("Charlatan : Tromperie maîtrisée", s.skills.deception.prof, 1);
eq("Charlatan : Doué (Persuasion)", s.skills.persuasion.prof, 1);
eq("Charlatan : Matériel de contrefaçon", JSON.stringify(s.proficiencies).includes("tool.forgery-kit"), true);
eq("Robuste : +2 PV/niveau", s.hp.max, 10 + 6 + 2 * 2);
eq("Pas d'erreur Charlatan", s.errors, []);
ch.background = { id: "merchant", choices: {} };
s = E.compute(ch);
eq("Chanceux : points = bonus de maîtrise", s.resources.find((r) => /luck$/.test(r.id)).max, 2);
ch.background = { id: "entertainer", choices: {} };
s = E.compute(ch);
eq("Musicien : 3 instruments au choix", s.choices.find((c) => /instruments$/.test(c.key)).count, 3);
eq("Artiste : 10 instruments proposés", s.choices.find((c) => c.key === "tool").options.length, 10);
ch.background = { id: "guide", choices: {} };
s = E.compute(ch);
eq("Guide : Initié à la magie (Druide)", s.choices.find((c) => /magic-initiate\/cantrips$/.test(c.key)).options.every((o) => o.lists.includes("druid")), true);

// 10. Multiclassage Occultiste 3 / Mage test 2
ch.classes = [{ id: "warlock", level: 3, choices: {} }, { id: "test-wizard", level: 2, choices: {} }];
s = E.compute(ch);
eq("Emplacements du mage seuls", s.spellSlots.map((x) => x.max), [3]);
eq("Pacte séparé", [s.pact.count, s.pact.level], [2, 2]);

// 11. Charge, dés de vie, couleur de classe
ch = E.newCharacter();
Object.assign(ch.abilities, { str: 10, dex: 14, con: 14, int: 10, wis: 10, cha: 16 });
ch.species = { id: "goliath", choices: { ancestry: ["stone"] } };
ch.classes = [{ id: "warlock", level: 3, choices: {} }];
ch.inventory = [{ id: "explorers-pack", qty: 1 }, { id: "dagger", qty: 2 }, { name: "Grimoire maudit", qty: 1, weight: 4 },
  { id: "bag-of-holding", qty: 1 }, { id: "thieves-tools", qty: 1, inBag: true }];
ch.coins.gp = 100;
s = E.compute(ch);
eq("Capacité goliath FOR 10 (taille +1 : ×2)", s.load.capacity, 300);
eq("Pousser/soulever", s.load.push, 600);
eq("Poids des pièces (100 po)", s.load.coins, 2);
eq("Charge : paquetage 55 + 2 dagues + objet libre 4 + sac 5 + pièces 2", s.load.carried, 55 + 2 + 4 + 5 + 2);
eq("Contenu du sac sans fond", s.load.bag.contents, 1);
ch.settings.coinsInBag = true;
s = E.compute(ch);
eq("Pièces dans le sac", [s.load.carried, s.load.bag.contents], [66, 3]);
ch.species = { id: "human", choices: { size: ["small"] } };
s = E.compute(ch);
eq("Capacité humain petit FOR 10", s.load.capacity, 150);
eq("Couleur de classe par défaut", s.accent, "#6b3fa0");

// Harmonisation : 3 par défaut, maximum saisi, alerte au-delà
eq("Harmonisation : 0 / 3", [s.attunement.count, s.attunement.max], [0, 3]);
ch.inventory.forEach((it) => { it.attuned = true; });
s = E.compute(ch);
eq("5 objets harmonisés sur 3 : alerte", [s.attunement.count, s.warnings.some((w) => /harmonisés/.test(w))], [5, true]);
ch.settings.attunementMax = 5;
s = E.compute(ch);
eq("Maximum saisi 5 : plus d'alerte", [s.attunement.max, s.attunement.auto, s.warnings.some((w) => /harmonisés/.test(w))], [5, 3, false]);
ch.settings.attunementMax = "";
eq("Maximum vide : retour à l'automatique", E.compute(ch).attunement.max, 3);
ch.settings.accent = "#123456";
eq("Couleur choisie", E.compute(ch).accent, "#123456");
s = E.compute(ch);
DND.rules.adjustHitDie(ch, s, "d8", 1); s = E.compute(ch); DND.rules.adjustHitDie(ch, s, "d8", 1);
s = E.compute(ch);
eq("Dés de vie dépensés", s.hitDice[0].spent, 2);
DND.rules.adjustHitDie(ch, s, "d8", -1);
s = E.compute(ch);
eq("Dé de vie récupéré à la main", s.hitDice[0].spent, 1);
DND.rules.adjustHitDie(ch, s, "d8", 9);
s = E.compute(ch);
eq("Plafond des dés de vie", s.hitDice[0].spent, 3);
DND.rules.longRest(ch, s);
eq("Repos long : dés de vie récupérés", E.compute(ch).hitDice[0].spent, 0);
eq("Lien AideDD du familier", DND.config.monsterUrl({ name: { fr: "Esprit follet ★" } }), "https://www.aidedd.org/monster/fr/esprit-follet");

// 12. Langues rares facultatives
ch = E.newCharacter();
ch.classes = [{ id: "warlock", level: 1, choices: {} }];
ch.choices.languages = ["language.halfling"];
let before = E.compute(ch).pendingChoices;
ch.choices.languages = ["language.halfling", "language.sylvan"];
s = E.compute(ch);
eq("Deux langues dont une rare : plus de choix en attente", s.pendingChoices, before - 1);
ch.choices.languages.push("language.infernal");
s = E.compute(ch);
eq("Langue en plus acceptée", ["language.halfling", "language.infernal", "language.sylvan"].every((l) => s.proficiencies.languages.includes(l)), true);
const old = E.normalize({ choices: { languages: ["language.elvish"], extraLanguages: ["language.infernal"] } });
eq("Ancienne liste fusionnée", old.choices, { languages: ["language.elvish", "language.infernal"] });

// 13. Dons généraux, de style de combat et faveurs épiques (AideDD)
ch = E.newCharacter();
Object.assign(ch.abilities, { str: 8, dex: 14, con: 14, int: 12, wis: 10, cha: 15 });
ch.classes = [{ id: "warlock", level: 4, subclass: "", choices: { feat4: ["fey-touched"], "feat4/fey-touched/ability": ["cha"], "feat4/fey-touched/spell": ["hex"] } }];
s = E.compute(ch);
const feat4 = s.choices.find((x) => x.key === "feat4");
eq("Dons proposés au niveau 4 (origine + généraux)", feat4.options.length, 53);
eq("Pas de style de combat ni de faveur épique au niveau 4", feat4.options.some((o) => o.category === "fighting-style" || o.category === "epic-boon"), false);
const opt = (id) => feat4.options.find((o) => o.id === id);
eq("Mage de guerre accessible à l'occultiste", opt("war-caster").prerequisite(s.context), true);
eq("Athlète : FOR ou DEX 13 (DEX 14)", opt("athlete").prerequisite(s.context), true);
eq("Maître des armes lourdes bloqué (FOR 8)", opt("great-weapon-master").prerequisite(s.context), "Niveau 4, Force 13");
eq("Protection intermédiaire : formation légère de l'occultiste", opt("moderately-armored").prerequisite(s.context), true);
eq("Protection lourde bloquée sans armures intermédiaires", opt("heavily-armored").prerequisite(s.context), "Niveau 4, formation aux armures intermédiaires");
eq("Affinité féerique : CHA 15 + 1", s.abilities.cha.score, 16);
eq("Affinité féerique : Foulée brumeuse gratuite", !!s.spells.find((x) => x.spell.id === "misty-step" && x.freeCast && x.ability === "cha"), true);
eq("Affinité féerique : Maléfice gratuit", !!s.spells.find((x) => x.spell.id === "hex" && x.freeCast), true);
eq("Affinité féerique : sorts proposés = Divination/Enchantement niv. 1",
  s.choices.find((x) => x.key === "feat4/fey-touched/spell").options.every((o) => ["divination", "enchantment"].includes(DND.data.spells[o.id].school) && DND.data.spells[o.id].level === 1), true);

ch.classes[0].choices = { feat4: ["resilient"], "feat4/resilient/ability": ["con"] };
s = E.compute(ch);
eq("Résilient : CON 15 et JS maîtrisé", [s.abilities.con.score, s.abilities.con.save.proficient], [15, true]);
ch.classes[0].choices = { feat4: ["keen-mind"], "feat4/keen-mind/skill": ["expertise.arcana"] };
ch.abilities.int = 13;
s = E.compute(ch);
eq("Esprit affûté : INT 14, expertise en Arcanes", [s.abilities.int.score, s.prof["skill.arcana"]], [14, 2]);
ch.classes[0].choices = { feat4: ["speedy"], "feat4/speedy/ability": ["dex"] };
s = E.compute(ch);
eq("Mobile : vitesse 40 pieds", s.speed.walk, 40);
ch.classes[0].choices = { feat4: ["telepathic"], "feat4/telepathic/ability": ["int"] };
s = E.compute(ch);
eq("Télépathe : Détection des pensées gratuite (INT)", !!s.spells.find((x) => x.spell.id === "detect-thoughts" && x.freeCast && x.ability === "int"), true);
eq("Pas d'erreur avec les nouveaux dons", s.errors, []);

ch.feats = [{ id: "defense", choices: {} }];
ch.inventory = [{ id: "leather", qty: 1, equipped: true }];
s = E.compute(ch);
eq("Défense : +1 CA en armure", s.ac.parts.some((p) => p.label === "Défense" && p.value === 1), true);
ch.inventory = [];
eq("Défense : rien sans armure", E.compute(ch).ac.parts.some((p) => p.label === "Défense"), false);
ch.feats = [{ id: "boon-of-fortitude", choices: { ability: ["con"] } }];
eq("Faveur de vigueur bloquée avant le niveau 19", DND.modules.feat["boon-of-fortitude"].prerequisite(E.compute(ch).context), "Niveau 19");
eq("Nombre total de dons", Object.keys(DND.modules.feat).length, 75);

// Guerrier, Clerc, Paladin, Ensorceleur, Artificier : tests/classes.js
require("./classes.js")(DND, eq);
// Barbare, Barde, Druide, Magicien, Moine, Rôdeur, Roublard : tests/classes2.js
require("./classes2.js")(DND, eq);

// Espèces de Monsters of the Multiverse : Duergar et Génasi
ch = E.newCharacter();
Object.assign(ch.abilities, { str: 10, dex: 14, con: 14, int: 10, wis: 10, cha: 16 });
ch.classes = [{ id: "warlock", level: 5, choices: {} }];
ch.species = { id: "duergar", choices: { spellAbility: ["cha"] } };
s = E.compute(ch);
eq("Duergar : vision 36 m, résistance poison", [E.meters(s.senses.darkvision), s.resistances], ["36 m", ["poison"]]);
eq("Duergar niv. 5 : Agrandissement et Invisibilité gratuits (CHA)",
  ["enlarge-reduce", "invisibility"].map((id) => !!s.spells.find((x) => x.spell.id === id && x.freeCast && x.ability === "cha")), [true, true]);
ch.classes[0].level = 3;
eq("Duergar niv. 3 : pas encore d'Invisibilité", E.compute(ch).spells.some((x) => x.spell.id === "invisibility"), false);
ch.classes[0].level = 5;
ch.species = { id: "genasi", choices: { size: ["small"], lineage: ["air"], spellAbility: ["int"] } };
s = E.compute(ch);
eq("Génasi de l'air : vitesse 35, foudre, vision 18 m", [s.speed.walk, s.resistances, s.senses.darkvision], [35, ["lightning"], 60]);
eq("Génasi de l'air : sorts", ["shocking-grasp", "feather-fall", "levitate"].map((id) => !!s.spells.find((x) => x.spell.id === id && x.ability === "int")), [true, true, true]);
ch.species.choices.lineage = ["earth"];
s = E.compute(ch);
eq("Génasi de la terre : Voile défensif en action bonus = bonus de maîtrise", s.resources.find((r) => r.id.endsWith("mergeWithStone")).max, 3);
eq("Génasi de la terre : Passage sans trace gratuit", !!s.spells.find((x) => x.spell.id === "pass-without-trace" && x.freeCast), true);
ch.species.choices.lineage = ["fire"];
s = E.compute(ch);
eq("Génasi du feu : feu, Flammes 2d8 au niv. 5, Lame de feu", [s.resistances, s.spells.find((x) => x.spell.id === "produce-flame").damage, !!s.spells.find((x) => x.spell.id === "flame-blade")],
  [["fire"], "2d8 feu", true]);
ch.species.choices.lineage = ["water"];
s = E.compute(ch);
eq("Génasi de l'eau : acide, nage 30", [s.resistances, s.speed.swim], [["acid"], 30]);
eq("Lien AideDD Marche sur l'eau", DND.config.spellUrl(DND.data.spells["water-walk"]), "https://www.aidedd.org/spell/fr/marche-sur-l-eau-marche-sur-l-onde");
eq("Pas d'erreur avec Duergar et Génasi", s.errors, []);

// Rappels en jeu et avantages contre les états
ch = E.newCharacter();
ch.species = { id: "halfling", choices: {} };
ch.classes = [{ id: "warlock", level: 3, subclass: "archfey", choices: {} }];
s = E.compute(ch);
eq("Halfelin : Brave = avantage contre Effrayé", s.conditionDefenses.frightened, [{ kind: "advantage", label: "Brave · Halfelin" }]);
eq("Halfelin : Chanceux dans les actions passives", s.actions.some((a) => a.name.fr === "Chanceux" && a.actionType === "passive" && /relancez/.test(a.description)), true);
ch.conditionDefenses = [{ condition: "charmed", kind: "advantage", label: "Cape de test" }, { condition: "nope", kind: "advantage" }];
ch.classes[0].level = 10;
s = E.compute(ch);
eq("Saisie manuelle + Charmantes défenses (immunité)", s.conditionDefenses.charmed.map((d) => d.kind + ":" + d.label),
  ["immunity:Charmantes défenses · Occultiste (Protecteur Archifée)", "advantage:Cape de test"]);
eq("État inconnu ignoré", Object.keys(s.conditionDefenses).sort(), ["charmed", "frightened"]);
ch.species = { id: "duergar", choices: { spellAbility: ["cha"] } };
eq("Duergar : Empoisonné, Charmé, Étourdi", Object.keys(E.compute(ch).conditionDefenses).sort(), ["charmed", "poisoned", "stunned"]);
ch.species = { id: "shadar-kai", choices: {} };
s = E.compute(ch);
eq("Shadar-kai : nécrotique, vision 18 m, avantage Charmé", [s.resistances, s.senses.darkvision, s.conditionDefenses.charmed.some((d) => d.kind === "advantage")], [["necrotic"], 60, true]);
eq("Shadar-kai : Bénédiction = bonus de maîtrise, action bonus", [s.resources.find((r) => r.id.endsWith("ravenQueen")).max, s.actions.some((a) => a.name.fr === "Bénédiction de la Reine Corbeau" && a.actionType === "bonus")], [4, true]);
eq("Shadar-kai : maîtrise de Perception", s.skills.perception.prof, 1);
eq("Pas d'erreur avec Shadar-kai", s.errors, []);


// Bourse : dépense avec change
const R = DND.rules;
eq("Lecture « 24 pa »", R.parseCoins("24pa", "gp"), [["sp", 24]]);
eq("Lecture « 1 po et 5 pa » / nombre seul / illisible", [R.parseCoins("1 po et 5 pa", "gp"), R.parseCoins("3", "cp"), R.parseCoins("2,5 po", "gp"), R.parseCoins("abc", "gp")],
  [[["gp", 1], ["sp", 5]], [["cp", 3]], null, null]);
ch = E.newCharacter();
ch.coins = { pp: 0, gp: 3, ep: 0, sp: 4, cp: 0 };
let m = R.spendCoins(ch, [["sp", 24]]);
eq("24 pa avec 3 po 4 pa : 2 po cassées", [ch.coins.gp, ch.coins.sp, ch.coins.cp], [1, 0, 0]);
eq("Message de dépense", m, "24 pa dépensés. Bourse : −2 po, −4 pa.");
ch.coins = { pp: 1, gp: 0, ep: 0, sp: 0, cp: 0 };
R.spendCoins(ch, [["sp", 3]]);
eq("3 pa avec 1 pp : monnaie rendue en pa", ch.coins, { pp: 0, gp: 0, ep: 0, sp: 97, cp: 0 });
ch.coins = { pp: 0, gp: 1, ep: 1, sp: 0, cp: 0 };
R.spendCoins(ch, [["sp", 2]]);
eq("La plus petite pièce cassée d'abord (pe avant po)", ch.coins, { pp: 0, gp: 1, ep: 0, sp: 3, cp: 0 });
ch.coins = { pp: 0, gp: 1, ep: 0, sp: 0, cp: 200 };
R.spendCoins(ch, [["sp", 24]]);
eq("Pièces plus petites en dernier recours", ch.coins, { pp: 0, gp: 0, ep: 0, sp: 0, cp: 60 });
ch.coins = { pp: 0, gp: 1, ep: 0, sp: 5, cp: 0 };
m = R.spendCoins(ch, [["gp", 2]]);
eq("Fonds insuffisants : refus, bourse intacte", [/^Fonds insuffisants/.test(m), /1 po 5 pa/.test(m), ch.coins.gp, ch.coins.sp], [true, true, 1, 5]);
R.spendCoins(ch, [["gp", 1], ["sp", 5]]);
eq("Dépense mixte 1 po 5 pa", [ch.coins.gp, ch.coins.sp], [0, 0]);
m = R.receiveCoins(ch, [["gp", 12], ["cp", 3]]);
eq("Recevoir 12 po 3 pc", [ch.coins.gp, ch.coins.cp, m], [12, 3, "Bourse : +12 po, +3 pc."]);

ch = E.newCharacter();
ch.abilities.wis = 14;
ch.extraProfs = ["skill.survival", "tool.herbalism-kit"];
s = E.compute(ch);
eq("Maîtrises supplémentaires : compétence", [s.skills.survival.bonus, s.prof["tool.herbalism-kit"]], [4, 1]);
ch.abilities.str = 19;
ch.extraAbilities = { str: 2, dex: 1 };
s = E.compute(ch);
eq("Bonus de caractéristique supplémentaires (max 20)", [s.abilities.str.score, s.abilities.dex.score], [20, 11]);
eq("Maîtrises supplémentaires : normalisées", E.normalize({}).extraProfs, []);

ch = E.newCharacter();
ch.classes = [{ id: "sorcerer", level: 5, choices: {} }];
ch.inventory = [{ id: "shield", qty: 1, equipped: true }, { id: "greatsword", qty: 1, equipped: true }];
s = E.compute(ch);
eq("Bouclier non maîtrisé : pas de bonus de CA", [s.ac.value, s.warnings.some((w) => /Bouclier non maîtrisé/.test(w))], [10, true]);
eq("Arme lourde, Force < 13 : avertissement", s.warnings.some((w) => /Lourde/.test(w)), true);
const spId = s.resources.find((r) => r.slotCreate).id;
eq("Ensorceleur 5 : coûts de création", s.resources.find((r) => r.id === spId).slotCreate, { 1: 2, 2: 3, 3: 5 });
R.createSlot(ch, s, spId, 4);
eq("Création niv. 4 refusée au niveau 5", Object.keys(ch.state.slotsExtra).length, 0);
R.createSlot(ch, s, spId, 3);
s = E.compute(ch);
eq("Ensorceleur 5 : emplacement niv. 3 créé pour 5 points", [s.spellSlots.map((x) => x.max), s.spellSlots[2].extra, s.resources.find((r) => r.id === spId).spent], [[4, 3, 3], 1, 5]);
eq("Création sans points : refusée", /Il faut 2/.test(R.createSlot(ch, s, spId, 1)), true);
eq("Unité des points", [R.qty(1, s.resources.find((r) => r.id === spId)), R.qty(5, s.resources.find((r) => r.id === spId))], ["1 pt", "5 pts"]);
R.convertSlot(ch, s, spId, 2);
s = E.compute(ch);
eq("Conversion niv. 2 : +2 points, emplacement dépensé", [s.resources.find((r) => r.id === spId).spent, s.spellSlots[1].spent], [3, 1]);
R.restoreResource(ch, s, "sorcerer.sorcerousRestoration");
s = E.compute(ch);
eq("Restauration ensorcelée niv. 5 : +2 points, 1/repos long", [s.resources.find((r) => r.id === spId).spent, s.resources.find((r) => r.id === "sorcerer.sorcerousRestoration").spent], [1, 1]);
R.restoreResource(ch, s, "sorcerer.sorcerousRestoration");
eq("Restauration ensorcelée déjà utilisée", E.compute(ch).resources.find((r) => r.id === spId).spent, 1);
s = E.compute(ch);
R.addSlot(ch, s, 3, 1);
eq("Bouton + absent sans extraSlots", E.compute(ch).spellSlots[2].extra, 1);
s = E.compute(ch);
R.longRest(ch, s);
eq("Repos long : emplacements créés perdus", E.compute(ch).spellSlots.map((x) => x.max), [4, 3, 2]);
ch.state.exhaustion = 2;
s = E.compute(ch);
eq("Épuisement 2 : −4 aux tests d20, DD et passives inchangés", [s.abilities.dex.save.bonus, s.skills.stealth.bonus, s.initiative.bonus, s.passive.perception, s.casting[0].attack, s.casting[0].dc], [-4, -4, -4, 10, -1, 11]);

ch = E.newCharacter();
ch.abilities = { str: 15, dex: 10, con: 12, int: 10, wis: 16, cha: 13 };
ch.classes = [{ id: "cleric", level: 3, choices: {} }, { id: "paladin", level: 3, choices: {} }];
s = E.compute(ch);
eq("Multiclassage : niveau de sort préparable par classe", [s.spellSlots.length, s.casting.map((x) => x.maxSpellLevel)], [3, [2, 1]]);
ch.classes = [{ id: "fighter", level: 7, subclass: "eldritch-knight", choices: {} }];
eq("Chevalier occulte 7 : sorts de niveau 2", E.compute(ch).casting[0].maxSpellLevel, 2);

ch = E.newCharacter();
ch.classes = [{ id: "warlock", level: 5, choices: {} }];
ch.state.concentration = "Maléfice";
s = E.compute(ch);
R.damage(ch, s, s.hp.max);
eq("0 PV : concentration perdue, inconscient", [ch.state.concentration, ch.state.conditions], ["", ["unconscious"]]);
R.stabilize(ch);
R.damage(ch, E.compute(ch), 1);
eq("Dégâts sur un personnage stable : réussites effacées, un échec", ch.state.deathSaves, { success: 0, failure: 1 });
R.heal(ch, E.compute(ch), 5);
s = E.compute(ch);
R.damage(ch, s, s.hp.current + s.hp.max);
eq("Dégâts massifs : mort", ch.state.deathSaves.failure, 3);

ch = E.newCharacter();
ch.abilities.cha = 16;
ch.species = { id: "aasimar", choices: {} };
ch.classes = [{ id: "paladin", level: 3, choices: {} }];
s = E.compute(ch);
eq("Aasimar : résistances, vision, Lumière, Révélation au niveau 3", [s.resistances, s.senses.darkvision, s.spells.some((x) => x.spell.id === "light"), s.resources.some((r) => r.id === "aasimar.revelation")], [["necrotic", "radiant"], 60, true, true]);
ch.classes[0].level = 2;
eq("Aasimar niveau 2 : pas de Révélation", E.compute(ch).resources.some((r) => r.id === "aasimar.revelation"), false);

console.log((count - failures) + " / " + count + " tests réussis.");
process.exit(failures ? 1 : 0);
