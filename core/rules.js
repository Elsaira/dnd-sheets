// Règles de jeu qui modifient l'état du personnage pendant la partie :
// dégâts, soins, repos, dépense de ressources. Chaque fonction renvoie un
// message à afficher (ou rien).
(function () {
  const R = {};
  DND.rules = R;

  R.rollDie = (sides) => 1 + Math.floor(Math.random() * sides);

  R.damage = function (ch, sheet, amount) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));
    if (!amount) return;
    const st = ch.state;
    const messages = [];
    const before = sheet.hp.current;
    const wasDown = before <= 0;
    let rest = amount;
    if (st.tempHp > 0) {
      const absorbed = Math.min(st.tempHp, rest);
      st.tempHp -= absorbed;
      rest -= absorbed;
    }
    const now = Math.max(0, before - rest);
    st.damage = sheet.hp.max - now;
    messages.push(amount + " dégâts subis.");
    if (now === 0 && rest - before >= sheet.hp.max) {
      st.deathSaves = { success: 0, failure: 3 };
      messages.push("Dégâts massifs : les dégâts restants égalent ou dépassent vos PV max, mort instantanée.");
    } else if (wasDown && rest > 0) {
      st.deathSaves = { success: 0, failure: Math.min(3, st.deathSaves.failure + 1) };
      messages.push(st.deathSaves.failure >= 3 ? "Dégâts à 0 PV : troisième échec, votre personnage meurt." : "Dégâts à 0 PV : un échec au jet contre la mort (deux si coup critique).");
    } else if (now === 0) {
      messages.push("À 0 PV : vous tombez Inconscient. Jets contre la mort au début de vos tours.");
      if (!st.conditions.includes("unconscious")) st.conditions.push("unconscious");
    }
    if (st.concentration && now === 0) {
      messages.push("Concentration (" + st.concentration + ") perdue.");
      st.concentration = "";
    } else if (st.concentration) {
      messages.push("Concentration (" + st.concentration + ") : JS de Constitution DD " + Math.min(30, Math.max(10, Math.floor(amount / 2))) + ".");
    }
    return messages.join(" ");
  };

  R.heal = function (ch, sheet, amount) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));
    if (!amount) return;
    const st = ch.state;
    if (sheet.hp.current <= 0) {
      st.deathSaves = { success: 0, failure: 0 };
      st.conditions = st.conditions.filter((c) => c !== "unconscious");
    }
    st.damage = Math.max(0, sheet.hp.max - Math.min(sheet.hp.max, sheet.hp.current + amount));
    return amount + " PV récupérés.";
  };

  R.setTempHp = function (ch, sheet, amount) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));
    // Les PV temporaires ne se cumulent pas : on garde la plus haute valeur.
    if (amount > ch.state.tempHp) {
      ch.state.tempHp = amount;
      return amount + " PV temporaires.";
    }
    return "Vous avez déjà " + ch.state.tempHp + " PV temporaires (ils ne se cumulent pas).";
  };

  R.spendHitDie = function (ch, sheet, die) {
    const hd = sheet.hitDice.find((h) => h.die === die);
    if (!hd || hd.spent >= hd.total) return "Plus de dé de vie " + die + " disponible.";
    ch.state.hitDiceSpent[die] = (ch.state.hitDiceSpent[die] || 0) + 1;
    const roll = R.rollDie(Number(die.slice(1)));
    const con = sheet.abilities.con.mod;
    const gained = Math.max(0, roll + con);
    ch.state.damage = Math.max(0, (ch.state.damage || 0) - gained);
    return "Dé de vie " + die + " : " + roll + " " + DND.engine.signed(con) + " = " + gained + " PV récupérés.";
  };

  // Dés de vie : simple compteur (les jets se font ailleurs, par ex. avec un bot Discord).
  // delta +1 = dépenser un dé, −1 = en récupérer un.
  R.adjustHitDie = function (ch, sheet, die, delta) {
    const hd = sheet.hitDice.find((h) => h.die === die);
    if (!hd) return;
    ch.state.hitDiceSpent[die] = Math.max(0, Math.min(hd.total, hd.spent + delta));
  };

  R.shortRest = function (ch, sheet) {
    const st = ch.state;
    for (const r of sheet.resources) {
      if (r.recharge === "short") st.resources[r.id] = 0;
      else if (r.shortRegain) st.resources[r.id] = Math.max(0, (st.resources[r.id] || 0) - r.shortRegain);
    }
    st.pactSpent = 0;
    for (const hook of sheet.onRest) if (hook.rest === "short") applyHook(ch, hook);
    return "Repos court terminé : ressources de repos court récupérées.";
  };

  R.longRest = function (ch, sheet) {
    const st = ch.state;
    st.damage = 0;
    st.tempHp = 0;
    st.hitDiceSpent = {};
    st.slotsSpent = {};
    st.slotsExtra = {};
    st.pactSpent = 0;
    st.resources = {};
    st.deathSaves = { success: 0, failure: 0 };
    st.conditions = st.conditions.filter((c) => c !== "unconscious");
    if (st.exhaustion > 0) st.exhaustion -= 1;
    for (const hook of sheet.onRest) if (hook.rest === "long" || hook.rest === "short") applyHook(ch, hook);
    return "Repos long terminé : PV, dés de vie, emplacements et ressources récupérés" +
      (st.exhaustion ? ", épuisement réduit à " + st.exhaustion : "") + ".";
  };

  function applyHook(ch, hook) {
    if (hook.set === "heroicInspiration") ch.state.heroicInspiration = true;
  }

  // Dépenser (+1) ou récupérer (−1) une utilisation
  R.useResource = function (ch, sheet, id, delta) {
    const r = sheet.resources.find((x) => x.id === id);
    if (!r) return;
    if (id === "cleric.keeperOfSouls" && delta > 0 && ch.state.conditions.includes("incapacitated"))
      return "Vous ne pouvez pas utiliser Gardien des âmes en étant Neutralisé.";
    if (id === "cleric.keeperOfSouls" && delta < 0)
      return "Récupérez Gardien des âmes après un repos ou en dépensant un emplacement de niveau 6 ou supérieur.";
    ch.state.resources[id] = Math.min(r.max, Math.max(0, (ch.state.resources[id] || 0) + delta));
  };

  R.restoreKeeperOfSouls = function (ch, sheet, level) {
    const id = "cleric.keeperOfSouls";
    const resource = sheet.resources.find((x) => x.id === id);
    const slot = sheet.spellSlots.find((x) => x.level === Number(level));
    const spent = ch.state.resources[id] || 0;
    if (!resource) return "Gardien des âmes n'est pas disponible.";
    if (ch.state.conditions.includes("incapacitated")) return "Vous ne pouvez pas utiliser Gardien des âmes en étant Neutralisé.";
    if (spent < 1) return "Aucune utilisation de Gardien des âmes à récupérer.";
    if (!slot || slot.level < 6 || (ch.state.slotsSpent[slot.level] || 0) >= slot.max)
      return "Un emplacement de sort disponible de niveau 6 ou supérieur est requis.";
    ch.state.slotsSpent[slot.level] = (ch.state.slotsSpent[slot.level] || 0) + 1;
    ch.state.resources[id] = spent - 1;
    return "Gardien des âmes récupéré : emplacement de niveau " + slot.level + " dépensé.";
  };

  R.useSlot = function (ch, sheet, level, delta) {
    const slot = sheet.spellSlots.find((s) => s.level === level);
    if (!slot) return;
    ch.state.slotsSpent[level] = Math.min(slot.max, Math.max(0, (ch.state.slotsSpent[level] || 0) + delta));
  };

  R.addSlot = function (ch, sheet, level, delta) {
    if (level < 1 || level > sheet.extraSlots) return;
    const x = ch.state.slotsExtra;
    x[level] = Math.max(0, (x[level] || 0) + delta);
  };

  R.stabilize = function (ch) {
    ch.state.deathSaves = { success: 3, failure: 0 };
    return "Stabilisé : 0 PV, inconscient, plus de jets contre la mort.";
  };

  R.usePactSlot = function (ch, sheet, delta) {
    if (!sheet.pact) return;
    ch.state.pactSpent = Math.min(sheet.pact.count, Math.max(0, (ch.state.pactSpent || 0) + delta));
  };

  R.toggleCondition = function (ch, id) {
    const list = ch.state.conditions;
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
  };

  // Bourse : valeurs en pièces de cuivre (change SRD : 1 pp = 10 po, 1 po = 2 pe = 10 pa = 100 pc)
  R.COINS = [["pp", "pp", 1000], ["gp", "po", 100], ["ep", "pe", 50], ["sp", "pa", 10], ["cp", "pc", 1]];
  const coinValue = (k) => (R.COINS.find((c) => c[0] === k) || [])[2];
  const coinLabel = (k) => (R.COINS.find((c) => c[0] === k) || [])[1];
  // Lit « 24 pa », « 1 po 5 pa » ou « 24 » (devise par défaut) : liste de [devise, quantité], ou null si illisible
  R.parseCoins = function (text, defaultUnit) {
    const src = String(text || "").toLowerCase().replace(/,/g, ".").trim();
    if (!src) return null;
    const out = [];
    const re = /(\d+)\s*(pp|po|pe|pa|pc)?/g;
    let m, rest = src;
    while ((m = re.exec(src))) {
      const unit = m[2] ? R.COINS.find((c) => c[1] === m[2])[0] : defaultUnit;
      if (Number(m[1]) > 0) out.push([unit, Number(m[1])]);
      rest = rest.replace(m[0], "");
    }
    return rest.replace(/\s|\+|\bet\b/g, "") || !out.length ? null : out;
  };
  const describe = (delta) => R.COINS.filter(([k]) => delta[k]).map(([k, l]) => (delta[k] > 0 ? "+" : "−") + Math.abs(delta[k]) + " " + l).join(", ");
  // Dépense : d'abord les pièces de la devise demandée, puis on casse les pièces plus grosses
  // (la plus petite d'abord, monnaie rendue dans la devise dépensée), et en dernier recours les plus petites.
  R.spendCoins = function (ch, parts) {
    const coins = ch.coins, before = Object.assign({}, coins);
    const total = R.COINS.reduce((n, [k, , v]) => n + (Number(coins[k]) || 0) * v, 0);
    const cost = parts.reduce((n, [k, q]) => n + q * coinValue(k), 0);
    const asked = parts.map(([k, q]) => q + " " + coinLabel(k)).join(" ");
    if (!cost) return;
    if (cost > total) return "Fonds insuffisants pour payer " + asked + " : la bourse contient l'équivalent de " + R.formatCopper(total) + ".";
    R.COINS.forEach(([k]) => { coins[k] = Number(coins[k]) || 0; });
    // les plus grosses devises d'abord, pour que la monnaie rendue serve aux suivantes
    parts.slice().sort((a, b) => coinValue(b[0]) - coinValue(a[0])).forEach(([unit, qty]) => {
      const v = coinValue(unit);
      let rest = qty * v;
      const same = Math.min(coins[unit], qty);
      coins[unit] -= same; rest -= same * v;
      const bigger = R.COINS.filter((c) => c[2] > v).reverse();
      const smaller = R.COINS.filter((c) => c[2] < v);
      if (rest > 0 && bigger.reduce((n, [k, , w]) => n + coins[k] * w, 0) >= rest) {
        for (const [k, , w] of bigger) {
          const n = Math.min(coins[k], Math.ceil(rest / w));
          coins[k] -= n; rest -= n * w;
          if (rest <= 0) break;
        }
        coins[unit] += -rest / v; // monnaie rendue (toujours un multiple de la devise dépensée)
        rest = 0;
      } else if (rest > 0) {
        for (const [k, , w] of bigger.concat(smaller)) {
          const n = Math.min(coins[k], Math.floor(rest / w));
          coins[k] -= n; rest -= n * w;
        }
      }
    });
    const delta = {};
    R.COINS.forEach(([k]) => { delta[k] = coins[k] - (Number(before[k]) || 0); });
    return asked + " dépensé" + (parts.length > 1 || parts[0][1] > 1 ? "s" : "") + ". Bourse : " + describe(delta) + ".";
  };
  R.receiveCoins = function (ch, parts) {
    const delta = {};
    parts.forEach(([k, q]) => { ch.coins[k] = (Number(ch.coins[k]) || 0) + q; delta[k] = (delta[k] || 0) + q; });
    return parts.length ? "Bourse : " + describe(delta) + "." : undefined;
  };
  // 1234 pc -> « 12 po 3 pa 4 pc » (sans électrum)
  R.formatCopper = function (cp) {
    const out = [];
    [["po", 100], ["pa", 10], ["pc", 1]].forEach(([l, v]) => {
      const n = Math.floor(cp / v);
      if (n) { out.push(n + " " + l); cp -= n * v; }
    });
    return out.join(" ") || "0 pc";
  };
})();
