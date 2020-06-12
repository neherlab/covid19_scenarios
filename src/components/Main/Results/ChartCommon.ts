import { LineProps as RechartsLineProps } from 'recharts'
import { TFunction } from 'i18next'

export interface LineProps extends RechartsLineProps {
  dataKey: string
  name: string
  enabled: boolean
}

// export const DATA_POINTS = {
//   /* Computed */
//   Exposed: 'exposed',
//   Susceptible: 'susceptible',
//   Infectious: 'infectious',
//   Severe: 'severe',
//   Critical: 'critical',
//   Overflow: 'overflow',
//   Recovered: 'recovered',
//   Fatalities: 'fatality',
//   WeeklyFatalities: 'weeklyFatality',
//   CumulativeCases: 'cumulativeCases',
//   NewCases: 'newCases',
//   HospitalBeds: 'hospitalBeds',
//   icuBeds: 'icuBeds',
//   /* Observed */
//   ObservedDeaths: 'observedDeaths',
//   ObservedCases: 'cases',
//   ObservedHospitalized: 'currentHospitalized',
//   ObservedICU: 'icu',
//   ObservedNewCases: 'newCases',
//   ObservedWeeklyDeaths: 'weeklyDeaths',
// }

// export const defaultEnabledPlots = [
//   /* Computed */
//   'susceptible',
//   'infectious',
//   'severe',
//   'recovered',
//   'weeklyFatality',
//   'hospitalBeds',
//   'icuBeds',
//   /* Observed */
//   'cases',
//   'currentHospitalized',
//   'icu',
//   'newCases',
//   'weeklyDeaths',
// ]

export enum CategoryColor {
  susceptible = '#a6cee3',
  infectious = '#fdbf6f',
  severe = '#fb9a99',
  critical = '#e31a1c',
  overflow = '#900d2c',
  recovered = '#33a02c',
  fatality = '#5e506a',
  weeklyFatality = '#6e607a',
  observedCasesCumulative = '#aaaaaa',
  observedCasesNew = '#edaf5f',
  hospitalBeds = '#bbbbbb',
  icuBeds = '#cccccc',
}

// prettier-ignore
export const constantsMetaDefault : LineProps[] = [
  { dataKey: 'hospitalBeds',   enabled: true,  color: CategoryColor.hospitalBeds,   name: 'Total hospital beds',       legendType: 'none' },
  { dataKey: 'icuBeds',        enabled: true,  color: CategoryColor.icuBeds,        name: 'Total ICU/ICM beds',        legendType: 'none' },
]

// prettier-ignore
export const linesMetaDefault: LineProps[] = [
  { dataKey: 'susceptible',    enabled: true,  color: CategoryColor.susceptible,    name: 'Susceptible',               legendType: 'line' },
  { dataKey: 'recovered',      enabled: true,  color: CategoryColor.recovered,      name: 'Recovered',                 legendType: 'line' },
  { dataKey: 'infectious',     enabled: true,  color: CategoryColor.infectious,     name: 'Infectious',                legendType: 'line' },
  { dataKey: 'severe',         enabled: true,  color: CategoryColor.severe,         name: 'Severely ill',              legendType: 'line' },
  { dataKey: 'critical',       enabled: true,  color: CategoryColor.critical,       name: 'Patients in ICU (model)',   legendType: 'line' },
  { dataKey: 'overflow',       enabled: true,  color: CategoryColor.overflow,       name: 'ICU overflow',              legendType: 'line' },
  { dataKey: 'fatality',       enabled: true,  color: CategoryColor.fatality,       name: 'Cumulative deaths (model)', legendType: 'line' },
  { dataKey: 'weeklyFatality', enabled: true,  color: CategoryColor.weeklyFatality, name: 'Weekly deaths (model)',     legendType: 'line' },
]

// prettier-ignore
export const casesMetaDefault: LineProps[] = [
  { dataKey: 'observedCasesCumulative',    enabled: true,  color: CategoryColor.observedCasesCumulative, name: 'Cumulative cases (data)'     },
  { dataKey: 'observedCasesNew',           enabled: true,  color: CategoryColor.observedCasesNew,        name: `Weekly cases (data)`         },
  { dataKey: 'observedSevere',             enabled: true,  color: CategoryColor.severe,                  name: 'Patients in hospital (data)' },
  { dataKey: 'observedIcu',                enabled: true,  color: CategoryColor.critical,                name: 'Patients in ICU (data)'      },
  { dataKey: 'observedFatalityCumulative', enabled: true,  color: CategoryColor.fatality,                name: 'Cumulative deaths (data)'    },
  { dataKey: 'observedFatalitynew',        enabled: true,  color: CategoryColor.weeklyFatality,          name: 'Weekly deaths (data)'        },
]

export function translatePlots(t: TFunction, lines: LineProps[]) {
  return lines.map((line) => {
    return { ...line, name: t(line.name) }
  })
}
