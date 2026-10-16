import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('toyota');
export default defineBrand({
  slug: 'toyota',
  title: `Toyota Recalls 2026: RAV4, Camry, Tacoma and Tundra by Year`,
  description: `Toyota recalls from NHTSA's file: ${f.c10} vehicle campaigns from 2016 to 2025, ${f.c26} so far in 2026, air bags first. Look up any RAV4, Camry, Tacoma or Tundra by year.`,
  h1: 'Toyota recalls: NHTSA campaigns since 2016',
  intro: `Toyota filed ${f.c10} vehicle campaigns from 2016 to 2025, about ${Math.round(f.b.campaigns10 / 10)} a year, and ${f.c26} in 2026 so far. Pick a Toyota model to see its campaigns.`,
  resume: `Toyota sells more vehicles in the United States than any brand except Ford and Chevrolet, yet it appears in far fewer recall campaigns: ${f.c10} between 2016 and 2025 in NHTSA's file, with ${f.u10} vehicle notices. The yearly count is unusually flat, between ${f.y(2021)} and ${f.y(2016)} campaigns, which reflects a small lineup built on few platforms rather than an absence of defects. When a Toyota campaign happens, it tends to be large: ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles for an ${f.big.component.toLowerCase()} fault, and a 2023 campaign replaced or inspected the 12-volt batteries of ${f.units(f.big2.units)} RAV4s. Air bags lead the list of recalled systems with ${f.compN(0)} campaigns. Lexus vehicles are recorded under their own make and do not count here, although many Lexus models share campaigns with their Toyota twins.`,
  body: (h) => `
<h2>The Tundra, not the RAV4, leads the model list</h2>
<p>Since 2021 the Tundra pickup appears in ${f.n(f.top[0][1])} Toyota campaigns and its hybrid version in ${f.n(f.top[1][1])} more, ahead of the Highlander (${f.n(f.top[2][1])}). The third-generation Tundra, launched for 2022 with a twin-turbo V6, had an engine recall that required replacing the engine itself on some trucks after machining debris was found. For the best sellers, the ${h.a('model:rav4', 'RAV4')}, ${h.a('model:camry', 'Camry')} and ${h.a('model:tacoma', 'Tacoma')} pages list every model year with its crash ratings and mpg.</p>
<h2>Hybrids are separate models in NHTSA's records</h2>
<p>Toyota's lineup is now mostly hybrid, and NHTSA keeps the hybrid as its own model when the maker files it that way: RAV4, RAV4 Hybrid and RAV4 Prime, or Camry and Camry Hybrid. A campaign on the hybrid inverter or the motor generator ECU appears only under the hybrid name. When you check a Toyota, look at each version the recall check offers for your model year; the VIN decoder does this matching automatically.</p>
<h2>Shared campaigns with Subaru and Lexus</h2>
<p>The electric bZ4X, its 2026 successor bZ and the Subaru Solterra are developed together, and Toyota files their campaigns, including the 2022 recall over hub bolts that could loosen and let a wheel detach. Those campaigns are counted for Toyota here and for Subaru on the ${h.a('brand:subaru', 'Subaru page')}. Toyota has received ${f.nhtsa} campaigns since 2016 that NHTSA's file attributes to agency influence rather than to the maker alone.</p>
`,
  faqs: [
    { q: 'Does Toyota really have fewer recalls than other brands?', a: `By campaign count, yes: ${f.c10} from 2016 to 2025, against several hundred for Ford or Mercedes-Benz. Toyota sells fewer distinct models and files fewer heavy-duty and commercial variants. Individual Toyota campaigns can still be very large, so the number of vehicles involved is a better measure of how likely your own car is concerned.` },
    { q: 'Are Lexus recalls counted with Toyota?', a: 'No. Lexus is a Toyota brand and its campaigns are filed by Toyota Motor Engineering & Manufacturing, but NHTSA records the vehicles under the Lexus make. A campaign covering a Toyota and a Lexus twin, for example the Highlander and RX, counts here for the Toyota part only.' },
    { q: 'Why is my RAV4 Hybrid recall not showing under RAV4?', a: 'Because NHTSA records the hybrid as a separate model, RAV4 Hybrid, when Toyota files it that way, and the plug-in as RAV4 Prime or RAV4 Plug-In Hybrid. Choose the exact version in the model list, or start from the VIN, which picks the right name for you.' },
  ],
  related: ['model:rav4', 'model:camry', 'model:tacoma'],
});
