// Mode « Jeu » : la fiche utilisée pendant la partie.
(function () {
  const { h } = DND.dom;
  const E = DND.engine;
  const R = DND.rules;
  DND.views = DND.views || {};
  const sg = E.signed;
  const en = (text) => (text ? "EN : " + text : null);

  DND.views.play = function (App) {
    const s = App.sheet, ch = App.ch;
    if (!ch.classes.length) {
      return h("main", { class: "empty" },
        h("p", null, "Ce personnage n'a pas encore de classe."),
        h("button", { class: "primary", "data-action": "mode", "data-mode": "build" }, "Ouvrir la création"));
    }
    // Onglet Sorts seulement si le personnage a des sorts (classe, espèce, don…)
    const hasSpells = App.sheet.casting.length > 0 || App.sheet.spells.length > 0;
    const tabs = [["combat", "Combat"], hasSpells && ["spells", "Sorts"], ["features", "Aptitudes"], ["inventory", "Inventaire"], ["notes", "Notes"]].filter(Boolean);
    const content = { combat, spells: hasSpells ? spells : null, features, inventory, notes }[App.ui.tab] || combat;
    return h("div", { class: "play" },
      h("aside", { class: "left" }, abilities(s), skills(s), passives(s), proficiencies(s)),
      h("main", { class: "main" },
        statStrip(App),
        h("nav", { class: "tabs", role: "tablist" }, tabs.map(([id, label]) =>
          h("button", { class: ["tab", (App.ui.tab === id || (id === "combat" && content === combat)) && "active"], role: "tab", "data-action": "tab", "data-tab": id }, label))),
        h("div", { class: "page" },
          s.warnings.length ? h("div", { class: "banner warn" }, s.warnings.map((w) => h("div", null, w))) : null,
          content(App))));
  };

  // --- Colonne de gauche ---
  function abilities(s) {
    return h("section", { class: "abilities" }, DND.data.abilities.map((a) => {
      const ab = s.abilities[a], l = DND.data.labels[a];
      return h("div", { class: ["ability", "ability-color", "ability-" + a], title: en(l.en) },
        h("div", { class: "ab-name" }, l.short),
        h("div", { class: "ab-mod" }, sg(ab.mod)),
        h("div", { class: "ab-score" }, ab.score),
        h("div", { class: ["ab-save", "ability-color", "ability-" + a, ab.save.proficient && "prof"], title: "Jet de sauvegarde" + (ab.save.advantage.length ? " · avantage : " + ab.save.advantage.join(", ") : "") },
          h("span", { class: "dot" }), "JS ", sg(ab.save.bonus), ab.save.advantage.length ? h("span", { class: "adv" }, " A") : null));
    }));
  }

  // Compétences regroupées par caractéristique (FOR, DEX, INT, SAG, CHA)
  function skills(s) {
    const groups = DND.data.abilities.map((a) => [a, Object.entries(DND.data.skills).filter(([, d]) => d.ability === a)
      .sort(([, x], [, y]) => x.fr.localeCompare(y.fr))]).filter(([, list]) => list.length);
    return h("section", { class: "card narrow-sidebar-card" }, h("h3", null, "Compétences"),
      groups.map(([a, list]) => h("div", { class: "skill-group" },
        h("div", { class: ["skill-group-head", "ability-color", "ability-" + a], title: en(DND.data.labels[a].en) }, DND.data.labels[a].fr, h("span", null, sg(s.abilities[a].mod))),
        h("ul", { class: "skills" }, list.map(([id, def]) => {
          const sk = s.skills[id];
          return h("li", { title: en(def.en) + (sk.advantage.length ? " · avantage : " + sk.advantage.join(", ") : "") },
            h("span", { class: ["dot", sk.prof === 1 && "prof", sk.prof === 2 && "expert"] }),
            h("span", { class: "sk-name" }, def.fr),
            h("span", { class: "sk-bonus" }, sg(sk.bonus), id === "stealth" && s.stealthDisadvantage ? h("span", { class: "dis", title: "Désavantage (armure)" }, " D") : null));
        })))));
  }

  function passives(s) {
    return h("section", { class: "card narrow-sidebar-card" }, h("h3", null, "Valeurs passives"),
      h("div", { class: "kv" }, "Perception", h("b", null, s.passive.perception)),
      h("div", { class: "kv" }, "Intuition", h("b", null, s.passive.insight)),
      h("div", { class: "kv" }, "Investigation", h("b", null, s.passive.investigation)),
      Object.entries(s.senses).map(([k, v]) => h("div", { class: "kv" }, DND.label("sense." + k), h("b", null, E.meters(v)))));
  }

  function proficiencies(s) {
    const line = (title, ids) => ids.length ? h("p", null, h("b", null, title + " : "), ids.map((x) => DND.label(x)).join(", ")) : null;
    return h("section", { class: "card small-text narrow-sidebar-card" }, h("h3", null, "Maîtrises et langues"),
      line("Armures", s.proficiencies.armor),
      line("Armes", s.proficiencies.weapons),
      line("Outils", s.proficiencies.tools),
      line("Langues", s.proficiencies.languages),
      s.resistances.length ? h("p", null, h("b", null, "Résistances : "), s.resistances.map((d) => DND.label(d)).join(", ")) : null);
  }

  // --- Bandeau des valeurs de combat ---
  function statStrip(App) {
    const s = App.sheet, ch = App.ch;
    const speeds = Object.entries(s.speed).filter(([, v]) => v > 0);
    return h("section", { class: "strip" },
      stat("CA", s.ac.value, s.ac.parts.map((p) => p.label + " " + p.value).join(" · ")),
      stat("Initiative", sg(s.initiative.bonus), s.initiative.advantage.length ? "Avantage : " + s.initiative.advantage.join(", ") : null),
      stat("Vitesse", E.meters(s.speed.walk), speeds.map(([k, v]) => DND.label("speed." + k) + " " + E.meters(v)).join(" · ")),
      stat("Maîtrise", sg(s.pb), "Bonus de maîtrise"),
      stat("Taille", DND.label("size." + s.size)),
      h("button", { class: ["stat", "toggle", ch.state.heroicInspiration && "on"], "data-action": "inspiration", title: "Inspiration héroïque (Heroic Inspiration) : relancer un dé" },
        h("div", { class: "stat-label" }, "Inspiration"), h("div", { class: "stat-value" }, ch.state.heroicInspiration ? "★" : "☆")));
  }
  function stat(label, value, title, ability) {
    return h("div", { class: ["stat", ability && "ability-color", ability && "ability-" + ability], title }, h("div", { class: "stat-label" }, label), h("div", { class: "stat-value" }, value));
  }

  // --- Onglet Combat ---
  function combat(App) {
    const s = App.sheet, ch = App.ch;
    const attackCards = [attacksCard(s), supportSpellsCard(s)].filter(Boolean);
    const attackPair = attackCards.length > 1 ? h("div", { class: "attack-support-pair" }, attackCards) : attackCards[0];
    const resourceCards = [resourcesCard(s), slotsCard(s)].filter(Boolean);
    return h("div", { class: "grid2 combat-grid" },
      h("div", null, hpCard(App), concentrationCard(App), restCard(s), conditionsCard(ch, s), s.companions.map((cp) => companionCard(App, cp))),
      h("div", null, attackPair, resourceCards.length ? h("div", { class: "resource-pair" }, resourceCards) : null, actionsCard(s), notesCard(s)));
  }

  function hpCard(App) {
    const s = App.sheet, ch = App.ch;
    const pct = s.hp.max ? Math.max(0, Math.min(100, (100 * s.hp.current) / s.hp.max)) : 0;
    return h("section", { class: "card hp" },
      h("h3", null, "Points de vie"),
      h("div", { class: "hp-line" },
        h("span", { class: "hp-current" }, s.hp.current),
        h("span", { class: "muted" }, " / ", h("span", { title: s.hp.parts.map((p) => p.label + " " + p.value).join(" · ") }, s.hp.max)),
        s.hp.temp ? h("span", { class: "hp-temp", title: "PV temporaires" }, " +" + s.hp.temp + " temp.") : null),
      h("div", { class: "bar" }, h("div", { class: ["bar-fill", pct <= 25 && "low"], style: "width:" + pct + "%" })),
      h("div", { class: "row" },
        h("input", { type: "number", min: 0, class: "amount", placeholder: "Valeur", value: App.ui.amount, "data-ui": "amount", "data-enter": "damage", "aria-label": "Valeur" }),
        h("button", { class: "danger", "data-action": "damage" }, "Dégâts"),
        h("button", { class: "good", "data-action": "heal" }, "Soins"),
        h("button", { "data-action": "tempHp" }, "PV temp.")),
      s.hp.current <= 0 ? deathSaves(ch) : null,
      hitDiceRow(s));
  }

  // Dés de vie : compteur ajustable (les jets se font hors de la fiche), tous récupérés au repos long
  function hitDiceRow(s) {
    return h("div", { class: "hit-dice" }, h("b", { title: "Hit Dice : pleins = disponibles, cliquez pour dépenser ou récupérer" }, "Dés de vie"),
      s.hitDice.map((hd) => h("div", { class: "resource" },
        h("span", null, hd.die + " ", h("small", { class: "muted" }, (hd.total - hd.spent) + " / " + hd.total)),
        pips(hd.total, hd.spent, "hitDie", { "data-die": hd.die }))));
  }

  // Concentration : sort en cours et rappel de la règle
  function concentrationCard(App) {
    const st = App.ch.state;
    const options = App.sheet.spells.filter((x) => x.spell.concentration).map((x) => x.spell.name.fr);
    if (!options.length && !st.concentration) return null; // aucun sort à concentration connu
    const info = E.concentrationInfo(App.sheet, st);
    return h("section", { class: ["card", st.concentration && "concentrating"] }, h("h3", { title: "Concentration" }, "Concentration"),
      h("div", { class: "row" },
        h("input", { type: "text", class: "grow", list: "concentration-spells", value: st.concentration, placeholder: "Aucun sort en cours", "data-bind": "state.concentration", "aria-label": "Sort en concentration" }),
        h("datalist", { id: "concentration-spells" }, options.map((o) => h("option", { value: o }))),
        st.concentration ? h("button", { class: "small", "data-action": "endConcentration" }, "Fin") : null),
      info ? h("div", { class: "row conc-duration" },
        h("span", null, "Durée : ", h("b", null, info.noConcentration ? info.duration + " (sans concentration)" : "jusqu'à " + info.duration.toLowerCase())),
        info.levels.length ? h("select", { "data-change": "concentrationSlot", value: info.level, "aria-label": "Niveau de l'emplacement utilisé", title: "Niveau de l'emplacement utilisé" },
          info.levels.map((l) => h("option", { value: l }, "Emplacement niv. " + l))) : null) : null,
      h("ul", { class: "rule small-text" },
        h("li", null, "Dégâts subis : JS de Constitution, DD 10 ou la moitié des dégâts si c'est plus (DD 30 max). Un jet par source de dégâts."),
        h("li", null, "Fin de la concentration : vous lancez un autre sort à concentration, vous êtes Neutralisé ou vous mourez. Vous pouvez y mettre fin à tout moment (sans action)."),
        h("li", { class: "muted" }, "Le bouton Dégâts indique le DD du jet quand un sort est en cours.")));
  }

  // Jets contre la mort : affichés seulement à 0 PV ; remis à zéro par les soins et le repos long
  function deathSaves(ch) {
    const ds = ch.state.deathSaves;
    const row = (kind, label) => h("span", { class: "ds-row" }, h("span", { class: "ds-label" }, label),
      [1, 2, 3].map((n) => h("button", { class: ["pip", "box", ds[kind] >= n && (kind === "success" ? "full good" : "full bad")],
        "data-action": "deathSave", "data-kind": kind, "data-n": n, "aria-label": label + " " + n, "aria-pressed": ds[kind] >= n ? "true" : "false" })));
    const status = ds.failure >= 3 ? h("span", { class: "ds-status bad" }, "Mort")
      : ds.success >= 3 ? h("span", { class: "ds-status good" }, "Stable") : null;
    return h("div", { class: "death" },
      h("b", { title: "Death Saving Throws : DD 10, 3 réussites = stable, 3 échecs = mort. 20 naturel : 1 PV ; 1 naturel : deux échecs." }, "Jets contre la mort"),
      status, h("div", { class: "row" }, row("success", "Réussites"), row("failure", "Échecs"),
        status ? null : h("button", { class: "small", "data-action": "stabilize", title: "Stabilisé par un allié (Médecine, Stabilisation…)" }, "Stabiliser")));
  }

  // Liste de lignes « Titre : texte », titre en gras (traits de compagnon, bottes d'arme…)
  function traitList(lines) {
    return h("ul", { class: "companion-traits small-text" }, lines.map((line) => {
      const m = /^([^:]{1,60}) : (.*)$/.exec(line);
      return h("li", null, m ? [h("strong", null, m[1]), " : " + m[2]] : line);
    }));
  }

  // Compagnon (ex. familier) : forme, CA, PV suivis comme ceux du personnage
  function companionCard(App, cp) {
    const base = "state.companions." + cp.id;
    const st = App.ch.state.companions[cp.id];
    return h("section", { class: "card" }, h("h3", { title: cp.name.en ? "EN : " + cp.name.en : null }, cp.name.fr),
      cp.forms.length > 1 ? h("div", { class: "row wrap" },
        h("select", { "data-change": "companionForm", "data-id": cp.id, value: st.form || "" },
          h("option", { value: "" }, "Choisir la forme…"),
          cp.forms.map((f) => h("option", { value: f.id, title: f.name.en ? "EN : " + f.name.en : null }, f.name.fr)))) : null,
      cp.form || cp.hpMax ? [
        h("div", { class: "row wrap" },
          h("label", { title: "Classe d'armure" }, "CA ", h("input", { type: "number", class: "narrow", value: cp.ac, "data-bind": base + ".custom.ac" })),
          h("label", null, "PV max ", h("input", { type: "number", class: "narrow", value: cp.hpMax, "data-bind": base + ".custom.hp" })),
          h("span", null, "Vitesse : " + (cp.speed || "—"))),
        h("div", { class: "row" },
          h("span", { class: "hp-current small" }, cp.hp), h("span", { class: "muted" }, " / " + cp.hpMax + " PV "),
          h("button", { class: "small danger", "data-action": "companionHp", "data-id": cp.id, "data-delta": 1 }, "−1"),
          h("button", { class: "small", "data-action": "companionHp", "data-id": cp.id, "data-delta": 5 }, "−5"),
          h("button", { class: "small good", "data-action": "companionHp", "data-id": cp.id, "data-delta": -1 }, "+1"),
          h("button", { class: "small good", "data-action": "companionHp", "data-id": cp.id, "data-delta": -999 }, "Max")),
        // Traits : texte libre, ou liste de lignes « Titre : texte » (titre en gras)
        Array.isArray(cp.traits) ? traitList(cp.traits) : cp.traits ? h("div", { class: "small-text" }, cp.traits) : null,
        App.sheet.resources.filter((r) => r.companion === cp.id).map(resourceRow),
        cp.form ? h("p", { class: "small-text" }, h("a", { href: DND.config.monsterUrl(cp.form), target: "_blank", rel: "noopener",
          title: "Statistiques, attaques et sorts exacts" }, "Fiche complète de " + cp.form.name.fr.replace(" ★", "") + (/5e\.tools/.test(DND.config.monsterUrl(cp.form)) ? " sur 5e.tools" : " sur AideDD"))) : null] : null,
      cp.notes.map((n) => h("div", { class: "small-text muted" }, n)),
      cp.description ? h("div", { class: "small-text muted" }, cp.description) : null,
      h("p", { class: "small-text muted" }, "CA et PV pré-remplis : corrigez-les ci-dessus si la fiche complète diffère."));
  }

  function notesCard(s) {
    if (!s.notes.length) return null;
    return h("section", { class: "card" }, h("h3", null, "À retenir"),
      s.notes.map((n) => h("div", { class: "small-text action" }, h("b", null, n.source + " : "), n.text)));
  }

  function restCard(s) {
    return h("section", { class: "card" }, h("h3", null, "Repos"),
      h("div", { class: "row" },
        h("button", { "data-action": "openModal", "data-modal": "shortRest" }, "Repos court"),
        h("button", { "data-action": "openModal", "data-modal": "longRest" }, "Repos long")));
  }

  // États : ★ = Avantage aux JS contre l'état, ◆ = immunité (espèce, don, aptitude ou saisie manuelle pour un objet)
  const DEFENSE = { advantage: { mark: "★", text: "Avantage aux JS pour l'éviter ou y mettre fin" }, immunity: { mark: "◆", text: "Immunité" } };
  function defenseText(list) {
    return ["immunity", "advantage"].map((k) => {
      const labels = list.filter((d) => d.kind === k).map((d) => d.label);
      return labels.length ? DEFENSE[k].mark + " " + DEFENSE[k].text + " : " + labels.join(", ") : null;
    }).filter(Boolean).join("\n");
  }
  function conditionsCard(ch, s) {
    const st = ch.state;
    const defenses = s.conditionDefenses || {};
    const active = Object.entries(DND.data.conditions).filter(([id]) => st.conditions.includes(id));
    const marks = (id) => {
      const list = defenses[id] || [];
      return ["immunity", "advantage"].filter((k) => list.some((d) => d.kind === k)).map((k) => DEFENSE[k].mark).join("");
    };
    const kinds = Object.values(defenses).flat().map((d) => d.kind);
    const legend = ["advantage", "immunity"].filter((k) => kinds.includes(k)).map((k) => DEFENSE[k].mark + " " + (k === "advantage" ? "Avantage aux JS" : "Immunité"));
    return h("section", { class: "card" }, h("h3", null, "États"),
      h("div", { class: "chips" }, Object.entries(DND.data.conditions).map(([id, c]) =>
        h("button", { class: ["chip", st.conditions.includes(id) && "on", defenses[id] && "guarded"], "data-action": "condition", "data-id": id,
          title: c.summary + " (EN : " + c.en + ")" + (defenses[id] ? "\n" + defenseText(defenses[id]) : "") },
          c.fr, marks(id) ? h("span", { class: "chip-mark" }, " " + marks(id)) : null))),
      legend.length ? h("p", { class: "small-text muted" }, legend.join(" · ") + " (survolez l'état pour voir la source)") : null,
      active.length ? h("ul", { class: "condition-effects small-text" }, active.map(([id, c]) =>
        h("li", null, h("b", null, c.fr + " : "), c.summary,
          defenses[id] ? h("div", { class: "defense" }, defenseText(defenses[id])) : null))) : null,
      h("div", { class: "row wrap" },
        h("span", { title: "Exhaustion" }, "Épuisement"),
        h("button", { class: "small", "data-action": "exhaustion", "data-delta": -1 }, "−"),
        h("b", null, st.exhaustion),
        h("button", { class: "small", "data-action": "exhaustion", "data-delta": 1 }, "+"),
        st.exhaustion >= 6 ? h("span", { class: "bad" }, " Mort") : s.exhaustionText ? h("span", { class: "small-text" }, s.exhaustionText) : null),
      conditionDefenseForm(ch));
  }
  // Saisie manuelle (objet libre, bénédiction du MJ…) : ajoute une étoile ou un losange sur l'état
  function conditionDefenseForm(ch) {
    return h("details", { class: "small-text" }, h("summary", null, "Avantages contre un état venant d'un objet" + (ch.conditionDefenses.length ? " (" + ch.conditionDefenses.length + ")" : "")),
      ch.conditionDefenses.map((d, i) => h("div", { class: "row wrap" },
        h("select", { "data-bind": "conditionDefenses." + i + ".condition", value: d.condition, "aria-label": "État" },
          Object.entries(DND.data.conditions).map(([id, c]) => h("option", { value: id }, c.fr))),
        h("select", { "data-bind": "conditionDefenses." + i + ".kind", value: d.kind, "aria-label": "Effet" },
          h("option", { value: "advantage" }, "★ Avantage aux JS"), h("option", { value: "immunity" }, "◆ Immunité")),
        h("input", { type: "text", class: "grow", placeholder: "Source (ex. Cape de protection)", value: d.label || "", "data-bind": "conditionDefenses." + i + ".label", "aria-label": "Source" }),
        h("button", { class: "small danger", "data-action": "removeConditionDefense", "data-index": i, "aria-label": "Retirer" }, "×"))),
      h("button", { class: "small", "data-action": "addConditionDefense" }, "Ajouter"));
  }

  function attacksCard(s) {
    return h("section", { class: "card" }, h("h3", null, "Attaques"),
      h("table", { class: "attacks compact-table" },
        h("thead", null, h("tr", null, h("th", null, "Nom"), h("th", null, "Attaque"), h("th", null, "Dégâts"), h("th", null, "Portée"))),
        h("tbody", null, s.attacks.map((a) => h("tr", { class: a.kind === "weapon" && !a.equipped ? "dim" : "" },
          h("td", { title: [en(a.nameEn), a.props.join(", ")].filter(Boolean).join(" · ") },
            a.kind === "spell" && a.spell && !a.spell.custom
              ? h("a", { href: DND.config.spellUrl(a.spell), target: "_blank", rel: "noopener", title: "EN : " + a.spell.name.en + " · description complète sur AideDD" }, a.name)
              : a.name,
            a.mastery ? h("span", { class: "tag", title: a.mastery.summary }, a.mastery.fr) : null,
            a.kind === "weapon" && !a.proficient ? h("span", { class: "tag warn", title: "Arme non maîtrisée" }, "non maîtrisée") : null,
            a.bond ? h("span", { class: "tag", title: a.bond }, s.weaponBond ? s.weaponBond.column : "Pacte") : null,
            a.option ? h("span", { class: "tag", title: "Dégâts et caractéristique calculés avec " + a.option }, a.option) : null),
          h("td", null, a.toHit != null ? sg(a.toHit) : a.save ? h("span", { class: ["ability-color", "ability-" + a.save.ability] }, "JS " + DND.data.labels[a.save.ability].short + " " + a.save.dc) : "—"),
          h("td", null, a.damage, a.versatile ? h("small", { class: "muted" }, " (" + a.versatile + " à 2 mains)") : null),
          h("td", null, a.range))))));
  }

  function supportSpellsCard(s) {
    const supportSpells = s.spells.filter((sp) => !sp.spell.damage && !sp.spell.attack)
      .sort((a, b) => a.spell.level - b.spell.level || a.spell.name.fr.localeCompare(b.spell.name.fr));
    if (!supportSpells.length) return null;
    return h("section", { class: "card" }, h("h3", null, "Sorts de supports"),
      h("ul", { class: "support-spells" }, supportSpells.map((sp) => {
        const spell = sp.spell;
        const info = [spell.level ? "Niveau " + spell.level : "Tour de magie", E.range(spell.range), spell.duration].filter(Boolean).join(" · ");
        return h("li", null,
          spell.custom ? h("b", null, spell.name.fr)
            : h("a", { href: DND.config.spellUrl(spell), target: "_blank", rel: "noopener", title: "EN : " + spell.name.en + " · description complète sur AideDD" }, spell.name.fr),
          h("span", { class: "small-text muted" }, info + (spell.concentration ? " · Concentration" : "")));
      })));
  }

  function pips(count, spent, action, data, canRecover) {
    if (canRecover == null) canRecover = true;
    if (count > 12) {
      return h("span", { class: "counter" },
        h("button", { class: "small", "data-action": action, "data-delta": 1, ...data }, "−"),
        h("b", null, " " + (count - spent) + " / " + count + " "),
        h("button", { class: "small", "data-action": action, "data-delta": -1, disabled: !canRecover, title: canRecover ? "Récupérer" : "Récupération par repos ou emplacement niv. 6+ uniquement", ...data }, "+"));
    }
    const out = [];
    for (let i = 0; i < count; i++) {
      const available = i < count - spent;
      out.push(h("button", { class: ["pip", available && "full"], "data-action": action, "data-delta": available ? 1 : -1, ...data,
        disabled: !available && !canRecover, title: available ? "Dépenser" : canRecover ? "Récupérer" : "Récupération par repos ou emplacement niv. 6+ uniquement" }));
    }
    return h("span", { class: "pips" }, out);
  }

  const RECHARGE = { short: "repos court", long: "repos long" };
  // Ressource rattachée à un compagnon (effet resource avec companion) : affichée sur sa carte
  const onCompanion = (s, r) => r.companion && s.companions.some((cp) => cp.id === r.companion);
  function resourceRow(r) {
    const isKeeper = r.id === "cleric.keeperOfSouls";
    const slots = isKeeper && r.spent > 0 ? DND.app.sheet.spellSlots.filter((sl) => sl.level >= 6 && sl.spent < sl.max) : [];
    const incapacitated = DND.app.ch.state.conditions.includes("incapacitated");
    const row = h("div", { class: "resource", title: (r.description || "") + (r.name.en ? " (EN : " + r.name.en + ")" : "") },
      h("div", { class: "res-name" }, r.name.fr, h("small", { class: "muted" },
        " · " + (isKeeper ? "repos court ou long" : RECHARGE[r.recharge]) + (r.shortRegain ? " (" + r.shortRegain + " au repos court)" : ""))),
      pips(r.max, r.spent, "resource", { "data-id": r.id }, !isKeeper));
    if (!isKeeper || r.spent < 1) return row;
    const recovery = h("div", { class: "grave-recovery small-text" }, "Récupérer sans action avec un emplacement : ",
        slots.length ? slots.map((sl) => h("button", { class: "small", "data-action": "restoreKeeperOfSouls", "data-level": sl.level,
          disabled: incapacitated, title: incapacitated ? "Impossible en étant Neutralisé" : "Dépenser un emplacement de niveau " + sl.level }, "Niv. " + sl.level))
          : h("span", { class: "muted" }, "aucun emplacement de niveau 6+ disponible"));
    return h("div", { class: "resource-stack" }, row, recovery);
  }
  function resourcesCard(s) {
    const list = s.resources.filter((r) => !onCompanion(s, r));
    if (!list.length) return null;
    return h("section", { class: "card" }, h("h3", null, "Ressources"), list.map(resourceRow));
  }

  function slotsCard(s) {
    if (!s.spellSlots.length && !s.pact) return null;
    return h("section", { class: "card" }, h("h3", null, "Emplacements de sorts"),
      s.spellSlots.map((sl) => h("div", { class: "resource" },
        h("div", { class: "res-name" }, "Niveau " + sl.level, sl.extra ? h("small", { class: "muted" }, " · dont " + sl.extra + " créé" + (sl.extra > 1 ? "s" : "")) : null),
        h("span", { class: "row" }, pips(sl.max, sl.spent, "slot", { "data-level": sl.level }),
          sl.extra ? h("button", { class: "small", "data-action": "addSlot", "data-level": sl.level, "data-delta": -1, title: "Retirer un emplacement créé" }, "−") : null,
          sl.level <= s.extraSlots ? h("button", { class: "small", "data-action": "addSlot", "data-level": sl.level, "data-delta": 1, title: "Ajouter un emplacement créé (perdu au repos long)" }, "+") : null))),
      s.pact ? h("div", { class: "resource", title: "Pact Magic : récupérés au repos court" },
        h("div", { class: "res-name" }, "Magie de pacte (niveau " + s.pact.level + ")", h("small", { class: "muted" }, " · repos court")),
        pips(s.pact.count, s.pact.spent, "pactSlot", {})) : null);
  }

  const ACTION_TYPES = { action: "Action", bonus: "Action bonus", reaction: "Réaction", free: "Gratuite", passive: "Passif" };
  function actionsCard(s) {
    if (!s.actions.length) return null;
    return h("section", { class: "card" }, h("h3", null, "Actions spéciales"),
      s.actions.map((a) => h("div", { class: "action" },
        h("div", null, h("b", null, a.name.fr), " ", h("span", { class: "tag" }, ACTION_TYPES[a.actionType] || a.actionType)),
        Array.isArray(a.description) ? traitList(a.description) : h("div", { class: "small-text" }, a.description))));
  };

  // --- Onglet Sorts ---
  const CAST = { action: "1 action", bonus: "1 action bonus", reaction: "1 réaction" };
  function spells(App) {
    const s = App.sheet;
    const byLevel = {};
    for (const sp of s.spells) (byLevel[sp.spell.level] = byLevel[sp.spell.level] || []).push(sp);
    return h("div", null,
      s.casting.map((c) => {
        const chosen = s.spells.filter((x) => x.classId === c.classId);
        const cantrips = chosen.filter((x) => x.spell.level === 0).length;
        const leveled = chosen.filter((x) => x.spell.level > 0 && x.prepared).length;
        return h("section", { class: "card casting" },
          h("h3", null, c.name.fr),
          h("div", { class: "strip small" },
            stat("Caractéristique", DND.data.labels[c.ability].short, null, c.ability),
            stat("DD des sorts", c.dc),
            stat("Attaque de sort", sg(c.attack)),
            stat("Tours de magie", cantrips + " / " + c.cantrips),
            stat("Sorts préparés", leveled + " / " + c.prepared)),
          addSpellRow(App, c));
      }),
      s.casting.length ? null : h("p", { class: "muted" }, "Pas d'incantation de classe. Les sorts accordés par l'espèce ou les dons apparaissent ci-dessous."),
      Object.keys(byLevel).sort((a, b) => a - b).map((lvl) => h("section", { class: "card" },
        h("h3", null, lvl === "0" ? "Tours de magie" : "Niveau " + lvl),
        h("ul", { class: "spells" }, byLevel[lvl].map((sp) => spellRow(App, sp))))),
      customSpellForm(App));
  }

  function spellRow(App, sp) {
    const spell = sp.spell;
    const tags = [];
    for (const comp of componentsOf(spell)) tags.push(h("span", { class: "tag comp", title: comp.title }, comp.label));
    const up = sp.upcast && sp.upcast.slotLevel ? sp.upcast : null; // effet calculé (Magie de pacte)
    const concentration = spell.concentration && !(up && up.noConcentration);
    if (concentration) tags.push(h("span", { class: "tag", title: "Concentration" }, "C"));
    if (spell.ritual) tags.push(h("span", { class: "tag", title: "Rituel" }, "R"));
    if (sp.atWill) tags.push(h("span", { class: "tag", title: "Sans emplacement de sort" }, "à volonté"));
    const effect = [];
    if (spell.attack) effect.push("Attaque " + sg(sp.attack));
    if (spell.save && sp.dc) effect.push("JS " + DND.data.labels[spell.save].short + " DD " + sp.dc);
    if (sp.damage) effect.push(sp.damage);
    return h("li", { class: "spell" },
      h("div", { class: "spell-main" },
        spell.custom ? h("b", null, spell.name.fr)
          : h("a", { href: DND.config.spellUrl(spell), target: "_blank", rel: "noopener", title: "EN : " + spell.name.en + " · description complète sur AideDD" }, spell.name.fr),
        tags,
        (() => { const info = [CAST[spell.castingTime] || spell.castingTime, E.range(spell.range), (up && up.duration) || spell.duration].filter(Boolean).join(" · ");
          return info ? h("span", { class: "muted small-text" }, " · " + info) : null; })(),
        effect.length ? h("div", { class: "small-text" }, effect.join(" · ")) : null,
        spell.notes ? h("div", { class: "small-text muted" }, spell.notes) : null,
        sp.upcast ? upcastLine(sp) : null),
      h("div", { class: "spell-side" },
        h("small", { class: "muted" }, sp.source + (sp.alwaysPrepared ? " · toujours préparé" : "")),
        sp.freeCast ? pips(sp.freeCast.max, App.sheet.resources.find((r) => r.id === sp.resourceId).spent, "resource", { "data-id": sp.resourceId }) : null,
        concentration ? h("button", { class: ["small", App.ch.state.concentration === spell.name.fr && "on"], "data-action": "concentrate", "data-name": spell.name.fr,
          title: "Noter ce sort comme sort en concentration (onglet Combat)" }, "Se concentrer") : null,
        sp.index != null ? h("button", { class: "small danger", "data-action": "removeSpell", "data-index": sp.index, title: "Retirer" }, "×") : null));
  }

  // Emplacement de niveau supérieur : effet calculé au niveau des emplacements de pacte,
  // sinon le texte de règle (le niveau de l'emplacement se choisit au lancement).
  function upcastLine(sp) {
    const up = sp.upcast;
    if (up.slotLevel) {
      const free = sp.freeCast ? " (lancement gratuit : niveau " + sp.spell.level + ")" : "";
      return h("div", { class: "small-text upcast", title: "Emplacement de niveau supérieur : " + up.text },
        h("b", null, "Emplacement de pacte niv. " + up.slotLevel + " : "), up.summary.join(" · ") + free);
    }
    return h("div", { class: "small-text muted upcast" }, h("i", null, "Niveau supérieur : "), up.text);
  }

  // Composantes : V (verbale), S (somatique), M (matérielle, avec son texte quand il est connu)
  const COMPONENTS = {
    V: "Verbale : vous devez pouvoir parler (impossible sous Silence ou bâillonné).",
    S: "Somatique : il faut une main libre pour les gestes (elle peut tenir le focaliseur).",
    M: "Matérielle : sacoche à composantes ou focaliseur, sauf si la composante a un coût ou est consommée.",
  };
  function componentsOf(spell) {
    if (!spell.components) return [];
    return spell.components.split(/[,\s]+/).filter((k) => COMPONENTS[k]).map((k) => ({ label: k,
      title: COMPONENTS[k] + (k === "M" && spell.material ? " Ici : " + spell.material : "") }));
  }

  function addSpellRow(App, c) {
    const known = new Set(App.ch.spells.filter((x) => x.source === c.classId).map((x) => x.id));
    const all = Object.values(DND.data.spells)
      .filter((sp) => (c.lists || [c.list]).some((l) => sp.lists.includes(l)) && sp.level <= c.maxSpellLevel && !known.has(sp.id))
      .sort((a, b) => a.level - b.level || a.name.fr.localeCompare(b.name.fr));
    // Recherche par morceau de nom, sans tenir compte des accents ni des majuscules (nom français ou anglais)
    const query = fold(App.ui.search[c.classId] || "").trim();
    const options = all.filter((sp) => matches(c.classId, sp));
    const first = !all.length ? "Aucun autre sort disponible dans le catalogue"
      : query ? (options.length ? options.length + " sort" + (options.length > 1 ? "s" : "") + " trouvé" + (options.length > 1 ? "s" : "") + "…" : "Aucun sort ne correspond")
      : "Ajouter un sort de " + c.name.fr + "…";
    return h("div", { class: "row wrap" },
      searchBox(App, c.classId, "Chercher un sort…", "Chercher un sort de " + c.name.fr),
      h("select", { "data-change": "addSpell", "data-class": c.classId, value: "" },
        h("option", { value: "" }, first),
        options.map((sp) => h("option", { value: sp.id, title: sp.name.en ? "EN : " + sp.name.en : null }, (sp.level ? "Niv. " + sp.level : "Tour") + " · " + sp.name.fr))));
  }
  // Recherche : minuscules, sans accents ; le texte tapé est gardé par liste (clé = classe ou "inventory")
  const fold = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const matches = (key, item) => { const q = fold(DND.app.ui.search[key] || "").trim();
    return !q || fold(item.name.fr).includes(q) || fold(item.name.en || "").includes(q); };
  function searchBox(App, key, placeholder, label) {
    return h("input", { type: "search", class: "list-search", placeholder, value: App.ui.search[key] || "",
      "data-input": "search", "data-key": key, "aria-label": label });
  }
  function clearSearch(key) {
    DND.app.ui.search[key] = "";
    document.querySelectorAll(".list-search").forEach((i) => { if (i.dataset.key === key) i.value = ""; });
  }

  function customSpellForm(App) {
    const f = App.ui.addSpell;
    return h("details", { class: "card" }, h("summary", null, "Ajouter un sort absent du catalogue"),
      h("div", { class: "row wrap" },
        h("input", { type: "text", placeholder: "Nom", value: f.name || "", "data-ui-form": "name" }),
        h("input", { type: "number", min: 0, max: 9, placeholder: "Niv.", value: f.level || "", "data-ui-form": "level", class: "narrow" }),
        h("input", { type: "text", placeholder: "Notes (portée, effet…)", value: f.notes || "", "data-ui-form": "notes" }),
        h("button", { "data-action": "addCustomSpell" }, "Ajouter")));
  }

  // --- Onglet Aptitudes ---
  function features(App) {
    const s = App.sheet;
    const groups = {};
    for (const f of s.features) (groups[f.source.label] = groups[f.source.label] || []).push(f);
    return h("div", null,
      Object.entries(groups).map(([label, list]) => h("section", { class: "card" }, h("h3", null, label),
        list.map((f) => h("div", { class: "feature" },
          h("div", null, h("b", { title: en(f.name.en) }, f.name.fr), f.source.kind === "class" && f.level ? h("small", { class: "muted" }, " · niveau " + f.level) : null),
          f.description ? h("div", { class: "small-text" }, f.description) : null)))),
      h("section", { class: "card" }, h("h3", null, "Aptitudes personnalisées"),
        h("p", { class: "muted small-text" }, "Pour tout ce que la fiche ne gère pas encore (objet magique, faveur du MJ…)."),
        App.ch.customFeatures.map((f, i) => h("div", { class: "row" },
          h("input", { type: "text", value: f.name, placeholder: "Nom", "data-bind": "customFeatures." + i + ".name" }),
          h("input", { type: "text", class: "grow", value: f.description, placeholder: "Description", "data-bind": "customFeatures." + i + ".description" }),
          h("button", { class: "small danger", "data-action": "removeCustomFeature", "data-index": i }, "×"))),
        h("button", { "data-action": "addCustomFeature" }, "Ajouter une aptitude")));
  }

  // --- Onglet Inventaire ---
  // Poids saisis et stockés en livres comme dans les règles, affichés en kg (1 lb = 0,5 kg).
  const CATALOG = [
    ["Armures", () => Object.values(DND.data.armor)],
    ["Armes courantes", () => Object.values(DND.data.weapons).filter((w) => w.category === "simple")],
    ["Armes de guerre", () => Object.values(DND.data.weapons).filter((w) => w.category === "martial")],
    ["Paquetages", () => Object.values(DND.data.gear).filter((g) => g.category === "pack")],
    ["Focaliseurs et composantes", () => Object.values(DND.data.gear).filter((g) => g.category === "focus")],
    ["Équipement d'aventurier", () => Object.values(DND.data.gear).filter((g) => g.category === "gear")],
    ["Outils", () => Object.keys(DND.data.tools).map((id) => E.itemData(id))],
    ["Objets magiques", () => Object.values(DND.data.gear).filter((g) => g.category === "magic")],
  ];
  const sortFr = (list) => list.slice().sort((a, b) => a.name.fr.localeCompare(b.name.fr));

  function inventory(App) {
    const ch = App.ch, load = App.sheet.load;
    const bag = load.bag;
    const rows = ch.inventory.map((it, i) => {
      const data = E.itemData(it.id);
      const combat = DND.data.weapons[it.id] || DND.data.armor[it.id];
      const w = load.items[i];
      const def = data ? data.weight || 0 : 0;
      return h("tr", { class: w.inBag ? "in-bag" : "" },
        h("td", null, data ? h("span", { title: [data.name.en && "EN : " + data.name.en, data.contents].filter(Boolean).join(" · ") }, data.name.fr,
            data.contents ? h("span", { class: "tag", title: data.contents }, "contenu") : null) :
          h("input", { type: "text", value: it.name || "", placeholder: "Nom de l'objet", "data-bind": "inventory." + i + ".name" })),
        h("td", null, h("input", { type: "number", min: 0, class: "narrow", value: it.qty, "data-bind": "inventory." + i + ".qty" })),
        h("td", null, combat ? h("input", { type: "checkbox", checked: !!it.equipped, "data-bind": "inventory." + i + ".equipped", "aria-label": "Équipé" }) : null),
        h("td", null, combat ? h("input", { type: "number", class: "narrow", value: it.bonus || 0, title: "Bonus magique (+1, +2…)", "data-bind": "inventory." + i + ".bonus" }) : null),
        h("td", null, h("input", { type: "checkbox", checked: !!it.attuned, title: "Objet magique harmonisé", "data-bind": "inventory." + i + ".attuned", "aria-label": "Harmonisé" })),
        App.sheet.weaponBond ? h("td", null, DND.data.weapons[it.id] ? h("input", { type: "checkbox", checked: !!it.pactWeapon, title: App.sheet.weaponBond.label, "data-bind": "inventory." + i + ".pactWeapon", "aria-label": App.sheet.weaponBond.label }) : null) : null,
        h("td", null, h("input", { type: "number", min: 0, step: "0.05", class: "narrow", value: it.weight != null && it.weight !== "" ? round(it.weight * 0.5) : "",
          placeholder: data ? String(round(def * 0.5)).replace(".", ",") : "0", title: "Poids d'un exemplaire en kg" + (data ? " (laisser vide pour la valeur du livre)" : ""),
          "data-change": "itemWeight", "data-index": i, "aria-label": "Poids unitaire en kg" })),
        h("td", { class: "num" }, E.kg(w.total)),
        bag ? h("td", null, data && data.holds ? null : h("input", { type: "checkbox", checked: !!it.inBag, title: "Rangé dans le sac sans fond", "data-bind": "inventory." + i + ".inBag", "aria-label": "Dans le sac sans fond" })) : null,
        h("td", null, h("input", { type: "text", value: it.notes || "", "data-bind": "inventory." + i + ".notes" })),
        h("td", null, h("button", { class: "small danger", "data-action": "removeItem", "data-index": i }, "×")));
    });
    const coins = [["pp", "pp", "Pièces de platine"], ["gp", "po", "Pièces d'or"], ["ep", "pe", "Pièces d'électrum"], ["sp", "pa", "Pièces d'argent"], ["cp", "pc", "Pièces de cuivre"]];
    const heads = ["Objet", "Qté", "Équipé", "Bonus", "Harm.", App.sheet.weaponBond ? App.sheet.weaponBond.column : null, "Poids (kg)", "Total", bag ? "Sac" : null, "Notes", ""].filter((x) => x !== null);
    return h("div", null,
      loadCard(App),
      h("section", { class: "card" }, h("h3", null, "Bourse"),
        h("div", { class: "row wrap" }, coins.map(([k, label, title]) => h("label", { class: "coin", title },
          h("input", { type: "number", min: 0, class: "narrow", value: ch.coins[k], "data-bind": "coins." + k }), " " + label))),
        h("div", { class: "row wrap coin-change" },
          h("input", { type: "text", class: "amount", placeholder: "ex. 24 pa", value: App.ui.coinAmount || "", "data-ui": "coinAmount", "data-enter": "spendCoins",
            title: "Montant : « 24 pa », « 1 po 5 pa », ou un nombre seul dans la devise choisie", "aria-label": "Montant à dépenser ou recevoir" }),
          h("select", { "data-ui": "coinUnit", value: App.ui.coinUnit || "gp", "aria-label": "Devise par défaut" },
            coins.map(([k, label, title]) => h("option", { value: k }, label))),
          h("button", { class: "danger", "data-action": "spendCoins", title: "Retire le montant de la bourse, en faisant la monnaie si besoin" }, "Dépenser"),
          h("button", { class: "good", "data-action": "receiveCoins" }, "Recevoir")),
        h("p", { class: "muted small-text" }, load.coinCount + " pièces : " + E.kg(load.coins) + " (50 pièces = 0,5 kg)",
          bag ? h("label", { class: "inline" }, "\u00a0· ", h("input", { type: "checkbox", checked: !!ch.settings.coinsInBag, "data-bind": "settings.coinsInBag" }), " dans le sac sans fond") : null)),
      h("section", { class: "card" }, h("h3", null, "Équipement"),
        attunementLine(App),
        h("div", { class: "table-scroll" }, h("table", { class: "inventory" },
          h("thead", null, h("tr", null, heads.map((x) => h("th", null, x)))),
          h("tbody", null, rows))),
        h("div", { class: "row wrap" },
          searchBox(App, "inventory", "Chercher un objet…", "Chercher un objet du catalogue"),
          catalogSelect(App),
          h("button", { "data-action": "addFreeItem" }, "Ajouter un objet libre")),
        h("p", { class: "muted small-text" }, "Poids du catalogue d'après le Manuel des joueurs 2024, modifiables ligne par ligne. Survolez « contenu » pour le détail d'un paquetage.")));
  }
  const round = (n) => Math.round(Number(n) * 100) / 100;
  function catalogSelect(App) {
    const groups = CATALOG.map(([label, list]) => [label, sortFr(list()).filter((x) => matches("inventory", x))]).filter(([, l]) => l.length);
    const found = groups.reduce((n, [, l]) => n + l.length, 0);
    const first = !(App.ui.search.inventory || "").trim() ? "Ajouter depuis le catalogue…"
      : found ? found + " objet" + (found > 1 ? "s" : "") + " trouvé" + (found > 1 ? "s" : "") + "…" : "Aucun objet ne correspond";
    return h("select", { "data-change": "addCatalogItem", value: "" }, h("option", { value: "" }, first),
      groups.map(([label, l]) => h("optgroup", { label }, l.map((x) =>
        h("option", { value: x.id, title: x.name.en ? "EN : " + x.name.en : null }, x.name.fr + " (" + E.kg(x.weight || 0) + ")")))));
  }

  // Compteur d'objets harmonisés ; maximum automatique (3 + aptitudes) ou saisi par le joueur
  function attunementLine(App) {
    const a = App.sheet.attunement, over = a.count > a.max;
    const set = App.ch.settings.attunementMax;
    return h("p", { class: ["attunement", over && "over"], title: "Attunement" },
      h("b", null, "Objets harmonisés : "), h("span", { class: "attune-count" }, a.count + " / "),
      h("input", { type: "number", min: 0, class: "narrow", value: set != null && set !== "" ? set : "", placeholder: String(a.auto),
        title: "Maximum (laisser vide pour la valeur automatique : " + a.auto + ")", "data-change": "attunementMax", "aria-label": "Maximum d'objets harmonisés" }),
      over ? h("span", { class: "attune-warn" }, " ⚠ au-delà du maximum : désharmonisez un objet.")
        : h("span", { class: "muted" }, " · cochez « Harm. » sur les objets concernés."));
  }

  function loadCard(App) {
    const load = App.sheet.load;
    const pct = load.capacity ? Math.min(100, (100 * load.carried) / load.capacity) : 0;
    return h("section", { class: "card" }, h("h3", { title: "Carrying Capacity" }, "Charge"),
      h("div", { class: "hp-line" }, h("b", null, E.kg(load.carried)), h("span", { class: "muted" }, " / " + E.kg(load.capacity) + " max")),
      h("div", { class: "bar" }, h("div", { class: ["bar-fill", "load", pct >= 100 && "low"], style: "width:" + pct + "%" })),
      h("p", { class: "muted small-text" }, "Capacité : Force × 7,5 kg (Force × 15 lb), selon la taille. Pousser, tirer ou soulever : jusqu'à " + E.kg(load.push) + "."),
      load.bag ? h("p", { class: "small-text" }, h("b", null, "Sac sans fond : "), E.kg(load.bag.contents) + " / " + E.kg(load.bag.holds),
        h("span", { class: "muted" }, " · son contenu ne compte pas dans la charge, cochez « Sac » sur les objets rangés dedans.")) : null);
  }

  // --- Onglet Notes ---
  function notes(App) {
    const fields = [["session", "Notes de session"], ["personality", "Personnalité"], ["appearance", "Apparence"], ["backstory", "Histoire"], ["allies", "Alliés et organisations"]];
    return h("div", null, fields.map(([k, label]) => h("section", { class: "card" }, h("h3", null, label),
      h("textarea", { rows: k === "session" ? 8 : 4, value: App.ch.notes[k], "data-bind": "notes." + k }))));
  }

  // --- Fenêtre de repos court ---
  DND.views.shortRest = function (App) {
    const s = App.sheet;
    return [h("h2", null, "Repos court"),
      h("p", null, "PV : ", h("b", null, s.hp.current + " / " + s.hp.max), ". Lancez vos dés de vie (dé + modificateur de Constitution " + sg(s.abilities.con.mod) + " par dé), puis notez les dés dépensés et les PV récupérés ici."),
      hitDiceRow(s),
      h("div", { class: "row" },
        h("input", { type: "number", min: 0, class: "amount", placeholder: "PV", value: App.ui.amount, "data-ui": "amount", "data-enter": "heal", "aria-label": "PV récupérés" }),
        h("button", { class: "good", "data-action": "heal" }, "Ajouter les PV")),
      h("p", { class: "muted small-text" }, "Les ressources de repos court et les emplacements de Magie de pacte seront récupérés en terminant le repos."),
      h("div", { class: "row end" },
        h("button", { "data-action": "closeModal" }, "Annuler"),
        h("button", { class: "primary", "data-action": "shortRest" }, "Terminer le repos court"))];
  };

  // --- Actions du mode Jeu ---
  document.addEventListener("input", (ev) => {
    const k = ev.target.dataset && ev.target.dataset.uiForm;
    if (k) DND.app.ui.addSpell[k] = ev.target.value;
  });

  function coinAction(fn) {
    const ui = DND.app.ui;
    const parts = R.parseCoins(ui.coinAmount, ui.coinUnit || "gp");
    if (!parts) return DND.app.toast("Montant illisible : écrivez par exemple « 24 pa » ou « 1 po 5 pa ».");
    DND.app.update((ch) => {
      const msg = fn(ch, parts);
      if (!/^Fonds insuffisants/.test(msg || "")) ui.coinAmount = ""; // on garde la saisie en cas de refus
      return msg;
    });
  }

  Object.assign(DND.app.actions, {
    restoreKeeperOfSouls: (d) => DND.app.update((ch, s) => R.restoreKeeperOfSouls(ch, s, Number(d.level))),
    damage: () => { const v = DND.app.ui.amount; DND.app.ui.amount = ""; DND.app.update((ch, s) => R.damage(ch, s, v)); },
    heal: () => { const v = DND.app.ui.amount; DND.app.ui.amount = ""; DND.app.update((ch, s) => R.heal(ch, s, v)); },
    spendCoins: () => coinAction(R.spendCoins),
    receiveCoins: () => coinAction(R.receiveCoins),
    tempHp: () => { const v = DND.app.ui.amount; DND.app.ui.amount = ""; DND.app.update((ch, s) => R.setTempHp(ch, s, v)); },
    deathSave: (d) => DND.app.update((ch) => {
      const n = Number(d.n);
      ch.state.deathSaves[d.kind] = ch.state.deathSaves[d.kind] === n ? n - 1 : n;
      if (d.kind === "success" && ch.state.deathSaves.success >= 3) return "Trois réussites : vous êtes stabilisé (0 PV, inconscient).";
      if (d.kind === "failure" && ch.state.deathSaves.failure >= 3) return "Trois échecs : votre personnage meurt.";
    }),
    spendHitDie: (d) => DND.app.update((ch, s) => R.spendHitDie(ch, s, d.die)),
    hitDie: (d) => DND.app.update((ch, s) => R.adjustHitDie(ch, s, d.die, Number(d.delta))),
    concentrate: (d) => DND.app.update((ch) => { ch.state.concentration = ch.state.concentration === d.name ? "" : d.name; }),
    attunementMax: (d, value, el) => DND.app.update((ch) => { ch.settings.attunementMax = el.value === "" ? "" : Math.max(0, Math.round(Number(el.value))); }),
    itemWeight: (d, value, el) => DND.app.update((ch) => { ch.inventory[Number(d.index)].weight = el.value === "" ? "" : round(Number(el.value) * 2); }),
    shortRest: () => { DND.app.ui.modal = null; DND.app.update((ch, s) => R.shortRest(ch, s)); },
    longRest: () => { DND.app.ui.modal = null; DND.app.update((ch, s) => R.longRest(ch, s)); },
    resource: (d) => DND.app.update((ch, s) => R.useResource(ch, s, d.id, Number(d.delta))),
    stabilize: () => DND.app.update((ch) => R.stabilize(ch)),
    addSlot: (d) => DND.app.update((ch, s) => R.addSlot(ch, s, Number(d.level), Number(d.delta))),
    slot: (d) => DND.app.update((ch, s) => R.useSlot(ch, s, Number(d.level), Number(d.delta))),
    pactSlot: (d) => DND.app.update((ch, s) => R.usePactSlot(ch, s, Number(d.delta))),
    condition: (d) => DND.app.update((ch) => R.toggleCondition(ch, d.id)),
    addConditionDefense: () => DND.app.update((ch) => { ch.conditionDefenses.push({ condition: "charmed", kind: "advantage", label: "" }); }),
    removeConditionDefense: (d) => DND.app.update((ch) => { ch.conditionDefenses.splice(Number(d.index), 1); }),
    exhaustion: (d) => DND.app.update((ch) => { ch.state.exhaustion = Math.max(0, Math.min(6, ch.state.exhaustion + Number(d.delta))); }),
    concentrationSlot: (d, value) => DND.app.update((ch) => { ch.state.concentrationSlot = { name: ch.state.concentration, level: Number(value) }; }),
    endConcentration: () => DND.app.update((ch) => { ch.state.concentration = ""; }),
    inspiration: () => DND.app.update((ch) => { ch.state.heroicInspiration = !ch.state.heroicInspiration; }),
    removeSpell: (d) => DND.app.update((ch) => { ch.spells.splice(Number(d.index), 1); }),
    addCustomSpell: () => {
      const f = DND.app.ui.addSpell;
      if (!f.name) return DND.app.toast("Donnez un nom au sort.");
      DND.app.ui.addSpell = {};
      DND.app.update((ch) => { ch.spells.push({ custom: true, name: f.name, level: Number(f.level) || 0, notes: f.notes || "" }); });
    },
    addSpell: (d, value) => { if (value) { clearSearch(d.class); DND.app.update((ch) => { ch.spells.push({ id: value, source: d.class }); }); } },
    search: (d, value) => { DND.app.ui.search[d.key] = value; DND.app.refresh(false); },
    addCustomFeature: () => DND.app.update((ch) => { ch.customFeatures.push({ name: "", description: "" }); }),
    removeCustomFeature: (d) => DND.app.update((ch) => { ch.customFeatures.splice(Number(d.index), 1); }),
    addCatalogItem: (d, value, el) => { if (el) el.value = ""; if (value) clearSearch("inventory"); if (value) DND.app.update((ch) => { ch.inventory.push({ id: value, qty: 1, equipped: false }); }); },
    addFreeItem: () => DND.app.update((ch) => { ch.inventory.push({ name: "", qty: 1 }); }),
    removeItem: (d) => DND.app.update((ch) => { ch.inventory.splice(Number(d.index), 1); }),
    companionForm: (d, value) => DND.app.update((ch) => { ch.state.companions[d.id] = { form: value, damage: 0, custom: {} }; }),
    companionHp: (d) => DND.app.update((ch, s) => {
      const cp = s.companions.find((x) => x.id === d.id);
      const st = ch.state.companions[d.id];
      st.damage = Math.max(0, Math.min(cp.hpMax, (Number(st.damage) || 0) + Number(d.delta)));
    }),
  });
})();
