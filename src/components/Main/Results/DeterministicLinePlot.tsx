/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useState } from 'react'

import _ from 'lodash'
import { connect } from 'react-redux'

import ReactResizeDetector from 'react-resize-detector'
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Scatter,
  Area,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  YAxisProps,
  LegendPayload,
} from 'recharts'

import { useTranslation } from 'react-i18next'

import type { ScenarioDatum, CaseCountsDatum } from '../../../algorithms/types/Param.types'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { numberFormatter } from '../../../helpers/numberFormat'
import { selectIsRunning, selectResult } from '../../../state/algorithm/algorithm.selectors'
import { State } from '../../../state/reducer'
import { selectScenarioData } from '../../../state/scenario/scenario.selectors'
import { selectIsLogScale, selectShouldFormatNumbers } from '../../../state/settings/settings.selectors'
import { selectCaseCountsData } from '../../../state/caseCounts/caseCounts.selectors'

import { calculatePosition, scrollToRef } from './chartHelper'
import { linesToPlot, areasToPlot, observationsToPlot, DATA_POINTS, translatePlots } from './ChartCommon'
import { LinePlotTooltip } from './LinePlotTooltip'
import { MitigationPlot } from './MitigationLinePlot'
import { R0Plot } from './R0LinePlot'

import { verifyPositive, verifyTuple, computeNewEmpiricalCases } from './Utils'

import './DeterministicLinePlot.scss'

const ASPECT_RATIO = 16 / 9

function xTickFormatter(tick: string | number): string {
  return new Date(tick).toISOString().slice(0, 10)
}

function labelFormatter(value: string | number): React.ReactNode {
  return xTickFormatter(value)
}

function legendFormatter(enabledPlots: string[], value?: LegendPayload['value'], entry?: LegendPayload) {
  let activeClassName = 'legend-inactive'
  if (entry?.dataKey && enabledPlots.includes(entry.dataKey)) {
    activeClassName = 'legend'
  }

  return <span className={activeClassName}>{value}</span>
}

export interface DeterministicLinePlotProps {
  scenarioData: ScenarioDatum
  result?: AlgorithmResult
  caseCountsData?: CaseCountsDatum[]
  isRunning: boolean
  isLogScale: boolean
  shouldFormatNumbers: boolean
}

const mapStateToProps = (state: State) => ({
  scenarioData: selectScenarioData(state),
  result: selectResult(state),
  caseCountsData: selectCaseCountsData(state),
  isRunning: selectIsRunning(state),
  isLogScale: selectIsLogScale(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
})

const mapDispatchToProps = {}

export function DeterministicLinePlot({
  scenarioData,
  result,
  caseCountsData,
  isRunning,
  isLogScale,
  shouldFormatNumbers,
}: DeterministicLinePlotProps) {
  const { t } = useTranslation()
  const chartRef = React.useRef(null)
  const [enabledPlots, setEnabledPlots] = useState(Object.values(DATA_POINTS))

  const formatNumber = numberFormatter(!!shouldFormatNumbers, false)
  const formatNumberRounded = numberFormatter(!!shouldFormatNumbers, true)

  if (!result) {
    return null
  }

  const { mitigationIntervals } = scenarioData.mitigation

  const nHospitalBeds = verifyPositive(scenarioData.population.hospitalBeds)
  const nICUBeds = verifyPositive(scenarioData.population.icuBeds)

  const [newEmpiricalCases, caseTimeWindow] = computeNewEmpiricalCases(
    scenarioData.epidemiological.infectiousPeriodDays,
    caseCountsData,
  )

  const hasObservations = {
    [DATA_POINTS.ObservedCases]: caseCountsData && caseCountsData.some((d) => d.cases),
    [DATA_POINTS.ObservedICU]: caseCountsData && caseCountsData.some((d) => d.icu),
    [DATA_POINTS.ObservedDeaths]: caseCountsData && caseCountsData.some((d) => d.deaths),
    [DATA_POINTS.ObservedNewCases]: newEmpiricalCases && newEmpiricalCases.some((d) => d),
    [DATA_POINTS.ObservedHospitalized]: caseCountsData && caseCountsData.some((d) => d.hospitalized),
  }

  const observations =
    caseCountsData?.map((d, i) => ({
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

  const { upper, lower } = result.trajectory

  const plotData = [
    ...result.trajectory.middle.map((x, i) => ({
      time: x.time,
      susceptible: enabledPlots.includes(DATA_POINTS.Susceptible)
        ? verifyPositive(x.current.susceptible.total)
        : undefined,
      infectious: enabledPlots.includes(DATA_POINTS.Infectious)
        ? verifyPositive(x.current.infectious.total)
        : undefined,
      severe: enabledPlots.includes(DATA_POINTS.Severe) ? Math.round(x.current.severe.total) || undefined : undefined,
      critical: enabledPlots.includes(DATA_POINTS.Critical)
        ? verifyPositive(Math.round(x.current.critical.total))
        : undefined,
      overflow: enabledPlots.includes(DATA_POINTS.Overflow)
        ? verifyPositive(Math.round(x.current.overflow.total))
        : undefined,
      recovered: enabledPlots.includes(DATA_POINTS.Recovered)
        ? verifyPositive(Math.round(x.cumulative.recovered.total))
        : undefined,
      fatality: enabledPlots.includes(DATA_POINTS.Fatalities)
        ? verifyPositive(Math.round(x.cumulative.fatality.total))
        : undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,

      // Error bars
      susceptibleArea: enabledPlots.includes(DATA_POINTS.Susceptible)
        ? verifyTuple([
            verifyPositive(lower[i].current.susceptible.total),
            verifyPositive(upper[i].current.susceptible.total),
          ])
        : undefined,
      infectiousArea: enabledPlots.includes(DATA_POINTS.Infectious)
        ? verifyTuple([
            verifyPositive(lower[i].current.infectious.total),
            verifyPositive(upper[i].current.infectious.total),
          ])
        : undefined,
      severeArea: enabledPlots.includes(DATA_POINTS.Severe)
        ? verifyTuple([verifyPositive(lower[i].current.severe.total), verifyPositive(upper[i].current.severe.total)])
        : undefined,
      criticalArea: enabledPlots.includes(DATA_POINTS.Critical)
        ? verifyTuple([
            verifyPositive(lower[i].current.critical.total),
            verifyPositive(upper[i].current.critical.total),
          ])
        : undefined,
      overflowArea: enabledPlots.includes(DATA_POINTS.Overflow)
        ? verifyTuple([
            verifyPositive(lower[i].current.overflow.total),
            verifyPositive(upper[i].current.overflow.total),
          ])
        : undefined,
      recoveredArea: enabledPlots.includes(DATA_POINTS.Recovered)
        ? verifyTuple([
            verifyPositive(lower[i].cumulative.recovered.total),
            verifyPositive(upper[i].cumulative.recovered.total),
          ])
        : undefined,
      fatalityArea: enabledPlots.includes(DATA_POINTS.Fatalities)
        ? verifyTuple([
            verifyPositive(lower[i].cumulative.fatality.total),
            verifyPositive(upper[i].cumulative.fatality.total),
          ])
        : undefined,
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
  // @ts-ignore
  const yDataMax = _.max(consolidatedPlotData.map((d) => _.max(dataKeys.map((k) => d[k]))))

  const tMin = _.minBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const tMax = _.maxBy(plotData, 'time')!.time // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const observationsHavingDataToPlot = observationsToPlot(caseTimeWindow).filter((itemToPlot) => {
    if (observations.length !== 0) {
      return hasObservations[itemToPlot.key]
    }
    return false
  })

  let tooltipItems: { [key: string]: number | undefined } = {}
  consolidatedPlotData.forEach((d) => {
    // @ts-ignore
    tooltipItems = { ...tooltipItems, ...d }
  })
  const tooltipItemsToDisplay = Object.keys(tooltipItems).filter(
    (itemKey: string) => itemKey !== 'time' && itemKey !== 'hospitalBeds' && itemKey !== 'ICUbeds',
  )

  const logScaleString: YAxisProps['scale'] = isLogScale ? 'log' : 'linear'

  const tooltipValueFormatter = (value: number | string) =>
    typeof value === 'number' ? formatNumber(Number(value)) : value

  const yTickFormatter = (value: number) => formatNumberRounded(value)

  return (
    <div className="w-100 h-100" data-testid="DeterministicLinePlot">
      <ReactResizeDetector handleWidth handleHeight refreshRate={300} refreshMode="debounce">
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(500, width / ASPECT_RATIO)
          const tooltipPosition = calculatePosition(height)

          return (
            <>
              <div ref={chartRef} />
              <R0Plot
                R0Trajectory={result.R0}
                width={width}
                height={height / 4}
                tMin={tMin}
                tMax={tMax}
                labelFormatter={labelFormatter}
                tooltipValueFormatter={tooltipValueFormatter}
                tooltipPosition={tooltipPosition}
              />
              <MitigationPlot
                mitigation={mitigationIntervals}
                width={width}
                height={height / 4}
                tMin={tMin}
                tMax={tMax}
              />
              <ComposedChart
                onClick={() => scrollToRef(chartRef)}
                width={width}
                height={height}
                data={consolidatedPlotData}
                throttleDelay={75}
                margin={{
                  left: 5,
                  right: 5,
                  bottom: 5,
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
                  domain={isLogScale ? [1, yDataMax * 1.1] : [0, yDataMax * 1.1]}
                  tickFormatter={yTickFormatter}
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
                  formatter={(value?: LegendPayload['value'], entry?: LegendPayload) =>
                    legendFormatter(enabledPlots, value, entry)
                  }
                  onClick={(e) => {
                    const plots = enabledPlots.slice(0)
                    enabledPlots.includes(e.dataKey) ? plots.splice(plots.indexOf(e.dataKey), 1) : plots.push(e.dataKey)
                    setEnabledPlots(plots)
                  }}
                />

                {translatePlots(t, observationsHavingDataToPlot).map((d) => (
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

                {translatePlots(t, areasToPlot).map((d) => (
                  <Area
                    key={d.key}
                    type="monotone"
                    fillOpacity={0.12}
                    dataKey={d.key}
                    isAnimationActive={false}
                    name={d.name}
                    stroke={d.color}
                    strokeWidth={0}
                    fill={d.color}
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

export default connect(mapStateToProps, mapDispatchToProps)(DeterministicLinePlot)
