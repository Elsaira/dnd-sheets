# Clerc (Cleric)

Fichier du module : `modules/classes/cleric.js` (Domaine de la Tombe : `modules/classes/cleric-grave.js`). Sorts : `modules/spells/cleric.js` et `modules/spells/cleric-grave.js`.
Source : règles 2024, textes et noms d'après [AideDD](https://www.aidedd.org/regles-24/classes/clerc/) (relevés le 2026-10-15).

## 1. Ressources et récupération
| Ressource | Maximum | Récupération |
|---|---|---|
| Emplacements de sorts | lanceur complet (table commune) | Repos long |
| Conduit divin (niv. 2) | 2 (3 au niv. 6, 4 au niv. 18) | 1 au repos court, tous au repos long |
| Intervention divine (niv. 10) | 1 | Repos long |
| Éclat protecteur (Lumière) | Mod. de Sagesse (min. 1) | Repos long ; aussi repos court à partir du niv. 6 (voir cas particuliers) |
| Prêtre de guerre (Guerre) | Mod. de Sagesse (min. 1) | Repos court ou long |
| Sentinelle au seuil de la mort (Tombe, niv. 6) | Mod. de Sagesse (min. 1) | Repos long |
| Gardien des âmes (Tombe, niv. 17) | 1 | Repos court ou long, ou un emplacement de niveau 6+ (boutons « Niv. X », `slotRegain: 6`, bloqué si Neutralisé) |

## 2. Aptitudes par niveau et impact sur la fiche
| Niv. | Aptitude | Ce que la fiche fait |
|---|---|---|
| 1 | Sorts | Sagesse ; 3 sorts mineurs (4 au niv. 4, 5 au niv. 10) ; sorts préparés 4 → 15 au niv. 10 ; DD et attaque calculés |
| 1 | Ordre divin | Protecteur : armures lourdes + armes de guerre. Thaumaturge : sort mineur en plus + Sagesse (min. +1) en Arcanes et Religion |
| 2 | Conduit divin | Compteur ; Étincelle divine (dés et DD calculés) et Renvoi des morts-vivants dans les actions |
| 3 | Sous-classe | Choix du domaine |
| 4, 8 | Amélioration de caractéristique | Choix d'un don |
| 5 | Calcination de mort-vivant | Dégâts radiants (Sagesse × d8) ajoutés au texte de Renvoi |
| 7 | Frappes bénies | Choix : Frappe divine (rappel +1d8) ou Incantation puissante (+Sagesse aux dégâts des sorts mineurs de clerc, calculé) |
| 10 | Intervention divine | Compteur + action |
| 12, 16 | Amélioration de caractéristique | **Pas encore géré** |
| 14 | Impacts bénis améliorés | **Pas encore géré** (le rappel de Frappe divine passe déjà à 2d8) |
| 17 | Aptitude de sous-classe | **Pas encore géré** |
| 19, 20 | Faveur épique, Intervention divine suprême | **Pas encore géré** |

## 3. Sous-classes prises en charge
- **Domaine de la Vie** : Disciple de la Vie (rappel), sorts de domaine, Survivance (5 × niveau calculé), Guérisseur béni (rappel).
- **Domaine de la Lumière** : sorts de domaine, Radiance de l'Aube (dégâts et DD calculés), Éclat protecteur (compteur, réaction ; PV temporaires au niv. 6).
- **Domaine de la Ruse** : Faveur du filou, Invocation de réplique (Conduit divin), sorts de domaine, Troc du filou.
- **Domaine de la Guerre** : Frappe guidée (+10, Conduit divin), sorts de domaine, Prêtre de guerre (compteur), Bénédiction du dieu de la guerre.
- **Domaine de la Tombe** (*Ravenloft: The Horrors Within*, texte du livre fourni par Plouf le 2026-11-11) : sorts de domaine, Le cercle de la mort (rappel, 1d4 puis 1d6 au niv. 11), Le chemin de la tombe (action bonus, Conduit divin, + niveau de clerc calculé), La sentinelle au seuil de la mort (compteur, réaction), Faucheur divin (niv. 17, compteur Gardien des âmes).
- Les sorts de domaine sont toujours préparés, ne comptent pas dans le nombre de sorts préparés et apparaissent aux niveaux 3, 5, 7 et 9.

## 4. Cas particuliers et décisions
- **Conduit divin** : un seul compteur pour tous les effets ; chaque action qui le dépense le précise. Carte « Conduit divin » dans l'onglet Sorts (`spellTab`, 2026-11-26) avec toutes les options disponibles ; Nécromancie améliorée (Sépulcre) y figure comme action gratuite.
- **Éclat protecteur amélioré** : le noyau ne sait pas encore changer la récupération d'une ressource selon le niveau (repos long avant 6, court ensuite). La ressource reste « repos long » ; à partir du niveau 6, un rappel dit de rendre les utilisations à la main après un repos court. Correction possible avec un petit ajout générique au noyau (voir DEVLOG).
- **Incantation puissante** : le bonus s'applique aux sorts mineurs de clerc à dégâts du catalogue (Flamme sacrée, Glas, Mot de radiance).
- **Oeil du mage** : retiré de la liste du clerc (ce n'est pas un sort de clerc en 2024) ; il reste un sort de domaine de la Lumière.
- **Catalogue** : les 87 sorts de clerc de niveau 0 à 5 d'AideDD sont disponibles (52 ajoutés, mécaniques AideDD).

- **Domaine de la Tombe** :
  - Version du livre *Ravenloft: The Horrors Within* (RHW p. 19-20, VO), d'après les captures envoyées par Plouf le 2026-11-11. Noms français repris de l'Arcanes exhumés 2025 (AideDD) en attendant la VF.
  - Différences avec l'Arcanes exhumés : sorts de domaine (Fausse vie, Stabilisation, Protection contre la mort au lieu de Contact glacial et Immobilisation de monstre), Repousser la mort sur toute créature blessée (1d6 au niv. 11), Stabilisation en action bonus, Chemin de la tombe jusqu'au début du prochain tour et + niveau de clerc (sans 1d8), Sentinelle à 18 m et critique annulé, Gardien des âmes = 2 × niveau en PV (pas temporaires), recharge aussi avec un emplacement de niveau 6+.
  - 2026-11-14 : noms de la VF « Ravenloft : Les reflets de l'horreur » (Domaine du Sépulcre, Cercle de mortalité, Voie du Sépulcre), apportés par un ami.
  - Stabilisation est un sort de domaine (pastille « Action bonus » via l effet `castingTime`) : toujours préparé, il ne compte pas dans les sorts mineurs.
  - Coquille antivie n'est plus un sort de domaine ; elle reste au catalogue (modules/spells/cleric-grave.js) pour les druides.

### Termes français
Tous les noms viennent d'AideDD. AideDD écrit « Frappes bénies » au niveau 7 et « Impacts bénis améliorés » au niveau 14 ; la fiche suit ces noms.

## 5. Statut
- 2026-10-15 : niveaux 1 à 10 et 4 domaines **faits**, 23 tests automatiques. **À tester par un joueur.**
- 2026-10-15 : Domaine de la Tombe **fait** (niveaux 3 à 10), 8 tests de plus. **À tester par un joueur.**
- 2026-11-11 : Domaine de la Tombe passé à la version du livre Ravenloft (2026), niveaux 3 à 17 ; 473 tests. **À tester par un joueur.**
