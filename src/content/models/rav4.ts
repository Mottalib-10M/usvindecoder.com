import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('rav4');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'rav4', brand: 'toyota',
  title: `Toyota RAV4 Recalls by Model Year: Hybrid and Prime Included`,
  description: `Toyota RAV4 recalls by model year from NHTSA's file: ${f.c} campaigns since 2012 on the RAV4, RAV4 Hybrid and Prime, ${f.worstN} on the ${f.worst}. Crash ratings and EPA mpg too.`,
  h1: 'Toyota RAV4 recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on RAV4 model years 2012 to 2026, gas, hybrid and plug-in together; the ${f.worst} has the most, ${f.worstN}. Pick your year.`,
  resume: `America's best-selling SUV has a moderate recall record: ${f.c} campaigns cover RAV4 model years 2012 to 2026 in NHTSA's file, counting the RAV4 Hybrid, the RAV4 Prime and its 2026 successor, the RAV4 Plug-In Hybrid, which NHTSA lists under their own names. No year exceeds ${f.maxN} campaigns; the ${f.worst}, first of the fifth generation, carries the most. The equipment category leads with ${f.compN(0)} campaigns, a group that includes accessories and replacement parts, ahead of air bags and stability control (${f.compN(1)} each). The largest campaign, ${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} 2013 to 2018 RAV4s whose replacement 12-volt batteries could shift in the tray and short against the hold-down clamp, a fire risk. NCAP rates the RAV4 five stars overall in every year from 2016 to 2025. For 2025, gas, hybrid and plug-in versions range from ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>A battery hold-down that caused fires</h2>
<p>NHTSA investigated RAV4 fires starting in the engine compartment of 2013 to 2018 models and traced several to replacement 12-volt batteries smaller than the original, which could move when the hold-down was not tightened correctly and touch the positive terminal. Toyota's remedy was a new hold-down clamp, battery tray and positive terminal cover. If you own one of those RAV4s and the battery was ever replaced, the campaign matters even if the car runs perfectly.</p>
<h2>Hybrid and plug-in campaigns</h2>
<p>The RAV4 Hybrid and Prime carry their own campaigns on the hybrid control system, the inverter and, on the plug-in, the motor generator control unit; the latest campaign in the file, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns the ${f.latest.years} plug-in hybrid. In the model year tool, every campaign is listed for the year whatever the version, so check the vehicle list of each campaign against your own RAV4.</p>
<h2>Fuel pumps of 2018 to 2020</h2>
<p>The second largest campaign naming the RAV4, ${big[1].id}, extended Toyota's low-pressure fuel pump recall to ${f.units(big[1].units)} more Toyota and Lexus vehicles, 2019 and 2020 RAV4s among them: the pump impeller could deform and stop the engine while driving. The ${h.a('model:camry', 'Camry')} and ${h.a('model:tacoma', 'Tacoma')} pages carry the same campaign. The ${h.a('brand:toyota', 'Toyota page')} shows the brand as a whole.</p>
`,
  faqs: [
    { q: 'Which RAV4 year has the most recalls?', a: `The ${f.worst} RAV4, first year of the generation sold through 2025, is covered by ${f.worstN} campaigns in NHTSA's file, the most since 2012. No RAV4 year exceeds ${f.maxN}. Hybrid and plug-in campaigns are included in these counts, so a given gas RAV4 may be affected by fewer.` },
    { q: 'What is the RAV4 12-volt battery recall?', a: 'A 2023 campaign on about 1.85 million 2013 to 2018 RAV4s. A replacement battery smaller than the original could move in its tray if the hold-down was loose, contact the hold-down clamp and short, which could start a fire. Toyota dealers install an improved clamp, tray and terminal cover for free.' },
    { q: 'Are RAV4 Prime recalls the same as RAV4 Hybrid recalls?', a: 'Not always. NHTSA lists the RAV4 Prime and the 2026 RAV4 Plug-In Hybrid separately, and campaigns on the plug-in battery, the charger or the motor generator control unit name only the plug-in. Campaigns on shared parts, such as air bags or seats, name all versions.' },
  ],
  related: ['brand:toyota', 'model:camry', 'model:tacoma'],
});
