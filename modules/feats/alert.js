// Don d'origine : Vigilant (Alert) — SRD 5.2
registerModule({
  kind: "feat", id: "alert", category: "origin",
  name: { fr: "Vigilant", en: "Alert" },
  description: "Bonus de maîtrise à l'initiative, échange d'initiative avec un allié.",
  features: [
    { id: "alert", combat: "Juste après le jet d'initiative : échangez votre résultat avec celui d'un allié consentant (sauf si l'un de vous est Neutralisé).", name: { fr: "Vigilant", en: "Alert" },
      description: "Maîtrise de l'initiative : ajoutez votre bonus de maîtrise à l'initiative. Échange d'initiative : juste après votre jet d'initiative, vous pouvez échanger votre résultat avec celui d'un allié consentant dans le même combat (impossible si l'un de vous est Neutralisé).",
      effects: [{ type: "bonus", target: "initiative", value: (c) => c.pb, label: "Vigilant" }] },
  ],
});
