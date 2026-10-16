/**
 * Rapprochement des noms entre vPIC, rappels, NCAP et EPA. Les listes de noms viennent des réponses
 * réelles des API lues le 2026-10-16 (scripts/data/probe-matching.mjs, 24 VIN de 20 modèles courants).
 */
import { describe, expect, it } from 'vitest';
import { versionCodes, recallCandidates } from '../src/lib/engine/match';
import { matchEpaModels, scoreEpaName } from '../src/lib/engine/fuel';
import { mergeRecalls, namesLabel, rankRatings, fitsDisplacement } from '../src/lib/lookup';
import type { RecallRow, Rating } from '../src/lib/nhtsa';

describe('codes de version', () => {
  it('Mercedes C-Class + C300 → C300 et C 300', () => { expect(versionCodes('C-Class', 'C300')).toEqual(['C300', 'C 300']); });
  it('GLE350-4M : le suffixe 4MATIC tombe', () => { expect(versionCodes('GLE-Class', 'GLE350-4M')).toEqual(['GLE350', 'GLE 350']); });
  it('Lexus RX + « 350 Standard » → RX350', () => { expect(versionCodes('RX', '350 Standard')).toEqual(['RX350', 'RX 350']); });
  it('AMG gardé', () => { expect(versionCodes('C-Class', 'AMG C43')).toContain('AMG C43'); });
  it('finitions sans code : rien', () => { expect(versionCodes('Equinox', 'LT (1LT)')).toEqual([]); expect(versionCodes('F-150', 'XLT')).toEqual([]); expect(versionCodes('X5', 'xDrive40i')).toEqual([]); });
  it('code égal au modèle écarté', () => { expect(versionCodes('Q5', 'Q5')).toEqual([]); });
  it('rappels : Silverado + série 1500', () => { expect(recallCandidates('Silverado', 'LT', '1500')).toEqual(['Silverado', 'Silverado 1500']); });
});

describe('réunion des rappels', () => {
  const r = (id: string, date: string) => ({ id, date }) as RecallRow;
  it('une campagne une fois, plus récente d’abord', () => {
    expect(mergeRecalls([[r('19V540000', '2019-07-20'), r('18V850000', '2018-12-05')], [r('19V540000', '2019-07-20'), r('20V449000', '2020-07-28')]]).map((x) => x.id)).toEqual(['20V449000', '19V540000', '18V850000']);
  });
  it('libellé sans doublon d’écriture', () => { expect(namesLabel(['C 300', 'C300'])).toBe('C 300'); expect(namesLabel(['RX', 'RX350'])).toBe('RX / RX350'); });
});

describe('versions EPA', () => {
  const camry = ['Camry', 'Camry AWD LE/SE', 'Camry AWD XLE/XSE', 'Camry Hybrid LE', 'Camry Hybrid XLE/SE', 'Camry LE/SE', 'Camry TRD', 'Camry XLE/XSE', 'Camry XSE'];
  it('2020 Camry SE 4x2 → Camry LE/SE (ni AWD ni hybride)', () => { expect(matchEpaModels(camry, 'Camry', '4x2', { trim: 'SE', doors: '4', body: 'Sedan/Saloon' })).toEqual(['Camry LE/SE']); });
  it('2019 Civic berline 4 portes → Civic 4Dr', () => { expect(matchEpaModels(['Civic 2Dr', 'Civic 4Dr', 'Civic 5Dr'], 'Civic', '4x2', { doors: '4', body: 'Sedan/Saloon' })).toEqual(['Civic 4Dr']); });
  it('2020 Rogue → Rogue AWD, pas Rogue Sport', () => { expect(matchEpaModels(['Rogue AWD', 'Rogue FWD', 'Rogue Sport', 'Rogue Sport AWD'], 'Rogue', '4WD/4-Wheel Drive/4x4')).toEqual(['Rogue AWD']); });
  it('2019 Grand Cherokee Laredo 4WD → pas SRT ni Trackhawk', () => { expect(matchEpaModels(['Cherokee 4WD', 'Grand Cherokee 2WD', 'Grand Cherokee 4WD', 'Grand Cherokee SRT 4WD', 'Grand Cherokee Trackhawk 4WD'], 'Grand Cherokee', '4WD/4-Wheel Drive/4x4', { trim: 'Laredo' })).toEqual(['Grand Cherokee 4WD']); });
  it('2020 X5 xDrive40i → X5 xDrive40i, pas X5 M', () => { expect(matchEpaModels(['X5 M', 'X5 M Competition', 'X5 M50i', 'X5 sDrive40i', 'X5 xDrive40i', 'X5 xDrive50i'], 'X5', 'AWD/All-Wheel Drive', { trim: 'xDrive40i' })).toEqual(['X5 xDrive40i']); });
  it('2019 RX 350 4WD → RX 350 AWD, pas RX 350 L', () => { expect(matchEpaModels(['RX 350', 'RX 350 AWD', 'RX 350 L', 'RX 350 L AWD', 'RX 450h AWD', 'RX 450h L AWD'], 'RX', '4WD/4-Wheel Drive/4x4', { trim: '350 Standard' })).toEqual(['RX 350 AWD']); });
  const merc = ['AMG C43 4matic', 'C300', 'C300 4matic', 'C300 4matic Convertible', 'C300 4matic Coupe', 'C300 Convertible', 'C300 Coupe', 'GLE350', 'GLE350 4matic'];
  it('2019 C-Class C300 RWD berline → C300 (par le code de version)', () => { expect(matchEpaModels(merc, 'C-Class', 'RWD/Rear-Wheel Drive', { trim: 'C300', doors: '4', body: 'Sedan/Saloon' }, ['C300', 'C 300'])).toEqual(['C300']); });
  it('2020 GLE350-4M, transmission vide → GLE350 4matic', () => { expect(matchEpaModels(merc, 'GLE-Class', '', { trim: 'GLE350-4M' }, ['GLE350', 'GLE 350'])).toEqual(['GLE350 4matic']); });
  it('cylindrée dans le nom : Accord 1,5 L ne prend pas 2.0T', () => { expect(scoreEpaName('Accord 2.0T Sport/Touring', 'Accord', '4x2', { trim: 'Sport', displacementL: '1.5' })).toBeLessThan(scoreEpaName('Accord', 'Accord', '4x2', { trim: 'Sport', displacementL: '1.5' })); });
  it('moteur EPA de même cylindrée', () => { expect(fitsDisplacement('Auto (S6), 6 cyl, 3.5 L, Turbo', 3.5)).toBe(true); expect(fitsDisplacement('Auto 10-spd, 8 cyl, 5 L', 3.5)).toBe(false); expect(fitsDisplacement('Auto (A1)', undefined)).toBe(true); });
});

describe('versions NCAP', () => {
  const r = (desc: string) => ({ desc }) as Rating;
  it('2020 Camry 4x2 : FWD avant AWD, AWD écarté', () => { expect(rankRatings([r('2020 Toyota CAMRY 4 DR AWD'), r('2020 Toyota CAMRY 4 DR FWD')], { drive: '4x2', doors: '4', trim: 'SE' }).map((x) => x.desc)).toEqual(['2020 Toyota CAMRY 4 DR FWD']); });
  it('transmission inconnue : tout gardé dans l’ordre', () => { expect(rankRatings([r('A 4 DR AWD'), r('B 4 DR FWD')], { drive: '', doors: '', trim: '' }).length).toBe(2); });
});
