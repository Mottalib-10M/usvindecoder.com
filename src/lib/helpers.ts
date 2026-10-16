import P from '../data/params-2026.json';
import { route, ROUTES } from '../i18n/routes';
import type { Helpers } from './page-types';
const SOURCES = P.sources as Record<string, { url: string; label: { en: string } }>;
export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []): string {
  const al = (i: number) => (align[i] === 'r' ? ' class="text-right tabular-nums"' : '');
  return `<div class="overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((x, i) => `<th scope="col"${al(i)}>${x}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td${al(i)}>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function helpers(): Helpers {
  return {
    a: (id, text) => { if (!ROUTES.some((r) => r.id === id)) throw new Error(`lien interne inconnu : ${id}`); return `<a href="${route(id, 'en')}">${text}</a>`; },
    src: (key, text) => { const s = SOURCES[key]; if (!s) throw new Error(`source inconnue : ${key}`); return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    ext: (url, text) => `<a href="${url}" target="_blank" rel="nofollow noopener noreferrer">${text}</a>`,
    table,
    box: (title, html) => `<aside class="callout callout-info not-prose"><span class="callout-title font-serif">${title}</span>${html}</aside>`,
    mini: (kind) => `<!--mini:${kind}-->`,
  };
}
export const sourceList = (keys: string[]) => keys.map((k) => { const s = SOURCES[k]; if (!s) throw new Error(`source inconnue : ${k}`); return { name: s.label.en, url: s.url }; });
