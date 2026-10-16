import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('escape');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'escape', brand: 'ford',
  title: `Ford Escape Recalls by Model Year: ${f.c} NHTSA Campaigns`,
  description: `Ford Escape recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, with ${f.my(2013)} on the 2013 and ${f.my(2020)} on the 2020. Crash ratings and EPA mpg for each year.`,
  h1: 'Ford Escape recalls by model year',
  intro: `Two Escape generations stand out in NHTSA's file: the 2013 model with ${f.my(2013)} campaigns and the 2020 with ${f.my(2020)}. ${f.c} campaigns in all since 2012. Pick your year.`,
  resume: `The Escape's recall history has two peaks, each at the start of a generation. The 2013 model, first of the turbocharged EcoBoost Escapes, is covered by ${f.my(2013)} campaigns in NHTSA's file and the 2014 by ${f.my(2014)}; the middle years 2016 to 2019 carry only ${f.my(2016)} to ${f.my(2019)} each. Then the redesigned 2020 Escape, with a new hybrid and plug-in hybrid, brought ${f.my(2020)} campaigns, followed by ${f.my(2021)} on the 2021 and ${f.my(2022)} on the 2022. In all, ${f.c} campaigns cover Escape model years 2012 to 2026, counting the hybrid and plug-in names. The ${f.comp(0)} leads with ${f.compN(0)} campaigns, then the fuel system (${f.compN(1)}), with fuel leaks and fires among the reasons. NCAP has rated the Escape five stars overall every year since 2017; 2025 gas, hybrid and plug-in versions range from ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>A shifter bushing on three million Fords</h2>
<p>The largest campaign touching the Escape, ${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} Fords from 2013 to 2019, the Escape with the C-Max, Fusion, Transit Connect and Edge: a transmission shift cable bushing could detach, so the car might not be in the gear the driver selected and could roll away when parked. Dealers installed a new bushing and a protective cap. A used 2013 to 2019 Escape should have it done.</p>
<h2>Fuel leaks on the EcoBoost engines</h2>
<p>Several campaigns on the 2013 and 2014 Escape concerned the 1.6 liter EcoBoost engine, which could overheat, crack the cylinder head and leak oil onto hot parts, causing fires; later campaigns on the 2020 to 2022 hybrids and 1.5 liter models concerned fuel injectors and engine fires. The latest Escape campaign in the file, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns ${f.latest.years} model-year Escapes that were repaired incorrectly under an earlier campaign.</p>
<h2>Compare with the other Fords</h2>
<p>The ${h.a('model:explorer', 'Explorer')} and ${h.a('model:f-150', 'F-150')} pages follow the same layout. For the fuel cost of the hybrid against the gas Escape over your own mileage, use the ${h.a('mpg-by-vin', 'mpg lookup')}.</p>
`,
  faqs: [
    { q: 'What years of Ford Escape have the most recalls?', a: `The 2020 Escape, covered by ${f.my(2020)} campaigns in NHTSA's file, and the 2013, covered by ${f.my(2013)}: both are the first year of a generation. The 2021 and 2022 follow with ${f.my(2021)} and ${f.my(2022)}. The 2016 to 2019 Escapes have the fewest, between ${f.my(2019)} and ${f.my(2016)} campaigns each.` },
    { q: 'What was the Ford Escape rollaway recall?', a: 'A 2022 campaign on about 2.9 million 2013 to 2019 Escape, C-Max, Fusion, Transit Connect and Edge vehicles. The bushing linking the shift cable to the transmission could degrade and detach, so the vehicle might not be in park when the lever said park. Dealers replace the bushing free of charge.' },
    { q: 'Do Escape Hybrid and plug-in recalls appear here?', a: 'Yes. NHTSA uses Escape Hybrid and Escape PHEV as model names in some campaigns, and this page counts them with the gas Escape. The model-year tool lists every campaign for the year you pick, so a hybrid-only campaign appears next to those covering all versions.' },
  ],
  related: ['brand:ford', 'model:explorer'],
});
