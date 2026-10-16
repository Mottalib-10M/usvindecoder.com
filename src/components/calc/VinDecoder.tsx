/**
 * Décodeur VIN : lecture hors ligne immédiate (structure, clé de contrôle, année, constructeur),
 * puis, dès que le VIN est complet, appels directs du navigateur à vPIC (fiche d'usine), aux rappels
 * NHTSA, aux notes NCAP et à fueleconomy.gov. Premier rendu = exemple calculé au build (RECETTE §17.5).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import WMI from '../../data/gen/wmi.json';
import { decodeOffline, normalizeVin, type WmiEntry } from '../../lib/engine/vin';
import { annualFuel, annualElectric, matchEpaModels, matchEpaOptions } from '../../lib/engine/fuel';
import { matchNames } from '../../lib/engine/match';
import { fetchVpic, fetchRecalls, fetchRecallList, fetchNcapList, fetchRating, fetchEpaMenu, fetchEpaVehicle, type VehicleFacts, type RecallRow, type Rating, type EpaVehicle } from '../../lib/nhtsa';
import { readParams, updateURL } from '../../lib/url-state';
import NumberField from '../ui/NumberField';
import { VinRibbon, Stars, RecallList, RatingTable, SourceNote } from './parts';

const TABLE = (WMI as unknown as { wmi: Record<string, WmiEntry> }).wmi;
export interface Initial { facts: VehicleFacts | null; recalls: RecallRow[]; recallModel: string; ratings: Rating[]; epa: EpaVehicle[] }
interface Props { mode?: 'car' | 'moto' | 'sticker'; initialVin: string; initial: Initial; prices: { regular: number; premium: number; diesel: number; electric: number }; refMedian: number; refYear: number; idPrefix?: string; methodHref: string; embed?: boolean }
type Status = 'idle' | 'loading' | 'done' | 'error';
const usd = (x: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(x);
const int = (x: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(x);

async function lookupRecalls(f: VehicleFacts): Promise<{ rows: RecallRow[]; model: string }> {
  if (!f.make || !f.model || !f.year) return { rows: [], model: '' };
  let rows: RecallRow[] = [];
  try { rows = await fetchRecalls(f.make, f.model, f.year); } catch { rows = []; }
  if (rows.length) return { rows, model: f.model };
  const names = matchNames(await fetchRecallList('models', f.year, f.make).catch(() => [] as string[]), f.model);
  for (const n of names.slice(0, 3)) {
    const r = await fetchRecalls(f.make, n, f.year).catch(() => [] as RecallRow[]);
    if (r.length) return { rows: r, model: n };
  }
  return { rows: [], model: f.model };
}
async function lookupRatings(f: VehicleFacts): Promise<Rating[]> {
  if (!f.make || !f.model || !f.year) return [];
  const mk = f.make.toUpperCase();
  const names = matchNames((await fetchNcapList(f.year, mk)).map((x) => x.label), f.model);
  const ids: number[] = [];
  for (const n of names.slice(0, 4)) for (const v of await fetchNcapList(f.year, mk, n)) if (v.id && ids.length < 6) ids.push(v.id);
  const out = await Promise.all(ids.map((id) => fetchRating(id).catch(() => null)));
  return out.filter((x): x is Rating => !!x);
}
async function lookupEpa(f: VehicleFacts): Promise<EpaVehicle[]> {
  if (!f.make || !f.model || !f.year) return [];
  const models = (await fetchEpaMenu('model', f.year, f.make)).map((m) => m.value);
  const picked = matchEpaModels(models, f.model, f.drive).slice(0, 2);
  const out: EpaVehicle[] = [];
  for (const m of picked) {
    const opts = matchEpaOptions(await fetchEpaMenu('options', f.year, f.make, m), Number(f.displacementL) || undefined, Number(f.cylinders) || undefined);
    for (const o of opts.slice(0, 3)) { const v = await fetchEpaVehicle(o.value).catch(() => null); if (v) out.push(v); }
  }
  return out.slice(0, 4);
}

export default function VinDecoder({ mode = 'car', initialVin, initial, prices, refMedian, refYear, idPrefix = 'vd', methodHref, embed = false }: Props) {
  const [text, setText] = useState(initialVin);
  const [shown, setShown] = useState<{ vin: string } & Initial>({ vin: initialVin, ...initial });
  const [status, setStatus] = useState<Record<'facts' | 'recalls' | 'ratings' | 'epa', Status>>({ facts: 'done', recalls: 'done', ratings: 'done', epa: 'done' });
  const [miles, setMiles] = useState(15000);
  const [price, setPrice] = useState(prices.regular);
  const [copied, setCopied] = useState(false);
  const latest = useRef(initialVin);
  const vin = normalizeVin(text);
  const off = useMemo(() => decodeOffline(vin, TABLE), [vin]);
  const minLen = mode === 'moto' ? 11 : 17;
  const ready = vin.length >= minLen && vin.length <= 17 && off.validation.badPositions.length === 0;

  useEffect(() => {
    const u = readParams(window.location.search).get('vin');
    if (u && normalizeVin(u) !== initialVin) setText(normalizeVin(u).slice(0, 17));
  }, []);

  useEffect(() => {
    if (!ready || vin === shown.vin) return;
    const t = setTimeout(async () => {
      latest.current = vin;
      updateURL({ vin });
      setStatus({ facts: 'loading', recalls: 'loading', ratings: 'loading', epa: mode === 'moto' ? 'done' : 'loading' });
      let facts: VehicleFacts | null = null;
      try { facts = await fetchVpic(vin); } catch { facts = null; }
      if (latest.current !== vin) return;
      if (!facts || !facts.make) {
        setShown({ vin, facts, recalls: [], recallModel: '', ratings: [], epa: [] });
        setStatus({ facts: facts ? 'done' : 'error', recalls: 'idle', ratings: 'idle', epa: 'idle' });
        return;
      }
      setShown({ vin, facts, recalls: [], recallModel: facts.model, ratings: [], epa: [] });
      setStatus((s) => ({ ...s, facts: 'done' }));
      const f = facts;
      lookupRecalls(f).then((r) => { if (latest.current === vin) { setShown((x) => ({ ...x, recalls: r.rows, recallModel: r.model })); setStatus((s) => ({ ...s, recalls: 'done' })); } }).catch(() => setStatus((s) => ({ ...s, recalls: 'error' })));
      if (mode === 'moto') setStatus((s) => ({ ...s, ratings: 'done' }));
      else lookupRatings(f).then((r) => { if (latest.current === vin) { setShown((x) => ({ ...x, ratings: r })); setStatus((s) => ({ ...s, ratings: 'done' })); } }).catch(() => setStatus((s) => ({ ...s, ratings: 'error' })));
      if (mode !== 'moto') lookupEpa(f).then((r) => { if (latest.current === vin) { setShown((x) => ({ ...x, epa: r })); setStatus((s) => ({ ...s, epa: 'done' })); } }).catch(() => setStatus((s) => ({ ...s, epa: 'error' })));
    }, 350);
    return () => clearTimeout(t);
  }, [vin, ready]);

  const f = shown.facts;
  const v = off.validation;
  const parkIt = shown.recalls.filter((r) => r.parkIt || r.parkOutside).length;
  const rated = shown.ratings.filter((r) => r.overall);
  const best = rated.length ? Math.max(...rated.map((r) => r.overall as number)) : null;
  const e0 = shown.epa[0];
  const fuelPrice = (ev: EpaVehicle) => (ev.fuel.includes('Premium') ? prices.premium : ev.fuel === 'Diesel' ? prices.diesel : price);
  const costOf = (ev: EpaVehicle) => (ev.kind === 'ev' ? annualElectric(miles, ev.combE, prices.electric).cost : annualFuel({ miles, mpg: ev.comb, price: fuelPrice(ev) }).cost);
  const name = f && f.make ? [f.year, f.make, f.model].filter(Boolean).join(' ') : '';
  const nhtsaVin = `https://www.nhtsa.gov/recalls?vin=${encodeURIComponent(shown.vin)}`;
  const problems: string[] = [];
  if (vin.length && vin.length < 17 && !(mode === 'moto' && vin.length >= 11)) problems.push(`${vin.length} of 17 characters so far.`);
  if (vin.length > 17) problems.push(`${vin.length} characters: a VIN has exactly 17.`);
  if (v.problems.includes('illegal-ioq')) problems.push(`Position ${v.badPositions.join(', ')}: the letters I, O and Q are never used in a VIN (read them as 1 and 0).`);
  else if (v.problems.includes('illegal-char')) problems.push(`Position ${v.badPositions.join(', ')}: only letters and digits are allowed.`);
  if (v.problems.includes('check-digit')) problems.push(`Check digit: position 9 reads ${v.checkFound}, the formula gives ${v.checkExpected}. Either one character was copied wrong, or the vehicle was built for a market outside North America.`);

  const copy = async () => {
    const lines = [`VIN ${shown.vin}`, name && `${name}${f?.trim ? ' ' + f.trim : ''}`, `${shown.recalls.length} NHTSA recall campaign(s) for this model year`, best ? `NCAP overall: ${best} stars` : '', e0 ? `EPA: ${e0.comb} mpg combined` : ''].filter(Boolean);
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* presse-papiers refusé */ }
  };

  return (
    <div className="rechner not-prose" data-tool="vin">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="VIN decoder">
          <label htmlFor={`${idPrefix}-vin`} className="mb-1 block text-sm font-semibold text-navy-800">{mode === 'moto' ? 'Motorcycle VIN (17 characters, or the first 11)' : 'Vehicle identification number (17 characters)'}</label>
          <div className="relative">
            <input id={`${idPrefix}-vin`} type="text" inputMode="text" autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={20} value={text}
              onChange={(e) => setText(e.target.value.toUpperCase().replace(/[^A-Z0-9*\s-]/g, ''))}
              aria-describedby={`${idPrefix}-help`}
              className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 pr-20 font-mono text-lg tracking-[0.12em] text-navy-900 uppercase focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm tabular-nums text-navy-500" aria-hidden="true">{vin.length}/17</span>
          </div>
          <p id={`${idPrefix}-help`} className="mt-1 text-xs text-navy-600">{mode === 'moto' ? 'Steering head, frame label or title.' : 'Windshield corner, driver door jamb or title.'}</p>
          <VinRibbon vin={vin} years={off.years} />
          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-navy-500">Built by (WMI {off.parts.wmi.replace(/·/g, '')})</dt><dd className="text-navy-900">{off.wmi ? `${off.wmi.make}, ${off.wmi.country || off.region}` : off.region ? `${off.region} (code not in our table)` : 'n/a'}</dd>
            <dt className="text-navy-500">Model year (10th character)</dt><dd className="text-navy-900 tabular-nums">{off.years.length ? off.years.join(' or ') : 'n/a'}</dd>
            <dt className="text-navy-500">Check digit (9th)</dt><dd className={v.complete ? (v.problems.includes('check-digit') ? 'font-semibold text-amber-800' : 'text-green-800') : 'text-navy-900'}>{v.complete ? (v.problems.includes('check-digit') ? `${v.checkFound} found, ${v.checkExpected} expected` : `${v.checkFound}, valid`) : 'n/a'}</dd>
            <dt className="text-navy-500">Plant code / serial</dt><dd className="font-mono text-navy-900">{vin.length >= 11 ? `${vin[10]} / ${vin.slice(11) || 'n/a'}` : 'n/a'}</dd>
          </dl>
          {problems.length > 0 && <ul role="status" className="mt-3 space-y-1 border-l-4 border-amber-500 bg-amber-50 py-2 pl-3 pr-2 text-sm text-amber-900">{problems.map((p) => <li key={p}>{p}</li>)}</ul>}
        </form>

        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{status.facts === 'loading' ? 'Asking NHTSA…' : shown.vin === initialVin && !embed ? 'Example: this VIN, decoded' : 'Decoded from NHTSA vPIC'}</p>
          {f && f.make ? (<>
            <p className="mt-1 font-serif text-3xl font-bold leading-tight text-navy-900 md:text-4xl">{name}</p>
            <p className="mt-1 text-sm text-navy-700">{[f.trim || f.series, f.body, f.engine, f.drive, f.fuel].filter(Boolean).join(' · ') || f.type}</p>
            {f.plant && <p className="text-sm text-navy-600">Assembled in {f.plant}</p>}
            <div className={`mt-4 grid gap-3 ${mode === 'moto' ? 'grid-cols-2' : 'grid-cols-3'}`}>
              <div className="rounded-lg border border-navy-200 bg-white p-3">
                <p className="text-xs text-navy-600">Recall campaigns</p>
                <p className={`tabular-nums text-2xl font-bold ${shown.recalls.length ? 'text-red-800' : 'text-navy-900'}`}>{status.recalls === 'loading' ? '…' : shown.recalls.length}</p>
                <p className="text-xs text-navy-600">{parkIt ? `${parkIt} with a park or don't-drive warning` : `${f.year} ${f.model}`}</p>
              </div>
              {mode !== 'moto' && <div className="rounded-lg border border-navy-200 bg-white p-3">
                <p className="text-xs text-navy-600">NCAP overall</p>
                <p className="text-2xl font-bold text-navy-900">{status.ratings === 'loading' ? '…' : best ? <Stars n={best} /> : 'n/a'}</p>
                <p className="text-xs text-navy-600">{best ? `${rated.length} rated version${rated.length > 1 ? 's' : ''}` : 'not rated by NHTSA'}</p>
              </div>}
              <div className="rounded-lg border border-navy-200 bg-white p-3">
                {mode === 'moto' ? (<><p className="text-xs text-navy-600">Engine</p><p className="tabular-nums text-2xl font-bold text-navy-900">{f.displacementL ? `${int(Number(f.displacementL) * 1000)} cc` : 'n/a'}</p><p className="text-xs text-navy-600">{f.motorcycle || f.body || 'motorcycle'}</p></>)
                  : (<><p className="text-xs text-navy-600">EPA combined</p>
                    <p className="tabular-nums text-2xl font-bold text-navy-900">{status.epa === 'loading' ? '…' : e0 ? (e0.kind === 'ev' ? `${e0.comb} MPGe` : `${e0.comb} mpg`) : 'n/a'}</p>
                    <p className="text-xs text-navy-600">{e0 ? `${usd(costOf(e0))} a year at ${int(miles)} mi` : 'no EPA match'}</p></>)}
              </div>
            </div>
            <p className="mt-4 text-sm text-navy-700">Campaigns cover the {f.year} {f.model} as a model. Whether <em>this</em> vehicle was already repaired is on <a className="font-medium text-accent-700 underline" href={nhtsaVin} target="_blank" rel="nofollow noopener noreferrer">NHTSA's VIN lookup</a>.</p>
          </>) : (
            <p className="mt-2 text-navy-700">{status.facts === 'loading' ? 'Reading the manufacturer data…' : status.facts === 'error' ? 'NHTSA did not answer. The reading on the left is computed in your browser and stays valid; try again in a minute.' : ready ? 'NHTSA has no data for this VIN pattern. Check the characters against the title.' : 'Type the 17 characters: the factory record, recalls, crash ratings and EPA mileage appear here.'}</p>
          )}
          <div className="no-print mt-4 flex flex-wrap gap-2 text-sm">
            <button type="button" onClick={copy} className="rounded-md border border-navy-300 bg-white px-3 py-1.5 text-navy-800 hover:bg-navy-50">{copied ? 'Copied' : 'Copy summary'}</button>
            <button type="button" onClick={() => window.print()} className="rounded-md border border-navy-300 bg-white px-3 py-1.5 text-navy-800 hover:bg-navy-50">Print</button>
            <a href={methodHref} className="rounded-md px-3 py-1.5 text-accent-700 underline">How this is read</a>
          </div>
        </section>
      </div>

      {f && f.make && (
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
          <section>
            <h2 className="font-serif text-xl font-bold text-navy-900">Factory record</h2>
            <table className="journal mt-2 w-full text-sm"><tbody className="divide-y divide-navy-100">
              {([['Make', f.make], ['Model', f.model], ['Model year', f.year], ['Trim / series', [f.trim, f.series].filter(Boolean).join(' / ')], ['Vehicle type', f.type], ['Body', f.body], ['Engine', f.engine], ['Horsepower', f.hp && `${f.hp} hp`], ['Fuel', [f.fuel, f.fuel2].filter(Boolean).join(' + ')], ['Electrification', f.electrification], ['Battery', f.batteryKwh && `${f.batteryKwh} kWh`], ['Transmission', f.transmission], ['Drive', f.drive], ['Doors / seats', [f.doors, f.seats].filter(Boolean).join(' / ')], ['GVWR', f.gvwr], ['Motorcycle type', f.motorcycle], ['Manufacturer', f.manufacturer], ['Plant', f.plant]] as Array<[string, string]>)
                .filter(([, x]) => x).map(([k, x]) => <tr key={k}><th scope="row" className="w-2/5 py-1.5 pr-3 text-left font-normal text-navy-600">{k}</th><td className="py-1.5 text-navy-900 [overflow-wrap:anywhere]">{x}</td></tr>)}
            </tbody></table>
            {f.safety.length > 0 && (<><h3 className="mt-5 font-serif text-lg font-semibold text-navy-900">Safety equipment reported by the maker</h3>
              <ul className="mt-2 grid gap-x-4 text-sm sm:grid-cols-2">{f.safety.map(([k, x]) => <li key={k} className="border-b border-navy-100 py-1"><span className="text-navy-600">{k}:</span> <span className="text-navy-900">{x}</span></li>)}</ul></>)}
            <SourceNote text={`vPIC ${f.errorCode === '0' ? 'decoded this VIN clean' : `returned: ${f.errorText}`}. A blank line means the maker did not report it, not that the equipment is missing.`} />
          </section>
          <section>
            <h2 className="font-serif text-xl font-bold text-navy-900">Recall campaigns for the {f.year} {shown.recallModel || f.model}</h2>
            {status.recalls === 'loading' ? <p className="mt-2 text-sm text-navy-600">Loading NHTSA campaigns…</p> : <RecallList rows={shown.recalls} max={embed ? 4 : 8} />}
            <p className="mt-3 text-sm text-navy-700">Open status for this VIN, including over-the-air fixes already applied: <a className="text-accent-700 underline" href={nhtsaVin} target="_blank" rel="nofollow noopener noreferrer">nhtsa.gov/recalls</a>.</p>
          </section>
          {mode !== 'moto' && <section>
            <h2 className="font-serif text-xl font-bold text-navy-900">NCAP crash test ratings</h2>
            {status.ratings === 'loading' ? <p className="mt-2 text-sm text-navy-600">Loading NHTSA ratings…</p> : <RatingTable rows={shown.ratings} />}
          </section>}
          {mode !== 'moto' && <section>
            <h2 className="font-serif text-xl font-bold text-navy-900">{mode === 'sticker' ? 'EPA window sticker figures' : 'EPA fuel economy and yearly cost'}</h2>
            {status.epa === 'loading' ? <p className="mt-2 text-sm text-navy-600">Loading fueleconomy.gov…</p> : shown.epa.length === 0 ? <p className="mt-2 text-sm text-navy-700">No EPA rating matched this build. Heavy-duty pickups and vans over 8,500 lb GVWR are not rated by the EPA.</p> : (<>
              <form className="mt-3 grid grid-cols-2 gap-x-4" onSubmit={(e) => e.preventDefault()}>
                <NumberField id={`${idPrefix}-miles`} label="Miles per year" value={miles} onChange={setMiles} unit="mi" max={200000} />
                <NumberField id={`${idPrefix}-price`} label="Regular gas price" value={price} onChange={setPrice} unit="$/gal" max={20} decimals={2} />
              </form>
              <div className="mt-3 space-y-3">{shown.epa.map((ev) => (
                <div key={ev.id} className="rounded-lg border border-navy-200 p-3 text-sm">
                  <p className="font-semibold text-navy-900">{ev.year} {ev.make} {ev.model} · {ev.trany} · {ev.fuel}</p>
                  <p className="mt-1 tabular-nums text-navy-800">{ev.kind === 'ev' ? `${ev.comb} MPGe combined, ${ev.combE} kWh/100 mi${ev.range ? `, ${ev.range} mi range` : ''}` : `${ev.city} city / ${ev.hwy} highway / ${ev.comb} combined mpg`}</p>
                  <p className="tabular-nums text-navy-800">Your yearly fuel: <strong>{usd(costOf(ev))}</strong>{ev.kind !== 'ev' && ` (${int(miles / ev.comb)} gallons)`} · EPA label: {usd(ev.cost)}/yr</p>
                  {mode === 'sticker' && <p className="tabular-nums text-navy-700">{ev.youSaveSpend >= 0 ? `Saves ${usd(ev.youSaveSpend)}` : `Spends ${usd(-ev.youSaveSpend)} more`} over 5 years vs the average new vehicle · CO₂ {ev.co2 ? `${int(ev.co2)} g/mi` : 'n/a'} · GHG rating {ev.ghg > 0 ? `${ev.ghg}/10` : 'n/a'} · Smog rating {ev.smog > 0 ? `${ev.smog}/10` : 'n/a'}</p>}
                  {ev.kind !== 'ev' && <p className="text-xs text-navy-600">{ev.comb >= refMedian ? `${ev.comb - refMedian} mpg better` : `${refMedian - ev.comb} mpg worse`} than the median {refYear} gas or hybrid model ({refMedian} mpg).</p>}
                </div>))}</div>
            </>)}
          </section>}
        </div>
      )}
      <aside className="mt-8 border-l-4 border-navy-400 bg-navy-50 px-4 py-3 text-sm text-navy-800">
        <span className="font-serif font-semibold">What no free VIN decoder can tell you.</span> Accidents, title brands (salvage, flood, rebuilt), odometer readings and theft are not in the VIN: they live in state title records. The federal source is <a className="text-accent-700 underline" href="https://vehiclehistory.bja.ojp.gov/" target="_blank" rel="nofollow noopener noreferrer">NMVTIS</a> (Department of Justice), sold through approved providers; insurance total losses and thefts can also be checked on <a className="text-accent-700 underline" href="https://www.nicb.org/vincheck" target="_blank" rel="nofollow noopener noreferrer">NICB VINCheck</a> at no charge.
      </aside>
    </div>
  );
}
