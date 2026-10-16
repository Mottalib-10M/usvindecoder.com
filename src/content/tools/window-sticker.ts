import { definePage } from '../../lib/page-types';
import { EPA } from '../../lib/data';

export default definePage({
  id: 'window-sticker-by-vin', slug: 'window-sticker-by-vin', kind: 'tool', group: 'decode', order: 4, tool: 'sticker',
  nav: 'Window sticker by VIN', card: 'The federal label values rebuilt from a VIN',
  title: 'Window Sticker by VIN 2026: Rebuild the EPA Label Free',
  description: 'Window sticker by VIN: rebuild the EPA fuel economy label (mpg, yearly cost, 5-year savings, CO2 and smog scores) and the factory equipment from NHTSA.',
  h1: 'Window sticker by VIN: the label figures, rebuilt',
  intro: 'Paste a VIN to rebuild what the federal records hold of the original window sticker: EPA mpg, fuel cost, five-year savings, emissions scores and the factory equipment.',
  resume: `The window sticker of a new car, the Monroney label required since 1958, has two halves. One is written by the manufacturer: base price, factory options and their prices, standard equipment, final assembly point and the parts content. The other half is federal: the EPA fuel economy and environment label, with city, highway and combined mpg, the yearly fuel cost, how much more or less the car costs to fuel over five years than the average new vehicle, and greenhouse gas and smog ratings from 1 to 10, plus the NHTSA crash ratings when the model was tested. This page rebuilds the federal half from the VIN: vPIC gives the vehicle and its declared equipment, fueleconomy.gov the label values, NCAP the stars. It cannot rebuild the original prices or the option list of one specific car, which only the manufacturer keeps; several brands let owners download a copy of the original sticker from their own sites.`,
  body: (h) => `
<h2>What each label figure means</h2>
<p>The big number is combined mpg, weighted 55 % city and 45 % highway. The yearly fuel cost assumes 15,000 miles at the fuel prices the EPA used when the label was printed, so an old sticker shows an old price; the rebuilt figure above uses fueleconomy.gov's current price, $${EPA.prices.regular} a gallon of regular for this build. The "you save" or "you spend" line compares the five-year fuel cost with that of the average new vehicle of the same model year. The greenhouse gas rating comes from tailpipe CO2 per mile, and the smog rating from the emissions certification standard; 10 is best on both scales.</p>
<h2>What the federal records cannot rebuild</h2>
<p>Prices and options are the manufacturer's half. vPIC records equipment the maker declared for the VIN pattern, such as air bag positions, stability control or a backup camera, but it does not record a sunroof package or a paint color, and a blank line only means the maker did not report the item. When a seller claims a specific trim, compare it with the trim vPIC returns and with the equipment you see. For the original document, ask a dealer of the brand: they can usually print a copy of the build sheet from the VIN.</p>
<h2>Using the sticker to compare used cars</h2>
<p>The label values make an honest comparison between two used cars of different years, since both were tested under the same five-cycle method used since the 2008 model year. Add the ${h.a('crash-test-ratings', 'NCAP ratings')} for the same body style and the ${h.a('recall-check', 'recall campaigns')} for the model year, and you have the federal part of a buying file. The ${h.a('mpg-by-vin', 'mpg lookup')} lets you change the mileage and price for a cost closer to your own driving.</p>
<h2>Electric and plug-in vehicles</h2>
<p>For an electric car the label shows MPGe, kWh per 100 miles and range; for a plug-in hybrid, the electric range and the gasoline-only rating. The page reads those fields when the EPA record has them. Range and efficiency on the label are measured on new batteries; an older battery delivers less, which no federal database records.</p>
`,
  faqs: [
    { q: 'Can I get the original window sticker from the VIN for free?', a: 'The federal half, yes: this page rebuilds the EPA label values and the NCAP stars, and vPIC returns the declared equipment. The manufacturer’s half, with prices and option packages, only exists in the maker’s records. Some brands publish a free copy on their owner sites; otherwise a dealer of the brand can usually print it.' },
    { q: 'Why is the fuel cost different from the one on my old sticker?', a: 'The label uses the fuel prices the EPA projected for the model year printed on it. The rebuilt figure uses the prices fueleconomy.gov publishes now, so a car from a year when gas was cheaper shows a higher yearly cost today even though its mpg has not changed.' },
    { q: 'What does the smog rating measure?', a: 'Tailpipe pollutants that form smog, mainly nitrogen oxides and non-methane organic gases, graded from 1 to 10 according to the emissions standard the vehicle was certified to. A 10 is a zero-emission vehicle. It is separate from the greenhouse gas rating, which follows CO2 per mile and therefore fuel economy.' },
  ],
  related: ['mpg-by-vin', 'home', 'crash-test-ratings', 'what-does-my-vin-mean', 'recall-check'],
  sources: ['epa', 'vpic', 'ncap'],
});
