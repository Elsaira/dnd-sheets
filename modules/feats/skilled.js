// Don d'origine : Doué (Skilled) — SRD 5.2
registerModule({
  kind: "feat", id: "skilled", category: "origin", repeatable: true,
  name: { fr: "Doué", en: "Skilled" },
  description: "Trois maîtrises de compétences ou d'outils.",
  features: [
    { id: "skilled", name: { fr: "Doué", en: "Skilled" },
      description: "Vous gagnez la maîtrise de trois compétences ou outils de votre choix.",
      effects: [{ type: "choice", id: "proficiencies", label: "Compétences ou outils", count: 3, from: "skills+tools" }] },
  ],
});
