/**
 * Consommation EPA et coût annuel : année, marque, modèle et motorisation tirés des menus de
 * fueleconomy.gov, ou d'un VIN décodé par vPIC. Le coût se calcule ici (lib/engine/fuel.ts).
 */
import { useEffect, useRef, useState } from 'react';
import SelectField from '../ui/SelectField';
import NumberField from '../ui/NumberField';
import { fetchEpaMenu, fetchEpaVehicle, fetchVpic, type EpaVehicle } from '../../lib/nhtsa';
import { annualFuel, annualElectric, matchEpaModels, matchEpaOptions } from '../../lib/engine/fuel';
import { normalizeVin, validateVin } from '../../lib/engine/vin';
import { readParams, updateURL } from '../../lib/url-state';

type Opt = { text: string; value: string };
interface Props { year: number; make: string; model: string; models: string[]; option: string; options: Opt[]; vehicle: EpaVehicle; prices: { regular: number; premium: number; diesel: number; electric: number }; refMedian: number; refYear: number; makes: string[]; lastYear: number; idPrefix?: string }
const usd = (x: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(x);
const int = (x: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(x);

export default function FuelEconomy({ year: y0, make: m0, model: d0, models: l0, option: o0, options: p0, vehicle: v0, prices, refMedian, refYear, makes, lastYear, idPrefix = 'fe' }: Props) {
  const [year, setYear] = useState(String(y0));
  const [make, setMake] = useState(m0);
  const [model, setModel] = useState(d0);
  const [models, setModels] = useState(l0);
  const [opt, setOpt] = useState(o0);
  const [opts, setOpts] = useState<Opt[]>(p0);
  const [veh, setVeh] = useState<EpaVehicle | null>(v0);
  const [miles, setMiles] = useState(15000);
  const [price, setPrice] = useState(prices.regular);
  const [vin, setVin] = useState('');
  const [msg, setMsg] = useState('');
  const [state, setState] = useState<'done' | 'loading' | 'error'>('done');
  const run = useRef(0);

  const loadVehicle = async (id: string) => { const k = ++run.current; setState('loading'); try { const v = await fetchEpaVehicle(id); if (k === run.current) { setVeh(v); setState('done'); } } catch { if (k === run.current) setState('error'); } };
  const toModel = async (y: string, mk: string, md: string, wanted?: { displ?: number; cyl?: number }) => {
    setModel(md);
    const o = await fetchEpaMenu('options', y, mk, md).catch(() => [] as Opt[]);
    setOpts(o);
    const keep = (wanted ? matchEpaOptions(o, wanted.displ, wanted.cyl)[0] : null) ?? o[0];
    if (keep) { setOpt(keep.value); updateURL({ id: keep.value }); loadVehicle(keep.value); } else setVeh(null);
  };
  const toMake = async (y: string, mk: string) => {
    setYear(y); setMake(mk); setState('loading');
    const ms = (await fetchEpaMenu('model', y, mk).catch(() => [] as Opt[])).map((m) => m.value);
    setModels(ms);
    const keep = matchEpaModels(ms, model)[0] ?? ms[0];
    if (keep) toModel(y, mk, keep); else { setVeh(null); setState('done'); }
  };
  const byVin = async () => {
    if (!validateVin(vin).complete) { setMsg('Type all 17 characters (no I, O or Q).'); return; }
    setMsg('Decoding with NHTSA vPIC…');
    try {
      const f = await fetchVpic(normalizeVin(vin));
      if (!f || !f.make) { setMsg('vPIC has no record for this VIN.'); return; }
      setYear(f.year); setMake(f.make); setMsg(`${f.year} ${f.make} ${f.model}${f.engine ? `, ${f.engine}` : ''}`);
      const ms = (await fetchEpaMenu('model', f.year, f.make)).map((m) => m.value);
      setModels(ms);
      const md = matchEpaModels(ms, f.model, f.drive)[0];
      if (!md) { setMsg(`${f.year} ${f.make} ${f.model}: no EPA rating (vehicles over 8,500 lb GVWR are not rated).`); setVeh(null); return; }
      toModel(f.year, f.make, md, { displ: Number(f.displacementL) || undefined, cyl: Number(f.cylinders) || undefined });
    } catch { setMsg('The federal servers did not answer; try again in a minute.'); }
  };
  useEffect(() => { const id = readParams(window.location.search).get('id'); if (id && id !== o0) { setOpt(id); loadVehicle(id); } }, []);

  const fuelPrice = veh ? (veh.fuel.includes('Premium') ? prices.premium : veh.fuel === 'Diesel' ? prices.diesel : price) : price;
  const isEv = veh?.kind === 'ev';
  const yearCost = veh ? (isEv ? annualElectric(miles, veh.combE, prices.electric).cost : annualFuel({ miles, mpg: veh.comb, price: fuelPrice }).cost) : 0;
  const median = annualFuel({ miles, mpg: refMedian, price }).cost;
  const yearOpts = Array.from({ length: lastYear - 1984 + 1 }, (_, i) => String(lastYear - i)).map((y) => ({ value: y, label: y }));
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="EPA fuel economy lookup">
          <div className="grid grid-cols-2 gap-x-4">
            <SelectField id={`${idPrefix}-year`} label="Model year" value={year} onChange={(y) => toMake(y, make)} options={yearOpts} />
            <SelectField id={`${idPrefix}-make`} label="Make" value={make} onChange={(m) => toMake(year, m)} options={(makes.includes(make) ? makes : [make, ...makes]).map((m) => ({ value: m, label: m }))} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4">
            <SelectField id={`${idPrefix}-model`} label="Model (EPA name)" value={model} onChange={(m) => toModel(year, make, m)} options={(models.includes(model) ? models : [model, ...models]).map((m) => ({ value: m, label: m }))} />
            <SelectField id={`${idPrefix}-opt`} label="Engine and transmission" value={opt} onChange={(o) => { setOpt(o); updateURL({ id: o }); loadVehicle(o); }} options={opts.map((o) => ({ value: o.value, label: o.text }))} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4">
            <NumberField id={`${idPrefix}-miles`} label="Miles per year" value={miles} onChange={setMiles} unit="mi" max={200000} />
            <NumberField id={`${idPrefix}-price`} label="Regular gas price" value={price} onChange={setPrice} unit="$/gal" max={20} decimals={2} />
          </div>
          <label htmlFor={`${idPrefix}-vin`} className="mb-1 mt-4 block text-sm font-medium text-navy-700">Or start from a VIN</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <input id={`${idPrefix}-vin`} type="text" autoCapitalize="characters" spellCheck={false} maxLength={20} value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} placeholder="17 characters" className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 font-mono uppercase tracking-wider text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <button type="button" onClick={byVin} className="h-12 rounded-lg bg-accent-600 px-4 font-semibold text-white hover:bg-accent-700">Find</button>
          </div>
          {msg && <p role="status" className="mt-1 text-xs text-navy-600">{msg}</p>}
        </form>
        <section data-resultat aria-live="polite" className="rounded-xl border border-accent-200 bg-accent-50/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{state === 'loading' ? 'Asking fueleconomy.gov…' : 'EPA rating and your yearly cost'}</p>
          {veh ? (<>
            <p className="mt-1 font-serif text-4xl font-bold tabular-nums text-navy-900">{usd(yearCost)}<span className="ml-2 text-base font-normal text-navy-600">a year</span></p>
            <p className="text-sm text-navy-700">{veh.year} {veh.make} {veh.model} · {veh.trany} · {veh.fuel}</p>
            <table className="journal mt-3 w-full text-sm"><tbody className="divide-y divide-navy-100">
              <tr><th scope="row" className="py-1.5 text-left font-normal text-navy-600">{isEv ? 'Efficiency (combined)' : 'City / highway / combined'}</th><td className="text-right tabular-nums text-navy-900">{isEv ? `${veh.comb} MPGe · ${veh.combE} kWh per 100 mi` : `${veh.city} / ${veh.hwy} / ${veh.comb} mpg`}</td></tr>
              <tr><th scope="row" className="py-1.5 text-left font-normal text-navy-600">{isEv ? 'Electricity per year' : 'Fuel per year'}</th><td className="text-right tabular-nums text-navy-900">{isEv ? `${int((miles * veh.combE) / 100)} kWh at $${prices.electric}/kWh` : `${int(miles / veh.comb)} gallons at $${fuelPrice.toFixed(2)}`}</td></tr>
              <tr><th scope="row" className="py-1.5 text-left font-normal text-navy-600">Over 5 years / 10 years</th><td className="text-right tabular-nums font-semibold text-navy-900">{usd(yearCost * 5)} / {usd(yearCost * 10)}</td></tr>
              {!isEv && <tr><th scope="row" className="py-1.5 text-left font-normal text-navy-600">Median {refYear} gas or hybrid ({refMedian} mpg)</th><td className="text-right tabular-nums text-navy-900">{usd(median)} a year ({yearCost <= median ? `${usd(median - yearCost)} less` : `${usd(yearCost - median)} more`})</td></tr>}
              <tr><th scope="row" className="py-1.5 text-left font-normal text-navy-600">EPA label estimate</th><td className="text-right tabular-nums text-navy-900">{usd(veh.cost)} a year{veh.range ? ` · range ${veh.range} mi` : ''}</td></tr>
            </tbody></table>
            <p className="mt-3 text-xs text-navy-600">The EPA label assumes 15,000 miles a year, 55 % in town, at fuel prices fueleconomy.gov publishes; your own miles and price replace them above.</p>
          </>) : <p className="mt-2 text-sm text-navy-700">{state === 'loading' ? 'Loading…' : 'Pick a model and an engine to see its EPA rating.'}</p>}
        </section>
      </div>
    </div>
  );
}
