/** Coût de carburant et rapprochement EPA. Résultats recalculés à la main. */
import { describe, expect, it } from 'vitest';
import { annualFuel, annualElectric, combinedMpg, mpgSavings, matchEpaModels, matchEpaOptions, driveWords } from '../src/lib/engine/fuel';
import S from '../src/data/gen/samples.json';

describe('coût annuel', () => {
  it('15 000 mi à 30 mpg et 4 $ : 500 gal, 2 000 $', () => { const r = annualFuel({ miles: 15000, mpg: 30, price: 4 }); expect(r.gallons).toBe(500); expect(r.cost).toBe(2000); expect(r.perMile).toBeCloseTo(0.1333, 4); });
  it('15 → 20 mpg à 15 000 mi et 4,33 $ : 250 gal, 1 082,50 $', () => { const r = mpgSavings(15000, 4.33, 15, 20); expect(r.gallonsSaved).toBe(250); expect(r.diff).toBeCloseTo(1082.5, 6); });
  it('40 → 50 mpg : 75 gal seulement', () => { expect(mpgSavings(15000, 4.33, 40, 50).gallonsSaved).toBeCloseTo(75, 9); });
  it('électrique : 28 kWh/100 mi, 15 000 mi, 0,15 $ : 4 200 kWh, 630 $', () => { const r = annualElectric(15000, 28, 0.15); expect(r.kwh).toBe(4200); expect(r.cost).toBeCloseTo(630, 9); });
  it('mpg nul : pas de division par zéro', () => { expect(annualFuel({ miles: 15000, mpg: 0, price: 4 }).cost).toBe(0); });
  it('mixte EPA 55/45 : 20 ville et 30 route donnent 23,53', () => { expect(combinedMpg(20, 30)).toBeCloseTo(1 / (0.55 / 20 + 0.45 / 30), 9); expect(combinedMpg(20, 30)).toBeCloseTo(23.53, 2); });
});
describe('rapprochement vPIC → EPA', () => {
  const models = (S as any).car.epa.models as string[];
  it('F-150 4x2 → F150 Pickup 2WD (+ FFV)', () => { expect(matchEpaModels(models, 'F-150', '4x2')).toEqual(['F150 Pickup 2WD', 'F150 Pickup 2WD FFV']); });
  it('transmission', () => { expect(driveWords('4WD/4-Wheel Drive/4x4')[0]).toBe('4WD'); expect(driveWords('AWD/All-Wheel Drive')[0]).toBe('AWD'); });
  it('3,5 L 6 cylindres : écarte le V8 6,2 L', () => {
    const opts = (S as any).car.epa.options['F150 Pickup 2WD'];
    expect(matchEpaOptions(opts, 3.5, 6).map((o: any) => o.text)).toEqual(['Auto (S6), 6 cyl, 3.5 L, Turbo', 'Auto 6-spd, 6 cyl, 3.5 L, Turbo']);
  });
});
