import { definePage } from '../../lib/page-types';
import { SAMPLES } from '../../lib/data';
import { parseRating } from '../../lib/nhtsa';

const nc = SAMPLES.ncap;
const rows = ((nc.byName[nc.models[0]] ?? []) as unknown[]).map(parseRating).filter(Boolean);

export default definePage({
  id: 'crash-test-ratings', slug: 'crash-test-ratings', kind: 'tool', group: 'recalls', order: 12, tool: 'ncap',
  nav: 'Crash test ratings', card: 'NCAP stars for every body style and drivetrain',
  title: 'Crash Test Ratings 2026: NHTSA NCAP Stars by Model',
  description: 'NHTSA crash test ratings by model year: overall, frontal, side and rollover stars for every body style and drivetrain NCAP rated, with the rollover risk.',
  h1: 'NHTSA crash test ratings by model',
  intro: `Pick a year, a make and a model to see the NCAP stars of every version NHTSA rated. Example: the ${nc.year} Toyota RAV4, ${rows.length} versions listed.`,
  resume: `NHTSA's New Car Assessment Program buys new vehicles at retail, crashes them and publishes star ratings from one to five: a frontal crash into a rigid barrier at 35 mph with instrumented dummies, a side barrier crash and a side pole crash, and a rollover resistance score computed from the vehicle's static stability factor and a dynamic tip test. The overall rating combines them. This lookup queries the NCAP Safety Ratings API directly from your browser and lists every version rated for the year, make and model you choose, because NCAP rates body styles and drivetrains separately: a two-wheel-drive and a four-wheel-drive SUV, or a regular-cab and a crew-cab pickup, have separate results. A version listed without stars has not been tested that year. The stars compare vehicles of similar size and weight, so they say nothing about a crash between a small car and a large pickup.`,
  body: (h) => `
<h2>How to read the four columns</h2>
<p>The frontal rating combines driver and passenger injury risk from the full-width barrier test. The side rating combines the moving-barrier test, which simulates being hit by another vehicle at an intersection, and the pole test, which simulates sliding sideways into a tree or a utility pole. The rollover rating is the only one not based on a crash: it turns the computed probability of rolling over in a single-vehicle crash into stars, five below 10 %, one above 40 %. The ${h.a('nhtsa-crash-test-ratings-explained', 'explanation page')} has a calculator for that conversion, and the lookup above shows the measured risk under each version.</p>
<h2>Why many versions show "not rated"</h2>
<p>NCAP does not test every model every year. NHTSA selects vehicles by expected sales and new designs, and a carryover model keeps the ratings of the year it was tested only when the structure did not change. A missing rating is therefore not a bad rating. Other test programs, such as the insurance industry's, use different crashes and can rate the same vehicle differently; we only show the federal results.</p>
<h2>From a rating to your vehicle</h2>
<p>When you know the VIN, the ${h.a('home', 'VIN decoder')} finds the matching NCAP entries automatically, using the year, make and model that vPIC returns, and shows them next to the recalls and the mpg. Ratings are also printed on the window sticker of new cars; the ${h.a('window-sticker-by-vin', 'window sticker page')} rebuilds what the federal data can supply. For safety recalls on the same model, use the ${h.a('recall-check', 'recall check')}.</p>
<h2>Complaints and investigations</h2>
<p>The NCAP record for each version also counts owner complaints filed with NHTSA, recalls and defect investigations. Those counts are shown on the source page and are worth a glance: a high complaint count on a component, with an open investigation, sometimes precedes a recall by months. They are counts, not verified defects, so read them as a reason to ask questions rather than as a verdict.</p>
`,
  faqs: [
    { q: 'Is a 5-star small car as safe as a 5-star SUV?', a: 'Not in a crash between them. NCAP frontal ratings compare vehicles of similar weight class, because the test crashes each one into a fixed barrier. Physics favors the heavier vehicle in a collision between two, so a 5-star compact car and a 5-star full-size SUV are each good in their class, not equal to each other.' },
    { q: 'Why does the same model have several entries for one year?', a: 'NCAP tests and rates body styles and drivetrains separately: two-wheel and four-wheel drive, regular cab, extended cab and crew cab, sometimes hybrid and gasoline versions. Weight, height and structure differ between them, and so can the results, especially the rollover rating, which depends on the center of gravity.' },
    { q: 'Do crash ratings carry over from one model year to the next?', a: 'Only when NHTSA judges the vehicle unchanged in the areas tested. A redesign, a new generation or structural changes require a new test. That is why a model can be rated one year and listed as not rated the next, until NHTSA tests the new version.' },
  ],
  related: ['nhtsa-crash-test-ratings-explained', 'home', 'recall-check', 'window-sticker-by-vin', 'mpg-by-vin'],
  sources: ['ncap', 'recalls'],
});
