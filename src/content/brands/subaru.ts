import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('subaru');
export default defineBrand({
  slug: 'subaru',
  title: `Subaru Recalls 2026: Outback, Forester, Crosstrek by Year`,
  description: `Subaru recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, only ${f.y(2024)} in 2024. Check any Outback, Forester, Crosstrek, Ascent or Impreza by model year.`,
  h1: 'Subaru recalls: Outback, Forester, Crosstrek and more',
  intro: `Subaru appears in ${f.c10} NHTSA campaigns from 2016 to 2025, among the fewest of the 18 brands, with a single one in 2024. Check your Subaru by model year below.`,
  resume: `Subaru of America sells a short lineup, almost all of it built on one platform with the same flat-four engines and all-wheel-drive system, and its recall record is correspondingly short: ${f.c10} vehicle campaigns naming Subaru between 2016 and 2025 in NHTSA's file, ${f.u10} vehicle notices, ${f.c26} in 2026 so far. The yearly count swings widely, from ${f.y(2019)} campaigns in 2019 to ${f.y(2024)} in 2024. Air bags lead with ${f.compN(0)} campaigns, mostly Takata inflators on older Imprezas, Legacys and Outbacks, and ${f.airbag} campaigns in all concern inflators. Subaru has ${f.dnd} do-not-drive campaigns since 2016, a high number for its size, tied to those inflators. One quirk of the count: the electric Solterra is built by Toyota, so its campaigns are filed by Toyota and appear here because they name the Subaru model.`,
  body: (h) => `
<h2>The Ascent and the 2026 equipment campaign</h2>
<p>The three-row Ascent, built in Indiana, appears in ${f.n(f.top[3][1])} campaigns since 2021. The latest large Subaru campaign, ${f.recent.id}, received on ${f.day(f.recent.date)}, covered ${f.units(f.recent.units)} vehicles across the Ascent, Forester and Crosstrek Hybrid, a reminder that a small brand can still issue a big campaign when a shared part is involved. The Impreza and the Forester appear most since 2021, ${f.n(f.top[0][1])} campaigns each.</p>
<h2>Headlights and the 2019 peak</h2>
<p>Subaru's 2019 total was swollen by campaigns on low-beam headlight assemblies and on the brake light switch of older Imprezas and Foresters; ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles for a brake lamp switch that could stop the brake lights and the push-button start from working. Exterior lighting campaigns are classed as safety recalls because lights are a federal standard, FMVSS 108.</p>
<h2>Solterra and the Toyota partnership</h2>
<p>The Solterra and Toyota's bZ4X are the same vehicle. The 2022 wheel hub bolt recall, which stopped sales of both, and later software and camera campaigns were filed by Toyota. Read the ${h.a('brand:toyota', 'Toyota page')} for the details, and use the ${h.a('recall-check', 'recall check')} with Subaru and Solterra for your model year.</p>
`,
  faqs: [
    { q: 'Why does a Toyota recall appear on the Subaru page?', a: 'Because the Subaru Solterra electric SUV is built by Toyota alongside the bZ4X, and Toyota files the campaigns for both. NHTSA records each campaign with every make it covers, so one naming the Toyota bZ4X, the Lexus RZ and the Subaru Solterra counts for each of the three brands.' },
    { q: 'Do older Subarus have open Takata air bag recalls?', a: `Some do. Subaru recalled Takata inflators on 2003 to 2014 Legacy, Outback, Impreza, WRX and Baja models, and ${f.airbag} Subaru campaigns since 2016 concern inflators. Check the VIN on nhtsa.gov or Subaru’s owner site; an open frontal inflator campaign on an old Subaru is worth fixing before the car is driven again.` },
    { q: 'Is the Subaru oil consumption issue a recall?', a: 'No. Excessive oil consumption on some FB-series engines from the early 2010s led to a class settlement and extended warranty coverage, not a safety recall. It does not appear in NHTSA’s campaign file. A Subaru dealer can check whether a given VIN received engine work under that program.' },
  ],
  related: ['brand:toyota', 'recall-check', 'takata-airbag-recall'],
});
