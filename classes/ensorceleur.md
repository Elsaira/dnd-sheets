# Ensorceleur (Sorcerer)

Fichier du module : `modules/classes/sorcerer.js` (+ `sorcerer-storm.js` pour la Sorcellerie des tempêtes). Sorts : `modules/spells/sorcerer.js`.
Source : règles 2024, textes et noms d'après [AideDD](https://www.aidedd.org/regles-24/classes/ensorceleur/) (relevés le 2026-10-15). Sorcellerie aberrante et Sorcellerie mécanique ne sont pas détaillées sur AideDD : saisies de mémoire, à vérifier dans le Manuel des joueurs.

## 1. Ressources et récupération
| Ressource | Maximum | Récupération |
|---|---|---|
| Emplacements de sorts | lanceur complet (table commune) | Repos long |
| Sorcellerie innée | 2 | Repos long (ou 2 points de sorcellerie à partir du niv. 7) |
| Points de sorcellerie (niv. 2) | niveau d'ensorceleur | Repos long |
| Restauration ensorcelée (niv. 5) | 1 (rend jusqu'à niveau ÷ 2 points au repos court) | Repos long |
| Marée du chaos (Sauvage) | 1 | Repos long, ou en lançant un sort d'ensorceleur avec emplacement |
| Rétablir l'équilibre (Mécanique) | Mod. de Charisme (min. 1) | Repos long |

## 2. Aptitudes par niveau et impact sur la fiche
| Niv. | Aptitude | Ce que la fiche fait |
|---|---|---|
| 1 | Sorts | Charisme ; 4 sorts mineurs (5 au niv. 4, 6 au niv. 10) ; sorts préparés 2 → 15 au niv. 10 |
| 1 | Sorcellerie innée | Compteur + action bonus (DD +1 affiché) |
| 2 | Réserve arcanique | Compteur de points ; actions Convertir / Créer un emplacement avec les coûts accessibles au niveau |
| 2 | Métamagie (2) | Choix dans les 10 options d'AideDD ; chaque option devient une action avec son coût |
| 3 | Sous-classe | Choix |
| 4, 8 | Amélioration de caractéristique | Choix d'un don |
| 5 | Restauration ensorcelée | Compteur, nombre de points rappelé |
| 7 | Sorcellerie incarnée | Ajouté au texte de Sorcellerie innée |
| 10 | Métamagie (4) | 2 choix de plus |
| 11–20 | Faveur épique, Apothéose arcanique… | **Pas encore géré** (Métamagie 6 au niv. 17 déjà comptée) |

## 3. Sous-classes prises en charge
- **Sorcellerie draconique** : Résistance draconique (PV + niveau, CA 10 + Dex + Cha sans armure, calculées), sorts draconiques, Affinité élémentaire (résistance choisie + rappel du bonus).
- **Sorcellerie sauvage** : Bouffée (rappel ; la table est sur AideDD), Marée du chaos (compteur), Comme par hasard (réaction, 1 point).
- **Sorcellerie aberrante** (de mémoire) : sorts psioniques, Discours télépathique, Sorcellerie psionique, Défenses psychiques (résistance psychique).
- **Sorcellerie mécanique** (de mémoire) : sorts mécaniques, Rétablir l'équilibre (compteur), Bastion de la loi.
- **Sorcellerie des tempêtes** (Xanathar, 2014, fichier `modules/classes/sorcerer-storm.js`) : Langage du vent (primordial ajouté aux langues), Magie tumultueuse (action bonus), Cœur de la tempête (résistances foudre et tonnerre, dégâts = moitié du niveau rappelés), Guide des tempêtes (2 actions). Texte d'AideDD.

## 4. Cas particuliers et décisions
- **Emplacements créés** avec des points : la fiche ne sait pas dépasser le maximum d'emplacements. Pour l'instant, on dépense les points et on retient l'emplacement de tête (ou on « récupère » une pastille déjà dépensée).
- **Convertir un emplacement** : dépensez la pastille d'emplacement puis rendez les points avec « + » sur la ressource.
- **Sorcellerie innée** : l'effet (DD +1, Avantage) est affiché dans l'action, pas appliqué au DD de la fiche, puisqu'il ne dure qu'une minute.
- **Affinité élémentaire** : le bonus de Charisme s'applique à un seul jet de dégâts, au choix ; rappel seulement.
- **Éruption ensorcelée** : type de dégâts au choix au lancer, affiché « type au choix » dans les attaques.
- **Catalogue** : les 119 sorts d'ensorceleur de niveau 0 à 5 d'AideDD sont disponibles.

- **Sorcellerie des tempêtes, adaptation 2024** : dans le Xanathar, Langage du vent et Magie tumultueuse arrivent au niveau 1. Les sous-classes 2024 commencent au niveau 3, donc la fiche les donne au niveau 3. Un ensorceleur des tempêtes de niveau 1 ou 2 n'a pas encore ces aptitudes. Pas de sorts de sous-classe (le livre n'en donne pas).

### Termes français
Noms d'AideDD pour la classe, les options de Métamagie, la Sorcellerie draconique et la Sorcellerie sauvage. À vérifier : Discours télépathique, Sorcellerie psionique, Défenses psychiques, Sorts psioniques (aberrante), Rétablir l'équilibre, Bastion de la loi, Sorts mécaniques (mécanique).
- Défenses psychiques (Aberrant) : ★ avantage sur Charmé et Effrayé dans l'encart États (2026-10-24).

## 5. Statut
- 2026-10-15 : niveaux 1 à 10 et 4 sous-classes **faits**, 21 tests automatiques. **À tester par un joueur.**
- 2026-10-15 : Sorcellerie des tempêtes ajoutée (5 tests). **À tester par le joueur de l'ensorceleur.**

- 2026-11-10 : emplacements créés par la Réserve arcanique suivis sur la fiche (bouton + de la carte Emplacements de sorts, effet `extraSlots`, perdus au repos long).
