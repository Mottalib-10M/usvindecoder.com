/**
 * Rapprochement des noms de modèles entre bases fédérales : vPIC écrit « YZF-R1 », la base des rappels
 * « YZFR1 » ; vPIC « F-150 », l'EPA « F150 Pickup 2WD ». Même logique que scripts/data/build-samples.py.
 *
 * Certaines marques déposent leurs rappels et leurs fiches EPA sous le nom de version, pas sous la
 * famille que vPIC renvoie comme modèle : vPIC « C-Class » + finition « C300 », la base des rappels
 * « C 300 » et « C300 », l'EPA « C300 » (sondé sur 24 VIN réels : scripts/data/probe-matching.mjs).
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

/** Les deux écritures d'un code de version : « C300 » et « C 300 », « GLE350 » et « GLE 350 ». */
function spellings(letters: string, digits: string, suffix: string): string[] {
  return [`${letters}${digits}${suffix}`, `${letters} ${digits}${suffix}`];
}

/**
 * Codes de version tirés de la finition et de la série vPIC, écrits comme les bases des rappels et
 * de l'EPA : « C300 » → C300, C 300 ; « GLE350-4M » → GLE350, GLE 350 ; Lexus « RX » + « 350 Standard »
 * → RX350, RX 350 ; « AMG C43 » garde le préfixe AMG. Vide pour une finition sans code (« XLT », « LT (1LT) »).
 */
export function versionCodes(model: string, trim = '', series = ''): string[] {
  const out: string[] = [];
  const m = (model || '').trim().toUpperCase();
  for (const raw of [trim, series]) {
    const text = (raw || '').toUpperCase().replace(/-4M\b|\b4MATIC\+?|\b4M\b/g, ' ');
    const amg = /\bAMG\b/.test(text) ? 'AMG ' : '';
    const tokens = text.split(/[\s/,()]+/).filter(Boolean);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i].replace(/-$/, '');
      const code = t.match(/^([A-Z]{1,3})-?(\d{2,3})([A-Z]?)$/);
      if (code) { for (const s of spellings(code[1], code[2], code[3])) out.push(amg + s); continue; }
      // « C 43 » en deux mots, ou un nombre seul accolé à un modèle de 2-3 lettres (Lexus « RX » + « 350 »).
      const num = t.match(/^(\d{3})([A-Z]?)$/);
      if (num && /^[A-Z]{2,3}$/.test(m)) for (const s of spellings(m, num[1], num[2])) out.push(s);
      if (/^[A-Z]$/.test(t) && /^\d{2,3}$/.test(tokens[i + 1] ?? '')) for (const s of spellings(t, tokens[i + 1], '')) out.push(amg + s);
    }
  }
  const self = normName(model);
  return [...new Set(out)].filter((c) => normName(c) !== self);
}

/** Noms à essayer sur l'API des rappels : le modèle vPIC, « Silverado 1500 » quand la série est un tonnage, puis les codes de version. */
export function recallCandidates(model: string, trim = '', series = ''): string[] {
  const out = [model];
  if (/^\d{4}(HD)?$/i.test((series || '').trim()) && !model.includes(series)) out.push(`${model} ${series.trim()}`);
  out.push(...versionCodes(model, trim, series));
  return [...new Set(out.filter(Boolean))];
}
