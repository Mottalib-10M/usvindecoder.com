/** Règles fédérales : 49 U.S.C. 30120(g), 49 CFR 580.17, bandes NCAP. Cas aux bornes, calculés à la main. */
import { describe, expect, it } from 'vitest';
import { freeRemedy, odometerDisclosure, rolloverStars, inNhtsaVinWindow } from '../src/lib/engine/rules';

describe('réparation gratuite (15 ans, pneus 5 ans)', () => {
  it('vendu 2012, avis 2026 : 14 ans, gratuit', () => { expect(freeRemedy(2012, 2026)).toEqual({ free: true, years: 14, limit: 15, lastFreeNoticeYear: 2027 }); });
  it('borne : 15 ans pile encore gratuit, 16 ans non', () => { expect(freeRemedy(2011, 2026).free).toBe(true); expect(freeRemedy(2010, 2026).free).toBe(false); });
  it('pneu : 5 ans gratuit, 6 ans non', () => { expect(freeRemedy(2021, 2026, true).free).toBe(true); expect(freeRemedy(2020, 2026, true).free).toBe(false); });
});
describe('déclaration de kilométrage (580.17)', () => {
  it('AM 2010 : exempt à partir de 2020', () => { expect(odometerDisclosure(2010, 2019).required).toBe(true); expect(odometerDisclosure(2010, 2020)).toEqual({ required: false, exemptFrom: 2020, rule: 10 }); });
  it('AM 2011 : obligatoire jusqu’en 2030, exempt en 2031', () => { expect(odometerDisclosure(2011, 2030).required).toBe(true); expect(odometerDisclosure(2011, 2031).required).toBe(false); });
  it('AM 2016 vendu en 2026 : obligatoire, exempt en 2036', () => { expect(odometerDisclosure(2016, 2026)).toEqual({ required: true, exemptFrom: 2036, rule: 20 }); });
});
describe('étoiles de renversement', () => {
  it('9,3 % = 5 ; 10 % = 4 ; 19,9 % = 4 ; 25 % = 3 ; 35 % = 2 ; 41 % = 1', () => {
    expect([0.093, 0.1, 0.199, 0.25, 0.35, 0.41].map(rolloverStars)).toEqual([5, 4, 4, 3, 2, 1]);
  });
  it('fenêtre de 15 ans de la recherche NHTSA', () => { expect(inNhtsaVinWindow(2011, 2026)).toBe(true); expect(inNhtsaVinWindow(2010, 2026)).toBe(false); });
});
