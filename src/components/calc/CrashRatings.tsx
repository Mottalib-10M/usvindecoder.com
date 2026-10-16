/** Notes NCAP par année, marque et modèle (API SafetyRatings de la NHTSA). Premier rendu = réponses du build. */
import { useEffect, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import { fetchNcapList, fetchRating, type Rating } from '../../lib/nhtsa';
import { matchNames } from '../../lib/engine/match';
import { rolloverStars } from '../../lib/engine/rules';
import { readParams, updateURL } from '../../lib/url-state';
import { RatingTable, Stars } from './parts';
import { MAKES, makeLabel } from '../../lib/makes';

interface Props { year: number; make: string; model: string; models: string[]; rows: Rating[]; idPrefix?: string; lastYear: number }
const YEARS = (to: number) => Array.from({ length: to - 2010 + 1 }, (_, i) => String(to - i));

export default function CrashRatings({ year: y0, make: m0, model: d0, models: l0, rows: r0, idPrefix = 'nc', lastYear }: Props) {
  const [year, setYear] = useState(String(y0));
  const [make, setMake] = useState(m0);
  const [model, setModel] = useState(d0);
  const [models, setModels] = useState<string[]>(l0);
  const [rows, setRows] = useState<Rating[]>(r0);
  const [state, setState] = useState<'done' | 'loading' | 'error'>('done');
  const run = useRef(0);

  async function load(y: string, m: string, md: string) {
    const id = ++run.current; setState('loading');
    try {
      const vs = await fetchNcapList(y, m, md);
      const out = (await Promise.all(vs.slice(0, 8).map((v) => (v.id ? fetchRating(v.id).catch(() => null) : null)))).filter((x): x is Rating => !!x);
      if (id === run.current) { setRows(out); setState('done'); }
    } catch { if (id === run.current) setState('error'); }
  }
  const change = async (y: string, m: string) => {
    setYear(y); setMake(m); setState('loading');
    const list = (await fetchNcapList(y, m).catch(() => [])).map((x) => x.label);
    setModels(list);
    const keep = matchNames(list, model)[0] ?? list[0] ?? '';
    setModel(keep); updateURL({ year: y, make: m, model: keep });
    if (keep) load(y, m, keep); else { setRows([]); setState('done'); }
  };
  const pick = (md: string) => { setModel(md); updateURL({ year, make, model: md }); load(year, make, md); };
  useEffect(() => {
    const u = readParams(window.location.search); const y = u.get('year'); const m = u.get('make'); const md = u.get('model');
    if (y && m && md) { setYear(y); setMake(m); setModel(md); setModels([md]); load(y, m, md); }
  }, []);

  const rated = rows.filter((r) => r.overall);
  const best = rated.length ? Math.max(...rated.map((r) => r.overall as number)) : null;
  const risk = rows.map((r) => r.rollRisk).filter((x): x is number => typeof x === 'number' && x > 0);
  const label = makeLabel;
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="Crash test ratings lookup">
          <div className="grid grid-cols-2 gap-x-4">
            <SelectField id={`${idPrefix}-year`} label="Model year" value={year} onChange={(y) => change(y, make)} options={YEARS(lastYear).map((y) => ({ value: y, label: y }))} />
            <SelectField id={`${idPrefix}-make`} label="Make" value={make} onChange={(m) => change(year, m)} options={(MAKES.includes(make) ? MAKES : [make, ...MAKES]).map((m) => ({ value: m, label: label(m) }))} />
          </div>
          <div className="mt-4 grid grid-cols-1">
            <SelectField id={`${idPrefix}-model`} label="Model (NCAP name)" value={model} onChange={pick} options={(models.includes(model) ? models : [model, ...models]).filter(Boolean).map((m) => ({ value: m, label: m }))} help="NCAP lists body styles and drivetrains separately, so a pickup can have six entries." />
          </div>
          {risk.length > 0 && <p className="mt-4 text-sm text-navy-700">Rollover risk measured for this model: {[...new Set(risk.map((x) => Math.round(x * 1000) / 10))].join(' %, ')} %. NHTSA turns a risk under 10 % into five stars; this one earns <Stars n={rolloverStars(Math.min(...risk))} />.</p>}
        </form>
        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{state === 'loading' ? 'Asking NHTSA…' : state === 'error' ? 'NHTSA did not answer' : 'NHTSA 5-Star Safety Ratings'}</p>
          <p className="mt-1 font-serif text-3xl font-bold text-navy-900">{best ? <>Best overall <Stars n={best} /></> : 'Not rated'}</p>
          <p className="text-sm text-navy-700">{year} {label(make)} {model} · {rows.length} version{rows.length === 1 ? '' : 's'} listed, {rated.length} with an overall rating</p>
          <RatingTable rows={rows} />
          <p className="mt-3 text-xs text-navy-600">Stars compare vehicles of similar weight and class only: a 5-star compact car and a 5-star pickup do not protect equally in a crash between them.</p>
        </section>
      </div>
    </div>
  );
}
