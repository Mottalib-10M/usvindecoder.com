/**
 * Notes NCAP d'avant 2011 : réponses réelles de l'API SafetyRatings de la NHTSA, lues le 2026-10-31
 * (https://api.nhtsa.gov/SafetyRatings/VehicleId/5700 et /4738, champs utiles recopiés).
 * L'ancien protocole n'a pas de note globale : les étoiles sont par test (audit du 2026-10-28).
 */
import { describe, expect, it } from 'vitest';
import { parseRating } from '../src/lib/nhtsa';

const malibu2010 = { Results: [{ OverallRating: 'Not Rated', OverallFrontCrashRating: 'Not Rated', FrontCrashDriversideRating: '5', FrontCrashPassengersideRating: '5', OverallSideCrashRating: 'Not Rated', SideCrashDriversideRating: '5', SideCrashPassengersideRating: '5', RolloverRating: 'Not Rated', RolloverRating2: '4', RolloverPossibility: 0.0, RolloverPossibility2: 0.109, ComplaintsCount: 1365, RecallsCount: 4, InvestigationCount: 0, VehicleDescription: '2010 Chevrolet Malibu 4-DR w/SAB', VehicleId: 5700 }] };
const accord2003 = { Results: [{ OverallRating: 'Not Rated', OverallFrontCrashRating: 'Not Rated', FrontCrashDriversideRating: '5', FrontCrashPassengersideRating: '5', OverallSideCrashRating: 'Not Rated', SideCrashDriversideRating: 'Not Rated', SideCrashPassengersideRating: 'Not Rated', RolloverRating: 'Not Rated', RolloverRating2: '4', RolloverPossibility: 0.0, RolloverPossibility2: 0.0, VehicleDescription: '2003 Honda Accord 4-DR. w/SAB', VehicleId: 4738 }] };
const f150_2013 = { Results: [{ OverallRating: '4', OverallFrontCrashRating: '4', FrontCrashDriversideRating: '4', FrontCrashPassengersideRating: '3', OverallSideCrashRating: '5', SideCrashDriversideRating: '5', SideCrashPassengersideRating: 'Not Rated', RolloverRating: '4', RolloverRating2: 'Not Rated', RolloverPossibility: 0.198, RolloverPossibility2: 0.0, VehicleDescription: '2013 Ford F-150 Regular Cab PU/RC 4x2', VehicleId: 7339 }] };

describe('NCAP avant 2011 (étoiles par test)', () => {
  it('2010 Malibu : frontal 5/5, latéral 5/5, retournement 4 (RolloverRating2), risque 10,9 %', () => {
    const r = parseRating(malibu2010)!;
    expect(r.overall).toBeNull();
    expect(r.legacy).toBe(true);
    expect([r.frontDriver, r.frontPassenger, r.sideDriver, r.sideRear, r.rollover]).toEqual([5, 5, 5, 5, 4]);
    expect(r.rollRisk).toBeCloseTo(0.109, 3);
  });
  it('2003 Accord : frontal 5/5, latéral non testé, retournement 4', () => {
    const r = parseRating(accord2003)!;
    expect(r.legacy).toBe(true);
    expect([r.frontDriver, r.frontPassenger, r.sideDriver, r.sideRear, r.rollover]).toEqual([5, 5, null, null, 4]);
    expect(r.rollRisk).toBeNull();
  });
  it('2013 F-150 (protocole 2011) : note globale, pas de lecture par test', () => {
    const r = parseRating(f150_2013)!;
    expect([r.overall, r.front, r.side, r.rollover, r.legacy]).toEqual([4, 4, 5, 4, false]);
    expect(r.rollRisk).toBeCloseTo(0.198, 3);
  });
});
