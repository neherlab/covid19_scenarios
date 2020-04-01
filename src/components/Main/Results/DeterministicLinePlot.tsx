import React, { useState } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { CartesianGrid, Legend, Line, ComposedChart, Scatter, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts'
import type { LineProps as RechartsLineProps, YAxisProps } from 'recharts'

import { useTranslation } from 'react-i18next'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { EmpiricalData } from '../../../algorithms/types/Param.types'
import { numberFormatter } from '../../../helpers/numberFormat'

import { calculatePosition, scrollToRef } from './chartHelper'
import { ResponsiveTooltipContent } from './ResponsiveTooltipContent'

import './DeterministicLinePlot.scss'

const ASPECT_RATIO = 16 / 9

const DATA_POINTS = {
  /* Computed */
  Exposed: 'exposed',
  Susceptible: 'susceptible',
  Infectious: 'infectious',
  Severe: 'severe',
  Critical: 'critical',
  Overflow: 'overflow',
  Recovered: 'recovered',
  Fatalities: 'fatality',
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
}

export const colors = {
  [DATA_POINTS.Susceptible]: '#a6cee3',
  [DATA_POINTS.Infectious]: '#fdbf6f',
  [DATA_POINTS.Severe]: '#fb9a99',
  [DATA_POINTS.Critical]: '#e31a1c',
  [DATA_POINTS.Overflow]: '#660033',
  [DATA_POINTS.Recovered]: '#33a02c',
  [DATA_POINTS.Fatalities]: '#cab2d6',
  [DATA_POINTS.CumulativeCases]: '#aaaaaa',
  [DATA_POINTS.NewCases]: '#fdbf6f',
  [DATA_POINTS.HospitalBeds]: '#bbbbbb',
  [DATA_POINTS.ICUbeds]: '#cccccc',
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  logScale?: boolean
  showHumanized?: boolean
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

function labelFormatter(value: string | number): React.ReactNode {
  return xTickFormatter(value)
}

function legendFormatter(enabledPlots: string[], value: string, entry: any) {
  const activeClassName = enabledPlots.includes(entry.dataKey) ? 'legend' : 'legend-inactive'
  return <span className={activeClassName}>{value}</span>
}

export function DeterministicLinePlot({ data, userResult, logScale, showHumanized, caseCounts }: LinePlotProps) {
  const { t } = useTranslation()

  const formatNumber = numberFormatter(!!showHumanized, false)
  const formatNumberRounded = numberFormatter(!!showHumanized, true)

  const chartRef = React.useRef(null)

  const [enabledPlots, setEnabledPlots] = useState(Object.values(DATA_POINTS))

  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochastic.length > 0) {
    return null
  }

  const mitigationIntervals = [
    {
      mitigationValue: 0.8,
      name: 'levelOne',
      timeRange: {
        tMax: '2020-09-01',
        tMin: '2020-03-05'
      },
    },
    {
      mitigationValue: 0.6,
      name: 'levelTwo',
      timeRange: {
        tMax: '2020-09-01',
        tMin: '2020-03-20'
      },
    },
  ]

  const mitigationMeasures = []
  mitigationIntervals.forEach((d) => {
    const start = { time: new Date(d.timeRange.tMin).getTime() }
    start[d.name] = 1000
    mitigationMeasures.push(start)
    const stop = { time: new Date(d.timeRange.tMax).getTime() }
    stop[d.name] = 1000
    mitigationMeasures.push(stop)
  })

  const hasUserResult = Boolean(userResult?.trajectory)
  const verifyPositive = (x: number) => (x > 0 ? x : undefined)

  const nHospitalBeds = verifyPositive(data.params.hospitalBeds)
  const nICUBeds = verifyPositive(data.params.ICUBeds)

  const nonEmptyCaseCounts = caseCounts?.filter((d) => d.cases || d.deaths || d.ICU || d.hospitalized)

  const caseStep = 3
  // this currently relies on there being data for every day. This should be
  // the case given how the data are parsed, but would be good to put in a check
  const newCases = (cc: EmpiricalData, i: number) => {
    if (i >= caseStep && cc[i].cases && cc[i - caseStep].cases) {
      return verifyPositive(cc[i].cases - cc[i - caseStep].cases)
    }
    return undefined
  }

  const countObservations = {
    cases: nonEmptyCaseCounts?.filter((d) => d.cases).length ?? 0,
    ICU: nonEmptyCaseCounts?.filter((d) => d.ICU).length ?? 0,
    observedDeaths: nonEmptyCaseCounts?.filter((d) => d.deaths).length ?? 0,
    newCases: nonEmptyCaseCounts?.filter((d, i) => newCases(nonEmptyCaseCounts, i)).length ?? 0,
    hospitalized: nonEmptyCaseCounts?.filter((d) => d.hospitalized).length ?? 0,
  }
  const mitigationsToPlot = mitigationIntervals.map((d) => (
    { key: d.name, color: '#CCCCCC', legendType: 'line', name: d.name }
    )
  )
  console.log(mitigationsToPlot)

  const observations =
    nonEmptyCaseCounts?.map((d, i) => ({
      time: new Date(d.time).getTime(),
      cases: enabledPlots.includes(DATA_POINTS.ObservedCases) ? d.cases || undefined : undefined,
      observedDeaths: enabledPlots.includes(DATA_POINTS.ObservedDeaths) ? d.deaths || undefined : undefined,
      currentHospitalized: enabledPlots.includes(DATA_POINTS.ObservedHospitalized)
        ? d.hospitalized || undefined
        : undefined,
      ICU: enabledPlots.includes(DATA_POINTS.ObservedICU) ? d.ICU || undefined : undefined,
      newCases: enabledPlots.includes(DATA_POINTS.ObservedNewCases) ? newCases(nonEmptyCaseCounts, i) : undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,
    })) ?? []

  const plotData = [
    ...data.deterministic.trajectory.map((x) => ({
      time: x.time,
      susceptible: enabledPlots.includes(DATA_POINTS.Susceptible)
        ? Math.round(x.current.susceptible.total) || undefined
        : undefined,
      // exposed: Math.round(x.exposed.total) || undefined,
      infectious: enabledPlots.includes(DATA_POINTS.Infectious)
        ? Math.round(x.current.infectious.total) || undefined
        : undefined,
      severe: enabledPlots.includes(DATA_POINTS.Severe) ? Math.round(x.current.severe.total) || undefined : undefined,
      critical: enabledPlots.includes(DATA_POINTS.Critical)
        ? Math.round(x.current.critical.total) || undefined
        : undefined,
      overflow: enabledPlots.includes(DATA_POINTS.Overflow)
        ? Math.round(x.current.overflow.total) || undefined
        : undefined,
      recovered: enabledPlots.includes(DATA_POINTS.Recovered)
        ? Math.round(x.cumulative.recovered.total) || undefined
        : undefined,
      fatality: enabledPlots.includes(DATA_POINTS.Fatalities)
        ? Math.round(x.cumulative.fatality.total) || undefined
        : undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,
    })),
    ...observations,
    ...mitigationMeasures
  ] // .filter((d) => {return d.time >= tMin && d.time <= tMax}))

  const linesToPlot: LineProps[] = [
    { key: DATA_POINTS.HospitalBeds, color: colors.hospitalBeds, name: t('Total hospital beds'), legendType: 'none' },
    { key: DATA_POINTS.ICUbeds, color: colors.ICUbeds, name: t('Total ICU/ICM beds'), legendType: 'none' },
    { key: DATA_POINTS.Susceptible, color: colors.susceptible, name: t('Susceptible'), legendType: 'line' },
    // {key: DATA_POINTS.Exposed, color: colors.exposed, name:'', legendType:"line"},
    { key: DATA_POINTS.Infectious, color: colors.infectious, name: t('Infectious'), legendType: 'line' },
    { key: DATA_POINTS.Severe, color: colors.severe, name: t('Severely ill'), legendType: 'line' },
    { key: DATA_POINTS.Critical, color: colors.critical, name: t('Patients in ICU'), legendType: 'line' },
    { key: DATA_POINTS.Overflow, color: colors.overflow, name: t('ICU overflow'), legendType: 'line' },
    { key: DATA_POINTS.Recovered, color: colors.recovered, name: t('Recovered'), legendType: 'line' },
    { key: DATA_POINTS.Fatalities, color: colors.fatality, name: t('Cumulative deaths'), legendType: 'line' },
  ]

  const tMin = observations.length ? Math.min(plotData[0].time, observations[0].time) : plotData[0].time
  const tMax = observations.length
    ? Math.max(plotData[plotData.length - 1].time, observations[observations.length - 1].time)
    : plotData[plotData.length - 1].time

  const scatterToPlot: LineProps[] = observations.length
    ? [
        // Append empirical data
        ...(countObservations.observedDeaths
          ? [{ key: DATA_POINTS.ObservedDeaths, color: colors.fatality, name: t('Cumulative confirmed deaths') }]
          : []),
        ...(countObservations.cases
          ? [{ key: DATA_POINTS.ObservedCases, color: colors.cumulativeCases, name: t('Cumulative confirmed cases') }]
          : []),
        ...(countObservations.hospitalized
          ? [{ key: DATA_POINTS.ObservedHospitalized, color: colors.severe, name: t('Patients in hospital') }]
          : []),
        ...(countObservations.ICU
          ? [{ key: DATA_POINTS.ObservedICU, color: colors.critical, name: t('Patients in ICU') }]
          : []),
        ...(countObservations.newCases
          ? [{ key: DATA_POINTS.ObservedNewCases, color: colors.newCases, name: t('Confirmed cases past 3 days') }]
          : []),
      ]
    : []

  const logScaleString: YAxisProps['scale'] = logScale ? 'log' : 'linear'

  const tooltipFormatter = (
    value: string | number | Array<string | number>,
    name: string,
    entry: TooltipPayload,
    index: number,
  ): React.ReactNode => <span>{formatNumber(Number(value))}</span>

  const yTickFormatter = (value: number) => formatNumberRounded(value)

  return (
    <div className="w-100 h-100" data-testid="DeterministicLinePlot">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(500, width / ASPECT_RATIO)
          const tooltipPosition = calculatePosition(height)

          return (
            <>
              <h3>{t('Cases through time')}</h3>

              <div ref={chartRef} />
              <ComposedChart
                onClick={() => scrollToRef(chartRef)}
                width={width}
                height={height}
                data={plotData}
                throttleDelay={75}
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
                <YAxis scale={logScaleString} type="number" domain={[1, 'dataMax']} tickFormatter={yTickFormatter} />
                <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={labelFormatter}
                  position={tooltipPosition}
                  content={ResponsiveTooltipContent}
                />
                <Legend
                  verticalAlign="top"
                  formatter={(v, e) => legendFormatter(enabledPlots, v, e)}
                  onClick={(e) => {
                    const plots = enabledPlots.slice(0)
                    enabledPlots.includes(e.dataKey) ? plots.splice(plots.indexOf(e.dataKey), 1) : plots.push(e.dataKey)
                    setEnabledPlots(plots)
                  }}
                />
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
                {mitigationsToPlot.map((d) => (
                  <Line key={d.key} dataKey={d.key} fill={d.color} name={d.name} />
                ))}
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
