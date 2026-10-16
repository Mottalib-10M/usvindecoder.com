import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('civic');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'civic', brand: 'honda',
  title: `Honda Civic Recalls by Model Year, Type R and Hybrid Too`,
  description: `Honda Civic recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, none on the 2013 model, ${f.worstN} on the ${f.worst}. Each year with NCAP stars and EPA mpg.`,
  h1: 'Honda Civic recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on Civic model years 2012 to 2026, at most ${f.maxN} a year; the 2013 Civic has none. Pick your year to see each campaign.`,
  resume: `Honda's compact car has an even recall record: ${f.c} campaigns cover Civic model years 2012 to 2026 in NHTSA's file, including the Civic Hatchback, Si, Type R and Hybrid, which NHTSA sometimes lists under their own names. No year carries more than ${f.maxN} campaigns and the 2013 has none. The tenth generation, launched for 2016 with a turbocharged engine, brought ${f.my(2016)} campaigns on its first year and ${f.my(2017)} on the 2017, on its electric parking brake, LED lights, half shafts and steering. The power train, steering and fuel system tie for first place with ${f.compN(0)} campaigns each. NCAP has rated the Civic five stars overall every year since 2016. The 2025 Civic Hybrid raised the top EPA rating of the range to ${f.epa(2025)?.gasMax} mpg combined, against ${f.epa(2024)?.gasMax} for the best 2024 Civic.`,
  body: (h) => `
<h2>Steering on the 2022 to 2025 cars</h2>
<p>${big[1].id}, received on ${f.day(big[1].date)}, covered ${f.units(big[1].units)} Hondas and Acuras, the 2022 to 2025 Civic among them: a worm wheel in the steering gearbox could deform and make steering harder to turn. It is one of several steering campaigns on the eleventh generation, which also had one on replacement steering racks fitted during service. If steering on a recent Civic feels heavy, ask a Honda dealer about the campaign before anything else.</p>
<h2>The air bag campaigns on 2001 to 2011 Civics</h2>
<p>Civic model years before 2012 are outside this page, but they matter: the 2001 to 2005 Civic was among the Takata-equipped cars most at risk, and Honda's inflator campaigns covered Civics through 2011. The ${h.a('takata-airbag-recall', 'Takata guide')} explains which ones carry a do-not-drive warning. On the years shown here, the latest campaign naming the Civic, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns the ${f.latest.component.toLowerCase()}.</p>
<h2>Type R and Si</h2>
<p>The Type R appears in campaigns on its seatback pads, half shafts and owner's guide, the last a compliance campaign because the guide must explain certain safety features. Use the ${h.a('recall-check', 'recall check')} with Civic Type R for the full list. The ${h.a('model:accord', 'Accord')} and ${h.a('model:cr-v', 'CR-V')} pages share many Honda campaigns with the Civic, including the 2023 fuel pump recall, ${big[0].id}.</p>
`,
  faqs: [
    { q: 'Which Honda Civic year has the most recalls?', a: `The ${f.worst} Civic, covered by ${f.worstN} campaigns in NHTSA's file, tied with the 2018, both from the tenth generation launched for 2016. No Civic year since 2012 has more than ${f.maxN}, and the 2013 has none. Several campaigns are shared with the Accord, CR-V and Acura models.` },
    { q: 'Is the Civic steering recall serious?', a: 'It affects how much effort steering takes, not whether the car can be steered. In the 2024 campaign covering 2022 to 2025 Civics, a deformed gearbox worm wheel could make steering heavier, which raises the crash risk in an emergency. Honda dealers apply grease and software or replace the gearbox at no charge.' },
    { q: 'Are Civic Type R recalls listed separately?', a: 'Often. NHTSA records the Type R under its own name in campaigns that concern only it, such as seatback pads or performance parts, and with the other Civics in shared campaigns. This page counts the Civic, Hatchback, Hybrid and Type R names together, and the model year tool lists them all.' },
  ],
  related: ['brand:honda', 'model:accord', 'model:cr-v'],
});
