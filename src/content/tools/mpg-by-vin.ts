import { definePage } from '../../lib/page-types';
import { EPA, n } from '../../lib/data';
import { annualFuel } from '../../lib/engine/fuel';

const p = EPA.prices;
const med = annualFuel({ miles: 15000, mpg: EPA.refMedian, price: p.regular }).cost;
const usd = (x: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(x);

export default definePage({
  id: 'mpg-by-vin', slug: 'mpg-by-vin', kind: 'tool', group: 'decode', order: 3, tool: 'mpg',
  nav: 'MPG by VIN', card: 'EPA city, highway and combined mpg, and the yearly fuel bill',
  title: 'MPG by VIN 2026: EPA Fuel Economy and Yearly Fuel Cost',
  description: `MPG by VIN or by model: EPA city, highway and combined ratings for every engine since 1984, and your own yearly fuel cost. Regular gas at $${p.regular} a gallon.`,
  h1: 'MPG by VIN: EPA rating and what it costs you',
  intro: `Pick a model and engine, or paste a VIN: the EPA rating loads with a yearly cost at your miles and gas price. A median ${EPA.refYear} gas car burns ${usd(med)} a year.`,
  resume: `The Environmental Protection Agency tests or audits the fuel economy of every light vehicle sold in the United States and publishes the results on fueleconomy.gov, together with the Department of Energy. For each model year, make, model and engine option, the record gives city, highway and combined mpg, or for an electric car MPGe and kilowatt-hours per 100 miles, the label's yearly fuel cost, its greenhouse gas and smog scores and the tailpipe CO2. This page queries those records directly. The EPA label assumes 15,000 miles a year, 55 % of them in town, at national fuel prices that fueleconomy.gov updates; the calculator replaces both with your own mileage and price. Starting from a VIN, it decodes the vehicle with NHTSA vPIC first, then picks the EPA model by name and drive type and the engine by displacement and cylinder count. The median combined rating of the ${n(EPA.refCount)} gas, diesel and hybrid versions listed for ${EPA.refYear} is ${EPA.refMedian} mpg.`,
  body: (h) => `
<h2>Why the EPA figure and yours differ</h2>
<p>Since the 2008 model year, the EPA adjusts its laboratory results downward with five test cycles that include high speeds, air conditioning and cold starts, so the label is closer to real driving than older ratings were. Your own number still depends on speed, temperature, load, tire pressure and the share of short trips. Highway driving at 75 mph uses noticeably more fuel than the 48 mph average of the highway cycle. Treat the label as the fair way to compare two vehicles, and your own receipts as the way to budget.</p>
<h2>The yearly cost formula</h2>
<p>For a gas or hybrid vehicle the calculation is miles per year divided by combined mpg, times the price per gallon. At 15,000 miles and $${p.regular}, a 30 mpg car uses 500 gallons a year, about ${usd(500 * p.regular)}. Premium and diesel engines use the premium ($${p.premium}) and diesel ($${p.diesel}) prices published by fueleconomy.gov. For an electric car the cost is miles times kWh per 100 miles divided by 100, times the electricity price, ${'$'}${p.electric} per kWh here; your utility rate and the share of public fast charging change it more than any other input. To see what a few mpg are worth between two cars, use the calculator in our ${h.a('mpg-fuel-cost-difference', 'guide to the fuel cost difference')}.</p>
<h2>Vehicles the EPA does not rate</h2>
<p>Pickups and vans with a gross vehicle weight rating above 8,500 lb, such as most 2500 and 3500 series trucks, are outside the light-duty program unless they are passenger vehicles under 10,000 lb. They have no mpg label, so the lookup finds no match. The ${h.a('home', 'VIN decoder')} still shows their engine and weight class from vPIC.</p>
<h2>Window sticker values</h2>
<p>The fuel economy label on a new car also shows a five-year fuel cost compared with the average new vehicle, and ratings for greenhouse gases and smog. The ${h.a('window-sticker-by-vin', 'window sticker page')} rebuilds those values from the same EPA record for any VIN. All figures come from the ${h.src('epa', 'fueleconomy.gov web services')}, read by your browser.</p>
`,
  faqs: [
    { q: 'Can a VIN alone give the exact EPA rating?', a: 'Not always. The VIN tells vPIC the model, year, engine size and drive type, but the EPA often lists several versions with the same engine, for example two transmissions or a flex-fuel variant. The lookup narrows the list by displacement and cylinders and shows each remaining version, so you can pick the one on your registration or sticker.' },
    { q: 'What gas price does the calculator use?', a: `It starts from the national average prices fueleconomy.gov publishes, read when the site was last rebuilt: $${p.regular} for regular, $${p.premium} for premium and $${p.diesel} for diesel. Type your local price in the field and the yearly cost updates at once; vehicles that require premium or diesel use those prices.` },
    { q: 'What is MPGe on an electric car?', a: 'Miles per gallon equivalent: the distance an electric car covers on the energy contained in one gallon of gasoline, set by the EPA at 33.7 kWh. It allows a comparison with gas cars, but the cost depends on kWh per 100 miles and your electricity rate, which is why the calculator uses those two numbers instead.' },
  ],
  related: ['mpg-fuel-cost-difference', 'window-sticker-by-vin', 'home', 'crash-test-ratings', 'recall-check'],
  sources: ['epa', 'vpic'],
});
