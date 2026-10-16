/** Mini-simulateurs à saisie de VIN (guides) : lecture position par position, et comparaison de deux VIN recopiés. */
import { useMemo, useState } from 'react';
import WMI from '../../data/gen/wmi.json';
import { compareVins, decodeOffline, normalizeVin, type WmiEntry } from '../../lib/engine/vin';

const TABLE = (WMI as unknown as { wmi: Record<string, WmiEntry> }).wmi;
const input = 'h-12 w-full rounded-lg border border-navy-300 bg-white px-3 font-mono text-base uppercase tracking-[0.1em] text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20';

export function MiniPositions({ initialVin, href }: { initialVin: string; href: string }) {
  const [t, setT] = useState(initialVin);
  const vin = normalizeVin(t);
  const d = useMemo(() => decodeOffline(vin, TABLE), [vin]);
  const p = d.parts;
  const rows: Array<[string, string, string]> = [
    ['1-3', p.wmi, d.wmi ? `${d.wmi.make}, ${d.wmi.country || d.region} (${d.wmi.type})` : d.region || 'manufacturer code'],
    ['4-8', p.vds, 'model, body, engine and restraint codes, set by the maker'],
    ['9', p.check, d.validation.complete ? (d.validation.problems.includes('check-digit') ? `wrong: ${d.validation.checkExpected} expected` : 'check digit, valid') : 'check digit'],
    ['10', p.yearChar, d.years.length ? `model year ${d.years.join(' or ')}` : 'model year'],
    ['11', p.plant, 'assembly plant (maker’s own code)'],
    ['12-17', p.serial, p.smallMaker ? 'positions 12-14 complete a small maker’s code' : 'production sequence number'],
  ];
  return (
    <div data-chrome data-mini="positions" className="not-prose my-8 rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <p className="text-base font-semibold text-navy-900">Read your VIN position by position</p>
      <form data-simulateur-secondaire className="mt-3" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="mini-pos-vin" className="mb-1 block text-sm font-medium text-navy-700">VIN</label>
        <input id="mini-pos-vin" type="text" maxLength={20} spellCheck={false} autoCapitalize="characters" value={t} onChange={(e) => setT(e.target.value.toUpperCase())} className={input} />
      </form>
      <table className="journal mt-3 w-full text-sm" aria-live="polite"><tbody className="divide-y divide-navy-100">{rows.map(([pos, c, m]) => <tr key={pos}><td className="w-16 whitespace-nowrap py-1.5 tabular-nums text-navy-600">{pos}</td><td className="w-24 whitespace-nowrap font-mono font-semibold text-navy-900">{c.replace(/·/g, '') || 'n/a'}</td><td className="text-navy-700">{m}</td></tr>)}</tbody></table>
      <a href={href} className="mt-3 inline-block text-sm font-medium text-accent-700 hover:underline">Full decode with recalls and ratings →</a>
    </div>
  );
}

export function MiniMatch({ a: a0, b: b0, href }: { a: string; b: string; href: string }) {
  const [a, setA] = useState(a0); const [b, setB] = useState(b0);
  const r = compareVins(a, b);
  return (
    <div data-chrome data-mini="match" className="not-prose my-8 rounded-xl border border-accent-200 bg-white p-4 sm:p-5">
      <p className="text-base font-semibold text-navy-900">Do the two VINs match?</p>
      <form data-simulateur-secondaire className="mt-3 grid gap-x-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <div><label htmlFor="mini-m-a" className="mb-1 block text-sm font-medium text-navy-700">VIN on the dashboard</label><input id="mini-m-a" type="text" maxLength={20} spellCheck={false} value={a} onChange={(e) => setA(e.target.value.toUpperCase())} className={input} /></div>
        <div><label htmlFor="mini-m-b" className="mb-1 block text-sm font-medium text-navy-700">VIN on the title or door label</label><input id="mini-m-b" type="text" maxLength={20} spellCheck={false} value={b} onChange={(e) => setB(e.target.value.toUpperCase())} className={input} /></div>
      </form>
      <div aria-live="polite" className={`mt-3 rounded-lg p-3 text-sm ${r.same ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'}`}>
        {r.same ? <p className="font-semibold">Identical, character for character.</p> : (<>
          <p className="font-semibold">{r.diffs.length} position{r.diffs.length > 1 ? 's' : ''} differ.</p>
          <ul className="mt-1">{r.diffs.slice(0, 6).map((d) => <li key={d.pos}>Position {d.pos}: {d.a || '(missing)'} vs {d.b || '(missing)'}{d.lookalike ? ', a look-alike pair: probably a copying error' : ''}</li>)}</ul>
          {r.diffs.length > 0 && r.diffs.every((d) => d.lookalike) ? <p className="mt-1">Only look-alike characters differ: re-read both plates before suspecting anything.</p> : <p className="mt-1">A real mismatch between the car and its papers is a reason to stop the sale and ask the DMV.</p>}
        </>)}
      </div>
      <a href={href} className="mt-3 inline-block text-sm font-medium text-accent-700 hover:underline">Decode the VIN →</a>
    </div>
  );
}
