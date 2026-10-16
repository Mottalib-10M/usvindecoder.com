#!/usr/bin/env node
/**
 * Sonde du rapprochement des noms de modèles entre vPIC, la base des rappels, NCAP et l'EPA,
 * sur des VIN réels de 20 modèles courants (motifs constructeur + numéro de série fictif,
 * clé de contrôle recalculée). Interroge les API fédérales en direct, comme le navigateur.
 *
 * Usage : node scripts/data/probe-matching.mjs   (sortie : tableau + taux de rapprochement)
 */
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
const here = dirname(fileURLToPath(import.meta.url));
const out = join(mkdtempSync(join(tmpdir(), 'probe-')), 'lookup.mjs');
await build({ entryPoints: [join(here, '../../src/lib/lookup.ts')], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'error' });
const vinMod = join(dirname(out), 'vin.mjs');
await build({ entryPoints: [join(here, '../../src/lib/engine/vin.ts')], bundle: true, format: 'esm', platform: 'node', outfile: vinMod, logLevel: 'error' });
const L = await import(out); const V = await import(vinMod);
const { fetchVpic } = L;
// Les 8 premiers caractères (WMI + VDS) et les 10e-11e (année, usine) viennent de VIN de série réels.
const PATTERNS = [
  ['1FTFW1E5', 'MF'], ['1GCUYDED', 'LZ'], ['1C6SRFFT', 'LN'], ['4T1G11AK', 'LU'], ['2HGFC2F6', 'KH'],
  ['5YJYGDEE', 'MF'], ['2T2BZMCA', 'KC'], ['4JGFB4KB', 'LA'], ['WDDWF8DB', 'KR'], ['WBA5R1C5', 'KA'],
  ['5NPLM4AG', 'MH'], ['1C4RJFAG', 'KC'], ['2GNAXKEV', 'L6'], ['JN8AT2MV', 'LW'], ['4S4BTAFC', 'L3'],
  ['3VWC57BU', 'KM'], ['WA1BNAFY', 'L2'], ['3GTU9DED', 'LG'], ['5XYP6DHC', 'MG'], ['JM3KFBDM', 'L0'],
  ['1HGCV1F3', 'LA'], ['5UXCR6C0', 'L9'], ['1N4BL4BV', 'LC'], ['3MW5R1J0', 'LB'],
];
const vins = PATTERNS.map(([a, b]) => { const raw = `${a}0${b}123456`; const c = V.computeCheckDigit(raw); return raw.slice(0, 8) + c + raw.slice(9); });
let ok = { r: 0, n: 0, e: 0 }, total = 0;
for (const vin of vins) {
  const f = await fetchVpic(vin).catch(() => null);
  if (!f || !f.make) { console.log(`?? ${vin} vPIC vide`); continue; }
  total++;
  const [r, n, e] = await Promise.all([L.lookupRecalls(f).catch(() => ({ rows: [], model: '' })), L.lookupRatings(f).catch(() => []), L.lookupEpa(f).catch(() => [])]);
  ok.r += r.rows.length > 0; ok.n += n.length > 0; ok.e += e.length > 0;
  const tag = (x) => (x ? 'ok' : '--');
  console.log(`${vin} ${f.year} ${f.make} | ${f.model} | ${f.series || '-'} | ${f.trim || '-'} | rappels ${tag(r.rows.length)} (${r.model}) | NCAP ${tag(n.length)} (${n.map((x) => x.desc).slice(0, 1).join('')}) | EPA ${tag(e.length)} (${e.map((x) => x.model).slice(0, 2).join(', ')})`);
}
console.log(`\n${total} VIN : rappels ${ok.r}/${total}, NCAP ${ok.n}/${total}, EPA ${ok.e}/${total}`);
