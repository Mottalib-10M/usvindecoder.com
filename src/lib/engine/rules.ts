/** Règles fédérales chiffrées (params-2026.json), fonctions pures testées dans tests/rules.test.ts. */
import P from '../../data/params-2026.json';

/**
 * Réparation gratuite d'un rappel (49 U.S.C. 30120(g)(1)) : due sauf si le premier acquéreur a acheté
 * le véhicule plus de 15 années civiles (pneu : 5) avant l'avis du défaut. On compte en années civiles.
 */
export function freeRemedy(firstSaleYear: number, noticeYear: number, tire = false): { free: boolean; years: number; limit: number; lastFreeNoticeYear: number } {
  const limit = tire ? P.remedy.tireYears : P.remedy.freeYears;
  const years = noticeYear - firstSaleYear;
  return { free: years <= limit, years, limit, lastFreeNoticeYear: firstSaleYear + limit };
}

/**
 * Déclaration du kilométrage à la revente (49 CFR 580.17) : exemption à partir du 1er janvier de
 * l'année « année-modèle + 10 » jusqu'à l'AM 2010, « + 20 » à partir de l'AM 2011.
 */
export function odometerDisclosure(modelYear: number, transferYear: number): { required: boolean; exemptFrom: number; rule: 10 | 20 } {
  const rule = (modelYear >= P.odometer.firstModelYearNewRule ? P.odometer.yearsNewRule : P.odometer.yearsOldRule) as 10 | 20;
  const exemptFrom = modelYear + rule;
  return { required: transferYear < exemptFrom, exemptFrom, rule };
}

/** Étoiles de renversement NCAP selon le risque calculé (0,093 = 9,3 %). */
export function rolloverStars(risk: number): number {
  const b = P.ncap.rolloverBands;
  if (!(risk >= 0)) return 0;
  if (risk < b[0]) return 5;
  if (risk < b[1]) return 4;
  if (risk < b[2]) return 3;
  if (risk < b[3]) return 2;
  return 1;
}

/** La recherche de rappels par VIN de la NHTSA couvre les 15 dernières années civiles. */
export function inNhtsaVinWindow(modelYear: number, currentYear: number): boolean {
  return currentYear - modelYear <= P.lookup.nhtsaVinYears;
}
