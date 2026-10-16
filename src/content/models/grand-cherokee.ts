import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('grand-cherokee');
export default defineModel({
  slug: 'grand-cherokee', brand: 'jeep',
  title: `Jeep Grand Cherokee Recalls by Year, 4xe and L Included`,
  description: `Jeep Grand Cherokee recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.worstN} on the ${f.worst} SUV, 4xe and L included. NCAP stars and EPA mpg too.`,
  h1: 'Jeep Grand Cherokee recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on Grand Cherokee model years 2012 to 2026, 4xe and L included; the ${f.worst} has ${f.worstN}, the most. Pick your year.`,
  resume: `The fifth-generation Grand Cherokee, launched as the three-row Grand Cherokee L for 2021 and as the two-row Grand Cherokee and plug-in 4xe for 2022, carries the heaviest recall load of the model: ${f.my(2021)} campaigns on the 2021, ${f.worstN} on the ${f.worst} and ${f.my(2023)} on the 2023, against ${f.my(2020)} on the 2020, last of the previous generation. In all, NHTSA's file lists ${f.c} campaigns on Grand Cherokee model years 2012 to 2026, counting the L and 4xe names. The ${f.comp(0)} leads with ${f.compN(0)} campaigns, then rearview cameras (${f.compN(1)}) and exterior lighting (${f.compN(2)}). The 2014 model stands out among older years with ${f.my(2014)} campaigns, many on its 3.0 liter EcoDiesel. NCAP rates the current Grand Cherokee five stars overall from 2023; the 2025 gas versions are rated ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined, and the 4xe is also rated for electric range.`,
  body: (h) => `
<h2>Rear coil springs that could fall out</h2>
<p>Two 2026 campaigns concern the 2021 to 2023 Grand Cherokee and Grand Cherokee L: the rear coil springs might be incorrectly installed and detach from the vehicle while driving, a road hazard for those behind. The most recent, ${f.latest.id}, received on ${f.day(f.latest.date)}, covered ${f.units(f.latest.units)} vehicles. Dealers inspect and reinstall the springs. This is the campaign most likely to be open on a used 2021 to 2023 model today.</p>
<h2>4xe battery fires</h2>
<p>The plug-in Grand Cherokee 4xe has its own campaigns on the high-voltage battery, which could fail internally and start a fire with the vehicle off, and on the hybrid control software, which could cause a loss of drive power. Battery campaigns came with a park-outside instruction. The ${h.a('brand:jeep', 'Jeep page')} explains how they were handled across the Wrangler and Grand Cherokee 4xe.</p>
<h2>EcoDiesel and the older generation</h2>
<p>The 2014 to 2019 Grand Cherokee with the 3.0 liter EcoDiesel shares campaigns with the Ram 1500: EGR coolers, high-pressure fuel pumps, crankshaft sensor tone wheels. The ${h.a('model:1500', 'Ram 1500 page')} covers them from the truck side. For the gas V6 and V8 of those years, campaigns concern alternators, cruise control and electrical systems.</p>
`,
  faqs: [
    { q: 'Which Jeep Grand Cherokee years have the most recalls?', a: `The ${f.worst} Grand Cherokee, covered by ${f.worstN} campaigns in NHTSA's file, and the 2023 with ${f.my(2023)}, both from the generation launched for 2021 and 2022. Among older years, the 2014 has ${f.my(2014)}, many tied to the EcoDiesel. The 2020 has the fewest, ${f.my(2020)}.` },
    { q: 'What is the Grand Cherokee coil spring recall?', a: 'Two 2026 campaigns on 2021 to 2023 Grand Cherokee, Grand Cherokee L and 4xe models whose rear coil springs might have been installed incorrectly and could come loose while driving. Jeep dealers inspect and reinstall them free of charge. Check the VIN on nhtsa.gov or the Jeep owner site.' },
    { q: 'Are Grand Cherokee L and 4xe recalls included?', a: 'Yes. NHTSA lists Grand Cherokee L and Grand Cherokee 4XE as separate names in many campaigns, and this page counts them with the Grand Cherokee. The model year tool shows every campaign for the year you choose, with the vehicles it names.' },
  ],
  related: ['brand:jeep', 'model:1500'],
});
