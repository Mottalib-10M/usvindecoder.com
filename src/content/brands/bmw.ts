import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('bmw');
export default defineBrand({
  slug: 'bmw',
  title: `BMW Recalls 2026: X5, X3, 3 Series by Model Year (NHTSA)`,
  description: `BMW recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.airbag} for air bag inflators and ${f.dnd} with a do-not-drive warning. Check any X5, X3 or 3 Series.`,
  h1: 'BMW recalls: X models, 3 Series and the rest',
  intro: `BMW appears in ${f.c10} NHTSA campaigns from 2016 to 2025, third of 18 brands; ${f.dnd} carried a do-not-drive warning. Check any BMW by model year below.`,
  resume: `For a brand selling far fewer cars in the US than Ford or Toyota, BMW appears in many campaigns: ${f.c10} between 2016 and 2025 in NHTSA's file, which ranks it third of the 18 brands we follow, with ${f.u10} vehicle notices. Two things explain it. BMW sells dozens of model variants, each recorded under its own name (330i, M340i, X3 xDrive30i, X3 M40i), so one defect produces long model lists and many campaigns. And older BMWs carried Takata inflators: ${f.airbag} BMW campaigns since 2016 concern air bag inflators, and ${f.dnd} carry a do-not-drive warning, the highest number among European brands, for 2000 to 2006 3 Series cars whose original inflators can rupture. Air bags (${f.compN(0)} campaigns) and the ${f.comp(1)} (${f.compN(1)}) lead the list. The largest campaign, ${f.big.id}, concerned a crankcase ventilation heater that could overheat and start a fire.`,
  body: (h) => `
<h2>Fires from a small heater</h2>
<p>${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} BMWs from 2006 to 2013, from the 128i to the X3 and the 5 Series: the heater of the positive crankcase ventilation valve could overheat, melt and, in rare cases, start a fire while the car was parked. It expanded an earlier campaign, 17V683000, on the same part. The ${f.comp(3)} category, which includes it, has ${f.compN(3)} BMW campaigns since 2016. A used BMW from those years should show both as completed.</p>
<h2>The X models lead</h2>
<p>Since 2021 the X5 appears in ${f.n(f.top[0][1])} campaigns, the X3 in ${f.n(f.top[1][1])} and the X7 in ${f.n(f.top[2][1])}, all built in Spartanburg, South Carolina, the largest BMW plant in the world. Recent campaigns on them concern 48-volt mild hybrid systems, steering parts and software. Because NHTSA records BMW models by their full designation, use the exact badge in the ${h.a('recall-check', 'recall check')}, or start from the VIN, which returns it.</p>
<h2>Old 3 Series and the do-not-drive warning</h2>
<p>NHTSA and BMW asked owners of some 2000 to 2006 3 Series cars with original Takata driver inflators not to drive them until the inflator is replaced, because inflators of that age rupture far more often. If you look at an old E46 3 Series, check the VIN before driving it home. The ${h.a('takata-airbag-recall', 'Takata guide')} explains the risk by age and climate, and the ${h.a('brand:mercedes-benz', 'Mercedes-Benz page')} compares the other German brand.</p>
`,
  faqs: [
    { q: 'Why does BMW have so many recall campaigns for its size?', a: `BMW appears in ${f.c10} campaigns from 2016 to 2025, third of 18 brands, because NHTSA lists its many engine and drivetrain variants as separate models and because older BMWs used Takata inflators, behind ${f.airbag} campaigns. A long model list in one campaign is common, so check the exact designation on your car.` },
    { q: 'Should I drive an old BMW 3 Series with an open air bag recall?', a: 'No. For certain 2000 to 2006 3 Series cars with original Takata driver inflators, BMW and NHTSA issued a do-not-drive warning: inflators that old and exposed to heat and humidity can rupture in a crash and injure occupants with metal fragments. A BMW dealer replaces the inflator free and can arrange towing.' },
    { q: 'What was the BMW PCV valve heater fire recall?', a: 'A pair of campaigns, in 2017 and 2022, on 2006 to 2013 BMWs including the 1, 3 and 5 Series, X3, X5 and Z4. The heater in the crankcase ventilation valve could overheat and start a fire even when the car was off. Dealers replace the valve and heater for free.' },
  ],
  related: ['brand:mercedes-benz', 'takata-airbag-recall', 'recall-check'],
});
