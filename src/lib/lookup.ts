/**
 * Recherches fédérales d'un véhicule décodé : rappels NHTSA, notes NCAP, fiches EPA.
 * Séparées du composant pour être testées (tests/lookup.test.ts) et sondées sur des VIN réels
 * (scripts/data/probe-matching.mjs).
 */
export { fetchVpic } from './nhtsa';
import { driveWords, rankEpaModels, matchEpaOptions, type BuildHints } from './engine/fuel';
import { matchNames, normName, recallCandidates, versionCodes } from './engine/match';
import { fetchRecalls, fetchRecallList, fetchNcapList, fetchRating, fetchEpaMenu, fetchEpaVehicle, type VehicleFacts, type RecallRow, type Rating, type EpaVehicle } from './nhtsa';

export const hintsOf = (f: VehicleFacts): BuildHints => ({ trim: f.trim, series: f.series, doors: f.doors, body: f.body, electrification: f.electrification, fuel2: f.fuel2, displacementL: f.displacementL });

/** Réunit les campagnes de plusieurs noms (une campagne n'apparaît qu'une fois), de la plus récente à la plus ancienne. */
export function mergeRecalls(lists: RecallRow[][]): RecallRow[] {
  const seen = new Map<string, RecallRow>();
  for (const l of lists) for (const r of l) if (!seen.has(r.id)) seen.set(r.id, r);
  return [...seen.values()].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
/** Libellé des noms qui ont répondu, sans répéter deux écritures du même code (« C 300 » = « C300 »). */
export function namesLabel(names: string[]): string {
  const out: string[] = [];
  for (const n of names) if (!out.some((o) => normName(o) === normName(n))) out.push(n);
  return out.join(' / ');
}

/**
 * Rappels : le modèle vPIC et chaque nom de version sont interrogés, et toutes les campagnes
 * trouvées sont réunies (2019 C-Class C300 : 0 sous « C-Class », 12 sous « C 300 », 5 sous « C300 »).
 * Sans réponse, les noms de la base des rappels qui correspondent au modèle à la ponctuation près.
 */
export async function lookupRecalls(f: VehicleFacts): Promise<{ rows: RecallRow[]; model: string }> {
  if (!f.make || !f.model || !f.year) return { rows: [], model: '' };
  const names = recallCandidates(f.model, f.trim, f.series);
  const got = await Promise.all(names.map((n) => fetchRecalls(f.make, n, f.year).catch(() => [] as RecallRow[])));
  const hit = names.filter((_, i) => got[i].length);
  if (hit.length) return { rows: mergeRecalls(got), model: namesLabel(hit) };
  const list = await fetchRecallList('models', f.year, f.make).catch(() => [] as string[]);
  const listed = [...new Set([...matchNames(list, f.model), ...versionCodes(f.model, f.trim, f.series).flatMap((c) => matchNames(list, c))])];
  for (const n of listed.slice(0, 3)) {
    const r = await fetchRecalls(f.make, n, f.year).catch(() => [] as RecallRow[]);
    if (r.length) return { rows: r, model: n };
  }
  return { rows: [], model: f.model };
}

/** Mots de transmission d'une version NCAP (« 4 DR AWD », « PU/CC 4WD », « SUV FWD »). */
const ncapDrive = (desc: string) => (desc.toUpperCase().match(/\b(AWD|4WD|FWD|RWD|2WD)\b/) ?? [])[1] ?? '';
/**
 * Versions NCAP dans l'ordre utile : d'abord celles de la même transmission et du même nombre de
 * portes que le VIN ; une version contraire (AWD pour une traction) n'est gardée que s'il n'y a rien d'autre.
 */
export function rankRatings(ratings: Rating[], f: Pick<VehicleFacts, 'drive' | 'doors' | 'trim'>): Rating[] {
  const ok = driveWords(f.drive);
  const score = (r: Rating) => {
    const d = ncapDrive(r.desc); let s = 0;
    if (d && ok.length) s += ok.includes(d) ? 2 : -3;
    const doors = r.desc.match(/\b(\d) DR\b/);
    if (doors && f.doors) s += doors[1] === f.doors ? 1 : -2;
    return s;
  };
  const scored = ratings.map((r, i) => ({ r, s: score(r), i })).sort((a, b) => b.s - a.s || a.i - b.i);
  const kept = scored.filter((x) => x.s >= 0);
  return (kept.length ? kept : scored).map((x) => x.r);
}

/** NCAP : le modèle vPIC, sinon la série (« 330i » → « 3 SERIES »), sinon les codes de version. */
export async function lookupRatings(f: VehicleFacts): Promise<Rating[]> {
  if (!f.make || !f.model || !f.year) return [];
  const mk = f.make.toUpperCase();
  const list = (await fetchNcapList(f.year, mk)).map((x) => x.label);
  let names = matchNames(list, f.model);
  if (!names.length && f.series) names = matchNames(list, f.series);
  if (!names.length) for (const c of versionCodes(f.model, f.trim, f.series)) { names = matchNames(list, c); if (names.length) break; }
  const ids: number[] = [];
  for (const n of names.slice(0, 4)) for (const v of await fetchNcapList(f.year, mk, n)) if (v.id && ids.length < 8) ids.push(v.id);
  const out = await Promise.all(ids.map((id) => fetchRating(id).catch(() => null)));
  return rankRatings(out.filter((x): x is Rating => !!x), f).slice(0, 6);
}

/** Moteur EPA (« Auto (S6), 6 cyl, 3.5 L, Turbo ») de même cylindrée que vPIC ; vrai si la cylindrée est inconnue. */
export function fitsDisplacement(text: string, displ?: number): boolean {
  if (!displ) return true;
  const x = text.match(/(\d+(?:\.\d+)?)\s*L\b/);
  return x ? Math.abs(Number(x[1]) - Math.round(displ * 10) / 10) < 0.051 : false;
}
/**
 * EPA : noms classés par scoreEpaName ; parmi les cinq premiers, ceux qui ont un moteur de la
 * cylindrée vPIC, puis les mieux notés d'entre eux (2020 Accord Sport 1,5 L : « Accord », pas
 * « Accord 2.0T Sport/Touring »).
 */
export async function lookupEpa(f: VehicleFacts): Promise<EpaVehicle[]> {
  if (!f.make || !f.model || !f.year) return [];
  const models = (await fetchEpaMenu('model', f.year, f.make)).map((m) => m.value);
  const ranked = rankEpaModels(models, f.model, f.drive, hintsOf(f), versionCodes(f.model, f.trim, f.series)).slice(0, 5);
  const displ = Number(f.displacementL) || undefined; const cyl = Number(f.cylinders) || undefined;
  const menus = await Promise.all(ranked.map((r) => fetchEpaMenu('options', f.year, f.make, r.m).catch(() => [])));
  let pool = ranked.map((r, i) => ({ ...r, opts: menus[i] }));
  const fitting = pool.filter((p) => p.opts.some((o) => fitsDisplacement(o.text, displ)));
  if (fitting.length) pool = fitting;
  const best = pool[0]?.s;
  const out: EpaVehicle[] = [];
  for (const p of pool.filter((x) => x.s === best).slice(0, 2)) {
    for (const o of matchEpaOptions(p.opts, displ, cyl).slice(0, 3)) { const v = await fetchEpaVehicle(o.value).catch(() => null); if (v) out.push(v); }
  }
  return out.slice(0, 4);
}
