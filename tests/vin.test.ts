/** Moteur VIN (49 CFR 565.15). Valeurs attendues recalculées à la main : somme pondérée puis reste de la division par 11. */
import { describe, expect, it } from 'vitest';
import { computeCheckDigit, checkDigitDetail, validateVin, modelYears, normalizeVin, splitVin, compareVins, region, decodeOffline, YEAR_CODES } from '../src/lib/engine/vin';
import W from '../src/data/gen/wmi.json';

describe('clé de contrôle', () => {
  it('1FTFW1CT5DFC10312 : somme 291, reste 5, clé 5 (valide)', () => {
    const d = checkDigitDetail('1FTFW1CT5DFC10312');
    expect(d.sum).toBe(291); expect(d.remainder).toBe(5); expect(d.expected).toBe('5');
    expect(validateVin('1FTFW1CT5DFC10312').ok).toBe(true);
  });
  it('reste 10 s’écrit X : 1M8GDM9AXKP042788 (somme 351)', () => {
    expect(checkDigitDetail('1M8GDM9AXKP042788').sum).toBe(351);
    expect(computeCheckDigit('1M8GDM9AXKP042788')).toBe('X');
    expect(validateVin('1M8GDM9AXKP042788').ok).toBe(true);
  });
  it('dix-sept « 1 » : somme des poids 89, reste 1', () => { expect(computeCheckDigit('11111111111111111')).toBe('1'); });
  it('2003 Honda 1HGCM82633A004352 : somme 311, clé 3', () => { expect(checkDigitDetail('1HGCM82633A004352').sum).toBe(311); expect(validateVin('1HGCM82633A004352').ok).toBe(true); });
  it('clé fausse détectée : 5YJ3E1EA7KF317000 attend 2, porte 7', () => {
    const v = validateVin('5YJ3E1EA7KF317000');
    expect(v.ok).toBe(false); expect(v.problems).toContain('check-digit'); expect(v.checkExpected).toBe('2'); expect(v.checkFound).toBe('7');
  });
  it('une seule lettre changée casse la clé', () => { expect(validateVin('1FTFW1CT5DFC10313').problems).toContain('check-digit'); });
});

describe('forme', () => {
  it('normalise espaces, tirets, minuscules', () => { expect(normalizeVin(' 1ftfw1ct5-dfc 10312 ')).toBe('1FTFW1CT5DFC10312'); });
  it('I, O, Q interdits, positions signalées', () => {
    const v = validateVin('1FTFW1CT5DFO10312');
    expect(v.problems).toContain('illegal-ioq'); expect(v.badPositions).toEqual([12]); expect(v.complete).toBe(false);
  });
  it('longueur', () => { expect(validateVin('1FTFW1CT5').problems).toContain('short'); expect(validateVin('1FTFW1CT5DFC103121').problems).toContain('long'); expect(validateVin('').problems).toEqual(['empty']); });
  it('découpage WMI / VDS / clé / année / usine / série', () => {
    const p = splitVin('1FTFW1CT5DFC10312');
    expect([p.wmi, p.vds, p.check, p.yearChar, p.plant, p.serial]).toEqual(['1FT', 'FW1CT', '5', 'D', 'F', 'C10312']);
  });
  it('petit constructeur : 9 en 3e position, identifiant sur six caractères', () => {
    const p = splitVin('1Z9ABCDE5F1234567'); expect(p.smallMaker).toBe(true); expect(p.wmiFull).toBe('1Z9234');
  });
});

describe('année-modèle (table VII et règle de la 7e position)', () => {
  it('30 codes, sans I O Q U Z ni 0', () => { expect(YEAR_CODES).toHaveLength(30); expect(/[IOQUZ0]/.test(YEAR_CODES)).toBe(false); });
  it('A = 1980 / 2010, T = 1996 / 2026, V = 2027, 9 = 2009 / 2039', () => {
    expect(modelYears('A')).toEqual([1980, 2010]); expect(modelYears('T')).toEqual([1996, 2026]);
    expect(modelYears('V', 'A')).toEqual([2027]); expect(modelYears('9')).toEqual([2009, 2039]);
  });
  it('7e caractère chiffre = 1980-2009, lettre = 2010-2039', () => { expect(modelYears('D', '1')).toEqual([1983]); expect(modelYears('D', 'C')).toEqual([2013]); });
  it('code invalide', () => { expect(modelYears('U')).toEqual([]); expect(modelYears('0')).toEqual([]); });
});

describe('lecture hors ligne', () => {
  const T = (W as any).wmi;
  it('F-150 2013 : Ford, États-Unis, camion', () => {
    const d = decodeOffline('1FTFW1CT5DFC10312', T);
    expect(d.years).toEqual([2013]); expect(d.wmi?.make).toBe('Ford'); expect(d.wmi?.country).toBe('United States'); expect(d.wmi?.type).toBe('truck');
  });
  it('régions SAE', () => { expect(region('J')).toBe('Asia'); expect(region('W')).toBe('Europe'); expect(region('3')).toMatch(/Mexico/); expect(region('5')).toBe('United States'); });
  it('comparaison de deux copies : 5 et S sont une paire trompeuse', () => {
    const r = compareVins('1FTFW1CT5DFC10312', '1FTFW1CTSDFC10312');
    expect(r.same).toBe(false); expect(r.diffs).toEqual([{ pos: 9, a: '5', b: 'S', lookalike: true }]);
    expect(compareVins('1FTFW1CT5DFC10312', '1ftfw1ct5dfc10312').same).toBe(true);
  });
});
