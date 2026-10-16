import { route, type Locale } from './routes';
import { PAGES, pageById, BRANDS, MODELS, brandId, modelId } from '../lib/pages';
import { brandName, modelCat } from '../lib/data';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'VIN decoder', method: 'Method and data', about: 'About', widget: 'Embed the decoder', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Terms of use', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'decode', label: 'Decode a VIN' },
  { id: 'recalls', label: 'Recalls and safety' },
  { id: 'guides', label: 'Guides' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const p = pageById(id); if (p) return p.nav;
  if (id.startsWith('brand:')) return `${brandName(id.slice(6))} recalls`;
  if (id.startsWith('model:')) { const m = modelCat(id.slice(6)); return `${m.brand === 'ram' ? '' : brandName(m.brand) + ' '}${m.name} recalls`; }
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => [...(g === 'decode' ? [link('home', lang)] : []), ...PAGES.filter((p) => p.group === g && p.id !== 'home').map((p) => link(p.id, lang))];
export function navCategories(lang: Locale): NavCategory[] {
  return GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length);
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Pied de page : les 18 marques et les 16 modèles, à un clic (profondeur ≤ 2, RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => [...BRANDS.map((b) => link(brandId(b.slug), lang)), ...MODELS.map((m) => link(modelId(m.slug), lang))];
