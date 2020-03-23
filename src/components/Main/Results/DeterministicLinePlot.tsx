import React, { useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { CartesianGrid, Legend, Line, ComposedChart, Scatter, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts'
import type { LineProps as RechartsLineProps, YAxisProps } from 'recharts'

import { useTranslation } from 'react-i18next'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { EmpiricalData } from '../../../algorithms/types/Param.types'

import './DeterministicLinePlot.scss'

const ASPECT_RATIO = 16 / 9

const DATA_POINTS = {
  /* Computed */
  Exposed: 'exposed',
  Susceptible: 'susceptible',
  Infectious: 'infectious',
  Severe: 'hospitalized',
  Critical: 'critical',
  Overflow: 'overflow',
  Recovered: 'recovered',
  Death: 'death',
  CumulativeCases: 'cumulativeCases',
  NewCases: 'newCases',
  HospitalBeds: 'hospitalBeds',
  ICUbeds: 'ICUbeds',
  /* Observed */
  ObservedDeaths: 'observedDeaths',
  ObservedCases: 'cases',
  ObservedHospitalized: 'currentHospitalized',
  ObservedICU: 'ICU',
  ObservedNewCases: 'newCases'
}

export const colors = {
  [DATA_POINTS.Susceptible]: '#a6cee3',
  [DATA_POINTS.Infectious]: '#fdbf6f',
  [DATA_POINTS.Severe]: '#fb9a99',
  [DATA_POINTS.Critical]: '#e31a1c',
  [DATA_POINTS.Overflow]: '#660033',
  [DATA_POINTS.Recovered]: '#33a02c',
  [DATA_POINTS.Death]: '#cab2d6',
  [DATA_POINTS.CumulativeCases]: '#aaaaaa',
  [DATA_POINTS.NewCases]: '#fdbf6f',
  [DATA_POINTS.HospitalBeds]: '#bbbbbb',
  [DATA_POINTS.ICUbeds]: '#cccccc',
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  logScale?: boolean
  caseCounts?: EmpiricalData
}

interface LineProps {
  key: string
  name: string
  color: string
  legendType?: RechartsLineProps['legendType']
}

function xTickFormatter(tick: string | number): string {
  return new Date(tick).toISOString().slice(0, 10)
}

function tooltipFormatter(
  value: string | number | Array<string | number>,
  name: string,
  entry: TooltipPayload,
  index: number,
): React.ReactNode {
  if (name !== 'time') {
    return value
  }

  // FIXME: is this correct?
  return undefined
}

function labelFormatter(value: string | number): React.ReactNode {
  return xTickFormatter(value)
}

function legendFormatter(enabledPlots: string[], value: string, entry: any)
{
  const activeClassName = enabledPlots.indexOf(entry.dataKey) !== -1 ? "legend" : "legend-inactive";
  return <span className={activeClassName}>{value}</span>;
}

export function DeterministicLinePlot({ data, userResult, logScale, caseCounts }: LinePlotProps) {
  const { t } = useTranslation()

  const [ enabledPlots, setEnabledPlots ] = useState(Object.values(DATA_POINTS));

  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochasticTrajectories.length > 0) {
    return null
  }

  const hasUserResult = Boolean(userResult?.trajectory)
  const nHospitalBeds = data.params.hospitalBeds
  const nICUBeds = data.params.ICUBeds

  const count_observations = {
    cases: caseCounts?.filter((d) => d.cases).length ?? 0,
    ICU: caseCounts?.filter((d) => d.ICU).length ?? 0,
    observedDeaths: caseCounts?.filter((d) => d.deaths).length ?? 0,
    newCases: caseCounts?.filter((d, i) => i > 2 && d.cases && caseCounts[i - 3].cases).length ?? 0,
    hospitalized: caseCounts?.filter((d) => d.hospitalized).length ?? 0,
  }

  const observations =
    caseCounts?.map((d, i) => ({
      time: new Date(d.time).getTime(),
      cases: enabledPlots.indexOf(DATA_POINTS.ObservedCases) !== -1 ? d.cases || undefined : undefined,
      observedDeaths: enabledPlots.indexOf(DATA_POINTS.ObservedDeaths) !== -1 ?  d.deaths || undefined : undefined,
      currentHospitalized: enabledPlots.indexOf(DATA_POINTS.ObservedHospitalized) !== -1 ? d.hospitalized || undefined : undefined,
      ICU: enabledPlots.indexOf(DATA_POINTS.ObservedICU) !== -1 ? d.ICU || undefined : undefined,
      newCases: enabledPlots.indexOf(DATA_POINTS.ObservedNewCases) !== -1 ?  i > 2 ? d.cases - caseCounts[i - 3].cases || undefined : undefined : undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,
    })) ?? []

  const plotData = [
    ...data.deterministicTrajectory
      .filter((d, i) => i % 4 === 0)
      .map((x) => ({
        time: x.time,
        susceptible: enabledPlots.indexOf(DATA_POINTS.Susceptible) !== -1 ? Math.round(x.susceptible.total) || undefined : undefined,
        // exposed: Math.round(x.exposed.total) || undefined,
        infectious: enabledPlots.indexOf(DATA_POINTS.Infectious) !== -1 ? Math.round(x.infectious.total) || undefined : undefined,
        hospitalized: enabledPlots.indexOf(DATA_POINTS.Severe) !== -1 ? Math.round(x.hospitalized.total) || undefined : undefined,
        critical: enabledPlots.indexOf(DATA_POINTS.Critical) !== -1 ? Math.round(x.critical.total) || undefined : undefined,
        overflow: enabledPlots.indexOf(DATA_POINTS.Overflow) !== -1 ? Math.round(x.overflow.total) || undefined : undefined,
        recovered: enabledPlots.indexOf(DATA_POINTS.Recovered) !== -1 ? Math.round(x.recovered.total) || undefined : undefined,
        death: enabledPlots.indexOf(DATA_POINTS.Death) !== -1 ? Math.round(x.dead.total) || undefined : undefined,
        hospitalBeds: nHospitalBeds,
        ICUbeds: nICUBeds,
      })),
    ...observations,
  ] //.filter((d) => {return d.time >= tMin && d.time <= tMax}))

  const linesToPlot: LineProps[] = [
    { key: DATA_POINTS.HospitalBeds, color: colors.hospitalBeds, name: t('Total hospital beds'), legendType: 'none' },
    { key: DATA_POINTS.ICUbeds, color: colors.ICUbeds, name: t('Total ICU/ICM beds'), legendType: 'none' },
    { key: DATA_POINTS.Susceptible, color: colors.susceptible, name: t('Susceptible'), legendType: 'line' },
    // {key: DATA_POINTS.Exposed, color: colors.exposed, name:'', legendType:"line"},
    { key: DATA_POINTS.Infectious, color: colors.infectious, name: t('Infectious'), legendType: 'line' },
    { key: DATA_POINTS.Severe, color: colors.hospitalized, name:'Severely ill', legendType:"line"},
    { key: DATA_POINTS.Critical, color: colors.critical, name: t('Patients in ICU'), legendType: 'line' },
    { key: DATA_POINTS.Overflow, color: colors.overflow, name: t('ICU overflow'), legendType: 'line' },
    { key: DATA_POINTS.Recovered, color: colors.recovered, name: t('Recovered'), legendType: 'line' },
    { key: DATA_POINTS.Death, color: colors.death, name: t('Cumulative deaths'), legendType: 'line' },
  ]

  const tMin = observations.length ? Math.min(plotData[0].time, observations[0].time) : plotData[0].time
  const tMax = observations.length
    ? Math.max(plotData[plotData.length - 1].time, observations[observations.length - 1].time)
    : plotData[plotData.length - 1].time

  const scatterToPlot: LineProps[] = observations.length
    ? [
        // Append empirical data
        ...(count_observations.observedDeaths
          ? [{ key: DATA_POINTS.ObservedDeaths, color: colors.death, name: t('Cumulative confirmed deaths') }]
          : []),
        ...(count_observations.cases
          ? [{ key: DATA_POINTS.ObservedCases, color: colors.cumulativeCases, name: t('Cumulative confirmed cases') }]
          : []),
        ...(count_observations.hospitalized
          ? [{ key: DATA_POINTS.ObservedHospitalized, color: colors.hospitalized, name: t('Patients in hospital') }]
          : []),
        ...(count_observations.ICU ? [{ key: DATA_POINTS.ObservedICU, color: colors.critical, name: t('Patients in ICU') }] : []),
        ...(count_observations.newCases
          ? [{ key: DATA_POINTS.ObservedNewCases, color: colors.newCases, name: t('Confirmed cases past 3 days') }]
          : []),
      ]
    : []

  const logScaleString: YAxisProps['scale'] = logScale ? t('log') : t('linear')

  return (
    <div className="w-100 h-100" data-testid="DeterministicLinePlot">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(500, width / ASPECT_RATIO)

          return (
            <>
              <h5>{t('Cases through time')}</h5>
              <ComposedChart
                width={width}
                height={height}
                data={plotData}
                margin={{
                  left: 15,
                  right: 15,
                  bottom: 15,
                  top: 15,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  type="number"
                  tickFormatter={xTickFormatter}
                  domain={[tMin, tMax]}
                  tickCount={7}
                />
                <YAxis
                  scale={logScaleString}
                  type="number"
                  domain={[1, 'dataMax']}
                  tickFormatter={(tick) => t('localized:number', { value: tick })}
                />
                <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />
                <Legend
                  verticalAlign="top"
                  formatter={(v, e) => legendFormatter(enabledPlots, v, e)}
                  onClick={e => {
                    const plots = enabledPlots.slice(0);
                    enabledPlots.indexOf(e.dataKey) !== -1 ? plots.splice(plots.indexOf(e.dataKey), 1) : plots.push(e.dataKey);
                    setEnabledPlots(plots)
                  }} />
                {linesToPlot.map((d) => (
                  <Line
                    key={d.key}
                    dot={false}
                    isAnimationActive={false}
                    type="monotone"
                    strokeWidth={3}
                    dataKey={d.key}
                    stroke={d.color}
                    name={d.name}
                    legendType={d.legendType}
                  />
                ))}
                {scatterToPlot.map((d) => (
                  <Scatter key={d.key} dataKey={d.key} fill={d.color} name={d.name} />
                ))}
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
