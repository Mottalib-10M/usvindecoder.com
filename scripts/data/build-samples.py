#!/usr/bin/env python3
"""Réponses réelles des API fédérales pour les exemples affichés au premier rendu des outils.

Le HTML du build montre un résultat complet avant toute saisie (RECETTE §17.1, §17.5) : il est
calculé ici, avec les mêmes API que le navigateur interrogera ensuite. Les réponses brutes servent
aussi de jeux d'essai aux tests (tests/*.test.ts). Sortie : src/data/gen/samples.json.

Rejouable : python3 scripts/data/build-samples.py [--offline]
"""
import datetime, json, os, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, 'cache', 'samples')
OUT = os.path.join(SITE, 'src', 'data', 'gen', 'samples.json')
os.makedirs(CACHE, exist_ok=True)
offline = '--offline' in sys.argv
VPIC = 'https://vpic.nhtsa.dot.gov/api/vehicles'; NHTSA = 'https://api.nhtsa.gov'; EPA = 'https://www.fueleconomy.gov/ws/rest'
q = urllib.parse.quote

def get(url, accept='application/json'):
    f = os.path.join(CACHE, q(url, safe='')[:200] + '.json')
    if offline and os.path.exists(f):
        return json.load(open(f))
    for i in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'usvindecoder-build/1.0 (+https://usvindecoder.com)', 'Accept': accept})
            with urllib.request.urlopen(req, timeout=60) as r:
                d = json.load(r)
            json.dump(d, open(f, 'w')); time.sleep(0.15)
            return d
        except Exception as e:
            err = e; time.sleep(1.5 * (i + 1))
    if os.path.exists(f):
        return json.load(open(f))
    raise err

def menu(j):
    m = (j or {}).get('menuItem') or []
    return m if isinstance(m, list) else [m]

def ncap(year, make, prefix):
    names = [r['Model'] for r in get(f'{NHTSA}/SafetyRatings/modelyear/{year}/make/{q(make)}?format=json').get('Results', [])]
    names = [n for n in names if n.upper().startswith(prefix.upper())]
    out = []; by = {}
    for n in names:
        for v in get(f'{NHTSA}/SafetyRatings/modelyear/{year}/make/{q(make)}/model/{q(n)}?format=json').get('Results', []):
            r = get(f"{NHTSA}/SafetyRatings/VehicleId/{v['VehicleId']}?format=json")
            out.append(r); by.setdefault(n, []).append(r)
    return {'models': names, 'ratings': out, 'byName': by}

def epa(year, make, model_prefix, drive=None):
    models = [m['value'] for m in menu(get(f'{EPA}/vehicle/menu/model?year={year}&make={q(make)}'))]
    pick = [m for m in models if m.replace('-', '').upper().startswith(model_prefix.replace('-', '').upper())]
    if drive:
        pick = [m for m in pick if drive in m] or pick
    res = {'models': models, 'picked': pick, 'options': {}, 'vehicles': {}}
    for m in pick:
        opts = menu(get(f'{EPA}/vehicle/menu/options?year={year}&make={q(make)}&model={q(m)}'))
        res['options'][m] = opts
        for o in opts:
            res['vehicles'][o['value']] = get(f"{EPA}/vehicle/{o['value']}")
    return res

def norm(x):
    return ''.join(ch for ch in x.upper() if ch.isalnum())

def recall_call(make, model, year):
    try:
        return get(f'{NHTSA}/recalls/recallsByVehicle?make={q(make)}&model={q(model)}&modelYear={year}')
    except Exception:
        return {'Count': 0, 'results': []}

def recalls(make, model, year):
    # Même rapprochement que le navigateur (src/lib/engine/match.ts) : le nom vPIC d'abord ; s'il ne rend rien,
    # les noms de la base des rappels qui lui correspondent à la ponctuation près (« YZF-R1 » = « YZFR1 »).
    j = recall_call(make, model, year)
    j['_model'] = model
    if j.get('Count'):
        return j
    names = [r['model'] for r in get(f'{NHTSA}/products/vehicle/models?modelYear={year}&make={q(make)}&issueType=r').get('results', [])]
    names = sorted({n for n in names if not n.lower().startswith(('redundant', 'duplicate'))})
    pick = [n for n in names if norm(n) == norm(model)] or [n for n in names if norm(n).startswith(norm(model))]
    for n in pick[:4]:
        k = recall_call(make, n, year)
        if k.get('Count'):
            k['_model'] = n
            return k
    return j

CAR = '1FTFW1CT5DFC10312'      # 2013 Ford F-150 SuperCrew, VIN d'exemple largement diffusé
MOTO = 'JYARN23E*9A'           # motif partiel (numéro de série omis) : 2009 Yamaha YZF-R1
out = {
    'retrieved_at': datetime.date.today().isoformat(),
    'car': {'vin': CAR, 'vpic': get(f'{VPIC}/DecodeVinValuesExtended/{CAR}?format=json'), 'recalls': recalls('FORD', 'F-150', 2013),
            'ncap': ncap(2013, 'FORD', 'F-150'), 'epa': epa(2013, 'Ford', 'F150 Pickup', '2WD')},
    'moto': {'vin': MOTO, 'vpic': get(f'{VPIC}/DecodeVinValuesExtended/{q(MOTO)}?format=json'), 'recalls': recalls('YAMAHA', 'YZF-R1', 2009)},
    'recall': {'make': 'HONDA', 'model': 'CR-V', 'year': 2020, 'json': recalls('HONDA', 'CR-V', 2020)},
    'ncap': {'make': 'TOYOTA', 'model': 'RAV4', 'year': 2025, **ncap(2025, 'TOYOTA', 'RAV4')},
    'epa': {'make': 'Toyota', 'model': 'RAV4', 'year': 2025, **epa(2025, 'Toyota', 'RAV4')},
}
def scrub(x):
    # Les réponses brutes portent des liens (photos et vidéos de crash-tests, sites des marques) que le site
    # n'affiche pas : on les retire pour ne publier que ce qui sert.
    if isinstance(x, dict):
        return {k: scrub(v) for k, v in x.items() if not (isinstance(v, str) and v.startswith('http'))}
    if isinstance(x, list):
        return [scrub(v) for v in x]
    return x
json.dump(scrub(out), open(OUT, 'w'), ensure_ascii=False)
print('samples.json :', {k: (len(v['ratings']) if k == 'ncap' else '') for k, v in out.items() if isinstance(v, dict)}, os.path.getsize(OUT) // 1024, 'Ko')
