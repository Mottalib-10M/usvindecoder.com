import { definePage } from '../../lib/page-types';
import { YEAR_CODES } from '../../lib/engine/vin';

const rows = YEAR_CODES.split('').map((c, i) => [`<span class="font-mono font-semibold">${c}</span>`, String(1980 + i), String(2010 + i)]);

export default definePage({
  id: 'vin-model-year-chart', slug: 'vin-model-year-chart', kind: 'guide', group: 'guides', order: 32,
  nav: 'VIN model year chart', card: 'The 10th character, decoded for every year 1980 to 2039',
  title: 'VIN Year Chart 2026: Model Year From the 10th Character',
  description: 'VIN year chart: the 10th character gives the model year in a 30-year cycle, A for 1980 or 2010, T for 2026. Find any VIN year with the 7th-character rule.',
  h1: 'VIN model year chart: the 10th character',
  intro: 'The tenth character of a VIN is the model year: T is 2026, V 2027, S 2025, R 2024. Each code returns every 30 years, and the seventh character tells which cycle applies.',
  resume: `The model year code in position 10 follows a table set by 49 CFR 565.15: the letters A to Y, without I, O, Q, U and Z, then the digits 1 to 9, thirty codes in all, so the sequence repeats every 30 years. A was 1980 and again 2010; Y was 2000 and 2030; 1 was 2001 and will be 2031. To tell the cycles apart, the rule uses the seventh character for passenger cars, multipurpose vehicles such as SUVs and minivans, and trucks with a gross vehicle weight rating of 10,000 lb or less: when the seventh character is a digit, the year belongs to 1980 to 2009; when it is a letter, to 2010 to 2039. Motorcycles, trailers, buses and heavier trucks are not covered by that rule, so their year code alone can mean either cycle, and the maker's data in vPIC decides. The 2026 model year is T, the 2027 is V.`,
  body: (h) => `
<p>Choose the tenth character and what the seventh is; the calculator applies the federal rule.</p>
${h.mini('yearcode')}
<h2>The full chart</h2>
<p>Every code with its two possible model years. The digit 0 and the letters I, O, Q, U and Z are never used in position 10, so a VIN showing one of them there was miscopied.</p>
${h.table(['10th character', 'Cycle 1980-2009', 'Cycle 2010-2039'], rows, 'Model year codes of 49 CFR 565.15, table VII.', ['l', 'r', 'r'])}
<h2>Why the seventh character settles it</h2>
<p>When the 30-year cycle restarted in 2010, a 1980 car and a 2010 car could carry the same year code. The federal rule ties the cycle to the seventh character for light vehicles: makers must put a letter there on model years 2010 to 2039, and a digit in position 7 places the year between 1980 and 2009. So a 2015 SUV, code F, has a letter in position 7, and an F with a digit there means 1985. Heavy trucks, buses, trailers and motorcycles are outside that requirement: a motorcycle with code 9 in position 10 can be a 2009 or, from 2039, a new one. For such vehicles, read the date of manufacture on the certification label, or decode the VIN with ${h.src('vpic', 'vPIC')}, which holds the maker's own decoding.</p>
<h2>Model year is not calendar year</h2>
<p>A model year is a maker's designation. Under the EPA's definition of the annual production period (40 CFR 85.2304), a model year can start as early as January 2 of the previous calendar year, and NHTSA only requires that the production period of a model year not exceed 24 months (49 CFR 565.12), so a 2027 model can be on sale in 2026. The VIN gives the model year; the month and year the vehicle was made appear on the certification label in the door jamb. Insurance, registration fees and recall campaigns all use the model year, which is why the tenth character matters.</p>
<h2>When the title and the VIN disagree on the year</h2>
<p>State titles and registrations are supposed to show the model year, but clerical errors happen, especially on rebuilt, imported or kit vehicles. If the tenth character says 2018 (J) and the title says 2017, trust the VIN and the door jamb label, and ask the DMV to correct the title before you buy: insurance, loan values and recall lookups all depend on the right year. The ${'<a href="/en/vin-check-digit/">'}check digit calculator</a> confirms first that the VIN itself was copied correctly.</p>
<h2>Using the year with recalls</h2>
<p>Recall campaigns are filed by model year, so getting the year right decides which list you read. NHTSA's VIN search covers the past 15 calendar years, and the federal free-repair obligation runs 15 years from the first sale; the ${h.a('how-to-check-car-recalls', 'recall guide')} has a calculator for that window. To read the rest of the VIN, see the ${h.a('what-does-my-vin-mean', 'position-by-position guide')}, or let the ${h.a('home', 'decoder')} do everything at once.</p>
`,
  faqs: [
    { q: 'What VIN letter is 2026?', a: 'T. The tenth character of a 2026 model year vehicle is T, which also stood for 1996 in the previous cycle. For cars, SUVs and light trucks, a letter in the seventh position confirms the 2010 to 2039 cycle, so the vehicle is a 2026 and not a 1996.' },
    { q: 'Why is there no letter U, Z or digit 0 in the year position?', a: 'The federal table for position 10 excludes I, O and Q, which are banned everywhere in the VIN, and also U, Z and the digit 0, to avoid confusion with V, 2 and the letter O. That leaves 30 codes, which is why the cycle repeats every 30 years.' },
    { q: 'How do I tell a 1990 from a 2020 VIN?', a: 'Both use the letter L in position 10. For a car, SUV or light truck, look at the seventh character: a digit means the 1980 to 2009 cycle, so 1990; a letter means 2010 to 2039, so 2020. A 1990 vehicle may also lack a check digit consistent with the modern rule.' },
    { q: 'Can a 2027 model year car already be for sale?', a: 'Yes. A model year can begin before the calendar year of the same number, and many 2027 models reach dealers during 2026. The VIN shows V in position 10 for the 2027 model year. The date of manufacture on the door jamb label tells you when it was actually built.' },
  ],
  related: ['what-does-my-vin-mean', 'home', 'vin-check-digit', 'how-to-check-car-recalls'],
  sources: ['part565', 'vpic'],
});
