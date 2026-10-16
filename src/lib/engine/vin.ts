/**
 * Lecture d'un VIN sans réseau (49 CFR Part 565, règles fédérales de structure du VIN).
 * Fonctions pures, testées dans tests/vin.test.ts. Ce que ce module ne sait pas lire
 * (modèle, moteur, usine) vient de vPIC, interrogé ensuite par le navigateur.
 */
import P from '../../data/params-2026.json';

export const VIN_LENGTH = 17;
/** Poids de chaque position pour la clé de contrôle (49 CFR 565.15(c), tableau IV). */
export const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
/** Valeurs de translittération des lettres (49 CFR 565.15(c), tableau III). I, O et Q n'existent pas. */
const TRANSLIT: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9,
};
/** Code d'année-modèle, 10e caractère (49 CFR 565.15(d), tableau VII) : cycle de 30 ans. */
export const YEAR_CODES = 'ABCDEFGHJKLMNPRSTVWXY123456789';

export function normalizeVin(raw: string): string {
  return (raw || '').toUpperCase().replace(/[\s\-.]/g, '');
}

export function charValue(c: string): number | null {
  if (/^[0-9]$/.test(c)) return Number(c);
  return TRANSLIT[c] ?? null;
}

/** Clé de contrôle attendue en 9e position, ou null si un caractère est invalide. */
export function computeCheckDigit(vin: string): string | null {
  const v = normalizeVin(vin);
  if (v.length !== VIN_LENGTH) return null;
  let sum = 0;
  for (let i = 0; i < VIN_LENGTH; i++) {
    const val = charValue(v[i]);
    if (val === null) return null;
    sum += val * WEIGHTS[i];
  }
  const r = sum % 11;
  return r === 10 ? 'X' : String(r);
}

export interface CheckDetail { pos: number; char: string; value: number | null; weight: number; product: number }
export function checkDigitDetail(vin: string): { rows: CheckDetail[]; sum: number; remainder: number; expected: string | null } {
  const v = normalizeVin(vin).padEnd(VIN_LENGTH, ' ').slice(0, VIN_LENGTH);
  const rows: CheckDetail[] = [];
  let sum = 0; let bad = false;
  for (let i = 0; i < VIN_LENGTH; i++) {
    const value = charValue(v[i]);
    if (value === null) bad = true;
    const product = (value ?? 0) * WEIGHTS[i];
    sum += product;
    rows.push({ pos: i + 1, char: v[i].trim(), value, weight: WEIGHTS[i], product });
  }
  const remainder = sum % 11;
  return { rows, sum, remainder, expected: bad ? null : remainder === 10 ? 'X' : String(remainder) };
}

export type Problem = 'empty' | 'short' | 'long' | 'illegal-ioq' | 'illegal-char' | 'check-digit' | 'year-char';
export interface Validation { vin: string; ok: boolean; complete: boolean; problems: Problem[]; badPositions: number[]; checkExpected: string | null; checkFound: string | null }

/** Contrôle de forme : longueur, caractères interdits (I, O, Q), clé de contrôle, code d'année. */
export function validateVin(raw: string): Validation {
  const vin = normalizeVin(raw);
  const problems: Problem[] = []; const badPositions: number[] = [];
  if (!vin) return { vin, ok: false, complete: false, problems: ['empty'], badPositions, checkExpected: null, checkFound: null };
  for (let i = 0; i < vin.length; i++) {
    const c = vin[i];
    if (c === 'I' || c === 'O' || c === 'Q') { badPositions.push(i + 1); if (!problems.includes('illegal-ioq')) problems.push('illegal-ioq'); }
    else if (!/^[A-Z0-9]$/.test(c)) { badPositions.push(i + 1); if (!problems.includes('illegal-char')) problems.push('illegal-char'); }
  }
  if (vin.length < VIN_LENGTH) problems.push('short');
  if (vin.length > VIN_LENGTH) problems.push('long');
  const complete = vin.length === VIN_LENGTH && badPositions.length === 0;
  let checkExpected: string | null = null; let checkFound: string | null = null;
  if (complete) {
    checkExpected = computeCheckDigit(vin); checkFound = vin[8];
    if (checkExpected !== checkFound) problems.push('check-digit');
    if (!YEAR_CODES.includes(vin[9])) problems.push('year-char');
  }
  return { vin, ok: complete && problems.length === 0, complete, problems, badPositions, checkExpected, checkFound };
}

/**
 * Années-modèles possibles pour le 10e caractère. Pour les voitures, MPV et camions de
 * 10 000 lb de PTAC ou moins (pas les bus), la 7e position tranche (49 CFR 565.15(c)) : chiffre = 1980-2009,
 * lettre = 2010-2039. Ailleurs (motos, remorques, poids lourds), les deux cycles restent possibles.
 */
export function modelYears(yearChar: string, pos7?: string): number[] {
  const i = YEAR_CODES.indexOf((yearChar || '').toUpperCase());
  if (i < 0) return [];
  const all = [1980 + i, 2010 + i];
  if (pos7 && /^[0-9]$/.test(pos7)) return [all[0]];
  if (pos7 && /^[A-Z]$/.test(pos7)) return [all[1]];
  return all;
}

/** Région d'origine déduite du 1er caractère (plages de codes attribuées par SAE International). */
export function region(first: string): string {
  const c = (first || '').toUpperCase();
  for (const [chars, name] of Object.entries(P.vin.regions as Record<string, string>)) if (chars.includes(c)) return name;
  return '';
}

export interface Positions { wmi: string; vds: string; check: string; yearChar: string; plant: string; serial: string; smallMaker: boolean; wmiFull: string }
export function splitVin(raw: string): Positions {
  const v = normalizeVin(raw).padEnd(VIN_LENGTH, '·');
  const smallMaker = v[2] === '9';
  return {
    wmi: v.slice(0, 3), vds: v.slice(3, 8), check: v[8], yearChar: v[9], plant: v[10], serial: v.slice(11, 17), smallMaker,
    // « 9 » en 3e position : identifiant constructeur à six caractères, complété par les positions 12 à 14 (49 CFR 565.15).
    wmiFull: smallMaker ? `${v.slice(0, 3)}${v.slice(11, 14)}` : v.slice(0, 3),
  };
}

export interface WmiEntry { make: string; type: string; country: string }
export interface OfflineDecode { validation: Validation; parts: Positions; years: number[]; region: string; wmi: WmiEntry | null }
export function decodeOffline(raw: string, table: Record<string, WmiEntry>): OfflineDecode {
  const validation = validateVin(raw);
  const parts = splitVin(validation.vin);
  const v = validation.vin;
  const years = v.length >= 10 ? modelYears(v[9], v[6]) : [];
  const wmi = table[parts.wmi] ?? null;
  return { validation, parts, years, region: v ? region(v[0]) : '', wmi };
}

/** Deux VIN recopiés (tableau de bord, titre, assurance) : positions qui diffèrent, et confusions typiques. */
export function compareVins(a: string, b: string): { same: boolean; diffs: Array<{ pos: number; a: string; b: string; lookalike: boolean }> } {
  const x = normalizeVin(a); const y = normalizeVin(b);
  const n = Math.max(x.length, y.length); const diffs = [];
  const look = new Set(['0O', 'O0', '1I', 'I1', '0Q', 'Q0', '5S', 'S5', '8B', 'B8', '2Z', 'Z2', '6G', 'G6', 'UV', 'VU']);
  for (let i = 0; i < n; i++) if (x[i] !== y[i]) diffs.push({ pos: i + 1, a: x[i] ?? '', b: y[i] ?? '', lookalike: look.has(`${x[i] ?? ''}${y[i] ?? ''}`) });
  return { same: n > 0 && diffs.length === 0, diffs };
}
