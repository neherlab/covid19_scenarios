import type { LineProps as RechartsLineProps } from 'recharts'
import type { TFunction } from 'i18next'

export interface LineProps {
  key: string
  name: string
  color: string
  legendType?: RechartsLineProps['legendType']
}

export const DATA_POINTS = {
  /* Computed */
  Exposed: 'exposed',
  Susceptible: 'susceptible',
  Infectious: 'infectious',
  Severe: 'severe',
  Critical: 'critical',
  Overflow: 'overflow',
  Recovered: 'recovered',
  Fatalities: 'fatality',
  WeeklyFatalities: 'weeklyFatality',
  CumulativeCases: 'cumulativeCases',
  NewCases: 'newCases',
  HospitalBeds: 'hospitalBeds',
  ICUbeds: 'ICUbeds',
  /* Observed */
  ObservedDeaths: 'observedDeaths',
  ObservedCases: 'cases',
  ObservedHospitalized: 'currentHospitalized',
  ObservedICU: 'ICU',
  ObservedNewCases: 'newCases',
  ObservedWeeklyDeaths: 'weeklyDeaths',
}

/* eslint-disable i18next/no-literal-string */
export const defaultEnabledPlots = [
  /* Computed */
  'susceptible',
  'infectious',
  'severe',
  'recovered',
  'weeklyFatality',
  'hospitalBeds',
  'ICUbeds',
  /* Observed */
  'cases',
  'currentHospitalized',
  'ICU',
  'newCases',
  'weeklyDeaths',
]
/* eslint-enablee i18next/no-literal-string */

export const colors = {
  [DATA_POINTS.Susceptible]: '#a6cee3',
  [DATA_POINTS.Infectious]: '#fdbf6f',
  [DATA_POINTS.Severe]: '#fb9a99',
  [DATA_POINTS.Critical]: '#e31a1c',
  [DATA_POINTS.Overflow]: '#900d2c',
  [DATA_POINTS.Recovered]: '#33a02c',
  [DATA_POINTS.Fatalities]: '#5e506a',
  [DATA_POINTS.WeeklyFatalities]: '#9e90Aa',
  [DATA_POINTS.CumulativeCases]: '#aaaaaa',
  [DATA_POINTS.NewCases]: '#e89f55',
  [DATA_POINTS.HospitalBeds]: '#bbbbbb',
  [DATA_POINTS.ICUbeds]: '#cccccc',
}

export function getLinesToPlot(t: TFunction): LineProps[] {
  return [
    { key: DATA_POINTS.Susceptible, color: colors.susceptible, name: t('Susceptible'), legendType: 'line' },
    { key: DATA_POINTS.Recovered, color: colors.recovered, name: t('Recovered'), legendType: 'line' },
    { key: DATA_POINTS.Infectious, color: colors.infectious, name: t('Infectious'), legendType: 'line' },
    { key: DATA_POINTS.Severe, color: colors.severe, name: t('Severely ill'), legendType: 'line' },
    { key: DATA_POINTS.Critical, color: colors.critical, name: t('Patients in ICU (model)'), legendType: 'line' },
    { key: DATA_POINTS.Overflow, color: colors.overflow, name: t('ICU overflow'), legendType: 'line' },
    { key: DATA_POINTS.Fatalities, color: colors.fatality, name: t('Cumulative deaths (model)'), legendType: 'line' },
    { key: DATA_POINTS.WeeklyFatalities, color: colors.weeklyFatality, name: t('Weekly deaths (model)'), legendType: 'line' }, // prettier-ignore
    { key: DATA_POINTS.HospitalBeds, color: colors.hospitalBeds, name: t('Total hospital beds'), legendType: 'none' },
    { key: DATA_POINTS.ICUbeds, color: colors.ICUbeds, name: t('Total ICU/ICM beds'), legendType: 'none' },
  ]
}

export function getAreasToPlot(t: TFunction): LineProps[] {
  return [
    {
      key: `${DATA_POINTS.Susceptible}Area`,
      color: colors.susceptible,
      name: t('Susceptible uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Infectious}Area`,
      color: colors.infectious,
      name: t('Infectious uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Severe}Area`,
      color: colors.severe,
      name: t('Severely ill uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Critical}Area`,
      color: colors.critical,
      name: t('Patients in ICU (model) uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Overflow}Area`,
      color: colors.overflow,
      name: t('ICU overflow uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Recovered}Area`,
      color: colors.recovered,
      name: t('Recovered uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.Fatalities}Area`,
      color: colors.fatality,
      name: t('Cumulative deaths (model) uncertainty'),
      legendType: 'none',
    },
    {
      key: `${DATA_POINTS.WeeklyFatalities}Area`,
      color: colors.weeklyFatality,
      name: t('Weekly deaths (model) uncertainty'),
      legendType: 'none',
    },
  ]
}

export function observationsToPlot(t: TFunction): LineProps[] {
  return [
    { key: DATA_POINTS.ObservedCases, color: colors.cumulativeCases, name: t('Cumulative cases (data)') },
    { key: DATA_POINTS.ObservedNewCases, color: colors.newCases, name: t('Weekly cases (data)') },
    { key: DATA_POINTS.ObservedHospitalized, color: colors.severe, name: t('Patients in hospital (data)') },
    { key: DATA_POINTS.ObservedICU, color: colors.critical, name: t('Patients in ICU (data)') },
    { key: DATA_POINTS.ObservedDeaths, color: colors.fatality, name: t('Cumulative deaths (data)') },
    { key: DATA_POINTS.ObservedWeeklyDeaths, color: colors.weeklyFatality, name: t('Weekly deaths (data)') },
  ]
}
