import { defineModel } from '../../lib/page-types';
import { mf } from '../../lib/facts';
const f = mf('equinox');
const big = [...f.m.list].sort((a, b) => b.units - a.units);
export default defineModel({
  slug: 'equinox', brand: 'chevrolet',
  title: `Chevy Equinox Recalls by Model Year: ${f.c} NHTSA Campaigns`,
  description: `Chevrolet Equinox recalls by model year from NHTSA's file: ${f.c} campaigns since 2012, none on the 2017 or 2025 models. Each year with NCAP stars and EPA mpg.`,
  h1: 'Chevrolet Equinox recalls by model year',
  intro: `The Equinox has one of the shortest recall lists among best sellers: ${f.c} campaigns since 2012, none on the 2017 or 2025 models. Pick your year to see them.`,
  resume: `For a crossover that sells in large numbers, the Chevrolet Equinox has few recall campaigns: ${f.c} cover model years 2012 to 2026 in NHTSA's file, no more than ${f.maxN} in any single year, and none at all on the ${f.zero.join(' and ')} models. The worst year is the ${f.worst}, with ${f.worstN}. The campaigns are spread across systems, seats, power train, tires and visibility, with no single dominant defect. The two largest concern the windshield wiper module of 2014 and 2015 models and the rear child seat anchors of 2020 to 2023 models, both shared with the GMC Terrain. NCAP has rated the Equinox five stars overall every year since 2019. The gas Equinox is rated ${f.epa(2025)?.gasMin} to ${f.epa(2025)?.gasMax} mpg combined for 2025, and the separate Equinox EV, a different vehicle that NHTSA lists under its own name in recall campaigns, is rated in MPGe by the EPA.`,
  body: (h) => `
<h2>Child seat anchors on the 2020 to 2023 models</h2>
<p>${big[1].id}, received on ${f.day(big[1].date)}, covered ${f.units(big[1].units)} Equinox and Terrain crossovers from 2020 to 2023: the four lower LATCH anchor bars in the rear seat might have excessive play, so a child seat attached to them might not be held as the federal standard requires. Dealers inspect and, if needed, replace the rear seat frames. Parents shopping for a used Equinox from those years should check it first.</p>
<h2>Wipers that could stop</h2>
<p>The largest Equinox campaign, ${big[0].id}, received on ${f.day(big[0].date)}, covered ${f.units(big[0].units)} 2014 and 2015 Equinox and Terrain models whose wiper module ball joints could corrode and stop the wipers. Visibility campaigns like this one count among safety recalls because windshield wiping is a federal standard. The latest campaign naming the Equinox, ${f.latest.id}, is from ${f.day(f.latest.date)}.</p>
<h2>Equinox or Equinox EV?</h2>
<p>NHTSA lists the electric Equinox EV, launched for 2024 on a different platform, under its own name in recall campaigns, so its campaigns are not counted on this page; use the ${h.a('recall-check', 'recall check')} with Equinox EV as the model. The ${h.a('brand:chevrolet', 'Chevrolet page')} and the ${h.a('model:silverado-1500', 'Silverado 1500 page')} cover the rest of the brand.</p>
`,
  faqs: [
    { q: 'Is the Chevrolet Equinox often recalled?', a: `Less than most best sellers. NHTSA's file holds ${f.c} campaigns on Equinox model years 2012 to 2026, at most ${f.maxN} in a single year, and none on the 2017 and 2025 models. Most campaigns are shared with the GMC Terrain, its twin. The worst year is the ${f.worst}, with ${f.worstN} campaigns.` },
    { q: 'What is the Equinox LATCH anchor recall?', a: 'A 2023 campaign on about 670,000 2020 to 2023 Equinox and Terrain models. The lower anchor bars used to attach child seats in the rear might move too much, so a seat might not stay secure in a crash. Dealers check the bars and replace the seat frame if needed, free of charge.' },
    { q: 'Are Equinox EV recalls counted on this page?', a: 'No. The Equinox EV is a different vehicle and NHTSA records it as a separate model, Equinox EV. Its campaigns, such as a 2025 adaptive cruise control braking software fix, are listed under that name. Choose Equinox EV in the recall check to see them.' },
  ],
  related: ['brand:chevrolet', 'model:silverado-1500'],
});
