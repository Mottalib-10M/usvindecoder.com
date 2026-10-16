import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('model-y');
export default defineModel({
  slug: 'model-y', brand: 'tesla',
  title: `Tesla Model Y Recalls by Model Year: ${f.c} NHTSA Campaigns`,
  description: `Tesla Model Y recalls by model year from NHTSA's file: ${f.c} campaigns since 2019, ${f.worstN} on the 2020 car, most fixed over the air. NCAP stars and EPA range too.`,
  h1: 'Tesla Model Y recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on Model Y model years 2019 to 2026; the 2020 car is in ${f.worstN}, most fixed by software. Pick your year to see them.`,
  resume: `The Model Y entered NHTSA's records with the 2020 model year, and its first years carry long recall lists: ${f.worstN} campaigns cover the 2020, ${f.my(2021)} the 2021 and ${f.my(2022)} the 2022, against ${f.my(2024)} for the 2024 and ${f.my(2025)} for the 2025. Two reasons explain it. Most Tesla campaigns are software campaigns that name every vehicle running the affected code, so an early Model Y collects every fleet-wide software recall of the following years. And a few hardware campaigns concern early builds, such as roof trim and suspension fasteners. In all, NHTSA's file lists ${f.c} campaigns on Model Y model years 2019 to 2026. The electrical system leads with ${f.compN(0)} campaigns, then forward collision avoidance (${f.compN(1)}), the category of Autopilot and emergency braking software. NCAP rates the Model Y five stars overall in every year we hold; the EPA rates 2025 versions up to ${f.epa(2025)?.combMax} MPGe.`,
  body: (h) => `
<h2>Software campaigns that cover every Model Y</h2>
<p>Fleet-wide campaigns name the Model Y with the Model S, X and 3: the 2023 Autosteer controls, the 2024 warning light font size, a seat belt chime that could fail to sound for an unbelted driver, a pedestrian warning sound muted by a factory reset. Each was remedied over the air. A Model Y that never connects to receive updates keeps them open, which is why the VIN status on ${h.src('nhtsarecalls', 'nhtsa.gov')} matters even for a Tesla.</p>
<h2>Hardware campaigns</h2>
<p>Campaigns needing a service visit concern specific builds: front suspension lateral link fasteners on a few 2026 cars, a hood latch sensor, horn wiring, rear lamps and battery pack contactors. The latest campaign in the file, ${f.latest.id}, received on ${f.day(f.latest.date)}, covered ${f.n(f.latest.units)} vehicles. A small number means Tesla traced the defect to a short production run.</p>
<h2>Range and efficiency by year</h2>
<p>The table below the campaigns gives the EPA efficiency for each year, from ${f.epa(2020)?.combMax} MPGe for 2020 to ${f.epa(2026)?.combMax} for 2026. To turn MPGe into a yearly electricity bill at your rate, use the ${h.a('mpg-by-vin', 'mpg and fuel cost lookup')}. The ${h.a('brand:tesla', 'Tesla page')} explains how over-the-air recalls work.</p>
`,
  faqs: [
    { q: 'Why does the 2020 Model Y have so many recalls?', a: `Because most Tesla campaigns are software campaigns covering every car on the affected code, and the 2020 Model Y has been on the road for every one of them since. NHTSA's file lists ${f.worstN} campaigns on it, most remedied over the air without a visit. Newer model years have had fewer years of campaigns.` },
    { q: 'How do I know a Model Y recall update was installed?', a: 'The car’s software version shows in the Tesla screen and app, and the VIN status on nhtsa.gov shows whether each campaign is remedied. If an update is pending, connecting the car to Wi-Fi and installing it closes software campaigns; hardware campaigns need a service appointment.' },
    { q: 'Are Model Y recalls a sign of a less safe car?', a: 'Not on their own. NCAP rates the Model Y five stars overall in every year we hold, and many of its campaigns fix compliance details, such as warning light fonts or headlight brightness, rather than crash protection. Open campaigns should still be completed, especially those on suspension or seat belts.' },
  ],
  related: ['brand:tesla', 'mpg-by-vin'],
});
