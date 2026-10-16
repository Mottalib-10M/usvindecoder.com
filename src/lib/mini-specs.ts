/** Mini-simulateurs des guides (RECETTE §9.3) : chacun calcule le sujet de sa page avec le moteur du site. */
import type { MiniSpec } from './mini-types';
import M from '../data/gen/minis.json';
import { freeRemedy, odometerDisclosure, rolloverStars } from './engine/rules';
import { mpgSavings } from './engine/fuel';
import { YEAR_CODES, modelYears } from './engine/vin';
import { formatNumber } from './format';

const usd = (x: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(x);
const mio = (x: number) => (x >= 1e6 ? `${formatNumber(Math.round(x / 1e5) / 10, 1)} million` : formatNumber(x));
const MINI = M as unknown as { advisories: Record<string, { dnd: number; po: number; all: number }>; airbags: Record<string, { name: string; n: number; units: number; all: number }>; airbagsAll: { n: number; units: number } };
const yearsOpt = Object.keys(MINI.advisories).sort().reverse().map((y) => ({ value: y, label: Number(y) === 2026 ? '2026 (so far)' : y }));
const brandKeys = Object.keys(MINI.airbags);

const SPECS: Record<string, MiniSpec> = {
  remedy: {
    title: 'Is the recall repair still free?', cta: 'Check recalls by model',
    inputs: [
      { id: 'sale', label: 'Year the first owner bought it', def: 2012, max: 2100 },
      { id: 'notice', label: 'Year the recall was issued', def: 2026, max: 2100 },
      { id: 'tire', label: 'Part recalled', def: 0, options: [{ value: '0', label: 'Vehicle or equipment' }, { value: '1', label: 'Tire' }] },
    ],
    run: (v) => {
      const r = freeRemedy(v.sale, v.notice, v.tire === 1);
      return { head: ['Free remedy owed by the maker', r.free ? 'Yes' : 'No'], rows: [['Calendar years since first sale', String(r.years)], ['Federal limit', `${r.limit} years`], ['Last notice year with a free fix', String(r.lastFreeNoticeYear)]], note: '49 U.S.C. 30120(g). Makers often fix older cars anyway; ask the dealer.' };
    },
  },
  odometer: {
    title: 'Does this sale need an odometer statement?', cta: 'Decode the VIN first',
    inputs: [{ id: 'my', label: 'Model year', def: 2016, max: 2100 }, { id: 'sale', label: 'Year of the sale', def: 2026, max: 2100 }],
    run: (v) => {
      const r = odometerDisclosure(v.my, v.sale);
      return { head: ['Mileage disclosure on the title', r.required ? 'Required' : 'Exempt'], rows: [['Rule for this model year', `${r.rule} years`], ['Exempt from 1 January', String(r.exemptFrom)]], note: '49 CFR 580.17. An exempt vehicle can still have a rolled-back odometer: NMVTIS keeps past readings.' };
    },
  },
  rollover: {
    title: 'From rollover risk to NCAP stars', cta: 'Look up a model’s ratings',
    inputs: [{ id: 'risk', label: 'Rollover risk shown by NHTSA', def: 12.5, unit: '%', max: 100, decimals: 1 }],
    run: (v) => {
      const s = rolloverStars(v.risk / 100);
      return { head: ['Rollover rating', `${'★'.repeat(s)}${'☆'.repeat(5 - s)}`], rows: [['Stars', `${s} of 5`], ['Band', s === 5 ? 'under 10 %' : s === 1 ? 'over 40 %' : `${(5 - s) * 10} to ${(6 - s) * 10} %`]], note: 'Risk of rolling over in a single-vehicle crash, from the static stability factor and the dynamic tip test.' };
    },
  },
  advisory: {
    title: 'Do-not-drive and park-outside recalls by year', cta: 'Check your model',
    inputs: [{ id: 'y', label: 'Year NHTSA received the report', def: 2025, options: yearsOpt }],
    run: (v) => {
      const a = MINI.advisories[String(v.y)];
      return { head: ['Campaigns with a do-not-drive warning', String(a.dnd)], rows: [['Park-outside warnings (fire risk)', String(a.po)], ['All vehicle campaigns that year', formatNumber(a.all)], ['Share with either warning', `${formatNumber(Math.round(((a.dnd + a.po) / a.all) * 1000) / 10, 1)} %`]] };
    },
  },
  airbag: {
    title: 'Air bag inflator campaigns by brand, 2016 to 2026', cta: 'Check your model',
    inputs: [{ id: 'b', label: 'Brand', def: 0, options: brandKeys.map((k, i) => ({ value: String(i), label: MINI.airbags[k].name })) }],
    run: (v) => {
      const b = MINI.airbags[brandKeys[v.b] ?? brandKeys[0]];
      return { head: [`${b.name}: inflator campaigns`, String(b.n)], rows: [['Vehicles covered', mio(b.units)], ['Share of the brand’s campaigns', `${formatNumber(Math.round((b.n / b.all) * 1000) / 10, 1)} %`], ['All brands, same period', `${MINI.airbagsAll.n} campaigns`]] };
    },
  },
  mpgdiff: {
    title: 'What a few mpg are worth each year', cta: 'Find your car’s EPA rating',
    inputs: [{ id: 'a', label: 'Current car', def: 22, unit: 'mpg', max: 150 }, { id: 'b', label: 'Car you are considering', def: 30, unit: 'mpg', max: 150 }, { id: 'mi', label: 'Miles per year', def: 15000, unit: 'mi', max: 200000 }, { id: 'p', label: 'Gas price', def: 4.33, unit: '$/gal', max: 20, decimals: 2 }],
    run: (v) => {
      const r = mpgSavings(v.mi, v.p, v.a, v.b);
      return { head: [r.diff >= 0 ? 'Saved each year' : 'Extra cost each year', usd(Math.abs(r.diff))], rows: [['Current car', `${usd(r.costA)} a year`], ['Other car', `${usd(r.costB)} a year`], ['Gallons saved', formatNumber(r.gallonsSaved)], ['Over 5 years', usd(r.diff * 5)]] };
    },
  },
  yearcode: {
    title: 'Model year from the 10th character', cta: 'Decode a full VIN',
    inputs: [{ id: 'c', label: '10th character', def: YEAR_CODES.indexOf('N'), options: YEAR_CODES.split('').map((c, i) => ({ value: String(i), label: c })) }, { id: 'p7', label: '7th character is', def: 1, options: [{ value: '1', label: 'a letter' }, { value: '0', label: 'a digit' }, { value: '2', label: 'not known' }] }],
    run: (v) => {
      const c = YEAR_CODES[v.c]; const ys = modelYears(c, v.p7 === 1 ? 'A' : v.p7 === 0 ? '1' : undefined);
      return { head: ['Model year', ys.join(' or ')], rows: [['Code', c], ['30-year cycle', `${1980 + v.c}, ${2010 + v.c}, ${2040 + v.c}`]], note: 'The 7th-character rule applies to cars, SUVs and trucks up to 10,000 lb GVWR (49 CFR 565.15).' };
    },
  },
};
export function getSpec(kind: string, _lang = 'en'): MiniSpec {
  const s = SPECS[kind]; if (!s) throw new Error(`mini inconnu : ${kind}`); return s;
}
export const MINI_KINDS = Object.keys(SPECS);
