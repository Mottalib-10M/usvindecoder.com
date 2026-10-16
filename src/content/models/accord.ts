import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('accord');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'accord', brand: 'honda',
  title: `Honda Accord Recalls by Model Year: Air Bags, Fuel Pumps`,
  description: `Honda Accord recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.compN(0)} on air bags, ${f.worstN} on the ${f.worst} model. NCAP stars and EPA mpg for each year.`,
  h1: 'Honda Accord recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on Accord model years 2012 to 2026. The ${f.worst} Accord has the most, ${f.worstN}, and the 2012 has ${f.my(2012)}, nearly all air bags. Pick your year.`,
  resume: `The Accord's recall list is shaped by two eras. The 2012 model, last of the eighth generation, is covered by ${f.my(2012)} campaigns in NHTSA's file, almost all of them successive waves of Honda's Takata inflator recalls, which reached Accords built through 2012. The later years settle at three to six campaigns, until the eleventh generation, launched for 2023, which brought ${f.worstN} on its first year, the highest of any Accord since 2012, on seats, software, fuel pumps and the tire repair kit of the hybrid. In all, ${f.c} campaigns cover Accord and Accord Hybrid model years 2012 to 2026. Air bags lead the systems with ${f.compN(0)} campaigns, then the fuel system (${f.compN(1)}). NCAP has rated every Accord year we hold at five stars overall. For 2025, the EPA rates the gas Accord ${f.epa(2025)?.gasMin} mpg combined and the hybrid up to ${f.epa(2025)?.gasMax}.`,
  body: (h) => `
<h2>Takata inflators on the 2008 to 2012 Accords</h2>
<p>Honda recalled the driver and passenger inflators of the 2008 to 2012 Accord in several waves, and some cars received a replacement inflator that was itself recalled later; that is why one model year collects so many campaigns. ${big[1].id}, received on ${f.day(big[1].date)}, extended the passenger inflator campaigns to ${f.units(big[1].units)} more Hondas and Acuras. An older Accord with an open air bag campaign should not wait: the ${h.a('takata-airbag-recall', 'Takata guide')} explains why age and humid climates raise the risk.</p>
<h2>Fuel pumps and cameras on the tenth generation</h2>
<p>The 2018 to 2022 Accord, with its turbocharged engines, appears in the 2023 fuel pump campaign ${big[0].id}, which covered ${f.units(big[0].units)} vehicles, and in two campaigns on the rearview camera display, which could fail to show the image. A rearview camera fault is a federal noncompliance since May 2018, which is why makers recall it.</p>
<h2>2023 and later</h2>
<p>The eleventh-generation Accord, mostly sold as a hybrid, has campaigns on the driver's seat cushion frame, a software error in the integrated control module and the tire repair kit, shared with the ${h.a('model:cr-v', 'CR-V Hybrid')}. The ${h.a('model:civic', 'Civic page')} and the ${h.a('model:camry', 'Toyota Camry page')} give the same view of its sibling and its rival.</p>
`,
  faqs: [
    { q: 'Why does the 2012 Honda Accord have so many recalls?', a: `Because of Takata. Honda recalled the 2008 to 2012 Accord’s air bag inflators in several waves, sometimes replacing a first replacement, and each wave is its own campaign: ${f.my(2012)} campaigns cover the 2012 model in NHTSA's file, nearly all air bags. Check the VIN to see which remain open on one car.` },
    { q: 'Which recent Accord year has the most recalls?', a: `The ${f.worst} Accord, first of the generation launched that year, is covered by ${f.worstN} campaigns, on seats, control module software, fuel pumps and the hybrid’s tire repair kit. The 2021 and 2022 Accords have ${f.my(2021)} each. A recent year keeps collecting campaigns as it ages.` },
    { q: 'Are Accord Hybrid recalls counted with the Accord?', a: 'Yes. NHTSA lists the hybrid as Accord Hybrid in many campaigns, and this page and its model year tool count both names. Campaigns that concern only the hybrid, such as its tire repair kit, appear next to those covering every Accord of the year.' },
  ],
  related: ['brand:honda', 'model:civic', 'model:cr-v'],
});
