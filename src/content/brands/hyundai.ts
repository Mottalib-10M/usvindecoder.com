import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('hyundai');
export default defineBrand({
  slug: 'hyundai',
  title: `Hyundai Recalls 2026: Tucson, Santa Fe, Elantra by Year`,
  description: `Hyundai recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.po} of them with a park-outside fire warning. Check any Tucson, Santa Fe or Elantra by year.`,
  h1: 'Hyundai recalls and the park-outside warnings',
  intro: `Hyundai appears in ${f.c10} NHTSA campaigns from 2016 to 2025, and ${f.po} of them told owners to park outside because of a fire risk. Check your Hyundai by model year.`,
  resume: `No brand in our table issued more park-outside advisories than Hyundai: ${f.po} campaigns since 2016 carried NHTSA's instruction to park outdoors and away from structures, because a component could catch fire with the car switched off. Most concerned the anti-lock brake module, where brake fluid could leak onto the circuit board and cause a short. ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} older Hyundais for that ABS fault, and a parallel Kia campaign covered its twins. In all, NHTSA's file holds ${f.c10} vehicle campaigns naming Hyundai between 2016 and 2025, ${f.u10} vehicle notices, with the ${f.comp(0)} first among recalled systems (${f.compN(0)} campaigns). Genesis was a Hyundai model before becoming a brand in 2017; its newer models are recorded under Genesis, which is why a 2015 Hyundai Genesis and a 2018 Genesis G80 can share one campaign.`,
  body: (h) => `
<h2>Engines, fires and the Theta II settlement</h2>
<p>Before the ABS fires, Hyundai's best known problem was the Theta II 2.0 and 2.4 liter engine, which could seize after bearing wear, sometimes with an engine fire. Hyundai and Kia recalled hundreds of thousands of Sonata, Santa Fe and Tucson engines from 2015 onward, extended engine warranties through a class settlement, and paid civil penalties to NHTSA in 2020 over the timeliness of those recalls. A used Hyundai from 2011 to 2019 with one of those engines should have the knock sensor software update, a safety recall remedy, in its record.</p>
<h2>Ioniq and the electric models</h2>
<p>The Ioniq 5 appears in ${f.n(f.top[4][1])} campaigns since 2021, many for the integrated charging control unit, which could stop charging the 12-volt battery and cut power while driving. Hyundai's recent campaigns, like the brand's, include seat and occupant detection software on the Ioniq 9 and the large Palisade. The ${h.a('model:tucson', 'Tucson page')} lists each model year of Hyundai's best seller, with its hybrid and plug-in versions.</p>
<h2>Theft is not a recall</h2>
<p>Many 2011 to 2022 Hyundais without push-button start lacked an immobilizer, and thefts surged in 2022. Hyundai answered with a free anti-theft software upgrade, a service campaign rather than a safety recall, so it does not appear in NHTSA's list. Ask a Hyundai dealer whether your VIN has it. The ${h.a('brand:kia', 'Kia page')} covers the same issues on Kia models.</p>
`,
  faqs: [
    { q: 'Why do so many Hyundai recalls say to park outside?', a: `Because the defect can start a fire with the ignition off. ${f.po} Hyundai campaigns since 2016 carried that warning, most for anti-lock brake modules where fluid could reach the electronics and short them. Until the dealer installs the fix, often a fuse or a new module, park outdoors, away from buildings and other cars.` },
    { q: 'Is the Hyundai anti-theft software update a recall?', a: 'No. The update for 2011 to 2022 key-start Hyundais without an immobilizer is a free service campaign, not a federal safety recall, so NHTSA’s recall list does not show it. A Hyundai dealer can check your VIN and install it; the same applies to the matching Kia campaign.' },
    { q: 'Are Genesis recalls counted with Hyundai?', a: 'Only for vehicles sold as a Hyundai. Until the 2016 model year the Genesis sedan was a Hyundai model, so its campaigns name Hyundai. From 2017, Genesis G70, G80, G90 and GV models are recorded under the Genesis make. A campaign that covers both names counts here for the Hyundai part.' },
  ],
  related: ['model:tucson', 'brand:kia', 'do-not-drive-recalls'],
});
