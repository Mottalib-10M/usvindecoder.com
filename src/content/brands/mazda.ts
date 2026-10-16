import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('mazda');
const g = f.b.recent.find((c) => c.id === '25V568000') ?? f.recent;
export default defineBrand({
  slug: 'mazda',
  title: `Mazda Recalls 2026: CX-5, CX-90, CX-50, Mazda3 by Year`,
  description: `Mazda recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, ${f.dnd} with a do-not-drive warning, none yet in 2026. Check any CX-5, CX-50, CX-90 or Mazda3.`,
  h1: 'Mazda recalls by model year',
  intro: `Mazda appears in ${f.c10} NHTSA campaigns from 2016 to 2025 and none so far in 2026, but ${f.dnd} of them told owners not to drive. Check your Mazda by model year.`,
  resume: `Mazda has one of the shortest recall records of the 18 brands we follow: ${f.c10} vehicle campaigns naming Mazda between 2016 and 2025 in NHTSA's file, ${f.u10} vehicle notices, and none in 2026 by the date of this build. Its do-not-drive count is the opposite: ${f.dnd} campaigns, as many as Ford, all tied to old Takata air bag inflators on 2003 to 2008 Mazda6, RX-8 and MPV models, which NHTSA classes among the most dangerous because of their age. Air bags account for ${f.compN(0)} of Mazda's campaigns, more than any other system, and ${f.airbag} concern inflators. NHTSA's file attributes ${f.nhtsa} Mazda campaigns since 2016 to agency influence, a high share for the brand. Since 2021 the newest models dominate the list: the CX-90 three-row SUV appears in ${f.n(f.top[0][1])} campaigns, the Mazda3 in ${f.n(f.top[1][1])}.`,
  body: (h) => `
<h2>The CX-90's first years</h2>
<p>The CX-90, launched for 2024 with a new rear-drive platform, a mild hybrid inline-six and a plug-in hybrid, appears in more campaigns since 2021 than any other Mazda, on software, suspension fasteners and the fuel gauge of mild hybrid versions. One 2025 campaign, ${g.id}, received on ${f.day(g.date)}, concerned a fuel gauge that could show more fuel than was left in the tank, on ${f.units(g.units)} CX-90 and CX-70 mild hybrids. The CX-50 and its hybrid follow with ${f.n(f.top[3][1])} campaigns each.</p>
<h2>A liftgate strut, not an air bag, was the largest</h2>
<p>The biggest Mazda campaign of the period, ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} Mazda3, Mazda5, CX-3 and other models whose rear liftgate gas struts could break and let the liftgate fall. The air bag campaigns that follow it, such as ${f.big2.id}, are smaller but far more urgent.</p>
<h2>Before buying an older Mazda6 or RX-8</h2>
<p>Check the VIN on nhtsa.gov before driving the car. If a frontal air bag campaign is open on a 2003 to 2008 Mazda6, RX-8 or MPV, Mazda's instruction is to not drive it and to arrange towing to a dealer. The ${h.a('takata-airbag-recall', 'Takata guide')} explains why age matters, and the ${h.a('do-not-drive-recalls', 'advisory page')} lists the latest warnings across brands.</p>
`,
  faqs: [
    { q: 'Why does Mazda have so many do-not-drive warnings?', a: `Because of old Takata inflators. Mazda recalled frontal air bag inflators on 2003 to 2008 Mazda6, RX-8 and MPV models, and NHTSA and Mazda told owners of unrepaired cars not to drive them: inflators that old rupture more often. ${f.dnd} Mazda campaigns since 2016 carry the warning, as many as Ford.` },
    { q: 'Are there Mazda recalls in 2026?', a: 'None naming Mazda had been received by NHTSA when this page was built from the recall file. The lookup above queries NHTSA live, so a campaign filed since then appears there as soon as NHTSA lists it, even before our weekly update of the tables.' },
    { q: 'Is the Mazda CX-5 often recalled?', a: 'Less than its sales would suggest. The CX-5, Mazda’s best seller, does not appear among the brand’s most recalled models since 2021; the newer CX-90, CX-50 and Mazda3 do. Every CX-5 model year and its campaigns can be listed in the recall check above, and the VIN decoder shows them next to its crash ratings and mpg.' },
  ],
  related: ['takata-airbag-recall', 'do-not-drive-recalls', 'recall-check'],
});
