# Étude SERP : décodeur VIN gratuit, États-Unis (idée A10, 2026-10-15)

Volumes (Keyword Planner, objetech, 2026-10-15, `reports/etude-niches-2026-10-15-volumes-KP.txt`) : ~1,74 M recherches/mois US sur la liste fermée de 27 requêtes ; `vin decoder`, `vin lookup`, `vin check` 100 k – 1 M chacune ; `nhtsa recall lookup`, `free vin check` 10 k – 100 k. Fichier repris dans `us-vin-volumes.txt` (5 requêtes consignées, 1 011 929). AU ~391 k et CA ~138 k mesurés (marchés anglophones voisins, non ciblés par ce site).

## Top 10 de « vin decoder » / « free vin check » et défaut de chacun

| Site | Catégorie | Ce qu'il fait | Défaut constaté | Ce que nous faisons mieux |
|---|---|---|---|---|
| nhtsa.gov/vin-decoder, vpic.nhtsa.dot.gov | BLOQUÉ (administration) | décodage brut vPIC | aucun lien vers rappels, NCAP et EPA sur le même écran ; interface de base de données | les quatre sources fédérales sur une fiche, lecture hors ligne immédiate |
| vinaudit.com/vin-decoder | DÉFENDU (vendeur de rapports) | décodage gratuit + « recall and sale-listing counts » | « Need a deeper look? Upgrade to a full vehicle history report » : le gratuit sert à vendre | rien à acheter ; on dit ce qu'aucun outil gratuit ne peut donner et on renvoie à NMVTIS (source officielle) |
| bumper.com/vin-check | DÉFENDU | « Free VIN Check » | gratuit limité à « factory specs, NHTSA recall status », le reste sur abonnement sans prix affiché | rappels détaillés + NCAP + EPA gratuits |
| epicvin.com | DÉFENDU | rapport | « Starting from $1 » avec « a trial subscription » | aucun paiement, aucun compte |
| clearvin.com/en/decoder | DÉFENDU | décodeur | compte demandé | aucun compte |
| faxvin.com/vin-decoder | DÉFENDU | décodage gratuit | incitation permanente au rapport payant | aucune incitation |
| vincheck.info | CLONE (gratuit, publicité) | décodeur, rapport « gratuit » via VinAudit | promet « full vehicle history reports for free », ce qu'aucune source publique ne permet (titres = NMVTIS payant) ; ni NCAP ni EPA nommés | limites dites franchement ; NCAP par version, EPA avec coût annuel recalculé |
| carfax.com | BLOQUÉ (marque) | rapport payant | payant | complémentaire : on renvoie à NMVTIS pour l'historique |
| nicb.org/vincheck | BLOQUÉ (organisme) | vols et pertes totales | pas de fiche technique ni rappels | lien vers NICB pour ce qu'il couvre |
| sites « vindecoder.* » de contenu (403 aux robots) | PRENABLE | guides | texte sans simulateur, pas de données datées | un mini-simulateur sur chaque guide |

SERP saturé mais **pas imprenable** (vincheck.info, indépendant, se classe). Décision §2.1 : volume > 300 000, GO à condition de faire mieux que le meilleur clone sur chaque page.

## Pourquoi ce site fait mieux que le premier résultat

1. **Quatre sources fédérales sur une fiche** (vPIC, rappels NHTSA, NCAP, EPA), interrogées directement par le navigateur : aucun serveur, aucune donnée gardée.
2. **Actif de données** : le fichier officiel des rappels NHTSA relu chaque semaine (13 663 campagnes véhicule depuis 2010), croisé par marque × année de réception × composant, et par modèle × année-modèle avec NCAP et EPA : 18 pages marque, 16 pages modèle, chiffres introuvables ailleurs (ex. Ford 135 campagnes en 2025 contre 60 en 2024 ; caméras de recul 1 → 61 campagnes de 2016 à 2025).
3. **Honnêteté** : ce qu'un décodeur gratuit ne peut pas donner (historique de titre, accidents, compteur) est dit sur chaque résultat, avec la source officielle NMVTIS.
4. **Un simulateur partout** : décodeur, rappels, NCAP, consommation, clé de contrôle, sticker, moto ; mini-simulateur sur chaque guide (règle des 15 ans, kilométrage, renversement, codes d'année, comparateur de VIN…).

## Leads
Le secteur est tenu par des vendeurs de rapports (leads/abonnements) : frein lourd (§2.3), accepté car volume > 1 M et au moins trois places tenues par des sites sans vente directe (nhtsa.gov, nicb.org, vincheck.info).

## Passe qualité du 2026-10-16 (brief BRIEF-QUALITE-2026-10-16)

- **Dates des rappels** : l'API Recalls écrit JOUR/MOIS/ANNÉE (« 24/05/2016 » = RCDATE 20160524 du fichier officiel, vérifié sur 10 campagnes) ; le site lisait mois/jour : toutes les dates de rappel affichées étaient fausses ou invalides (« 2016-24-05 »). Corrigé et testé.
- **Rapprochement des noms vPIC / rappels / NCAP / EPA** (limite levée) : codes de version tirés de la finition (C-Class + C300 → « C 300 », « C300 » ; RX + 350 → « RX350 »), réunion des campagnes de tous les noms, série pour NCAP (330i → « 3 SERIES »), versions NCAP de même transmission en premier, noms EPA notés contre transmission, portes, carrosserie, hybride, cylindrée et finition. Sonde `scripts/data/probe-matching.mjs` sur 24 VIN réels de 20 modèles : rappels 21 → 23 (le 24e, CX-5 2020, n'a aucun rappel dans le fichier), NCAP 22 → 24, EPA 22 → 24 ; et des rapprochements faux corrigés (Civic 4 portes → « Civic 4Dr » au lieu de « 2Dr », Rogue ≠ Rogue Sport, X5 xDrive40i ≠ X5 M, Grand Cherokee Laredo ≠ SRT, Camry SE 4x2 ≠ AWD, Accord 1,5 L ≠ 2.0T). Une 2019 C300 affichait 0 rappel : 17 désormais (17 au fichier officiel).
- **Guides relus à la source** : Takata (page NHTSA via web.archive.org du 2026-09-18 : 67 millions d'airbags, 19 constructeurs, 28 morts, liste ne pas conduire, avis du fichier officiel), NCAP (page nhtsa.gov/ratings : 1978/1993, ±250 lb, barrière 3 015 lb à 38,5 mph, poteau 20 mph 75°, facteur de stabilité ; bandes de renversement vérifiées sur 762 versions ; plages de risque par carrosserie recalculées sur les données au lieu d'ordres de grandeur écrits de mémoire), 49 CFR 565.13/565.15 (eCFR), 580.17 (eCFR), 49 U.S.C. 30120(g) et 30502, 40 CFR 85.2304, NICB VINCheck (5 recherches/24 h), fueleconomy.gov.
- Téléphone : tableau NCAP lisible (chiffre + étoile), repères du ruban VIN en clair, colonnes de tableau sans coupure en milieu de mot.
