import { defineBrand } from '../../lib/page-types';
import { bf } from '../../lib/facts';
const f = bf('ford');
export default defineBrand({
  slug: 'ford',
  title: `Ford Recalls 2026: ${f.y(2025)} Campaigns in 2025, a Record Year`,
  description: `Ford recalls from NHTSA's file: ${f.y(2025)} vehicle campaigns in 2025, ${f.c26} more in 2026 so far, ${f.c10} since 2016. Check any F-150, Explorer or Bronco by model year.`,
  h1: 'Ford recalls: every NHTSA campaign, year by year',
  intro: `Ford filed ${f.y(2025)} vehicle recall campaigns with NHTSA in 2025, more than twice its ${f.y(2024)} of 2024, and ${f.c26} more in 2026 so far. Look up any Ford model below.`,
  resume: `Ford is the most recalled of the 18 largest brands in NHTSA's file, with ${f.c10} vehicle campaigns received between 2016 and 2025 and ${f.u10} vehicle notices. The count was steady for years, between ${f.y(2016)} and ${f.y(2024)} campaigns a year, then jumped to ${f.y(2025)} in 2025. Part of that jump is volume: Ford sells pickups, SUVs, vans and commercial chassis in many configurations, and the F-Series alone splits into F-150, Super Duty and chassis cab entries. Part of it is a deliberate change: under a consent order with NHTSA announced in November 2024, Ford agreed to build new safety data analysis and VIN-level part tracking, review its past recalls and meet NHTSA every quarter, so campaigns that would once have been grouped or delayed now appear on their own. The systems recalled most often are the ${f.comp(0)} (${f.compN(0)} campaigns since 2016), the ${f.comp(1)} (${f.compN(1)}) and rearview cameras (${f.compN(2)}).`,
  body: (h) => `
<h2>Why Ford's 2025 number doubled</h2>
<p>Two readings of the same table are possible, and both are partly right. The worrying one is quality: a high count of campaigns on new model years, especially the Bronco, Maverick and Super Duty trucks, points to problems that escaped testing. The other reading is process. NHTSA fined Ford ${h.ext('https://www.nhtsa.gov/press-releases/ford-consent-order-165-million-civil-penalty', '$165 million under a 2024 consent order')} over the timeliness of its recall reports, and since then Ford has filed more, sooner, often for small populations. Many 2025 and 2026 campaigns cover a few hundred vehicles, or units already repaired once under an earlier campaign whose fix did not hold. For an owner the practical conclusion is the same either way: check your VIN more often than you would for another brand.</p>
<h2>The campaign that covers the most Fords</h2>
<p>The largest Ford campaign since 2016 is ${f.big.id}, received on ${f.day(f.big.date)}, for ${f.units(f.big.units)} vehicles: ${f.big.summary.toLowerCase().includes('rearview') ? 'a rearview camera fault' : f.big.component.toLowerCase()} across ${f.big.models.slice(0, 3).join(', ')} and more. Recalls of that size are usually software or electrical, which explains why so many Ford remedies are now applied by a dealer reflash or, on recent vehicles, over the air.</p>
<h2>Trucks first</h2>
<p>Among models named in campaigns since 2021, the F-150 leads with ${f.n(f.top[0][1])}, ahead of the Explorer (${f.n(f.top[1][1])}) and the Bronco (${f.n(f.top[2][1])}). The ${h.a('model:f-150', 'F-150 page')} breaks its campaigns down by model year, with crash ratings and EPA mileage, and the same is done for the ${h.a('model:explorer', 'Explorer')} and the ${h.a('model:escape', 'Escape')}. Lincoln campaigns are filed by Ford but recorded under the Lincoln make, so they do not appear in these totals.</p>
`,
  faqs: [
    { q: 'Why does Ford have so many more recalls than Toyota or Honda?', a: `Ford filed ${f.c10} vehicle campaigns between 2016 and 2025. Its lineup includes heavy-duty pickups, chassis cabs and commercial vans that Japanese brands barely sell in the US, each filed as a separate model. Since its 2024 consent order with NHTSA, Ford also reports sooner and for smaller populations, which raises the count.` },
    { q: 'Is a Ford with an open recall safe to buy?', a: 'Usually, if the repair is scheduled. Franchised Ford dealers fix open recalls free, used car or not, within the 15-year federal limit. Check the campaigns for the model year here, then the VIN on nhtsa.gov or Ford’s owner site, and ask the seller to complete any do-not-drive or park-outside campaign before delivery.' },
    { q: 'Are Lincoln recalls included on this page?', a: 'No. Lincoln vehicles are built by Ford and their campaigns are filed by Ford Motor Company, but NHTSA records them under the Lincoln make. A campaign that names both a Ford and a Lincoln model counts here for the Ford part only. Use the recall check with Lincoln as the make for those models.' },
  ],
  related: ['model:f-150', 'model:explorer', 'model:escape'],
});
