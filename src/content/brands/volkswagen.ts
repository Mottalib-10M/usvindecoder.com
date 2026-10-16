import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('volkswagen');
export default defineBrand({
  slug: 'volkswagen',
  title: `Volkswagen Recalls 2026: Atlas, Tiguan, ID.4, Jetta by Year`,
  description: `Volkswagen recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.c26} in 2026. The Atlas and ID.4 lead. Check any Atlas, Tiguan, ID.4, Jetta or GTI by year.`,
  h1: 'Volkswagen recalls by model year',
  intro: `Volkswagen appears in ${f.c10} NHTSA campaigns from 2016 to 2025; since 2021 the Atlas leads with ${f.n(f.top[0][1])}, then the electric ID.4. Check your VW below.`,
  resume: `Volkswagen Group of America files the campaigns for Volkswagen vehicles, and some of them also name Audi models built on the same platforms. NHTSA's file holds ${f.c10} vehicle campaigns naming Volkswagen between 2016 and 2025, ${f.u10} vehicle notices, and ${f.c26} in 2026 so far, with a peak of ${f.peakN} in ${f.peak}. The model list has moved with the lineup: the American-built Atlas and Atlas Cross Sport, assembled in Chattanooga, now appear in ${f.n(f.top[0][1])} and ${f.n(f.top[2][1])} campaigns since 2021, and the electric ID.4 in ${f.n(f.top[1][1])}. Air bags lead the systems with ${f.compN(0)} campaigns, followed by the ${f.comp(1)} and the ${f.comp(2)}. Volkswagen has ${f.dnd} do-not-drive campaigns since 2016, mostly for older Takata-equipped cars. The diesel emissions settlement of 2016 was not a safety recall and does not appear here.`,
  body: (h) => `
<h2>Cars that could roll away</h2>
<p>The largest Volkswagen campaign, ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} Jettas, Golfs, GTIs and Beetles with automatic transmissions and keyless start: silicate deposits on the brake pedal switch could let the driver shift out of park without pressing the brake, or leave the car in gear with the engine off. Dealers fitted a resistor and updated the software. It is the kind of campaign a used-car buyer can verify in a minute on the VIN.</p>
<h2>ID.4 battery and software campaigns</h2>
<p>The ID.4, built in Chattanooga since 2023, has campaigns on its high-voltage battery, door handles, software and the 12-volt system; a 2026 campaign, ${f.recent.id}, warned that the high-voltage battery of some 2023 to 2026 ID.4s could fail and catch fire. Several earlier ID.4 campaigns were remedied by software updates at the dealer. For an electric Volkswagen, check every campaign on the VIN and note whether it carried a park-outside warning.</p>
<h2>Dieselgate is not in the recall list</h2>
<p>The 2.0 and 3.0 liter TDI buyback and emissions modification program of 2016 was an environmental settlement with the EPA and California, not a NHTSA safety recall. A modified TDI shows an emissions repair in Volkswagen's records, not a safety campaign. The ${h.a('recall-check', 'recall check')} lists safety campaigns only; the ${h.a('brand:bmw', 'BMW')} and ${h.a('brand:mercedes-benz', 'Mercedes-Benz')} pages cover the other German brands.</p>
`,
  faqs: [
    { q: 'Is the Volkswagen diesel scandal a recall?', a: 'Not a safety recall. The 2016 TDI program was an emissions settlement with the EPA and California regulators, with buybacks and approved emissions modifications. It is handled outside NHTSA’s safety recall system, so the campaigns shown here, which are safety recalls, do not include it.' },
    { q: 'Do Audi models share Volkswagen recalls?', a: 'Sometimes. Volkswagen and Audi share engines and platforms, and Volkswagen Group of America files both brands’ campaigns. A campaign on a shared part, such as the 2026 steering bolt campaign covering the Tiguan, Atlas and Audi Q3, names both makes. NHTSA records Audi vehicles under the Audi make.' },
    { q: 'What should I check on a used ID.4?', a: 'Every campaign on its VIN, especially high-voltage battery campaigns and any park-outside warning. Several ID.4 campaigns were fixed by software at a dealer, others by replacing parts. A Volkswagen dealer or nhtsa.gov shows which are completed; ask for the battery state of health report as well.' },
  ],
  related: ['brand:bmw', 'brand:mercedes-benz', 'recall-check'],
});
