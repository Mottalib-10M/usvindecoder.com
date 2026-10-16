import { definePage } from '../../lib/page-types';
import { NCAP, CATALOG, ncapYear } from '../../lib/data';

const rows = CATALOG.models.map((m) => { const y = ncapYear(m.slug, 2025); const risks = y.variants.map((v) => v.rollRisk).filter((x): x is number => typeof x === 'number' && x > 0); return [`${m.brand === 'ram' ? '' : CATALOG.brands.find((b) => b.slug === m.brand)!.name + ' '}${m.name}`, y.best ? `${y.best} of 5` : 'not rated', risks.length ? `${Math.round(Math.min(...risks) * 1000) / 10} %` : 'n/a', String(y.rated.length)]; });

// Risque de renversement par carrosserie, sur toutes les versions notées des 16 modèles du site (années-modèles 2015 et suivantes).
const ALL = Object.values(NCAP.models as Record<string, Record<string, Array<{ desc: string; rollRisk?: number | null }>>>).flatMap((y) => Object.values(y).flat()).filter((v) => typeof v.rollRisk === 'number' && v.rollRisk > 0);
const kind = (d: string) => (/ PU[/ ]/.test(d) ? 'pickup' : /SUV/.test(d) ? 'suv' : /\b4 DR\b/.test(d) ? 'sedan' : '');
const pct = (x: number) => `${(Math.round(x * 1000) / 10).toLocaleString('en-US')} %`;
function band(k: string) { const v = ALL.filter((x) => kind(x.desc) === k).map((x) => x.rollRisk as number).sort((a, b) => a - b); return { n: v.length, med: v[Math.floor(v.length / 2)] ?? 0, lo: v[0] ?? 0, hi: v[v.length - 1] ?? 0 }; }
const SEDAN = band('sedan'), SUV = band('suv'), PICKUP = band('pickup');

export default definePage({
  id: 'nhtsa-crash-test-ratings-explained', slug: 'nhtsa-crash-test-ratings-explained', kind: 'guide', group: 'guides', order: 35,
  nav: 'NCAP stars explained', card: 'How NHTSA builds the overall, frontal, side and rollover stars',
  title: 'NCAP Ratings Explained 2026: How NHTSA Crash Stars Work',
  description: 'NCAP ratings explained: how NHTSA turns frontal, side and rollover tests into 1 to 5 stars, what not rated means, and the 2025 stars of 16 best sellers.',
  h1: 'NHTSA crash test ratings explained',
  intro: 'NCAP stars come from three crash tests and one stability measure, combined into an overall score. The rollover stars follow a simple scale; the calculator below converts a risk into stars.',
  resume: `NHTSA's New Car Assessment Program, which began rating frontal crash protection in 1978 and adopted 5-Star Safety Ratings in 1993, is the federal consumer crash test program, distinct from the minimum safety standards every vehicle must meet. NHTSA buys vehicles from dealers and runs a frontal test into a rigid barrier at 35 mph with an average-size male dummy driving and a small female dummy as passenger, a side test where a 3,015 lb barrier moving at 38.5 mph hits the driver side, and a side pole test at 20 mph and a 75-degree angle. Injury measurements become a probability of serious injury, then stars. The rollover rating is different: it is not a crash but a calculation from the static stability factor, half the track width divided by the height of the center of gravity, together with a driving maneuver that tests whether the vehicle tips up, giving a percentage risk of rollover in a single-vehicle crash. The overall rating weighs the three.`,
  body: (h) => `
<p>Type the rollover risk NHTSA shows for a vehicle to see the stars it earns.</p>
${h.mini('rollover')}
<h2>The rollover scale</h2>
<p>Five stars means a risk of rollover below 10 % in a single-vehicle crash, four stars 10 to 20 %, three stars 20 to 30 %, two stars 30 to 40 % and one star above 40 %. Among the versions of this site's 16 models that NHTSA rated since model year 2015, the median risk is ${pct(SEDAN.med)} for sedans (${SEDAN.n} versions, ${pct(SEDAN.lo)} to ${pct(SEDAN.hi)}), ${pct(SUV.med)} for SUVs (${SUV.n} versions) and ${pct(PICKUP.med)} for pickups (${PICKUP.n} versions, up to ${pct(PICKUP.hi)}), which is why so many trucks have four rollover stars while scoring five stars in crash tests.</p>
<h2>Frontal and side stars</h2>
<p>The frontal rating compares vehicles only within the same weight class, plus or minus 250 lb, because hitting a fixed barrier is equivalent to hitting a vehicle of the same weight. The side ratings combine the moving barrier and pole results for front and rear seats. A five-star overall vehicle can still have a four-star result in one test; the ${h.a('crash-test-ratings', 'crash rating lookup')} shows each column, and the ${h.a('home', 'VIN decoder')} pulls them for one vehicle.</p>
<h2>2025 ratings of the best-selling models on this site</h2>
<p>Best overall rating NHTSA published for each model's 2025 versions, the lowest rollover risk measured among them and the number of rated versions, from the ${h.src('ncap', 'NCAP Safety Ratings')} API read for this build (${NCAP.retrieved_at}).</p>
${h.table(['Model', 'Best overall 2025', 'Lowest rollover risk', 'Rated versions'], rows, undefined, ['l', 'l', 'r', 'r'])}
<h2>What not rated means</h2>
<p>NHTSA does not test every vehicle every year. It picks models by expected sales, new designs and safety interest, and ratings carry over when a model is unchanged. A version shown without stars was not tested in that configuration that year. Heavy-duty pickups above 10,000 lb are outside the program. A missing rating is a gap of information, not a negative result; look at the closest rated body style and at the insurance industry's tests, which use different crashes.</p>
<h2>How ratings have changed</h2>
<p>NHTSA enhanced the program in 2010, for vehicles from the 2011 model year, with an overall vehicle score, the side pole test and the small female dummy, so stars from before 2011 are not comparable with later ones. In 2015 the agency announced plans to update the program again with new crash avoidance technologies and better protection of passengers and pedestrians. When you compare two used cars, compare ratings from the same period.</p>
<h2>Using the ratings when you buy</h2>
<p>Look at the version you are buying: cab style, drive type and body all change results. Look at the frontal and side columns separately from the overall score, and at the rollover risk for tall vehicles. Pair the stars with the ${h.a('recall-check', 'recall campaigns')} for the same year: a model with a top rating and an open air bag campaign is not safe until the campaign is done.</p>
`,
  faqs: [
    { q: 'How does NHTSA calculate the rollover rating?', a: 'From the static stability factor, which compares half the track width with the height of the center of gravity, plus a dynamic test of whether the vehicle tips up in a sharp steering maneuver. The result is a risk of rolling over in a single-vehicle crash: under 10 % earns five stars, over 40 % one star.' },
    { q: 'Are NCAP ratings before 2011 comparable with today?', a: 'No. From the 2011 model year NHTSA changed the program: it added the side pole test and a small female dummy, and recalculated the stars. A 2009 five-star car and a 2015 five-star car were rated on different tests. Compare vehicles rated under the same system, 2011 or later.' },
    { q: 'Why do pickups often get four stars overall?', a: `Mostly because of rollover. Pickups sit high: the median rollover risk of the pickup versions NHTSA rated for this site's models is ${pct(PICKUP.med)}, which means four rollover stars and pulls the overall score down, even when the frontal and side crash results are five stars. Check each column in the lookup rather than the overall score alone.` },
    { q: 'Does NCAP test crash avoidance systems?', a: 'It lists whether a version has recommended technologies that met NHTSA’s performance tests, such as forward collision warning, lane departure warning, crash imminent braking and dynamic brake support, but those do not change the stars. Automatic emergency braking joined the recommended list for model year 2018 vehicles.' },
  ],
  related: ['crash-test-ratings', 'home', 'recall-check', 'window-sticker-by-vin'],
  sources: ['ncap', 'recalls'],
});
