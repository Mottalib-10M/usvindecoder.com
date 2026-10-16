import { definePage } from '../../lib/page-types';
import { RECALLS as R, CATALOG, brand, n, units, day, LATEST } from '../../lib/data';

const sorted = [...CATALOG.brands].sort((a, b) => brand(b.slug).campaigns10 - brand(a.slug).campaigns10);
const top = sorted[0]; const low = sorted[sorted.length - 1];
const t = brand(top.slug); const l = brand(low.slug);
const rising = [...CATALOG.brands].map((b) => ({ b, d: brand(b.slug).byYear['2025'].campaigns - brand(b.slug).byYear['2021'].campaigns })).sort((x, y) => y.d - x.d)[0];

export default definePage({
  id: 'recalls', slug: 'recalls', kind: 'tool', group: 'recalls', order: 20, tool: 'hub',
  nav: 'Recalls by brand', card: 'The 18 biggest brands compared, campaign by campaign',
  title: 'Car Recalls by Brand 2026: NHTSA Campaigns Since 2016',
  description: `Car recalls by brand from NHTSA's own file: ${n(t.campaigns10)} ${top.name} campaigns since 2016, 18 brands compared year by year, with the systems each one recalls most often.`,
  h1: 'Car recalls by brand, from NHTSA’s recall file',
  intro: `${top.name} filed ${n(t.campaigns10)} vehicle recall campaigns with NHTSA from 2016 to 2025, the most of the 18 brands below; ${low.name} filed ${n(l.campaigns10)}. Pick a brand to see its year-by-year record.`,
  resume: `Every safety recall in the United States starts with a defect report the manufacturer files with NHTSA under 49 CFR Part 573, and every report becomes a numbered campaign in a public file that NHTSA republishes each day. We read that file every week and count, for the 18 brands with the largest US sales, the vehicle campaigns received each year since 2016, the units the makers declared as potentially affected, the component groups involved and the campaigns carrying a do-not-drive or park-outside warning. The counts are by campaign, not by vehicle: one campaign can cover a single model built in one week or millions of trucks over a decade. A campaign shared by sister brands (Chevrolet and GMC, Jeep and Ram) counts for each brand it names. This build reads the file dated ${day(R.file_date ?? R.retrieved_at)}; its latest campaign was received on ${day(LATEST)}.`,
  body: (h) => `
<h2>What the brand totals measure, and what they do not</h2>
<p>A brand with more campaigns is not automatically a brand with worse cars. Three things push the count up. The first is the size of the lineup: a maker selling dozens of models, with heavy-duty trucks and commercial vans, opens more campaigns than one selling five. The second is how finely a maker splits its filings: some file one campaign per model, others one campaign for a whole platform. The third is reporting culture, since NHTSA has repeatedly fined manufacturers for late filings, and a maker that files quickly and often looks worse in a raw count than one that waits. ${top.name} heads the table for all three reasons at once.</p>
<p>What the count does show reliably is direction. ${rising.b.name} went from ${n(brand(rising.b.slug).byYear['2021'].campaigns)} campaigns in 2021 to ${n(brand(rising.b.slug).byYear['2025'].campaigns)} in 2025, the largest rise of the group. Software has become a recall category of its own, and rearview camera faults alone account for ${n(R.cameras.byYear['2025'])} campaigns across all makes in 2025.</p>
<h2>Units covered: the second number to look at</h2>
<p>Each campaign carries the potentially affected population the maker declared. That figure decides how likely your own car is concerned. Summed over a year, it can exceed a brand's sales, because a vehicle can be in several campaigns and because older model years are recalled long after they were sold. Use it to compare scale, not to estimate a percentage of cars with problems.</p>
<h2>From a brand to your car</h2>
<p>The brand pages narrow things down: each opens on a recall lookup set to that brand, then lists its campaigns per year, its most recalled systems and the models named in the most campaigns since 2021. From there, the ${h.a('recall-check', 'recall check')} gives the campaigns for any model year, and the ${h.a('home', 'VIN decoder')} does the same from the 17 characters. The status of one specific vehicle, repaired or not, stays on ${h.src('nhtsarecalls', 'NHTSA’s VIN lookup')}.</p>
`,
  faqs: [
    { q: 'Which car brand has the most recalls?', a: `In NHTSA's recall file, ${top.name} filed the most vehicle campaigns among the 18 largest brands between 2016 and 2025: ${n(t.campaigns10)}, covering ${units(t.units10)} vehicle notices. Raw counts favor large lineups with trucks and vans, so compare the trend over several years and the models you are considering rather than the brand total alone.` },
    { q: 'Do Chevrolet and GMC share recall campaigns?', a: 'Often. A General Motors campaign on a pickup platform usually names the Chevrolet Silverado and the GMC Sierra together, and the same goes for Jeep, Ram, Dodge and Chrysler under Stellantis. Here such a campaign counts once for each brand it names, which is why the brand totals add up to more than the number of distinct campaigns.' },
    { q: 'Why does the 2026 column look low?', a: `Because the year is not over. The 2026 figures run to the latest campaign in NHTSA's file, received on ${day(LATEST)} for this build. Recall filings are not spread evenly through the year, so a partial year is not a reliable projection of the full one.` },
  ],
  related: ['recall-check', 'home', 'do-not-drive-recalls', 'takata-airbag-recall', 'how-to-check-car-recalls'],
  sources: ['recallfile', 'recalls', 'nhtsarecalls'],
});
