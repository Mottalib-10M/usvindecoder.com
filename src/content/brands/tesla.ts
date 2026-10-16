import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('tesla');
export default defineBrand({
  slug: 'tesla',
  title: `Tesla Recalls 2026: Model Y, Model 3, Cybertruck by Year`,
  description: `Tesla recalls from NHTSA's file: ${f.c10} campaigns from 2016 to 2025, most fixed over the air. Check any Model Y, Model 3, Model S, Model X or Cybertruck by year.`,
  h1: 'Tesla recalls and over-the-air fixes',
  intro: `Tesla appears in ${f.c10} NHTSA campaigns from 2016 to 2025, from ${f.y(2016)} in 2016 to ${f.peakN} in ${f.peak}. Most are fixed by software over the air. Check any Tesla below.`,
  resume: `Tesla's recall record is unlike any other brand's because most of its campaigns are remedied by software sent over the air, with no dealer visit. They are still safety recalls in every legal sense: Tesla files a defect report under Part 573, NHTSA assigns a campaign number, and owners receive a notice. NHTSA's file holds ${f.c10} vehicle campaigns naming Tesla between 2016 and 2025, with ${f.u10} vehicle notices, a large number relative to its sales because a software campaign covers every car on the affected code, often every Model S, X, 3 and Y built in several years at once. ${f.big.id}, received on ${f.day(f.big.date)}, covered ${f.units(f.big.units)} vehicles because a warning light font was too small to meet the federal standard. Two months earlier, ${f.big2.id} applied new driver monitoring controls to Autopilot on ${f.units(f.big2.units)} vehicles after an NHTSA investigation into crashes. The Model Y appears in ${f.n(f.top[0][1])} campaigns since 2021.`,
  body: (h) => `
<h2>Over the air does not mean optional</h2>
<p>A software remedy installs when the car accepts the update; a Tesla that is parked without connectivity, or whose owner postpones updates, keeps the campaign open. The VIN status on ${h.src('nhtsarecalls', 'nhtsa.gov/recalls')} shows whether it was applied. When buying a used Tesla, check the software version in the car and the open campaigns on the VIN; physical campaigns, such as the Cybertruck accelerator pedal pad and its exterior trim panel, still need a service visit.</p>
<h2>Autopilot and the investigation behind it</h2>
<p>Campaign ${f.big2.id} followed NHTSA's two-year investigation of Autopilot crashes into stationary emergency vehicles, and NHTSA later opened a recall query to test whether that remedy was adequate. The NHTSA file attributes ${f.nhtsa} Tesla campaigns since 2016 to agency influence. These campaigns change how the driver assistance system behaves rather than replacing a part, and they show up in the VIN record like any other recall.</p>
<h2>Models</h2>
<p>The ${h.a('model:model-y', 'Model Y page')} lists campaigns by model year, with NCAP stars and EPA efficiency. The Model 3 (${f.n(f.top[1][1])} campaigns since 2021), Model X (${f.n(f.top[2][1])}) and Model S (${f.n(f.top[3][1])}) follow, and the Cybertruck added ${f.n(f.top[4][1])} campaigns in its first years. Electrical system campaigns lead with ${f.compN(0)}, a category that includes the software controlling lights, displays and warnings.</p>
`,
  faqs: [
    { q: 'Is an over-the-air Tesla update a real recall?', a: 'Yes, when it fixes a safety defect or a noncompliance. Tesla files the same defect report as any maker and NHTSA assigns a campaign number. The only difference is the remedy, delivered by software. Until the car installs the update the recall stays open on its VIN, which matters when you buy a used Tesla.' },
    { q: 'Why do Tesla recalls cover millions of cars at once?', a: 'A software defect is present on every vehicle running the affected code, regardless of model or year, so one campaign can name the Model S, X, 3, Y and Cybertruck together. The 2024 warning light font campaign covered more than two million cars for that reason, even though no part was faulty.' },
    { q: 'Do I need to visit a service center for a Tesla recall?', a: 'Only for hardware remedies. Most Tesla campaigns are fixed over the air, but some, such as the Cybertruck accelerator pedal and trim panel campaigns or seat belt and suspension fasteners, require a service visit or a mobile technician. The remedy text in each campaign says which applies.' },
  ],
  related: ['model:model-y', 'recall-check', 'how-to-check-car-recalls'],
});
