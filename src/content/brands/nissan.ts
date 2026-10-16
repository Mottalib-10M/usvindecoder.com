import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('nissan');
export default defineBrand({
  slug: 'nissan',
  title: `Nissan Recalls 2026: Rogue, Altima, Sentra, Frontier by Year`,
  description: `Nissan recalls from NHTSA's file: ${f.c10} vehicle campaigns from 2016 to 2025 and ${f.c26} in 2026. Check any Rogue, Altima, Sentra, Frontier or Pathfinder by model year.`,
  h1: 'Nissan recalls by model year',
  intro: `Nissan filed ${f.c10} vehicle recall campaigns with NHTSA from 2016 to 2025, ${f.peakN} of them in ${f.peak}, its busiest year. Check any Nissan by year and model.`,
  resume: `Nissan North America appears in ${f.c10} vehicle campaigns received by NHTSA between 2016 and 2025, ${f.u10} vehicle notices, and ${f.c26} more in 2026 so far, which places it in the lower half of the 18 brands we follow. Its record is uneven: only ${f.y(2019)} campaigns in 2019, then ${f.peakN} in ${f.peak}. Air bags lead the recalled systems with ${f.compN(0)} campaigns, then the ${f.comp(1)} (${f.compN(1)}). Two campaigns stand out by size. ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles for passenger air bag occupant sensing, across the Altima, Maxima, Sentra, Pathfinder, LEAF and NV200. ${f.big2.id}, in ${new Date(f.big2.date).getUTCFullYear()}, concerned the secondary hood latch of ${f.units(f.big2.units)} Altimas, which could let the hood fly open at speed if the primary latch was released. Infiniti campaigns are filed by Nissan but recorded under the Infiniti make.`,
  body: (h) => `
<h2>The Rogue, Nissan's most recalled model</h2>
<p>The Rogue is Nissan's best seller and appears in ${f.n(f.top[0][1])} campaigns received since 2021, more than any other Nissan. Campaigns on recent Rogues concern the variable compression turbo engine introduced for 2022, steering, and software. The ${h.a('model:rogue', 'Rogue page')} lists each model year since 2012 with its campaigns, crash ratings and EPA mileage. The Sentra and the Frontier pickup come next with ${f.n(f.top[1][1])} campaigns each.</p>
<h2>CVT complaints are not recalls</h2>
<p>Many Nissan owners know the brand for its continuously variable transmissions, which drew class actions and warranty extensions on the Rogue, Altima, Sentra and Versa. Those extensions are not safety recalls: they do not appear in NHTSA's campaign file, and the lookup above will not show them. Ask a Nissan dealer whether a warranty extension covers your VIN, separately from the safety recall status, which is on ${h.src('nhtsarecalls', 'nhtsa.gov/recalls')}.</p>
<h2>Park-outside campaigns</h2>
<p>Nissan has ${f.po} campaigns with a park-outside warning since 2016, for fire risks on ABS units and wiring. Those are the campaigns not to put off: the fire can start with the car parked and switched off. The ${h.a('do-not-drive-recalls', 'advisory guide')} shows how often makers issue them.</p>
`,
  faqs: [
    { q: 'Is the Nissan CVT problem a recall?', a: 'No. Transmission complaints on Nissan CVTs led to extended warranties and legal settlements on several models, but NHTSA has not classed them as a safety defect requiring a recall campaign. A warranty extension is tied to the VIN in Nissan’s records; a Nissan dealer can confirm whether yours is covered and until what mileage.' },
    { q: 'What was the Nissan hood latch recall?', a: `Campaign ${f.big2.id} covered ${f.units(f.big2.units)} 2013 to 2018 Altimas. Corrosion could stop the secondary hood latch from holding, so a hood released by the inside lever could fly open while driving. Dealers replaced or adjusted the latch for free. A used Altima from those years should show the remedy as completed.` },
    { q: 'Are Infiniti models covered here?', a: 'No. Infiniti is Nissan’s luxury brand and its campaigns are filed by Nissan North America, but NHTSA records them under the Infiniti make. A campaign that names both, such as one covering the Armada and the QX80, counts here for the Nissan model only.' },
  ],
  related: ['model:rogue', 'do-not-drive-recalls'],
});
