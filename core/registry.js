// Registre central : tous les modules (classes, espèces, historiques, dons)
// et toutes les données (compétences, armes, sorts...) s'enregistrent ici.
// Le noyau ne connaît aucune classe en dur : il lit seulement ce registre.
window.DND = window.DND || {};

DND.modules = { class: {}, species: {}, background: {}, feat: {} };
DND.lists = {};   // listes d'options pour les choix (ex. manifestations occultes)
DND.data = {      // données de règles communes, remplies par les fichiers de data/
  labels: {},     // id -> { fr, en } pour tout ce qui s'affiche
  skills: {}, abilities: [], conditions: {}, armor: {}, weapons: {}, spells: {},
  masteries: {}, tools: {}, languages: {}, gear: {},
};
DND.config = {
  // Lien vers la description complète d'un sort (texte non inclus dans la fiche).
  spellUrl: (spell) => "https://www.aidedd.org/spell/fr/" + DND.slug(spell.name.fr),
  // Fiche complète d'une créature (familier, compagnon) : form.aidedd force l'adresse si le nom diffère.
  monsterUrl: (form) => form.url || "https://www.aidedd.org/monster/fr/" + (form.aidedd || DND.slug(form.name.fr)),
};

DND.registerModule = function (module) {
  if (!DND.modules[module.kind]) throw new Error("Type de module inconnu : " + module.kind);
  DND.modules[module.kind][module.id] = module;
};

DND.registerList = function (id, options) {
  DND.lists[id] = (DND.lists[id] || []).concat(options);
};

DND.registerLabels = function (labels) {
  Object.assign(DND.data.labels, labels);
};

DND.registerSpells = function (spells) {
  for (const s of spells) DND.data.spells[s.id] = s;
};

// Effets « à niveau supérieur » par sort (data/spell-upcast.js), lus par le moteur
// quand le sort lui-même n'a pas de champ upcast.
DND.data.spellUpcast = {};
DND.registerSpellUpcast = function (table) {
  Object.assign(DND.data.spellUpcast, table);
};

// Nom français d'un identifiant (compétence, langue, outil, type de dégâts...).
DND.label = function (id) {
  const name = DND.labelObject(id);
  return name ? name.fr : id;
};
DND.labelEn = function (id) {
  const name = DND.labelObject(id);
  return name ? name.en : "";
};
DND.labelObject = function (id) {
  if (DND.data.labels[id]) return DND.data.labels[id];
  const [prefix, rest] = String(id).split(/\.(.+)/);
  if (rest) {
    if ((prefix === "skill" || prefix === "save" || prefix === "check") && DND.data.labels[rest]) return DND.data.labels[rest];
    if ((prefix === "weapon" || prefix === "mastery") && DND.data.weapons[rest]) return DND.data.weapons[rest].name;
    if (prefix === "armor" && DND.data.armor[rest]) return DND.data.armor[rest].name;
  }
  for (const kind in DND.modules) if (DND.modules[kind][id]) return DND.modules[kind][id].name;
  if (DND.data.spells[id]) return DND.data.spells[id].name;
  return null;
};

DND.slug = function (text) {
  return text.replace(/œ/g, "oe").replace(/Œ/g, "Oe").replace(/æ/g, "ae").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
};

// Valeur d'une table par niveau : { 1: 2, 5: 3 } donne 3 au niveau 7.
DND.byLevel = function (table, level) {
  if (typeof table !== "object" || table === null) return table;
  let value;
  for (const key of Object.keys(table).map(Number).sort((a, b) => a - b)) {
    if (key <= level) value = table[key];
  }
  return value;
};

// Raccourcis pour les fichiers de modules.
window.registerModule = DND.registerModule;
window.registerList = DND.registerList;
