import { definePage } from '../../lib/page-types';
import { SAMPLES, WMI_COUNT, n } from '../../lib/data';
import { decodeOffline } from '../../lib/engine/vin';
import W from '../../data/gen/wmi.json';

const v = SAMPLES.car.vin as string;
const d = decodeOffline(v, (W as any).wmi);

export default definePage({
  id: 'what-does-my-vin-mean', slug: 'what-does-my-vin-mean', kind: 'guide', group: 'guides', order: 30,
  nav: 'What does my VIN mean?', card: 'The 17 characters explained, position by position',
  title: 'VIN Meaning 2026: What Each of the 17 Characters Tells You',
  description: 'VIN meaning explained position by position: maker code, vehicle attributes, check digit, model year, plant and serial, under 49 CFR Part 565. Decode yours.',
  h1: 'What does my VIN mean? The 17 characters, one by one',
  intro: `A VIN reads in four blocks: who built the vehicle, what it is, a check digit and the year, then where and in what order it was made. The tool below reads yours.`,
  resume: `Every vehicle sold in the United States since the 1981 model year carries a 17-character vehicle identification number laid out by a federal rule, 49 CFR Part 565. Characters 1 to 3 are the world manufacturer identifier: the country or region, the maker and, in most cases, the type of vehicle. Characters 4 to 8, the vehicle descriptor section, encode the model line, body, engine, restraint system and weight class, in a scheme each manufacturer files with NHTSA. Character 9 is a check digit computed from the others. Character 10 gives the model year, character 11 the assembly plant, and characters 12 to 17 the production sequence number. The example ${v} decodes as a ${d.years.join(' or ')} vehicle built by ${d.wmi?.make ?? 'its maker'} in ${d.wmi?.country ?? d.region}: you can read the first, ninth and tenth characters yourself, but the middle block needs the maker's own key, which is what NHTSA's vPIC database holds.`,
  body: (h) => `
<p>Type any VIN in the box: each block is read with the federal rules and our table of ${n(WMI_COUNT)} maker codes, in your browser.</p>
${h.mini('positions')}
<h2>Characters 1 to 3: the world manufacturer identifier</h2>
<p>The first character gives the region: 1, 4 and 5 for the United States, 2 for Canada, 3 for Mexico, J for Japan, K for South Korea, W for Germany, Z for Italy, S for the United Kingdom, L for China. The ranges are assigned by SAE International, which NHTSA designates to hand out manufacturer codes. Together with the second and third characters, they name the maker: 1FT is a Ford truck built in the United States, 1HG a Honda car built in Ohio, 5YJ a Tesla, JTD a Toyota car built in Japan. A brand building in several countries has several codes, which is why a Honda Accord can start with 1HG or JHM depending on the plant.</p>
<p>A 9 in third position has a special meaning: the maker is a low-volume manufacturer whose identifier is six characters long, the first three plus characters 12, 13 and 14. Trailer builders, small coachbuilders and kit car makers use this scheme. For them, the serial number shrinks to three characters.</p>
<h2>Characters 4 to 8: the vehicle descriptor section</h2>
<p>This is where most of the information lives, and where no general rule applies. Part 565 requires each maker to encode certain attributes, which differ by vehicle type: for a passenger car, the line, series, body type, engine type and restraint system; for a truck, the gross vehicle weight rating class as well; for a motorcycle, the engine displacement. The maker chooses the codes and files them with NHTSA, which publishes them through ${h.src('vpic', 'vPIC')}. That is why you cannot read "W1C" or "T5" without a key, and why a VIN decoder must ask vPIC to say "SuperCrew 4x2 with the 3.5 liter EcoBoost".</p>
${h.box('A useful shortcut', '<p>The first eight characters plus the year, the plant and an asterisk for the serial form a <em>VIN pattern</em> shared by every vehicle of the same build. vPIC can decode a pattern, which is how the motorcycle decoder handles VINs with unreadable serial digits.</p>')}
<h2>Character 9: the check digit</h2>
<p>The ninth character is computed from the other sixteen with fixed letter values and position weights, then the remainder of a division by 11; a remainder of 10 is written X. Its purpose is to catch copying errors: change one character and the check digit no longer matches. The ${h.a('vin-check-digit', 'check digit calculator')} shows every step. It is mandatory for vehicles built for North America and optional elsewhere, so an imported car may fail it legitimately.</p>
<h2>Character 10: the model year</h2>
<p>A single character gives the model year in a 30-year cycle: A to Y, skipping I, O, Q, U and Z, then 1 to 9. A is 1980 or 2010, N is 1992 or 2022, 9 is 2009 or 2039. For cars, SUVs, pickups and vans up to 10,000 lb, the seventh character settles which cycle applies: a digit there means 1980 to 2009, a letter means 2010 to 2039. The ${h.a('vin-model-year-chart', 'model year chart')} lists every code. The model year is not the build date: a 2026 model can be built in early 2025.</p>
<h2>Character 11: the assembly plant</h2>
<p>Each maker assigns its own plant letters, so "D" means Dearborn for Ford and something else for General Motors. vPIC returns the plant city, state and country. The plant matters for recalls more than people think: many campaigns cover vehicles built at one plant during a defined window.</p>
<h2>Characters 12 to 17: the serial number</h2>
<p>The last six characters are the production sequence. Many makers use digits only; some mix letters in the first positions. Two vehicles of the same model, year and plant differ only here. Recall campaigns sometimes define their population by serial range, which is why a dealer asks for the full VIN, not just the model.</p>
<h2>What the VIN does not encode</h2>
<p>Color, options packages, the original price, the first owner, the mileage and the history of the vehicle are not in the VIN. vPIC adds the equipment the maker declared for the pattern, such as air bag positions or a backup camera, and the ${h.a('home', 'full decoder')} adds recall campaigns, NCAP crash ratings and EPA fuel economy. For title brands and odometer history, see the ${h.a('free-vin-check-vs-history-report', 'comparison of free checks and paid reports')}.</p>
`,
  faqs: [
    { q: 'Can I tell the engine from the VIN myself?', a: 'Only with the maker’s key. The engine code sits in the vehicle descriptor section, characters 4 to 8, and its position and meaning vary by manufacturer and model year. Ford often uses the eighth character for the engine, but General Motors and Toyota do not follow the same scheme. A decoder reads it from the data the maker filed with NHTSA.' },
    { q: 'Why does my VIN start with a different country than the brand?', a: 'Because the first character shows where the vehicle was built, not where the brand comes from. A BMW X5 built in South Carolina starts with 5, a Toyota Tacoma built in Mexico with 3, a Chevrolet built in South Korea with K. The rest of the WMI then identifies the maker.' },
    { q: 'Do all vehicles have a 17-character VIN?', a: 'Vehicles built for the US market from the 1981 model year do, under 49 CFR Part 565. Older vehicles have shorter, maker-specific serial numbers that a modern decoder cannot read. Trailers and low-volume vehicles also have 17 characters, with a six-character maker code when the third character is a 9.' },
    { q: 'Is the model year in the VIN the year the car was built?', a: 'Not necessarily. The tenth character gives the model year the maker assigned, and a model year can start in the previous calendar year: many 2026 models were built in the spring or summer of 2025. The month and year of manufacture are printed on the certification label in the driver door jamb.' },
  ],
  related: ['home', 'vin-check-digit', 'vin-model-year-chart', 'where-is-the-vin-number', 'motorcycle-vin-decoder'],
  sources: ['part565', 'vpic'],
});
