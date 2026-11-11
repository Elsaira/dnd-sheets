// Armes et armures du SRD 5.2. Distances en pieds (affichées en mètres), poids en livres
// (affichés en kg, 1 lb = 0,5 kg comme dans les livres français).

DND.data.masteries = {
  cleave: { fr: "Enchaînement", en: "Cleave", summary: "Si l'attaque touche, une 2e attaque contre une autre créature à 1,5 m de la première (sans le modificateur aux dégâts). 1 fois par tour." },
  graze: { fr: "Écorchure", en: "Graze", summary: "Si l'attaque rate, la cible subit quand même des dégâts égaux au modificateur de caractéristique." },
  nick: { fr: "Coup double", en: "Nick", summary: "L'attaque supplémentaire de la propriété Légère fait partie de l'action Attaque. 1 fois par tour." },
  push: { fr: "Poussée", en: "Push", summary: "Si l'attaque touche, repousse la cible (Grande ou plus petite) de 3 m." },
  sap: { fr: "Sape", en: "Sap", summary: "Si l'attaque touche, la cible a le désavantage à sa prochaine attaque avant votre prochain tour." },
  slow: { fr: "Ralentissement", en: "Slow", summary: "Si l'attaque touche et inflige des dégâts, vitesse de la cible -3 m jusqu'à votre prochain tour." },
  topple: { fr: "Renversement", en: "Topple", summary: "Si l'attaque touche, la cible fait un JS de Constitution (DD 8 + mod. + bonus de maîtrise) ou tombe À terre." },
  vex: { fr: "Ouverture", en: "Vex", summary: "Si l'attaque touche et inflige des dégâts, avantage à votre prochaine attaque contre cette cible avant la fin de votre prochain tour." },
};

// Bottes des armes choisies, une ligne « Arme (botte) : effet » par arme, DD du Renversement calculé.
DND.masteryLines = function (ids, c) {
  const lines = (ids || []).map((id) => {
    const w = DND.data.weapons[id], m = w && DND.data.masteries[w.mastery];
    if (!m) return null;
    let text = m.summary;
    if (w.mastery === "topple") {
      const finesse = (w.props || []).includes("finesse"), ranged = w.type === "ranged";
      const mod = ranged ? c.mod.dex : finesse ? Math.max(c.mod.str, c.mod.dex) : c.mod.str;
      text = text.replace("(DD 8 + mod. + bonus de maîtrise)", "DD " + (8 + mod + c.pb));
    }
    return w.name.fr + " (" + m.fr + ") : " + text;
  }).filter(Boolean);
  return lines.length ? lines : "Aucune arme choisie : choisissez vos bottes dans la partie Création.";
};

DND.registerLabels({
  "prop.ammunition": { fr: "Munitions", en: "Ammunition" }, "prop.finesse": { fr: "Finesse", en: "Finesse" },
  "prop.heavy": { fr: "Lourde", en: "Heavy" }, "prop.light": { fr: "Légère", en: "Light" },
  "prop.loading": { fr: "Chargement", en: "Loading" }, "prop.reach": { fr: "Allonge", en: "Reach" },
  "prop.thrown": { fr: "Lancer", en: "Thrown" }, "prop.two-handed": { fr: "À deux mains", en: "Two-Handed" },
  "prop.versatile": { fr: "Polyvalente", en: "Versatile" },
});

// category: simple | martial ; type: melee | ranged
const W = (id, fr, en, category, type, damage, damageType, props, mastery, weight, extra) =>
  ({ id, name: { fr, en }, category, type, damage, damageType, props, mastery, weight, ...extra });

for (const w of [
  W("club", "Gourdin", "Club", "simple", "melee", "1d4", "bludgeoning", ["light"], "slow", 2),
  W("dagger", "Dague", "Dagger", "simple", "melee", "1d4", "piercing", ["finesse", "light", "thrown"], "nick", 1, { range: [20, 60] }),
  W("greatclub", "Massue", "Greatclub", "simple", "melee", "1d8", "bludgeoning", ["two-handed"], "push", 10),
  W("handaxe", "Hachette", "Handaxe", "simple", "melee", "1d6", "slashing", ["light", "thrown"], "vex", 2, { range: [20, 60] }),
  W("javelin", "Javeline", "Javelin", "simple", "melee", "1d6", "piercing", ["thrown"], "slow", 2, { range: [30, 120] }),
  W("light-hammer", "Marteau léger", "Light Hammer", "simple", "melee", "1d4", "bludgeoning", ["light", "thrown"], "nick", 2, { range: [20, 60] }),
  W("mace", "Masse d'armes", "Mace", "simple", "melee", "1d6", "bludgeoning", [], "sap", 4),
  W("quarterstaff", "Bâton", "Quarterstaff", "simple", "melee", "1d6", "bludgeoning", ["versatile"], "topple", 4, { versatile: "1d8" }),
  W("sickle", "Serpe", "Sickle", "simple", "melee", "1d4", "slashing", ["light"], "nick", 2),
  W("spear", "Lance", "Spear", "simple", "melee", "1d6", "piercing", ["thrown", "versatile"], "sap", 3, { range: [20, 60], versatile: "1d8" }),
  W("dart", "Fléchette", "Dart", "simple", "ranged", "1d4", "piercing", ["finesse", "thrown"], "vex", 0.25, { range: [20, 60] }),
  W("light-crossbow", "Arbalète légère", "Light Crossbow", "simple", "ranged", "1d8", "piercing", ["ammunition", "loading", "two-handed"], "slow", 5, { range: [80, 320] }),
  W("shortbow", "Arc court", "Shortbow", "simple", "ranged", "1d6", "piercing", ["ammunition", "two-handed"], "vex", 2, { range: [80, 320] }),
  W("sling", "Fronde", "Sling", "simple", "ranged", "1d4", "bludgeoning", ["ammunition"], "slow", 0, { range: [30, 120] }),
  W("battleaxe", "Hache d'armes", "Battleaxe", "martial", "melee", "1d8", "slashing", ["versatile"], "topple", 4, { versatile: "1d10" }),
  W("flail", "Fléau d'armes", "Flail", "martial", "melee", "1d8", "bludgeoning", [], "sap", 2),
  W("glaive", "Coutille", "Glaive", "martial", "melee", "1d10", "slashing", ["heavy", "reach", "two-handed"], "graze", 6),
  W("greataxe", "Hache à deux mains", "Greataxe", "martial", "melee", "1d12", "slashing", ["heavy", "two-handed"], "cleave", 7),
  W("greatsword", "Épée à deux mains", "Greatsword", "martial", "melee", "2d6", "slashing", ["heavy", "two-handed"], "graze", 6),
  W("halberd", "Hallebarde", "Halberd", "martial", "melee", "1d10", "slashing", ["heavy", "reach", "two-handed"], "cleave", 6),
  W("lance", "Lance d'arçon", "Lance", "martial", "melee", "1d10", "piercing", ["heavy", "reach", "two-handed"], "topple", 6),
  W("longsword", "Épée longue", "Longsword", "martial", "melee", "1d8", "slashing", ["versatile"], "sap", 3, { versatile: "1d10" }),
  W("maul", "Maillet d'armes", "Maul", "martial", "melee", "2d6", "bludgeoning", ["heavy", "two-handed"], "topple", 10),
  W("morningstar", "Morgenstern", "Morningstar", "martial", "melee", "1d8", "piercing", [], "sap", 4),
  W("pike", "Pique", "Pike", "martial", "melee", "1d10", "piercing", ["heavy", "reach", "two-handed"], "push", 18),
  W("rapier", "Rapière", "Rapier", "martial", "melee", "1d8", "piercing", ["finesse"], "vex", 2),
  W("scimitar", "Cimeterre", "Scimitar", "martial", "melee", "1d6", "slashing", ["finesse", "light"], "nick", 3),
  W("shortsword", "Épée courte", "Shortsword", "martial", "melee", "1d6", "piercing", ["finesse", "light"], "vex", 2),
  W("trident", "Trident", "Trident", "martial", "melee", "1d8", "piercing", ["thrown", "versatile"], "topple", 4, { range: [20, 60], versatile: "1d10" }),
  W("warhammer", "Marteau de guerre", "Warhammer", "martial", "melee", "1d8", "bludgeoning", ["versatile"], "push", 5, { versatile: "1d10" }),
  W("war-pick", "Pic de guerre", "War Pick", "martial", "melee", "1d8", "piercing", ["versatile"], "sap", 2, { versatile: "1d10" }),
  W("whip", "Fouet", "Whip", "martial", "melee", "1d4", "slashing", ["finesse", "reach"], "slow", 3),
  W("blowgun", "Sarbacane", "Blowgun", "martial", "ranged", "1", "piercing", ["ammunition", "loading"], "vex", 1, { range: [25, 100] }),
  W("hand-crossbow", "Arbalète de poing", "Hand Crossbow", "martial", "ranged", "1d6", "piercing", ["ammunition", "light", "loading"], "vex", 3, { range: [30, 120] }),
  W("heavy-crossbow", "Arbalète lourde", "Heavy Crossbow", "martial", "ranged", "1d10", "piercing", ["ammunition", "heavy", "loading", "two-handed"], "push", 18, { range: [100, 400] }),
  W("longbow", "Arc long", "Longbow", "martial", "ranged", "1d8", "piercing", ["ammunition", "heavy", "two-handed"], "slow", 2, { range: [150, 600] }),
  W("musket", "Mousquet", "Musket", "martial", "ranged", "1d12", "piercing", ["ammunition", "loading", "two-handed"], "slow", 10, { range: [40, 120] }),
  W("pistol", "Pistolet", "Pistol", "martial", "ranged", "1d10", "piercing", ["ammunition", "loading"], "vex", 3, { range: [30, 90] }),
]) DND.data.weapons[w.id] = w;

// base : CA de base ; dexMax : plafond du bonus de Dex (null = illimité, 0 = pas de Dex)
const A = (id, fr, en, category, base, dexMax, weight, extra) =>
  ({ id, name: { fr, en }, category, base, dexMax, weight, ...extra });

for (const a of [
  A("padded", "Armure matelassée", "Padded Armor", "light", 11, null, 8, { stealthDisadvantage: true }),
  A("leather", "Armure de cuir", "Leather Armor", "light", 11, null, 10),
  A("studded-leather", "Armure de cuir clouté", "Studded Leather Armor", "light", 12, null, 13),
  A("hide", "Armure de peaux", "Hide Armor", "medium", 12, 2, 12),
  A("chain-shirt", "Chemise de mailles", "Chain Shirt", "medium", 13, 2, 20),
  A("scale-mail", "Armure d'écailles", "Scale Mail", "medium", 14, 2, 45, { stealthDisadvantage: true }),
  A("breastplate", "Cuirasse", "Breastplate", "medium", 14, 2, 20),
  A("half-plate", "Demi-plate", "Half Plate Armor", "medium", 15, 2, 40, { stealthDisadvantage: true }),
  A("ring-mail", "Broigne", "Ring Mail", "heavy", 14, 0, 40, { stealthDisadvantage: true }),
  A("chain-mail", "Cotte de mailles", "Chain Mail", "heavy", 16, 0, 55, { strength: 13, stealthDisadvantage: true }),
  A("splint", "Clibanion", "Splint Armor", "heavy", 17, 0, 60, { strength: 15, stealthDisadvantage: true }),
  A("plate", "Harnois", "Plate Armor", "heavy", 18, 0, 65, { strength: 15, stealthDisadvantage: true }),
  A("shield", "Bouclier", "Shield", "shield", 2, 0, 6),
]) DND.data.armor[a.id] = a;

// Équipement d'aventurier, paquetages et objets magiques courants (poids en livres).
// Valeurs du Manuel des joueurs 2024 vérifiées sur AideDD le 2026-10-15 (fiches-dnd-verif/equipement.md).
// holds : capacité d'un contenant extradimensionnel (son contenu ne compte pas dans la charge).
const G = (id, fr, en, category, weight, extra) => ({ id, name: { fr, en }, category, weight, ...extra });

for (const g of [
  G("burglars-pack", "Paquetage de cambrioleur", "Burglar's Pack", "pack", 42, { contents: "Sac à dos, billes, boîte à amadou, 10 bougies, cloche, corde, 7 flasques d'huile, lanterne à capote, outre, pied-de-biche, 5 jours de rations." }),
  G("diplomats-pack", "Paquetage de diplomate", "Diplomat's Pack", "pack", 39, { contents: "Beaux habits, boîte à amadou, coffre, encre, 2 étuis à cartes et à parchemins, 5 feuilles de papier, 5 feuilles de parchemin, 4 flasques d'huile, lampe, 5 porte-plume, parfum." }),
  G("dungeoneers-pack", "Paquetage d'exploration souterraine", "Dungeoneer's Pack", "pack", 55, { contents: "Sac à dos, boîte à amadou, chausse-trappes, corde, 2 flasques d'huile, 10 jours de rations, outre, pied-de-biche, 10 torches." }),
  G("entertainers-pack", "Paquetage d'artiste", "Entertainer's Pack", "pack", 58, { contents: "Sac à dos, boîte à amadou, cloche, 3 costumes, 8 flasques d'huile, 9 jours de rations, lanterne sourde, miroir, outre, sac de couchage." }),
  G("explorers-pack", "Paquetage d'explorateur", "Explorer's Pack", "pack", 55, { contents: "Sac à dos, sac de couchage, boîte à amadou, corde, 2 flasques d'huile, 10 jours de rations, outre, 10 torches." }),
  G("priests-pack", "Paquetage d'ecclésiastique", "Priest's Pack", "pack", 29, { contents: "Sac à dos, boîte à amadou, couverture, eau bénite, lampe, 7 jours de rations, robe." }),
  G("scholars-pack", "Paquetage d'érudit", "Scholar's Pack", "pack", 22, { contents: "Sac à dos, boîte à amadou, encre, lampe, livre, porte-plume, 10 flasques d'huile, 10 feuilles de parchemin." }),

  G("arcane-focus-crystal", "Focaliseur arcanique (cristal)", "Arcane Focus (Crystal)", "focus", 1),
  G("arcane-focus-orb", "Focaliseur arcanique (orbe)", "Arcane Focus (Orb)", "focus", 3),
  G("arcane-focus-rod", "Focaliseur arcanique (sceptre)", "Arcane Focus (Rod)", "focus", 2),
  G("arcane-focus-staff", "Focaliseur arcanique (bâton)", "Arcane Focus (Staff)", "focus", 4),
  G("arcane-focus-wand", "Focaliseur arcanique (baguette)", "Arcane Focus (Wand)", "focus", 1),
  G("component-pouch", "Sacoche à composantes", "Component Pouch", "focus", 2),
  G("druidic-focus", "Focaliseur druidique", "Druidic Focus", "focus", 1),
  G("holy-symbol-amulet", "Symbole sacré (amulette)", "Holy Symbol (Amulet)", "focus", 1),
  G("holy-symbol-emblem", "Symbole sacré (emblème)", "Holy Symbol (Emblem)", "focus", 0),
  G("holy-symbol-reliquary", "Symbole sacré (reliquaire)", "Holy Symbol (Reliquary)", "focus", 2),
  G("spellbook", "Grimoire", "Spellbook", "focus", 3),

  G("arrows", "Flèches (20)", "Arrows (20)", "gear", 1),
  G("bolts", "Carreaux (20)", "Bolts (20)", "gear", 1.5),
  G("sling-bullets", "Billes de fronde (20)", "Sling Bullets (20)", "gear", 1.5),
  G("quiver", "Carquois", "Quiver", "gear", 1),
  G("backpack", "Sac à dos", "Backpack", "gear", 5),
  G("bedroll", "Sac de couchage", "Bedroll", "gear", 7),
  G("blanket", "Couverture", "Blanket", "gear", 3),
  G("book", "Livre", "Book", "gear", 5),
  G("caltrops", "Chausse-trappes", "Caltrops", "gear", 2),
  G("chain", "Chaîne", "Chain", "gear", 10),
  G("climbers-kit", "Kit d'escalade", "Climber's Kit", "gear", 12),
  G("clothes-fine", "Vêtements fins", "Fine Clothes", "gear", 6),
  G("clothes-travelers", "Vêtements de voyageur", "Traveler's Clothes", "gear", 4),
  G("costume", "Costume", "Costume", "gear", 4),
  G("crowbar", "Pied-de-biche", "Crowbar", "gear", 5),
  G("grappling-hook", "Grappin", "Grappling Hook", "gear", 4),
  G("healers-kit", "Trousse de soins", "Healer's Kit", "gear", 3),
  G("lamp", "Lampe", "Lamp", "gear", 1),
  G("lantern-hooded", "Lanterne à capote", "Hooded Lantern", "gear", 2),
  G("lantern-bullseye", "Lanterne sourde", "Bullseye Lantern", "gear", 2),
  G("oil", "Flasque d'huile", "Oil", "gear", 1),
  G("potion-healing", "Potion de soins", "Potion of Healing", "gear", 0.5),
  G("pouch", "Bourse", "Pouch", "gear", 1),
  G("rations", "Rations (1 jour)", "Rations", "gear", 2),
  G("rope", "Corde (15 m)", "Rope", "gear", 5),
  G("sack", "Sac", "Sack", "gear", 0.5),
  G("tent", "Tente", "Tent", "gear", 20),
  G("tinderbox", "Boîte à amadou", "Tinderbox", "gear", 1),
  G("torch", "Torche", "Torch", "gear", 1),
  G("waterskin", "Outre", "Waterskin", "gear", 5),

  G("bag-of-holding", "Sac sans fond", "Bag of Holding", "magic", 5, { holds: 500,
    contents: "Contient jusqu'à 250 kg (500 lb). Son contenu ne compte pas dans la charge, seul le sac compte." }),
]) DND.data.gear[g.id] = g;

// Poids des outils (même identifiants que DND.data.tools)
const TOOL_WEIGHTS = {
  "alchemists-supplies": 8, "brewers-supplies": 9, "calligraphers-supplies": 5, "carpenters-tools": 6, "cartographers-tools": 6,
  "cobblers-tools": 5, "cooks-utensils": 8, "glassblowers-tools": 5, "jewelers-tools": 2, "leatherworkers-tools": 5,
  "masons-tools": 8, "painters-supplies": 5, "potters-tools": 3, "smiths-tools": 8, "tinkers-tools": 10, "weavers-tools": 5,
  "woodcarvers-tools": 5, "disguise-kit": 3, "forgery-kit": 5, "herbalism-kit": 3, "navigators-tools": 2, "poisoners-kit": 2,
  "thieves-tools": 1, "dice-set": 0, "dragonchess-set": 0, "playing-card-set": 0, "three-dragon-ante-set": 0,
  bagpipes: 6, drum: 3, dulcimer: 10, flute: 1, horn: 2, lute: 2, lyre: 2, "pan-flute": 2, shawm: 1, viol: 1,
};
for (const [id, w] of Object.entries(TOOL_WEIGHTS)) if (DND.data.tools[id]) DND.data.tools[id].weight = w;
