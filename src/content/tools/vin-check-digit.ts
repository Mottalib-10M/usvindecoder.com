import { definePage } from '../../lib/page-types';
import { SAMPLES } from '../../lib/data';
import { checkDigitDetail } from '../../lib/engine/vin';

const d = checkDigitDetail(SAMPLES.car.vin);

export default definePage({
  id: 'vin-check-digit', slug: 'vin-check-digit', kind: 'tool', group: 'decode', order: 6, tool: 'checkdigit',
  nav: 'VIN check digit', card: 'Verify a VIN with the federal formula, position by position',
  title: 'VIN Check Digit Calculator 2026: Is This VIN Valid?',
  description: 'VIN check digit calculator: verify any 17-character VIN with the federal formula of 49 CFR 565.15, step by step, in your browser. Spot a miscopied VIN.',
  h1: 'VIN check digit calculator',
  intro: `The ninth character of a VIN is computed from the other sixteen. Type a VIN to verify it; the example adds up to ${d.sum}, which leaves ${d.remainder} after dividing by 11.`,
  resume: `Every VIN assigned for the North American market carries a check digit in position 9, defined by the federal rule in 49 CFR 565.15. Each letter is first turned into a number with a fixed table (A and J are 1, B, K and S are 2, and so on, with I, O and Q excluded), each of the 17 values is multiplied by the weight of its position (8, 7, 6, 5, 4, 3, 2, 10, then 0 for the check digit itself, then 9 down to 2), and the products are added. The remainder of that sum divided by 11 is the check digit, written X when it is 10. A VIN whose ninth character does not match was almost certainly miscopied, and occasionally it was altered. The calculator runs in your browser with no network request and shows every step of the arithmetic, so you can verify a VIN on a title, a bill of sale or a listing before decoding it.`,
  body: (h) => `
<h2>What a valid check digit proves, and what it does not</h2>
<p>A matching check digit means the 17 characters are internally consistent. It catches nearly every single-character copying mistake, and most swaps of two neighboring characters, because each position has a different weight. It does not prove that the VIN was ever assigned to a real vehicle, nor that it belongs to the car in front of you. A cloned VIN, copied from a legitimate car onto a stolen one, has a perfect check digit. That is why the next step is to decode it and compare the result with the vehicle: the ${h.a('home', 'VIN decoder')} returns the model, engine and body, and they must match what you see.</p>
<h2>Common reasons for a mismatch</h2>
<p>Look-alike characters cause most failures: 5 and S, 8 and B, 2 and Z, 6 and G, 1 and the forbidden I, 0 and the forbidden O or Q. Re-read the VIN on the windshield plate and on the door label rather than on a photo or a typed listing. The ${h.a('where-is-the-vin-number', 'matcher in the VIN location guide')} compares two copies and points out look-alike pairs. A second, legitimate reason is a vehicle built for another market: outside North America the check digit is optional, so a grey-market import can carry any character in position 9.</p>
<h2>The arithmetic, step by step</h2>
<p>The table under the calculator follows ${h.src('part565', 'Part 565')} literally. Digits keep their value. Letters take the transliteration values A 1, B 2, C 3, D 4, E 5, F 6, G 7, H 8, J 1, K 2, L 3, M 4, N 5, P 7, R 9, S 2, T 3, U 4, V 5, W 6, X 7, Y 8, Z 9. Position 9 has a weight of zero, so the check digit never influences its own computation. Once all 17 characters are typed, the product row is summed and divided by 11. A remainder of 10 is written X, the only place a letter is legal in position 9.</p>
<h2>Using it with the other tools</h2>
<p>A VIN that passes here can be decoded for its factory record, its recalls and its ratings. The ${h.a('what-does-my-vin-mean', 'guide to what each position means')} explains the rest of the structure, and the ${h.a('vin-model-year-chart', 'model year chart')} decodes position 10 on its own.</p>
`,
  faqs: [
    { q: 'Can a VIN be valid with an X in position 9?', a: 'Yes. When the weighted sum divided by 11 leaves a remainder of 10, the federal rule writes the check digit as the letter X. It is the only position where X stands for a number, and roughly one VIN in eleven ends up with it. Everywhere else, X is an ordinary letter worth 7.' },
    { q: 'Does a correct check digit mean the car is not stolen?', a: 'No. Thieves who clone a VIN copy it from a real, legitimate vehicle, so the check digit is correct. The check only catches typing errors and crude fakes. Compare the VIN on the dashboard, the door label and the title, decode it to confirm the model and engine, and look up theft and total-loss records.' },
    { q: 'Why would a real vehicle fail the check digit?', a: 'Because the check digit is mandatory only for vehicles built for the North American market. A car imported from Europe, Japan or elsewhere as a used or collector vehicle may have a VIN that follows its home market rules, where position 9 can be any character. Vehicles built before the 1981 model year also used older, shorter numbering.' },
  ],
  related: ['home', 'what-does-my-vin-mean', 'where-is-the-vin-number', 'vin-model-year-chart', 'free-vin-check-vs-history-report'],
  sources: ['part565', 'vpic'],
});
