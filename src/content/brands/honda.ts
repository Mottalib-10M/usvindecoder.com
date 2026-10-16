import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('honda');
export default defineBrand({
  slug: 'honda',
  title: `Honda Recalls 2026: CR-V, Civic, Accord, Pilot by Year`,
  description: `Honda recalls from NHTSA's file: ${f.c10} vehicle campaigns from 2016 to 2025, ${f.airbag} of them for air bag inflators. Look up any CR-V, Civic, Accord or Pilot by year.`,
  h1: 'Honda recalls, cars and motorcycles',
  intro: `${f.c10} NHTSA campaigns from 2016 to 2025, ${f.airbag} of them for air bag inflators, ${f.c26} in 2026 so far.`,
  resume: `Honda's recall record is dominated by one supplier. American Honda was the largest customer of Takata, whose ammonium nitrate air bag inflators can rupture and spray metal fragments, and it ran some of the largest inflator campaigns in US history: ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles on its own. Counting every campaign naming the Honda make, NHTSA's file holds ${f.c10} between 2016 and 2025 and ${f.u10} vehicle notices; ${f.airbag} of those campaigns concern air bag inflators. Honda never recorded a do-not-drive advisory under its own make in that period, but the oldest Takata-equipped Hondas, from 2001 to 2003, have been under a do-not-drive warning from NHTSA since 2016. The make also covers Honda motorcycles and scooters, which file under American Honda too, so a fuel pump campaign on a cruiser shares the list with the CR-V.`,
  body: (h) => `
<h2>The fuel pump campaign of 2023</h2>
<p>The second largest Honda campaign of the period, ${f.big2.id}, received on ${f.day(f.big2.date)}, covered ${f.units(f.big2.units)} vehicles across the Accord, Civic, CR-V, HR-V and Ridgeline, with fuel pumps that could fail and stall the engine. Fuel system defects rank third among Honda's recalled systems with ${f.compN(2)} campaigns, a higher share than at most brands. The remedy is a replacement pump, done free at any Honda dealer.</p>
<h2>Which models appear most</h2>
<p>Since 2021, the Pilot (${f.n(f.top[0][1])} campaigns), the Odyssey (${f.n(f.top[1][1])}) and the Ridgeline (${f.n(f.top[2][1])}) appear most, all built on Honda's large light-truck platform in Alabama and Ohio. The hybrid CR-V and Accord follow, as NHTSA lists them separately from the gasoline versions. Model year details are on the ${h.a('model:cr-v', 'CR-V')}, ${h.a('model:civic', 'Civic')} and ${h.a('model:accord', 'Accord')} pages.</p>
<h2>Acura and the older Takata cars</h2>
<p>Acura models are recorded under their own make, so the many inflator campaigns on the TL, MDX and RDX are not counted above. If you are buying a Honda or Acura built before 2015, check the VIN on nhtsa.gov for an open inflator recall before anything else; the ${h.a('takata-airbag-recall', 'guide to the Takata recall')} explains which vehicles are most at risk.</p>
`,
  faqs: [
    { q: 'Is my old Honda still affected by the Takata recall?', a: 'Possibly. Honda recalled frontal inflators on most 2001 to 2016 models, and some cars were never repaired, or received a replacement inflator that was itself later recalled. Enter the VIN on nhtsa.gov or Honda’s owner site; an open air bag campaign on a 2001 to 2003 Honda or Acura comes with a do-not-drive warning.' },
    { q: 'Are Honda motorcycle recalls included in these numbers?', a: 'Yes. American Honda files campaigns for cars, motorcycles, scooters and off-road vehicles, and NHTSA records them all under the Honda make. That is why a campaign on a VT1300CX cruiser can appear among Honda campaigns. Use the recall check with your model name to see only your vehicle.' },
    { q: 'Why does the Honda Pilot appear in so many recalls?', a: `The Pilot shares its platform, engine and much of its electronics with the Passport, Odyssey and Ridgeline, so one campaign often names all four. Since 2021 the Pilot appears in ${f.n(f.top[0][1])} Honda campaigns. Check the campaigns for your model year, since several concern only one generation.` },
  ],
  related: ['model:cr-v', 'model:civic', 'model:accord', 'takata-airbag-recall'],
});
