import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('kia');
export default defineBrand({
  slug: 'kia',
  title: `Kia Recalls 2026: Sorento, Telluride, Sportage by Year`,
  description: `Kia recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.peakN} in ${f.peak}. Electrical faults lead. Check any Sorento, Telluride, Sportage or EV9 by year.`,
  h1: 'Kia recalls by model and year',
  intro: `Kia appears in ${f.c10} NHTSA campaigns from 2016 to 2025, rising to ${f.peakN} in ${f.peak}; electrical faults lead. Check your Kia by model year below.`,
  resume: `Kia shares engines, platforms and suppliers with Hyundai, and its recall history mirrors its sister brand with a lag of a few months. NHTSA's file holds ${f.c10} vehicle campaigns naming Kia between 2016 and 2025, ${f.u10} vehicle notices, and ${f.c26} in 2026 so far. The count tripled from ${f.y(2019)} in 2019 to ${f.peakN} in ${f.peak}, as Kia launched the Telluride, the K5 and its first dedicated electric models, the EV6 and EV9. The ${f.comp(0)} dominates with ${f.compN(0)} campaigns, more than twice the ${f.comp(1)} (${f.compN(1)}). The largest Kia campaign, ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles for anti-lock brake modules that could short and catch fire, with a park-outside warning; Kia has ${f.po} campaigns carrying that advisory since 2016. Since 2021 the Sorento and the Telluride appear most, in ${f.n(f.top[0][1])} and ${f.n(f.top[1][1])} campaigns.`,
  body: (h) => `
<h2>The Telluride's recall list</h2>
<p>Kia's three-row SUV, built in Georgia, is one of its best sellers and appears in ${f.n(f.top[1][1])} campaigns since 2021. Several concerned power seats whose motor could overheat, and a 2024 campaign told owners of 2020 to 2024 Telluride vehicles to park outside until dealers fixed a front seat motor wiring fault. If you are buying a used Telluride, check that each seat campaign shows as completed.</p>
<h2>EV6 and EV9 battery campaigns</h2>
<p>The electric models add high-voltage battery and charging campaigns. One 2026 campaign, 26V431000, covered only eight EV6 and EV9 vehicles whose battery cells could contain misaligned electrodes, which shows how narrowly a campaign can be drawn when a maker traces a defect to a few cells. Others reach tens of thousands of cars through software. The ${h.a('recall-check', 'recall check')} lists each one by model year.</p>
<h2>Engines and theft, shared with Hyundai</h2>
<p>The Theta II engine campaigns and the anti-theft upgrade for key-start cars without an immobilizer apply to Kia as they do to Hyundai: the engine fix is a safety recall, the theft software is a service campaign that NHTSA does not list. The ${h.a('brand:hyundai', 'Hyundai page')} explains both in detail.</p>
`,
  faqs: [
    { q: 'Why does Kia have so many electrical recalls?', a: `Electrical faults lead Kia's list with ${f.compN(0)} campaigns since 2016. They include ABS modules that could short and burn, power seat motors, wiring harnesses and, on the EV6 and EV9, charging control units and battery cells. Several came with park-outside warnings, so check the advisory label in each campaign for your model year.` },
    { q: 'Do Kia and Hyundai share recall campaigns?', a: 'They usually file separate campaigns for the same defect, since each brand has its own US company, but the timing and the parts are often identical: the 2023 ABS fire recalls covered 1.7 million Kias and 1.6 million Hyundais within days of each other. If your Kia has a Hyundai twin, read both lists.' },
    { q: 'Is the Telluride park-outside recall fixed?', a: 'Kia dealers repair the seat motor wiring free under the campaign. Whether one particular Telluride has been repaired is recorded against its VIN: enter it on nhtsa.gov or Kia’s owner site. Until the campaign shows as completed, follow the advisory and park outdoors, away from buildings.' },
  ],
  related: ['brand:hyundai', 'recall-check', 'do-not-drive-recalls'],
});
