#!/usr/bin/env python3
"""Notes NCAP : API NHTSA SafetyRatings -> src/data/gen/ncap.json (modèles publiés, années 2015+).

API publique, sans clé : https://api.nhtsa.gov/SafetyRatings (documentation :
https://www.nhtsa.gov/nhtsa-datasets-and-apis#ratings). Réponses gardées dans .cache/ncap/.

Rejouable : python3 scripts/data/build-ncap.py [--offline]
"""
import datetime, json, os, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, 'cache', 'ncap')
OUT = os.path.join(SITE, 'src', 'data', 'gen', 'ncap.json')
API = 'https://api.nhtsa.gov/SafetyRatings'
cat = json.load(open(os.path.join(HERE, 'catalog.json')))
os.makedirs(CACHE, exist_ok=True)
offline = '--offline' in sys.argv

def get(path):
    f = os.path.join(CACHE, urllib.parse.quote(path, safe='') + '.json')
    if offline and os.path.exists(f):
        return json.load(open(f))
    for i in range(4):
        try:
            req = urllib.request.Request(API + path, headers={'User-Agent': 'usvindecoder-build/1.0 (+https://usvindecoder.com)', 'Accept': 'application/json'})
            with urllib.request.urlopen(req, timeout=60) as r:
                d = json.load(r)
            json.dump(d, open(f, 'w'))
            time.sleep(0.15)
            return d
        except Exception as e:  # réseau capricieux : on réessaie, puis on garde le cache
            err = e; time.sleep(1.5 * (i + 1))
    if os.path.exists(f):
        return json.load(open(f))
    raise err

def star(x):
    try:
        return int(x)
    except (TypeError, ValueError):
        return None

this_year = datetime.date.today().year
out = {}
for m in cat['models']:
    b = next(x for x in cat['brands'] if x['slug'] == m['brand'])
    years = {}
    for y in range(2015, this_year + 2):
        mk = urllib.parse.quote(b['name'].upper())
        # Les intitulés NCAP varient (« F-150 SUPER CREW », « MODEL Y RWD ») : on prend tous ceux qui commencent par le modèle.
        names = [r['Model'] for r in get(f"/modelyear/{y}/make/{mk}").get('Results', [])]
        pre = m['ncap'].upper()
        names = [n for n in names if n.upper() == pre or n.upper().startswith(pre + ' ') or n.upper().startswith(pre + '(')]
        vs = []
        variants = [v for n in names for v in get(f"/modelyear/{y}/make/{mk}/model/{urllib.parse.quote(n)}").get('Results', [])]
        for v in variants:
            r = get(f"/VehicleId/{v['VehicleId']}").get('Results', [{}])[0]
            vs.append({
                'id': v['VehicleId'], 'desc': v['VehicleDescription'],
                'overall': star(r.get('OverallRating')), 'front': star(r.get('OverallFrontCrashRating')),
                'side': star(r.get('OverallSideCrashRating')), 'rollover': star(r.get('RolloverRating')),
                'rollRisk': r.get('RolloverPossibility'), 'complaints': r.get('ComplaintsCount'),
                'investigations': r.get('InvestigationCount'),
                'fcw': r.get('NHTSAForwardCollisionWarning'), 'ldw': r.get('NHTSALaneDepartureWarning'),
            })
        if vs:
            years[str(y)] = vs
    out[m['slug']] = years
    rated = sum(1 for vs in years.values() for v in vs if v['overall'])
    print(f"  {m['slug']:16} {len(years)} années, {sum(len(v) for v in years.values())} variantes, {rated} notées")

json.dump({'source': 'https://www.nhtsa.gov/nhtsa-datasets-and-apis', 'retrieved_at': datetime.date.today().isoformat(), 'models': out}, open(OUT, 'w'), ensure_ascii=False, indent=0)
print('ncap.json écrit')
