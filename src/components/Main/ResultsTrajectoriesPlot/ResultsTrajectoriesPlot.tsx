/* eslint-disable @typescript-eslint/ban-ts-ignore */
import React, { useMemo, useState } from 'react'

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

import type { CaseCountsDatum, MitigationInterval } from '../../../algorithms/types/Param.types'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { getNumberFormatters } from '../../../helpers/numberFormat'
import { selectResult } from '../../../state/algorithm/algorithm.selectors'
import { State } from '../../../state/reducer'
import {
  selectCaseCountsData,
  selectHospitalBeds,
  selectIcuBeds,
  selectMitigationIntervals,
} from '../../../state/scenario/scenario.selectors'
import { selectIsLogScale, selectShouldFormatNumbers } from '../../../state/settings/settings.selectors'

import { calculatePosition, scrollToRef } from '../Results/chartHelper'
import {
  linesToPlot,
  areasToPlot,
  observationsToPlot,
  DATA_POINTS,
  translatePlots,
  defaultEnabledPlots,
} from '../Results/ChartCommon'
import { LinePlotTooltip } from '../Results/LinePlotTooltip'
import { MitigationPlot } from '../Results/MitigationLinePlot'
import { R0Plot } from '../Results/R0LinePlot'

import { computeNewEmpiricalCases } from '../Results/Utils'

import './ResultsTrajectoriesPlot.scss'

const ASPECT_RATIO = 16 / 9

export interface ResultsTrajectoriesPlotProps {
  hospitalBeds?: number
  icuBeds?: number
  mitigationIntervals: MitigationInterval[]
  result?: AlgorithmResult
  caseCountsData?: CaseCountsDatum[]
  isLogScale: boolean
  shouldFormatNumbers: boolean
}

const mapStateToProps = (state: State) => ({
  hospitalBeds: selectHospitalBeds(state),
  icuBeds: selectIcuBeds(state),
  mitigationIntervals: selectMitigationIntervals(state),
  result: selectResult(state),
  caseCountsData: selectCaseCountsData(state),
  isLogScale: selectIsLogScale(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
})

const mapDispatchToProps = {}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ResultsTrajectoriesPlotDiconnected({
  hospitalBeds,
  icuBeds,
  mitigationIntervals,
  result,
  caseCountsData,
  isLogScale,
  shouldFormatNumbers,
}: ResultsTrajectoriesPlotProps) {
  const { t } = useTranslation()
  const chartRef = React.useRef(null)
  const [enabledPlots, setEnabledPlots] = useState(defaultEnabledPlots)
  const { formatNumber, formatNumberRounded } = useMemo(() => getNumberFormatters({ shouldFormatNumbers }), [shouldFormatNumbers]) // prettier-ignore

  if (!result) {
    return null
  }

  // NOTE: this used to use scenarioData.epidemiological.infectiousPeriodDays as
  // time interval but a weekly interval makes more sense given reporting practices
  const [newEmpiricalCases] = computeNewEmpiricalCases(7, 'cases', caseCountsData)

  const [weeklyEmpiricalDeaths] = computeNewEmpiricalCases(7, 'deaths', caseCountsData)

  const hasObservations = {
    [DATA_POINTS.ObservedCases]: caseCountsData && caseCountsData.some((d) => d.cases),
    [DATA_POINTS.ObservedICU]: caseCountsData && caseCountsData.some((d) => d.icu),
    [DATA_POINTS.ObservedDeaths]: caseCountsData && caseCountsData.some((d) => d.deaths),
    [DATA_POINTS.ObservedWeeklyDeaths]: caseCountsData && caseCountsData.some((d) => d.deaths),
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
      weeklyDeaths: enabledPlots.includes(DATA_POINTS.ObservedWeeklyDeaths) ? weeklyEmpiricalDeaths[i] : undefined,
      hospitalBeds,
      ICUbeds: icuBeds,
    })) ?? []

  const plotData = [
    ...result.plotData.map((x) => {
      const dpoint = { time: x.time, hospitalBeds, ICUbeds: icuBeds }
      Object.keys(x.lines).forEach((d) => {
        dpoint[d] = enabledPlots.includes(d) ? x.lines[d] : undefined
      })
      Object.keys(x.areas).forEach((d) => {
        dpoint[`${d}Area`] = enabledPlots.includes(d) ? x.areas[d] : undefined
      })
      return dpoint
    }),
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

  const observationsHavingDataToPlot = observationsToPlot().filter((itemToPlot) => {
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

  const xTickFormatter = (tick: string | number) => new Date(tick).toISOString().slice(0, 10)

  const yTickFormatter = (value: number) => formatNumberRounded(value)

  const legendFormatter = (enabledPlots: string[]) => (value?: LegendPayload['value'], entry?: LegendPayload) => {
    let activeClassName = 'legend-inactive'
    if (entry?.dataKey && enabledPlots.includes(entry.dataKey)) {
      activeClassName = 'legend'
    }

    return <span className={activeClassName}>{value}</span>
  }

  const tooltipValueFormatter = (value: number | string) =>
    typeof value === 'number' ? formatNumber(Number(value)) : value

  return (
    <div className="w-100 h-100" data-testid="ResultsTrajectoriesPlot">
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
                labelFormatter={xTickFormatter}
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
                  labelFormatter={xTickFormatter}
                  position={tooltipPosition}
                  content={(props: TooltipProps) => (
                    <LinePlotTooltip
                      valueFormatter={tooltipValueFormatter}
                      itemsToDisplay={tooltipItemsToDisplay}
                      {...props}
                    />
                  )}
                />

                <Legend
                  verticalAlign="bottom"
                  formatter={legendFormatter(enabledPlots)}
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

const ResultsTrajectoriesPlot = connect(mapStateToProps, mapDispatchToProps)(ResultsTrajectoriesPlotDiconnected)

export { ResultsTrajectoriesPlot }
