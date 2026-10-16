import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('jeep');
export default defineBrand({
  slug: 'jeep',
  title: `Jeep Recalls 2026: Grand Cherokee, Wrangler and Gladiator`,
  description: `Jeep recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.peakN} in ${f.peak} alone. Check any Grand Cherokee, Wrangler 4xe or Gladiator by its model year.`,
  h1: 'Jeep recalls: Grand Cherokee, Wrangler and the rest',
  intro: `Jeep appears in ${f.c10} NHTSA campaigns from 2016 to 2025; ${f.peak} was its worst year with ${f.peakN}, and 2026 already counts ${f.c26}. Check your Jeep by year below.`,
  resume: `Jeep campaigns are filed by FCA US, the American arm of Stellantis, and many of them also name Ram, Dodge and Chrysler models that share electronics and suppliers. Counting each campaign for every brand it names, Jeep appears in ${f.c10} vehicle campaigns received between 2016 and 2025, with ${f.u10} vehicle notices, and ${f.c26} in 2026 so far. The count rose sharply in ${f.peak}, to ${f.peakN} campaigns, driven by the plug-in hybrid 4xe models and the Wagoneer. The power train and the ${f.comp(1)} lead with ${f.compN(0)} and ${f.compN(1)} campaigns, then air bags. The Grand Cherokee and its long-wheelbase L version appear in ${f.n(f.top[0][1] + f.top[5][1])} campaigns since 2021 between them, the Wrangler in ${f.n(f.top[1][1])}. Jeep has ${f.po} campaigns with a park-outside warning, most of them for plug-in hybrid batteries.`,
  body: (h) => `
<h2>Wrangler and Grand Cherokee 4xe battery fires</h2>
<p>The plug-in hybrid 4xe versions of the Wrangler and Grand Cherokee were recalled more than once for high-voltage battery fires, with instructions to park outside and away from buildings, and not to charge, until the remedy was done. The first remedy was a software update; a later one replaced battery packs on some vehicles. A used 4xe should show every battery campaign as completed. The ${h.a('model:grand-cherokee', 'Grand Cherokee page')} lists the campaigns for each model year, gas and plug-in together.</p>
<h2>Death wobble is not a recall</h2>
<p>Owners of solid-axle Jeeps know the violent front-end shake called death wobble. Stellantis addressed it with a steering damper and service actions, not through a broad safety recall, so it does not appear in the campaign list. If a Wrangler or Gladiator you are considering shakes at highway speed, have the steering and suspension inspected regardless of its recall status.</p>
<h2>A 2026 surge in rearview camera campaigns</h2>
<p>In August 2026, campaign 26V531000 covered rearview camera faults on nearly every 2026 Jeep at once, the Wrangler, Gladiator, Compass, Cherokee and Grand Cherokee among them, together with Ram, Chrysler and Dodge models. Camera faults are one of the fastest-growing recall categories for every brand. The latest Jeep campaign in the file, ${f.recent.id}, was received on ${f.day(f.recent.date)}. Compare with the ${h.a('brand:ram', 'Ram page')}, which shares much of the same supplier base.</p>
`,
  faqs: [
    { q: 'Should I park my Jeep 4xe outside?', a: 'Only if it has an open battery campaign with a park-outside warning. In that case, follow it: park away from buildings and do not charge until the dealer applies the remedy. Check the VIN on nhtsa.gov or Jeep’s owner site; once the campaign shows as completed, the warning no longer applies.' },
    { q: 'Why do Jeep recalls often include Ram and Dodge models?', a: 'All four brands belong to Stellantis and are filed by FCA US. They share electronic modules, cameras, air bag control units and suppliers, so one defect can reach a Jeep Wrangler, a Ram 1500 and a Dodge Durango at once. Such a campaign counts for each brand it names in our tables.' },
    { q: 'Is the Jeep death wobble covered by a recall?', a: 'No safety recall covers it as such. Stellantis issued service bulletins and parts, such as an updated steering damper, but death wobble is treated as a repair and maintenance issue on solid front axles. A dealer can tell you whether a bulletin applies to your VIN; it will not appear in NHTSA’s recall list.' },
  ],
  related: ['model:grand-cherokee', 'brand:ram', 'do-not-drive-recalls'],
});
