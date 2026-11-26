// Application : personnage courant, gestion des événements, en-tête et fenêtres.
(function () {
  const { h, morph } = DND.dom;
  const E = DND.engine;

  const App = {
    ch: null,
    sheet: null,
    ui: { mode: "play", tab: "combat", modal: null, toast: "", amount: "", addSpell: {}, addItem: "", search: {}, openActions: {} },
  };
  DND.app = App;

  // --- Cycle de mise à jour : modifier -> recalculer -> sauvegarder -> afficher ---
  App.refresh = function (save) {
    App.sheet = E.compute(App.ch);
    if (save && !DND.storage.save(App.ch)) App.toast("Sauvegarde locale impossible : pensez à exporter la fiche.");
    App.render();
  };
  App.update = function (fn) {
    const message = fn(App.ch, App.sheet);
    if (typeof message === "string") App.toast(message, true);
    App.refresh(true);
  };
  App.setUi = function (patch) {
    Object.assign(App.ui, patch);
    App.render();
  };
  let toastTimer;
  App.toast = function (text, silent, ms) {
    App.ui.toast = text;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => App.setUi({ toast: "" }), ms || 6000);
    if (!silent) App.render();
  };

  App.render = function () {
    const root = document.getElementById("app");
    const view = h("div", { id: "app" },
      header(),
      App.sheet.errors.length ? h("div", { class: "banner error" }, App.sheet.errors.join(" · ")) : null,
      App.ui.mode === "build" ? DND.views.build(App) : DND.views.play(App),
      App.ui.modal ? modal() : null,
      App.ui.toast ? h("div", { class: "toast", "data-action": "closeToast" }, App.ui.toast) : null);
    morph(root, view);
    applyLook();
  };

  // --- Apparence : thème, effet papier, couleur d'accent ---
  const pref = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } };
  function applyLook() {
    const root = document.documentElement;
    if (App.sheet.accent) root.style.setProperty("--accent-base", App.sheet.accent);
    else root.style.removeProperty("--accent-base");
    root.classList.add("paper");
    if (pref("theme")) root.dataset.theme = pref("theme"); else delete root.dataset.theme;
  }

  // --- Accès aux données par chemin : "classes.0.level" ---
  App.getPath = function (obj, path) {
    const parts = Array.isArray(path) ? path : String(path).split(".");
    return parts.reduce((o, k) => (o == null ? o : o[k]), obj);
  };
  App.setPath = function (obj, path, value) {
    const parts = Array.isArray(path) ? path : String(path).split(".");
    const last = parts.pop();
    const target = App.getPath(obj, parts);
    target[last] = value;
  };

  // --- Événements : un seul écouteur par type, actions nommées via data-action ---
  App.actions = {};
  function readValue(el) {
    if (el.type === "checkbox") return el.checked;
    if (el.type === "number") return el.value === "" ? 0 : Number(el.value);
    return el.value;
  }
  function onClick(ev) {
    const el = ev.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT" || el.tagName === "INPUT" || el.tagName === "TEXTAREA") return;
    const fn = App.actions[el.dataset.action];
    if (fn) { ev.preventDefault(); fn(el.dataset, el, ev); }
  }
  function onChange(ev) {
    const el = ev.target;
    if (el.dataset.bind) {
      App.update((ch) => App.setPath(ch, el.dataset.bind, readValue(el)));
    } else if (el.dataset.change && App.actions[el.dataset.change]) {
      App.actions[el.dataset.change](el.dataset, readValue(el), el);
    } else if (el.dataset.ui) {
      App.setUi({ [el.dataset.ui]: el.value });
    }
  }
  function onInput(ev) {
    const el = ev.target;
    if (el.dataset.ui) App.ui[el.dataset.ui] = el.value; // pas de réaffichage pendant la frappe
    else if (el.dataset.input && App.actions[el.dataset.input]) App.actions[el.dataset.input](el.dataset, el.value, el); // filtre en direct
  }
  function onKey(ev) {
    if (ev.key === "Escape" && App.ui.modal) App.setUi({ modal: null });
    if (ev.key === "Enter" && ev.target.dataset && ev.target.dataset.enter) {
      App.ui[ev.target.dataset.ui] = ev.target.value;
      const fn = App.actions[ev.target.dataset.enter];
      if (fn) fn(ev.target.dataset, ev.target);
    }
  }

  // --- En-tête ---
  function header() {
    const ch = App.ch, s = App.sheet;
    const classes = ch.classes.map((c) => {
      const m = DND.modules.class[c.id];
      return (m ? m.name.fr : c.id) + " " + c.level;
    }).join(" / ");
    const species = DND.modules.species[ch.species.id];
    const bg = DND.modules.background[ch.background.id];
    const summary = [classes || "Aucune classe", species && species.name.fr, bg && bg.name.fr].filter(Boolean).join(" · ");
    return h("header", { class: "topbar" },
      h("div", { class: "identity" },
        h("h1", null, ch.name || "Sans nom"),
        h("div", { class: "muted" }, summary, s.level ? " · niveau " + s.level : "")),
      h("nav", { class: "toolbar" },
        h("button", { class: ["tab", App.ui.mode === "play" && "active"], "data-action": "mode", "data-mode": "play" }, "Jeu"),
        h("button", { class: ["tab", App.ui.mode === "build" && "active"], "data-action": "mode", "data-mode": "build" },
          "Création", s.pendingChoices ? h("span", { class: "badge", title: "Choix à faire" }, s.pendingChoices) : null),
        h("button", { "data-action": "openModal", "data-modal": "characters" }, "Personnages"),
        h("button", { "data-action": "export", title: "Télécharger la fiche en fichier .json" }, "Exporter"),
        h("button", { "data-action": "importClick", title: "Charger une fiche .json" }, "Importer"),
        h("button", { "data-action": "openModal", "data-modal": "options", title: "Apparence de la fiche" }, "Options")));
  }

  // --- Fenêtres ---
  function modal() {
    const m = App.ui.modal;
    let body;
    if (m === "characters") body = charactersModal();
    else if (m === "longRest") body = confirmModal("Repos long", "Récupérer tous les PV, dés de vie, emplacements de sorts et ressources, et réduire l'épuisement de 1 ?", "longRest");
    else if (m === "shortRest") body = DND.views.shortRest(App);
    else if (m === "options") body = optionsModal();
    else if (m && m.type === "confirm") body = confirmModal(m.title, m.text, m.action, m.data);
    return h("div", { class: "modal-backdrop", "data-action": "closeModalBackdrop" },
      h("div", { class: "modal", role: "dialog" }, body));
  }

  function confirmModal(title, text, action, data) {
    return [h("h2", null, title), h("p", null, text),
      h("div", { class: "row end" },
        h("button", { "data-action": "closeModal" }, "Annuler"),
        h("button", { class: "primary", "data-action": action, "data-confirmed": "1", ...(data || {}) }, "Confirmer"))];
  }

  function optionsModal() {
    const firstClass = App.ch.classes[0] && DND.modules.class[App.ch.classes[0].id];
    const classColor = (firstClass && firstClass.color) || "#8a2a2a";
    return [h("h2", null, "Options"),
      h("div", { class: "option-row" }, h("span", null, "Thème"),
        h("select", { "data-change": "setTheme", value: pref("theme") || "" },
          h("option", { value: "" }, "Kraft"), h("option", { value: "grey" }, "Gris sombre"))),
      h("div", { class: "option-row" }, h("span", null, "Couleur d'accent"),
        h("select", { "data-change": "setAccentPreset", value: accentChoice(App.ch.settings.accent) },
          h("option", { value: "" }, firstClass ? "Ma classe (" + firstClass.name.fr + ")" : "Par défaut"),
          DND.data.accentPresets.map((p) => h("option", { value: p.id }, p.fr)),
          h("option", { value: "custom" }, "Personnalisée")),
        h("input", { type: "color", value: App.ch.settings.accent || classColor, "data-change": "setAccent", "aria-label": "Couleur personnalisée" })),
      h("p", { class: "muted small-text" }, "Le thème est enregistré dans ce navigateur, la couleur avec ce personnage."),
      h("div", { class: "row end" }, h("button", { class: "primary", "data-action": "closeModal" }, "Fermer"))];
  }

  function accentChoice(color) {
    if (!color) return "";
    const p = DND.data.accentPresets.find((x) => x.color.toLowerCase() === color.toLowerCase());
    return p ? p.id : "custom";
  }

  function charactersModal() {
    const all = Object.values(DND.storage.loadAll()).sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
    return [h("h2", null, "Personnages"),
      h("p", { class: "muted" }, "Les fiches sont enregistrées dans ce navigateur. Exportez-les pour les sauvegarder ailleurs ou changer d'appareil."),
      h("ul", { class: "char-list" }, all.map((c) => h("li", { class: c.id === App.ch.id ? "current" : "" },
        h("button", { class: "link", "data-action": "openCharacter", "data-id": c.id }, c.name || "Sans nom"),
        h("span", { class: "muted" }, c.classes && c.classes.map((x) => (DND.modules.class[x.id] ? DND.modules.class[x.id].name.fr : x.id) + " " + x.level).join(" / ")),
        h("button", { class: "danger small", "data-action": "askDelete", "data-id": c.id, title: "Supprimer" }, "Supprimer")))),
      h("div", { class: "row end" },
        h("button", { "data-action": "closeModal" }, "Fermer"),
        h("button", { class: "primary", "data-action": "newCharacter" }, "Nouveau personnage"))];
  }

  // --- Actions générales ---
  Object.assign(App.actions, {
    mode: (d) => App.setUi({ mode: d.mode }),
    tab: (d) => App.setUi({ tab: d.tab }),
    openModal: (d) => App.setUi({ modal: d.modal }),
    closeModal: () => App.setUi({ modal: null }),
    closeModalBackdrop: (d, el, ev) => { if (ev.target === el) App.setUi({ modal: null }); },
    closeToast: () => App.setUi({ toast: "" }),
    roll: (d, el) => {
      const fallback = () => { const t = document.createElement("textarea"); t.value = d.roll; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); };
      try { navigator.clipboard.writeText(d.roll).catch(fallback); } catch (e) { fallback(); }
      App.toast("Copié : " + d.roll + " (tapez /roll puis collez)", false, 3000);
      el.classList.add("copied");
      setTimeout(() => el.classList.remove("copied"), 800);
    },
    setAccentPreset: (d, value) => {
      if (value === "custom") return;
      const p = DND.data.accentPresets.find((x) => x.id === value);
      App.update((ch) => { ch.settings.accent = p ? p.color : ""; });
    },
    setTheme: (d, value) => { pref("theme", value || null); App.setUi({}); },
    setAccent: (d, value) => App.update((ch) => { ch.settings.accent = value; }),
    resetAccent: () => App.update((ch) => { ch.settings.accent = ""; }),
    export: () => DND.storage.exportFile(App.ch),
    importClick: () => document.getElementById("import-file").click(),
    newCharacter: () => {
      App.ch = E.newCharacter();
      App.ui.modal = null;
      App.ui.mode = "build";
      App.refresh(true);
    },
    openCharacter: (d) => {
      const c = DND.storage.loadAll()[d.id];
      if (!c) return;
      App.ch = E.normalize(c);
      App.ui.modal = null;
      App.refresh(true);
    },
    askDelete: (d) => {
      const c = DND.storage.loadAll()[d.id];
      App.setUi({ modal: { type: "confirm", title: "Supprimer " + (c && c.name || "ce personnage") + " ?",
        text: "La fiche sera effacée de ce navigateur. Pensez à l'exporter avant si vous voulez la garder.",
        action: "deleteCharacter", data: { "data-id": d.id } } });
    },
    deleteCharacter: (d) => {
      DND.storage.remove(d.id);
      if (App.ch.id === d.id) {
        const rest = Object.values(DND.storage.loadAll());
        App.ch = rest.length ? E.normalize(rest[0]) : E.newCharacter();
      }
      App.ui.modal = "characters";
      App.refresh(true);
    },
  });

  async function onImport(ev) {
    const file = ev.target.files[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const ch = await DND.storage.importFile(file);
      const existing = DND.storage.loadAll()[ch.id];
      if (existing && existing.name !== ch.name) ch.id = Math.random().toString(36).slice(2, 10);
      App.ch = ch;
      App.ui.modal = null;
      App.refresh(true);
      App.toast("Fiche importée : " + (ch.name || "sans nom") + ".");
    } catch (e) {
      App.toast("Import impossible : " + e.message);
    }
  }

  App.start = function () {
    const all = DND.storage.loadAll();
    const id = DND.storage.currentId();
    App.ch = all[id] ? E.normalize(all[id]) : Object.values(all)[0] ? E.normalize(Object.values(all)[0]) : E.newCharacter();
    if (!Object.keys(all).length) App.ui.mode = "build";
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    document.addEventListener("keydown", onKey);
    document.getElementById("import-file").addEventListener("change", onImport);
    try {
      App.refresh(false);
    } catch (e) {
      // Une fiche qui ne s'affiche pas ne doit pas bloquer l'application sur « Chargement… »
      console.error(e);
      App.ui.mode = "build";
      try { App.refresh(false); } catch (e2) { console.error(e2); }
      App.toast("Erreur d'affichage de la fiche : " + e.message);
    }
  };
})();
