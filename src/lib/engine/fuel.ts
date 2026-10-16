/**
 * Coût de carburant annuel et rapprochement VIN -> fiche EPA. Fonctions pures (tests/fuel.test.ts).
 * L'EPA publie mpg ville / route / mixte et, pour un électrique, kWh aux 100 miles ; le coût se
 * calcule ici avec le kilométrage et le prix que saisit le visiteur.
 */

export interface FuelInput { miles: number; mpg: number; price: number }
/** Gallons et dollars par an pour un véhicule thermique ou hybride. */
export function annualFuel({ miles, mpg, price }: FuelInput): { gallons: number; cost: number; perMile: number } {
  if (!(mpg > 0) || !(miles >= 0)) return { gallons: 0, cost: 0, perMile: 0 };
  const gallons = miles / mpg;
  const cost = gallons * price;
  return { gallons, cost, perMile: miles > 0 ? cost / miles : price / mpg };
}

/** Électrique : kWh aux 100 miles (combE de l'EPA) x prix du kWh. */
export function annualElectric(miles: number, kwhPer100: number, pricePerKwh: number): { kwh: number; cost: number } {
  if (!(kwhPer100 > 0) || !(miles >= 0)) return { kwh: 0, cost: 0 };
  const kwh = (miles * kwhPer100) / 100;
  return { kwh, cost: kwh * pricePerKwh };
}

/** mpg mixte pondéré comme l'EPA : moyenne harmonique de la ville et de la route (55 % / 45 % par défaut). */
export function combinedMpg(city: number, hwy: number, cityShare = 0.55): number {
  if (!(city > 0) || !(hwy > 0)) return 0;
  return 1 / (cityShare / city + (1 - cityShare) / hwy);
}

/** Écart annuel entre deux consommations, sur le même kilométrage et le même prix. */
export function mpgSavings(miles: number, price: number, mpgA: number, mpgB: number): { costA: number; costB: number; diff: number; gallonsSaved: number } {
  const a = annualFuel({ miles, mpg: mpgA, price }); const b = annualFuel({ miles, mpg: mpgB, price });
  return { costA: a.cost, costB: b.cost, diff: a.cost - b.cost, gallonsSaved: a.gallons - b.gallons };
}

const norm = (s: string) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Transmission vPIC (« 4x2 », « AWD », « 4WD/4-Wheel Drive/4x4 ») -> mots EPA. */
export function driveWords(drive: string): string[] {
  const d = (drive || '').toUpperCase();
  if (/AWD|ALL[- ]WHEEL/.test(d)) return ['AWD', '4WD'];
  if (/4X4|4WD|4-WHEEL|FOUR/.test(d)) return ['4WD', 'AWD'];
  if (/FWD|FRONT/.test(d)) return ['FWD', '2WD'];
  if (/RWD|REAR/.test(d)) return ['RWD', '2WD'];
  if (/4X2|2WD/.test(d)) return ['2WD', 'RWD', 'FWD'];
  return [];
}

/**
 * Modèles EPA d'une année et d'une marque qui correspondent au modèle vPIC : même nom à la
 * ponctuation près (« F-150 » = « F150 Pickup 2WD »), puis même transmission quand elle est connue.
 */
export function matchEpaModels(epaModels: string[], vpicModel: string, vpicDrive = ''): string[] {
  const target = norm(vpicModel);
  if (!target) return [];
  let hits = epaModels.filter((m) => norm(m).startsWith(target));
  if (!hits.length) hits = epaModels.filter((m) => norm(m).includes(target));
  const words = driveWords(vpicDrive);
  if (words.length && hits.length > 1) {
    for (const w of words) {
      const byDrive = hits.filter((m) => new RegExp(`\\b${w}\\b`, 'i').test(m));
      if (byDrive.length) { hits = byDrive; break; }
    }
  }
  return hits;
}

/** Options EPA (« Auto (S6), 6 cyl, 3.5 L, Turbo ») compatibles avec la cylindrée et les cylindres vPIC. */
export function matchEpaOptions(options: Array<{ text: string; value: string }>, displacementL?: number, cylinders?: number): Array<{ text: string; value: string }> {
  let out = options;
  if (displacementL && displacementL > 0) {
    const d = Math.round(displacementL * 10) / 10;
    const byD = out.filter((o) => { const m = o.text.match(/(\d+(?:\.\d+)?)\s*L\b/); return m ? Math.abs(Number(m[1]) - d) < 0.051 : false; });
    if (byD.length) out = byD;
  }
  if (cylinders && cylinders > 0) {
    const byC = out.filter((o) => new RegExp(`\\b${cylinders} cyl\\b`).test(o.text));
    if (byC.length) out = byC;
  }
  return out;
}
