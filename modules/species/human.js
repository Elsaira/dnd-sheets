// Espèce : Humain (Human) — SRD 5.2
registerModule({
  kind: "species", id: "human",
  name: { fr: "Humain", en: "Human" },
  size: "medium", speed: 30,
  description: "Polyvalents : inspiration héroïque à chaque repos long, une compétence et un don d'origine.",
  features: [
    { id: "size", name: { fr: "Taille", en: "Size" }, hidden: true,
      effects: [{ type: "choice", id: "size", label: "Taille", from: [
        { id: "medium", name: { fr: "Moyenne", en: "Medium" }, effects: [{ type: "size", value: "medium" }] },
        { id: "small", name: { fr: "Petite", en: "Small" }, effects: [{ type: "size", value: "small" }] }] }] },
    { id: "resourceful", name: { fr: "Ingénieux", en: "Resourceful" },
      description: "Vous gagnez l'Inspiration héroïque à la fin de chaque repos long.",
      effects: [{ type: "onRest", rest: "long", set: "heroicInspiration" }] },
    { id: "skillful", name: { fr: "Talentueux", en: "Skillful" },
      description: "Maîtrise d'une compétence de votre choix.",
      effects: [{ type: "choice", id: "skill", label: "Compétence", from: "skills" }] },
    { id: "versatile", name: { fr: "Polyvalent", en: "Versatile" },
      description: "Vous gagnez un don d'origine de votre choix.",
      effects: [{ type: "choice", id: "originFeat", label: "Don d'origine", from: "feats", filter: { category: "origin" } }] },
  ],
});
