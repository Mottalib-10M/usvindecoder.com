/**
 * Accès aux jeux de données produits par scripts/data/*.py (côté build uniquement : ces fichiers
 * ne partent jamais dans le JavaScript du navigateur, sauf la table WMI importée par le décodeur).
 */
import R from '../data/gen/recalls.json';
import E from '../data/gen/epa.json';
import N from '../data/gen/ncap.json';
import S from '../data/gen/samples.json';
import CAT from '../../scripts/data/catalog.json';
import W from '../data/gen/wmi.json';
import { formatNumber, displayDate } from './format';

export interface CampRow { id: string; date: string; units: number; component: string; components: string[]; models: string[]; more: number; summary: string; consequence: string; fix: string; dnd: boolean; po: boolean; by: string; years?: string; ys?: number[] }
export interface BrandData {
  name: string; parent: string; byYear: Record<string, { campaigns: number; units: number }>; campaigns10: number; units10: number; peakYear: number;
  components: Array<[string, number]>; dnd: number; po: number; initiatedBy: Record<string, number>; topModels: Array<[string, number]>;
  recent: CampRow[]; largest: CampRow[]; airbagInflator: number; airbagInflatorUnits: number;
  default: { model: string; name: string; year: number; rows: CampRow[] };
}
export interface ModelData { name: string; brand: string; variants: string[]; byModelYear: Record<string, number>; campaigns: number; units: number; dnd: number; worstYear: number; cleanYears: number[]; components: Array<[string, number]>; list: CampRow[] }
export interface EpaSummary { n: number; kinds: string[]; gasMin: number | null; gasMax: number | null; combMin: number | null; combMax: number | null; best: { model: string; trany: string; comb: number; city: number; hwy: number; fuel: string; cost: number; kind: string }; worst: { model: string; trany: string; comb: number; city: number; hwy: number; fuel: string; cost: number; kind: string }; costMin: number | null; costMax: number | null; gasMedian?: number | null; evShare?: number; models?: number }
export interface NcapVariant { id: number; desc: string; overall: number | null; front: number | null; side: number | null; rollover: number | null; rollRisk: number | null; complaints: number | null; investigations: number | null; fcw: string; ldw: string }

export const RECALLS = R as unknown as { source: string; retrieved_at: string; file_date: string | null; latestCampaignDate: string; byYear: Record<string, number>; unitsByYear: Record<string, number>; componentsAll: Array<[string, number]>; brands: Record<string, BrandData>; models: Record<string, ModelData>; advisories: { byYear: Record<string, { dnd: number; po: number }>; recent: CampRow[]; dnd10: number; po10: number }; airbags: { campaigns: number; inflator: number; inflatorByYear: Record<string, number>; inflatorUnits: number; recent: CampRow[]; largest: CampRow[] }; cameras: { campaigns: number; units: number; byYear: Record<string, number> } };
export const EPA = E as unknown as { retrieved_at: string; prices: Record<string, number>; latestYear: number; refYear: number; refMedian: number; refCount: number; epaAssumptions: { milesPerYear: number; cityShare: number }; models: Record<string, { years: Record<string, EpaSummary> }>; brands: Record<string, Record<string, EpaSummary>> };
export const NCAP = N as unknown as { retrieved_at: string; models: Record<string, Record<string, NcapVariant[]>> };
export const SAMPLES = S as unknown as Record<string, any>;
export const CATALOG = CAT as { brands: Array<{ slug: string; name: string; rcl: string[]; epa: string; parent: string }>; models: Array<{ slug: string; brand: string; name: string; rcl: string[]; epa: string[]; ncap: string }> };

export const brand = (slug: string): BrandData => { const b = RECALLS.brands[slug]; if (!b) throw new Error(`brand ${slug}`); return b; };
export const model = (slug: string): ModelData => { const m = RECALLS.models[slug]; if (!m) throw new Error(`model ${slug}`); return m; };
export const brandName = (slug: string) => CATALOG.brands.find((b) => b.slug === slug)?.name ?? slug;
export const modelsOf = (brandSlug: string) => CATALOG.models.filter((m) => m.brand === brandSlug);
export const modelCat = (slug: string) => { const m = CATALOG.models.find((x) => x.slug === slug); if (!m) throw new Error(`model ${slug}`); return m; };

/** Dernière année de réception complète, et l'année en cours (partielle). */
export const LAST_FULL = 2025;
export const CURRENT = 2026;
export const n = (x: number) => formatNumber(x);
/** « 12.6 million », « 845,000 » : un nombre de véhicules lisible d'un coup d'œil (RECETTE §4.1). */
export function units(x: number): string {
  if (x >= 1_000_000) return `${formatNumber(Math.round(x / 100_000) / 10, x >= 10_000_000 ? 1 : 1).replace(/\.0$/, '')} million`;
  return formatNumber(x);
}
export const day = (iso: string) => displayDate(iso, 'en-US');
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

/** Rang d'une marque parmi les 18 sur les campagnes 2016-2025. */
export function brandRank(slug: string): number {
  const all = Object.entries(RECALLS.brands).sort((a, b) => b[1].campaigns10 - a[1].campaigns10).map(([s]) => s);
  return all.indexOf(slug) + 1;
}
/** Variation des campagnes entre deux années de réception. */
export function trend(b: BrandData, from: number, to: number) {
  const a = b.byYear[String(from)]?.campaigns ?? 0; const z = b.byYear[String(to)]?.campaigns ?? 0;
  return { a, z, diff: z - a, ratio: a ? z / a : 0 };
}
/** NCAP : meilleure note globale d'une année, et nombre de variantes notées. */
export function ncapYear(slug: string, year: number) {
  const vs = (NCAP.models[slug] ?? {})[String(year)] ?? [];
  const rated = vs.filter((v) => v.overall);
  const overall = rated.map((v) => v.overall as number);
  return { variants: vs, rated, best: overall.length ? Math.max(...overall) : null, worst: overall.length ? Math.min(...overall) : null };
}
export function epaYear(slug: string, year: number): EpaSummary | null { return EPA.models[slug]?.years[String(year)] ?? null; }
export const ord = (k: number) => `${k}${k % 10 === 1 && k % 100 !== 11 ? 'st' : k % 10 === 2 && k % 100 !== 12 ? 'nd' : k % 10 === 3 && k % 100 !== 13 ? 'rd' : 'th'}`;

/** Date de réception de la campagne la plus récente du fichier (AAAA-MM-JJ). */
export const LATEST = RECALLS.latestCampaignDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
export const WMI_COUNT = Object.keys((W as unknown as { wmi: Record<string, unknown> }).wmi).length;
