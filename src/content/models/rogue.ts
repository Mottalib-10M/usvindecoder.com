import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('rogue');
export default defineModel({
  slug: 'rogue', brand: 'nissan',
  title: `Nissan Rogue Recalls by Model Year: ${f.c} NHTSA Campaigns`,
  description: `Nissan Rogue recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, ${f.my(2014)} on the 2014 and ${f.my(2021)} on the 2021, both new generations. NCAP stars and mpg too.`,
  h1: 'Nissan Rogue recalls by model year',
  intro: `The Rogue's recalls cluster on two first years: ${f.my(2014)} campaigns on the 2014 and ${f.my(2021)} on the 2021. NHTSA's file holds ${f.c} since 2012. Pick your year.`,
  resume: `Each new Rogue generation started with a cluster of campaigns. The 2014 Rogue, first of the second generation, is covered by ${f.my(2014)} campaigns in NHTSA's file, and the 2015 by ${f.my(2015)}; the 2021, first of the third generation, by ${f.my(2021)}. In between, years such as 2020 and 2022 have a single campaign. In all, ${f.c} campaigns cover Rogue model years 2012 to 2026, counting the hybrid sold briefly from 2017 but not the smaller Rogue Sport, which NHTSA lists separately. The fuel system leads with ${f.compN(0)} campaigns, ahead of electrical faults, seat belts and seats (${f.compN(1)} each). NCAP rated the Rogue four stars overall through 2020 and five stars on its rated versions from 2023 to 2025. Its 2025 versions are rated ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined.`,
  body: (h) => `
<h2>The 2014 and 2015 Rogue</h2>
<p>Early second-generation Rogues had campaigns on fuel pump components with improper nickel plating, built during short windows in 2013 and 2014, on a rear liftgate strut that could fail, and on passenger air bag occupant sensing, part of Nissan's 2016 campaign covering more than three million vehicles. A 2022 campaign later covered under-dash harness connectors that could corrode from water and salt, and a 2023 one jackknife ignition keys that could fold into the key while driving, switching the engine off.</p>
<h2>The 2021 redesign</h2>
<p>The third-generation Rogue arrived for 2021 with new infotainment and driver assistance systems. Its first year collected campaigns on rear seat belts that might not retract, on brake calipers missing an internal bushing, on infotainment that kept rebooting and blanked the rearview camera, and on fuel pumps. The 2022 model, with a new 1.5 liter three-cylinder variable compression engine, later shared an engine campaign with the Altima and Infiniti models.</p>
<h2>Next steps</h2>
<p>Pick the model year above to see each campaign and its date, then confirm on the VIN which remain open. The ${h.a('brand:nissan', 'Nissan page')} covers the rest of the brand, including the CVT warranty extensions that are not safety recalls. For a comparison with its closest rivals, see the ${h.a('model:rav4', 'RAV4')} and ${h.a('model:cr-v', 'CR-V')} pages.</p>
`,
  faqs: [
    { q: 'What years of Nissan Rogue have the most recalls?', a: `The 2014 and 2021 Rogue, each covered by ${f.my(2014)} campaigns in NHTSA's file, both first years of a generation; the 2015 follows with ${f.my(2015)}. The 2020 and 2022 have a single campaign each. A campaign count says nothing about the CVT, whose problems were handled by warranty extensions.` },
    { q: 'What is the Nissan Rogue key recall?', a: 'A 2023 campaign on 2014 to 2020 Rogue and 2017 to 2022 Rogue Sport vehicles with a folding, jackknife-style key. The key could collapse while in the ignition and turn the engine off, disabling power steering and possibly air bags. Nissan replaced the key with a fixed-blade key.' },
    { q: 'Are Rogue Sport recalls counted here?', a: 'No. The Rogue Sport is a smaller vehicle, built on a different platform, and NHTSA records it as a separate model. Some campaigns name both, such as the 2023 folding key campaign; use the recall check with Rogue Sport as the model to see its own list.' },
  ],
  related: ['brand:nissan', 'model:rav4', 'model:cr-v'],
});
