import React, { useState } from 'react'

import _ from 'lodash'

import ReactResizeDetector from 'react-resize-detector'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Label,
  ReferenceArea,
  Scatter,
  Tooltip,
  TooltipPayload,
  XAxis,
  YAxis,
  YAxisProps,
  LineProps as RechartsLineProps,
} from 'recharts'

import { useTranslation } from 'react-i18next'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { AllParams, ContainmentData, EmpiricalData } from '../../../algorithms/types/Param.types'
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
  [DATA_POINTS.Overflow]: '#900d2c',
  [DATA_POINTS.Recovered]: '#33a02c',
  [DATA_POINTS.Fatalities]: '#5e506a',
  [DATA_POINTS.CumulativeCases]: '#aaaaaa',
  [DATA_POINTS.NewCases]: '#fdbf6f',
  [DATA_POINTS.HospitalBeds]: '#bbbbbb',
  [DATA_POINTS.ICUbeds]: '#cccccc',
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  params: AllParams
  mitigation: ContainmentData
  logScale?: boolean
  showHumanized?: boolean
  caseCounts?: EmpiricalData
  forcedWidth?: number
  forcedHeight?: number
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

const verifyPositive = (x: number) => (x > 0 ? x : undefined)

export function DeterministicLinePlot({
  data,
  userResult,
  params,
  mitigation,
  logScale,
  showHumanized,
  caseCounts,
  forcedWidth,
  forcedHeight,
}: LinePlotProps) {
  const { t } = useTranslation()
  const chartRef = React.useRef(null)
  const [enabledPlots, setEnabledPlots] = useState(Object.values(DATA_POINTS))

  // RULE OF HOOKS #1: hooks go before anything else. Hooks ^, ahything else v.
  // href: https://reactjs.org/docs/hooks-rules.html

  const formatNumber = numberFormatter(!!showHumanized, false)
  const formatNumberRounded = numberFormatter(!!showHumanized, true)

  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochastic.length > 0) {
    return null
  }

  const { mitigationIntervals } = mitigation

  const nHospitalBeds = verifyPositive(data.params.hospitalBeds)
  const nICUBeds = verifyPositive(data.params.ICUBeds)

  const nonEmptyCaseCounts = caseCounts?.filter((d) => d.cases || d.deaths || d.icu || d.hospitalized)

  const caseStep = 3
  // this currently relies on there being data for every day. This should be
  // the case given how the data are parsed, but would be good to put in a check
  const newCases = (cc: EmpiricalData, i: number) => {
    if (i >= caseStep && cc[i].cases !== null && cc[i - caseStep].cases !== null) {
      return verifyPositive((cc[i].cases as number) - (cc[i - caseStep].cases as number))
    }
    return undefined
  }

  const countObservations = {
    cases: nonEmptyCaseCounts?.filter((d) => d.cases).length ?? 0,
    ICU: nonEmptyCaseCounts?.filter((d) => d.icu).length ?? 0,
    observedDeaths: nonEmptyCaseCounts?.filter((d) => d.deaths).length ?? 0,
    newCases: nonEmptyCaseCounts?.filter((d, i) => newCases(nonEmptyCaseCounts, i)).length ?? 0,
    hospitalized: nonEmptyCaseCounts?.filter((d) => d.hospitalized).length ?? 0,
  }

  const observations =
    nonEmptyCaseCounts?.map((d, i) => ({
      time: new Date(d.time).getTime(),
      cases: enabledPlots.includes(DATA_POINTS.ObservedCases) ? d.cases || undefined : undefined,
      observedDeaths: enabledPlots.includes(DATA_POINTS.ObservedDeaths) ? d.deaths || undefined : undefined,
      currentHospitalized: enabledPlots.includes(DATA_POINTS.ObservedHospitalized)
        ? d.hospitalized || undefined
        : undefined,
      ICU: enabledPlots.includes(DATA_POINTS.ObservedICU) ? d.icu || undefined : undefined,
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
  ]

  if (plotData.length === 0) {
    return null
  }

  plotData.sort((a, b) => (a.time > b.time ? 1 : -1))
  const consolidatedPlotData = [plotData[0]]
  plotData.forEach((d) => {
    if (d.time === consolidatedPlotData[consolidatedPlotData.length - 1].time) {
      consolidatedPlotData[consolidatedPlotData.length - 1] = {
        ...consolidatedPlotData[consolidatedPlotData.length - 1],
        ...d,
      }
    } else {
      consolidatedPlotData.push(d)
    }
  })

  // determine the max of enabled plots w/o the hospital capacity
  const dataKeys = enabledPlots.filter((d) => d !== DATA_POINTS.HospitalBeds && d !== DATA_POINTS.ICUbeds)
  const yDataMax = _.max(consolidatedPlotData.map((d) => _.max(dataKeys.map((k) => d[k]))))

  const linesToPlot: LineProps[] = [
    { key: DATA_POINTS.Susceptible, color: colors.susceptible, name: t('Susceptible'), legendType: 'line' },
    { key: DATA_POINTS.Recovered, color: colors.recovered, name: t('Recovered'), legendType: 'line' },
    { key: DATA_POINTS.Infectious, color: colors.infectious, name: t('Infectious'), legendType: 'line' },
    { key: DATA_POINTS.Severe, color: colors.severe, name: t('Severely ill'), legendType: 'line' },
    { key: DATA_POINTS.Critical, color: colors.critical, name: t('Patients in ICU (model)'), legendType: 'line' },
    { key: DATA_POINTS.Overflow, color: colors.overflow, name: t('ICU overflow'), legendType: 'line' },
    { key: DATA_POINTS.Fatalities, color: colors.fatality, name: t('Cumulative deaths (model)'), legendType: 'line' },
    { key: DATA_POINTS.HospitalBeds, color: colors.hospitalBeds, name: t('Total hospital beds'), legendType: 'none' },
    { key: DATA_POINTS.ICUbeds, color: colors.ICUbeds, name: t('Total ICU/ICM beds'), legendType: 'none' },
  ]

  const tMin = _.minBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const tMax = _.maxBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const scatterToPlot: LineProps[] =
    observations.length > 0
      ? [
          // Append empirical data
          ...(countObservations.cases
            ? [{ key: DATA_POINTS.ObservedCases, color: colors.cumulativeCases, name: t('Cumulative cases (data)') }]
            : []),
          ...(countObservations.newCases
            ? [{ key: DATA_POINTS.ObservedNewCases, color: colors.newCases, name: t('Cases past 3 days (data)') }]
            : []),
          ...(countObservations.hospitalized
            ? [{ key: DATA_POINTS.ObservedHospitalized, color: colors.severe, name: t('Patients in hospital (data)') }]
            : []),
          ...(countObservations.ICU
            ? [{ key: DATA_POINTS.ObservedICU, color: colors.critical, name: t('Patients in ICU (data)') }]
            : []),
          ...(countObservations.observedDeaths
            ? [{ key: DATA_POINTS.ObservedDeaths, color: colors.fatality, name: t('Cumulative deaths (data)') }]
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

  // const zoomIn = () => {
  //   if (zoomSelectedLeftState === zoomSelectedRightState || !zoomSelectedRightState) {
  //     setzoomSelectedLeftState('')
  //     setzoomSelectedRightState('')
  //     return
  //   }

  //   // xAxis domain
  //   if (zoomSelectedLeftState > zoomSelectedRightState) {
  //     setzoomSelectedLeftState(zoomSelectedRightState)
  //     setzoomSelectedRightState(zoomSelectedLeftState)
  //   }

  //   setzoomLeftState(zoomSelectedLeftState)
  //   setzoomRightState(zoomSelectedRightState)
  //   setzoomSelectedLeftState('')
  //   setzoomSelectedRightState('')
  // }

  // const zoomOut = () => {
  //   setzoomLeftState('dataMin')
  //   setzoomRightState('dataMax')
  //   setzoomSelectedLeftState('')
  //   setzoomSelectedRightState('')
  // }

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
              <div ref={chartRef} />
              <ComposedChart
                onClick={() => scrollToRef(chartRef)}
                width={forcedWidth || width}
                height={forcedHeight || height}
                data={consolidatedPlotData}
                throttleDelay={75}
                margin={{
                  left: 5,
                  right: 5,
                  bottom: 5,
                  top: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  allowDataOverflow
                  dataKey="time"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={xTickFormatter}
                  tickCount={7}
                />

                <YAxis
                  allowDataOverflow
                  scale={logScaleString}
                  type="number"
                  domain={logScale ? [1, yDataMax * 1.1] : [0, yDataMax * 1.1]}
                  tickFormatter={yTickFormatter}
                />

                <YAxis
                  yAxisId="mitigationStrengthAxis"
                  allowDataOverflow
                  orientation={'right'}
                  type="number"
                  domain={[0, 100]}
                />

                <Tooltip
                  formatter={tooltipFormatter}
                  labelFormatter={labelFormatter}
                  position={tooltipPosition}
                  content={ResponsiveTooltipContent}
                />

                <Legend
                  verticalAlign="bottom"
                  formatter={(v, e) => legendFormatter(enabledPlots, v, e)}
                  onClick={(e) => {
                    const plots = enabledPlots.slice(0)
                    enabledPlots.includes(e.dataKey) ? plots.splice(plots.indexOf(e.dataKey), 1) : plots.push(e.dataKey)
                    setEnabledPlots(plots)
                  }}
                />

                {mitigationIntervals.map((interval) => (
                  <ReferenceArea
                    key={interval.id}
                    x1={_.clamp(interval.timeRange.tMin.getTime(), tMin, tMax)}
                    x2={_.clamp(interval.timeRange.tMax.getTime(), tMin, tMax)}
                    y1={0}
                    y2={_.clamp(interval.mitigationValue, 0, 100)}
                    yAxisId={'mitigationStrengthAxis'}
                    fill={interval.color}
                    fillOpacity={0.1}
                  >
                    <Label value={interval.name} position="insideTopRight" fill="#444444" />
                  </ReferenceArea>
                ))}

                {scatterToPlot.map((d) => (
                  <Scatter key={d.key} dataKey={d.key} fill={d.color} name={d.name} isAnimationActive={false} />
                ))}

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
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
