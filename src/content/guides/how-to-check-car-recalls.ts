import { definePage } from '../../lib/page-types';
import { RECALLS as R, n, units } from '../../lib/data';

const total10 = Object.entries(R.byYear).filter(([y]) => y !== '2026').reduce((s, [, v]) => s + v, 0);

export default definePage({
  id: 'how-to-check-car-recalls', slug: 'how-to-check-car-recalls', kind: 'guide', group: 'guides', order: 33,
  nav: 'How to check recalls', card: 'Model recalls, open recalls on one VIN, and the free-repair limit',
  title: 'Car Recall Check Guide 2026: Find Open Recalls by VIN, Free',
  description: 'How to check car recalls in 2026: the model list, the open recalls on one VIN at NHTSA, the 15-year free repair rule and what to do with a do-not-drive notice.',
  h1: 'How to check your car for recalls',
  intro: 'Three checks answer three questions: which recalls exist for your model, which are still open on your VIN, and whether the repair is still free. The calculator below answers the third.',
  resume: `A recall check has two levels that people often confuse. The first is the campaign list for a model and year, which anyone can read without the VIN: NHTSA received ${n(total10)} vehicle campaigns of every kind between 2016 and 2025, and each one names the models and years it covers. The second is the status of one particular vehicle, which only its VIN can answer: whether it was in the production window of a campaign, and whether a dealer has already done the repair. NHTSA's VIN search, fed by the manufacturers, gives that status for recalls from the past 15 calendar years. Then comes the question of cost. Under 49 U.S.C. 30120, a maker must repair a safety defect free of charge, but that obligation ends when the vehicle was first sold more than 15 calendar years before the recall notice, or 5 years for tires. Within the limit, any franchised dealer of the brand does the work, whoever owns the car and wherever it was bought.`,
  body: (h) => `
<p>Enter the year the vehicle was first sold and the year of the recall notice to see whether the free remedy is still owed.</p>
${h.mini('remedy')}
<h2>Step 1: list the campaigns for your model</h2>
<p>Use the ${h.a('recall-check', 'recall check')} with the model year, make and model, or the ${h.a('home', 'VIN decoder')}, which finds the model for you. Read each campaign's component and summary: some cover only one engine, one plant or a few weeks of production, and the summary says so. Note the NHTSA campaign numbers; dealers and owner sites use them.</p>
<h2>Step 2: check the open recalls on your VIN</h2>
<p>Enter the 17 characters on ${h.src('nhtsarecalls', 'nhtsa.gov/recalls')} or on the maker's owner site. The answer lists unrepaired recalls on that vehicle, or "0 unrepaired recalls". It covers major carmakers, motorcycle makers and some truck makers, for recalls from the past 15 calendar years. A campaign that was just announced can take a few days to appear at VIN level, because the maker must first identify the affected VINs. If the list is empty but your model has a campaign, your car was probably outside the production window, or it was already repaired.</p>
<h2>Step 3: book the repair</h2>
<p>Call any franchised dealer of the brand with the campaign number. You do not need to have bought the car there, and the dealer cannot charge for a safety recall remedy within the federal limit. When parts are scarce, makers send an interim notice first and a second notice when parts arrive; for a do-not-drive campaign, ask about towing and a loaner, which several makers provide. Over-the-air remedies install themselves when the car accepts the update; the VIN status then changes to remedied.</p>
${h.box('If you already paid for the repair', '<p>Makers must have a plan to reimburse owners who paid to fix a defect before the recall was announced, within a set period. Keep the invoice and contact the maker’s customer service with the campaign number.</p>')}
<h2>Buying a used car with open recalls</h2>
<p>Federal law prohibits dealers from selling new vehicles with open recalls, but used cars are a different case: in most states a dealer can sell a used car with an open recall, and private sellers are not covered at all. Rental companies are bound by a separate law not to rent out cars with open recalls. So before buying, run the VIN yourself and ask the seller to have open campaigns repaired, especially those with a do-not-drive or park-outside warning; the ${h.a('do-not-drive-recalls', 'advisory guide')} lists them. The repair stays free for you as the new owner, within the 15-year limit.</p>
<h2>Stay informed afterwards</h2>
<p>Recall notices go by mail to the registered owner, from state registration records. If you move or buy privately, update your address with the DMV and register the vehicle on the maker's owner site. NHTSA's SaferCar app sends alerts for a VIN you save. Checking once a year is reasonable; the brand pages, such as ${h.a('brand:ford', 'Ford')} or ${h.a('brand:toyota', 'Toyota')}, show how often each maker files.</p>
`,
  faqs: [
    { q: 'Is a recall repair free on a used car?', a: 'Yes, within the federal limit. The maker owes a free remedy for a safety defect when the vehicle was first sold no more than 15 calendar years before the recall notice, and 5 years for tires, whoever owns it now. Any franchised dealer of the brand does the repair, even if you bought the car elsewhere or from a private seller.' },
    { q: 'Why does nhtsa.gov show no recall when my model has one?', a: 'Either your vehicle was outside the population the maker defined, such as another plant or production period, or the repair was already done. A very recent campaign can also take a few days to be loaded at VIN level. Call a dealer with the campaign number if you have a doubt.' },
    { q: 'Can a dealer sell me a used car with an open recall?', a: 'In most states, yes. The federal ban covers new vehicles held by dealers and rental cars, not used cars sold by dealers or individuals. Some dealers repair recalls before resale, but nothing obliges them to. Check the VIN yourself and ask for open campaigns to be repaired before signing.' },
    { q: 'How will I know about future recalls on my car?', a: 'The maker mails a notice to the owner registered with the state. Keep your DMV address current, register on the maker’s owner site and, if you like, save the VIN in NHTSA’s SaferCar app, which sends an alert when a new recall is issued for it. A yearly VIN check covers the rest.' },
  ],
  related: ['recall-check', 'home', 'do-not-drive-recalls', 'recalls', 'free-vin-check-vs-history-report'],
  sources: ['nhtsarecalls', 'remedy', 'recalls'],
});
