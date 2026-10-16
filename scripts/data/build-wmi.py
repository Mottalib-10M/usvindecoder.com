#!/usr/bin/env python3
"""Table WMI (3 premiers caractères du VIN) : API NHTSA vPIC -> src/data/gen/wmi.json.

Sert au décodage instantané dans le navigateur, avant même la réponse de vPIC : constructeur,
marque, type de véhicule et pays d'assemblage déclarés par le constructeur à la NHTSA
(49 CFR Part 565). API : https://vpic.nhtsa.dot.gov/api/ (GetWMIsForManufacturer, DecodeWMI).

Rejouable : python3 scripts/data/build-wmi.py [--offline]
"""
import datetime, json, os, re, sys, time, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(os.path.dirname(HERE))
CACHE = os.path.join(HERE, 'cache', 'wmi')
OUT = os.path.join(SITE, 'src', 'data', 'gen', 'wmi.json')
API = 'https://vpic.nhtsa.dot.gov/api/vehicles'
os.makedirs(CACHE, exist_ok=True)
offline = '--offline' in sys.argv
# Recherche par nom de constructeur (sous-chaîne, côté vPIC). Les grands groupes vendus aux États-Unis,
# voitures, camionnettes et motos ; un WMI à 6 caractères (petit constructeur, « 9 » en 3e position) est écarté.
QUERIES = ['ford motor', 'general motors', 'toyota', 'honda', 'nissan', 'fca us', 'chrysler', 'stellantis', 'hyundai',
           'kia', 'subaru', 'tesla', 'bmw', 'mercedes-benz', 'daimler', 'volkswagen', 'audi', 'porsche', 'mazda',
           'mitsubishi', 'volvo', 'jaguar', 'land rover', 'rivian', 'lucid', 'polestar', 'genesis', 'mini', 'fiat',
           'alfa romeo', 'maserati', 'ferrari', 'lamborghini', 'bentley', 'rolls-royce', 'aston martin', 'mclaren',
           'harley-davidson', 'yamaha', 'kawasaki', 'suzuki', 'ducati', 'triumph', 'ktm', 'polaris', 'indian motorcycle',
           'can-am', 'bombardier', 'scout motors', 'vinfast', 'isuzu', 'navistar', 'freightliner', 'paccar', 'mack']
TYPES = {'Passenger Car', 'Multipurpose Passenger Vehicle (MPV)', 'Truck', 'Motorcycle', 'Low Speed Vehicle (LSV)', 'Incomplete Vehicle', 'Bus', 'Off Road Vehicle'}

def get(path):
    f = os.path.join(CACHE, urllib.parse.quote(path, safe='') + '.json')
    if offline and os.path.exists(f):
        return json.load(open(f))
    for i in range(4):
        try:
            req = urllib.request.Request(API + path, headers={'User-Agent': 'usvindecoder-build/1.0 (+https://usvindecoder.com)'})
            with urllib.request.urlopen(req, timeout=60) as r:
                d = json.load(r)
            json.dump(d, open(f, 'w')); time.sleep(0.1)
            return d
        except Exception as e:
            err = e; time.sleep(1.5 * (i + 1))
    if os.path.exists(f):
        return json.load(open(f))
    raise err

seen = {}
for q in QUERIES:
    for r in get(f'/GetWMIsForManufacturer/{urllib.parse.quote(q)}?format=json').get('Results', []):
        w = (r.get('WMI') or '').strip().upper()
        if len(w) == 3 and r.get('VehicleType') in TYPES:
            seen.setdefault(w, r)
SHORT = {'Passenger Car': 'car', 'Multipurpose Passenger Vehicle (MPV)': 'mpv', 'Truck': 'truck', 'Motorcycle': 'motorcycle', 'Low Speed Vehicle (LSV)': 'lsv', 'Incomplete Vehicle': 'incomplete', 'Bus': 'bus', 'Off Road Vehicle': 'offroad'}
table = {}
for w in sorted(seen):
    res = get(f'/DecodeWMI/{w}?format=json').get('Results', [])
    if not res:
        continue
    x = res[0]
    make = (x.get('CommonName') or x.get('Make') or '').strip()
    ACR = {'BMW', 'GMC', 'KTM', 'FCA', 'MINI', 'BYD', 'USA'}
    def nice(t):
        return ' '.join(p if p.upper() in ACR else (p.title() if p.isupper() else p) for p in t.split())
    country = re.sub(r'\s*\(.*?\)', '', seen[w].get('Country') or '').strip()
    table[w] = {'make': nice(make), 'type': SHORT.get(x.get('VehicleType', ''), x.get('VehicleType', '')), 'country': nice(country)}
json.dump({'source': 'https://vpic.nhtsa.dot.gov/api/', 'retrieved_at': datetime.date.today().isoformat(), 'wmi': table}, open(OUT, 'w'), ensure_ascii=False, indent=0, sort_keys=True)
print(f'wmi.json : {len(table)} WMI')
