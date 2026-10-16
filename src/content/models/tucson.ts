import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('tucson');
export default defineModel({
  slug: 'tucson', brand: 'hyundai',
  title: `Hyundai Tucson Recalls by Model Year, Hybrid and Plug-In Too`,
  description: `Hyundai Tucson recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.worstN} on the ${f.worst} SUV, hybrid and plug-in included. NCAP stars and EPA mpg too.`,
  h1: 'Hyundai Tucson recalls by model year',
  intro: `NHTSA's file holds ${f.c} campaigns on Tucson model years 2012 to 2026. After a quiet 2018 to 2021, the ${f.worst} Tucson has the most, ${f.worstN}. Pick your year.`,
  resume: `The Tucson went through 2018, 2019, 2020 and 2021 with a single campaign each in NHTSA's file, then the fourth generation, launched for 2022 with hybrid and plug-in hybrid versions, began collecting more: ${f.my(2022)} on the 2022, ${f.my(2024)} on the 2024, ${f.worstN} on the ${f.worst} and ${f.my(2026)} already on the 2026. In all, ${f.c} campaigns cover Tucson model years 2012 to 2026, counting the Tucson Hybrid and Tucson Plug-In Hybrid. The electrical system leads with ${f.compN(0)} campaigns, then air bags and hydraulic brakes (${f.compN(1)} each). The ABS fire campaigns that marked Hyundai's record cover older Tucsons: a 2020 campaign, expanded in December 2020, covered 2016 to 2021 models whose ABS module could short and burn, with a park-outside warning. NCAP rates the Tucson five stars overall in most years since 2016. For 2025, gas, hybrid and plug-in versions range from ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>Recent campaigns: software, cameras and engines</h2>
<p>The 2025 and 2026 Tucsons appear in campaigns on the front camera software of the driver assistance systems, on side curtain air bags that might not be attached, on connecting rod bolts that might not be tightened, and on instrument panel software. The latest campaign naming the Tucson, ${f.latest.id}, received on ${f.day(f.latest.date)}, covered ${f.units(f.latest.units)} vehicles of the ${f.latest.years} model years.</p>
<h2>ABS modules on the 2016 to 2021 Tucson</h2>
<p>Hyundai first recalled 2019 to 2021 Tucsons in September 2020 because the ABS module could short circuit and start a fire even with the engine off, then expanded the campaign in December 2020 to 2016 to 2018 models. Owners were told to park outside until a dealer installed a new fuse. A used Tucson from those years should show the campaign as completed on its VIN.</p>
<h2>Hybrid and plug-in versions</h2>
<p>Several campaigns name only the hybrid or plug-in, on high-voltage components and the integrated charging unit shared with other Hyundai and Kia models. The ${h.a('brand:hyundai', 'Hyundai page')} explains the park-outside campaigns and the anti-theft software upgrade, which is not a recall. Compare the Tucson with the ${h.a('model:rav4', 'RAV4')} and ${h.a('model:cr-v', 'CR-V')}.</p>
`,
  faqs: [
    { q: 'Which Hyundai Tucson year has the most recalls?', a: `The ${f.worst} Tucson, covered by ${f.worstN} campaigns in NHTSA's file, from the generation launched for 2022 with hybrid and plug-in versions. The 2018 to 2021 models have one campaign each. A newer year keeps collecting campaigns as software and parts issues come to light.` },
    { q: 'Is the Tucson ABS fire recall fixed on my car?', a: 'Hyundai dealers install an ABS fuse free of charge under the campaign that covers 2016 to 2021 Tucsons. Whether one car received it is recorded against its VIN: check nhtsa.gov or Hyundai’s owner site. Until then, follow the advisory and park outside, away from buildings.' },
    { q: 'Are Tucson Hybrid and Plug-In recalls on this page?', a: 'Yes. NHTSA lists Tucson Hybrid and Tucson Plug-In Hybrid as separate names in many campaigns, and this page counts them with the Tucson. The model year tool shows every campaign for the year you pick, with the vehicles each one names.' },
  ],
  related: ['brand:hyundai', 'model:rav4', 'model:cr-v'],
});
