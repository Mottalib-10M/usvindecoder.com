/** Pièces communes aux outils : ruban du VIN, étoiles, liste de rappels, tableau NCAP. */
import type { RecallRow, Rating } from '../../lib/nhtsa';

const SEG: Array<{ from: number; to: number; label: string; cls: string }> = [
  { from: 0, to: 3, label: 'Maker (WMI)', cls: 'bg-accent-500 text-white' },
  { from: 3, to: 8, label: 'Vehicle attributes', cls: 'bg-accent-100 text-accent-900' },
  { from: 8, to: 9, label: 'Check', cls: 'bg-amber-200 text-amber-950' },
  { from: 9, to: 10, label: 'Year', cls: 'bg-red-700 text-white' },
  { from: 10, to: 11, label: 'Plant', cls: 'bg-navy-700 text-white' },
  { from: 11, to: 17, label: 'Serial number', cls: 'bg-navy-100 text-navy-900' },
];
export function VinRibbon({ vin, years }: { vin: string; years: number[] }) {
  const chars = vin.padEnd(17, ' ').slice(0, 17).split('');
  return (
    <div className="mt-3" aria-hidden="true">
      <div className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-0.5">
        {chars.map((c, i) => { const seg = SEG.find((s) => i >= s.from && i < s.to)!; return <span key={i} className={`flex h-8 items-center justify-center rounded-sm font-mono text-sm font-semibold ${c.trim() ? seg.cls : 'bg-navy-50 text-navy-300'}`}>{c.trim() || '·'}</span>; })}
      </div>
      <div className="mt-1 grid grid-cols-[repeat(17,minmax(0,1fr))] gap-0.5 text-[10px] leading-tight text-navy-600">
        {SEG.map((s) => <span key={s.label} style={{ gridColumn: `${s.from + 1} / ${s.to + 1}` }} className={`truncate text-center ${s.to - s.from === 1 ? 'hidden sm:block' : ''}`}>{s.label === 'Year' && years.length ? years.join('/') : s.label === 'Maker (WMI)' ? <><span className="sm:hidden">WMI</span><span className="hidden sm:inline">Maker (WMI)</span></> : s.label}</span>)}
      </div>
      {/* Sur téléphone, une colonne fait 20 px : les trois repères d'un caractère passent en clair sous le ruban. */}
      <p className="mt-0.5 text-[11px] leading-tight text-navy-600 sm:hidden">9th: check digit · 10th: year{years.length ? ` ${years.join('/')}` : ''} · 11th: plant</p>
    </div>
  );
}
export function Stars({ n, of = 5 }: { n: number; of?: number }) {
  return <span className="whitespace-nowrap text-amber-800" aria-label={`${n} out of ${of} stars`}>{'★'.repeat(n)}<span className="text-navy-600">{'☆'.repeat(Math.max(0, of - n))}</span></span>;
}
const longDate = (iso: string) => { const d = new Date(`${iso}T00:00:00Z`); return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
const nice = (c: string) => c.split(':').map((x) => x.trim().toLowerCase()).filter(Boolean).join(' › ');
export function RecallList({ rows, max = 8 }: { rows: RecallRow[]; max?: number }) {
  if (!rows.length) return <p className="mt-2 text-sm text-navy-700">NHTSA lists no safety recall campaign for this model and year. That covers the model as a whole; it says nothing about service bulletins or warranty extensions, which are not safety recalls.</p>;
  return (
    <ol className="mt-3 space-y-3">
      {rows.slice(0, max).map((r) => (
        <li key={r.id} className="rounded-lg border border-navy-200 p-3 text-sm">
          <p className="flex flex-wrap items-baseline gap-x-2"><span className="font-mono font-semibold text-navy-900">{r.id}</span><span className="text-navy-600">{longDate(r.date)}</span>
            {(r.parkIt || r.parkOutside) && <span className="rounded bg-red-700 px-1.5 py-0.5 text-xs font-semibold text-white">{r.parkIt ? 'Do not drive' : 'Park outside'}</span>}
            {r.ota && <span className="rounded bg-accent-100 px-1.5 py-0.5 text-xs font-semibold text-accent-900">Over-the-air fix</span>}</p>
          <p className="mt-0.5 font-medium capitalize text-navy-800">{nice(r.component)}</p>
          <p className="mt-1 text-navy-700">{r.summary.length > 260 ? `${r.summary.slice(0, 257).replace(/\s+\S*$/, '')}…` : r.summary}</p>
          {r.remedy && <p className="mt-1 text-navy-600"><span className="font-medium text-navy-700">Remedy:</span> {r.remedy.length > 200 ? `${r.remedy.slice(0, 197).replace(/\s+\S*$/, '')}…` : r.remedy}</p>}
        </li>))}
      {rows.length > max && <li className="text-sm text-navy-600">and {rows.length - max} more campaign{rows.length - max > 1 ? 's' : ''} on NHTSA.</li>}
    </ol>
  );
}
export function RatingTable({ rows }: { rows: Rating[] }) {
  if (!rows.length) return <p className="mt-2 text-sm text-navy-700">NHTSA has not crash-tested this model and year. NCAP tests a selection of new models each year, chosen by sales and new designs; an untested model is not an unsafe one.</p>;
  // Sur téléphone, cinq colonnes de cinq étoiles écrasaient la version en un mot par ligne : chiffre + une étoile sous 640 px.
  const cell = (n: number | null) => (n ? <><span className="whitespace-nowrap font-semibold tabular-nums text-amber-800 sm:hidden" aria-label={`${n} out of 5 stars`}>{n}★</span><span className="hidden sm:inline"><Stars n={n} /></span></> : <span className="text-navy-500">not rated</span>);
  return (
    <div className="mt-2 overflow-x-auto"><table className="journal w-full text-sm">
      <thead><tr><th scope="col" className="text-left">Version</th>{[['Overall', 'All'], ['Front', 'Front'], ['Side', 'Side'], ['Rollover', 'Roll']].map(([l, sh]) => <th key={l} scope="col" className="px-1"><span className="hidden sm:inline">{l}</span><span className="sm:hidden" aria-hidden="true">{sh}</span></th>)}</tr></thead>
      <tbody className="divide-y divide-navy-100">{rows.map((r) => <tr key={r.id}><td className="min-w-[9rem] py-1.5 pr-2 text-navy-800">{r.desc}{r.rollRisk ? <span className="block text-xs text-navy-600">rollover risk {Math.round(r.rollRisk * 1000) / 10} %</span> : null}</td><td className="text-center">{cell(r.overall)}</td><td className="text-center">{cell(r.front)}</td><td className="text-center">{cell(r.side)}</td><td className="text-center">{cell(r.rollover)}</td></tr>)}</tbody>
    </table></div>
  );
}
export const SourceNote = ({ text }: { text: string }) => <p className="mt-2 text-xs text-navy-600">{text}</p>;
