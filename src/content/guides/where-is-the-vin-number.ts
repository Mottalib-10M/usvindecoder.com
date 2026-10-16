import { definePage } from '../../lib/page-types';

export default definePage({
  id: 'where-is-the-vin-number', slug: 'where-is-the-vin-number', kind: 'guide', group: 'guides', order: 31,
  nav: 'Where is the VIN?', card: 'Every place to find it, and a matcher for two copies',
  title: 'VIN Location 2026: Where to Find the VIN on Any Vehicle',
  description: 'VIN location on cars, trucks and motorcycles: windshield plate, door jamb label, frame, title and insurance card. Compare two copies with the free matcher.',
  h1: 'Where is the VIN number? Every place to look',
  intro: 'Look through the windshield at the lower driver-side corner, then at the label on the driver door jamb. Both must match the title, character for character; the matcher below checks it.',
  resume: `Federal rules require the VIN of every car, SUV, pickup and van built since the 1981 model year to be readable from outside the vehicle, through the windshield, on the left side of the instrument panel (49 CFR 565.13). The same number is printed on the certification label that 49 CFR Part 567 requires on the driver door, door edge or jamb, together with the month and year of manufacture and the weight ratings. Makers also stamp or label it in places that are harder to alter: on the frame of a truck, under the hood, on the firewall, and on many major parts. On paper, it appears on the title, the registration, the insurance card and the sales contract. For a used car, the point is not only to find the VIN but to compare every copy: a dashboard VIN that differs from the door label or the title is a reason to stop the sale until the state DMV explains it.`,
  body: (h) => `
<p>Copy the VIN from two places, the dashboard plate and the title for example, and the matcher shows any difference, and whether it is a typical look-alike error.</p>
${h.mini('match')}
<h2>On the vehicle</h2>
<h3>Windshield plate</h3>
<p>Stand outside at the driver side and look through the bottom corner of the windshield: a metal plate on the dashboard carries the 17 characters. This is the location the federal rule makes mandatory, so it exists on every light vehicle sold in the US since 1981. The plate is riveted with special rivets; scratches, glue or non-matching rivets around it are a warning sign.</p>
<h3>Driver door jamb label</h3>
<p>Open the driver door: the certification label on the jamb or door edge repeats the VIN with the date of manufacture, the gross vehicle weight rating and the axle ratings, and states that the vehicle conforms to federal safety standards. Tire pressure information is usually on a separate placard next to it. A missing or replaced label is common after body repairs, but it should be explained.</p>
<h3>Engine bay, frame and parts</h3>
<p>Many vehicles carry the VIN or part of it on the firewall, the radiator support or a strut tower. Pickups and body-on-frame SUVs have it stamped on the frame rail, often on the driver side near the rear wheel. Since federal theft prevention standards (49 CFR Part 541) apply to many models, major parts such as the engine, transmission, doors, hood, fenders and bumpers are marked with the VIN or a derivative, which helps police trace stolen parts.</p>
<h3>Motorcycles and trailers</h3>
<p>A motorcycle VIN is stamped on the steering head and printed on a frame label; see the ${h.a('motorcycle-vin-decoder', 'motorcycle decoder')}. Trailers carry it on the tongue or the front of the frame, and on a certification label.</p>
<h2>On paper</h2>
<p>The VIN is printed on the certificate of title, the registration card, the insurance card and policy, the sales contract and most service invoices. When you buy a used car, compare the title against the vehicle before you pay: a title for another vehicle is the core of title fraud. Insurance cards with a typed VIN are a good check of what the seller's insurer believes the car is.</p>
<h2>When two copies do not match</h2>
<p>Most mismatches are copying errors: B and 8, S and 5, Z and 2, G and 6, and the letters I, O and Q, which never appear in a VIN and are almost always a 1 or a 0. Re-read both plates in good light. A real difference between the dashboard plate, the door label and the title is a different matter: it can result from a body or dash replacement done without paperwork, a clerical error at the DMV, or a stolen vehicle given the identity of another one, a practice called VIN cloning. A cloned VIN passes the ${h.a('vin-check-digit', 'check digit test')}, because it was copied from a real car.</p>
${h.box('Before you hand over the money', '<p>Decode the VIN and compare the result with the car: model, body, engine and drive. Then check theft and total-loss records on NICB VINCheck and title brands through an NMVTIS report. Only the DMV can correct a title.</p>')}
<h2>Reading it from the outside</h2>
<p>For a car parked on a lot or a street, the windshield plate is the only VIN you can read without the owner. That is also why it is the one thieves copy for cloning. When a listing shows only a photo of the windshield plate, ask for the door label and the title before going further. Once you have a reliable copy, the ${h.a('home', 'decoder')} returns the factory record and the recall campaigns, and the ${h.a('what-does-my-vin-mean', 'VIN guide')} explains each block.</p>
`,
  faqs: [
    { q: 'Where is the VIN on a car?', a: 'On a plate at the lower left corner of the windshield, readable from outside, and on the certification label on the driver door jamb or door edge. It is also often on the firewall or radiator support under the hood, and on paper on the title, registration and insurance card. All copies must be identical.' },
    { q: 'Where is the VIN on a truck frame?', a: 'On most pickups and body-on-frame SUVs, a full or partial VIN is stamped into the frame rail, often on the driver side near the rear wheel or under the cab. It can be rusted or hidden by undercoating. It is a useful check against a replaced windshield plate.' },
    { q: 'What should I do if the VIN on the car does not match the title?', a: 'Do not buy the vehicle until the difference is explained in writing. First re-read both, since look-alike characters cause most mismatches. If the difference is real, ask the seller to have the DMV inspect the vehicle; a real mismatch can mean a clerical error, an undocumented repair or a stolen vehicle.' },
    { q: 'Can I find the VIN from a license plate?', a: 'Not legally on your own in most cases. Plate-to-VIN lookups depend on state DMV records, whose access is restricted by the federal Driver’s Privacy Protection Act. NHTSA’s recall lookup accepts a plate for some states. For a purchase, ask the seller for the VIN; a seller who refuses is a warning sign.' },
  ],
  related: ['what-does-my-vin-mean', 'vin-check-digit', 'home', 'motorcycle-vin-decoder', 'free-vin-check-vs-history-report'],
  sources: ['part565', 'vpic', 'nmvtis'],
});
