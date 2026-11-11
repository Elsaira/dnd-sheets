// Petits outils d'affichage, sans bibliothèque :
// - h() fabrique des éléments HTML ;
// - morph() met à jour la page en ne changeant que ce qui a changé
//   (le champ en cours de saisie garde le focus, les clics ne se perdent pas).
(function () {
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = Array.isArray(v) ? v.filter(Boolean).join(" ") : v;
      else if (k === "value") { el.value = v; if (tag !== "select") el.setAttribute("value", v); }
      else if (k === "checked") { el.checked = !!v; el.setAttribute("checked", ""); }
      else if (k === "selected") { el.selected = !!v; el.setAttribute("selected", ""); }
      else if (k === "html") el.innerHTML = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    appendChildren(el, children);
    if (tag === "select" && attrs && attrs.value != null) el.value = attrs.value;
    return el;
  }

  function appendChildren(el, children) {
    for (const c of children) {
      if (c == null || c === false || c === true) continue;
      if (Array.isArray(c)) appendChildren(el, c);
      else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    }
  }

  function morph(oldNode, newNode) {
    if (oldNode.nodeType !== newNode.nodeType || oldNode.nodeName !== newNode.nodeName) {
      oldNode.replaceWith(newNode);
      return;
    }
    if (oldNode.nodeType === Node.TEXT_NODE) {
      if (oldNode.nodeValue !== newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
      return;
    }
    if (oldNode.nodeType !== Node.ELEMENT_NODE) return;
    for (const a of [...oldNode.attributes]) {
      if (a.name === "open" && oldNode.tagName === "DETAILS") continue; // garder les sections dépliées
      if (!newNode.hasAttribute(a.name)) oldNode.removeAttribute(a.name);
    }
    for (const a of [...newNode.attributes]) if (oldNode.getAttribute(a.name) !== a.value) oldNode.setAttribute(a.name, a.value);

    const oldKids = [...oldNode.childNodes];
    const newKids = [...newNode.childNodes];
    for (let i = 0; i < newKids.length; i++) {
      if (oldKids[i]) morph(oldKids[i], newKids[i]);
      else oldNode.appendChild(newKids[i]);
    }
    for (let i = newKids.length; i < oldKids.length; i++) oldKids[i].remove();

    // Valeurs des champs de formulaire (sauf celui que l'utilisateur est en train d'utiliser)
    const tag = oldNode.tagName;
    if ((tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") && document.activeElement !== oldNode) {
      if (oldNode.type === "checkbox" || oldNode.type === "radio") oldNode.checked = newNode.checked;
      else if (oldNode.value !== newNode.value) oldNode.value = newNode.value;
    }
  }

  DND.dom = { h, morph };
})();
