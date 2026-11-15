// Moteur de calcul : transforme un personnage sauvegardé (choix + état) en fiche
// complète (valeurs calculées). Aucune classe n'est connue ici : tout passe par
// les « effets » génériques déclarés dans les modules.
(function () {
  const E = {};
  DND.engine = E;

  E.SCHEMA_VERSION = 1;
  E.mod = (score) => Math.floor((score - 10) / 2);
  E.profBonus = (level) => 2 + Math.floor((Math.max(1, level) - 1) / 4);
  E.totalLevel = (ch) => ch.classes.reduce((sum, c) => sum + (Number(c.level) || 0), 0);
  E.signed = (n) => (n >= 0 ? "+" : "−") + Math.abs(n);
  E.rollCommand = (bonus, mode) => ({ adv: "2d20 k1", dis: "2d20 kl1" }[mode] || "1d20") + (bonus ? (bonus > 0 ? "+" : "-") + Math.abs(bonus) : "");
  E.diceIn = (text) => {
    const m = /\d+d\d+(\s*[+−-]\s*\d+)?/.exec(text || "");
    return m && { index: m.index, text: m[0], command: m[0].replace(/−/g, "-").replace(/\s/g, "") };
  };

  // ---------------------------------------------------------------------------
  // Nouveau personnage et mise à niveau des anciennes sauvegardes
  // ---------------------------------------------------------------------------
  E.newCharacter = function () {
    return E.normalize({ id: Math.random().toString(36).slice(2, 10), name: "Nouveau personnage" });
  };

  E.normalize = function (ch) {
    ch.schemaVersion = ch.schemaVersion || E.SCHEMA_VERSION;
    ch.name = ch.name || "";
    ch.player = ch.player || "";
    ch.abilities = Object.assign({ str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }, ch.abilities);
    ch.species = ch.species || { id: "", choices: {} };
    ch.species.choices = ch.species.choices || {};
    ch.background = ch.background || { id: "", choices: {} };
    ch.background.choices = ch.background.choices || {};
    ch.classes = ch.classes || [];
    for (const c of ch.classes) c.choices = c.choices || {};
    ch.choices = ch.choices || {};
    // Ancienne liste séparée « Autres langues » : fusionnée dans « Langues »
    if (ch.choices.extraLanguages) {
      ch.choices.languages = [...new Set((ch.choices.languages || []).concat(ch.choices.extraLanguages))];
      delete ch.choices.extraLanguages;
    }
    ch.feats = ch.feats || [];
    for (const f of ch.feats) f.choices = f.choices || {};
    ch.spells = ch.spells || [];
    ch.inventory = ch.inventory || [];
    ch.coins = Object.assign({ pp: 0, gp: 0, ep: 0, sp: 0, cp: 0 }, ch.coins);
    ch.settings = Object.assign({ accent: "", coinsInBag: false }, ch.settings);
    ch.customFeatures = ch.customFeatures || [];
    ch.overrides = ch.overrides || [];
    ch.extraProfs = ch.extraProfs || [];
    ch.extraAbilities = ch.extraAbilities || {};
    ch.conditionDefenses = ch.conditionDefenses || []; // saisies manuelles : { condition, kind: "advantage" | "immunity", label }
    ch.notes = Object.assign({ personality: "", appearance: "", backstory: "", allies: "", session: "" }, ch.notes);
    ch.state = Object.assign({
      damage: 0, tempHp: 0, hitDiceSpent: {}, slotsSpent: {}, pactSpent: 0, resources: {},
      conditions: [], exhaustion: 0, concentration: "", heroicInspiration: false,
      deathSaves: { success: 0, failure: 0 }, companions: {}, slotsExtra: {},
    }, ch.state);
    return ch;
  };

  // Aptitudes communes à tous les personnages (règles de création).
  E.BASE_FEATURES = [
    { id: "languages", name: { fr: "Langues", en: "Languages" },
      description: "Tout personnage parle le commun et deux langues standards de son choix.",
      effects: [
        { type: "proficiency", target: "language.common" },
        { type: "choice", id: "languages", label: "Langues", from: "languages", count: 20, min: 2,
          help: "Au moins deux langues standards à la création. Ajoutez aussi les langues rares (infernal, sylvestre…) ou supplémentaires qu'une aptitude, un don ou le MJ vous accorde." },
      ] },
  ];

  // ---------------------------------------------------------------------------
  // Étape 1 : collecte de tous les effets actifs (espèce, historique, classes, dons)
  // ---------------------------------------------------------------------------
  function collect(ch) {
    const out = { effects: [], choices: [], features: [], feats: [], errors: [] };
    const total = Math.max(1, E.totalLevel(ch));

    const walkFeatures = (features, ctx) => {
      for (const f of features || []) {
        if ((f.level || 1) > ctx.level) continue;
        out.features.push({ feature: f, source: ctx.source, level: ctx.level });
        walkEffects(f.effects, { ...ctx, feature: f });
      }
    };

    const walkEffects = (effects, ctx) => {
      for (let e of effects || []) {
        if (e.minLevel && ctx.level < e.minLevel) continue;
        e = fillChoicePlaceholders(e, ctx);
        if (e.type === "choice") handleChoice(e, ctx);
        else if (e.type === "feat") {
          const prefix = ctx.prefix + "feat:" + e.id + "/";
          const presets = { ...(ctx.presets || {}) };
          for (const [k, v] of Object.entries(e.preset || {})) presets[prefix + k] = [].concat(v);
          walkFeat(e.id, { ...ctx, prefix, presets });
        }
        else out.effects.push({ effect: e, source: ctx.source, level: ctx.level, ctx });
      }
    };

    const walkFeat = (featId, ctx) => {
      const feat = DND.modules.feat[featId];
      if (!feat) { out.errors.push("Don inconnu : " + featId); return; }
      const source = { kind: "feat", id: feat.id, label: feat.name.fr, via: ctx.source.label };
      out.feats.push({ feat, source });
      // Les dons utilisent le niveau total du personnage.
      walkFeatures(feat.features, { ...ctx, source, level: total });
    };

    const handleChoice = (e, ctx) => {
      const key = ctx.prefix + e.id;
      const count = DND.byLevel(e.count == null ? 1 : e.count, ctx.level) || 0;
      const preset = ctx.presets && ctx.presets[key];
      const selected = preset || (Array.isArray(ctx.store[key]) ? ctx.store[key] : []);
      out.choices.push({ key, effect: e, source: ctx.source, path: ctx.path, store: ctx.store, count, selected, ctx, fixed: !!preset });
      for (const value of selected.slice(0, count)) {
        const option = E.findOption(e, value);
        const sub = { ...ctx, prefix: key + "/" + value + "/" };
        // Option choisie affichée comme une aptitude (ex. manifestations occultes)
        if (e.showChosen && option) out.features.push({ feature: { id: option.id, name: option.name, description: option.description, level: null, combat: option.combat },
          source: ctx.source, level: ctx.level });
        if (e.grant) walkEffects([fillValue(e.grant, value)], ctx);
        else if (e.from === "feats") walkFeat(value, sub);
        else if (option && option.effects) walkEffects(option.effects, sub);
        else if (option && option.features) walkFeatures(option.features, sub);
        else if (e.from === "spells") walkEffects([{ type: "spell", spell: value }], ctx);
        else if (!option || !option.effects) {
          if (/^(skill|tool|language|armor|weapon)\./.test(value)) walkEffects([{ type: "proficiency", target: value }], ctx);
        }
      }
    };

    // Règles de base
    walkFeatures(E.BASE_FEATURES, { source: { kind: "base", id: "base", label: "Création" },
      store: ch.choices, path: ["choices"], prefix: "", level: total });

    // Espèce
    const species = DND.modules.species[ch.species.id];
    if (species) {
      walkFeatures(species.features, { source: { kind: "species", id: species.id, label: species.name.fr },
        store: ch.species.choices, path: ["species", "choices"], prefix: "", level: total });
    } else if (ch.species.id) out.errors.push("Espèce inconnue : " + ch.species.id);

    // Historique
    const bg = DND.modules.background[ch.background.id];
    if (bg) {
      walkFeatures(bg.features, { source: { kind: "background", id: bg.id, label: bg.name.fr },
        store: ch.background.choices, path: ["background", "choices"], prefix: "", level: total });
    } else if (ch.background.id) out.errors.push("Historique inconnu : " + ch.background.id);

    // Classes (la première donne les jets de sauvegarde et toutes ses maîtrises)
    ch.classes.forEach((entry, i) => {
      const m = DND.modules.class[entry.id];
      if (!m) { out.errors.push("Classe inconnue : " + entry.id); return; }
      const level = Number(entry.level) || 1;
      const source = { kind: "class", id: m.id, label: m.name.fr, index: i };
      const ctx = { source, store: entry.choices, path: ["classes", i, "choices"], prefix: "", level };
      const profs = i === 0 ? m.proficiencies || {} : m.multiclassProficiencies || {};
      const profEffects = [];
      if (i === 0) for (const a of m.savingThrows || []) profEffects.push({ type: "proficiency", target: "save." + a });
      for (const a of profs.armor || []) profEffects.push({ type: "proficiency", target: "armor." + a });
      for (const w of profs.weapons || []) profEffects.push({ type: "proficiency", target: "weapon." + w });
      for (const t of profs.tools || []) profEffects.push({ type: "proficiency", target: "tool." + t });
      if (profs.skills) profEffects.push({ type: "choice", id: "skills", label: "Compétences de classe",
        count: profs.skills.choose, from: profs.skills.from === "any" ? "skills" : profs.skills.from.map((s) => "skill." + s) });
      walkFeatures([{ id: "proficiencies", name: { fr: "Maîtrises de classe", en: "Proficiencies" }, hidden: true, effects: profEffects }], ctx);
      walkFeatures(m.features, ctx);

      const sub = E.subclassesOf(m).find((s) => s.id === entry.subclass);
      if (sub && level >= (m.subclassLevel || 3)) {
        walkFeatures(sub.features, { ...ctx, source: { ...source, label: m.name.fr + " (" + sub.name.fr + ")", subclass: sub.id },
          prefix: "sub:" + sub.id + "/" });
      }
    });

    // Dons ajoutés à la main (accordés par le MJ, etc.)
    ch.feats.forEach((f, i) => {
      walkFeat(f.id, { source: { kind: "extra", id: "extra" + i, label: "Don supplémentaire" },
        store: f.choices, path: ["feats", i, "choices"], prefix: "", level: total });
    });

    walkEffects(ch.extraProfs.map((target) => ({ type: "proficiency", target })),
      { source: { kind: "manual", id: "extraProfs", label: "Maîtrise ajoutée" }, store: {}, path: [], prefix: "", level: total });
    walkEffects(Object.entries(ch.extraAbilities).filter(([, v]) => v > 0).map(([ability, value]) => ({ type: "ability", ability, value, max: 20 })),
      { source: { kind: "manual", id: "extraAbilities", label: "Bonus de caractéristique ajouté" }, store: {}, path: [], prefix: "", level: total });

    return out;
  }

  // Remplace "{choice:xxx}" par la valeur choisie (cherchée du préfixe courant vers la racine).
  function fillChoicePlaceholders(effect, ctx) {
    const json = JSON.stringify(effect, (k, v) => (typeof v === "function" ? undefined : v));
    if (!json || json.indexOf("{choice:") === -1) return effect;
    const resolve = (name) => {
      const parts = ctx.prefix.split("/").filter(Boolean);
      for (let n = parts.length; n >= 0; n--) {
        const key = (n ? parts.slice(0, n).join("/") + "/" : "") + name;
        if (ctx.presets && ctx.presets[key]) return ctx.presets[key][0];
        if (Array.isArray(ctx.store[key]) && ctx.store[key].length) return ctx.store[key][0];
      }
      return "";
    };
    return deepMap(effect, (s) => s.replace(/\{choice:([^}]+)\}/g, (_, name) => resolve(name)));
  }

  function fillValue(template, value) {
    return deepMap(template, (s) => (s === "{value}" ? value : s.replace(/\{value\}/g, value)));
  }

  function deepMap(obj, fn) {
    if (typeof obj === "string") return fn(obj);
    if (Array.isArray(obj)) return obj.map((x) => deepMap(x, fn));
    if (obj && typeof obj === "object") {
      const res = {};
      for (const k in obj) res[k] = typeof obj[k] === "function" ? obj[k] : deepMap(obj[k], fn);
      return res;
    }
    return obj;
  }

  E.subclassesOf = (m) => (m.subclasses || []).concat(DND.lists["subclass:" + m.id] || []);

  // ---------------------------------------------------------------------------
  // Options d'un choix (pour l'affichage et la validation)
  // ---------------------------------------------------------------------------
  E.optionsFor = function (e) {
    const from = e.from;
    const filter = e.filter || {};
    const opt = (id, name, extra) => ({ id, name: typeof name === "string" ? { fr: name, en: "" } : name, ...extra });
    if (Array.isArray(from)) {
      return from.map((x) => (typeof x === "object" ? x : opt(x, { fr: DND.label(x), en: DND.labelEn(x) })));
    }
    const sources = String(from).split("+");
    let result = [];
    for (const src of sources) {
      if (src === "skills") result = result.concat(Object.keys(DND.data.skills).map((s) => opt("skill." + s, DND.data.skills[s])));
      else if (src === "abilities") result = result.concat(DND.data.abilities.map((a) => opt(a, DND.data.labels[a])));
      else if (src.startsWith("languages")) {
        result = result.concat(Object.entries(DND.data.languages)
          .filter(([id, l]) => id !== "common" && (src === "languages" || (src === "languages.standard" && !l.rare)))
          .map(([id, l]) => opt("language." + id, src === "languages" && l.rare ? { fr: l.fr + " (rare)", en: l.en } : l)));
      } else if (src.startsWith("tools")) {
        const kind = src.split(".")[1];
        result = result.concat(Object.entries(DND.data.tools).filter(([, t]) => !kind || t[kind]).map(([id, t]) => opt("tool." + id, t)));
      } else if (src === "damageTypes") {
        const except = [].concat(filter.except || []);
        result = result.concat(DND.data.damageTypes.filter((d) => !except.includes(d)).map((d) => opt(d, DND.data.labels[d])));
      } else if (src.startsWith("list:")) result = result.concat(DND.lists[src.slice(5)] || []);
      else if (src === "feats") {
        const cats = [].concat(filter.category || []);
        result = result.concat(Object.values(DND.modules.feat).filter((f) => !cats.length || cats.includes(f.category)));
      } else if (src === "weapons") {
        result = result.concat(Object.values(DND.data.weapons).filter((w) => !filter.category || w.category === filter.category));
      } else if (src === "spells") {
        if (filter.list === "") continue; // la liste dépend d'un autre choix pas encore fait
        const levels = [].concat(filter.level == null ? [] : filter.level);
        const lists = [].concat(filter.list || []).filter(Boolean);
        result = result.concat(Object.values(DND.data.spells).filter((s) =>
          (!levels.length || levels.includes(s.level)) &&
          (filter.maxLevel == null || s.level <= filter.maxLevel) &&
          (!filter.ritual || s.ritual) && (!filter.damaging || !!s.damage) && (!filter.school || s.school === filter.school) &&
          (!lists.length || lists.some((l) => s.lists.includes(l))))
          .sort((a, b) => a.level - b.level || a.name.fr.localeCompare(b.name.fr)));
      }
    }
    return result;
  };

  E.findOption = function (e, value) {
    if (Array.isArray(e.from)) {
      const o = e.from.find((x) => (typeof x === "object" ? x.id === value : x === value));
      return typeof o === "object" ? o : null;
    }
    if (String(e.from).includes("list:")) return E.optionsFor(e).find((o) => o.id === value) || null;
    return null;
  };

  // ---------------------------------------------------------------------------
  // Étape 2 : calcul de la fiche
  // ---------------------------------------------------------------------------
  E.compute = function (ch) {
    E.normalize(ch);
    const col = collect(ch);
    const total = E.totalLevel(ch);
    const level = Math.max(1, total);
    const pb = E.profBonus(level);
    const sheet = { level: total, pb, errors: col.errors, warnings: [], collected: col };
    const of = (type) => col.effects.filter((x) => x.effect.type === type);
    const overrides = (target) => ch.overrides.filter((o) => o.target === target);

    // Caractéristiques
    const score = {};
    for (const a of DND.data.abilities) score[a] = Number(ch.abilities[a]) || 10;
    for (const { effect } of of("ability")) {
      const max = effect.max || 20;
      const a = effect.ability;
      if (!score.hasOwnProperty(a)) continue;
      score[a] = Math.max(score[a], Math.min(score[a] + (effect.value || 1), max));
    }
    for (const a of DND.data.abilities) for (const o of overrides("ability." + a)) score[a] += Number(o.value) || 0;
    const mod = {};
    for (const a of DND.data.abilities) mod[a] = E.mod(score[a]);

    const classLevel = (id) => ch.classes.filter((c) => c.id === id).reduce((s, c) => s + (Number(c.level) || 0), 0);
    const c = { level, pb, mod, score, classLevel, character: ch };
    sheet.context = c;
    const val = (v, entry) => {
      if (typeof v === "function") return v(c, entry ? entry.level : level);
      if (v && typeof v === "object") return DND.byLevel(v, entry ? entry.level : level);
      return v;
    };
    sheet.val = val;

    // Somme des bonus pour une cible (effets « bonus » + ajustements manuels)
    const bonusParts = (target) => {
      const parts = [];
      for (const x of of("bonus")) {
        if (x.effect.target !== target) continue;
        if (x.effect.when && !x.effect.when(c)) continue;
        parts.push({ label: x.effect.label || x.source.label, value: Number(val(x.effect.value, x)) || 0 });
      }
      for (const o of overrides(target)) parts.push({ label: o.label || "Ajustement manuel", value: Number(o.value) || 0, manual: true });
      return parts;
    };
    const bonus = (target) => bonusParts(target).reduce((s, p) => s + p.value, 0);
    sheet.bonusParts = bonusParts;

    // Maîtrises : 1 = maîtrise, 2 = expertise
    const prof = {};
    for (const { effect } of of("proficiency")) {
      const lvl = effect.expertise ? 2 : 1;
      prof[effect.target] = Math.max(prof[effect.target] || 0, lvl);
    }
    sheet.prof = prof;
    c.prof = prof; // lisible par les fonctions des modules (ex. Touche-à-tout : compétences non maîtrisées)

    const exhaustion = Number(ch.state.exhaustion) || 0;
    const ex = 2 * exhaustion;
    sheet.d20Penalty = ex;
    const advantages = (target) => of("advantage").filter((x) => x.effect.target === target).map((x) => x.effect.note || x.source.label);

    sheet.abilities = {};
    for (const a of DND.data.abilities) {
      const proficient = !!prof["save." + a];
      sheet.abilities[a] = {
        score: score[a], mod: mod[a],
        save: { proficient, bonus: mod[a] + (proficient ? pb : 0) + bonus("save." + a) + bonus("save.all") - ex,
          advantage: advantages("save." + a).concat(advantages("save.all")) },
      };
    }

    sheet.skills = {};
    for (const [id, s] of Object.entries(DND.data.skills)) {
      const p = prof["skill." + id] || 0;
      sheet.skills[id] = {
        ability: s.ability, prof: p,
        bonus: mod[s.ability] + p * pb + bonus("skill." + id) + bonus("check." + s.ability) + bonus("check.all") - ex,
        advantage: advantages("skill." + id),
      };
    }
    sheet.passive = {};
    for (const s of ["perception", "insight", "investigation"]) {
      sheet.passive[s] = 10 + sheet.skills[s].bonus + ex + bonus("passive." + s);
    }

    sheet.initiative = { bonus: mod.dex + bonus("initiative") + bonus("check.dex") + bonus("check.all") - ex, advantage: advantages("initiative") };

    // Taille, sens, vitesses
    const species = DND.modules.species[ch.species.id];
    const sizes = of("size");
    sheet.size = sizes.length ? sizes[sizes.length - 1].effect.value : (species && species.size) || "medium";
    sheet.senses = {};
    for (const x of of("sense")) {
      const r = Number(val(x.effect.range, x)) || 0;
      sheet.senses[x.effect.sense] = Math.max(sheet.senses[x.effect.sense] || 0, r);
    }

    // Armure et CA
    const items = ch.inventory;
    const armorItem = items.find((it) => it.equipped && DND.data.armor[it.id] && DND.data.armor[it.id].category !== "shield");
    const shieldItem = items.find((it) => it.equipped && it.id === "shield");
    const armor = armorItem ? DND.data.armor[armorItem.id] : null;
    const candidates = [];
    if (armor) {
      const dex = armor.dexMax === 0 ? 0 : armor.dexMax == null ? mod.dex : Math.min(mod.dex, armor.dexMax);
      candidates.push({ label: armor.name.fr, value: armor.base + dex + (Number(armorItem.bonus) || 0), allowShield: true });
      if (!prof["armor." + armor.category]) sheet.warnings.push("Armure non maîtrisée : désavantage aux tests et jets d'attaque de FOR et DEX, pas d'incantation.");
    } else {
      candidates.push({ label: "Sans armure", value: 10 + mod.dex, allowShield: true });
    }
    for (const x of of("acFormula")) {
      const e = x.effect;
      if (armor && e.requiresNoArmor !== false) continue;
      if (shieldItem && e.noShield) continue;
      const value = (e.base || 10) + (e.abilities || ["dex"]).reduce((s, a) => s + mod[a], 0) + (Number(val(e.bonus, x)) || 0);
      candidates.push({ label: e.label || x.source.label, value, allowShield: !e.noShield });
    }
    const best = candidates.reduce((a, b) => (b.value > a.value ? b : a));
    const acParts = [{ label: best.label, value: best.value }];
    if (shieldItem && best.allowShield) {
      if (prof["armor.shield"]) acParts.push({ label: "Bouclier", value: 2 + (Number(shieldItem.bonus) || 0) });
      else sheet.warnings.push("Bouclier non maîtrisé : vous n'en tirez pas le bonus de CA.");
    }
    for (const p of bonusParts("ac")) acParts.push(p);
    sheet.ac = { value: acParts.reduce((s, p) => s + p.value, 0), parts: acParts };
    sheet.armor = armor;
    sheet.stealthDisadvantage = !!(armor && armor.stealthDisadvantage);

    sheet.speed = { walk: (species && species.speed) || 30 };
    for (const x of of("speed")) {
      const v = x.effect.value === "walk" ? null : Number(val(x.effect.value, x));
      const mode = x.effect.mode || "walk";
      sheet.speed[mode] = Math.max(sheet.speed[mode] || 0, v == null ? 0 : v);
    }
    sheet.speed.walk += bonus("speed");
    if (armor && armor.strength && score.str < armor.strength) {
      sheet.speed.walk -= 10;
      sheet.warnings.push("Force insuffisante pour " + armor.name.fr + " : vitesse réduite de 3 m.");
    }
    for (const x of of("speed")) if (x.effect.value === "walk") sheet.speed[x.effect.mode] = sheet.speed.walk;
    if (exhaustion) for (const m in sheet.speed) sheet.speed[m] = Math.max(0, sheet.speed[m] - 5 * exhaustion);

    sheet.resistances = [...new Set(of("resistance").map((x) => x.effect.damage).filter(Boolean))];
    sheet.immunities = [...new Set(of("immunity").map((x) => x.effect.damage).filter(Boolean))];
    // États : Avantage aux JS (effet advantage, target "condition.<id>") ou immunité (effet immunity, condition: "<id>"),
    // plus les saisies manuelles du joueur (objets libres). note : texte de l'infobulle, sinon « aptitude · source ».
    sheet.conditionDefenses = {};
    const addDefense = (id, kind, label) => {
      if (!DND.data.conditions[id]) return;
      const list = (sheet.conditionDefenses[id] = sheet.conditionDefenses[id] || []);
      if (!list.some((d) => d.kind === kind && d.label === label)) list.push({ kind, label });
    };
    const defenseLabel = (x) => x.effect.note || (x.ctx.feature && x.ctx.feature.name.fr !== x.source.label ? x.ctx.feature.name.fr + " · " + x.source.label : x.source.label);
    for (const x of of("advantage")) if (/^condition\./.test(x.effect.target)) addDefense(x.effect.target.slice(10), "advantage", defenseLabel(x));
    for (const x of of("immunity")) if (x.effect.condition) addDefense(x.effect.condition, "immunity", defenseLabel(x));
    for (const d of ch.conditionDefenses) addDefense(d.condition, d.kind === "immunity" ? "immunity" : "advantage", d.label || "Saisie manuelle");
    sheet.proficiencies = {
      armor: Object.keys(prof).filter((k) => k.startsWith("armor.")),
      weapons: Object.keys(prof).filter((k) => k.startsWith("weapon.")),
      tools: Object.keys(prof).filter((k) => k.startsWith("tool.")),
      languages: Object.keys(prof).filter((k) => k.startsWith("language.")),
    };

    // Points de vie et dés de vie
    let hpMax = 0;
    const hitDice = {};
    ch.classes.forEach((entry, i) => {
      const m = DND.modules.class[entry.id];
      if (!m) return;
      const lv = Number(entry.level) || 1;
      const avg = m.hitDie / 2 + 1;
      hpMax += i === 0 ? m.hitDie + avg * (lv - 1) : avg * lv;
      hitDice["d" + m.hitDie] = (hitDice["d" + m.hitDie] || 0) + lv;
    });
    const hpParts = [{ label: "Dés de vie (moyenne)", value: hpMax }, { label: "Constitution × niveau", value: mod.con * total }];
    for (const x of of("bonus")) {
      if (x.effect.target === "hpPerLevel") hpParts.push({ label: x.source.label, value: (Number(val(x.effect.value, x)) || 0) * total });
    }
    for (const p of bonusParts("hpMax")) hpParts.push(p);
    sheet.hp = { max: Math.max(total ? 1 : 0, hpParts.reduce((s, p) => s + p.value, 0)), parts: hpParts };
    // On stocke les dégâts subis, pas les PV actuels : une montée de niveau ou un
    // changement de Constitution met donc les PV à jour automatiquement.
    sheet.hp.current = Math.max(0, sheet.hp.max - (Number(ch.state.damage) || 0));
    sheet.hp.temp = Number(ch.state.tempHp) || 0;
    sheet.hitDice = Object.entries(hitDice).map(([die, count]) => ({ die, total: count, spent: Math.min(count, ch.state.hitDiceSpent[die] || 0) }));

    // Incantation
    computeSpellcasting(ch, sheet, c, of, val, bonus);

    // Ressources
    sheet.resources = [];
    for (const x of of("resource")) {
      const e = x.effect;
      const id = x.source.id + "." + e.id;
      const max = Math.max(0, Number(val(e.max, x)) || 0);
      sheet.resources.push({ id, name: e.name, description: typeof e.description === "function" ? e.description(c, x.level) : e.description,
        max, spent: Math.min(max, ch.state.resources[id] || 0), recharge: val(e.recharge, x) || "long", // recharge peut dépendre du niveau : { 1: "long", 5: "short" }
        shortRegain: e.shortRegain, slotRegain: e.slotRegain, blockedBy: e.blockedBy,
        pactRegain: e.pactRegain && sheet.pact ? Math.ceil(sheet.pact.count * e.pactRegain) : 0,
        slotCreate: typeof e.slotCreate === "function" ? e.slotCreate(c, x.level) : e.slotCreate, slotConvert: e.slotConvert,
        restores: e.restores && { id: x.source.id + "." + e.restores.id, amount: Number(val(e.restores.amount, x)) || 0, shortRest: e.restores.shortRest }, display: e.display, companion: e.companion, source: x.source.label });
    }
    for (const sp of sheet.spells) {
      if (sp.freeCast) sheet.resources.push({ id: sp.resourceId, name: { fr: sp.spell.name.fr + " (gratuit)", en: sp.spell.name.en },
        description: "Lancer ce sort sans dépenser d'emplacement.", max: sp.freeCast.max, recharge: sp.freeCast.recharge,
        spent: Math.min(sp.freeCast.max, ch.state.resources[sp.resourceId] || 0), source: sp.source });
    }

    // Actions spéciales déclarées par les aptitudes
    sheet.actions = of("action").map((x) => {
      const e = x.effect;
      const text = (v) => (typeof v === "function" ? v(c, x.level) : v);
      return { name: e.name, actionType: e.actionType || "action", description: text(e.description),
        resource: e.resource ? x.source.id + "." + e.resource : null, source: x.source.label };
    });
    // Aptitudes passives utiles en combat (combat: true sur l'aptitude, ou un texte court / une fonction (c, niveau)
    // donnant le texte ou une liste de lignes « Titre : texte » à afficher à la place).
    // Si l'aptitude a des notes (valeurs calculées), elles servent de description et quittent la carte Notes.
    const noteText = (x) => (typeof x.effect.text === "function" ? x.effect.text(c, x.level) : x.effect.text);
    for (const f of col.features) {
      const ft = f.feature;
      if (!ft.combat) continue;
      const own = of("note").filter((x) => x.ctx.feature === ft).map(noteText)
        .map((t) => t.replace(new RegExp("^" + ft.name.fr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?: \\([^)]*\\))? : "), ""));
      const d = typeof ft.combat === "string" || typeof ft.combat === "function" ? ft.combat : own.length ? own.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" ") : ft.description;
      sheet.actions.push({ name: ft.name, actionType: "passive", description: typeof d === "function" ? d(c, f.level) : d || "", source: f.source.label });
    }

    const bonds = of("weaponBond");
    sheet.weaponBond = bonds.length ? { ability: bonds[0].effect.ability, label: bonds[0].effect.label || bonds[0].source.label,
      column: bonds[0].effect.column || "Pacte" } : null;
    sheet.attacks = computeAttacks(ch, sheet, c, prof, bonus);
    sheet.companions = computeCompanions(ch, sheet, c, of);
    sheet.load = computeLoad(ch, sheet, bonus);
    if (sheet.load.carried > sheet.load.capacity) sheet.warnings.push("Charge trop lourde : " + E.kg(sheet.load.carried) + " pour une capacité de " + E.kg(sheet.load.capacity) + ".");
    if (sheet.load.bag && sheet.load.bag.contents > sheet.load.bag.holds) sheet.warnings.push("Le sac sans fond est trop plein : au-delà de " + E.kg(sheet.load.bag.holds) + ", il se déchire.");
    // Harmonisation : 3 objets par défaut, + effets « bonus » de cible "attunement" (ex. Artificier),
    // ou valeur saisie par le joueur (ch.settings.attunementMax, vide = automatique).
    const attuneAuto = 3 + bonus("attunement");
    const attuneSet = ch.settings.attunementMax;
    sheet.attunement = { count: ch.inventory.filter((it) => it.attuned).length, auto: attuneAuto,
      max: attuneSet != null && attuneSet !== "" && Number(attuneSet) >= 0 ? Number(attuneSet) : attuneAuto };
    if (sheet.attunement.count > sheet.attunement.max) sheet.warnings.push("Trop d'objets harmonisés : " + sheet.attunement.count + " pour un maximum de " + sheet.attunement.max + ".");
    // Couleur d'accent : choix du joueur, sinon couleur de la classe de départ
    const firstClass = ch.classes[0] && DND.modules.class[ch.classes[0].id];
    sheet.accent = ch.settings.accent || (firstClass && firstClass.color) || "";

    // Aptitudes affichées
    sheet.features = col.features.filter((f) => !f.feature.hidden).map((f) => ({
      id: f.feature.id, name: f.feature.name, level: f.feature.level === null ? null : f.feature.level || 1, source: f.source,
      description: typeof f.feature.description === "function" ? f.feature.description(c, f.level) : f.feature.description || "",
    }));
    sheet.notes = of("note").filter((x) => !(x.ctx.feature && x.ctx.feature.combat))
      .map((x) => ({ text: typeof x.effect.text === "function" ? x.effect.text(c, x.level) : x.effect.text, source: x.source.label }));
    sheet.onRest = of("onRest").map((x) => x.effect);

    // Choix à faire
    sheet.choices = col.choices.filter((x) => !x.fixed).map((x) => ({ ...x, options: E.optionsFor(x.effect) }));
    // min : nombre minimum exigé quand on peut en choisir davantage (optional = aucun minimum)
    const required = (x) => (x.effect.optional ? 0 : x.effect.min != null ? x.effect.min : x.count);
    sheet.pendingChoices = sheet.choices.filter((x) => x.selected.length < required(x)).length;

    // Prérequis de multiclassage
    if (ch.classes.length > 1) {
      for (const entry of ch.classes) {
        const m = DND.modules.class[entry.id];
        if (!m || !m.multiclassRequirement) continue;
        const ok = m.multiclassRequirement.some((group) => group.every((a) => Number(ch.abilities[a]) >= 13 || score[a] >= 13));
        if (!ok) sheet.warnings.push("Multiclassage : " + m.name.fr + " demande 13 en " +
          m.multiclassRequirement.map((g) => g.map((a) => DND.data.labels[a].fr).join(" et ")).join(" ou ") + ".");
      }
    }
    // Effet de l'épuisement, affiché dans la carte États (pas dans les alertes, pour ne pas décaler la page)
    sheet.exhaustionText = exhaustion ? "−" + ex + " à tous les tests d20 (déjà compté dans les bonus affichés), vitesse réduite de " + E.meters(5 * exhaustion) + "." : "";
    return sheet;
  };

  function computeSpellcasting(ch, sheet, c, of, val, bonus) {
    const { mod, pb, level } = c;
    const casting = [];
    let casterLevel = 0;
    let slotClasses = 0;
    let soloTable = null;
    let pact = null;
    ch.classes.forEach((entry) => {
      const m = DND.modules.class[entry.id];
      if (!m) return;
      const lv = Number(entry.level) || 1;
      const sub = E.subclassesOf(m).find((s) => s.id === entry.subclass);
      const sc = m.spellcasting || (sub && lv >= (m.subclassLevel || 3) && sub.spellcasting);
      if (!sc || lv < (sc.startLevel || 1)) return;
      const ability = sc.ability;
      casting.push({ classId: m.id, name: m.name, ability, list: sc.list,
        dc: 8 + pb + mod[ability] + bonus("spellDC"), attack: pb + mod[ability] + bonus("spellAttack") - sheet.d20Penalty,
        cantrips: DND.byLevel(sc.cantrips, lv) || 0, prepared: DND.byLevel(sc.prepared, lv) || 0,
        maxSpellLevel: 0, progression: sc.progression });
      if (sc.progression === "pact") {
        const p = DND.byLevel(sc.pactSlots, lv);
        if (p) pact = { count: p.count, level: p.level, spent: Math.min(p.count, ch.state.pactSpent || 0), classId: m.id };
        casting[casting.length - 1].maxSpellLevel = p ? p.level : 0;
      } else {
        const divisor = { full: 1, half: 2, third: 3 }[sc.progression] || 1;
        const raw = lv / divisor;
        const own = sc.rounding === "up" ? Math.ceil(raw) : Math.floor(raw);
        casterLevel += own;
        slotClasses++;
        soloTable = sc.slotTable ? DND.byLevel(sc.slotTable, lv) : null;
        casting[casting.length - 1].maxSpellLevel = (soloTable || DND.data.spellSlots[Math.min(20, own)] || []).length;
      }
    });
    const table = slotClasses === 1 && soloTable ? soloTable : DND.data.spellSlots[Math.min(20, casterLevel)] || [];
    const extra = ch.state.slotsExtra;
    sheet.extraSlots = of("extraSlots").length ? Math.max(...of("extraSlots").map((x) => Number(val(x.effect.maxLevel, x)) || 9)) : 0;
    const top = Math.max(table.length, ...Object.keys(extra).filter((k) => extra[k] > 0).map(Number));
    sheet.spellSlots = Array.from({ length: top }, (_, i) => {
      const max = (table[i] || 0) + (extra[i + 1] || 0);
      return { level: i + 1, max, extra: extra[i + 1] || 0, spent: Math.min(max, ch.state.slotsSpent[i + 1] || 0) };
    });
    sheet.pact = pact;
    for (const cst of casting) {
      // Listes de sorts supplémentaires accordées à une classe (ex. Secrets magiques du barde)
      cst.lists = [cst.list].concat(...of("extraSpellList").filter((x) => x.source.id === cst.classId).map((x) => [].concat(x.effect.lists)));
    }
    sheet.casting = casting;

    // Liste des sorts : sorts choisis par classe + sorts accordés par les aptitudes
    const cantripDice = (dice) => {
      const n = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
      return dice.replace(/^(\d+)d/, (_, k) => Number(k) * n + "d");
    };
    // Magie de pacte : tous les emplacements ont le même niveau, l'effet à niveau supérieur
    // est donc connu d'avance pour les sorts lancés avec eux.
    const pactLevelFor = (spell, classId, atWill) => {
      if (!pact || atWill || !spell.level || pact.level < spell.level) return null;
      if (classId === pact.classId || !sheet.spellSlots.length) return pact.level;
      return null;
    };
    const decorate = (spell, ability, slotLevel) => {
      const out = { dc: ability ? 8 + pb + mod[ability] + bonus("spellDC") : null,
        attack: ability ? pb + mod[ability] + bonus("spellAttack") - sheet.d20Penalty : null };
      const up = E.upcast(spell, slotLevel);
      if (up) out.upcast = up;
      if (spell.heal) out.heal = spell.heal.text || spell.heal.dice + (spell.heal.mod && ability && mod[ability] ? E.signed(mod[ability]) : "") + (up && up.heal ? " (+" + up.heal + ")" : "") + " PV";
      if (spell.damage) {
        const extra = bonus("spellDamage." + spell.id);
        const type = " " + DND.label(spell.damage.type).toLowerCase();
        if (spell.scaling === "beams") {
          // Plusieurs rayons (Décharge occulte) : 2 au niveau 5, 3 au 11, 4 au 17
          const beams = level >= 17 ? 4 : level >= 11 ? 3 : level >= 5 ? 2 : 1;
          const one = spell.damage.dice + (extra ? E.signed(extra) : "");
          out.damage = (beams > 1 ? beams + " rayons de " : "") + one + type;
        } else {
          const scale = (d) => (spell.scaling === "cantrip" ? cantripDice(d) : up && up.dice ? E.addDice(d, up.dice) : d) + (extra ? E.signed(extra) : "");
          out.damage = scale(spell.damage.dice) + type;
          if (spell.damage.alt) out.damageAlt = scale(spell.damage.alt.dice) + " " + spell.damage.alt.label;
        }
      }
      return out;
    };
    sheet.spells = [];
    ch.spells.forEach((entry, i) => {
      const spell = entry.custom ? { id: "custom" + i, name: { fr: entry.name || "Sort", en: "" }, level: Number(entry.level) || 0,
        school: "", castingTime: entry.castingTime || "", range: entry.range || "", components: "", duration: entry.duration || "",
        lists: [], custom: true, notes: entry.notes } : DND.data.spells[entry.id];
      if (!spell) { sheet.errors.push("Sort inconnu : " + entry.id); return; }
      const cst = casting.find((x) => x.classId === entry.source);
      sheet.spells.push({ spell, index: i, source: cst ? cst.name.fr : entry.source || "", classId: entry.source,
        ability: cst ? cst.ability : null, prepared: entry.prepared !== false, alwaysPrepared: false,
        ...decorate(spell, cst ? cst.ability : null, entry.custom ? null : pactLevelFor(spell, entry.source, false)) });
    });
    for (const x of of("spell")) {
      const e = x.effect;
      const spell = DND.data.spells[e.spell];
      if (!spell) { if (e.spell) sheet.errors.push("Sort inconnu : " + e.spell); continue; }
      const ability = e.ability || (casting[0] && casting[0].ability) || null;
      const resourceId = "spell:" + x.source.id + ":" + e.spell;
      const freeCast = e.freeCast ? { max: Number(val(e.freeCast.max, x)) || 1, recharge: e.freeCast.recharge || "long" } : null;
      sheet.spells.push({ spell, source: x.source.label, ability, prepared: true, alwaysPrepared: true, freeCast, resourceId,
        atWill: !!e.atWill, ...decorate(spell, ability, pactLevelFor(spell, x.source.kind === "class" ? x.source.id : null, e.atWill)) });
    }
    sheet.spells.sort((a, b) => a.spell.level - b.spell.level || a.spell.name.fr.localeCompare(b.spell.name.fr));
    const castingTimes = Object.fromEntries(of("castingTime").map((x) => [x.effect.spell, x.effect.value]));
    for (const sp of sheet.spells) sp.castingTime = castingTimes[sp.spell.id] || sp.spell.castingTime;
  }

  E.concentrationInfo = function (sheet, state) {
    const sp = sheet.spells.find((x) => x.spell.name.fr === state.concentration && x.spell.concentration);
    if (!sp) return null;
    const spell = sp.spell, u = spell.upcast || DND.data.spellUpcast[spell.id], pick = state.concentrationSlot || {};
    const levels = u && u.duration ? [...new Set([...sheet.spellSlots.filter((x) => x.max).map((x) => x.level), ...(sheet.pact ? [sheet.pact.level] : [])])]
      .filter((l) => l >= spell.level).sort((x, y) => x - y) : [];
    const level = pick.name === state.concentration && levels.includes(pick.level) ? pick.level : (sp.upcast && sp.upcast.slotLevel) || spell.level;
    const up = E.upcast(spell, level);
    return { duration: (up && up.duration) || spell.duration, level, levels: levels.length > 1 ? levels : [], noConcentration: !!(up && up.noConcentration) };
  };

  // Effet d'un sort lancé avec un emplacement de niveau supérieur.
  // slotLevel connu (Magie de pacte) : effet calculé ; sinon seulement le texte de règle.
  E.upcast = function (spell, slotLevel) {
    const u = spell.upcast || DND.data.spellUpcast[spell.id];
    // Emplacement du niveau du sort (pacte) : rien ne change, rien à afficher.
    if (!u || (slotLevel && slotLevel === spell.level)) return null;
    const out = { text: u.text || "", slotLevel: slotLevel || null, summary: [] };
    if (!slotLevel || slotLevel <= spell.level) return out;
    const n = slotLevel - spell.level;
    const times = (dice, k) => dice.replace(/^(\d+)d/, (_, c) => Number(c) * k + "d");
    if (u.dice) {
      out.dice = times(u.dice, n);
      if (!spell.damage) out.summary.push("dégâts +" + out.dice);
    }
    if (u.heal) { out.heal = times(u.heal, n); out.summary.push("soins +" + out.heal); }
    if (u.targets) out.summary.push("+" + u.targets * n + " cible" + (u.targets * n > 1 ? "s" : ""));
    if (u.amount) out.summary.push((u.amount.base ? "" : "+") + String((u.amount.base || 0) + u.amount.each * n).replace(".", ",") + " " + u.amount.label);
    if (u.duration) {
      const d = DND.byLevel(u.duration, slotLevel);
      if (d) { out.duration = d; out.summary.push("durée " + (spell.concentration && !(u.noConcentration && slotLevel >= u.noConcentration) ? "jusqu'à " : "") + d); }
    }
    if (u.noConcentration && slotLevel >= u.noConcentration) { out.noConcentration = true; out.summary.push("sans concentration"); }
    const lv = u.levels && DND.byLevel(u.levels, slotLevel);
    if (lv) out.summary.push(lv.replace("{slot}", slotLevel));
    if (u.profile) out.summary.push("profil de niveau " + slotLevel);
    if (u.dice && spell.damage) out.summary.unshift("dégâts +" + out.dice);
    if (!out.summary.length) out.summary.push(out.text);
    return out;
  };

  // Additionne deux expressions de dés : 2d6 + 1d6 = 3d6, sinon 2d6 + 1d4.
  E.addDice = function (base, extra) {
    const a = /^(\d+)d(\d+)(.*)$/.exec(base), b = /^(\d+)d(\d+)$/.exec(extra);
    if (a && b && a[2] === b[2]) return Number(a[1]) + Number(b[1]) + "d" + a[2] + a[3];
    return base + " + " + extra;
  };

  // Compagnons (familier, etc.) : mini-fiche avec forme, CA, PV et notes.
  // Les valeurs de la forme sont des valeurs par défaut que le joueur peut corriger.
  function computeCompanions(ch, sheet, c, of) {
    return of("companion").map((x) => {
      const e = x.effect;
      const st = ch.state.companions[e.id] = Object.assign({ form: "", damage: 0, custom: {} }, ch.state.companions[e.id]);
      // Une seule forme possible (ex. défenseur d'acier) : elle est prise d'office
      const form = (e.forms || []).find((f) => f.id === st.form) || ((e.forms || []).length === 1 ? e.forms[0] : null);
      // Une valeur de forme peut être une fonction du personnage (ex. PV = 5 + 5 × niveau)
      const formVal = (k) => (form && typeof form[k] === "function" ? form[k](c, x.level) : form ? form[k] : "");
      const pick = (k) => (st.custom[k] !== undefined && st.custom[k] !== "" ? st.custom[k] : formVal(k));
      const hpMax = Number(pick("hp")) || 0;
      const notes = of("companionNote").filter((n) => n.effect.companion === e.id)
        .map((n) => (typeof n.effect.text === "function" ? n.effect.text(c, n.level) : n.effect.text));
      return { id: e.id, name: e.name, description: typeof e.description === "function" ? e.description(c, x.level) : e.description,
        forms: e.forms || [], form, ac: pick("ac"), hpMax, hp: Math.max(0, hpMax - (Number(st.damage) || 0)),
        speed: pick("speed"), traits: formVal("traits"), notes, source: x.source.label };
    });
  }

  // Objet du catalogue (arme, armure, équipement, outil) d'après son identifiant.
  E.itemData = (id) => (id ? DND.data.weapons[id] || DND.data.armor[id] || DND.data.gear[id] ||
    (DND.data.tools[id] && { id, name: { fr: DND.data.tools[id].fr, en: DND.data.tools[id].en }, category: "tool", weight: DND.data.tools[id].weight || 0 }) : null);

  // Charge transportée : FOR × 15 lb, multipliée selon la taille ; 50 pièces = 1 lb.
  // Le contenu d'un contenant extradimensionnel (sac sans fond) ne compte pas, seul le sac compte.
  const SIZES = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
  const SIZE_MULT = { tiny: 0.5, small: 1, medium: 1, large: 2, huge: 4, gargantuan: 8 };
  function computeLoad(ch, sheet, bonus) {
    const bagItem = ch.inventory.find((it) => { const d = E.itemData(it.id); return d && d.holds && Number(it.qty) > 0; });
    const bag = bagItem ? { holds: E.itemData(bagItem.id).holds, contents: 0 } : null;
    let carried = 0;
    const items = ch.inventory.map((it) => {
      const d = E.itemData(it.id);
      const unit = it.weight != null && it.weight !== "" ? Number(it.weight) || 0 : d ? d.weight || 0 : 0;
      const total = unit * (Number(it.qty) || 0);
      const inBag = !!(bag && it.inBag && !(d && d.holds));
      if (inBag) bag.contents += total; else carried += total;
      return { unit, total, inBag };
    });
    const coinCount = ["pp", "gp", "ep", "sp", "cp"].reduce((n, k) => n + (Number(ch.coins[k]) || 0), 0);
    const coins = coinCount / 50;
    if (bag && ch.settings.coinsInBag) bag.contents += coins; else carried += coins;
    const sizeIndex = Math.min(SIZES.length - 1, Math.max(0, SIZES.indexOf(sheet.size) + bonus("carrySize")));
    const capacity = sheet.abilities.str.score * 15 * SIZE_MULT[SIZES[sizeIndex] || "medium"] + bonus("carry");
    return { items, carried, coins, coinCount, capacity, push: capacity * 2, bag };
  }

  function computeAttacks(ch, sheet, c, prof, bonus) {
    const { mod, pb } = c;
    const attacks = [];
    // Effets actifs d'un type (when(c) facultatif : condition, ex. sans armure ni bouclier)
    const active = (type) => sheet.collected.effects.filter((x) => x.effect.type === type && (!x.effect.when || x.effect.when(c)));
    const avg = (dice) => { const m = /^(\d*)d(\d+)$/.exec(String(dice || "")); return m ? (Number(m[1]) || 1) * (Number(m[2]) + 1) / 2 : Number(dice) || 0; };
    // weaponAbility : certaines armes peuvent utiliser une autre caractéristique et un dé de dégâts minimal
    // (ex. armes de moine : Dextérité et dé d'Arts martiaux). filter(arme) choisit les armes concernées.
    const weaponOptions = active("weaponAbility");
    ch.inventory.forEach((item, index) => {
      const w = DND.data.weapons[item.id];
      if (!w) return;
      const props = w.props;
      let ability = w.type === "ranged" ? "dex" : "str";
      if (props.includes("finesse")) ability = mod.dex > mod.str ? "dex" : "str";
      let proficient = !!(prof["weapon." + w.category] || prof["weapon." + w.id]);
      // Arme de pacte : maîtrisée, et peut utiliser la caractéristique d'incantation
      const bond = item.pactWeapon && sheet.weaponBond;
      if (bond) {
        proficient = true;
        if (mod[bond.ability] > mod[ability]) ability = bond.ability;
      }
      let dice = w.damage;
      let option = null;
      for (const x of weaponOptions) {
        if (x.effect.filter && !x.effect.filter(w)) continue;
        if (x.effect.ability && mod[x.effect.ability] > mod[ability]) ability = x.effect.ability;
        const d = sheet.val(x.effect.die, x);
        if (d && avg(d) > avg(dice)) dice = d;
        option = option || x.effect.label || x.source.label;
      }
      const magic = Number(item.bonus) || 0;
      const toHit = mod[ability] + (proficient ? pb : 0) + magic + bonus("attack.weapon") + bonus("attack." + w.type) - sheet.d20Penalty;
      const need = w.type === "ranged" ? "dex" : "str";
      if (item.equipped && props.includes("heavy") && c.score[need] < 13) sheet.warnings.push((item.name || w.name.fr) + " (Lourde) : " + DND.data.labels[need].fr + " inférieure à 13, Désavantage aux jets d'attaque.");
      const dmgMod = mod[ability] + magic + bonus("damage.weapon") + bonus("damage." + w.type);
      const fmt = (dice) => dice + (dmgMod ? E.signed(dmgMod) : "");
      attacks.push({
        kind: "weapon", index, name: item.name || w.name.fr, nameEn: w.name.en, ability, proficient, toHit,
        damage: fmt(dice) + " " + DND.label(w.damageType).toLowerCase(),
        alt: w.versatile && avg(w.versatile) > avg(dice) ? fmt(w.versatile) + " à 2 mains" : null,
        range: w.range ? E.meters(w.range[0]) + "/" + E.meters(w.range[1]) : props.includes("reach") ? E.meters(10) : E.meters(5),
        props: props.map((p) => DND.label("prop." + p)),
        mastery: w.mastery && prof["mastery." + w.id] ? DND.data.masteries[w.mastery] : null,
        equipped: !!item.equipped, bond: bond ? bond.label : null, option,
      });
    });
    // Frappe à mains nues : 1 + FOR, ou la meilleure version accordée par un effet unarmedStrike
    // { die, abilities, label } (ex. Arts martiaux : dé d'Arts martiaux, Dextérité possible).
    let unarmed = { ability: "str", dice: null, label: null };
    const unarmedAvg = (u) => (u.dice ? avg(u.dice) : 1) + mod[u.ability];
    for (const x of active("unarmedStrike")) {
      const abilities = ["str"].concat(x.effect.abilities || []);
      const ability = abilities.reduce((a, b) => (mod[b] > mod[a] ? b : a));
      const u = { ability, dice: sheet.val(x.effect.die, x) || null, label: x.effect.label || x.source.label };
      if (unarmedAvg(u) >= unarmedAvg(unarmed)) unarmed = u;
    }
    const unarmedMod = mod[unarmed.ability] + bonus("damage.unarmed");
    attacks.push({ kind: "unarmed", name: "Frappe à mains nues", nameEn: "Unarmed Strike", ability: unarmed.ability, proficient: true,
      toHit: mod[unarmed.ability] + pb + bonus("attack.unarmed") - sheet.d20Penalty,
      damage: (unarmed.dice ? unarmed.dice + (unarmedMod ? E.signed(unarmedMod) : "") : Math.max(0, 1 + unarmedMod)) + " contondant",
      range: E.meters(5), props: [], option: unarmed.label });
    for (const s of sheet.spells) {
      if (s.spell.damage && (s.spell.attack || s.spell.save)) {
        attacks.push({ kind: "spell", spell: s.spell, castingTime: s.castingTime, name: s.spell.name.fr, nameEn: s.spell.name.en, toHit: s.spell.attack ? s.attack : null,
          save: s.spell.save ? { ability: s.spell.save, dc: s.dc } : null, damage: s.damage, alt: s.damageAlt,
          range: E.range(s.spell.range), props: [] });
      }
    }
    return attacks;
  }

  // Affichage des distances en mètres (1,5 m par case de 5 pieds)
  E.meters = (feet) => {
    const m = Math.round(feet * 0.3 * 10) / 10;
    return String(m).replace(".", ",") + " m";
  };
  E.range = (r) => (r === "self" ? "Personnelle" : r === "touch" ? "Contact" : typeof r === "number" ? E.meters(r) : r || "");
  E.kg = (lb) => String(Math.round(lb * 0.5 * 100) / 100).replace(".", ",") + " kg";
})();
