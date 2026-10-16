import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('dodge');
export default defineBrand({
  slug: 'dodge',
  title: `Dodge Recalls 2026: Durango, Charger, Hornet by Model Year`,
  description: `Dodge recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, falling from ${f.y(2016)} in 2016 to ${f.y(2025)} in 2025. Check any Durango, Charger, Challenger or Hornet.`,
  h1: 'Dodge recalls: Durango, Charger, Challenger and Hornet',
  intro: `Dodge appears in ${f.c10} NHTSA campaigns from 2016 to 2025, down from ${f.y(2016)} in 2016 as the lineup shrank. Older Dodge Ram trucks are listed here too. Check yours below.`,
  resume: `Dodge's recall count has followed its lineup. In 2016 the brand still sold the Dart, Journey, Grand Caravan, Charger, Challenger, Durango and Viper, and appeared in ${f.y(2016)} campaigns that year; by 2025, with the Durango, the new Charger and the Hornet, it appeared in ${f.y(2025)}. Over the decade NHTSA's file holds ${f.c10} vehicle campaigns naming Dodge, with ${f.u10} vehicle notices, a large total because many Stellantis campaigns on shared modules cover millions of older vehicles. The two largest, ${f.big.id} (cruise control that could not be cancelled) and ${f.big2.id} (air bag inflators), each name Dodge alongside Ram, Jeep and Chrysler models. Air bags lead the systems recalled with ${f.compN(0)} campaigns. Dodge Ram pickups built before the 2011 model year, when Ram became its own make, remain under Dodge in NHTSA's records.`,
  body: (h) => `
<h2>The Durango, Dodge's most recalled model</h2>
<p>The Durango SUV is the oldest nameplate still on sale and appears in ${f.n(f.top[0][1])} campaigns since 2021, more than any other Dodge. They range from rear spoiler attachment, in a 2026 campaign covering 2021 to 2023 models, to rearview cameras and electrical faults. The Charger follows with ${f.n(f.top[1][1])}, and the Italian-built Hornet, a sister of the Alfa Romeo Tonale, already has ${f.n(f.top[2][1])} campaigns since its 2023 launch.</p>
<h2>Hemi muscle cars and the new Charger</h2>
<p>The Challenger and the old Charger, discontinued after 2023, carry campaigns on brake components, fuel pumps and the supercharged Hellcat versions. The new Charger Daytona, electric or with a six-cylinder engine, brings its own: the 2026 camera campaign 26V531000, which covered most 2026 Stellantis vehicles, names the 2026 and 2027 Charger. For older Dodge pickups, use Dodge as the make in the ${h.a('recall-check', 'recall check')}; for 2011 and later trucks, the ${h.a('brand:ram', 'Ram page')}.</p>
<h2>Shared Stellantis campaigns</h2>
<p>Because Dodge shares electronics with Jeep, Ram and Chrysler, the ${h.a('brand:jeep', 'Jeep page')} and the ${h.a('brand:chrysler', 'Chrysler page')} are worth reading if you own a Durango or a Journey: many campaigns there name the same parts. Dodge has ${f.dnd} do-not-drive campaigns since 2016, most for older air bag inflators.</p>
`,
  faqs: [
    { q: 'Where are recalls for an older Dodge Ram pickup?', a: 'Under the Dodge make. Chrysler created Ram as a separate brand for the 2011 model year, and NHTSA records 2010 and earlier Ram 1500, 2500 and 3500 pickups as Dodge vehicles. Choose Dodge and the Ram model name in the recall check, or start from the VIN, which returns the right make.' },
    { q: 'Why did Dodge recalls fall so much after 2016?', a: `Mostly because the lineup shrank. Dodge stopped selling the Dart, Journey, Grand Caravan, Viper and, after 2023, the Challenger and the gasoline Charger. Fewer models mean fewer campaigns: ${f.y(2016)} in 2016 against ${f.y(2025)} in 2025. Campaigns on older Dodges keep appearing when Stellantis recalls a shared part.` },
    { q: 'Does the Dodge Hornet share recalls with Alfa Romeo?', a: 'Often. The Hornet is built in Italy alongside the Alfa Romeo Tonale and shares its platform, plug-in hybrid system and electronics. Stellantis files campaigns covering both, which NHTSA records under each make. Check the Alfa Romeo Tonale in the recall check as well if you own a Hornet.' },
  ],
  related: ['brand:ram', 'brand:jeep', 'brand:chrysler'],
});
