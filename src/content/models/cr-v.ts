import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('cr-v');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'cr-v', brand: 'honda',
  title: `Honda CR-V Recalls by Model Year: Gas and Hybrid Since 2012`,
  description: `Honda CR-V recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.worstN} on the ${f.worst} SUV, fuel pumps first. Each year with NCAP stars and EPA mpg.`,
  h1: 'Honda CR-V recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on CR-V model years 2012 to 2026, hybrid included; the ${f.worst} CR-V has the most, ${f.worstN}. Pick your year to see each one.`,
  resume: `The CR-V's recall list is longest on its fifth generation, sold from 2017 to 2022, the first with a turbocharged 1.5 liter engine: ${f.my(2017)} campaigns cover the 2017, ${f.my(2019)} the 2019 and ${f.worstN} the ${f.worst}, the peak. In all, NHTSA's file lists ${f.c} campaigns on CR-V and CR-V Hybrid model years 2012 to 2026. The fuel system leads with ${f.compN(0)} campaigns, a reflection of Honda's 2023 fuel pump recall and of fuel supply pipe and high-pressure pump campaigns, ahead of equipment, air bags and electrical faults. The CR-V Fuel Cell EV, a hydrogen plug-in version sold from 2025, appears in campaigns on the tire repair kit. NCAP has rated the CR-V five stars overall every year since 2016. For 2025, the gas CR-V is rated ${f.epa(2025)?.gasMin} mpg combined and the hybrid up to ${f.epa(2025)?.gasMax}.`,
  body: (h) => `
<h2>Fuel pumps, fuel pipes and the 2023 campaign</h2>
<p>${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} Hondas and Acuras from 2013 to 2023, the CR-V among them: the fuel pump could fail and the engine stall while driving. Earlier, a 2017 campaign concerned fuel supply pipes on the 2017 CR-V that could crack and leak, and a 2024 one high-pressure fuel pumps on hybrids. Fuel campaigns are worth confirming on any used CR-V from those years.</p>
<h2>Steering and the 2023 redesign</h2>
<p>The sixth-generation CR-V, launched for 2023 with a larger hybrid share, appears in ${f.my(2023)} campaigns, among them ${big[1].id}, received on ${f.day(big[1].date)}, which covered ${f.units(big[1].units)} Hondas and Acuras whose steering gearbox worm wheel could deform and make steering harder. Dealers apply a software update and grease, or replace the gearbox. Two campaigns in 2026 concern the tire repair kit of hybrid and fuel cell versions; the second, ${f.latest.id}, redid the remedy of the first.</p>
<h2>What about oil dilution?</h2>
<p>Owners of 2017 to 2018 CR-Vs with the 1.5 liter turbo reported fuel mixing into the engine oil in cold climates. Honda answered with software updates and an extended warranty, not a safety recall, so it does not appear in the list. The ${h.a('model:civic', 'Civic')} and ${h.a('model:accord', 'Accord')} pages show the campaigns they share with the CR-V, and the ${h.a('brand:honda', 'Honda page')} shows the whole brand.</p>
`,
  faqs: [
    { q: 'Which Honda CR-V years have the most recalls?', a: `The ${f.worst} CR-V, covered by ${f.worstN} campaigns in NHTSA's file, then the 2019 and 2023, all from the fifth and sixth generations. Many of these campaigns are shared with other Hondas, such as the 2023 fuel pump campaign and the 2024 steering campaign, so a given CR-V may be in a few of them only.` },
    { q: 'Is the CR-V oil dilution problem a recall?', a: 'No. Fuel diluting the oil on some 2017 and 2018 CR-Vs with the 1.5 liter turbo was handled by Honda with software updates and extended powertrain warranty coverage, not a NHTSA safety recall. A Honda dealer can tell you whether that work was done on a given VIN.' },
    { q: 'Are CR-V Hybrid campaigns included here?', a: 'Yes. NHTSA lists the hybrid as CR-V Hybrid in many campaigns, and this page counts both names, as does the model year tool. Some campaigns name only the hybrid, for example on its high-voltage battery modules or its tire repair kit, so check the vehicle list of each campaign.' },
  ],
  related: ['brand:honda', 'model:civic', 'model:accord'],
});
