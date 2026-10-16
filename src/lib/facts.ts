/** Chiffres d'une marque ou d'un modèle, tirés des jeux de données, pour la prose des pages (jamais saisis à la main). */
import { brand, model, n, units, day, brandRank, ncapYear, epaYear, RECALLS } from './data';
export function bf(slug: string) {
  const b = brand(slug); const y = (k: number) => b.byYear[String(k)];
  const comp = (i: number) => (b.components[i]?.[0] ?? '').toLowerCase();
  return {
    b, rank: brandRank(slug), c10: n(b.campaigns10), u10: units(b.units10), y: (k: number) => n(y(k).campaigns), yu: (k: number) => units(y(k).units),
    c26: n(y(2026).campaigns), comp, compN: (i: number) => n(b.components[i]?.[1] ?? 0), peak: b.peakYear, peakN: n(y(b.peakYear).campaigns),
    big: b.largest[0], big2: b.largest[1], recent: b.recent[0], dnd: n(b.dnd), po: n(b.po), nhtsa: n(b.initiatedBy.nhtsa ?? 0),
    airbag: n(b.airbagInflator), top: b.topModels, day, units, n, total: RECALLS,
  };
}
export function mf(slug: string) {
  const m = model(slug);
  const yrs = Object.entries(m.byModelYear).filter(([y]) => Number(y) <= 2026);
  const zero = yrs.filter(([, v]) => v === 0).map(([y]) => y);
  const maxN = Math.max(...yrs.map(([, v]) => v));
  return {
    m, c: n(m.campaigns), u: units(m.units), worst: m.worstYear, worstN: n(m.byModelYear[String(m.worstYear)]), my: (y: number) => n(m.byModelYear[String(y)] ?? 0),
    zero, maxN, comp: (i: number) => (m.components[i]?.[0] ?? '').toLowerCase(), compN: (i: number) => n(m.components[i]?.[1] ?? 0),
    latest: m.list[0], dnd: n(m.dnd), ncap: (y: number) => ncapYear(slug, y), epa: (y: number) => epaYear(slug, y), day, units, n,
  };
}
