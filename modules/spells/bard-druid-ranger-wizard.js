// Sorts manquants pour le Barde, le Druide, le Rôdeur et le Magicien — Player's Handbook 2024.
// Relevés sur AideDD le 2026-10-18 (fiches individuelles : classes, temps, portée, composantes, durée, JS, dégâts).
// Un sort déjà au catalogue n'est pas réenregistré. Chargé avant les classes dans le manifeste.
(function () {
  const add = (spells) => DND.registerSpells(spells.filter((s) => !DND.data.spells[s.id]));
  add([
    // Tours de magie
    S("vicious-mockery", "Moquerie cruelle", "Vicious Mockery", 0, "enchantment", "action", 60, "V", "Instantanée",
      ["bard"], { save: "wis", damage: { dice: "1d6", type: "psychic" }, scaling: "cantrip" }),
    S("starry-wisp", "Poussière d'étoile", "Starry Wisp", 0, "evocation", "action", 60, "V, S", "Instantanée",
      ["bard", "druid"], { attack: "ranged", damage: { dice: "1d8", type: "radiant" }, scaling: "cantrip" }),
    S("shillelagh", "Crosse des druides", "Shillelagh", 0, "transmutation", "bonus", "self", "V, S, M", "1 minute",
      ["druid"], { material: "du gui" }),
    // Niveau 1
    S("animal-friendship", "Amitié avec les animaux", "Animal Friendship", 1, "enchantment", "action", 30, "V, S, M", "24 heures",
      ["bard", "druid", "ranger"], { save: "wis", material: "un peu de nourriture" }),
    S("goodberry", "Baies nourricières", "Goodberry", 1, "conjuration", "action", "self", "V, S, M", "24 heures",
      ["druid", "ranger"], { heal: { text: "1 PV par baie (10 baies)" }, material: "une branche de gui" }),
    S("entangle", "Enchevêtrement", "Entangle", 1, "conjuration", "action", 90, "V, S", "1 minute",
      ["druid", "ranger"], { concentration: true, save: "str" }),
    S("hail-of-thorns", "Grêle d'épines", "Hail of Thorns", 1, "conjuration", "bonus", "self", "V", "Instantanée",
      ["ranger"], { save: "dex", damage: { dice: "1d10", type: "piercing" } }),
    // Niveau 2
    S("summon-beast", "Convocation de bête", "Summon Beast", 2, "conjuration", "action", 90, "V, S, M", "1 heure",
      ["druid", "ranger"], { concentration: true, material: "une plume, une touffe de fourrure et une queue de poisson dans un gland doré d'une valeur minimale de 200 po" }),
    S("cordon-of-arrows", "Cordon de flèches", "Cordon of Arrows", 2, "transmutation", "action", "touch", "V, S, M", "8 heures",
      ["ranger"], { save: "dex", damage: { dice: "2d4", type: "piercing" }, material: "une tresse décorative" }),
    S("spike-growth", "Croissance d'épines", "Spike Growth", 2, "transmutation", "action", 150, "V, S, M", "10 minutes",
      ["druid", "ranger"], { concentration: true, damage: { dice: "2d4", type: "piercing" }, material: "sept épines" }),
    S("locate-animals-or-plants", "Localisation d'animaux ou de plantes", "Locate Animals or Plants", 2, "divination", "action", "self", "V, S, M", "Instantanée",
      ["bard", "druid", "ranger"], { ritual: true, material: "une touffe de poils de limier" }),
    S("animal-messenger", "Messager animal", "Animal Messenger", 2, "enchantment", "action", 30, "V, S, M", "24 heures",
      ["bard", "druid", "ranger"], { ritual: true, material: "un peu de nourriture" }),
    S("barkskin", "Peau d'écorce", "Barkskin", 2, "transmutation", "bonus", "touch", "V, S, M", "1 heure",
      ["druid", "ranger"], { material: "une poignée d'écorce" }),
    S("beast-sense", "Perception bestiale", "Beast Sense", 2, "divination", "action", "touch", "S", "1 heure",
      ["druid", "ranger"], { concentration: true, ritual: true }),
    // Niveau 3
    S("speak-with-plants", "Communication avec les plantes", "Speak with Plants", 3, "transmutation", "action", "self", "V, S", "10 minutes",
      ["bard", "druid", "ranger"]),
    S("lightning-arrow", "Flèche de foudre", "Lightning Arrow", 3, "transmutation", "bonus", "self", "V, S", "Instantanée",
      ["ranger"], { save: "dex", damage: { dice: "4d8", type: "lightning" } }),
    S("conjure-animals", "Invocation d'animaux", "Conjure Animals", 3, "conjuration", "action", 60, "V, S", "10 minutes",
      ["druid", "ranger"], { concentration: true, save: "dex", damage: { dice: "3d10", type: "slashing" } }),
    S("phantom-steed", "Monture fantôme", "Phantom Steed", 3, "illusion", "1 minute", 30, "V, S", "1 heure",
      ["wizard"], { ritual: true }),
    S("leomunds-tiny-hut", "Petite hutte de Léomund", "Leomund's Tiny Hut", 3, "evocation", "1 minute", "self", "V, S, M", "8 heures",
      ["bard", "wizard"], { ritual: true, material: "une bille de cristal" }),
    // Niveau 4
    S("phantasmal-killer", "Assassin imaginaire", "Phantasmal Killer", 4, "illusion", "action", 120, "V, S", "1 minute",
      ["bard", "wizard"], { concentration: true, save: "wis", damage: { dice: "4d10", type: "psychic" } }),
    S("summon-elemental", "Convocation d'élémentaire", "Summon Elemental", 4, "conjuration", "action", 90, "V, S, M", "1 heure",
      ["druid", "ranger", "wizard"], { concentration: true, material: "de l'air, un caillou, des cendres et de l'eau dans un flacon incrusté d'or d'une valeur minimale de 400 po" }),
    S("fount-of-moonlight", "Fontaine de lune", "Fount of Moonlight", 4, "evocation", "action", "self", "V, S", "10 minutes",
      ["bard", "druid"], { concentration: true, save: "con" }),
    S("giant-insect", "Insecte géant", "Giant Insect", 4, "conjuration", "action", 60, "V, S", "10 minutes",
      ["druid"], { concentration: true }),
    S("conjure-minor-elementals", "Invocation d'élémentaires mineurs", "Conjure Minor Elementals", 4, "conjuration", "action", "self", "V, S", "10 minutes",
      ["druid", "wizard"], { concentration: true }),
    S("conjure-woodland-beings", "Invocation d'êtres sylvestres", "Conjure Woodland Beings", 4, "conjuration", "action", "self", "V, S", "10 minutes",
      ["druid", "ranger"], { concentration: true, save: "wis", damage: { dice: "5d8", type: "force" } }),
    S("grasping-vine", "Liane avide", "Grasping Vine", 4, "conjuration", "bonus", 60, "V, S", "1 minute",
      ["druid", "ranger"], { concentration: true, attack: "melee", damage: { dice: "4d8", type: "bludgeoning" } }),
    // Niveau 5
    S("awaken", "Éveil", "Awaken", 5, "transmutation", "8 heures", "touch", "V, S, M", "Instantanée",
      ["bard", "druid"], { material: "une agate d'une valeur minimale de 1000 po, que le sort consomme" }),
    S("conjure-elemental", "Invocation d'élémentaire", "Conjure Elemental", 5, "conjuration", "action", 60, "V, S", "10 minutes",
      ["druid", "wizard"], { concentration: true, save: "dex" }),
    S("conjure-volley", "Invocation de volée", "Conjure Volley", 5, "conjuration", "action", 150, "V, S, M", "Instantanée",
      ["ranger"], { save: "dex", damage: { dice: "8d8", type: "force" }, material: "une arme de corps à corps ou à distance d'une valeur minimale de 1 pc" }),
    S("reincarnate", "Réincarnation", "Reincarnate", 5, "necromancy", "1 heure", "touch", "V, S, M", "Instantanée",
      ["druid"], { material: "des huiles rares d'une valeur minimale de 1000 po, que le sort consomme" }),
    S("swift-quiver", "Vif carquois", "Swift Quiver", 5, "transmutation", "bonus", "self", "V, S, M", "1 minute",
      ["ranger"], { concentration: true, material: "un carquois d'une valeur minimale de 1 po" }),
  ]);

  // Listes de classes corrigées d'après AideDD 2024
  const addList = (id, list) => { const s = DND.data.spells[id]; if (s && !s.lists.includes(list)) s.lists.push(list); };
  addList("fire-shield", "druid");
  addList("dispel-magic", "ranger");
  addList("detect-magic", "warlock");
  addList("speak-with-animals", "warlock");
})();
