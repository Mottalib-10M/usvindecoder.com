import { definePage } from '../../lib/page-types';
import { RECALLS as R, SAMPLES, n, day, LATEST } from '../../lib/data';

const rc = SAMPLES.recall;
const count = rc.json.Count as number;

export default definePage({
  id: 'recall-check', slug: 'recall-check', kind: 'tool', group: 'recalls', order: 10, tool: 'recall',
  nav: 'Recall check', card: 'Every NHTSA campaign for a year, make and model, or from a VIN',
  title: 'Recall Check 2026: Free NHTSA Lookup by Model or VIN',
  description: 'Free car recall check: pick the year, make and model or paste a VIN and get every NHTSA safety recall campaign, with its remedy and any do-not-drive warning.',
  h1: 'Recall check by year, make and model',
  intro: `Choose a model year, a make and a model: NHTSA's campaigns for it load at once. The example shows the ${rc.year} Honda CR-V, with ${count} campaigns.`,
  resume: `This recall check asks NHTSA's public Recalls API, the database behind nhtsa.gov, for every safety recall campaign covering the model year, make and model you choose. Each campaign shows its NHTSA number, the date the manufacturer filed the defect report, the component involved, a summary of the defect, the remedy, and a red label when NHTSA attached a do-not-drive or park-outside warning. If you have the VIN, the second field decodes it through NHTSA vPIC and fills in the three lists for you. Model names follow NHTSA's spelling, which splits hybrids, plug-ins and heavy-duty versions into separate entries; check each one that could match your vehicle. The result is the campaign list for the model as built, which is what you want before buying. Whether one particular car still has a campaign open depends on its VIN and on dealer records, and NHTSA answers that on its own lookup.`,
  body: (h) => `
<h2>Model-year campaigns and open recalls are two different answers</h2>
<p>A campaign covers every vehicle of a model built inside a window the maker defines: a range of production dates, one assembly plant, one engine. Two cars of the same model year can therefore differ, one inside the window and one outside. The list above tells you which campaigns exist; the dealer, or ${h.src('nhtsarecalls', 'NHTSA’s VIN search')}, tells you which of them apply to a given car and whether the repair was done. NHTSA's VIN search covers recalls from the past 15 calendar years and the major carmakers, motorcycle brands and some truck makers.</p>
<p>When a used car shows an open campaign, the repair remains free at any franchised dealer of the brand, as long as the vehicle was first sold no more than 15 calendar years before the recall notice. The ${h.a('how-to-check-car-recalls', 'guide to checking recalls')} explains the rule and has a calculator for it.</p>
<h2>Reading a campaign</h2>
<p>The campaign number reads like 24V123000: year of filing, V for vehicle (E for equipment, T for tires, C for child seats), then a sequence. The component line uses NHTSA's categories, such as "air bags", "electrical system" or "back over prevention" for rearview cameras. A do-not-drive warning means NHTSA and the maker consider the car unsafe to drive until repaired, which happened in ${n(R.advisories.dnd10)} campaigns of every kind between 2016 and 2025; a park-outside warning means a fire risk even when the car is off. Our ${h.a('do-not-drive-recalls', 'page on those advisories')} lists the latest ones.</p>
<h2>When the list is empty</h2>
<p>No campaign means NHTSA has no safety recall on file for that model and year under the name you picked. Check the other spellings in the model list first. Service bulletins and warranty extensions are not safety recalls and do not appear here; your dealer can look those up by VIN. Equipment you added later, such as tires or a child seat, has its own recalls registered under the equipment maker.</p>
<h2>How fresh is the answer?</h2>
<p>The lookup is live: each change queries NHTSA directly from your browser, so a campaign NHTSA lists today appears today. The brand and model pages rely on NHTSA's recall file, which we reload every week; the current file runs to a campaign received on ${day(LATEST)}. Start from the ${h.a('recalls', 'brand pages')} to compare makers, or from the ${h.a('home', 'VIN decoder')} to see recalls next to the crash ratings and mpg of one vehicle.</p>
`,
  faqs: [
    { q: 'Can I check recalls without the VIN?', a: 'Yes. Year, make and model are enough to list every campaign NHTSA has for that model, which is the list a buyer needs. The VIN only adds whether one particular car falls inside a campaign and whether it was already repaired; that part is answered by NHTSA’s VIN lookup or by the brand’s dealer.' },
    { q: 'Why does my model appear under several names?', a: 'NHTSA records the model the way the manufacturer names it in its defect report. Hybrids, plug-in hybrids, electric versions, heavy-duty pickups and sometimes body styles become separate entries, such as RAV4, RAV4 Hybrid and RAV4 Prime. Check each name that could describe your vehicle; the VIN search fills in the closest match automatically.' },
    { q: 'Is a recall repair free on an old car?', a: 'The federal remedy obligation lasts 15 calendar years from the first sale for a vehicle and its equipment, and five years for tires, counted to the date of the recall notice (49 U.S.C. 30120). Within that limit the dealer repairs at no charge; beyond it, many makers still do the work, but they are not required to.' },
    { q: 'What do I do if a campaign says do not drive?', a: 'Stop driving the vehicle and call a dealer of the brand: under a do-not-drive advisory, makers usually arrange towing to the dealership and often a loaner or rental. The warning concerns defects such as air bag inflators that can rupture or brake failures, where driving before the repair puts people at risk.' },
  ],
  related: ['home', 'recalls', 'how-to-check-car-recalls', 'do-not-drive-recalls', 'crash-test-ratings'],
  sources: ['recalls', 'nhtsarecalls', 'remedy'],
});
