import { definePage } from '../../lib/page-types';
import { RECALLS as R, n, day, units } from '../../lib/data';

const A = R.airbags;
const yearRows = Object.entries(A.inflatorByYear).map(([y, k]) => [y === '2026' ? '2026 (to date)' : y, n(k)]);
const big = A.largest.map((c) => [`<span class="font-mono">${c.id}</span>`, day(c.date), c.models.slice(0, 3).join('; ') + (c.models.length > 3 || c.more ? ' and more' : ''), units(c.units)]);

export default definePage({
  id: 'takata-airbag-recall', slug: 'takata-airbag-recall', kind: 'guide', group: 'guides', order: 37,
  nav: 'Takata air bag recall', card: 'Which vehicles, how many campaigns, and how to check yours',
  title: 'Takata Airbag Recall 2026: Check Your Car, Brand by Brand',
  description: `Takata airbag recall in 2026: ${n(A.inflator)} inflator campaigns in NHTSA's file since 2016, the largest ones listed, campaigns by brand. Check your VIN for free.`,
  h1: 'Takata air bag recall: is your car still affected?',
  intro: `The Takata inflator recalls are the largest in US history and some cars are still unrepaired. NHTSA's file holds ${n(A.inflator)} air bag inflator campaigns received since 2016. Check yours by brand below.`,
  resume: `Takata's frontal air bag inflators used ammonium nitrate without a drying agent, a propellant that degrades with years of heat, humidity and temperature cycling until it can burn too fast and rupture the inflator housing, spraying metal fragments into the cabin. The ruptures killed and injured people in the United States, led NHTSA to coordinate the largest recall in its history from 2015, with tens of millions of inflators in vehicles of about twenty brands, and drove Takata into bankruptcy in 2017. Risk rises with the age of the inflator and with hot, humid climates, which is why NHTSA prioritized the Gulf Coast states and the oldest vehicles, and why some 2001 to 2003 Hondas and Acuras, 2006 Ford Rangers and Mazda B-Series pickups, and older BMWs are under a do-not-drive warning. Counting every vehicle campaign whose air bag summary mentions an inflator, NHTSA's file holds ${n(A.inflator)} campaigns received since 2016, ${units(A.inflatorUnits)} vehicle notices, including later inflator defects from other suppliers.`,
  body: (h) => `
<p>Pick a brand to see its air bag inflator campaigns since 2016.</p>
${h.mini('airbag')}
<h2>Inflator campaigns per year</h2>
${h.table(['Year received', 'Inflator campaigns'], yearRows, 'Vehicle campaigns whose component is air bags and whose defect summary mentions an inflator, all makes.', ['l', 'r'])}
<p>The peak of 2016 to 2018 reflects the phased Takata recalls, which NHTSA scheduled by risk until 2019. Later campaigns include replacement inflators that were themselves defective, and other suppliers, such as the ARC inflators that NHTSA has investigated, which affect some recent vehicles.</p>
<h2>The largest inflator campaigns since 2016</h2>
${h.table(['Campaign', 'Received', 'Vehicles', 'Units'], big, undefined, ['l', 'l', 'l', 'r'])}
<h2>Why heat and humidity matter</h2>
<p>Ammonium nitrate changes crystal structure as it goes through temperature cycles, and absorbs moisture over the years. The propellant tablets become porous, so when the air bag fires they burn faster than designed, the pressure inside the steel inflator exceeds its strength, and the housing breaks into fragments. NHTSA's analysis found ruptures far more frequent in vehicles that had spent years in Florida, along the Gulf Coast, in Puerto Rico and in Hawaii, which is why those regions were served first. A car that moved from a cold state to a hot one carries its history with it: age counts more than the current address.</p>
<h2>How to check your vehicle</h2>
<p>Enter the VIN on ${h.src('nhtsarecalls', 'nhtsa.gov/recalls')}: an open air bag campaign shows up with its number. If your car is from the 2000s, has never had an air bag replaced and spent years in a hot, humid state, treat it as urgent. The replacement is free at any dealer of the brand, whatever the age of the car, because the original remedy obligation attached when each campaign was announced, and makers have kept offering it; some send mobile technicians or arrange towing. Do not disable an air bag yourself.</p>
<h2>Replacement inflators can be recalled too</h2>
<p>Early in the crisis, some makers replaced faulty inflators with new Takata inflators of the same design, as a temporary fix, then recalled those replacements later. A car that had its air bag replaced in 2015 or 2016 can therefore have a new open campaign. The VIN check shows it. Used parts are another risk: an inflator taken from a salvaged car and installed after a crash can be a recalled one, which the VIN does not reveal.</p>
<h2>Brands and models</h2>
<p>Honda was Takata's largest customer and has the most inflator campaigns, followed by BMW and Mazda among our brands; the ${h.a('brand:honda', 'Honda')}, ${h.a('brand:bmw', 'BMW')} and ${h.a('brand:mazda', 'Mazda')} pages list them. For all urgent advisories, see the ${h.a('do-not-drive-recalls', 'do-not-drive recall page')}, and run any VIN through the ${h.a('home', 'decoder')}, which shows campaigns with their warnings.</p>
`,
  faqs: [
    { q: 'Is the Takata recall still going on in 2026?', a: 'Yes, for unrepaired vehicles. Most inflators have been replaced, but some cars were never brought in, and makers still contact owners and replace inflators free. NHTSA continues to report deaths in old, unrepaired vehicles. Check the VIN of any older car, especially one from a hot and humid state.' },
    { q: 'How do I know if my air bag was already replaced?', a: 'Enter the VIN on nhtsa.gov or the maker’s owner site: a completed campaign no longer appears as open. A dealer can also print the service history. If your car received a replacement in 2015 or 2016, check again, since some temporary replacements were recalled later.' },
    { q: 'Which cars have a do-not-drive warning for Takata?', a: 'NHTSA and the makers asked owners not to drive certain 2001 to 2003 Honda and Acura models, 2006 Ford Ranger and Mazda B-Series pickups and some older BMW 3 Series, X5 and other models with original inflators, until they are replaced. Their inflators are the oldest and most likely to rupture.' },
    { q: 'Does the recall repair cost anything on a very old car?', a: 'No. Makers replace Takata inflators free of charge on vehicles in these campaigns, and many arrange towing for do-not-drive cars. The general 15-year limit on free remedies is counted to the recall notice, and the Takata campaigns were announced while these vehicles were within it.' },
  ],
  related: ['do-not-drive-recalls', 'how-to-check-car-recalls', 'brand:honda', 'recall-check', 'home'],
  sources: ['recallfile', 'nhtsarecalls', 'remedy'],
});
