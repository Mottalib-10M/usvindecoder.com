import { definePage } from '../../lib/page-types';
import { NCAP, CATALOG, ncapYear } from '../../lib/data';

const rows = CATALOG.models.map((m) => { const y = ncapYear(m.slug, 2025); const risks = y.variants.map((v) => v.rollRisk).filter((x): x is number => typeof x === 'number' && x > 0); return [`${m.brand === 'ram' ? '' : CATALOG.brands.find((b) => b.slug === m.brand)!.name + ' '}${m.name}`, y.best ? `${y.best} of 5` : 'not rated', risks.length ? `${Math.round(Math.min(...risks) * 1000) / 10} %` : 'n/a', String(y.rated.length)]; });

export default definePage({
  id: 'nhtsa-crash-test-ratings-explained', slug: 'nhtsa-crash-test-ratings-explained', kind: 'guide', group: 'guides', order: 35,
  nav: 'NCAP stars explained', card: 'How NHTSA builds the overall, frontal, side and rollover stars',
  title: 'NCAP Ratings Explained 2026: How NHTSA Crash Stars Work',
  description: 'NCAP ratings explained: how NHTSA turns frontal, side and rollover tests into 1 to 5 stars, what not rated means, and the 2025 stars of 16 best sellers.',
  h1: 'NHTSA crash test ratings explained',
  intro: 'NCAP stars come from three crash tests and one stability measure, combined into an overall score. The rollover stars follow a simple scale; the calculator below converts a risk into stars.',
  resume: `NHTSA's New Car Assessment Program, started in 1978, is the federal consumer crash test program, distinct from the minimum safety standards every vehicle must meet. NHTSA buys vehicles from dealers and runs a frontal test into a rigid barrier at 35 mph with an average-size male dummy driving and a small female dummy as passenger, a side test where a 3,015 lb barrier moving at 38.5 mph hits the driver side, and a side pole test at 20 mph and a 75-degree angle, which mimics sliding into a tree. Injury measurements become a probability of serious injury, then stars. The rollover rating is different: it is not a crash but a calculation from the static stability factor, the ratio of track width to center of gravity height, adjusted by a dynamic tip test, giving a percentage risk of rollover in a single-vehicle crash. The overall rating weighs the three. NCAP also lists recommended technologies, such as automatic emergency braking. The stars of NHTSA's latest ratings are stored for each tested version, which the lookup on this site reads.`,
  body: (h) => `
<p>Type the rollover risk NHTSA shows for a vehicle to see the stars it earns.</p>
${h.mini('rollover')}
<h2>The rollover scale</h2>
<p>Five stars means a risk of rollover below 10 % in a single-vehicle crash, four stars 10 to 20 %, three stars 20 to 30 %, two stars 30 to 40 % and one star above 40 %. Sedans usually sit near 9 to 10 %, SUVs around 13 to 20 %, pickups and vans higher, which is why so many trucks are four-star vehicles overall while scoring five stars in crash tests. A tall, narrow vehicle can never reach the bottom of the scale, whatever its electronic stability control.</p>
<h2>Frontal and side stars</h2>
<p>The frontal rating compares vehicles within a similar weight class only, because hitting a fixed barrier is equivalent to hitting a vehicle of the same weight. The side ratings combine the moving barrier and pole results for front and rear seats. A five-star overall vehicle can still have a four-star result in one test; the ${h.a('crash-test-ratings', 'crash rating lookup')} shows each column, and the ${h.a('home', 'VIN decoder')} pulls them for one vehicle.</p>
<h2>2025 ratings of the best-selling models on this site</h2>
<p>Best overall rating NHTSA published for each model's 2025 versions, the lowest rollover risk measured among them and the number of rated versions, from the ${h.src('ncap', 'NCAP Safety Ratings')} API read for this build (${NCAP.retrieved_at}).</p>
${h.table(['Model', 'Best overall 2025', 'Lowest rollover risk', 'Rated versions'], rows, undefined, ['l', 'l', 'r', 'r'])}
<h2>What not rated means</h2>
<p>NHTSA does not test every vehicle every year. It picks models by expected sales, new designs and safety interest, and ratings carry over when a model is unchanged. A version shown without stars was not tested in that configuration that year. Heavy-duty pickups above 10,000 lb are outside the program. A missing rating is a gap of information, not a negative result; look at the closest rated body style and at the insurance industry's tests, which use different crashes.</p>
<h2>How ratings have changed</h2>
<p>NHTSA tightened the tests for the 2011 model year, adding the side pole test and the small female dummy, so stars from before 2011 are not comparable with later ones. The agency has announced a further update that adds crash avoidance technologies and pedestrian protection to the program over the coming model years. When you compare two used cars, compare ratings from the same period.</p>
<h2>Using the ratings when you buy</h2>
<p>Look at the version you are buying: cab style, drive type and body all change results. Look at the frontal and side columns separately from the overall score, and at the rollover risk for tall vehicles. Pair the stars with the ${h.a('recall-check', 'recall campaigns')} for the same year: a model with a top rating and an open air bag campaign is not safe until the campaign is done.</p>
`,
  faqs: [
    { q: 'How does NHTSA calculate the rollover rating?', a: 'From the static stability factor, which compares half the track width with the height of the center of gravity, plus a dynamic test of whether the vehicle tips up in a sharp steering maneuver. The result is a risk of rolling over in a single-vehicle crash: under 10 % earns five stars, over 40 % one star.' },
    { q: 'Are NCAP ratings before 2011 comparable with today?', a: 'No. From the 2011 model year NHTSA changed the program: it added the side pole test and a small female dummy, and recalculated the stars. A 2009 five-star car and a 2015 five-star car were rated on different tests. Compare vehicles rated under the same system, 2011 or later.' },
    { q: 'Why do pickups often get four stars overall?', a: 'Mostly because of rollover. Pickups sit high and their rollover risk usually falls between 15 and 25 %, which means three or four rollover stars and pulls the overall score down, even when the frontal and side crash results are five stars. Check each column in the lookup rather than the overall score alone.' },
    { q: 'Does NCAP test crash avoidance systems?', a: 'It lists whether a version has recommended technologies such as forward collision warning, lane departure warning and automatic emergency braking, but those do not change the stars today. NHTSA has announced an updated program that will score crash avoidance and pedestrian protection in future model years.' },
  ],
  related: ['crash-test-ratings', 'home', 'recall-check', 'window-sticker-by-vin'],
  sources: ['ncap', 'recalls'],
});
