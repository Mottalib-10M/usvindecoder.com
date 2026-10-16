import { definePage } from '../../lib/page-types';
import { EPA } from '../../lib/data';
import { mpgSavings } from '../../lib/engine/fuel';

const usd = (x: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(x);
const p = EPA.prices.regular;
const pairs: Array<[number, number]> = [[15, 20], [20, 25], [25, 30], [30, 35], [35, 40], [40, 50]];
const rows = pairs.map(([a, b]) => { const r = mpgSavings(15000, p, a, b); return [`${a} to ${b} mpg`, usd(r.costA), usd(r.costB), usd(r.diff), String(Math.round(r.gallonsSaved))]; });
const big = mpgSavings(15000, p, 15, 20); const small = mpgSavings(15000, p, 40, 50);

export default definePage({
  id: 'mpg-fuel-cost-difference', slug: 'mpg-fuel-cost-difference', kind: 'guide', group: 'guides', order: 38,
  nav: 'What mpg is worth', card: 'The yearly saving between two fuel economy ratings',
  title: 'MPG Fuel Cost Difference 2026: What 5 MPG Saves Each Year',
  description: `MPG fuel cost difference: going from 15 to 20 mpg saves ${usd(big.diff)} a year over 15,000 miles, 40 to 50 mpg only ${usd(small.diff)}. Compare two cars at your own gas price.`,
  h1: 'What a few mpg are worth: the fuel cost difference',
  intro: `At 15,000 miles a year and $${p} a gallon, moving from 15 to 20 mpg saves ${usd(big.diff)}; moving from 40 to 50 mpg saves ${usd(small.diff)}. Low-mpg vehicles gain the most.`,
  resume: `Fuel cost is proportional to gallons per mile, not to miles per gallon, and that changes how mpg differences should be read. A truck that improves from 15 to 20 mpg burns 1,000 gallons instead of 750 over 15,000 miles, a saving of 250 gallons. A hybrid that improves from 40 to 50 mpg saves only 75 gallons over the same distance, even though the gain looks larger. At the national regular gas price fueleconomy.gov publishes, $${p} a gallon for this build, the first change is worth ${usd(big.diff)} a year and the second ${usd(small.diff)}. That is why the EPA label in the United States also shows gallons per 100 miles, and why replacing the least efficient vehicle in a household saves more than upgrading the most efficient one. The calculator below takes your current and target ratings, your yearly mileage and your price, and returns the yearly and five-year difference, using the same formula as the ${'mpg lookup'}.`,
  body: (h) => `
<p>Enter both ratings and your own driving; the difference updates as you type.</p>
${h.mini('mpgdiff')}
<h2>The same 5 mpg, very different savings</h2>
${h.table(['Change', 'Yearly fuel before', 'Yearly fuel after', 'Saved per year', 'Gallons saved'], rows, `15,000 miles a year at $${p} a gallon of regular.`, ['l', 'r', 'r', 'r', 'r'])}
<p>The table makes the point that fuel economy labels hide: each step of 5 mpg saves less than the one before. Gallons per mile fall quickly at low mpg and slowly at high mpg. For a buyer choosing between a 22 mpg SUV and a 26 mpg one, the gap is worth more than the gap between a 45 mpg hybrid and a 52 mpg one.</p>
<h2>Which mpg to use</h2>
<p>Use the combined rating unless your driving is clearly city or highway. The EPA weights combined mpg 55 % city and 45 % highway, so a commuter on the interstate gets closer to the highway figure, and a driver in town closer to the city one. Hybrids gain most in town, where regenerative braking recovers energy; diesels and large engines gain on the highway. The ${h.a('mpg-by-vin', 'mpg lookup')} shows all three figures for every engine.</p>
<h2>Label mpg against your own mpg</h2>
<p>Your real consumption can differ from the label: fueleconomy.gov reminds that your mpg will vary with how, where and in what you drive. Sustained speeds above 70 mph, short trips in winter, roof racks, towing and underinflated tires all lower it; steady suburban driving can beat it. The calculator works with any figure, so the most accurate input is your own: fill the tank, reset the trip meter, drive normally and divide the miles by the gallons at the next fill-up. Do it twice, and use the same method for both cars when you compare a trade-in with your current vehicle.</p>
<h2>Premium and diesel engines</h2>
<p>A vehicle that requires premium gasoline costs more per mile at the same mpg: at fueleconomy.gov's prices for this build, premium is $${EPA.prices.premium} a gallon against $${p} for regular, about ${Math.round((EPA.prices.premium / p - 1) * 100)} % more. Diesel, at $${EPA.prices.diesel}, costs ${Math.round((EPA.prices.diesel / p - 1) * 100)} % more a gallon than regular in this build, so a diesel needs that much better mpg just to break even on fuel. Type the price of the fuel your car actually uses in the calculator; the ${'<a href="/en/mpg-by-vin/">'}mpg lookup</a> picks the right fuel price automatically from the EPA record.</p>
<h2>Electric and plug-in vehicles</h2>
<p>For an electric car, compare cost per mile instead: kWh per 100 miles times your electricity price, divided by 100, against the gas price divided by mpg. At ${'$'}${EPA.prices.electric} per kWh, a car using 28 kWh per 100 miles costs about ${usd(28 * EPA.prices.electric * 150)} for 15,000 miles; a 30 mpg car costs ${usd(15000 / 30 * p)}. Public fast charging can cost several times the home rate, so your charging mix decides the answer. A plug-in hybrid sits in between, depending on the share of electric miles.</p>
<h2>Payback on a more efficient car</h2>
<p>To judge whether paying more for a hybrid or a smaller engine makes sense, divide the price difference by the yearly saving the calculator returns. A premium of $3,000 recovered at $500 a year takes six years; at $1,000 a year, three. Mileage changes the answer more than any other input: a driver covering 25,000 miles a year recovers it in less than half the time of one driving 10,000.</p>
<h2>Other costs that follow mpg</h2>
<p>Fuel is not the only figure. Vehicles with higher mpg often have smaller engines and lower tailpipe CO2, which the window sticker shows as a greenhouse gas rating; the ${h.a('window-sticker-by-vin', 'window sticker page')} rebuilds it. Insurance, maintenance and depreciation can outweigh fuel savings, especially for low annual mileage. Run the numbers with your real mileage before paying more for efficiency, and check the ${h.a('recall-check', 'recall campaigns')} of both candidates, which cost nothing to read.</p>
`,
  faqs: [
    { q: 'How much money does 1 mpg save?', a: `It depends on where you start. At 15,000 miles a year and $${p} a gallon, going from 15 to 16 mpg saves about ${usd(mpgSavings(15000, p, 15, 16).diff)} a year, while going from 40 to 41 mpg saves about ${usd(mpgSavings(15000, p, 40, 41).diff)}. Savings are largest for low-mpg trucks and SUVs, because fuel use follows gallons per mile.` },
    { q: 'Is it worth buying a hybrid for the fuel savings?', a: 'Divide the extra purchase price by the yearly saving the calculator gives for your mileage and gas price. Over 12,000 to 15,000 miles a year, moving from about 30 to about 40 mpg often recovers a hybrid premium of a few thousand dollars within several years; at low mileage it may never pay back on fuel alone.' },
    { q: 'Why does the EPA label show gallons per 100 miles?', a: 'Because gallons per 100 miles is proportional to what you pay, while mpg is not. Two cars that differ by 5 mpg can differ by very different amounts of fuel, as the table on this page shows. Comparing gallons per 100 miles gives the right ranking of fuel costs directly.' },
  ],
  related: ['mpg-by-vin', 'window-sticker-by-vin', 'home', 'crash-test-ratings'],
  sources: ['epa'],
});
