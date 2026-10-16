#!/usr/bin/env python3
"""Rappels NHTSA : fichier plat officiel -> src/data/gen/recalls.json.

Source : NHTSA Office of Defects Investigation, « Recalls flat file » (FLAT_RCL_POST_2010.zip),
https://static.nhtsa.gov/odi/ffdd/rcl/FLAT_RCL_POST_2010.zip, description des champs
https://static.nhtsa.gov/odi/ffdd/rcl/RCL.txt. Mis à jour chaque jour par la NHTSA.

Rejouable : python3 scripts/data/build-recalls.py [--cache .cache]
Le fichier brut est gardé dans .cache/ (hors dépôt). Aucun chiffre n'est saisi à la main :
tout ce que les pages disent des rappels sort de ce script.

Définitions retenues (écrites aussi sur la page de méthode) :
- une « campagne » = un numéro NHTSA (CAMPNO) de type V (véhicule), hors équipements, pneus
  et sièges enfants ;
- l'année d'une campagne = année de réception du rapport Part 573 (RCDATE) ;
- « véhicules potentiellement concernés » = POTAFF, déclaré par le constructeur pour toute la
  campagne : une campagne qui touche deux marques compte ses véhicules pour chacune (on le dit) ;
- les lignes « redundant » / « duplicate » de MODELTXT sont des doublons signalés par la NHTSA,
  écartés.
"""
import collections, datetime, email.utils, io, json, os, re, sys, urllib.request, zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, 'cache')
URL = 'https://static.nhtsa.gov/odi/ffdd/rcl/FLAT_RCL_POST_2010.zip'
OUT = os.path.join(SITE, 'src', 'data', 'gen', 'recalls.json')
YEARS = list(range(2016, 2027))          # années de réception affichées
MY_FROM = 2012                           # années-modèles affichées sur les pages modèle

cat = json.load(open(os.path.join(HERE, 'catalog.json')))
os.makedirs(CACHE, exist_ok=True)
zpath = os.path.join(CACHE, 'FLAT_RCL_POST_2010.zip')
lastmod = None
if '--offline' not in sys.argv or not os.path.exists(zpath):
    req = urllib.request.Request(URL, headers={'User-Agent': 'usvindecoder-build/1.0 (+https://usvindecoder.com)'})
    with urllib.request.urlopen(req, timeout=300) as r:
        data = r.read()
        lm = r.headers.get('Last-Modified')
        lastmod = email.utils.parsedate_to_datetime(lm).date().isoformat() if lm else None
    open(zpath, 'wb').write(data)
    if lastmod: open(zpath + '.lastmod', 'w').write(lastmod)
elif os.path.exists(zpath + '.lastmod'):
    lastmod = open(zpath + '.lastmod').read().strip()

z = zipfile.ZipFile(zpath)
name = [n for n in z.namelist() if n.upper().endswith('.TXT')][0]
camps = {}
with z.open(name) as f:
    for raw in io.TextIOWrapper(f, encoding='utf-8', errors='replace', newline=''):
        p = raw.rstrip('\r\n').split('\t')
        if len(p) < 29 or p[10] != 'V':
            continue
        model = p[3].strip()
        if re.match(r'(?i)^(redundant|duplicate)\b', model):
            continue
        c = camps.get(p[1])
        if c is None:
            c = camps[p[1]] = {
                'id': p[1], 'date': p[15], 'units': int(p[11] or 0), 'comp': set(), 'mfr': p[7].strip(),
                'by': p[13].strip(), 'desc': p[19].strip(), 'cons': p[20].strip(), 'fix': p[21].strip(),
                'dnd': p[27].strip().upper() == 'YES', 'po': p[28].strip().upper() == 'YES',
                'veh': collections.defaultdict(set),
            }
        c['comp'].add(p[6].strip())
        try:
            y = int(p[4])
        except ValueError:
            y = 9999
        c['veh'][(p[2].strip(), model)].add(y)

def year_of(c):
    return int(c['date'][:4]) if c['date'][:4].isdigit() else 0

def group(comp):
    return comp.split(':')[0].strip().title().replace('Abs', 'ABS')

def clip(s, n=320):
    s = re.sub(r'https?://\S+', '', s)
    s = re.sub(r'\s+', ' ', s).strip()
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(' ', 1)[0]
    return cut.rstrip(',;:') + '…'

def nice_model(md):
    """« CX-90 », « X5 », « RAV4 » gardent leur casse ; « SORENTO » devient « Sorento »."""
    return ' '.join(w if (any(ch.isdigit() for ch in w) or len(w) <= 3) else w.title() for w in md.split())

def years_txt(ys):
    ys = sorted(y for y in ys if y != 9999)
    if not ys:
        return ''
    out, start, prev = [], ys[0], ys[0]
    for y in ys[1:] + [None]:
        if y is not None and y == prev + 1:
            prev = y; continue
        out.append(str(start) if start == prev else f'{start}-{prev}')
        if y is not None:
            start = prev = y
    return ', '.join(out)

def label_models(c, makes=None):
    parts = []
    for (mk, md), ys in sorted(c['veh'].items(), key=lambda kv: (kv[0][0], kv[0][1])):
        if makes and mk not in makes:
            continue
        yt = years_txt(ys)
        name = mk if mk in ('BMW', 'GMC', 'KTM', 'MINI', 'BYD', 'MCI', 'IC BUS') else (mk.title() if mk.isupper() else mk)
        parts.append(f"{yt} {name} {md}".strip())
    return parts

def camp_row(c, makes=None):
    models = label_models(c, makes)
    return {
        'id': c['id'], 'date': f"{c['date'][:4]}-{c['date'][4:6]}-{c['date'][6:8]}", 'units': c['units'],
        'component': sorted(group(x) for x in c['comp'])[0] if c['comp'] else '',
        'components': sorted({group(x) for x in c['comp']}),
        'models': models[:6], 'more': max(0, len(models) - 6),
        'summary': clip(c['desc']), 'consequence': clip(c['cons'], 220), 'fix': clip(c['fix'], 260), 'dnd': c['dnd'], 'po': c['po'],
        'by': c['by'],
    }

all_by_year = collections.Counter(year_of(c) for c in camps.values())
brands = {}
for b in cat['brands']:
    mk = set(b['rcl'])
    mine = [c for c in camps.values() if any(k[0] in mk for k in c['veh'])]
    by_year = {str(y): {'campaigns': 0, 'units': 0} for y in YEARS}
    comps = collections.Counter(); models5 = collections.Counter(); by = collections.Counter()
    dnd = po = 0
    for c in mine:
        y = year_of(c)
        if y in YEARS:
            by_year[str(y)]['campaigns'] += 1; by_year[str(y)]['units'] += c['units']
            for g in {group(x) for x in c['comp']}:
                comps[g] += 1
            dnd += c['dnd']; po += c['po']
            by['manufacturer' if c['by'] == 'MFR' else 'nhtsa'] += 1
        if y >= 2021:
            for md in {k[1] for k in c['veh'] if k[0] in mk}:
                models5[md] += 1
    recent = sorted(mine, key=lambda c: (c['date'], c['id']), reverse=True)[:10]
    inflator = [c for c in mine if year_of(c) in YEARS and any(x.upper().startswith('AIR BAGS') for x in c['comp']) and re.search(r'(?i)inflator', c['desc'])]
    # Modèle et année affichés au premier rendu de l'outil de la page marque (le visiteur change ensuite).
    feat = next((m for m in cat['models'] if m['brand'] == b['slug']), None)
    dmodels = set(feat['rcl']) if feat else ({models5.most_common(1)[0][0]} if models5 else set())
    dname = feat['name'] if feat else (nice_model(next(iter(dmodels))) if dmodels else '')
    def for_year(y):
        return [c for c in mine if any(k[0] in mk and k[1] in dmodels and y in v for k, v in c['veh'].items())]
    dyear = next((y for y in (2022, 2021, 2023, 2020, 2019, 2024) if for_year(y)), 2022)
    drows = sorted(for_year(dyear), key=lambda c: (c['date'], c['id']), reverse=True)
    big = sorted([c for c in mine if year_of(c) in YEARS], key=lambda c: c['units'], reverse=True)[:3]
    ten = [by_year[str(y)] for y in range(2016, 2026)]
    brands[b['slug']] = {
        'name': b['name'], 'parent': b['parent'], 'byYear': by_year,
        'campaigns10': sum(x['campaigns'] for x in ten), 'units10': sum(x['units'] for x in ten),
        'peakYear': max(range(2016, 2026), key=lambda y: by_year[str(y)]['campaigns']),
        'components': comps.most_common(8), 'dnd': dnd, 'po': po, 'initiatedBy': dict(by),
        'topModels': models5.most_common(8),
        'recent': [camp_row(c, mk) for c in recent], 'largest': [camp_row(c, mk) for c in big],
        'airbagInflator': len(inflator), 'airbagInflatorUnits': sum(c['units'] for c in inflator),
        'default': {'model': sorted(dmodels)[0] if dmodels else '', 'name': dname, 'year': dyear, 'rows': [camp_row(c, mk) for c in drows]},
    }

models = {}
for m in cat['models']:
    b = next(x for x in cat['brands'] if x['slug'] == m['brand'])
    mk = set(b['rcl']); md = set(m['rcl'])
    mine = [c for c in camps.values() if any(k[0] in mk and k[1] in md for k in c['veh'])]
    by_my = collections.Counter(); comps = collections.Counter(); units = 0; dnd = 0
    keep = []
    for c in mine:
        ys = set().union(*[v for k, v in c['veh'].items() if k[0] in mk and k[1] in md])
        ys = {y for y in ys if MY_FROM <= y <= 2027}
        if not ys:
            continue
        keep.append((c, ys))
        for y in ys:
            by_my[y] += 1
        for g in {group(x) for x in c['comp']}:
            comps[g] += 1
        units += c['units']; dnd += c['dnd']
    keep.sort(key=lambda t: (t[0]['date'], t[0]['id']), reverse=True)
    rows = []
    for c, ys in keep:
        r = camp_row(c, mk)
        r['years'] = years_txt(ys); r['ys'] = sorted(ys)
        rows.append(r)
    myears = list(range(MY_FROM, 2027))
    models[m['slug']] = {
        'name': m['name'], 'brand': m['brand'], 'variants': sorted(md),
        'byModelYear': {str(y): by_my.get(y, 0) for y in myears},
        'campaigns': len(keep), 'units': units, 'dnd': dnd,
        'worstYear': max(myears, key=lambda y: (by_my.get(y, 0), -y)),
        'cleanYears': [y for y in myears if by_my.get(y, 0) == 0],
        'components': comps.most_common(6), 'list': rows,
    }

# Conseils « ne pas conduire » / « garer dehors », toutes marques, depuis 2016
adv = sorted([c for c in camps.values() if (c['dnd'] or c['po']) and year_of(c) in YEARS], key=lambda c: (c['date'], c['id']), reverse=True)
adv_by_year = {str(y): {'dnd': 0, 'po': 0} for y in YEARS}
for c in adv:
    y = str(year_of(c)); adv_by_year[y]['dnd'] += c['dnd']; adv_by_year[y]['po'] += c['po']
# Airbags : campagnes dont un composant est « AIR BAGS » et dont le résumé parle d'inflateur
air = [c for c in camps.values() if any(x.upper().startswith('AIR BAGS') for x in c['comp']) and year_of(c) in YEARS]
air_inf = [c for c in air if re.search(r'(?i)inflator', c['desc'])]
air_by_year = {str(y): sum(1 for c in air_inf if year_of(c) == y) for y in YEARS}
# Caméras de recul (FMVSS 111) : composant « BACK OVER PREVENTION »
cam = [c for c in camps.values() if any(x.upper().startswith('BACK OVER PREVENTION') for x in c['comp']) and year_of(c) in YEARS]
comp_all = collections.Counter()
for c in camps.values():
    if year_of(c) in YEARS:
        for g in {group(x) for x in c['comp']}:
            comp_all[g] += 1

out = {
    'source': URL, 'fields': 'https://static.nhtsa.gov/odi/ffdd/rcl/RCL.txt',
    'retrieved_at': datetime.date.fromtimestamp(os.path.getmtime(zpath)).isoformat(), 'file_date': lastmod,
    'latestCampaignDate': max(c['date'] for c in camps.values()),
    'byYear': {str(y): all_by_year.get(y, 0) for y in YEARS},
    'unitsByYear': {str(y): sum(c['units'] for c in camps.values() if year_of(c) == y) for y in YEARS},
    'componentsAll': comp_all.most_common(12),
    'brands': brands, 'models': models,
    'advisories': {'byYear': adv_by_year, 'recent': [camp_row(c) for c in adv[:15]],
                   'dnd10': sum(1 for c in adv if c['dnd'] and year_of(c) <= 2025), 'po10': sum(1 for c in adv if c['po'] and year_of(c) <= 2025)},
    'airbags': {'campaigns': len(air), 'inflator': len(air_inf), 'inflatorByYear': air_by_year,
                'inflatorUnits': sum(c['units'] for c in air_inf),
                'recent': [camp_row(c) for c in sorted(air_inf, key=lambda c: c['date'], reverse=True)[:10]],
                'largest': [camp_row(c) for c in sorted(air_inf, key=lambda c: c['units'], reverse=True)[:5]]},
    'cameras': {'campaigns': len(cam), 'units': sum(c['units'] for c in cam),
                'byYear': {str(y): sum(1 for c in cam if year_of(c) == y) for y in YEARS}},
}
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=0, sort_keys=False)
print(f"recalls.json : {len(camps)} campagnes véhicule, dernière {out['latestCampaignDate']}, fichier du {lastmod}")
for s, b in brands.items():
    print(f"  {s:14} {b['campaigns10']:4} campagnes 2016-2025, pic {b['peakYear']}, 2026 : {b['byYear']['2026']['campaigns']}")
for s, m in models.items():
    print(f"  {s:16} {m['campaigns']:3} campagnes (AM {MY_FROM}+), pire AM {m['worstYear']}")

# Données compactes des mini-simulateurs (seul ce fichier part dans le JavaScript du navigateur).
mini = {
    'retrieved_at': out['retrieved_at'],
    'advisories': {y: {**v, 'all': all_by_year.get(int(y), 0)} for y, v in adv_by_year.items()},
    'airbags': {s: {'name': b['name'], 'n': b['airbagInflator'], 'units': b['airbagInflatorUnits'], 'all': b['campaigns10'] + b['byYear']['2026']['campaigns']} for s, b in brands.items()},
    'airbagsAll': {'n': len(air_inf), 'units': out['airbags']['inflatorUnits']},
}
json.dump(mini, open(os.path.join(os.path.dirname(OUT), 'minis.json'), 'w'), ensure_ascii=False)

# Date affichée sur le site (« Data updated on ») : celle du dernier relevé, jamais saisie à la main.
json.dump({'retrieved_at': out['retrieved_at'], 'file_date': lastmod}, open(os.path.join(os.path.dirname(OUT), 'meta.json'), 'w'))
