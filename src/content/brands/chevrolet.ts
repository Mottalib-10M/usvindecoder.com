import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('chevrolet');
export default defineBrand({
  slug: 'chevrolet',
  title: `Chevrolet Recalls 2026: Silverado, Equinox, Tahoe by Year`,
  description: `Chevrolet recalls from NHTSA's file: ${f.c10} vehicle campaigns from 2016 to 2025, ${f.c26} in 2026. Air bags lead the list. Check any Silverado, Tahoe or Equinox by year.`,
  h1: 'Chevrolet recalls: NHTSA campaigns by year and model',
  intro: `Chevrolet appears in ${f.c10} NHTSA vehicle campaigns from 2016 to 2025, peaking at ${f.peakN} in ${f.peak}. Air bags are the system recalled most. Check any Chevy model below.`,
  resume: `General Motors files Chevrolet recalls, and most of them also name a GMC, a Cadillac or a Buick built on the same platform: a Silverado campaign is very often a Sierra campaign too. Counting each campaign once for every brand it names, Chevrolet appears in ${f.c10} vehicle campaigns received by NHTSA between 2016 and 2025, ${f.u10} vehicle notices in all, which ranks it ${f.rank === 4 ? 'fourth' : 'number ' + f.rank} of the 18 brands we track. The yearly count stayed between ${f.y(2017)} and ${f.peakN} campaigns, with its peak in ${f.peak}. Air bags come first among recalled systems (${f.compN(0)} campaigns), followed by the ${f.comp(1)} (${f.compN(1)}) and seat belts (${f.compN(2)}). Full-size trucks and SUVs dominate the model list: since 2021 the Silverado 1500 and the Tahoe each appear in ${f.n(f.top[0][1])} campaigns, ahead of the heavy-duty Silverado 2500 and 3500.`,
  body: (h) => `
<h2>One platform, several brands</h2>
<p>GM builds the Silverado, Sierra, Tahoe, Suburban, Yukon and Escalade on shared body-on-frame architecture. When a part used across that family fails, one campaign covers them all. That is how ${f.big.id}, received on ${f.day(f.big.date)}, reached ${f.units(f.big.units)} vehicles: ${f.big.models.slice(0, 3).join(', ')} and more, for an air bag problem. The second largest, ${f.big2.id}, concerned the brake system of the same trucks in ${new Date(f.big2.date).getUTCFullYear()}. If you own one of these, read the ${h.a('brand:gmc', 'GMC page')} as well: the campaigns are often identical.</p>
<h2>The small-SUV side</h2>
<p>Chevrolet's crossovers carry fewer campaigns, but recent ones concern rearview cameras and software. The latest Chevrolet campaign in the file, ${f.recent.id} (${f.day(f.recent.date)}), covers ${f.units(f.recent.units)} vehicles. The ${h.a('model:equinox', 'Equinox page')} lists each model year of GM's best-selling crossover with its campaigns, NCAP stars and mpg, and the ${h.a('model:silverado-1500', 'Silverado 1500 page')} does the same for the pickup.</p>
<h2>Bolt EV battery recall and the electric models</h2>
<p>The Chevrolet Bolt battery recall, which led GM to replace battery modules on every 2017 to 2022 Bolt EV and EUV after fires, is the best known Chevrolet campaign of the decade. It carried a park-outside advisory for months; Chevrolet has ${f.po} campaigns with that warning since 2016. Electric models now add their own categories to the list, high-voltage battery and charging among them. To check a specific Bolt, use the ${h.a('recall-check', 'recall check')} with its model year.</p>
`,
  faqs: [
    { q: 'Why do Chevrolet and GMC pickups share the same recalls?', a: 'The Chevrolet Silverado and GMC Sierra are built by General Motors on the same platform, with the same engines, brakes, air bags and electronics. When a shared part is defective, GM files one campaign naming both trucks, and often the Tahoe, Suburban, Yukon and Escalade as well. Check both brand pages when you own one of them.' },
    { q: 'Were all Chevy Bolt batteries replaced?', a: 'GM recalled every 2017 to 2022 Bolt EV and 2022 Bolt EUV after battery fires and offered new battery modules or full packs, with software that monitored the cells while owners waited. A used Bolt should have the remedy recorded: enter its VIN on nhtsa.gov or at a Chevrolet dealer to confirm before buying.' },
    { q: 'What is the most common Chevrolet recall?', a: `Air bags, with ${f.compN(0)} campaigns naming Chevrolet between 2016 and 2026, ahead of the electrical system and seat belts. Many air bag campaigns on GM trucks concern inflators or wiring rather than the bag itself. Each campaign in the lookup above shows its component and the remedy the dealer applies.` },
  ],
  related: ['model:silverado-1500', 'model:equinox', 'brand:gmc'],
});
