/** Sommaire des marques : la marque choisie donne ses campagnes par année et ses composants les plus rappelés (fichier NHTSA lu au build). */
import { useState } from 'react';
import SelectField from '../ui/SelectField';

export interface BrandRow { slug: string; name: string; href: string; byYear: Array<[number, number]>; campaigns10: number; units10: string; y2026: number; top: Array<[string, number]>; dnd: number }
const int = (x: number) => new Intl.NumberFormat('en-US').format(x);
export default function BrandExplorer({ brands, initial, idPrefix = 'be' }: { brands: BrandRow[]; initial: string; idPrefix?: string }) {
  const [slug, setSlug] = useState(initial);
  const b = brands.find((x) => x.slug === slug) ?? brands[0];
  const max = Math.max(...b.byYear.map(([, n]) => n), 1);
  const rank = [...brands].sort((x, y) => y.campaigns10 - x.campaigns10).findIndex((x) => x.slug === b.slug) + 1;
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="Recall history by brand">
          <div className="grid grid-cols-1"><SelectField id={`${idPrefix}-brand`} label="Brand" value={slug} onChange={setSlug} options={brands.map((x) => ({ value: x.slug, label: x.name }))} /></div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">Campaigns 2016-2025</dt><dd className="tabular-nums text-xl font-bold text-navy-900">{int(b.campaigns10)}</dd></div>
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">Rank among 18 brands</dt><dd className="tabular-nums text-xl font-bold text-navy-900">{rank}</dd></div>
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">Vehicles covered</dt><dd className="tabular-nums text-xl font-bold text-navy-900">{b.units10}</dd></div>
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">Do-not-drive warnings</dt><dd className="tabular-nums text-xl font-bold text-navy-900">{b.dnd}</dd></div>
          </dl>
          <a href={b.href} className="mt-4 inline-block font-semibold text-accent-700 underline">All {b.name} recall data and a model lookup →</a>
        </form>
        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{b.name}: campaigns filed with NHTSA per year</p>
          <ul className="mt-3 space-y-1">{b.byYear.map(([y, n]) => <li key={y} className="grid grid-cols-[3rem_1fr_3rem] items-center gap-2 text-sm"><span className="tabular-nums text-navy-600">{y}{y === 2026 ? '*' : ''}</span><span className="h-3 rounded-sm bg-accent-500" style={{ width: `${Math.max(2, (n / max) * 100)}%` }} /><span className="text-right tabular-nums text-navy-900">{n}</span></li>)}</ul>
          <p className="mt-3 text-sm text-navy-700">Most recalled systems: {b.top.slice(0, 3).map(([c, n]) => `${c.toLowerCase()} (${n})`).join(', ')}.</p>
          <p className="mt-1 text-xs text-navy-600">* 2026 runs to the latest campaign in NHTSA's file.</p>
        </section>
      </div>
    </div>
  );
}
