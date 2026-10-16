import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('chrysler');
export default defineBrand({
  slug: 'chrysler',
  title: `Chrysler Recalls 2026: Pacifica Hybrid, Voyager, 300 by Year`,
  description: `Chrysler recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, the fewest of 18 brands, ${f.po} with park-outside warnings. Check a Pacifica Hybrid or Voyager.`,
  h1: 'Chrysler recalls: Pacifica, Voyager and 300',
  intro: `Chrysler appears in ${f.c10} NHTSA campaigns from 2016 to 2025, the fewest of the 18 brands here, but ${f.po} of them told owners to park outside. Check your minivan below.`,
  resume: `Chrysler today is essentially a minivan brand: the Pacifica, its plug-in hybrid version and the cheaper Voyager, after the 300 sedan ended in 2023. That small lineup gives it the lowest campaign count of the 18 brands we follow, ${f.c10} vehicle campaigns naming Chrysler between 2016 and 2025 in NHTSA's file, and ${f.c26} in 2026. Its vehicle notices, ${f.u10}, are high for so few campaigns because Chrysler models are often included in large Stellantis campaigns on shared modules, such as ${f.big.id} for cruise control. The Pacifica Plug-In Hybrid explains most of the ${f.po} park-outside campaigns: its high-voltage battery was recalled after fires in vehicles parked and switched off. Air bags lead the systems with ${f.compN(0)} campaigns; the hybrid propulsion system itself has ${f.n(f.b.components.find(([c]) => c.startsWith('Hybrid'))?.[1] ?? 0)}.`,
  body: (h) => `
<h2>Pacifica Hybrid battery fires</h2>
<p>From 2020, Stellantis recalled 2017 to 2018 Pacifica Hybrids, then later model years, because battery cells could short and burn. Owners were told to park outside and not to charge until the fix, first a battery management software update with a cell inspection, later battery replacement on some vans. A used Pacifica Hybrid should show each battery campaign as completed on its VIN; until then, the park-outside instruction stands, and it applies even in a garage at home.</p>
<h2>Minivan campaigns on the gasoline Pacifica and Voyager</h2>
<p>The gasoline vans carry campaigns on sliding doors, seats and the stability control software; a 2026 campaign, ${f.recent.id}, received on ${f.day(f.recent.date)}, concerned the ${f.recent.component.toLowerCase()} on 2025 and 2026 Pacificas and Voyagers. Since 2021, the Pacifica appears in ${f.n(f.top[0][1])} campaigns, the Voyager in ${f.n(f.top[1][1])} and the plug-in hybrid, listed separately by NHTSA, in ${f.n(f.top[2][1])}.</p>
<h2>Older Chryslers and the Town and Country</h2>
<p>The Town and Country minivan and the 200 sedan left the lineup in 2016 and 2017 but still appear when a shared part is recalled. To check one, use the ${h.a('recall-check', 'recall check')} with the exact model year, and read the ${h.a('brand:dodge', 'Dodge page')}: the Grand Caravan was the Town and Country's twin.</p>
`,
  faqs: [
    { q: 'Is it safe to charge a Pacifica Hybrid in my garage?', a: 'Only if every battery campaign on its VIN is completed. The Pacifica Plug-In Hybrid recalls told owners to park outside, away from structures, and not to charge until the dealer applied the remedy. Check the VIN on nhtsa.gov or Chrysler’s owner site; once the campaigns show as remedied, normal charging resumes.' },
    { q: 'Why does Chrysler have the fewest recalls of these brands?', a: `Because it sells the fewest models: the Pacifica, its plug-in version and the Voyager. With ${f.c10} campaigns from 2016 to 2025, Chrysler is last of our 18 brands by count, yet it shares many large Stellantis campaigns with Dodge, Jeep and Ram, which is why its vehicle notices are high.` },
    { q: 'Are Chrysler Voyager recalls the same as Pacifica recalls?', a: 'Mostly. The Voyager is a lower-priced Pacifica with the same body, engine and electronics, so most campaigns name both vans. Equipment only fitted to one version, such as the plug-in hybrid system or a specific seat, can produce a campaign for that version alone.' },
  ],
  related: ['brand:dodge', 'do-not-drive-recalls', 'recall-check'],
});
