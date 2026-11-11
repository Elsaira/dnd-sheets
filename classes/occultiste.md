# Occultiste (Warlock)

Fichier du module : `modules/classes/warlock.js`. Source : SRD 5.2 (règles 2024).

## 1. Ressources et récupération
| Ressource | Maximum | Récupération |
|---|---|---|
| Emplacements de Magie de pacte | 1 (niv. 1), 2 (niv. 2 à 10) ; niveau d'emplacement 1 → 5 | Repos court ou long |
| Rouerie magique (niv. 2) | 1 | Repos long |
| Communication avec le protecteur (niv. 9) | 1 lancer gratuit de Contact avec les plans | Repos long |
| Chance du Ténébreux (Fiélon, niv. 6) | Mod. de Charisme (min. 1) | Repos long |
| Sorts gratuits des manifestations (Don des profondeurs) | 1 | Repos long |
| Foulée des fées (Archifée, niv. 3) | Mod. de Charisme (min. 1) | Repos long |
| Charmantes défenses (Archifée, niv. 10) | 1 | Repos long, ou en dépensant un emplacement de pacte |
| Lumière guérisseuse (Céleste, niv. 3) | 1 + niveau d'occultiste (en d6) | Repos long |
| Combattant clairvoyant (Grand Ancien, niv. 6) | 1 | Repos court ou long, ou en dépensant un emplacement de pacte |

Les emplacements de pacte sont suivis à part des emplacements « normaux » (utile en multiclassage).

## 2. Aptitudes par niveau et impact sur la fiche
| Niv. | Aptitude | Ce que la fiche fait |
|---|---|---|
| 1 | Manifestations occultes (1) | Choix dans la liste, prérequis vérifiés, manifestations affichées dans Aptitudes |
| 1 | Magie de pacte | DD et attaque de sort (Charisme), 2 tours de magie, 2 sorts préparés, 1 emplacement niv. 1 |
| 2 | Manifestations (3), Rouerie magique | Compteur d'Rouerie magique |
| 3 | Sous-classe | Choix du protecteur ; emplacements niv. 2 ; 4 sorts préparés |
| 4 | Amélioration de caractéristique | Choix d'un don (général ou d'origine) ; 3 tours de magie ; 5 sorts |
| 5 | Manifestations (5) | Emplacements niv. 3 ; 6 sorts ; Décharge occulte à 2 rayons |
| 6 | Aptitude de sous-classe | 7 sorts |
| 7 | Manifestations (6) | Emplacements niv. 4 ; 8 sorts |
| 8 | Amélioration de caractéristique | 9 sorts |
| 9 | Manifestations (7), Communication avec le protecteur | Emplacements niv. 5 ; 10 sorts |
| 10 | Aptitude de sous-classe | 4 tours de magie |
| 11–20 | Arcanum mystique, etc. | **Pas encore géré** (hors périmètre 1–10) |

## 3. Sous-classes prises en charge
- **Protecteur fiélon** (Fiend Patron, SRD) : sorts toujours préparés par niveau, Bénédiction du Ténébreux (PV temporaires calculés), Chance du Ténébreux (compteur), Résistance fiélonne (résistance choisie, à changer après chaque repos).
- **Protecteur Archifée** (Archfey Patron, PHB 2024, `modules/classes/warlock-archfey.js`) : sorts toujours préparés, Foulée des fées (compteur = mod. de Charisme, action avec DD), Échappatoire brumeuse (réaction), Charmantes défenses (compteur, réaction, immunité Charmé en rappel). Vérifié sur AideDD le 2026-10-15 (noms corrigés : l'ancienne saisie de mémoire disait « Pas féeriques », « Évasion brumeuse », « Défenses envoûtantes »). C'est le protecteur de l'occultiste de Plouf.
- **Protecteur Céleste** (Celestial Patron, PHB 2024, `modules/classes/warlock-celestial.js`) : sorts toujours préparés (dont les tours de magie Lumière et Flamme sacrée), Lumière guérisseuse (réserve de 1 + niveau d6, action bonus, max de dés par soin affiché), Âme radiante (résistance radiant + rappel du bonus de Charisme), Résilience céleste (PV temporaires calculés, en rappel).
- **Protecteur Grand Ancien** (Great Old One Patron, PHB 2024, `modules/classes/warlock-great-old-one.js`) : Esprit éveillé (action bonus, portée et durée calculées), sorts toujours préparés, Sorts psychiques (rappel), Combattant clairvoyant (compteur, repos court), Maléfice occulte (Maléfice toujours préparé + rappel), Bouclier mental (résistance psychique + rappel).
- Les sorts propres à ces protecteurs (17 sorts) sont dans `modules/spells/warlock-subclasses.js`, relevés sur AideDD.

## 4. Cas particuliers et décisions
- **Décharge occulte** : affichée en nombre de rayons (2 au niv. 5, 3 au 11, 4 au 17). Décharge déchirante ajoute le Charisme à chaque rayon, sur le tour de magie choisi.
- **Pacte de la chaîne** : Appel de familier est marqué « à volonté » ; une carte Familier apparaît dans l'onglet Combat avec choix de la forme, CA, PV (suivis séparément), vitesse et un lien vers la fiche complète de la créature sur AideDD (statistiques et sorts exacts). CA et PV pré-remplis, modifiables sur la fiche. Investiture du maître de la chaîne ajoute ses effets sur la carte, avec votre DD.
- **Pacte de la lame** : cocher « Pacte » sur l'arme dans l'inventaire ; elle devient maîtrisée et utilise le Charisme s'il est meilleur.
- **Pacte du grimoire** : tours de magie et rituels choisis parmi le catalogue (qui ne contient pour l'instant que les sorts déjà saisis) ; sinon, sort personnalisé.
- **Armure des ombres** : la CA « Armure de mage » (13 + Dex) est prise en compte automatiquement sans armure.
- **Manifestations répétables** (Décharge déchirante, Lance occulte, Leçons des Premiers…) : une seule fois pour l'instant.
- **Prérequis** : vérifiés au moment du choix (niveau, pacte requis). Une manifestation déjà choisie dont le prérequis n'est plus rempli (après une baisse de niveau) n'est pas retirée automatiquement.
- **Rouerie magique** : simple compteur ; les emplacements récupérés se rendent à la main avec les pastilles.
- Manifestations des niveaux 12+ (Lame dévorante, Vision de sorcière…) non saisies.

- **Résilience céleste** : les PV temporaires ne sont pas ajoutés automatiquement au repos (le moteur ne sait que rendre l'Inspiration héroïque au repos) ; la valeur est affichée en rappel, à saisir dans PV temporaires.
- **Sorts psychiques**, **Âme radiante** (bonus aux dégâts) et **Maléfice occulte** : rappels seulement, car ce sont des choix faits au moment du lancer.

### Termes français
Vérifiés sur AideDD le 2026-10-15 : tous les noms des sous-classes Archifée, Céleste et Grand Ancien.
Noms alignés sur AideDD le 2026-10-15 dans `warlock.js` : Rouerie magique (ex-Astuce magique), Communication avec le protecteur (ex-Contacter le protecteur), Résistance fiélonne (ex-Résilience fiélonne), Traversée des enfers (ex-Projection infernale).
Confirmés aussi : Bénédiction et Chance du Ténébreux. Encore à vérifier : les noms des manifestations (Pas ascendant, Esprit occulte, Regard des deux esprits, Investiture du maître de la chaîne, Leçons des Premiers, Masque aux mille visages, Maître des formes multiples, Uni aux ombres, Bond d'outre-monde, etc.). Les noms de sorts ont été vérifiés sur AideDD le 2026-10-15.

- **Sorts à niveau supérieur (2026-10-24)** : tous les emplacements de pacte ont le même niveau, donc la fiche calcule l'effet amélioré des sorts d'Occultiste lancés au-dessus de leur niveau. Exemples au niveau 3 (emplacements niv. 2) : Maléfice dure jusqu'à 4 heures (8 heures avec emplacements niv. 3 et 4, 24 heures au niv. 5), Représailles infernales 3d10, Armure d'Agathys 10 PV temporaires, Trait ensorcelé 3d12. Le lancement gratuit d'un don (Affinité féerique) reste au niveau du sort, c'est précisé sur la ligne. Données : `data/spell-upcast.js` (texte AideDD).

- **Couleur d'accent** de la classe : violet `#6b3fa0` (modifiable dans Options).
- Charmantes défenses (Archifée, niv. 10) : ◆ immunité Charmé dans l'encart États. Pacte de la lame : la note « À retenir » décrit l'arme ; la consigne « cochez Pacte dans l'Inventaire » est dans la description de l'aptitude (2026-10-24).

## 5. Statut
**En cours** : niveaux 1 à 10 écrits et testés automatiquement (177 vérifications pour tout le projet) et dans le navigateur. **À tester par un joueur.**
