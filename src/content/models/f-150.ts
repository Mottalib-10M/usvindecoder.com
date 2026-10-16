import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('f-150');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'f-150', brand: 'ford',
  title: `Ford F-150 Recalls by Year: ${f.c} Campaigns Since 2012`,
  description: `Ford F-150 recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.worstN} on the ${f.worst} model alone. Each year with NCAP stars and EPA mpg, free.`,
  h1: 'Ford F-150 recalls by model year',
  intro: `NHTSA's file lists ${f.c} recall campaigns on F-150 model years 2012 to 2026. The ${f.worst} truck is in ${f.worstN} of them, the most of any year. Pick your year.`,
  resume: `The F-150 is the best-selling vehicle in the United States and, in NHTSA's records, one of the most recalled: ${f.c} campaigns cover at least one model year from 2012 to 2026, including the hybrid PowerBoost and the electric Lightning, which NHTSA lists under their own names. The count rose with the 2021 redesign: ${f.my(2020)} campaigns on the 2020 truck, ${f.my(2021)} on the 2021 and ${f.worstN} on the ${f.worst}, the peak. The power train leads the recalled systems with ${f.compN(0)} campaigns, ahead of the ${f.comp(1)} (${f.compN(1)}) and exterior lighting (${f.compN(2)}). On the safety side, the truck has kept a five-star NCAP overall rating on its rated crew cab versions for most years since 2015. Fuel economy ranges from ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined for 2025 gas and hybrid versions; the Lightning is rated in MPGe.`,
  body: (h) => `
<h2>Why the 2021 to 2023 trucks have so many campaigns</h2>
<p>The fourteenth-generation F-150 arrived for 2021 with a new electrical architecture, over-the-air updates, the PowerBoost hybrid and, a year later, the Lightning. Campaigns on those years concern the rearview camera, the 12-volt and high-voltage systems, axle bolts, the parking brake and transmission downshifts. One of them, ${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} Ford trucks and SUVs, the F-150 among them. Several later campaigns covered trucks that had already been repaired once and needed the fix redone, a pattern that has become frequent at Ford since its 2024 consent order with NHTSA.</p>
<h2>Older trucks: seat belts, transmissions and doors</h2>
<p>For the aluminum-body generation, 2015 to 2020, the largest campaign is ${big[1].id}: front seat belt pretensioners that could generate sparks and start a fire in the B-pillar, on ${f.units(big[1].units)} trucks. Another well-known campaign concerned unexpected downshifts into first gear on 2011 and 2012 trucks with the 6-speed automatic. The 2012 to 2014 trucks show fewer campaigns in our table because the file only covers reports received since 2010.</p>
<h2>Before buying a used F-150</h2>
<p>Pick the model year in the tool above, note each campaign, then enter the VIN on nhtsa.gov to see which are still open on that truck. Ford dealers fix them free, within the 15-year limit. The latest campaign on the file, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns ${f.latest.component.toLowerCase()} on ${f.latest.years} trucks. The ${h.a('brand:ford', 'Ford page')} shows the whole brand, and the ${h.a('mpg-by-vin', 'mpg lookup')} prices a year of fuel for each engine.</p>
`,
  faqs: [
    { q: 'What year F-150 has the most recalls?', a: `In NHTSA's file the ${f.worst} F-150 is covered by ${f.worstN} campaigns, the most of any model year since 2012, followed by the 2021 (${f.my(2021)}) and the 2023 (${f.my(2023)}). Most of them concern the new electrical architecture, cameras, axles and software of the generation launched for 2021. Many are small or software-only.` },
    { q: 'Are F-150 Lightning recalls included?', a: 'Yes. NHTSA lists the electric truck as F-150 Lightning BEV and the hybrid as F-150 Hybrid in some campaigns, and this page counts all three names. The tool shows every campaign for the model year you choose, so a Lightning-only campaign appears next to those affecting every F-150.' },
    { q: 'Is the F-150 seat belt fire recall fixed on my truck?', a: 'Campaign 18V568000 covered 2015 to 2018 Regular Cab and SuperCrew trucks whose seat belt pretensioners could start a fire in the B-pillar after deploying. Dealers removed insulation and applied heat-resistant tape. Whether your truck had the work is recorded on its VIN at nhtsa.gov and at any Ford dealer.' },
  ],
  related: ['brand:ford', 'mpg-by-vin'],
});
