// Mode « Création » : construire le personnage et le faire monter de niveau.
// Tous les choix proposés ici viennent des modules (effets de type "choice").
(function () {
  const { h } = DND.dom;
  const E = DND.engine;
  DND.views = DND.views || {};
  const sg = E.signed;
  const POINT_COST = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

  DND.views.build = function (App) {
    const s = App.sheet;
    return h("main", { class: "build" },
      s.warnings.length ? h("div", { class: "banner warn" }, s.warnings.map((w) => h("div", null, w))) : null,
      identity(App), abilities(App), origins(App), classes(App), choices(App),
      h("div", { class: "build-divider" }, h("h2", null, "Historique personnalisé et bonus du MJ"),
        h("p", { class: "muted small-text" }, "Hors création standard : à remplir seulement si votre historique est personnalisé ou si le MJ vous accorde quelque chose en plus.")),
      extraFeats(App), extraProfs(App), extraAbilities(App), overrides(App));
  };

  function identity(App) {
    return h("section", { class: "card" }, h("h2", null, "Identité"),
      h("div", { class: "row wrap" },
        h("label", null, "Nom ", h("input", { type: "text", value: App.ch.name, "data-bind": "name" })),
        h("label", null, "Joueur ", h("input", { type: "text", value: App.ch.player, "data-bind": "player" }))));
  }

  function abilities(App) {
    const ch = App.ch, s = App.sheet;
    const bases = DND.data.abilities.map((a) => Number(ch.abilities[a]));
    const pointBuy = bases.every((v) => POINT_COST[v] != null) ? bases.reduce((t, v) => t + POINT_COST[v], 0) : null;
    return h("section", { class: "card" }, h("h2", null, "Caractéristiques"),
      h("p", { class: "muted small-text" }, "Saisissez les valeurs de base (tableau standard 15, 14, 13, 12, 10, 8, achat de points ou dés). Les bonus d'historique et de dons s'ajoutent automatiquement."),
      h("table", { class: "abilities-table" },
        h("thead", null, h("tr", null, h("th", null, ""), h("th", null, "Base"), h("th", null, "Bonus"), h("th", null, "Total"), h("th", null, "Mod."))),
        h("tbody", null, DND.data.abilities.map((a) => {
          const base = Number(ch.abilities[a]);
          const total = s.abilities[a].score;
          return h("tr", null,
            h("td", { title: "EN : " + DND.data.labels[a].en }, DND.data.labels[a].fr),
            h("td", null, h("input", { type: "number", min: 1, max: 30, class: "narrow", value: base, "data-bind": "abilities." + a })),
            h("td", null, total !== base ? sg(total - base) : ""),
            h("td", null, h("b", null, total)),
            h("td", null, sg(s.abilities[a].mod)));
        }))),
      pointBuy != null ? h("p", { class: ["small-text", pointBuy > 27 ? "bad" : "muted"] }, "Coût en achat de points : " + pointBuy + " / 27") : null);
  }

  function origins(App) {
    const ch = App.ch;
    const select = (kind, current, action, placeholder) => h("select", { "data-change": action, value: current },
      h("option", { value: "" }, placeholder),
      Object.values(DND.modules[kind]).sort((a, b) => a.name.fr.localeCompare(b.name.fr)).map((m) =>
        h("option", { value: m.id }, m.name.fr + (m.source ? " (" + m.source + ")" : ""))));
    const desc = (m) => (m && m.description ? h("p", { class: "small-text muted" }, m.description) : null);
    return h("section", { class: "card" }, h("h2", null, "Origines"),
      h("div", { class: "grid2" },
        h("div", null, h("h3", null, "Espèce"), select("species", ch.species.id, "setSpecies", "Choisir une espèce…"), desc(DND.modules.species[ch.species.id])),
        h("div", null, h("h3", null, "Historique"), select("background", ch.background.id, "setBackground", "Choisir un historique…"), desc(DND.modules.background[ch.background.id]), bgProfs(App))));
  }

  function bgProfs(App) {
    const ids = App.sheet.collected.effects.filter((x) => x.source.kind === "background" && x.effect.type === "proficiency").map((x) => x.effect.target);
    const todo = App.sheet.choices.some((c) => c.source.kind === "background" && /^tools/.test(c.effect.from) && !c.selected.length);
    const line = (title, re, extra) => {
      const l = ids.filter((t) => re.test(t)).map((t) => DND.label(t)).concat(extra ? [extra] : []);
      return l.length ? h("div", null, h("b", null, title + " : "), l.join(", ")) : null;
    };
    return ids.length || todo ? h("div", { class: "small-text" }, line("Compétences maîtrisées", /^skill\./), line("Outils maîtrisés", /^tool\./, todo && "un outil à choisir plus bas")) : null;
  }

  function classes(App) {
    const ch = App.ch, s = App.sheet;
    const taken = new Set(ch.classes.map((c) => c.id));
    const available = Object.values(DND.modules.class).filter((m) => !taken.has(m.id));
    return h("section", { class: "card" }, h("h2", null, "Classes et niveaux"),
      ch.classes.map((entry, i) => {
        const m = DND.modules.class[entry.id];
        if (!m) return h("div", { class: "row" }, "Classe inconnue : " + entry.id, h("button", { class: "small danger", "data-action": "askRemoveClass", "data-index": i }, "Retirer"));
        const subs = E.subclassesOf(m);
        const subLevel = m.subclassLevel || 3;
        return h("div", { class: "row wrap class-row" },
          h("b", { title: "EN : " + m.name.en }, m.name.fr),
          h("label", null, "Niveau ", h("input", { type: "number", min: 1, max: 20, class: "narrow", value: entry.level, "data-change": "setClassLevel", "data-index": i })),
          entry.level >= subLevel
            ? h("label", null, "Sous-classe ", h("select", { "data-bind": "classes." + i + ".subclass", value: entry.subclass || "" },
                h("option", { value: "" }, subs.length ? "Choisir…" : "Aucune sous-classe disponible"),
                subs.map((sc) => h("option", { value: sc.id }, sc.name.fr))))
            : h("span", { class: "muted small-text" }, "Sous-classe au niveau " + subLevel),
          i === 0 ? h("span", { class: "tag", title: "Donne les jets de sauvegarde et toutes les maîtrises" }, "classe de départ") : null,
          h("button", { class: "small danger", "data-action": "askRemoveClass", "data-index": i }, "Retirer"));
      }),
      h("div", { class: "row" },
        h("select", { "data-change": "addClass", value: "" },
          h("option", { value: "" }, ch.classes.length ? "Ajouter une classe (multiclassage)…" : "Choisir une classe…"),
          available.map((m) => h("option", { value: m.id }, m.name.fr))),
        s.level ? h("span", { class: "muted" }, "Niveau total : " + s.level + (s.level > 20 ? " (maximum 20)" : "")) : null));
  }

  // --- Choix venant des modules ---
  function choices(App) {
    const s = App.sheet;
    if (!s.choices.length) return null;
    const groups = {};
    for (const c of s.choices) (groups[c.source.label] = groups[c.source.label] || []).push(c);
    return h("section", { class: "card" }, h("h2", null, "Choix", s.pendingChoices ? h("span", { class: "badge" }, s.pendingChoices) : null),
      Object.entries(groups).map(([label, list]) => h("div", { class: "choice-group" },
        h("h3", null, label), list.map((c) => choiceView(App, c)))));
  }

  function choiceView(App, choice) {
    const e = choice.effect, s = App.sheet;
    const sel = choice.selected;
    const maxPer = e.maxPerOption || 1;
    const data = { "data-path": choice.path.join("."), "data-key": choice.key, "data-count": choice.count, "data-max": maxPer };
    const status = (o) => {
      if (o.prerequisite) {
        const r = o.prerequisite(s.context);
        if (r !== true) return typeof r === "string" ? r : "Prérequis non rempli";
      }
      return null;
    };
    const already = (o) => !sel.includes(o.id) && s.prof[o.id] ? " (déjà maîtrisé)" : "";
    const title = (o) => [o.description, o.name && o.name.en ? "EN : " + o.name.en : null].filter(Boolean).join(" · ") || null;
    const done = sel.length >= choice.count;
    const head = h("div", { class: "choice-head" },
      h("b", null, e.label || "Choix"), " ",
      e.optional || e.min != null ? h("span", { class: ["count", sel.length >= (e.min || 0) ? "ok" : "todo"] },
          sel.length + (sel.length > 1 ? " choisies" : " choisie") + (e.min ? " (" + e.min + " minimum)" : ""))
        : h("span", { class: ["count", done ? "ok" : "todo"] }, Math.min(sel.length, choice.count) + " / " + choice.count),
      e.help ? h("div", { class: "small-text muted" }, e.help) : null);

    const row = (o) => ({ id: o.id, o, on: sel.includes(o.id), from: profFrom(s, o.id), reason: status(o), title: title(o) });
    let body;
    if (choice.count === 1 && maxPer === 1 && choice.options.length <= BIG) {
      body = h("select", { "data-change": "choiceSelect", ...data, value: sel[0] || "" },
        h("option", { value: "" }, "— choisir —"),
        choice.options.map((o) => {
          const reason = status(o);
          return h("option", { value: o.id, disabled: !!reason && !sel.includes(o.id), title: title(o) },
            o.name.fr + already(o) + (reason ? " — " + reason : ""));
        }));
    } else if (maxPer > 1) {
      body = h("div", { class: "steppers" }, choice.options.map((o) => {
        const n = sel.filter((x) => x === o.id).length;
        return h("span", { class: "stepper" }, o.name.fr + " ",
          h("button", { class: "small", "data-action": "choiceStep", "data-option": o.id, "data-delta": -1, ...data, disabled: !n }, "−"),
          h("b", null, " +" + n + " "),
          h("button", { class: "small", "data-action": "choiceStep", "data-option": o.id, "data-delta": 1, ...data, disabled: done || n >= maxPer }, "+"));
      }));
    } else body = picker(App, choice.path.join(".") + ":" + choice.key, choice.options.map(row), { add: "choiceAdd", remove: "choiceRemove", data, full: done, ph: "Chercher…" });
    const picked = choice.count === 1 && choice.options.find((o) => o.id === sel[0]);
    if (picked && picked.description) body = [body, h("div", { class: "small-text muted" }, picked.description)];
    return h("div", { class: "choice" }, head, body);
  }

  const BIG = 8;
  const fold = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const TOOL_KINDS = [["artisan", "Outils d'artisan"], ["musical", "Instruments de musique"], ["gaming", "Jeux"], ["", "Autres outils"]];
  function groupOf(r) {
    const [kind, id] = String(r.id).split(".");
    if (kind === "skill" && DND.data.skills[id]) { const a = DND.data.skills[id].ability; return [DND.data.abilities.indexOf(a), DND.data.labels[a].fr]; }
    if (kind === "tool" && DND.data.tools[id]) { const i = TOOL_KINDS.findIndex(([k]) => !k || DND.data.tools[id][k]); return [10 + i, TOOL_KINDS[i][1]]; }
    const o = r.o, n = (o.lists ? o.level : o.prerequisite && o.prerequisite.level) || 0;
    return [100 + n, o.lists ? (n ? "Sorts de niveau " + n : "Tours de magie") : n ? "Niveau " + n + " requis" : "Sans niveau requis"];
  }
  function picker(App, key, rows, { add, remove, data, full, ph }) {
    const q = fold(App.ui.search[key] || "").trim();
    const groups = new Map();
    for (const r of rows) if (!r.on && (!q || fold(r.o.name.fr + " " + (r.o.name.en || "")).includes(q))) {
      const [n, label] = groupOf(r);
      if (!groups.has(n)) groups.set(n, { label, l: [] });
      groups.get(n).l.push(r);
    }
    const split = new Set(rows.map((r) => groupOf(r)[0])).size > 1;
    const found = [...groups.values()].reduce((t, { l }) => t + l.filter((r) => !r.from && !r.reason).length, 0);
    const opt = (r) => h("option", { value: r.id, disabled: !!(r.from || r.reason), title: r.title }, r.o.name.fr + (r.from ? " (" + r.from + ")" : "") + (r.reason ? " — " + r.reason : ""));
    return h("div", { class: "row wrap picker" },
      rows.filter((r) => r.on).map((r) => h("span", { class: "tag", title: r.title }, r.o.name.fr + " ",
        h("button", { class: "small danger", "data-action": remove, "data-option": r.id, ...data, title: "Retirer" }, "×"))),
      full ? null : [
        rows.length > BIG ? h("input", { type: "search", class: "list-search", placeholder: ph, value: App.ui.search[key] || "", "data-input": "search", "data-key": key, "aria-label": "Chercher dans la liste" }) : null,
        h("select", { "data-change": add, "data-sk": key, ...data, value: "" },
          h("option", { value: "" }, q ? (found ? found + " trouvé" + (found > 1 ? "s" : "") + "…" : "Aucun résultat") : "Ajouter…"),
          [...groups].sort((a, b) => a[0] - b[0]).map(([, { label, l }]) => (l = l.sort((a, b) => a.o.name.fr.localeCompare(b.o.name.fr)).map(opt), split ? h("optgroup", { label }, l) : l)))]);
  }

  function profFrom(s, t) {
    const x = s.prof[t] && s.collected.effects.find((x) => x.effect.type === "proficiency" && x.effect.target === t);
    return x ? (x.source.kind === "background" ? "historique" : x.source.label) : "";
  }

  function extraFeats(App) {
    const ch = App.ch;
    return h("section", { class: "card" }, h("h2", null, "Dons supplémentaires"),
      h("p", { class: "muted small-text" }, "Les dons de l'historique et des niveaux de classe se choisissent plus haut. Ici, les dons accordés en plus (par le MJ par exemple)."),
      picker(App, "extraFeats", ch.feats.map((f, i) => ({ id: i, o: DND.modules.feat[f.id] || { name: { fr: f.id } }, on: true }))
        .concat(Object.values(DND.modules.feat).map((f) => ({ id: f.id, o: f, title: f.name.en ? "EN : " + f.name.en : null,
          reason: !f.repeatable && App.sheet.collected.feats.some((x) => x.feat.id === f.id) ? "déjà pris" : "" }))),
        { add: "addFeat", remove: "removeFeat", ph: "Chercher un don…" }));
  }

  function extraProfs(App) {
    const ch = App.ch, s = App.sheet;
    const tools = ch.extraProfs.filter((t) => t.startsWith("tool."));
    const count = (n, max, label) => h("span", { class: ["count", n === max ? "ok" : "todo"], title: "Un historique donne 2 compétences et 1 outil" }, label + " " + n + " / " + max);
    return h("section", { class: "card" }, h("h2", null, "Maîtrises supplémentaires"),
      h("p", { class: "muted small-text" }, "Pour un historique personnalisé ou une maîtrise accordée par le MJ. Elles comptent dans les calculs."),
      h("div", { class: "row wrap" }, count(ch.extraProfs.length - tools.length, 2, "Compétences"), count(tools.length, 1, "Outil")),
      [["skill.", DND.data.skills, "extraSkills", "Chercher une compétence…"], ["tool.", DND.data.tools, "extraTools", "Chercher un outil…"]].map(([pre, data, key, ph]) => picker(App, key,
        Object.entries(data).sort((a, b) => a[1].fr.localeCompare(b[1].fr)).map(([id, x]) => {
          const t = pre + id, on = ch.extraProfs.includes(t);
          return { id: t, o: { name: x }, on, from: !on && profFrom(s, t) };
        }), { add: "addExtraProf", remove: "removeExtraProf", ph })));
  }

  function extraAbilities(App) {
    const x = App.ch.extraAbilities, n = Object.values(x).reduce((t, v) => t + v, 0);
    return h("section", { class: "card" }, h("h2", null, "Bonus de caractéristique supplémentaires"),
      h("p", { class: "muted small-text" }, "Pour un historique personnalisé : +2 à l'une et +1 à une autre, ou +1 à trois (maximum 20). Si votre historique donne déjà ses bonus, laissez vide."),
      h("span", { class: ["count", n === 3 ? "ok" : "todo"] }, "Points " + n + " / 3"),
      h("div", { class: "steppers" }, DND.data.abilities.map((a) => h("span", { class: "stepper" }, DND.data.labels[a].fr + " ",
        h("button", { class: "small", "data-action": "stepExtraAbility", "data-ability": a, "data-delta": -1, disabled: !x[a] }, "−"),
        h("b", null, " +" + (x[a] || 0) + " "),
        h("button", { class: "small", "data-action": "stepExtraAbility", "data-ability": a, "data-delta": 1, disabled: (x[a] || 0) >= 2 }, "+")))));
  }

  const TARGETS = [
    ["ac", "Classe d'armure"], ["initiative", "Initiative"], ["speed", "Vitesse (pieds)"], ["hpMax", "PV maximum"],
    ["save.all", "Tous les jets de sauvegarde"], ["spellDC", "DD des sorts"], ["spellAttack", "Attaque de sort"],
    ["attack.weapon", "Attaque avec une arme"], ["damage.weapon", "Dégâts avec une arme"],
    ...DND.data.abilities.map((a) => ["ability." + a, "Valeur de " + DND.data.labels[a].fr]),
    ...DND.data.abilities.map((a) => ["save." + a, "JS de " + DND.data.labels[a].fr]),
  ];
  function overrides(App) {
    const ch = App.ch;
    return h("section", { class: "card" }, h("h2", null, "Ajustements manuels"),
      h("p", { class: "muted small-text" }, "Pour un objet magique ou une décision du MJ que la fiche ne connaît pas. Ils s'ajoutent aux calculs et restent visibles."),
      ch.overrides.map((o, i) => h("div", { class: "row wrap" },
        h("select", { "data-bind": "overrides." + i + ".target", value: o.target }, TARGETS.map(([id, label]) => h("option", { value: id }, label))),
        h("input", { type: "number", class: "narrow", value: o.value, "data-bind": "overrides." + i + ".value" }),
        h("input", { type: "text", placeholder: "Raison (ex. Anneau de protection)", value: o.label || "", "data-bind": "overrides." + i + ".label" }),
        h("button", { class: "small danger", "data-action": "removeOverride", "data-index": i }, "×"))),
      h("button", { "data-action": "addOverride" }, "Ajouter un ajustement"));
  }

  // --- Actions du mode Création ---
  const storeOf = (ch, d) => DND.app.getPath(ch, d.path);
  Object.assign(DND.app.actions, {
    setSpecies: (d, value) => DND.app.update((ch) => { ch.species = { id: value, choices: {} }; }),
    setBackground: (d, value) => DND.app.update((ch) => { ch.background = { id: value, choices: {} }; }),
    addClass: (d, value) => {
      if (!value) return;
      DND.app.update((ch) => { ch.classes.push({ id: value, level: 1, subclass: "", choices: {} }); });
    },
    setClassLevel: (d, value) => DND.app.update((ch) => {
      ch.classes[Number(d.index)].level = Math.max(1, Math.min(20, Number(value) || 1));
    }),
    askRemoveClass: (d) => {
      const entry = DND.app.ch.classes[Number(d.index)];
      const m = DND.modules.class[entry.id];
      DND.app.setUi({ modal: { type: "confirm", title: "Retirer " + (m ? m.name.fr : entry.id) + " ?",
        text: "Les niveaux et les choix faits dans cette classe seront perdus.", action: "removeClass", data: { "data-index": d.index } } });
    },
    removeClass: (d) => {
      DND.app.ui.modal = null;
      DND.app.update((ch) => { ch.classes.splice(Number(d.index), 1); });
    },
    choiceSelect: (d, value) => DND.app.update((ch) => { storeOf(ch, d)[d.key] = value ? [value] : []; }),
    choiceAdd: (d, value) => { if (value) { DND.app.ui.search[d.sk] = ""; DND.app.update((ch) => { const st = storeOf(ch, d); st[d.key] = (st[d.key] || []).concat(value).slice(-Number(d.count)); }); } },
    choiceRemove: (d) => DND.app.update((ch) => { const st = storeOf(ch, d); st[d.key] = (st[d.key] || []).filter((x) => x !== d.option); }),
    choiceStep: (d) => DND.app.update((ch) => {
      const store = storeOf(ch, d);
      const list = store[d.key] || [];
      if (Number(d.delta) > 0) list.push(d.option);
      else { const i = list.lastIndexOf(d.option); if (i >= 0) list.splice(i, 1); }
      store[d.key] = list;
    }),
    addFeat: (d, value) => { if (value) { DND.app.ui.search[d.sk] = ""; DND.app.update((ch) => { ch.feats.push({ id: value, choices: {} }); }); } },
    removeFeat: (d) => DND.app.update((ch) => { ch.feats.splice(Number(d.option), 1); }),
    addExtraProf: (d, value) => { if (value) { DND.app.ui.search[d.sk] = ""; DND.app.update((ch) => { ch.extraProfs.push(value); }); } },
    removeExtraProf: (d) => DND.app.update((ch) => { ch.extraProfs = ch.extraProfs.filter((t) => t !== d.option); }),
    stepExtraAbility: (d) => DND.app.update((ch) => { ch.extraAbilities[d.ability] = Math.max(0, (ch.extraAbilities[d.ability] || 0) + Number(d.delta)); }),
    addOverride: () => DND.app.update((ch) => { ch.overrides.push({ target: "ac", value: 1, label: "" }); }),
    removeOverride: (d) => DND.app.update((ch) => { ch.overrides.splice(Number(d.index), 1); }),
  });
})();
