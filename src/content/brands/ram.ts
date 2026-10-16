import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('ram');
export default defineBrand({
  slug: 'ram',
  title: `Ram Recalls 2026: Ram 1500, 2500, 3500 and ProMaster by Year`,
  description: `Ram truck recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025 and ${f.c26} in 2026. Check any Ram 1500, heavy-duty 2500 or 3500 or ProMaster by model year.`,
  h1: 'Ram truck recalls by model year',
  intro: `Ram trucks and vans appear in ${f.c10} NHTSA campaigns from 2016 to 2025 and ${f.c26} in 2026 so far. The Ram 1500 leads with ${f.n(f.top[0][1])} campaigns since 2021.`,
  resume: `Ram became a separate make in NHTSA's records when Chrysler split it from Dodge for the 2011 model year, so its campaigns since then are filed by FCA US under the Ram name. NHTSA's file holds ${f.c10} vehicle campaigns naming Ram between 2016 and 2025, ${f.u10} vehicle notices, and ${f.c26} more in 2026. A large share are heavy-duty: the 2500, 3500, 4500 and 5500 chassis cabs are listed as separate models and each campaign on the Cummins diesel or the commercial chassis names several of them. Since 2021 the Ram 1500 appears in ${f.n(f.top[0][1])} campaigns, the 2500 in ${f.n(f.top[1][1])} and the 3500 in ${f.n(f.top[2][1])}; the ProMaster van follows with ${f.n(f.top[5][1])}. The ${f.comp(0)} and the ${f.comp(1)} are the systems recalled most, ahead of air bags and rearview cameras. ${f.y(2019)} campaigns in 2019 make it Ram's busiest year.`,
  body: (h) => `
<h2>The campaign that reached almost five million Stellantis vehicles</h2>
<p>The largest campaign naming Ram, ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles of several Stellantis brands: a cruise control that could not be cancelled after a short circuit, on 2014 to 2018 Ram pickups, Dodge Charger, Durango and Journey, Chrysler 300 and Jeep models. The remedy was a software update of the powertrain control module. It shows why Ram owners should read Jeep and Dodge campaigns too: the same modules are fitted across the group.</p>
<h2>Heavy-duty trucks and their own recalls</h2>
<p>Heavy-duty Rams have no EPA mileage label and most have no NCAP rating, so for them the recall list is the main federal record. Campaigns on the 2500 and 3500 often concern towing equipment, steering linkages, diesel fuel systems and, on chassis cabs, the parts an upfitter adds. When a body builder adds a dump bed or a service body, the upfitter becomes responsible for recalls on what it installed; those appear under the upfitter's name, not Ram's.</p>
<h2>Checking a Ram 1500</h2>
<p>The light-duty pickup has its own page: the ${h.a('model:1500', 'Ram 1500 page')} lists campaigns for every model year since 2012, with crash ratings and EPA mpg. Note that NHTSA kept the previous generation, sold alongside the new one as the 1500 Classic, under a separate model name in several campaigns. The ${h.a('brand:jeep', 'Jeep')} and ${h.a('brand:dodge', 'Dodge')} pages show the campaigns shared across Stellantis.</p>
`,
  faqs: [
    { q: 'Why does Ram appear separately from Dodge in recall records?', a: 'Chrysler made Ram its own truck brand for the 2011 model year. Since then NHTSA records Ram pickups and vans under the Ram make, while older Dodge Ram trucks remain under Dodge. To check a 2010 or older Ram pickup, choose Dodge as the make and Ram 1500, 2500 or 3500 as the model.' },
    { q: 'Do Ram 1500 Classic trucks share recalls with the new Ram 1500?', a: 'Sometimes. The Classic carried over the previous generation and shares engines and some electronics, but NHTSA often lists it under its own model name. Check both names in the recall check for your model year, or start from the VIN so the decoder picks the matching entries.' },
    { q: 'Who handles recalls on a Ram chassis cab with an aftermarket body?', a: 'Ram handles recalls on the chassis it built. The company that added the body, a dump bed or a service body is a final-stage manufacturer under federal rules and files its own campaigns for its parts. Check both the Ram VIN and the upfitter, whose name is on the final-stage label in the door jamb.' },
  ],
  related: ['model:1500', 'brand:jeep', 'brand:dodge'],
});
