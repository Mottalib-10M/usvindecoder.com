import { definePage } from '../../lib/page-types';
import { SAMPLES } from '../../lib/data';
import { parseVpic } from '../../lib/nhtsa';

const m = parseVpic(SAMPLES.moto.vpic)!;

export default definePage({
  id: 'motorcycle-vin-decoder', slug: 'motorcycle-vin-decoder', kind: 'tool', group: 'decode', order: 5, tool: 'moto',
  nav: 'Motorcycle VIN decoder', card: 'Make, model, engine and recalls of a motorcycle',
  title: 'Motorcycle VIN Decoder 2026: Free NHTSA Specs and Recalls',
  description: 'Free motorcycle VIN decoder: make, model, year, engine size and type from NHTSA vPIC, plus every recall campaign. Works with the first 11 characters of the VIN.',
  h1: 'Motorcycle VIN decoder',
  intro: `Type the VIN from the steering head or the frame label; the first 11 characters are enough for the model. Example: ${SAMPLES.moto.vin} reads as a ${m.year} ${m.make} ${m.model}.`,
  resume: `Motorcycles sold in the United States carry the same 17-character VIN as cars, under the same federal rule, 49 CFR Part 565, and their makers file the same VIN decoding data with NHTSA. This decoder reads the structure in your browser, then asks NHTSA vPIC for the make, model, model year, engine displacement, motorcycle type and assembly plant, and the NHTSA Recalls API for every campaign on that model and year. Two things differ from cars. Motorcycle VINs are often stamped into the frame and are hard to read in full; vPIC can decode a pattern of the first 11 characters, with the serial replaced by nothing or an asterisk, and still identify the model. And there are no NCAP crash ratings or EPA fuel economy labels for motorcycles, so those sections stay empty. Recall names can be written differently by vPIC and by the recall database, such as YZF-R1 and YZFR1; the decoder matches them for you.`,
  body: (h) => `
<h2>Where the VIN is on a motorcycle</h2>
<p>The VIN is stamped on the steering head, the tube at the front of the frame behind the fork, usually on the right side; turn the handlebars to the left to see it. A label on the frame, often on the down tube or under the seat, repeats it with the date of manufacture and the weight ratings. The engine has its own number, stamped on the crankcase, which is not the VIN and does not decode here. For an older bike, the title and the registration card carry the VIN too; compare all of them with the ${h.a('where-is-the-vin-number', 'VIN matcher')}.</p>
<h2>Reading a motorcycle VIN</h2>
<p>The first three characters identify the maker and its country: JYA for Yamaha in Japan, 1HD for Harley-Davidson in the United States, ZDM for Ducati in Italy. Positions 4 to 8 encode the model, engine and frame type in each maker's own scheme, which is why vPIC is needed to read them. Position 9 is the check digit, position 10 the model year. One difference from cars: the rule that uses the seventh character to choose between the 1980s cycle and the 2010s cycle applies only to cars, SUVs and trucks, so a motorcycle year code can be ambiguous on its own. vPIC resolves it from the maker's data; the ${h.a('vin-model-year-chart', 'model year chart')} explains the cycle.</p>
<h2>Recalls on motorcycles</h2>
<p>Motorcycle campaigns are fewer than on cars but often concern parts that matter more at speed: brake hoses, fuel lines, headlights, frames and wheel bearings. The lookup lists them by model year with the remedy; the open status of one bike is on ${h.src('nhtsarecalls', 'NHTSA’s VIN lookup')}, which covers motorcycle manufacturers. Helmets and tires have their own equipment recalls, filed under the equipment maker.</p>
<h2>Buying a used motorcycle</h2>
<p>Theft is the main risk with used bikes, and stolen frames are sometimes given another VIN. Check that the stamping on the steering head looks original, with no grinding marks or uneven characters, and that it matches the frame label and the title. NICB VINCheck lists thefts reported by member insurers, and an NMVTIS report shows title brands; the ${h.a('free-vin-check-vs-history-report', 'comparison of free and paid checks')} covers both. The ${h.a('home', 'car VIN decoder')} handles four-wheel vehicles, with crash ratings and mpg.</p>
`,
  faqs: [
    { q: 'Can I decode a motorcycle VIN with missing characters?', a: 'Often, yes. vPIC identifies a model from the first 11 characters, the maker code, the model descriptor, the check digit, the year and the plant. Type them, leave out the serial, or put an asterisk where a character is unreadable. A full 17-character VIN is still needed for a recall status check on one bike.' },
    { q: 'Why are there no crash ratings or mpg for my motorcycle?', a: 'NHTSA’s NCAP program crash-tests cars, SUVs, pickups and vans, not motorcycles, and the EPA fuel economy label applies to light-duty vehicles only. Motorcycle makers publish their own fuel consumption figures, measured under their own conditions, which no federal database collects.' },
    { q: 'Is the engine number the same as the VIN?', a: 'No. The engine number is stamped on the crankcase and identifies the engine only. On many bikes part of it matches the VIN, which helps confirm the engine is original, but it does not decode through vPIC. The VIN is on the steering head and the frame label.' },
  ],
  related: ['home', 'recall-check', 'where-is-the-vin-number', 'vin-model-year-chart', 'vin-check-digit'],
  sources: ['vpic', 'part565', 'recalls'],
});
