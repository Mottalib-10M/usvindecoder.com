import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('1500');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: '1500', brand: 'ram',
  title: `Ram 1500 Recalls by Model Year: ${f.c} Campaigns Since 2013`,
  description: `Ram 1500 recalls by model year from NHTSA's file: ${f.c} campaigns since 2013, ${f.worstN} on the ${f.worst} truck, the first of the current generation. Crash ratings and mpg too.`,
  h1: 'Ram 1500 recalls by model year',
  intro: `NHTSA's file lists ${f.c} campaigns on Ram 1500 model years 2013 to 2026; the ${f.worst} truck has the most, ${f.worstN}. Pick your year to see every campaign.`,
  resume: `The Ram 1500 is the most recalled light pickup on this site after the F-150: ${f.c} campaigns cover its model years 2013 to 2026 in NHTSA's file, against ${f.my(2012)} for the 2012, still registered under Dodge for many campaigns. Every year from 2013 to 2022 carries between ${f.my(2023)} and ${f.my(2015)} campaigns, then the ${f.worst}, first of the fifth generation, jumps to ${f.worstN}. Air bags lead the systems with ${f.compN(0)} campaigns, followed by the power train (${f.compN(1)}) and rearview cameras (${f.compN(2)}). The largest is Stellantis's cruise control campaign ${big[0].id}, received on ${f.day(big[0].date)}, which covered ${f.units(big[0].units)} vehicles. NHTSA lists the previous generation, sold until 2024 alongside the new one as the 1500 Classic, under the same 1500 name in many campaigns. NCAP rates crew cab versions four or five stars overall; the EPA rates 2025 gas and mild hybrid trucks ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>Curtain air bag inflators on the 2019 trucks</h2>
<p>The 2019 Ram 1500 collects campaigns on side curtain air bag inflators that could rupture because of a manufacturing defect, on air bags that might not be connected, and on seat belt buckle anchors. An air bag inflator campaign is one to complete without delay, whatever the age of the truck. The ${h.a('takata-airbag-recall', 'air bag inflator guide')} explains why.</p>
<h2>EcoDiesel campaigns</h2>
<p>The 3.0 liter EcoDiesel offered on the 1500 from 2014 has its own campaigns, shared with the Jeep Grand Cherokee: EGR coolers that could crack and start a fire, high-pressure fuel pumps that could fail, and crankshaft position sensor tone wheels that could stall the engine. If you buy a diesel 1500, check those first. The ${h.a('model:grand-cherokee', 'Grand Cherokee page')} lists the same campaigns from the Jeep side.</p>
<h2>Stability control and cameras on recent trucks</h2>
<p>A 2024 campaign covered trucks whose anti-lock brake module software could disable electronic stability control, and several concerned rearview cameras that could short and stop displaying. The latest campaign naming the 1500, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns the ${f.latest.component.toLowerCase()} of ${f.latest.years} trucks. The ${h.a('brand:ram', 'Ram page')} covers the heavy-duty trucks and vans.</p>
`,
  faqs: [
    { q: 'What year Ram 1500 has the most recalls?', a: `The ${f.worst} Ram 1500, first year of the fifth generation, is covered by ${f.worstN} campaigns in NHTSA's file, the most of any year since 2013. The 2015 follows with ${f.my(2015)}. Many 2019 campaigns concern air bags and seat belt anchors, items worth checking on the VIN of any truck from that year.` },
    { q: 'Are Ram 1500 Classic recalls on this page?', a: 'Mostly. NHTSA often records the Classic, the previous generation sold alongside the new truck until 2024, under the same 1500 name, so its campaigns are counted here. Some campaigns name it as 1500 Classic; search that name in the recall check, or start from the VIN.' },
    { q: 'Is the Ram EcoDiesel EGR cooler recall a fire risk?', a: 'Yes. Campaigns on the 3.0 liter EcoDiesel in 2014 to 2019 Ram 1500 and Jeep Grand Cherokee concerned EGR coolers that could crack, letting coolant into the hot intake and possibly causing a fire. Dealers replace the cooler. Check the VIN on nhtsa.gov to confirm the work.' },
  ],
  related: ['brand:ram', 'model:grand-cherokee'],
});
