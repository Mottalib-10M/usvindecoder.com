import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('tacoma');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'tacoma', brand: 'toyota',
  title: `Toyota Tacoma Recalls by Model Year, With NCAP and MPG`,
  description: `Toyota Tacoma recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, none on the 2021 truck, ${f.my(2024)} on the redesigned 2024. NCAP stars and mpg too.`,
  h1: 'Toyota Tacoma recalls by model year',
  intro: `NHTSA's file lists ${f.c} campaigns on Tacoma model years 2012 to 2026; the 2021 truck has none, the redesigned 2024 has ${f.my(2024)}. Pick your year to see them.`,
  resume: `The Tacoma, Toyota's midsize pickup, has a short recall list for a truck sold in such numbers: ${f.c} campaigns cover model years 2012 to 2026 in NHTSA's file, at most ${f.maxN} in a year, and none on the ${f.zero.join(' and ')} models. The fourth generation, launched for 2024 with a turbocharged four-cylinder and the i-Force Max hybrid, which NHTSA lists as Tacoma Hybrid, shows ${f.my(2024)} campaigns on its first year and ${f.my(2025)} on the 2025. Equipment leads the systems with ${f.compN(0)} campaigns, a category covering accessories such as running boards and towing hardware, ahead of air bags and brakes. NCAP has rated the Tacoma four stars overall in every rated year we hold, one star below most pickups, largely because of its rollover rating. Fuel economy is modest: ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined for 2025.`,
  body: (h) => `
<h2>Brake hoses and suspension on the 2024 trucks</h2>
<p>The redesigned Tacoma's first year brought campaigns on rear brake hoses of four-wheel-drive trucks, which mud and debris could damage off road, on suspension parts, and on equipment shared with the Tundra and the RAV4 Hybrid. The latest campaign naming the Tacoma, ${f.latest.id}, received on ${f.day(f.latest.date)}, concerns ${f.units(f.latest.units)} vehicles across the Tacoma Hybrid, Tundra and RAV4 Hybrid. A small campaign size usually means a defect traced to a short production run.</p>
<h2>Fuel pumps on 2017 to 2020 trucks</h2>
<p>The two largest campaigns naming the Tacoma are Toyota's low-pressure fuel pump campaigns, ${big[0].id} and ${big[1].id}, which together covered ${f.units(big[0].units + big[1].units)} Toyota and Lexus vehicles, the Tacoma among them, because the pump impeller could deform and stall the engine. If you buy a 2017 to 2020 Tacoma, confirm on the VIN that the pump was replaced.</p>
<h2>Frame rust is not in the list</h2>
<p>Second-generation Tacomas from 2005 to 2010 suffered severe frame corrosion, which Toyota handled through a frame inspection and replacement program, not a NHTSA safety recall, and most of those trucks fall outside this page's model years. A ${h.a('recall-check', 'recall check')} will not show it; a lift and a hammer will. The ${h.a('model:rav4', 'RAV4')} and ${h.a('model:camry', 'Camry')} pages cover the rest of Toyota's best sellers.</p>
`,
  faqs: [
    { q: 'Why is the Toyota Tacoma rated four stars, not five?', a: 'NCAP has given the Tacoma four stars overall in every rated year we hold. Pickups sit high, and their rollover rating, computed from the vehicle’s stability, is often four stars or less, which pulls the overall score down. The frontal and side results are listed for each version in the crash ratings lookup.' },
    { q: 'Which Tacoma years have no recalls?', a: `In NHTSA's file, no campaign covers the ${f.zero.join(' or ')} Tacoma. A year with no campaign is not proof of a perfect truck, since service bulletins and warranty programs are not safety recalls, and a recent year has had less time to collect campaigns.` },
    { q: 'Was the Tacoma frame rust problem a recall?', a: 'No. Toyota addressed frame corrosion on 2005 to 2010 Tacomas, and some later trucks, through a frame inspection and replacement program and a class settlement, not through a NHTSA safety recall. It does not appear in the recall list; a Toyota dealer can check a VIN for past program work.' },
  ],
  related: ['brand:toyota', 'model:rav4'],
});
