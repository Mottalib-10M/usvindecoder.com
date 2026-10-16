import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('gmc');
export default defineBrand({
  slug: 'gmc',
  title: `GMC Recalls 2026: Sierra, Yukon, Acadia, Hummer EV by Year`,
  description: `GMC recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.c26} in 2026, mostly shared with Chevrolet. Check a Sierra, Yukon, Acadia or Hummer EV by year.`,
  h1: 'GMC recalls: Sierra, Yukon and the rest',
  intro: `GMC appears in ${f.c10} NHTSA campaigns from 2016 to 2025 and ${f.c26} in 2026 so far, most of them shared with Chevrolet. Check your Sierra or Yukon by model year.`,
  resume: `GMC builds no vehicle of its own design: every Sierra, Yukon, Canyon, Acadia, Terrain and Hummer EV is a General Motors product sharing its platform with a Chevrolet or a Cadillac. Its recall record follows. NHTSA's file holds ${f.c10} vehicle campaigns naming GMC between 2016 and 2025, ${f.u10} vehicle notices, and ${f.c26} in 2026, and the two largest are the same campaigns that lead the Chevrolet list. GMC's busiest year was ${f.peak} with ${f.peakN} campaigns. Air bags rank first (${f.compN(0)} campaigns), but seat belts come second with ${f.compN(1)} and tires appear in the top five, which is rarer: GM recalled tires fitted at the factory on several heavy-duty Sierras. The Yukon, the Sierra 1500 and the Yukon XL appear most since 2021, with ${f.n(f.top[0][1])}, ${f.n(f.top[1][1])} and ${f.n(f.top[2][1])} campaigns.`,
  body: (h) => `
<h2>Read the Chevrolet list as well</h2>
<p>Because the Sierra is a Silverado with a different grille, and the Yukon a Tahoe, a defect on one is almost always a defect on the other. The ${h.a('brand:chevrolet', 'Chevrolet page')} and the ${h.a('model:silverado-1500', 'Silverado 1500 page')} give model year detail that applies to the Sierra 1500 too, with one caveat: trims differ, so a campaign on a feature only GMC offers, such as the MultiPro tailgate, names the Sierra alone. When in doubt, start from your VIN.</p>
<h2>Tires and wheels on heavy-duty trucks</h2>
<p>Tire campaigns filed by GM concern tires fitted as original equipment that did not meet load or construction requirements, often on 2500 HD trucks with towing packages. One 2026 campaign, 26V530000, covered only a handful of Sierra 2500s with the enhanced towing option. Tire recalls also have a shorter free-remedy window under federal law, five years from the first sale, against fifteen for the vehicle; the ${h.a('how-to-check-car-recalls', 'recall guide')} has a calculator for both.</p>
<h2>Hummer EV and the electric lineup</h2>
<p>The Hummer EV pickup and SUV, and the Sierra EV, bring battery and software campaigns into GMC's list. Some electric campaigns are now remedied over the air; NHTSA's file records the campaign either way, and the VIN status on nhtsa.gov shows when an update was received. The latest GMC campaign in this build, ${f.recent.id}, was received on ${f.day(f.recent.date)}.</p>
`,
  faqs: [
    { q: 'Is a GMC Sierra recall the same as a Silverado recall?', a: 'Usually. The two pickups share the frame, engines, transmissions, brakes and most electronics, so GM files one campaign naming both. Features exclusive to one brand, such as GMC’s MultiPro tailgate or a Chevrolet-only trim, can lead to a campaign naming a single truck. Checking the VIN removes any doubt.' },
    { q: 'How long are tire recalls free on a GMC?', a: 'Five calendar years from the first sale to the date of the recall notice, under 49 U.S.C. 30120, against fifteen years for the vehicle and its other equipment. Within that window, a GMC dealer replaces recalled factory tires at no charge. Tires bought later are recalled by their own maker, not by GM.' },
    { q: 'Do Hummer EV recalls get fixed over the air?', a: 'Some do. GM can send software remedies to recent electric models over their cellular connection, and the campaign then shows as completed for vehicles that installed the update. Hardware campaigns still require a dealer visit. NHTSA lists both kinds; the remedy text in each campaign says which one applies.' },
  ],
  related: ['brand:chevrolet', 'model:silverado-1500', 'how-to-check-car-recalls'],
});
