/**
 * Rappels par année, marque et modèle (API Recalls de la NHTSA), ou par VIN décodé d'abord par vPIC.
 * Premier rendu = campagnes du fichier officiel lues au build pour le véhicule par défaut.
 */
import { useEffect, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import { fetchRecalls, fetchRecallList, fetchVpic, type RecallRow } from '../../lib/nhtsa';
import { matchNames } from '../../lib/engine/match';
import { normalizeVin, validateVin } from '../../lib/engine/vin';
import { readParams, updateURL } from '../../lib/url-state';
import { RecallList } from './parts';
import { MAKES, makeLabel } from '../../lib/makes';

interface Props { year: number; make: string; model: string; modelLabel?: string; rows: RecallRow[]; idPrefix?: string; firstYear?: number; lastYear: number; max?: number }
const YEARS = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(to - i));

export default function RecallCheck({ year: y0, make: m0, model: d0, modelLabel, rows: r0, idPrefix = 'rc', firstYear = 1995, lastYear, max = 10 }: Props) {
  const [year, setYear] = useState(String(y0));
  const [make, setMake] = useState(m0);
  const [model, setModel] = useState(d0);
  const [models, setModels] = useState<string[]>([d0]);
  const [rows, setRows] = useState<RecallRow[]>(r0);
  const [state, setState] = useState<'done' | 'loading' | 'error'>('done');
  const [vin, setVin] = useState('');
  const [vinMsg, setVinMsg] = useState('');
  const listKey = useRef(`${y0}|${m0}`);
  const loaded = useRef(false);
  const run = useRef(0);

  async function loadModels(y: string, m: string, keep?: string): Promise<string[]> {
    const list = await fetchRecallList('models', y, m).catch(() => [] as string[]);
    const clean = list.filter((n) => !/^(redundant|duplicate)\b/i.test(n));
    listKey.current = `${y}|${m}`; loaded.current = true;
    const next = clean.length ? clean : [keep ?? ''];
    setModels(next);
    return next;
  }
  async function loadRecalls(y: string, m: string, md: string) {
    const id = ++run.current;
    setState('loading');
    try { const r = await fetchRecalls(m, md, y); if (id === run.current) { setRows(r); setState('done'); } }
    catch { if (id === run.current) setState('error'); }
  }
  const ensure = () => { if (!loaded.current || listKey.current !== `${year}|${make}`) loadModels(year, make, model); };
  const change = async (y: string, m: string) => {
    setYear(y); setMake(m);
    const list = await loadModels(y, m, model);
    const keep = matchNames(list, model)[0] ?? list[0] ?? '';
    setModel(keep); updateURL({ year: y, make: m, model: keep });
    if (keep) loadRecalls(y, m, keep); else { setRows([]); setState('done'); }
  };
  const pickModel = (md: string) => { setModel(md); updateURL({ year, make, model: md }); loadRecalls(year, make, md); };

  useEffect(() => {
    const u = readParams(window.location.search);
    const y = u.get('year'); const m = u.get('make'); const md = u.get('model');
    if (y && m && md) { setYear(y); setMake(m); setModel(md); setModels([md]); loadRecalls(y, m, md); }
  }, []);

  const byVin = async () => {
    const v = validateVin(vin);
    if (!v.complete) { setVinMsg('Type all 17 characters (no I, O or Q).'); return; }
    setVinMsg('Decoding the VIN with NHTSA vPIC…');
    try {
      const f = await fetchVpic(normalizeVin(vin));
      if (!f || !f.make) { setVinMsg('vPIC has no record for this VIN.'); return; }
      const mk = f.make.toUpperCase(); setYear(f.year); setMake(mk);
      const list = await loadModels(f.year, mk, f.model);
      const md = matchNames(list, f.model)[0] ?? f.model.toUpperCase();
      setModel(md); setVinMsg(`${f.year} ${f.make} ${f.model}`); updateURL({ year: f.year, make: mk, model: md });
      loadRecalls(f.year, mk, md);
    } catch { setVinMsg('NHTSA did not answer; try again in a minute.'); }
  };

  const makeOpts = (MAKES.includes(make) ? MAKES : [make, ...MAKES]).map((m) => ({ value: m, label: makeLabel(m) }));
  const shownModel = model === d0 && modelLabel ? modelLabel : model;
  const parked = rows.filter((r) => r.parkIt || r.parkOutside).length;
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="Recall check by vehicle">
          <div className="grid grid-cols-2 gap-x-4">
            <SelectField id={`${idPrefix}-year`} label="Model year" value={year} onChange={(y) => change(y, make)} options={YEARS(firstYear, lastYear).map((y) => ({ value: y, label: y }))} />
            <SelectField id={`${idPrefix}-make`} label="Make" value={make} onChange={(m) => change(year, m)} options={makeOpts} />
          </div>
          <div className="mt-4 grid grid-cols-1" onFocusCapture={ensure} onPointerDownCapture={ensure}>
            <SelectField id={`${idPrefix}-model`} label="Model (as NHTSA lists it)" value={model} onChange={pickModel} options={(models.includes(model) ? models : [model, ...models]).filter(Boolean).map((m) => ({ value: m, label: m === d0 && modelLabel ? modelLabel : m }))} help="Hybrid, plug-in and heavy-duty versions are listed as separate models." />
          </div>
          <div className="mt-5 border-t border-navy-200 pt-4">
            <label htmlFor={`${idPrefix}-vin`} className="mb-1 block text-sm font-medium text-navy-700">Or start from the VIN</label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input id={`${idPrefix}-vin`} type="text" autoCapitalize="characters" spellCheck={false} maxLength={20} value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); byVin(); } }} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 font-mono uppercase tracking-wider text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" placeholder="17 characters" />
              <button type="button" onClick={byVin} className="h-12 rounded-lg bg-accent-600 px-4 font-semibold text-white hover:bg-accent-700">Find</button>
            </div>
            {vinMsg && <p role="status" className="mt-1 text-xs text-navy-600">{vinMsg}</p>}
          </div>
        </form>
        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{state === 'loading' ? 'Asking NHTSA…' : state === 'error' ? 'NHTSA did not answer' : 'NHTSA safety recall campaigns'}</p>
          <p className="mt-1 font-serif text-3xl font-bold text-navy-900"><span className={`tabular-nums ${rows.length ? 'text-red-800' : ''}`}>{rows.length}</span> campaign{rows.length === 1 ? '' : 's'}</p>
          <p className="text-sm text-navy-700">{year} {makeOpts.find((m) => m.value === make)?.label ?? make} {shownModel}{parked ? ` · ${parked} with a do-not-drive or park-outside warning` : ''}</p>
          <RecallList rows={rows} max={max} />
          <p className="mt-3 text-xs text-navy-600">A campaign covers every vehicle of the model and year built in the affected window. To see whether one car still has it open, enter its VIN on <a className="text-accent-700 underline" href="https://www.nhtsa.gov/recalls" target="_blank" rel="nofollow noopener noreferrer">nhtsa.gov/recalls</a> or the maker's site.</p>
        </section>
      </div>
    </div>
  );
}
