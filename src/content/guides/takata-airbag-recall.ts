import { definePage } from '../../lib/page-types';
import { RECALLS as R, n, day, units } from '../../lib/data';

const A = R.airbags;
const yearRows = Object.entries(A.inflatorByYear).map(([y, k]) => [y === '2026' ? '2026 (to date)' : y, n(k)]);
const big = A.largest.map((c) => [`<span class="font-mono whitespace-nowrap">${c.id}</span>`, day(c.date), c.models.slice(0, 3).join('; ') + (c.models.length > 3 || c.more ? ' and more' : ''), units(c.units)]);

export default definePage({
  id: 'takata-airbag-recall', slug: 'takata-airbag-recall', kind: 'guide', group: 'guides', order: 37,
  nav: 'Takata air bag recall', card: 'Which vehicles, how many campaigns, and how to check yours',
  title: 'Takata Airbag Recall 2026: Check Your Car, Brand by Brand',
  description: `Takata airbag recall in 2026: ${n(A.inflator)} inflator campaigns in NHTSA's file since 2016, the largest ones listed, campaigns by brand. Check your VIN for free.`,
  h1: 'Takata air bag recall: is your car still affected?',
  intro: `The Takata inflator recalls are the largest in US history and some cars are still unrepaired. NHTSA's file holds ${n(A.inflator)} air bag inflator campaigns received since 2016. Check yours by brand below.`,
  resume: `Takata's frontal air bag inflators used ammonium nitrate without a drying agent, a propellant that degrades with years of heat, humidity and temperature cycling until it can burn too fast and rupture the inflator housing, spraying metal fragments into the cabin. NHTSA has confirmed 28 deaths in the United States from exploding Takata PSAN inflators, and at least 400 people are alleged to have been injured. All scheduled recalls have been filed: about 67 million air bags (priority groups 1 to 12) from 19 vehicle manufacturers, and NHTSA ordered the makers to replace the oldest air bags, with the longest exposure to heat and humidity, first. That is why some 2001 to 2003 Hondas and Acuras and 2006 Ford Ranger and Mazda B-Series pickups carry a do-not-drive warning on NHTSA's Takata page, and why the recall file flags air bag campaigns of BMW, Mazda, Ford, the Chrysler group, Nissan, Mitsubishi and Toyota with the same advisory. Counting every vehicle campaign whose air bag summary mentions an inflator, NHTSA's file holds ${n(A.inflator)} campaigns received since 2016, ${units(A.inflatorUnits)} vehicle notices, including later inflator defects from other suppliers.`,
  body: (h) => `
<p>Pick a brand to see its air bag inflator campaigns since 2016.</p>
${h.mini('airbag')}
<h2>Inflator campaigns per year</h2>
${h.table(['Year received', 'Inflator campaigns'], yearRows, 'Vehicle campaigns whose component is air bags and whose defect summary mentions an inflator, all makes.', ['l', 'r'])}
<p>The peak of 2016 to 2018 reflects the phased Takata recalls, which NHTSA scheduled by risk until 2019. Later campaigns include replacement inflators that were themselves defective, and other suppliers, such as the ARC inflators that NHTSA has investigated, which affect some recent vehicles.</p>
<h2>The largest inflator campaigns since 2016</h2>
${h.table(['Campaign', 'Received', 'Vehicles', 'Units'], big, undefined, ['l', 'l', 'l', 'r'])}
<h2>Why heat and humidity matter</h2>
<p>Ammonium nitrate changes crystal structure as it goes through temperature cycles, and absorbs moisture over the years. The propellant tablets become porous, so when the air bag fires they burn faster than designed, the pressure inside the steel inflator exceeds its strength, and the housing breaks into fragments. NHTSA's testing and field data show that older air bags in vehicles with prolonged exposure to hot and humid environments are far more likely to explode, which is why the oldest vehicles were served first. NHTSA also explains that a car that only spends winters in a hot, humid place does not get the same continuous exposure as one driven there year-round for many years.</p>
<h2>How to check your vehicle</h2>
<p>Enter the VIN on ${h.src('nhtsarecalls', 'nhtsa.gov/recalls')}: an open air bag campaign shows up with its number. If your car is from the 2000s, has never had an air bag replaced and spent years in a hot, humid state, treat it as urgent. The replacement is free at a dealer of the brand: NHTSA's Takata page says every affected air bag will be replaced for free, and Ford and Mazda provide towing and loaner vehicles for the do-not-drive pickups. Do not ask a dealer to disable the air bag while you wait: NHTSA notes that a disabled air bag has a 100 percent chance of failing to protect you in a crash.</p>
<h2>Replacement inflators can be recalled too</h2>
<p>A small number of makers replaced older Takata air bags with newly made versions of the same part, which NHTSA calls an “interim” or “like for like” repair: it lowers the risk, but those parts must be replaced again, free, by a final repair. A car that had an interim repair can therefore have a new open campaign. The VIN check shows it. Used parts are another risk: an inflator taken from a salvaged car and installed after a crash can be a recalled one, which the VIN does not reveal.</p>
<h2>Brands and models</h2>
<p>Honda was Takata's largest customer and has the most inflator campaigns, followed by BMW and Mazda among our brands; the ${h.a('brand:honda', 'Honda')}, ${h.a('brand:bmw', 'BMW')} and ${h.a('brand:mazda', 'Mazda')} pages list them. For all urgent advisories, see the ${h.a('do-not-drive-recalls', 'do-not-drive recall page')}, and run any VIN through the ${h.a('home', 'decoder')}, which shows campaigns with their warnings.</p>
`,
  faqs: [
    { q: 'Is the Takata recall still going on in 2026?', a: 'Yes, for unrepaired vehicles. All scheduled recalls have been filed, about 67 million air bags, and makers still replace them free. NHTSA has confirmed 28 US deaths from exploding Takata inflators. Check the VIN of any older car, especially one that spent years in a hot and humid state.' },
    { q: 'How do I know if my air bag was already replaced?', a: 'Enter the VIN on nhtsa.gov or the maker’s owner site: a completed campaign no longer appears as open. A dealer can also print the service history. If your car received an interim replacement, check again: NHTSA says those parts need a final, free repair as well.' },
    { q: 'Which cars have a do-not-drive warning for Takata?', a: 'NHTSA’s Takata page names certain 2001 to 2003 Honda and Acura models and 2006 Ford Ranger and Mazda B-Series pickups. In NHTSA’s recall file, air bag campaigns of BMW (model years 1999 to 2014), Mazda, Ford, Lincoln, Mercury, Chrysler, Dodge, Jeep, Ram, Mitsubishi, Nissan (2002 to 2006) and Toyota (2004 and 2005) also carry the do-not-drive advisory. Their inflators are the oldest and most likely to rupture.' },
    { q: 'Does the recall repair cost anything on a very old car?', a: 'No. Makers replace Takata inflators free of charge on vehicles in these campaigns, and many arrange towing for do-not-drive cars. The general 15-year limit on free remedies is counted to the recall notice, and the Takata campaigns were announced while these vehicles were within it.' },
  ],
  related: ['do-not-drive-recalls', 'how-to-check-car-recalls', 'brand:honda', 'recall-check', 'home'],
  sources: ['takata', 'recallfile', 'nhtsarecalls', 'remedy'],
});
