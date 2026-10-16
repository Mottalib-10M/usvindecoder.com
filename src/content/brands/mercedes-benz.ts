import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('mercedes-benz');
export default defineBrand({
  slug: 'mercedes-benz',
  title: `Mercedes-Benz Recalls 2026: Sprinter, GLC, GLE by Year`,
  description: `Mercedes-Benz recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, second of 18 brands, Sprinter vans first. Check a GLC, GLE or Sprinter by year.`,
  h1: 'Mercedes-Benz recalls, Sprinter vans included',
  intro: `Mercedes-Benz appears in ${f.c10} NHTSA campaigns from 2016 to 2025, second only to Ford; Sprinter vans account for many. Check any Mercedes by model year below.`,
  resume: `Mercedes-Benz ranks second of the 18 brands in our table for vehicle campaigns, with ${f.c10} received by NHTSA between 2016 and 2025, yet only ${f.u10} vehicle notices: many of its campaigns are small, sometimes a few dozen cars. Three things build the count. Mercedes-Benz USA files frequent, narrowly drawn campaigns, often for parts fitted during a few days of production. Each model variant has its own NHTSA name (GLC 300, GLC 300 4MATIC, AMG GLC 43), so one defect can create long model lists. And the Sprinter van, sold under the Mercedes-Benz make, splits into 1500, 2500, 3500 and 4500 versions: since 2021 they lead the model list with ${f.n(f.top[0][1])}, ${f.n(f.top[1][1])}, ${f.n(f.top[2][1])} and ${f.n(f.top[3][1])} campaigns. The ${f.comp(0)} dominates with ${f.compN(0)} campaigns, then air bags (${f.compN(1)}). The yearly count peaked at ${f.peakN} in ${f.peak} and has fallen every year since, to ${f.y(2025)} in 2025.`,
  body: (h) => `
<h2>The eCall campaign</h2>
<p>The largest Mercedes-Benz campaign of the period, ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} cars from 2016 to 2021, almost every passenger model: after a crash, the automatic emergency call system could send a wrong location to emergency services. The remedy was a software update. It is classed under communication rather than electrical systems, which is why it does not inflate the first line of the component table.</p>
<h2>Sprinter vans: check the chassis and the body builder</h2>
<p>Sprinters are often upfitted as ambulances, RVs, shuttle buses or delivery vans. Mercedes-Benz handles campaigns on the chassis it built; the company that converted it is responsible for its own work, and its campaigns are filed under its name. For a camper van, check the Sprinter VIN and the converter. NHTSA's file classes many Sprinter campaigns under steering, structure and fuel system.</p>
<h2>Fewer campaigns since 2021</h2>
<p>From ${f.peakN} campaigns in ${f.peak}, Mercedes-Benz dropped to ${f.y(2025)} in 2025 and ${f.c26} in 2026 so far, the steepest fall of any brand we follow. The latest campaign in this build, ${f.recent.id}, received on ${f.day(f.recent.date)}, covers ${f.units(f.recent.units)} vehicles. Compare with the ${h.a('brand:bmw', 'BMW page')}, and check any model in the ${h.a('recall-check', 'recall check')} using the exact badge, such as GLE 450 4MATIC.</p>
`,
  faqs: [
    { q: 'Why does Mercedes-Benz have so many recalls?', a: `Mercedes-Benz USA files many small campaigns, some for a few dozen cars, and NHTSA lists every engine and drivetrain variant as its own model. The Sprinter van line adds four more model names. That gives ${f.c10} campaigns from 2016 to 2025, but only ${f.u10} vehicle notices, a low number per campaign.` },
    { q: 'Who fixes a recall on a Sprinter camper van?', a: 'Mercedes-Benz dealers fix campaigns on the van as built: engine, steering, brakes, air bags, electronics. The converter that installed the living area, the electrical system or the bed is a final-stage manufacturer and files its own campaigns. Check both, using the Sprinter VIN and the converter name on the door jamb label.' },
    { q: 'What was the Mercedes eCall recall?', a: 'A 2021 campaign covering about 1.3 million 2016 to 2021 Mercedes-Benz cars. After a crash, the automatic emergency call could transmit an incorrect location, which could delay responders. Dealers updated the communication module software for free; the update is recorded against each VIN.' },
  ],
  related: ['brand:bmw', 'recall-check', 'do-not-drive-recalls'],
});
