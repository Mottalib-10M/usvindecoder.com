import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('camry');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'camry', brand: 'toyota',
  title: `Toyota Camry Recalls by Model Year: ${f.c} NHTSA Campaigns`,
  description: `Toyota Camry recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.my(2018)} on the 2018 and ${f.my(2025)} on the hybrid-only 2025. Crash ratings and mpg each year.`,
  h1: 'Toyota Camry recalls by model year',
  intro: `The Camry has few recalls for a best seller: ${f.c} campaigns since 2012. The 2018 redesign has the most, ${f.my(2018)}, and the hybrid-only 2025 has ${f.my(2025)}. Pick your year.`,
  resume: `Toyota's midsize sedan sees few campaigns in most years: one on the 2021, one on the 2022, one on the 2024 in NHTSA's file. Two moments break the pattern, both redesigns. The 2018 Camry, on the new TNGA platform, is covered by ${f.my(2018)} campaigns and the 2019 by ${f.my(2019)}; the 2025 Camry, sold only as a hybrid, already has ${f.my(2025)}. In all, ${f.c} campaigns cover Camry and Camry Hybrid model years 2012 to 2026. Air bags and the fuel system lead with ${f.compN(0)} campaigns each, the latter driven by Toyota's low-pressure fuel pump recall of 2020. The most recent campaign, ${f.latest.id}, received on ${f.day(f.latest.date)}, covered ${f.units(f.latest.units)} Camry Hybrids whose instrument cluster display could fail to show warnings at start-up. NCAP rates every Camry year we hold at five stars overall, and the 2025 hybrid reaches ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>The fuel pump campaigns of 2020</h2>
<p>${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} Toyota and Lexus vehicles from 2018 and 2019, the Camry among them: the impeller of the low-pressure fuel pump could swell and jam, and the engine could stall at any speed. Toyota extended it in November 2020 with ${big[1].id}, for ${f.units(big[1].units)} more vehicles. Dealers replace the pump. A 2018 to 2020 Camry is very likely in one of the two, and the VIN tells you whether the pump was changed.</p>
<h2>The hybrid-only Camry</h2>
<p>For 2025 Toyota dropped the gas-only four-cylinder and V6 Camry, so every Camry from 2025 is a hybrid, and NHTSA lists most of them as Camry Hybrid. The campaigns on these years concern the instrument display, the hybrid propulsion system and seat belts. The EPA rates them ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined, against ${f.epa(2024)?.gasMin} to ${f.epa(2024)?.gasMax} for the 2024 lineup of gas and hybrid models.</p>
<h2>Next steps</h2>
<p>Pick your model year in the tool to see each campaign, then confirm the VIN on nhtsa.gov. The ${h.a('model:rav4', 'RAV4')} and ${h.a('model:accord', 'Honda Accord')} pages give the same view of the closest rivals, and the ${h.a('mpg-by-vin', 'mpg lookup')} prices a year of fuel for your own mileage.</p>
`,
  faqs: [
    { q: 'Which Toyota Camry years have the most recalls?', a: `The 2018 Camry, first of the generation built on Toyota’s TNGA platform, is covered by ${f.my(2018)} campaigns in NHTSA's file, and the 2019 by ${f.my(2019)}. The hybrid-only 2025 already counts ${f.my(2025)}. Years such as 2021, 2022 and 2024 have a single campaign each.` },
    { q: 'Was my Camry part of the Toyota fuel pump recall?', a: 'If it is a 2018, 2019 or 2020 model, probably. Toyota’s 2020 fuel pump campaigns covered more than three million vehicles across its lineup, built with a pump whose impeller could deform and stall the engine. Enter the VIN on nhtsa.gov or Toyota’s owner site to see whether the pump was replaced.' },
    { q: 'Do I need to check Camry Hybrid recalls separately?', a: 'Yes, at least through 2024, when NHTSA often listed Camry and Camry Hybrid as separate models. This page counts both, and the model year tool shows every campaign for the year with the vehicles it names. From 2025, every Camry is a hybrid.' },
  ],
  related: ['brand:toyota', 'model:rav4', 'model:accord'],
});
