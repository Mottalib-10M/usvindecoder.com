/**
 * Appels directs du navigateur vers les API fédérales (aucun serveur intermédiaire, aucune clé).
 * Les fonctions `parse*` sont pures et testées sur des réponses réelles mises en cache
 * (tests/fixtures/). Les fonctions `fetch*` ne servent qu'après une action du visiteur.
 */
/** Hôtes des API (les chemins s'ajoutent à l'appel ; la racine seule n'est pas une page). */
const HOSTS = { vpic: 'vpic.nhtsa.dot.gov', nhtsa: 'api.nhtsa.gov', epa: 'www.fueleconomy.gov' };
export const VPIC = `https://${HOSTS.vpic}/api/vehicles`;
export const NHTSA = `https://${HOSTS.nhtsa}`;
export const EPA = `https://${HOSTS.epa}/ws/rest`;

type Raw = Record<string, unknown>;
const s = (v: unknown) => {
  const t = typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
  return t === 'Not Applicable' || t === 'null' ? '' : t;
};
const titleCase = (t: string) => (t && t === t.toUpperCase() && t.length > 3 ? t.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase()) : t);

export interface VehicleFacts {
  vin: string; year: string; make: string; model: string; trim: string; series: string; body: string; type: string;
  drive: string; engine: string; cylinders: string; displacementL: string; hp: string; fuel: string; fuel2: string;
  electrification: string; batteryKwh: string; transmission: string; doors: string; seats: string; gvwr: string;
  plant: string; manufacturer: string; basePrice: string; motorcycle: string;
  safety: Array<[string, string]>;
  errorCode: string; errorText: string; clean: boolean; partial: boolean;
}

export function parseVpic(json: unknown): VehicleFacts | null {
  const r = ((json as Raw)?.Results as Raw[] | undefined)?.[0];
  if (!r) return null;
  const engineParts = [s(r.EngineCylinders) && `${s(r.EngineCylinders)} cyl`, s(r.DisplacementL) && `${Number(s(r.DisplacementL)).toFixed(1)} L`, s(r.EngineConfiguration), s(r.Turbo) === 'Yes' ? 'turbo' : '', s(r.EngineModel)].filter(Boolean);
  const plant = [titleCase(s(r.PlantCity)), titleCase(s(r.PlantState)), titleCase(s(r.PlantCountry).replace(/\s*\(USA\)/, ''))].filter(Boolean).join(', ');
  const tr = [s(r.TransmissionStyle), s(r.TransmissionSpeeds) && `${s(r.TransmissionSpeeds)}-speed`].filter(Boolean).join(', ');
  const safetyKeys: Array<[string, string]> = [
    ['AirBagLocFront', 'Front air bags'], ['AirBagLocSide', 'Side air bags'], ['AirBagLocCurtain', 'Curtain air bags'], ['AirBagLocKnee', 'Knee air bags'],
    ['ABS', 'Anti-lock brakes'], ['ESC', 'Electronic stability control'], ['TPMS', 'Tire pressure monitoring'], ['TractionControl', 'Traction control'],
    ['ForwardCollisionWarning', 'Forward collision warning'], ['CIB', 'Automatic emergency braking'], ['PedestrianAutomaticEmergencyBraking', 'Pedestrian emergency braking'],
    ['LaneDepartureWarning', 'Lane departure warning'], ['LaneKeepSystem', 'Lane keeping assist'], ['BlindSpotMon', 'Blind spot warning'],
    ['RearVisibilitySystem', 'Backup camera'], ['AdaptiveCruiseControl', 'Adaptive cruise control'], ['DaytimeRunningLight', 'Daytime running lights'],
  ];
  const safety = safetyKeys.map(([k, l]) => [l, s(r[k])] as [string, string]).filter(([, v]) => v);
  const code = s(r.ErrorCode);
  const codes = code.split(',').map((x) => x.trim());
  const moto = [s(r.CustomMotorcycleType), s(r.MotorcycleChassisType), s(r.MotorcycleSuspensionType)].filter(Boolean).join(', ');
  return {
    vin: s(r.VIN), year: s(r.ModelYear), make: titleCase(s(r.Make)), model: s(r.Model), trim: s(r.Trim), series: s(r.Series),
    body: s(r.BodyClass), type: titleCase(s(r.VehicleType)), drive: s(r.DriveType), engine: engineParts.join(', '),
    cylinders: s(r.EngineCylinders), displacementL: s(r.DisplacementL), hp: s(r.EngineHP), fuel: s(r.FuelTypePrimary), fuel2: s(r.FuelTypeSecondary),
    electrification: s(r.ElectrificationLevel), batteryKwh: s(r.BatteryKWh), transmission: tr, doors: s(r.Doors), seats: s(r.Seats),
    gvwr: s(r.GVWR), plant, manufacturer: titleCase(s(r.Manufacturer)), basePrice: s(r.BasePrice), motorcycle: moto, safety,
    errorCode: code, errorText: s(r.ErrorText), clean: codes.includes('0'), partial: codes.includes('6'),
  };
}

export interface RecallRow { id: string; date: string; component: string; summary: string; consequence: string; remedy: string; parkIt: boolean; parkOutside: boolean; ota: boolean }
/** « 06/03/2019 » (mois/jour/année) -> « 2019-06-03 ». */
export function usDate(d: string): string {
  const m = (d || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[1]}-${m[2]}` : d || '';
}
export function parseRecalls(json: unknown): RecallRow[] {
  const rs = ((json as Raw)?.results as Raw[] | undefined) ?? [];
  const seen = new Set<string>();
  const rows: RecallRow[] = [];
  for (const r of rs) {
    const id = s(r.NHTSACampaignNumber);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    rows.push({ id, date: usDate(s(r.ReportReceivedDate)), component: s(r.Component), summary: s(r.Summary), consequence: s(r.Consequence), remedy: s(r.Remedy), parkIt: r.parkIt === true, parkOutside: r.parkOutSide === true, ota: r.overTheAirUpdate === true });
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export interface Rating { id: number; desc: string; overall: number | null; front: number | null; side: number | null; rollover: number | null; rollRisk: number | null; complaints: number | null; recalls: number | null; investigations: number | null }
const star = (v: unknown) => { const n = parseInt(s(v), 10); return Number.isFinite(n) ? n : null; };
export function parseRating(json: unknown): Rating | null {
  const r = ((json as Raw)?.Results as Raw[] | undefined)?.[0];
  if (!r) return null;
  const n = (v: unknown) => (typeof v === 'number' ? v : v == null || v === '' ? null : Number(v));
  return { id: Number(r.VehicleId), desc: s(r.VehicleDescription), overall: star(r.OverallRating), front: star(r.OverallFrontCrashRating), side: star(r.OverallSideCrashRating), rollover: star(r.RolloverRating), rollRisk: n(r.RolloverPossibility), complaints: n(r.ComplaintsCount), recalls: n(r.RecallsCount), investigations: n(r.InvestigationCount) };
}

export interface EpaVehicle { id: string; year: string; make: string; model: string; trany: string; drive: string; fuel: string; city: number; hwy: number; comb: number; combE: number; cost: number; youSaveSpend: number; co2: number; ghg: number; fe: number; smog: number; range: number; kind: 'ev' | 'phev' | 'gas' }
function smogOf(r: Raw): number {
  const info = (r.emissionsList as Raw | undefined)?.emissionsInfo;
  const list = (Array.isArray(info) ? info : info ? [info] : []) as Raw[];
  const scores = list.map((x) => Number(x.score)).filter((x) => x > 0);
  return scores.length ? Math.min(...scores) : 0;
}
export function parseEpaVehicle(j: unknown): EpaVehicle | null {
  const r = j as Raw; if (!r || !r.id) return null;
  const num = (v: unknown) => { const x = Number(v); return Number.isFinite(x) ? x : 0; };
  const fuel1 = s(r.fuelType1); const fuel2 = s(r.fuelType2);
  return {
    id: s(r.id), year: s(r.year), make: s(r.make), model: s(r.model), trany: s(r.trany), drive: s(r.drive), fuel: fuel1,
    city: num(r.city08), hwy: num(r.highway08), comb: num(r.comb08), combE: num(r.combE), cost: num(r.fuelCost08), youSaveSpend: num(r.youSaveSpend),
    co2: num(r.co2TailpipeGpm), ghg: num(r.ghgScore), fe: num(r.feScore), smog: smogOf(r), range: num(r.range),
    kind: fuel1 === 'Electricity' ? 'ev' : fuel2 === 'Electricity' ? 'phev' : 'gas',
  };
}
export function parseMenu(j: unknown): Array<{ text: string; value: string }> {
  const m = (j as Raw)?.menuItem;
  if (!m) return [];
  return (Array.isArray(m) ? m : [m]).map((x) => ({ text: s((x as Raw).text), value: s((x as Raw).value) }));
}

async function getJson(url: string, epa = false): Promise<unknown> {
  // Requêtes « simples » (GET sans en-tête personnalisé) : aucune pré-vérification CORS, aucune
  // donnée envoyée hors de l'adresse. L'EPA demande Accept: application/json, accepté sans préflight.
  const res = await fetch(url, epa ? { headers: { Accept: 'application/json' } } : undefined);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
const q = encodeURIComponent;
export const fetchVpic = async (vin: string) => parseVpic(await getJson(`${VPIC}/DecodeVinValuesExtended/${q(vin)}?format=json`));
export const fetchRecalls = async (make: string, model: string, year: string | number) => parseRecalls(await getJson(`${NHTSA}/recalls/recallsByVehicle?make=${q(make)}&model=${q(model)}&modelYear=${q(String(year))}`));
export async function fetchRecallList(kind: 'modelYears' | 'makes' | 'models', year?: string, make?: string): Promise<string[]> {
  const p = kind === 'modelYears' ? '' : kind === 'makes' ? `&modelYear=${q(year!)}` : `&modelYear=${q(year!)}&make=${q(make!)}`;
  const j = (await getJson(`${NHTSA}/products/vehicle/${kind}?issueType=r${p}`)) as Raw;
  const rs = (j.results as Raw[]) ?? [];
  const key = kind === 'modelYears' ? 'modelYear' : kind === 'makes' ? 'make' : 'model';
  return [...new Set(rs.map((r) => s(r[key])).filter(Boolean))].sort((a, b) => (kind === 'modelYears' ? Number(b) - Number(a) : a.localeCompare(b)));
}
export async function fetchNcapList(year: string, make?: string, model?: string): Promise<Array<{ label: string; id?: number }>> {
  const path = model ? `/modelyear/${q(year)}/make/${q(make!)}/model/${q(model)}` : make ? `/modelyear/${q(year)}/make/${q(make)}` : `/modelyear/${q(year)}`;
  const j = (await getJson(`${NHTSA}/SafetyRatings${path}?format=json`)) as Raw;
  const rs = (j.Results as Raw[]) ?? [];
  if (model) return rs.map((r) => ({ label: s(r.VehicleDescription), id: Number(r.VehicleId) }));
  return [...new Set(rs.map((r) => s(make ? r.Model : r.Make)).filter(Boolean))].sort().map((label) => ({ label }));
}
export const fetchRating = async (id: number) => parseRating(await getJson(`${NHTSA}/SafetyRatings/VehicleId/${id}?format=json`));
export const fetchEpaMenu = async (what: 'year' | 'make' | 'model' | 'options', year?: string, make?: string, model?: string) =>
  parseMenu(await getJson(`${EPA}/vehicle/menu/${what}${what === 'year' ? '' : `?year=${q(year!)}${make ? `&make=${q(make)}` : ''}${model ? `&model=${q(model)}` : ''}`}`, true));
export const fetchEpaVehicle = async (id: string) => parseEpaVehicle(await getJson(`${EPA}/vehicle/${q(id)}`, true));
