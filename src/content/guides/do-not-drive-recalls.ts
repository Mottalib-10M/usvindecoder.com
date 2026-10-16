import { definePage } from '../../lib/page-types';
import { RECALLS as R, n, day, units } from '../../lib/data';

const A = R.advisories;
const years = Object.keys(A.byYear);
const rows = A.recent.slice(0, 12).map((c) => [`<span class="font-mono">${c.id}</span>`, day(c.date), c.dnd ? 'Do not drive' : 'Park outside', c.models.slice(0, 2).join('; ') + (c.models.length > 2 || c.more ? ' and more' : ''), units(c.units)]);
const po25 = A.byYear['2025'].po; const po16 = A.byYear['2016'].po;

export default definePage({
  id: 'do-not-drive-recalls', slug: 'do-not-drive-recalls', kind: 'guide', group: 'guides', order: 36,
  nav: 'Do-not-drive recalls', card: 'The most urgent advisories, year by year, with the latest ones',
  title: 'Do Not Drive Recalls 2026: Park Outside Warnings by Year',
  description: `Do-not-drive and park-outside recalls from NHTSA's file: ${n(A.dnd10)} and ${n(A.po10)} campaigns from 2016 to 2025, the latest listed. What each warning means and what to do.`,
  h1: 'Do-not-drive and park-outside recalls',
  intro: `NHTSA flags its most urgent recalls with two warnings: do not drive, and park outside. From 2016 to 2025, ${n(A.dnd10)} campaigns carried the first and ${n(A.po10)} the second. The latest are listed below.`,
  resume: `Most recall notices ask owners to book a repair when parts are available. A small share are urgent enough for NHTSA and the manufacturer to add a consumer advisory, which the recall file records in two fields. "Do not drive" means the defect can cause a crash or serious injury at any moment, so the vehicle should not be used until the remedy is applied; the oldest Takata air bag inflators, wheels that can come off and steering parts that can separate are typical cases. "Park outside" means a fire can start even with the vehicle switched off, so it should be parked outdoors, away from buildings, until repaired; ABS modules, wiring, high-voltage batteries and seat motors are typical. Counting vehicle campaigns of every kind, including buses, trucks and RVs, NHTSA's file holds ${n(A.dnd10)} campaigns with a do-not-drive warning and ${n(A.po10)} with a park-outside warning received between 2016 and 2025. Park-outside warnings have become far more common: ${po16} in 2016, ${po25} in 2025.`,
  body: (h) => `
<p>Pick a year to see how many campaigns NHTSA received with each warning.</p>
${h.mini('advisory')}
<h2>The latest campaigns with an advisory</h2>
${h.table(['Campaign', 'Received', 'Warning', 'Vehicles', 'Units'], rows, `From NHTSA's recall file; ${n(A.recent.length)} most recent campaigns with either warning shown, all vehicle types.`, ['l', 'l', 'l', 'l', 'r'])}
<h2>Why park-outside warnings are rising</h2>
<p>The rise follows the electronics. Anti-lock brake modules with circuit boards exposed to brake fluid, power seat motors, charging units and high-voltage batteries in plug-in hybrids and electric vehicles can all overheat or short when the car is off. When a maker cannot rule out a fire while parked, it asks owners to park outside until the fix. Hyundai and Kia account for many of these campaigns, as their ${h.a('brand:hyundai', 'Hyundai')} and ${h.a('brand:kia', 'Kia')} pages show, with plug-in hybrids from Stellantis, BMW and others.</p>
<h2>What to do if your vehicle has one</h2>
<p>For a do-not-drive campaign, stop using the vehicle and call a dealer of the brand with the campaign number. Makers commonly tow the vehicle to the dealer at no charge and, for many campaigns, provide a rental or loaner while parts are on order; ask, because the offer is not always in the letter. For a park-outside campaign, park outdoors and away from your house, carport and other cars, do not charge a plug-in vehicle if the notice says so, and book the repair. Both warnings apply to the vehicle, not the owner: a used car you just bought is covered too, and the repair is free within the federal limits explained in the ${h.a('how-to-check-car-recalls', 'recall guide')}.</p>
${h.box('Check the VIN, not only the model', '<p>An advisory campaign often covers part of a model year. Enter the VIN on nhtsa.gov to see whether this vehicle is included and whether the repair is done; until then, follow the warning.</p>')}
<h2>Buses, trucks, RVs and trailers count too</h2>
<p>Many advisories in the table concern vehicles most drivers never think of: fire trucks, school buses, motorhomes, cargo trailers and medium-duty chassis, where a wheel or a brake line failure endangers others on the road. NHTSA's file treats them like cars. If you own an RV or a trailer, check its VIN as well as your car's; the makers of these vehicles are smaller, their notices go to the first registered owner, and second owners often never receive them. Registering the vehicle on the maker's owner site is the simplest way to get future notices.</p>
<h2>Air bags: the oldest do-not-drive warnings</h2>
<p>The longest-running do-not-drive advisories concern Takata inflators in older Hondas, Acuras, Fords, Mazdas, BMWs and others, which NHTSA asked owners to stop driving until replaced because aged inflators can rupture violently. The ${h.a('takata-airbag-recall', 'Takata guide')} explains which vehicles are concerned. To look up your own vehicle, use the ${h.a('recall-check', 'recall check')} or the ${h.a('home', 'VIN decoder')}: campaigns with an advisory carry a red label.</p>
`,
  faqs: [
    { q: 'What does a do-not-drive recall mean?', a: 'That NHTSA and the maker consider the vehicle unsafe to use until it is repaired, because the defect can cause a crash or injury without warning. Stop driving it and contact a dealer of the brand, which usually arranges towing. The repair is free within the federal remedy limits, whoever owns the vehicle.' },
    { q: 'Why would a recall tell me to park outside?', a: 'Because the defect can start a fire with the vehicle off, for example a shorting brake module, seat motor or high-voltage battery. Parking outdoors and away from buildings limits the damage if it happens. Keep doing so until the dealer applies the remedy and the VIN shows the campaign as completed.' },
    { q: 'Will the dealer give me a loaner during a do-not-drive recall?', a: 'Often, but it depends on the maker and the campaign. Many manufacturers offer towing and a rental or loaner vehicle for do-not-drive campaigns, especially when parts are delayed. The offer is not required by federal law, so ask the dealer or the maker’s customer service and mention the campaign number.' },
  ],
  related: ['takata-airbag-recall', 'how-to-check-car-recalls', 'recall-check', 'recalls', 'home'],
  sources: ['recallfile', 'nhtsarecalls', 'recalls'],
});
