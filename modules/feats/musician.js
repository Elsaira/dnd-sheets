// Don d'origine : Musicien (Musician) — Manuel des joueurs 2024, texte d'après AideDD
registerModule({
  kind: "feat", id: "musician", category: "origin",
  name: { fr: "Musicien", en: "Musician" },
  description: "Trois instruments de musique, Inspiration héroïque aux alliés après un repos.",
  features: [
    { id: "musician", name: { fr: "Musicien", en: "Musician" },
      description: "Formation aux instruments : vous maîtrisez trois instruments de musique de votre choix. Chant d'encouragement : à la fin d'un repos court ou long, vous pouvez jouer une chanson avec un instrument maîtrisé et donner l'Inspiration héroïque à des alliés qui l'entendent, au plus autant que votre bonus de maîtrise.",
      effects: [{ type: "choice", id: "instruments", label: "Instruments de musique", count: 3, from: "tools.musical" }] },
  ],
});
