# Guerrier (Fighter)

Fichier du module : `modules/classes/fighter.js`. Sorts du Chevalier occulte : `modules/spells/fighter.js`.
Source : règles 2024, textes et noms d'après [AideDD](https://www.aidedd.org/regles-24/classes/guerrier/) (relevés le 2026-10-15). Le Soldat psi n'est pas détaillé sur AideDD : saisi de mémoire, à vérifier dans le Manuel des joueurs.

## 1. Ressources et récupération
| Ressource | Maximum | Récupération |
|---|---|---|
| Second souffle | 2 (niv. 1), 3 (niv. 4), 4 (niv. 10) | 1 au repos court, toutes au repos long |
| Fougue | 1 (2 au niv. 17) | Repos court ou long |
| Inflexible (niv. 9) | 1 (2 au niv. 13, 3 au niv. 17) | Repos long |
| Dés de supériorité (Maître de guerre) | 4 (5 au niv. 7, 6 au niv. 15) ; d8, d10 au niv. 10 | Repos court ou long |
| Observation de l'ennemi (Maître de guerre, niv. 7) | 1 | Repos long, ou un dé de supériorité |
| Emplacements de sorts (Chevalier occulte) | table du Chevalier occulte | Repos long |
| Dés d'énergie psionique (Soldat psi) | 4 / 6 (niv. 5) / 8 (niv. 9) ; d6, d8 au niv. 5, d10 au niv. 11 | 1 au repos court, tous au repos long |
| Mouvement télékinétique, Bond psionique (Soldat psi) | 1 chacun | Repos court, ou un dé psionique |

## 2. Aptitudes par niveau et impact sur la fiche
| Niv. | Aptitude | Ce que la fiche fait |
|---|---|---|
| 1 | Style de combat | Choix d'un don de style de combat (effets calculés : Défense, Archerie…) |
| 1 | Second souffle | Compteur + action bonus avec « 1d10 + niveau » calculé |
| 1 | Bottes d'arme (3) | Choix des armes ; la botte s'affiche sur l'attaque de l'arme |
| 2 | Fougue, Sens tactique | Compteur de Fougue ; actions affichées |
| 3 | Sous-classe | Choix dans Création |
| 4 | Amélioration de caractéristique, Bottes (4) | Choix d'un don (général, d'origine ou de style de combat) |
| 5 | Attaque supplémentaire, Décalage tactique | Rappel « deux attaques » ; Décalage ajouté au texte de Second souffle |
| 6 | Amélioration de caractéristique | Choix d'un don |
| 7 | Aptitude de sous-classe | |
| 8 | Amélioration de caractéristique | Choix d'un don |
| 9 | Inflexible, Botte tactique | Compteur et bonus calculé ; rappel des bottes de remplacement |
| 10 | Aptitude de sous-classe, Bottes (5) | |
| 11 | Double attaque supplémentaire | **Pas encore géré** (hors périmètre 1–10) |
| 12, 14, 16 | Amélioration de caractéristique | **Pas encore géré** |
| 13 | Attaques avisées, Inflexible (2) | Inflexible ×2 calculé ; aptitude non saisie |
| 15, 18 | Aptitudes de sous-classe | **Pas encore géré** |
| 17 | Fougue (2), Inflexible (3) | Compteurs calculés ; reste non saisi |
| 19 | Faveur épique | **Pas encore géré** |
| 20 | Triple attaque supplémentaire | **Pas encore géré** |

## 3. Sous-classes prises en charge
- **Champion** : Critique amélioré (rappel 19–20), Athlète accompli (Avantage affiché sur l'Initiative et l'Athlétisme), Style de combat supplémentaire (2e don au niveau 7), Héros du champ d'honneur (rappel).
- **Chevalier occulte** : incantation de tiers (Intelligence, liste du magicien), table d'emplacements propre (3 emplacements de niveau 1 au niveau 4, etc.) ; en multiclassage, niveau ÷ 3 arrondi à l'inférieur. Arme occulte (action bonus), Magie de guerre et Fragilisation occulte (rappels). Les 40 sorts de magicien de niveau 0 à 2 qui manquaient au catalogue sont ajoutés (mécaniques AideDD).
- **Maître de guerre** : Disciple martial (outil d'artisan et compétence), Supériorité martiale (dés, 20 manœuvres d'AideDD, chaque manœuvre choisie devient une action de l'onglet Combat avec le DD calculé), Observation de l'ennemi, dés d10 au niveau 10.
- **Soldat psi** (saisi de mémoire) : dés d'énergie psionique, Champ protecteur, Frappe psionique (avec Poussée télékinétique au niveau 7), Mouvement télékinétique, Bond psionique, Esprit protégé (résistance psychique).

## 4. Cas particuliers et décisions
- **Bottes d'arme** : on choisit un type d'arme (épée longue, arc long…), ce qui donne la maîtrise de sa botte (`mastery.<arme>`). Changer d'arme après un repos long = décocher / cocher dans Création.
- **Style de combat** : ce sont les dons de style de combat déjà présents (`modules/feats/`). Ils sont aussi proposés aux niveaux 4, 6 et 8 (le guerrier remplit leur prérequis).
- **Second souffle et Sens tactique** dépensent le même compteur.
- **Attaques multiples** : la fiche n'affiche qu'une ligne par arme ; le nombre d'attaques est rappelé dans « À retenir ».
- **Critique amélioré, Héros du champ d'honneur** : rappels, la fiche ne lance pas les dés.
- **Dés de supériorité / psioniques** : la taille du dé change avec le niveau ; elle est écrite dans la description de la ressource et dans « À retenir » (le nom de la ressource reste fixe).

### Termes français
Tous les noms des aptitudes de classe, du Champion, du Chevalier occulte, du Maître de guerre et des manœuvres viennent d'AideDD. Soldat psi : seul le nom de la sous-classe vient d'AideDD ; Pouvoir psionique, Champ protecteur, Frappe psionique, Mouvement télékinétique, Adepte de la télékinésie, Bond psionique, Poussée télékinétique, Esprit protégé sont à vérifier.

## 5. Statut
- 2026-10-15 : niveaux 1 à 10 et 4 sous-classes **faits**, 26 tests automatiques. **À tester par un joueur.**
