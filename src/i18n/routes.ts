import { makeRouter, type RouteDef } from './routes-core';
import { PAGES, BRANDS, MODELS, brandId, modelId, pageById, HUB } from '../lib/pages';
/** Anglais seul (États-Unis). Le préfixe /en/ est celui de la trame (racine de redirection, contrôleurs). */
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, slug: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${slug}/` }, ...(noindex ? { noindex } : {}) });
const hub = pageById(HUB)?.slug ?? HUB;
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/' } },
  R('method', 'method'), R('about', 'about'),
  R('widget', 'widget', true), R('contact', 'contact', true), R('editorial', 'editorial-policy', true),
  R('privacy', 'privacy', true), R('terms', 'terms-of-use', true), R('cookies', 'cookies', true),
];
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...PAGES.filter((p) => p.id !== 'home').map((p) => R(p.id, p.slug)),
  ...BRANDS.map((b) => R(brandId(b.slug), `${hub}/${b.slug}`)),
  ...MODELS.map((m) => R(modelId(m.slug), `${hub}/${m.brand}/${m.slug}`)),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
