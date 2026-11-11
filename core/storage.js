// Sauvegarde dans le navigateur (localStorage) et export/import en fichier JSON.
(function () {
  const S = {};
  DND.storage = S;
  const KEY = "dnd55.characters";
  const CURRENT = "dnd55.current";

  S.loadAll = function () {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch (e) {
      return {};
    }
  };

  S.save = function (ch) {
    const all = S.loadAll();
    ch.updatedAt = new Date().toISOString();
    all[ch.id] = ch;
    try {
      localStorage.setItem(KEY, JSON.stringify(all));
      localStorage.setItem(CURRENT, ch.id);
      return true;
    } catch (e) {
      return false; // stockage plein ou bloqué : l'export JSON reste possible
    }
  };

  S.remove = function (id) {
    const all = S.loadAll();
    delete all[id];
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) { /* ignoré */ }
  };

  S.currentId = function () {
    try { return localStorage.getItem(CURRENT); } catch (e) { return null; }
  };

  // Télécharge le personnage en fichier .json (fonctionne aussi en fichier local).
  S.exportFile = function (ch) {
    const blob = new Blob([JSON.stringify(ch, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = DND.slug(ch.name || "personnage") + ".json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };

  // Lit un fichier .json choisi par l'utilisateur et renvoie le personnage.
  S.importFile = function (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const ch = JSON.parse(reader.result);
          if (!ch || typeof ch !== "object" || !ch.abilities) throw new Error("Ce fichier n'est pas une fiche de personnage.");
          if (!ch.id) ch.id = Math.random().toString(36).slice(2, 10);
          resolve(DND.engine.normalize(ch));
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };
})();
