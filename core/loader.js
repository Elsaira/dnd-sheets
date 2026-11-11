// Charge les modules listés dans modules/manifest.js, puis démarre l'application.
// (Des balises <script> classiques : elles fonctionnent même en ouvrant le fichier en local.)
(function () {
  const files = DND.manifest || [];
  let loaded = 0;
  const failed = [];
  const done = () => {
    DND.app.start();
    if (failed.length) DND.app.toast("Modules introuvables : " + failed.join(", "));
  };
  if (!files.length) return done();
  for (const file of files) {
    const script = document.createElement("script");
    script.src = "modules/" + file;
    script.async = false; // garde l'ordre du manifeste
    script.onload = () => { if (++loaded === files.length) done(); };
    script.onerror = () => { failed.push(file); if (++loaded === files.length) done(); };
    document.head.appendChild(script);
  }
})();
