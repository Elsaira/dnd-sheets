# Project Guidelines

French D&D 2024 (5.5) character sheets for one gaming group. Vanilla HTML/JS, no build step, no dependencies: `index.html` opens by double-click and also runs on GitHub Pages. Several AI agents and people edit this repository, so follow these rules exactly.

## The one rule that matters most

**Never put class, subclass, species, feat or spell specific code in `core/`.**

`core/` is a generic engine. It knows effect types, not game content. If a feature needs behaviour the engine lacks:

1. Add a **generic, reusable option** to the engine (a new field on an existing effect type, or a new effect type), named for what it does, not for who uses it.
2. Use that option from the content module in `modules/`.

Example: Keeper of Souls (Grave cleric) regains a use by spending a level 6+ slot. Wrong: `if (subclass === "grave")` in `core/rules.js`. Right: the generic `resource` options `slotRegain: 6` and `blockedBy: "incapacitated"`, set in `modules/classes/cleric-grave.js`.

The same applies to views: no lists of spell ids, class ids or feature ids in `core/view-*.js`. Put the data on the spell or feature and let the view read it.

Check before committing: `grep -n -i "cleric\|warlock\|fighter\|paladin\|sorcerer\|artificer" core/*.js` should find nothing new.

## Layout

| Path | Role |
|---|---|
| `index.html` | Single page; loads core scripts, then `core/loader.js` loads everything listed in `modules/manifest.js` |
| `core/engine.js` | `E.compute(character)` builds the computed sheet from choices and effects |
| `core/rules.js` | State changes: damage, rests, slots, resources, coins |
| `core/view-play.js`, `core/view-build.js` | Play mode and creation mode rendering |
| `core/app.js`, `dom.js`, `storage.js`, `registry.js` | App shell, DOM patching (`morph`), localStorage and JSON import/export, module registration |
| `data/` | Shared SRD data: rules labels, equipment, base spells, spell upcast table |
| `modules/classes/`, `species/`, `backgrounds/`, `feats/` | One file per class, subclass, species, background, feat |
| `modules/spells/<x>.js` | Spells added for a class or subclass |
| `modules/manifest.js` | The list of modules to load, one line each |
| `classes/<classe>.md`, `modules.md`, `DEVLOG.md` | Per-class notes, cross-cutting module notes, dated change log |
| `tests/` | `node tests/run.js` |

## Adding or changing content

- **New class or subclass:** add `modules/classes/<id>.js` and one line in `modules/manifest.js`. No core change.
- **New spell:** add it in `modules/spells/<x>.js` with `DND.registerSpells`, not in `data/spells.js`. Spell links go to `aidedd.org/spell/fr/<french-name-without-accents-with-dashes>`.
- **Features** declare `effects`. Existing effect types: `ability`, `acFormula`, `action`, `advantage`, `bonus`, `castingTime` (`{ spell, value: "bonus" }` changes how a spell is cast), `choice`, `companion`, `companionNote`, `extraSlots`, `extraSpellList`, `immunity`, `note`, `onRest`, `proficiency`, `resistance`, `resource`, `sense`, `size`, `speed`, `spell`, `weaponBond`. Read a similar existing module before inventing anything.
- **Healing spells** carry `heal: { dice, mod: true }` or `heal: { text }` on the spell; the engine computes the value and the "Soins" card lists them.
- **Alternative spell damage** (Toll the Dead 1d12 if wounded): `damage: { dice, type, alt: { dice, label } }`; scaled like the main dice and shown in small grey text, like a versatile weapon.
- **Slot-related resource options:** `slotRegain: n` (regain a use by spending a slot of level n+), `pactRegain: 0.5` (using it restores that share of pact slots, rounded up), `slotCreate: { level: cost }` and `slotConvert: true` (spend the resource to create a slot, or a slot to get the resource back), `unit: ["pt", "pts"]` (singular/plural shown after amounts on those buttons), `restores: { id, amount, shortRest }` (using it gives back `amount` uses of another resource of the same source; `shortRest: true` shows the button only in the short rest window).
- **In-play reminders:** a feature that matters in combat takes `combat: true` (or a short string, or a function) so it shows in "Actions spéciales". Write what the player needs at the table, not data-entry instructions.
- **Saved characters hold only choices and state**, never computed values. Everything else is recomputed on each render. Do not store derived numbers, and keep old saves loading (new state fields must tolerate being absent).

## Code style

- Short, efficient code. **Do not add comments.**
- Code, identifiers and commit messages in English. Every text the player sees in French, with D&D terms as on AideDD (`name: { fr, en }`).
- Classic scripts on the global `DND` namespace. No modules, bundlers, frameworks, npm packages or network calls.
- Beige kraft theme by default with a per-class accent colour; an optional "Gris sombre" theme (`html[data-theme="grey"]` in `core/style.css`, chosen in Options, saved per browser) only overrides the colour variables. New colours go in variables so both themes follow. Do not restyle the sheet unless asked.

## Rules sources

In order: SRD 5.2, then `aidedd.org/regles-24` (spells, feats, French names), then the group's own books. Non-SRD content (Artificer, Monsters of the Multiverse species, Ravenloft subclasses) is entered as mechanics only. Anything written from memory must be marked "à vérifier dans le livre" in `classes/<classe>.md` or `modules.md`. Never guess a rule silently.

## Before every commit

1. `git pull` first: several agents push to `main`.
2. `node tests/run.js` must pass. Add a test for each rule you add or change (`tests/run.js`, `tests/classes.js`, `tests/classes2.js`).
3. Open `index.html` and check the affected tabs in play and creation mode, with no console errors. Check the layout at about 1060 px wide and at phone width, not only on a wide screen: tables must not break words and pips must stay on one line.
4. If a file in `core/` changed, change its `?v=` value in `index.html` so browsers reload it.
5. Add a dated entry at the top of `DEVLOG.md` (what changed and why, a few lines) and update `classes/<classe>.md` or `modules.md` when content changed.
6. Do not commit screenshots, exported characters or other scratch files.

## Documentation

- Keep the species and base-class lists in `README.md` synchronized with the content modules loaded by `modules/manifest.js`.
- Whenever a species or class is added, removed, or renamed, update the corresponding README list in the same change. Keep subclass and patron entries in the specializations paragraph current as well.
