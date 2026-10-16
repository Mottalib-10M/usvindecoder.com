/** Registre des pages : un fichier par page dans src/content/ (outils, guides, marques, modèles). */
import type { PageDef, BrandDef, ModelDef } from './page-types';
const load = <T>(g: Record<string, { default: T }>) => Object.values(g).map((m) => m.default);
export const PAGES: PageDef[] = [
  ...load<PageDef>(import.meta.glob('../content/tools/*.ts', { eager: true })),
  ...load<PageDef>(import.meta.glob('../content/guides/*.ts', { eager: true })),
].sort((a, b) => a.order - b.order);
export const BRANDS: BrandDef[] = load<BrandDef>(import.meta.glob('../content/brands/*.ts', { eager: true }));
export const MODELS: ModelDef[] = load<ModelDef>(import.meta.glob('../content/models/*.ts', { eager: true }));
export const pageById = (id: string) => PAGES.find((p) => p.id === id);
export const brandId = (slug: string) => `brand:${slug}`;
export const modelId = (slug: string) => `model:${slug}`;
export const brandDef = (slug: string) => BRANDS.find((b) => b.slug === slug);
export const modelDef = (slug: string) => MODELS.find((m) => m.slug === slug);
/** Le sommaire des marques (page outil « recalls »). */
export const HUB = 'recalls';
