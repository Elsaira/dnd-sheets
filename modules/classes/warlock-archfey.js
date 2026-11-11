// Sous-classe d'Occultiste : Protecteur Archifée (Archfey Patron) — Player's Handbook 2024 (hors SRD).
// Noms et règles vérifiés sur AideDD (regles-24/classes/occultiste) le 2026-10-15.
// Ajoutée sans modifier warlock.js, grâce à "subclass:warlock".
(function () {
  const cha = "cha";
  const DC = (c) => 8 + c.pb + c.mod.cha;
  registerList("subclass:warlock", [{
    id: "archfey", name: { fr: "Protecteur Archifée", en: "Archfey Patron" }, source: "PHB 2024",
    features: [
      { level: 3, id: "archfey-spells", name: { fr: "Sorts de l'Archifée", en: "Archfey Spells" },
        description: "Sorts toujours préparés : Apaisement des émotions, Lueurs féeriques, Foulée brumeuse, Force fantasmagorique, Sommeil (niv. 3) ; Clignotement, Croissance végétale (niv. 5) ; Domination de bête, Invisibilité suprême (niv. 7) ; Domination de personne, Apparence trompeuse (niv. 9).",
        effects: [
          ...["calm-emotions", "faerie-fire", "misty-step", "phantasmal-force", "sleep"].map((spell) => ({ type: "spell", spell, ability: cha })),
          ...["blink", "plant-growth"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 5 })),
          ...["dominate-beast", "greater-invisibility"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 7 })),
          ...["dominate-person", "seeming"].map((spell) => ({ type: "spell", spell, ability: cha, minLevel: 9 })),
        ] },
      { level: 3, id: "steps-of-the-fey", name: { fr: "Foulée des fées", en: "Steps of the Fey" },
        description: "Vous pouvez lancer Foulée brumeuse sans dépenser d'emplacement un nombre de fois égal à votre modificateur de Charisme (minimum 1), récupérées au repos long. Chaque fois que vous lancez ce sort, vous pouvez choisir un effet : Foulée revigorante (juste après la téléportation, vous ou une créature visible à 3 m gagnez 1d10 PV temporaires) ou Foulée provocatrice (les créatures à 1,5 m de l'espace quitté réussissent un JS de Sagesse ou ont le désavantage aux attaques contre les créatures autres que vous jusqu'au début de votre prochain tour).",
        effects: [
          { type: "resource", id: "stepsOfFey", name: { fr: "Foulée des fées", en: "Steps of the Fey" },
            max: (c) => Math.max(1, c.mod.cha), recharge: "long", description: "Foulée brumeuse sans emplacement." },
          { type: "action", name: { fr: "Foulée des fées (Foulée brumeuse)", en: "Steps of the Fey" }, actionType: "bonus", resource: "stepsOfFey",
            description: (c) => "Téléportation de 9 m. Au choix : Foulée revigorante (1d10 PV temporaires à vous ou une créature visible à 3 m) ou Foulée provocatrice (JS de Sagesse DD " + DC(c) + " pour les créatures à 1,5 m du départ, sinon désavantage aux attaques contre d'autres que vous)." },
        ] },
      { level: 6, id: "misty-escape", name: { fr: "Échappatoire brumeuse", en: "Misty Escape" },
        description: "Vous pouvez lancer Foulée brumeuse par une Réaction en réponse à des dégâts subis. De plus, deux effets s'ajoutent aux options de Foulée des fées : Foulée de disparition (vous êtes Invisible jusqu'au début de votre prochain tour, ou jusqu'à ce que vous fassiez un jet d'attaque, infligiez des dégâts ou lanciez un sort) et Foulée effroyable (les créatures à 1,5 m de l'espace quitté ou de l'espace d'arrivée, au choix, réussissent un JS de Sagesse ou subissent 2d10 dégâts psychiques).",
        effects: [{ type: "action", name: { fr: "Échappatoire brumeuse", en: "Misty Escape" }, actionType: "reaction",
          description: (c) => "Quand vous subissez des dégâts : Foulée brumeuse (emplacement ou Foulée des fées). Options en plus : Foulée de disparition (Invisible) ou Foulée effroyable (JS de Sagesse DD " + DC(c) + ", sinon 2d10 psychiques)." }] },
      { level: 10, id: "beguiling-defenses", name: { fr: "Charmantes défenses", en: "Beguiling Defenses" },
        description: "Immunité à l'état Charmé. Juste après qu'une créature visible vous a touché avec un jet d'attaque, vous pouvez prendre une Réaction pour réduire de moitié les dégâts subis (arrondi à l'inférieur) ; l'attaquant fait un JS de Sagesse ou subit des dégâts psychiques égaux aux dégâts que vous avez subis. Utilisable de nouveau après un repos long, ou en dépensant un emplacement de Magie de pacte (aucune action requise).",
        effects: [
          { type: "resource", id: "beguilingDefenses", name: { fr: "Charmantes défenses", en: "Beguiling Defenses" }, max: 1, recharge: "long",
            description: "Ou récupérer en dépensant un emplacement de Magie de pacte." },
          { type: "action", name: { fr: "Charmantes défenses", en: "Beguiling Defenses" }, actionType: "reaction", resource: "beguilingDefenses",
            description: (c) => "Quand une créature vous touche : dégâts divisés par deux ; JS de Sagesse DD " + DC(c) + " ou elle subit autant de dégâts psychiques que vous." },
          { type: "immunity", condition: "charmed" },
        ] },
      { level: 14, id: "bewitching-magic", name: { fr: "Magie envoûtante", en: "Bewitching Magic" },
        description: "Non géré pour l'instant (au-delà du niveau 10)." },
    ],
  }]);
})();
