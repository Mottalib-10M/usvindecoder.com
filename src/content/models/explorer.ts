import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('explorer');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'explorer', brand: 'ford',
  title: `Ford Explorer Recalls by Year: ${f.my(2020)} on the 2020 Model`,
  description: `Ford Explorer recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.my(2020)} on the redesigned 2020 SUV. Every year with crash ratings and EPA mpg, free.`,
  h1: 'Ford Explorer recalls by model year',
  intro: `The 2020 Explorer, first of the rear-drive generation, is in ${f.my(2020)} recall campaigns, more than any other year. NHTSA's file holds ${f.c} since 2012. Pick your year.`,
  resume: `The Explorer was redesigned for 2020 on a new rear-wheel-drive platform built in Chicago, and its launch year carries the heaviest recall load of any Explorer since 2012: ${f.my(2020)} campaigns on the 2020 model, ${f.my(2021)} on the 2021 and ${f.my(2022)} on the 2022, against ${f.my(2018)} on the 2018 and ${f.my(2019)} on the 2019, the last of the previous generation. In all, NHTSA's file lists ${f.c} campaigns covering Explorer model years 2012 to 2026, including the hybrid and plug-in hybrid versions. Rearview cameras lead the systems recalled (${f.compN(0)} campaigns), followed by the power train (${f.compN(1)}) and the fuel system (${f.compN(2)}). On safety ratings, the Explorer has kept five stars overall on its rated versions in almost every year we hold, and its 2025 gas versions are rated ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>The largest campaign: trim that could fly off</h2>
<p>${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} Explorers from 2011 to 2019: the retention clips of the A-pillar trim, beside the windshield, might not be engaged, so the trim could come loose at highway speed and hit a following vehicle. Dealers inspect and replace the clips. It is a small part, but the sheer number of trucks makes it the campaign a used 2011 to 2019 Explorer is most likely to carry open.</p>
<h2>Rearview cameras, again and again</h2>
<p>Back-over prevention campaigns, the federal category for rearview cameras, lead the Explorer's list. Several were reissued after a first remedy failed, such as ${big[1].id} in ${new Date(big[1].date).getUTCFullYear()}, which covered ${f.units(big[1].units)} Fords including the 2015 Explorer. A camera that shows a blank or frozen image is not a cosmetic fault: since May 2018 every new light vehicle must have one, so a failure is a noncompliance with a federal standard.</p>
<h2>Police Interceptor Utility</h2>
<p>The police version is listed separately by NHTSA in some campaigns, as Explorer Police Interceptor, and is not counted here. Former police Explorers sold at auction carry their own campaigns. To check one, use the ${h.a('recall-check', 'recall check')} with the exact name. The ${h.a('model:escape', 'Escape')} and ${h.a('model:f-150', 'F-150')} pages cover Ford's other best sellers.</p>
`,
  faqs: [
    { q: 'Which Ford Explorer years have the most recalls?', a: `The 2020 model, covered by ${f.my(2020)} campaigns in NHTSA's file, then the 2021 (${f.my(2021)}) and 2022 (${f.my(2022)}), all from the generation launched for 2020. The 2018 and 2019 Explorers, last of the front-drive generation, carry ${f.my(2018)} and ${f.my(2019)}. Small or software campaigns count the same as large ones here.` },
    { q: 'What is the Explorer A-pillar trim recall?', a: 'A 2024 campaign covering about 1.9 million 2011 to 2019 Explorers whose A-pillar trim clips might not be fully engaged, letting the trim detach while driving. Dealers inspect the clips and replace them as needed, free of charge. Check the VIN of any Explorer from those years.' },
    { q: 'Are Explorer Hybrid recalls on this page?', a: 'Yes. NHTSA lists the hybrid and plug-in hybrid as Explorer Hybrid and Explorer PHEV in some campaigns, and this page counts those names with the gas Explorer. The Police Interceptor versions are separate and not included; check them by their own name in the recall check.' },
  ],
  related: ['brand:ford', 'model:escape'],
});
