#!/usr/bin/env python3
"""Consommation EPA : fueleconomy.gov -> src/data/gen/epa.json.

Sources (U.S. Department of Energy / EPA, données publiques) :
- https://www.fueleconomy.gov/feg/epadata/vehicles.csv.zip  (tous les véhicules notés depuis 1984)
- https://www.fueleconomy.gov/ws/rest/fuelprices            (prix des carburants utilisés par le site)
Champs : https://www.fueleconomy.gov/feg/ws/index.shtml#vehicle

Rejouable : python3 scripts/data/build-epa.py [--offline]
"""
import collections, csv, datetime, io, json, os, statistics, sys, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, 'cache')
OUT = os.path.join(SITE, 'src', 'data', 'gen', 'epa.json')
CSV_URL = 'https://www.fueleconomy.gov/feg/epadata/vehicles.csv.zip'
PRICE_URL = 'https://www.fueleconomy.gov/ws/rest/fuelprices'
UA = {'User-Agent': 'usvindecoder-build/1.0 (+https://usvindecoder.com)'}
cat = json.load(open(os.path.join(HERE, 'catalog.json')))
os.makedirs(CACHE, exist_ok=True)

def get(url, accept='*/*'):
    with urllib.request.urlopen(urllib.request.Request(url, headers={**UA, 'Accept': accept}), timeout=180) as r:
        return r.read()

zpath = os.path.join(CACHE, 'vehicles.csv.zip'); ppath = os.path.join(CACHE, 'fuelprices.json')
if '--offline' not in sys.argv or not os.path.exists(zpath):
    open(zpath, 'wb').write(get(CSV_URL))
if '--offline' not in sys.argv or not os.path.exists(ppath):
    open(ppath, 'wb').write(get(PRICE_URL, 'application/json'))
prices = {k: float(v) for k, v in json.load(open(ppath)).items()}

csv.field_size_limit(10**9)
z = zipfile.ZipFile(zpath)
rows = list(csv.DictReader(io.TextIOWrapper(z.open(z.namelist()[0]), encoding='utf-8', errors='replace')))
latest_year = max(int(r['year']) for r in rows if int(r['year']) <= datetime.date.today().year + 1)

def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return 0.0

def kind(r):
    ft = r['fuelType1']
    if ft == 'Electricity':
        return 'ev'
    if ft == 'Hydrogen':
        return 'fcv'
    if r.get('fuelType2') == 'Electricity' or num(r.get('combA08')) and r.get('fuelType2') == 'Electricity':
        return 'phev'
    if 'Hybrid' in (r.get('eng_dscr') or '') or 'HEV' in (r.get('eng_dscr') or ''):
        return 'hybrid'
    return 'diesel' if ft == 'Diesel' else 'gas'

def summarize(rs):
    comb = [num(r['comb08']) for r in rs if num(r['comb08']) > 0]
    gas = [r for r in rs if kind(r) in ('gas', 'diesel', 'hybrid')]
    gcomb = [num(r['comb08']) for r in gas if num(r['comb08']) > 0]
    best = max(rs, key=lambda r: num(r['comb08']))
    worst = min(rs, key=lambda r: num(r['comb08']) or 999)
    return {
        'n': len(rs), 'kinds': sorted({kind(r) for r in rs}),
        'gasMin': min(gcomb) if gcomb else None, 'gasMax': max(gcomb) if gcomb else None,
        'combMin': min(comb) if comb else None, 'combMax': max(comb) if comb else None,
        'best': {'model': best['model'], 'trany': best['trany'], 'comb': num(best['comb08']), 'city': num(best['city08']), 'hwy': num(best['highway08']), 'fuel': best['fuelType1'], 'cost': num(best['fuelCost08']), 'kind': kind(best)},
        'worst': {'model': worst['model'], 'trany': worst['trany'], 'comb': num(worst['comb08']), 'city': num(worst['city08']), 'hwy': num(worst['highway08']), 'fuel': worst['fuelType1'], 'cost': num(worst['fuelCost08']), 'kind': kind(worst)},
        'costMin': min(num(r['fuelCost08']) for r in rs if num(r['fuelCost08']) > 0) if any(num(r['fuelCost08']) > 0 for r in rs) else None,
        'costMax': max(num(r['fuelCost08']) for r in rs) if rs else None,
    }

models = {}
for m in cat['models']:
    b = next(x for x in cat['brands'] if x['slug'] == m['brand'])
    mine = [r for r in rows if r['make'] == b['epa'] and r['baseModel'] in m['epa']]
    years = {}
    for y in range(2015, latest_year + 1):
        rs = [r for r in mine if int(r['year']) == y]
        if rs:
            years[str(y)] = summarize(rs)
    models[m['slug']] = {'years': years}

brands = {}
for b in cat['brands']:
    out = {}
    for y in (latest_year - 1, latest_year):
        rs = [r for r in rows if r['make'] == b['epa'] and int(r['year']) == y]
        if not rs:
            continue
        s = summarize(rs)
        gas = [num(r['comb08']) for r in rs if kind(r) in ('gas', 'diesel', 'hybrid') and num(r['comb08']) > 0]
        s['gasMedian'] = statistics.median(gas) if gas else None
        s['evShare'] = round(sum(1 for r in rs if kind(r) == 'ev') / len(rs), 3)
        s['models'] = len({r['baseModel'] for r in rs})
        out[str(y)] = s
    brands[b['slug']] = out

# Médiane de tous les véhicules à essence / diesel / hybrides de la dernière année complète, pour la comparaison
ref_year = latest_year - 1
ref = [num(r['comb08']) for r in rows if int(r['year']) == ref_year and kind(r) in ('gas', 'diesel', 'hybrid') and num(r['comb08']) > 0]
json.dump({
    'source': CSV_URL, 'prices_source': PRICE_URL, 'retrieved_at': datetime.date.today().isoformat(),
    'prices': prices, 'latestYear': latest_year, 'refYear': ref_year, 'refMedian': statistics.median(ref), 'refCount': len(ref),
    'epaAssumptions': {'milesPerYear': 15000, 'cityShare': 0.55},
    'models': models, 'brands': brands,
}, open(OUT, 'w'), ensure_ascii=False, indent=0)
print(f'epa.json : {len(rows)} véhicules, dernière année {latest_year}, prix régulier {prices.get("regular")} $/gal, médiane {ref_year} = {statistics.median(ref)} mpg')
for s, m in models.items():
    ys = m['years']; last = ys.get(str(latest_year)) or ys.get(str(latest_year - 1)) or {}
    print(f"  {s:16} {len(ys)} années, {last.get('combMin')}-{last.get('combMax')} mpg")
