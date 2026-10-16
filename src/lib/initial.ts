/** Premier rendu des outils : les réponses réelles mises en cache au build (samples.json), lues par les mêmes fonctions que le navigateur. */
import { SAMPLES, EPA as EPAD } from './data';
import { parseVpic, parseRecalls, parseRating, parseEpaVehicle, type EpaVehicle, type Rating, type VehicleFacts } from './nhtsa';
import { hintsOf } from './lookup';
import { versionCodes } from './engine/match';
import { matchEpaModels, matchEpaOptions } from './engine/fuel';
import type { Initial } from '../components/calc/VinDecoder';

function epaFor(e: any, facts: VehicleFacts): EpaVehicle[] {
  const models = matchEpaModels(e.models as string[], facts.model, facts.drive, hintsOf(facts), versionCodes(facts.model, facts.trim, facts.series)).slice(0, 2);
  const out: EpaVehicle[] = [];
  for (const m of models) {
    const opts = matchEpaOptions(e.options[m] ?? [], Number(facts.displacementL) || undefined, Number(facts.cylinders) || undefined);
    for (const o of opts.slice(0, 3)) { const v = parseEpaVehicle(e.vehicles[o.value]); if (v) out.push(v); }
  }
  return out.slice(0, 4);
}
export function carInitial(): Initial {
  const c = SAMPLES.car; const facts = parseVpic(c.vpic)!;
  return { facts, recalls: parseRecalls(c.recalls), recallModel: c.recalls._model, ratings: (c.ncap.ratings as unknown[]).map(parseRating).filter((x): x is Rating => !!x), epa: epaFor(c.epa, facts) };
}
export function motoInitial(): Initial {
  const c = SAMPLES.moto;
  return { facts: parseVpic(c.vpic), recalls: parseRecalls(c.recalls), recallModel: c.recalls._model, ratings: [], epa: [] };
}
export const PRICES = { regular: EPAD.prices.regular, premium: EPAD.prices.premium, diesel: EPAD.prices.diesel, electric: EPAD.prices.electric };
export const SAMPLE_VIN = { car: SAMPLES.car.vin as string, moto: SAMPLES.moto.vin as string };
