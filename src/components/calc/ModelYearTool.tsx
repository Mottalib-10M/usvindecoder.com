/**
 * Page modèle : l'année-modèle choisie donne ses campagnes (fichier officiel lu au build), sa meilleure
 * note NCAP et sa plage EPA ; un bouton relit l'API Recalls en direct pour la même année.
 */
import { useState } from 'react';
import SelectField from '../ui/SelectField';
import { fetchRecalls, type RecallRow } from '../../lib/nhtsa';
import { RecallList, Stars } from './parts';

export interface YearInfo { year: number; rows: RecallRow[]; ncapBest: number | null; ncapRated: number; mpg: string; cost: string }
interface Props { make: string; apiModels: string[]; name: string; years: YearInfo[]; initialYear: number; idPrefix?: string }

export default function ModelYearTool({ make, apiModels, name, years, initialYear, idPrefix = 'my' }: Props) {
  const [year, setYear] = useState(initialYear);
  const [live, setLive] = useState<RecallRow[] | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const info = years.find((y) => y.year === year) ?? years[0];
  const rows = live ?? info.rows;
  const refresh = async () => {
    setState('loading');
    try {
      const all = (await Promise.all(apiModels.map((m) => fetchRecalls(make, m, year).catch(() => [] as RecallRow[])))).flat();
      const seen = new Set<string>(); const out = all.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))).sort((a, b) => (a.date < b.date ? 1 : -1));
      setLive(out); setState('idle');
    } catch { setState('error'); }
  };
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label={`${name} recalls by model year`}>
          <div className="grid grid-cols-1">
            <SelectField id={`${idPrefix}-year`} label={`${name} model year`} value={String(year)} onChange={(y) => { setYear(Number(y)); setLive(null); }} options={years.map((y) => ({ value: String(y.year), label: `${y.year} · ${y.rows.length} campaign${y.rows.length === 1 ? '' : 's'}` }))} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">Best NCAP overall</dt><dd className="text-lg font-bold">{info.ncapBest ? <Stars n={info.ncapBest} /> : <span className="text-navy-600">not rated</span>}</dd></div>
            <div className="rounded-lg border border-navy-200 p-3"><dt className="text-xs text-navy-600">EPA combined</dt><dd className="tabular-nums text-lg font-bold text-navy-900">{info.mpg || 'n/a'}</dd></div>
          </dl>
          {info.cost && <p className="mt-2 text-xs text-navy-600">{info.cost}</p>}
          <button type="button" onClick={refresh} className="mt-4 h-12 w-full rounded-lg border border-accent-500 bg-white px-4 font-semibold text-accent-700 hover:bg-accent-50">{state === 'loading' ? 'Asking NHTSA…' : `Re-check ${year} live with NHTSA`}</button>
          {state === 'error' && <p role="status" className="mt-1 text-xs text-amber-800">NHTSA did not answer; the list shown comes from its recall file.</p>}
        </form>
        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{live ? 'Live answer from the NHTSA Recalls API' : 'From the NHTSA recall file'}</p>
          <p className="mt-1 font-serif text-3xl font-bold text-navy-900"><span className={`tabular-nums ${rows.length ? 'text-red-800' : ''}`}>{rows.length}</span> campaign{rows.length === 1 ? '' : 's'} for the {year} {name}</p>
          <RecallList rows={rows} max={6} />
        </section>
      </div>
    </div>
  );
}
