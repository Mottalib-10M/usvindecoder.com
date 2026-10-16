/** Clé de contrôle d'un VIN (49 CFR 565.15), calculée position par position dans le navigateur, sans réseau. */
import { useEffect, useState } from 'react';
import { checkDigitDetail, normalizeVin, validateVin } from '../../lib/engine/vin';
import { readParams, updateURL } from '../../lib/url-state';

export default function CheckDigit({ initialVin, idPrefix = 'cd' }: { initialVin: string; idPrefix?: string }) {
  const [text, setText] = useState(initialVin);
  useEffect(() => { const u = readParams(window.location.search).get('vin'); if (u) setText(normalizeVin(u).slice(0, 17)); }, []);
  const vin = normalizeVin(text);
  const v = validateVin(vin);
  const d = checkDigitDetail(vin);
  const ok = v.complete && v.checkExpected === v.checkFound;
  return (
    <div className="rechner not-prose">
      <div className="grid grid-cols-[minmax(0,1fr)] content-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="content-start" onSubmit={(e) => e.preventDefault()} aria-label="VIN check digit calculator">
          <label htmlFor={`${idPrefix}-vin`} className="mb-1 block text-sm font-semibold text-navy-800">VIN to verify</label>
          <div className="relative">
            <input id={`${idPrefix}-vin`} type="text" autoCapitalize="characters" spellCheck={false} maxLength={20} value={text} onChange={(e) => { setText(e.target.value.toUpperCase()); updateURL({ vin: normalizeVin(e.target.value) }); }}
              className="h-12 w-full rounded-lg border border-navy-300 bg-white px-4 pr-16 font-mono text-lg uppercase tracking-[0.12em] text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm tabular-nums text-navy-500" aria-hidden="true">{vin.length}/17</span>
          </div>
          <p className="mt-1 text-xs text-navy-600">Computed in your browser with the federal weights; nothing is sent anywhere.</p>
          {v.badPositions.length > 0 && <p role="status" className="mt-2 text-sm text-amber-800">Position {v.badPositions.join(', ')}: {v.problems.includes('illegal-ioq') ? 'I, O and Q are not allowed in a VIN.' : 'only letters and digits are allowed.'}</p>}
        </form>
        <section data-resultat aria-live="polite" className={`rounded-xl border p-5 ${!v.complete ? 'border-navy-200 bg-navy-50' : ok ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Check digit</p>
          <p className="mt-1 font-serif text-4xl font-bold text-navy-900">{!v.complete ? `${vin.length} of 17` : ok ? `${v.checkFound}: valid` : `${v.checkFound}: should be ${v.checkExpected}`}</p>
          <p className="mt-1 text-sm text-navy-700">{!v.complete ? 'The ninth character can only be verified once all 17 are typed.' : ok ? 'The weighted sum matches position 9. The VIN is internally consistent; it does not prove the vehicle exists or that the title is clean.' : 'One character is probably miscopied (a 5 read as S, a 1 as I). Vehicles built for markets outside North America may not use the check digit at all.'}</p>
          {v.complete && <p className="mt-2 text-sm tabular-nums text-navy-800">Weighted sum {d.sum} ÷ 11 leaves {d.remainder}{d.remainder === 10 ? ', written X' : ''}.</p>}
        </section>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="journal w-full min-w-[640px] text-center text-sm">
          <caption className="mb-2 text-left text-sm text-navy-600">Each character is turned into a number, multiplied by the weight of its position, then summed.</caption>
          <thead><tr><th scope="row" className="text-left">Position</th>{d.rows.map((r) => <th key={r.pos} scope="col" className={r.pos === 9 ? 'bg-amber-100' : ''}>{r.pos}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row" className="text-left font-normal text-navy-600">Character</th>{d.rows.map((r) => <td key={r.pos} className="font-mono font-semibold">{r.char || '·'}</td>)}</tr>
            <tr><th scope="row" className="text-left font-normal text-navy-600">Value</th>{d.rows.map((r) => <td key={r.pos} className="tabular-nums">{r.char ? (r.value ?? '!') : ''}</td>)}</tr>
            <tr><th scope="row" className="text-left font-normal text-navy-600">Weight</th>{d.rows.map((r) => <td key={r.pos} className="tabular-nums text-navy-500">{r.weight}</td>)}</tr>
            <tr><th scope="row" className="text-left font-normal text-navy-600">Product</th>{d.rows.map((r) => <td key={r.pos} className="tabular-nums">{r.char ? r.product : ''}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
