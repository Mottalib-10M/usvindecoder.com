/**
 * Rapprochement des noms de modèles entre bases fédérales : vPIC écrit « YZF-R1 », la base des rappels
 * « YZFR1 » ; vPIC « F-150 », l'EPA « F150 Pickup 2WD ». Même logique que scripts/data/build-samples.py.
 */
export const normName = (s: string) => (s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
/** Noms de la liste qui correspondent au modèle : égalité à la ponctuation près, sinon préfixe. Doublons signalés écartés. */
export function matchNames(list: string[], target: string): string[] {
  const t = normName(target);
  if (!t) return [];
  const clean = [...new Set(list)].filter((n) => !/^(redundant|duplicate)\b/i.test(n));
  const exact = clean.filter((n) => normName(n) === t);
  if (exact.length) return exact;
  return clean.filter((n) => normName(n).startsWith(t)).slice(0, 4);
}
