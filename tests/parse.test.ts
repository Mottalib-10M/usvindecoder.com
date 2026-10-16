/** Lecture des réponses réelles des API (stockées au build dans samples.json) et rapprochement des noms. */
import { describe, expect, it } from 'vitest';
import S from '../src/data/gen/samples.json';
import { parseVpic, parseRecalls, parseRating, parseEpaVehicle, usDate } from '../src/lib/nhtsa';
import { matchNames } from '../src/lib/engine/match';
import { carInitial } from '../src/lib/initial';
const s = S as any;

describe('vPIC', () => {
  it('F-150 2013 décodé proprement', () => {
    const f = parseVpic(s.car.vpic)!;
    expect([f.year, f.make, f.model, f.clean]).toEqual(['2013', 'Ford', 'F-150', true]);
    expect(f.displacementL).toBe('3.5'); expect(f.drive).toBe('4x2'); expect(f.plant).toMatch(/Dearborn/);
  });
  it('motif moto partiel : Yamaha YZF-R1 2009, VIN incomplet (code 6)', () => { const f = parseVpic(s.moto.vpic)!; expect([f.make, f.model, f.year, f.partial]).toEqual(['Yamaha', 'YZF-R1', '2009', true]); });
});
describe('rappels', () => {
  it('dates de l’API au format jour/mois/année (16V345000 : 24/05/2016 = RCDATE 20160524)', () => { expect(usDate('24/05/2016')).toBe('2016-05-24'); expect(usDate('11/02/2019')).toBe('2019-02-11'); });
  it('2020 Honda CR-V : campagnes uniques, triées de la plus récente', () => {
    const r = parseRecalls(s.recall.json);
    expect(r.length).toBe(new Set(r.map((x) => x.id)).size); expect(r.length).toBeGreaterThan(0);
    for (let i = 1; i < r.length; i++) expect(r[i - 1].date >= r[i].date).toBe(true);
  });
  it('YZF-R1 (vPIC) = YZFR1 (base des rappels)', () => { expect(matchNames(['YZFR6', 'YZFR1', 'redundant YZFR1'], 'YZF-R1')).toEqual(['YZFR1']); expect(s.moto.recalls._model).toBe('YZFR1'); });
  it('nom exact prioritaire sur les variantes', () => { expect(matchNames(['F-150', 'F-150 HYBRID', 'F-150 LIGHTNING BEV'], 'F-150')).toEqual(['F-150']); });
  it('préfixe quand il n’y a pas de nom exact (NCAP)', () => { expect(matchNames(['F-150  REGULAR CAB', 'F-150 SUPER CREW', 'F-250 CREW CAB'], 'F-150')).toEqual(['F-150  REGULAR CAB', 'F-150 SUPER CREW']); });
});
describe('NCAP et EPA', () => {
  it('notes lues en nombres', () => { const r = parseRating(s.ncap.byName[s.ncap.models[0]][0])!; expect(r.id).toBeGreaterThan(0); expect([null, 1, 2, 3, 4, 5]).toContain(r.overall); });
  it('fiche EPA de l’exemple : mpg cohérents', () => {
    const init = carInitial(); expect(init.epa.length).toBeGreaterThan(0);
    for (const v of init.epa) { expect(v.comb).toBeGreaterThan(10); expect(v.city).toBeLessThanOrEqual(v.hwy); }
    expect(parseEpaVehicle({})).toBeNull();
  });
});
