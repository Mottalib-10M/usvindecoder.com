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

/** Ce que vPIC dit du véhicule, pour départager les versions EPA d'un même modèle. */
export interface BuildHints { trim?: string; series?: string; doors?: string; body?: string; electrification?: string; fuel2?: string; displacementL?: string }

const DRIVE_TOKENS: Record<string, string> = { '2WD': '2WD', '4WD': '4WD', AWD: 'AWD', FWD: 'FWD', RWD: 'RWD', '4X4': '4WD', '4MATIC': 'AWD', QUATTRO: 'AWD' };
const BODY_TOKENS: Record<string, RegExp> = { COUPE: /coupe/i, CONVERTIBLE: /convertible|cabriolet/i, CABRIOLET: /convertible|cabriolet/i, ROADSTER: /roadster|convertible/i, WAGON: /wagon/i, HATCHBACK: /hatchback/i, SEDAN: /sedan/i, VAN: /van/i };
const HYBRID_TOKENS = /^(HYBRID|HEV|PHEV|PLUG-?IN|ENERGI|PRIME)$/;
const NEUTRAL = new Set(['PICKUP', 'FFV', 'CAB', 'STATION', 'PLUS']);

/** Transmission déduite de la finition quand vPIC laisse le champ vide (« GLE350-4M », « xDrive40i », « quattro »). */
function driveFrom(drive: string, trim: string): string[] {
  const w = driveWords(drive);
  if (w.length) return w;
  if (/-4M\b|4MATIC|XDRIVE|QUATTRO|\bAWD\b|SH-AWD/i.test(trim)) return ['AWD', '4WD'];
  if (/SDRIVE/i.test(trim)) return ['RWD', '2WD'];
  return [];
}

/**
 * Note d'un nom EPA pour un véhicule vPIC : les mots qui suivent le nom du modèle (« AWD LE/SE »,
 * « 4Dr », « Sport ») sont confrontés à la transmission, aux portes, à la carrosserie, à
 * l'électrification et à la finition vPIC. Un mot contraire (« AWD » pour un 4x2, « 2Dr » pour une
 * berline 4 portes, « Hybrid » pour un thermique) coûte cher ; un mot inconnu (« Sport », « SRT », « L »)
 * coûte un peu, une seule fois ; un mot de la finition (« SE », « xDrive40i », « 350 ») rapporte.
 */
export function scoreEpaName(name: string, base: string, drive: string, h: BuildHints = {}): number {
  const target = norm(base);
  const tokens = name.split(/[\s/,()]+/).filter(Boolean);
  let acc = ''; let i = 0;
  while (i < tokens.length && acc.length < target.length && target.startsWith(acc + norm(tokens[i]))) { acc += norm(tokens[i]); i++; }
  const extras = (acc === target ? tokens.slice(i) : tokens.filter((t) => !target.includes(norm(t)))).map((t) => t.toUpperCase());
  const trimWords = new Set(`${h.trim ?? ''} ${h.series ?? ''}`.toUpperCase().split(/[\s/,()-]+/).filter(Boolean));
  const okDrive = driveFrom(drive, h.trim ?? '');
  const electric = /HEV|PHEV|HYBRID/i.test(h.electrification ?? '');
  let score = 0; let unknown = false;
  for (const t of extras) {
    if (trimWords.has(t)) { score += 3; continue; }
    const d = DRIVE_TOKENS[t];
    if (d) { if (okDrive.length) score += okDrive.includes(d) ? 2 : -5; continue; }
    const litres = t.match(/^(\d\.\d)T?$/);
    if (litres) { const dl = Number(h.displacementL); if (dl > 0) score += Math.abs(Number(litres[1]) - Math.round(dl * 10) / 10) < 0.051 ? 2 : -5; continue; }
    const doors = t.match(/^(\d)DR$/);
    if (doors) { if (h.doors) score += doors[1] === h.doors ? 2 : -4; continue; }
    if (BODY_TOKENS[t]) { if (h.body) score += BODY_TOKENS[t].test(h.body) ? 2 : -4; else score -= 1; continue; }
    if (HYBRID_TOKENS.test(t)) { score += electric ? 2 : -4; continue; }
    if (t === 'FFV' && /E85|ethanol/i.test(h.fuel2 ?? '')) { score += 1; continue; }
    if (NEUTRAL.has(t) || /^(DRIVE|II|SPD|LWB)$/.test(t)) continue;
    unknown = true;
  }
  return score - (unknown ? 2 : 0);
}

/**
 * Modèles EPA d'une année et d'une marque qui correspondent au modèle vPIC : même nom à la
 * ponctuation près (« F-150 » = « F150 Pickup 2WD »), sinon le code de version de la finition
 * (« C-Class » + « C300 » = « C300 »). Parmi eux, les noms les mieux notés par scoreEpaName.
 */
export function rankEpaModels(epaModels: string[], vpicModel: string, vpicDrive = '', hints: BuildHints = {}, codes: string[] = []): Array<{ m: string; s: number }> {
  const target = norm(vpicModel);
  if (!target) return [];
  let base = vpicModel;
  let hits = epaModels.filter((m) => norm(m).startsWith(target));
  if (!hits.length) for (const c of codes) { const byCode = epaModels.filter((m) => norm(m).startsWith(norm(c))); if (byCode.length) { hits = byCode; base = c; break; } }
  if (!hits.length) hits = epaModels.filter((m) => norm(m).includes(target));
  return hits.map((m, i) => ({ m, s: scoreEpaName(m, base, vpicDrive, hints), i })).sort((a, b) => b.s - a.s || a.i - b.i).map(({ m, s }) => ({ m, s }));
}
/** Les noms EPA les mieux notés (à égalité, tous). */
export function matchEpaModels(epaModels: string[], vpicModel: string, vpicDrive = '', hints: BuildHints = {}, codes: string[] = []): string[] {
  const r = rankEpaModels(epaModels, vpicModel, vpicDrive, hints, codes);
  return r.filter((x) => x.s === r[0]?.s).map((x) => x.m);
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
