// Outils partagés par les modules de dons (chargé avant les dons dans le manifeste).
// Ce n'est pas un module : il ajoute seulement DND.feat, utilisé par les fichiers de dons.
DND.feat = {
  // +1 à une caractéristique au choix (maximum 20, ou 30 pour les faveurs épiques).
  // abilities : liste d'identifiants ("str", "dex"…) ou "abilities" pour toutes.
  ability(abilities, max) {
    max = max || 20;
    if (Array.isArray(abilities) && abilities.length === 1) return { type: "ability", ability: abilities[0], value: 1, max };
    const names = Array.isArray(abilities) ? abilities.map((a) => DND.label(a)).join(" ou ") : "une caractéristique";
    return { type: "choice", id: "ability", label: "+1 en " + names, from: abilities,
      grant: { type: "ability", ability: "{value}", value: 1, max } };
  },

  // Fabrique un prérequis : renvoie true si tout est rempli, sinon le texte du prérequis.
  // opts : { level, scores: ["str", "dex"] (au moins une à 13), min, spellcasting, armor: "light" | "medium" | "heavy" | "shield" }
  requires(opts, text) {
    return Object.assign((c) => {
      const ok = (!opts.level || c.level >= opts.level) &&
        (!opts.scores || opts.scores.some((a) => c.score[a] >= (opts.min || 13))) &&
        (!opts.spellcasting || DND.feat.isCaster(c)) &&
        (!opts.armor || DND.feat.hasArmorTraining(c, opts.armor));
      return ok || text;
    }, { level: opts.level });
  },

  // Le personnage a-t-il la capacité Sorts ou Magie de pacte (par une classe ou une sous-classe) ?
  isCaster(c) {
    return (c.character.classes || []).some((entry) => {
      const m = DND.modules.class[entry.id];
      if (!m) return false;
      if (m.spellcasting) return true;
      const sub = DND.engine.subclassesOf(m).find((s) => s.id === entry.subclass);
      return !!(sub && sub.spellcasting && (Number(entry.level) || 0) >= (m.subclassLevel || 3));
    });
  },

  // Formation aux armures : maîtrises de classe (classe de départ, puis multiclassage)
  // ou don qui l'accorde. Les autres sources (sous-classe, objet) ne sont pas vues.
  hasArmorTraining(c, category) {
    const ch = c.character;
    const fromClass = (ch.classes || []).some((entry, i) => {
      const m = DND.modules.class[entry.id];
      const profs = m && (i === 0 ? m.proficiencies : m.multiclassProficiencies);
      return !!(profs && (profs.armor || []).includes(category));
    });
    const feats = { light: "lightly-armored", shield: "lightly-armored", medium: "moderately-armored", heavy: "heavily-armored" };
    return fromClass || JSON.stringify(ch).includes('"' + feats[category] + '"');
  },

  // Armure portée (équipée) : catégorie "light", "medium", "heavy", ou "any" pour n'importe laquelle sauf bouclier.
  wearing(c, category) {
    return (c.character.inventory || []).some((it) => {
      const a = it.equipped && DND.data.armor[it.id];
      return !!a && a.category !== "shield" && (category === "any" || a.category === category);
    });
  },

  // Sorts du catalogue d'un niveau et d'écoles donnés, comme options d'un choix.
  spellOptions(level, schools) {
    return Object.values(DND.data.spells).filter((s) => s.level === level && schools.includes(s.school))
      .sort((a, b) => a.name.fr.localeCompare(b.name.fr)).map((s) => ({ id: s.id, name: s.name }));
  },

  // Choix d'une compétence : maîtrise si elle n'est pas maîtrisée, sinon expertise.
  profOrExpertise(skills) {
    const options = [];
    for (const id of skills) {
      options.push({ id: "skill." + id, name: { fr: DND.data.skills[id].fr + " : maîtrise", en: DND.data.skills[id].en },
        effects: [{ type: "proficiency", target: "skill." + id }] });
      options.push({ id: "expertise." + id, name: { fr: DND.data.skills[id].fr + " : expertise (déjà maîtrisée)", en: DND.data.skills[id].en },
        effects: [{ type: "proficiency", target: "skill." + id, expertise: true }] });
    }
    return { type: "choice", id: "skill", label: "Compétence (maîtrise, ou expertise si déjà maîtrisée)", from: options };
  },
};
