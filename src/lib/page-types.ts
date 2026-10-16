/**
 * Une page = un fichier de contenu (src/content/<famille>/<slug>.ts). Les chiffres viennent des
 * jeux de données (src/data/gen/*.json) par les fonctions de src/lib/data.ts, jamais saisis deux fois.
 */
export interface FAQ { q: string; a: string }
export type ToolKind = 'decoder' | 'moto' | 'sticker' | 'recall' | 'ncap' | 'mpg' | 'checkdigit' | 'hub';
export type Group = 'decode' | 'recalls' | 'guides';
export interface Helpers {
  /** Lien interne par identifiant de route (« recall-check », « brand:ford », « model:f-150 »…). */
  a: (id: string, text: string) => string;
  /** Lien vers une source de params-2026.json (clé), texte facultatif. */
  src: (key: string, text?: string) => string;
  ext: (url: string, text: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  box: (title: string, html: string) => string;
  /** Mini-simulateur du guide (RECETTE §9.3), rendu en île React à cet endroit. */
  mini: (kind: string) => string;
}
export interface PageDef {
  id: string; slug: string; kind: 'tool' | 'guide'; group: Group; order: number;
  nav: string; card: string;
  /** 50 à 60 caractères, terme-clé d'abord, année (RECETTE §11). */
  title: string;
  /** 150 à 160 caractères. */
  description: string;
  h1: string;
  /** Une à trois lignes : la réponse directe, au-dessus de l'outil (RECETTE §5). */
  intro: string;
  /** UN paragraphe de 120 mots ou plus, replié sur 3 lignes (RECETTE §21, texte replié). */
  resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  tool?: ToolKind;
  related: string[];
  sources: string[];
}
export const definePage = (p: PageDef): PageDef => p;
export interface BrandDef {
  slug: string; title: string; description: string; h1: string; intro: string; resume: string;
  body: (h: Helpers) => string; faqs: FAQ[]; related: string[];
}
export const defineBrand = (b: BrandDef): BrandDef => b;
export interface ModelDef extends BrandDef { brand: string }
export const defineModel = (m: ModelDef): ModelDef => m;
