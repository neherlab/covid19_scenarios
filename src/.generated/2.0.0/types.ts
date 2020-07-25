export const schemaVer = '2.0.0'

// To parse this data:
//
//   import { Convert, AgeDistributionArray, AgeDistributionData, AgeDistributionDatum, AgeGroup, CaseCountsArray, CaseCountsData, CaseCountsDatum, DateRange, MitigationInterval, NumericRangeNonNegative, PercentageRange, ScenarioArray, ScenarioData, ScenarioDatum, ScenarioDatumEpidemiological, ScenarioDatumMitigation, ScenarioDatumPopulation, ScenarioDatumSimulation, SeverityDistributionArray, SeverityDistributionData, SeverityDistributionDatum, Shareable } from "./file";
//
//   const ageDistributionArray = Convert.toAgeDistributionArray(json);
//   const ageDistributionData = Convert.toAgeDistributionData(json);
//   const ageDistributionDatum = Convert.toAgeDistributionDatum(json);
//   const ageGroup = Convert.toAgeGroup(json);
//   const caseCountsArray = Convert.toCaseCountsArray(json);
//   const caseCountsData = Convert.toCaseCountsData(json);
//   const caseCountsDatum = Convert.toCaseCountsDatum(json);
//   const colorHex = Convert.toColorHex(json);
//   const dateRange = Convert.toDateRange(json);
//   const integer = Convert.toInteger(json);
//   const integerNonNegative = Convert.toIntegerNonNegative(json);
//   const integerPositive = Convert.toIntegerPositive(json);
//   const mitigationInterval = Convert.toMitigationInterval(json);
//   const numericRangeNonNegative = Convert.toNumericRangeNonNegative(json);
//   const percentage = Convert.toPercentage(json);
//   const percentageRange = Convert.toPercentageRange(json);
//   const scenarioArray = Convert.toScenarioArray(json);
//   const scenarioData = Convert.toScenarioData(json);
//   const scenarioDatum = Convert.toScenarioDatum(json);
//   const scenarioDatumEpidemiological = Convert.toScenarioDatumEpidemiological(json);
//   const scenarioDatumMitigation = Convert.toScenarioDatumMitigation(json);
//   const scenarioDatumPopulation = Convert.toScenarioDatumPopulation(json);
//   const scenarioDatumSimulation = Convert.toScenarioDatumSimulation(json);
//   const severityDistributionArray = Convert.toSeverityDistributionArray(json);
//   const severityDistributionData = Convert.toSeverityDistributionData(json);
//   const severityDistributionDatum = Convert.toSeverityDistributionDatum(json);
//   const shareable = Convert.toShareable(json);
//   const schemaVer = Convert.toSchemaVer(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AgeDistributionArray {
  all: AgeDistributionData[];
}

export interface AgeDistributionData {
  data: AgeDistributionDatum[];
  name: string;
}

export interface AgeDistributionDatum {
  ageGroup: AgeGroup;
  population: number;
}

export enum AgeGroup {
  The09 = "0-9",
  The1019 = "10-19",
  The2029 = "20-29",
  The3039 = "30-39",
  The4049 = "40-49",
  The5059 = "50-59",
  The6069 = "60-69",
  The7079 = "70-79",
  The80 = "80+",
}

export interface CaseCountsArray {
  all: CaseCountsData[];
}

export interface CaseCountsData {
  data: CaseCountsDatum[];
  name: string;
}

export interface CaseCountsDatum {
  cases: number | null;
  deaths?: number | null;
  hospitalized?: number | null;
  icu?: number | null;
  recovered?: number | null;
  time: Date;
}

export interface ScenarioArray {
  all: ScenarioData[];
}

export interface ScenarioData {
  data: ScenarioDatum;
  name: string;
}

export interface ScenarioDatum {
  epidemiological: ScenarioDatumEpidemiological;
  mitigation: ScenarioDatumMitigation;
  population: ScenarioDatumPopulation;
  simulation: ScenarioDatumSimulation;
}

export interface ScenarioDatumEpidemiological {
  hospitalStayDays: number;
  icuStayDays: number;
  infectiousPeriodDays: number;
  latencyDays: number;
  overflowSeverity: number;
  peakMonth: number;
  r0: NumericRangeNonNegative;
  seasonalForcing: number;
}

export interface NumericRangeNonNegative {
  begin: number;
  end: number;
}

export interface ScenarioDatumMitigation {
  mitigationIntervals: MitigationInterval[];
}

export interface MitigationInterval {
  color: string;
  name: string;
  timeRange: DateRange;
  transmissionReduction: PercentageRange;
}

export interface DateRange {
  begin: Date;
  end: Date;
}

export interface PercentageRange {
  begin: number;
  end: number;
}

export interface ScenarioDatumPopulation {
  ageDistributionName: string;
  caseCountsName: string;
  hospitalBeds: number;
  icuBeds: number;
  importsPerDay: number;
  initialNumberOfCases: number;
  populationServed: number;
}

export interface ScenarioDatumSimulation {
  numberStochasticRuns: number;
  simulationTimeRange: DateRange;
}

export interface SeverityDistributionArray {
  all: SeverityDistributionData[];
}

export interface SeverityDistributionData {
  data: SeverityDistributionDatum[];
  name: string;
}

export interface SeverityDistributionDatum {
  ageGroup: AgeGroup;
  confirmed: number;
  critical: number;
  fatal: number;
  isolated: number;
  severe: number;
}

export interface Shareable {
  ageDistributionData: AgeDistributionData;
  scenarioData: ScenarioData;
  schemaVer: '2.0.0';
  severityDistributionData: SeverityDistributionData;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toAgeDistributionArray(json: string): AgeDistributionArray {
    return cast(JSON.parse(json), r("AgeDistributionArray"));
  }

  public static ageDistributionArrayToJson(
    value: AgeDistributionArray
  ): string {
    return JSON.stringify(uncast(value, r("AgeDistributionArray")), null, 2);
  }

  public static toAgeDistributionData(json: string): AgeDistributionData {
    return cast(JSON.parse(json), r("AgeDistributionData"));
  }

  public static ageDistributionDataToJson(value: AgeDistributionData): string {
    return JSON.stringify(uncast(value, r("AgeDistributionData")), null, 2);
  }

  public static toAgeDistributionDatum(json: string): AgeDistributionDatum {
    return cast(JSON.parse(json), r("AgeDistributionDatum"));
  }

  public static ageDistributionDatumToJson(
    value: AgeDistributionDatum
  ): string {
    return JSON.stringify(uncast(value, r("AgeDistributionDatum")), null, 2);
  }

  public static toCaseCountsArray(json: string): CaseCountsArray {
    return cast(JSON.parse(json), r("CaseCountsArray"));
  }

  public static caseCountsArrayToJson(value: CaseCountsArray): string {
    return JSON.stringify(uncast(value, r("CaseCountsArray")), null, 2);
  }

  public static toCaseCountsData(json: string): CaseCountsData {
    return cast(JSON.parse(json), r("CaseCountsData"));
  }

  public static caseCountsDataToJson(value: CaseCountsData): string {
    return JSON.stringify(uncast(value, r("CaseCountsData")), null, 2);
  }

  public static toCaseCountsDatum(json: string): CaseCountsDatum {
    return cast(JSON.parse(json), r("CaseCountsDatum"));
  }

  public static caseCountsDatumToJson(value: CaseCountsDatum): string {
    return JSON.stringify(uncast(value, r("CaseCountsDatum")), null, 2);
  }

  public static toScenarioArray(json: string): ScenarioArray {
    return cast(JSON.parse(json), r("ScenarioArray"));
  }

  public static scenarioArrayToJson(value: ScenarioArray): string {
    return JSON.stringify(uncast(value, r("ScenarioArray")), null, 2);
  }

  public static toScenarioData(json: string): ScenarioData {
    return cast(JSON.parse(json), r("ScenarioData"));
  }

  public static scenarioDataToJson(value: ScenarioData): string {
    return JSON.stringify(uncast(value, r("ScenarioData")), null, 2);
  }

  public static toScenarioDatum(json: string): ScenarioDatum {
    return cast(JSON.parse(json), r("ScenarioDatum"));
  }

  public static scenarioDatumToJson(value: ScenarioDatum): string {
    return JSON.stringify(uncast(value, r("ScenarioDatum")), null, 2);
  }

  public static toScenarioDatumEpidemiological(
    json: string
  ): ScenarioDatumEpidemiological {
    return cast(JSON.parse(json), r("ScenarioDatumEpidemiological"));
  }

  public static scenarioDatumEpidemiologicalToJson(
    value: ScenarioDatumEpidemiological
  ): string {
    return JSON.stringify(
      uncast(value, r("ScenarioDatumEpidemiological")),
      null,
      2
    );
  }

  public static toNumericRangeNonNegative(
    json: string
  ): NumericRangeNonNegative {
    return cast(JSON.parse(json), r("NumericRangeNonNegative"));
  }

  public static numericRangeNonNegativeToJson(
    value: NumericRangeNonNegative
  ): string {
    return JSON.stringify(uncast(value, r("NumericRangeNonNegative")), null, 2);
  }

  public static toScenarioDatumMitigation(
    json: string
  ): ScenarioDatumMitigation {
    return cast(JSON.parse(json), r("ScenarioDatumMitigation"));
  }

  public static scenarioDatumMitigationToJson(
    value: ScenarioDatumMitigation
  ): string {
    return JSON.stringify(uncast(value, r("ScenarioDatumMitigation")), null, 2);
  }

  public static toMitigationInterval(json: string): MitigationInterval {
    return cast(JSON.parse(json), r("MitigationInterval"));
  }

  public static mitigationIntervalToJson(value: MitigationInterval): string {
    return JSON.stringify(uncast(value, r("MitigationInterval")), null, 2);
  }

  public static toDateRange(json: string): DateRange {
    return cast(JSON.parse(json), r("DateRange"));
  }

  public static dateRangeToJson(value: DateRange): string {
    return JSON.stringify(uncast(value, r("DateRange")), null, 2);
  }

  public static toPercentageRange(json: string): PercentageRange {
    return cast(JSON.parse(json), r("PercentageRange"));
  }

  public static percentageRangeToJson(value: PercentageRange): string {
    return JSON.stringify(uncast(value, r("PercentageRange")), null, 2);
  }

  public static toScenarioDatumPopulation(
    json: string
  ): ScenarioDatumPopulation {
    return cast(JSON.parse(json), r("ScenarioDatumPopulation"));
  }

  public static scenarioDatumPopulationToJson(
    value: ScenarioDatumPopulation
  ): string {
    return JSON.stringify(uncast(value, r("ScenarioDatumPopulation")), null, 2);
  }

  public static toScenarioDatumSimulation(
    json: string
  ): ScenarioDatumSimulation {
    return cast(JSON.parse(json), r("ScenarioDatumSimulation"));
  }

  public static scenarioDatumSimulationToJson(
    value: ScenarioDatumSimulation
  ): string {
    return JSON.stringify(uncast(value, r("ScenarioDatumSimulation")), null, 2);
  }

  public static toSeverityDistributionArray(
    json: string
  ): SeverityDistributionArray {
    return cast(JSON.parse(json), r("SeverityDistributionArray"));
  }

  public static severityDistributionArrayToJson(
    value: SeverityDistributionArray
  ): string {
    return JSON.stringify(
      uncast(value, r("SeverityDistributionArray")),
      null,
      2
    );
  }

  public static toSeverityDistributionData(
    json: string
  ): SeverityDistributionData {
    return cast(JSON.parse(json), r("SeverityDistributionData"));
  }

  public static severityDistributionDataToJson(
    value: SeverityDistributionData
  ): string {
    return JSON.stringify(
      uncast(value, r("SeverityDistributionData")),
      null,
      2
    );
  }

  public static toSeverityDistributionDatum(
    json: string
  ): SeverityDistributionDatum {
    return cast(JSON.parse(json), r("SeverityDistributionDatum"));
  }

  public static severityDistributionDatumToJson(
    value: SeverityDistributionDatum
  ): string {
    return JSON.stringify(
      uncast(value, r("SeverityDistributionDatum")),
      null,
      2
    );
  }

  public static toShareable(json: string): Shareable {
    return cast(JSON.parse(json), r("Shareable"));
  }

  public static shareableToJson(value: Shareable): string {
    return JSON.stringify(uncast(value, r("Shareable")), null, 2);
  }
}

function invalidValue(typ: any, val: any): never {
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue("array", val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue("Date", val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue("object", val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty("props")
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  AgeDistributionArray: o(
    [{ json: "all", js: "all", typ: a(r("AgeDistributionData")) }],
    false
  ),
  AgeDistributionData: o(
    [
      { json: "data", js: "data", typ: a(r("AgeDistributionDatum")) },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  AgeDistributionDatum: o(
    [
      { json: "ageGroup", js: "ageGroup", typ: r("AgeGroup") },
      { json: "population", js: "population", typ: 0 },
    ],
    false
  ),
  CaseCountsArray: o(
    [{ json: "all", js: "all", typ: a(r("CaseCountsData")) }],
    false
  ),
  CaseCountsData: o(
    [
      { json: "data", js: "data", typ: a(r("CaseCountsDatum")) },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  CaseCountsDatum: o(
    [
      { json: "cases", js: "cases", typ: u(0, null) },
      { json: "deaths", js: "deaths", typ: u(undefined, u(0, null)) },
      {
        json: "hospitalized",
        js: "hospitalized",
        typ: u(undefined, u(0, null)),
      },
      { json: "icu", js: "icu", typ: u(undefined, u(0, null)) },
      { json: "recovered", js: "recovered", typ: u(undefined, u(0, null)) },
      { json: "time", js: "time", typ: Date },
    ],
    false
  ),
  ScenarioArray: o(
    [{ json: "all", js: "all", typ: a(r("ScenarioData")) }],
    false
  ),
  ScenarioData: o(
    [
      { json: "data", js: "data", typ: r("ScenarioDatum") },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  ScenarioDatum: o(
    [
      {
        json: "epidemiological",
        js: "epidemiological",
        typ: r("ScenarioDatumEpidemiological"),
      },
      {
        json: "mitigation",
        js: "mitigation",
        typ: r("ScenarioDatumMitigation"),
      },
      {
        json: "population",
        js: "population",
        typ: r("ScenarioDatumPopulation"),
      },
      {
        json: "simulation",
        js: "simulation",
        typ: r("ScenarioDatumSimulation"),
      },
    ],
    false
  ),
  ScenarioDatumEpidemiological: o(
    [
      { json: "hospitalStayDays", js: "hospitalStayDays", typ: 3.14 },
      { json: "icuStayDays", js: "icuStayDays", typ: 3.14 },
      { json: "infectiousPeriodDays", js: "infectiousPeriodDays", typ: 3.14 },
      { json: "latencyDays", js: "latencyDays", typ: 3.14 },
      { json: "overflowSeverity", js: "overflowSeverity", typ: 3.14 },
      { json: "peakMonth", js: "peakMonth", typ: 0 },
      { json: "r0", js: "r0", typ: r("NumericRangeNonNegative") },
      { json: "seasonalForcing", js: "seasonalForcing", typ: 3.14 },
    ],
    false
  ),
  NumericRangeNonNegative: o(
    [
      { json: "begin", js: "begin", typ: 3.14 },
      { json: "end", js: "end", typ: 3.14 },
    ],
    false
  ),
  ScenarioDatumMitigation: o(
    [
      {
        json: "mitigationIntervals",
        js: "mitigationIntervals",
        typ: a(r("MitigationInterval")),
      },
    ],
    false
  ),
  MitigationInterval: o(
    [
      { json: "color", js: "color", typ: "" },
      { json: "name", js: "name", typ: "" },
      { json: "timeRange", js: "timeRange", typ: r("DateRange") },
      {
        json: "transmissionReduction",
        js: "transmissionReduction",
        typ: r("PercentageRange"),
      },
    ],
    false
  ),
  DateRange: o(
    [
      { json: "begin", js: "begin", typ: Date },
      { json: "end", js: "end", typ: Date },
    ],
    false
  ),
  PercentageRange: o(
    [
      { json: "begin", js: "begin", typ: 3.14 },
      { json: "end", js: "end", typ: 3.14 },
    ],
    false
  ),
  ScenarioDatumPopulation: o(
    [
      { json: "ageDistributionName", js: "ageDistributionName", typ: "" },
      { json: "caseCountsName", js: "caseCountsName", typ: "" },
      { json: "hospitalBeds", js: "hospitalBeds", typ: 0 },
      { json: "icuBeds", js: "icuBeds", typ: 0 },
      { json: "importsPerDay", js: "importsPerDay", typ: 3.14 },
      { json: "initialNumberOfCases", js: "initialNumberOfCases", typ: 0 },
      { json: "populationServed", js: "populationServed", typ: 0 },
    ],
    false
  ),
  ScenarioDatumSimulation: o(
    [
      { json: "numberStochasticRuns", js: "numberStochasticRuns", typ: 0 },
      {
        json: "simulationTimeRange",
        js: "simulationTimeRange",
        typ: r("DateRange"),
      },
    ],
    false
  ),
  SeverityDistributionArray: o(
    [{ json: "all", js: "all", typ: a(r("SeverityDistributionData")) }],
    false
  ),
  SeverityDistributionData: o(
    [
      { json: "data", js: "data", typ: a(r("SeverityDistributionDatum")) },
      { json: "name", js: "name", typ: "" },
    ],
    false
  ),
  SeverityDistributionDatum: o(
    [
      { json: "ageGroup", js: "ageGroup", typ: r("AgeGroup") },
      { json: "confirmed", js: "confirmed", typ: 3.14 },
      { json: "critical", js: "critical", typ: 3.14 },
      { json: "fatal", js: "fatal", typ: 3.14 },
      { json: "isolated", js: "isolated", typ: 3.14 },
      { json: "severe", js: "severe", typ: 3.14 },
    ],
    false
  ),
  Shareable: o(
    [
      {
        json: "ageDistributionData",
        js: "ageDistributionData",
        typ: r("AgeDistributionData"),
      },
      { json: "scenarioData", js: "scenarioData", typ: r("ScenarioData") },
      { json: "schemaVer", js: "schemaVer", typ: "" },
      {
        json: "severityDistributionData",
        js: "severityDistributionData",
        typ: r("SeverityDistributionData"),
      },
    ],
    false
  ),
  AgeGroup: [
    "0-9",
    "10-19",
    "20-29",
    "30-39",
    "40-49",
    "50-59",
    "60-69",
    "70-79",
    "80+",
  ],
};
