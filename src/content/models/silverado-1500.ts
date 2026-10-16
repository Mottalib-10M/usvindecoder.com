import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('silverado-1500');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'silverado-1500', brand: 'chevrolet',
  title: `Chevy Silverado 1500 Recalls by Year: ${f.c} NHTSA Campaigns`,
  description: `Chevrolet Silverado 1500 recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.worstN} on the ${f.worst} truck. Each year with crash ratings and EPA mpg.`,
  h1: 'Chevrolet Silverado 1500 recalls by model year',
  intro: `NHTSA's file lists ${f.c} campaigns on Silverado 1500 model years 2012 to 2026; the ${f.worst} truck has the most, ${f.worstN}. Pick your year to see each one.`,
  resume: `The Silverado 1500 has a lighter recall record than its Ford rival: ${f.c} campaigns cover Silverado 1500 model years 2012 to 2026 in NHTSA's file, with the most, ${f.worstN}, on the ${f.worst} truck, and ${f.my(2015)} on the 2015. The current generation, launched for 2019, shows ${f.my(2019)} campaigns on its first year and fewer since: ${f.my(2023)} on the 2023 and ${f.my(2024)} on the 2024. Air bags lead the systems recalled with ${f.compN(0)} campaigns, then hydraulic brakes (${f.compN(1)}) and seat belts (${f.compN(2)}). Most of these campaigns also name the GMC Sierra, and often the Tahoe, Suburban and Yukon, because General Motors files one campaign for the whole truck family. NHTSA keeps the heavy-duty Silverado 2500 and 3500 as separate models, not counted here, and the electric Silverado EV too. Crew cab versions hold five stars overall in most rated years.`,
  body: (h) => `
<h2>The brake vacuum pump campaign</h2>
<p>${big[1].id}, received on ${f.day(big[1].date)}, covered ${f.units(big[1].units)} GM trucks and SUVs from 2014 to 2018: the vacuum pump that assists the brakes could lose output over time, making the pedal hard to push and lengthening stops. GM reprogrammed the brake control module to use the anti-lock pump for assist when vacuum dropped. A 2014 to 2018 Silverado 1500 with a hard brake pedal should have it checked first.</p>
<h2>Air bags on the 2014 to 2017 trucks</h2>
<p>The largest campaign naming the Silverado 1500, ${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} GM trucks and SUVs whose air bags could fail to deploy because of a software anomaly in the sensing module, discovered after a fatal crash. The remedy was a software update. Air bag campaigns keep appearing on these years: the latest one in the file, ${f.latest.id} of ${f.day(f.latest.date)}, again concerns ${f.latest.years} trucks.</p>
<h2>Read the Sierra and Chevrolet pages</h2>
<p>Because the Sierra 1500 shares the Silverado's frame, engines and electronics, the ${h.a('brand:gmc', 'GMC page')} lists nearly the same campaigns; the ${h.a('brand:chevrolet', 'Chevrolet page')} shows the whole brand. The ${h.a('model:equinox', 'Equinox page')} covers Chevrolet's best-selling crossover.</p>
`,
  faqs: [
    { q: 'Which Silverado 1500 year has the most recalls?', a: `The ${f.worst} Silverado 1500, covered by ${f.worstN} campaigns in NHTSA's file, followed by the 2020 and 2015 trucks. The 2023 and 2024 models have the fewest so far, with ${f.my(2023)} and ${f.my(2024)}. Remember that a recent model year has had less time to collect campaigns than an old one.` },
    { q: 'Are Silverado 2500 HD recalls included?', a: 'No. NHTSA lists the heavy-duty Silverado 2500 and 3500 as separate models, and many campaigns concern only them, such as those on Duramax diesel parts or heavy towing equipment. Use the recall check with Silverado 2500 or 3500 as the model to see those campaigns.' },
    { q: 'Is my Silverado recall the same one my neighbor’s Sierra has?', a: 'Very likely. General Motors files most truck campaigns for the Chevrolet Silverado and the GMC Sierra together, since they share their structure, engines and most electronics. A campaign on a feature only one truck has, such as GMC’s MultiPro tailgate, names a single brand.' },
  ],
  related: ['brand:chevrolet', 'brand:gmc', 'model:equinox'],
});
