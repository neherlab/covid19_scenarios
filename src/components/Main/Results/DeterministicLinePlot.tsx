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
  TooltipProps,
  XAxis,
  YAxis,
  YAxisProps,
} from 'recharts'

import { useTranslation } from 'react-i18next'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { AllParams, ContainmentData, EmpiricalData } from '../../../algorithms/types/Param.types'
import { numberFormatter } from '../../../helpers/numberFormat'
import { calculatePosition, scrollToRef } from './chartHelper'
import { linesToPlot, observationsToPlot, DATA_POINTS, translatePlots } from './ChartCommon'
import { LinePlotTooltip } from './LinePlotTooltip'

import './DeterministicLinePlot.scss'

const ASPECT_RATIO = 16 / 9

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

function xTickFormatter(tick: string | number): string {
  return new Date(tick).toISOString().slice(0, 10)
}

function labelFormatter(value: string | number): React.ReactNode {
  return xTickFormatter(value)
}

function legendFormatter(enabledPlots: string[], value: string, entry: { dataKey: string }) {
  const activeClassName = enabledPlots.includes(entry.dataKey) ? 'legend' : 'legend-inactive'
  return <span className={activeClassName}>{value}</span>
}

type maybeNumber = number | undefined

function computeNewEmpiricalCases(
  timeWindow: number,
  verifyPositive: (x: number) => number | undefined,
  cumulativeCounts?: EmpiricalData,
): [maybeNumber[], number] {
  const newEmpiricalCases: maybeNumber[] = []
  const deltaDay = Math.floor(timeWindow)
  const deltaInt = timeWindow - deltaDay

  if (!cumulativeCounts) {
    return [newEmpiricalCases, deltaDay]
  }

  cumulativeCounts.forEach((_0, day) => {
    if (day < deltaDay) {
      newEmpiricalCases[day] = undefined
      return
    }

    const startDay = day - deltaDay
    const startDayPlus = day - deltaDay - 1

    const nowCases = cumulativeCounts[day].cases
    const oldCases = cumulativeCounts[startDay].cases
    const olderCases = cumulativeCounts[startDayPlus]?.cases
    if (oldCases && nowCases) {
      const newCases = verifyPositive(
        olderCases ? (1 - deltaInt) * (nowCases - oldCases) + deltaInt * (nowCases - olderCases) : nowCases - oldCases,
      )
      newEmpiricalCases.push(newCases)
      return
    }
    newEmpiricalCases[day] = undefined
  })

  return [newEmpiricalCases, deltaDay]
}

const verifyPositive = (x: number) => (x > 0 ? x : undefined)

// FIXME: this component has become too large
// eslint-disable-next-line sonarjs/cognitive-complexity
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

  const [newEmpiricalCases, caseTimeWindow] = computeNewEmpiricalCases(
    params.epidemiological.infectiousPeriod,
    verifyPositive,
    nonEmptyCaseCounts,
  )

  const countObservations = {
    cases: nonEmptyCaseCounts?.filter((d) => d.cases).length ?? 0,
    ICU: nonEmptyCaseCounts?.filter((d) => d.icu).length ?? 0,
    observedDeaths: nonEmptyCaseCounts?.filter((d) => d.deaths).length ?? 0,
    newCases: nonEmptyCaseCounts?.filter((_0, i) => newEmpiricalCases[i]).length ?? 0,
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
      newCases: enabledPlots.includes(DATA_POINTS.ObservedNewCases) ? newEmpiricalCases[i] : undefined,
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
  const msPerDay = 24 * 60 * 60 * 1000
  plotData.forEach((d) => {
    if (d.time - msPerDay < consolidatedPlotData[consolidatedPlotData.length - 1].time) {
      consolidatedPlotData[consolidatedPlotData.length - 1] = {
        ...d,
        ...consolidatedPlotData[consolidatedPlotData.length - 1],
      }
    } else {
      consolidatedPlotData.push(d)
    }
  })

  // determine the max of enabled plots w/o the hospital capacity
  const dataKeys = enabledPlots.filter((d) => d !== DATA_POINTS.HospitalBeds && d !== DATA_POINTS.ICUbeds)
  const yDataMax = _.max(consolidatedPlotData.map((d) => _.max(dataKeys.map((k) => d[k]))))

  const tMin = _.minBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const tMax = _.maxBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const reducedObservationsToPlot = translatePlots(t, observationsToPlot(caseTimeWindow)).filter((itemToPlot) => {
    if (observations.length !== 0) {
      if (countObservations.cases && itemToPlot.key === DATA_POINTS.ObservedCases) {
        return true
      }
      if (countObservations.newCases && itemToPlot.key === DATA_POINTS.ObservedNewCases) {
        return true
      }
      if (countObservations.hospitalized && itemToPlot.key === DATA_POINTS.ObservedHospitalized) {
        return true
      }
      if (countObservations.ICU && itemToPlot.key === DATA_POINTS.ObservedICU) {
        return true
      }
      if (countObservations.observedDeaths && itemToPlot.key === DATA_POINTS.ObservedDeaths) {
        return true
      }
    }
    return false
  })

  let tooltipItems: { [key: string]: number | undefined } = {}
  consolidatedPlotData.forEach((d) => {
    tooltipItems = { ...tooltipItems, ...d }
  })
  const tooltipItemsToDisplay = Object.keys(tooltipItems).filter(
    (itemKey: string) => itemKey !== 'time' && tooltipItems[itemKey] !== undefined,
  )

  const logScaleString: YAxisProps['scale'] = logScale ? 'log' : 'linear'

  const tooltipValueFormatter = (value: number | string) =>
    typeof value === 'number' ? formatNumber(Number(value)) : value

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
                  labelFormatter={labelFormatter}
                  position={tooltipPosition}
                  content={(props: TooltipProps) => (
                    <LinePlotTooltip
                      valueFormatter={tooltipValueFormatter}
                      itemsToDisplay={tooltipItemsToDisplay}
                      deltaCaseDays={caseTimeWindow}
                      {...props}
                    />
                  )}
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

                {reducedObservationsToPlot.map((d) => (
                  <Scatter key={d.key} dataKey={d.key} fill={d.color} name={d.name} isAnimationActive={false} />
                ))}

                {translatePlots(t, linesToPlot).map((d) => (
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
