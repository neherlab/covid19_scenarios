import React, { useCallback, useMemo, useState } from 'react'

import { maxBy, minBy, zipWith, pick } from 'lodash'
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
import { PlotDatum, PlotData } from '../../../algorithms/types/Result.types'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { CASE_COUNTS_INTERVAL_DAYS } from '../../../constants'

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
  linesMetaDefault,
  casesMetaDefault,
  translatePlots,
  constantsMetaDefault,
  LineProps,
} from '../Results/ChartCommon'
import { LinePlotTooltip } from '../Results/LinePlotTooltip'
import { MitigationPlot } from '../Results/MitigationLinePlot'
import { R0Plot } from '../Results/R0LinePlot'

import { computeNewEmpiricalCases } from '../Results/Utils'

import './ResultsTrajectoriesPlot.scss'
import { soa } from 'src/algorithms/utils/soa'

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

export interface GetPlotDataParams {
  plotData: PlotData
  linesMeta: LineProps[]
}

export function getPlotData({ plotData, linesMeta }: GetPlotDataParams) {
  let { linesObject, areasObject } = plotData

  const areasMeta: LineProps[] = linesMeta.map((line) => {
    const { dataKey, name } = line
    return { ...line, dataKey: `${dataKey}Area`, name: `${name} uncertainty`, legendType: 'none' }
  })

  linesObject = pick(linesObject, Object.keys(linesMeta))
  areasObject = pick(areasObject, Object.keys(areasMeta))

  return { linesObject, areasObject }

  // TODO: What is it doing?
  // const consolidatedPlotData = [plotData[0]]
  // const msPerDay = 24 * 60 * 60 * 1000
  // const last = consolidatedPlotData[consolidatedPlotData.length - 1]
  // plotData.forEach((d) => {
  //   if (d.time - msPerDay < last.time) {
  //     last = { ...d, ...last }
  //   } else {
  //     consolidatedPlotData.push(d)
  //   }
  // })
}

function getObservations({ caseCountsData, points }) {
  // // NOTE: this used to use scenarioData.epidemiological.infectiousPeriodDays as
  // // time interval but a weekly interval makes more sense given reporting practices
  // const [newEmpiricalCases] = computeNewEmpiricalCases(CASE_COUNTS_INTERVAL_DAYS, 'cases', caseCountsData)
  // const [weeklyEmpiricalDeaths] = computeNewEmpiricalCases(CASE_COUNTS_INTERVAL_DAYS, 'deaths', caseCountsData)
  //
  // const hasObservations = {
  //   observedCases: caseCountsData && caseCountsData.some((d) => d.cases),
  //   observedICU: caseCountsData && caseCountsData.some((d) => d.icu),
  //   observedDeaths: caseCountsData && caseCountsData.some((d) => d.deaths),
  //   observedWeeklyDeaths: caseCountsData && caseCountsData.some((d) => d.deaths),
  //   observedNewCases: newEmpiricalCases && newEmpiricalCases.some((d) => d),
  //   observedHospitalized: caseCountsData && caseCountsData.some((d) => d.hospitalized),
  // }
  //
  // const cases = caseCountsData?.filter((caseCount) => {})
  //
  // const observations =
  //   caseCountsData?.map((d, i) => ({
  //     time: new Date(d.time).getTime(),
  //     cases: enabledPlots.includes(DATA_POINTS.ObservedCases) ? d.cases || undefined : undefined,
  //     observedDeaths: enabledPlots.includes(DATA_POINTS.ObservedDeaths) ? d.deaths || undefined : undefined,
  //     currentHospitalized: enabledPlots.includes(DATA_POINTS.ObservedHospitalized)
  //       ? d.hospitalized || undefined
  //       : undefined,
  //     icu: enabledPlots.includes(DATA_POINTS.ObservedICU) ? d.icu || undefined : undefined,
  //     newCases: enabledPlots.includes(DATA_POINTS.ObservedNewCases) ? newEmpiricalCases[i] : undefined,
  //     weeklyDeaths: enabledPlots.includes(DATA_POINTS.ObservedWeeklyDeaths) ? weeklyEmpiricalDeaths[i] : undefined,
  //     hospitalBeds,
  //     icuBeds,
  //   })) ?? []
  //
  // const observationsHavingDataToPlot = casesMetaDefault().filter((itemToPlot) => {
  //   if (observations.length !== 0) {
  //     return hasObservations[itemToPlot.key]
  //   }
  //   return false
  // })
  return []
}

export interface GetDomainParams {
  data: PlotData
  isLogScale: boolean
}

export interface GetDomainsResult {
  xDomain: { tMin: number; tMax: number }
  yDomain: [number, number]
}

export function getDomain({ data, isLogScale }: GetDomainParams): GetDomainsResult {
  const tMin = minBy(data, 'time')!.time
  const tMax = maxBy(data, 'time')!.time
  const xDomain = { tMin, tMax }

  const yMin = isLogScale ? 1 : 0
  const yMax = maxBy(data)
  const yDomain = [yMin, yMax * 1.1]

  return { xDomain, yDomain }
}

export function getTooltipItems({ consolidatedPlotData }) {
  //   let tooltipItems: { [key: string]: number | undefined } = {}
  //   consolidatedPlotData.forEach((d) => {
  //     // @ts-ignore
  //     tooltipItems = { ...tooltipItems, ...d }
  //   })
  //
  //   const tooltipItemsToDisplay = Object.keys(tooltipItems).filter(
  //     (itemKey: string) => itemKey !== 'time' && itemKey !== 'hospitalBeds' && itemKey !== 'icuBeds',
  //   )
  //
  //   return tooltipItemsToDisplay
  // }
  //
  // /** Toggles `enabled` propery of the meta entry corresponding to a given key (if such entry exists) */
  // function maybeToggleMeta(meta: LineProps[], dataKey: string) {
  //   const entry = meta.find((entry) => entry.dataKey === dataKey)
  //   if (entry) {
  //     return {
  //       ...meta,
  //       [dataKey]: { ...entry, enabled: !entry.enabled },
  //     }
  //   }
  //   return meta
  return []
}

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
  const { formatNumber, formatNumberRounded } = useMemo(() => getNumberFormatters({ shouldFormatNumbers }), [shouldFormatNumbers]) // prettier-ignore
  const [linesMeta, setLinesMeta] = useState(linesMetaDefault)
  const [pointsMeta, setPointsMeta] = useState(casesMetaDefault)
  const [constantsMeta] = useState(constantsMetaDefault)
  const handleLegendClick = useCallback(({ dataKey }) => {
    setLinesMeta((linesMeta) => maybeToggleMeta(linesMeta, dataKey))
    setPointsMeta((pointsMeta) => maybeToggleMeta(pointsMeta, dataKey))
  }, [])

  if (!result) {
    return null
  }

  const { plotData } = result

  const { linesObject, areasObject } = getPlotData({ plotData, linesMeta })
  // const points = getObservations({ caseCountsData, pointsMeta })
  // const constants = getConstants({ hospitalBeds, icuBeds })

  const data = aos({ ...linesObject, ...areasObject })
  let meta = [...linesMeta, ...areasMeta, ...pointsMeta, ...constantsMeta]

  // const data = [...lines, ...areas, ...points, ...constants]

  if (meta.length === 0) {
    return null
  }

  const { xDomain: { tMin, tMax }, yDomain } = getDomain({ data, meta, isLogScale }) // prettier-ignore

  const tooltipItemsToDisplay = getTooltipItems({ consolidatedPlotData })

  const logScaleString: YAxisProps['scale'] = isLogScale ? 'log' : 'linear'

  const xTickFormatter = (tick: string | number) => new Date(tick).toISOString().slice(0, 10)

  const yTickFormatter = (value: number) => formatNumberRounded(value)

  const legendFormatter = (value?: LegendPayload['value'], entry?: LegendPayload) => {
    let activeClassName = 'legend-inactive'
    const enabled = entry.enabled
    console.log({ enabled })
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
                data={data}
                throttleDelay={75}
                margin={{
                  left: 5,
                  right: 5,
                  bottom: 5,
                }}
              >
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
                  domain={yDomain}
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

                <Legend verticalAlign="bottom" formatter={legendFormatter} onClick={handleLegendClick} />

                {translatePlots(t, points).map(({ dataKey, color, name, legendType }) => (
                  <Scatter key={dataKey} dataKey={dataKey} fill={color} name={name} isAnimationActive={false} />
                ))}

                {translatePlots(t, lines).map(({ dataKey, color, name, legendType }) => (
                  <Line
                    key={dataKey}
                    dataKey={dataKey}
                    name={name}
                    stroke={color}
                    legendType={legendType}
                    type="monotone"
                    isAnimationActive={false}
                    strokeWidth={3}
                    dot={false}
                  />
                ))}

                {translatePlots(t, areas).map(({ dataKey, color, name, legendType }) => (
                  <Area
                    key={dataKey}
                    dataKey={dataKey}
                    name={name}
                    stroke={color}
                    fill={color}
                    strokeWidth={0}
                    fillOpacity={0.12}
                    legendType={legendType}
                    type="monotone"
                    isAnimationActive={false}
                  />
                ))}

                {translatePlots(t, constantsMetaDefault).map(({ dataKey, color, name, legendType }) => (
                  <Line
                    key={dataKey}
                    dataKey={dataKey}
                    name={name}
                    stroke={color}
                    legendType={legendType}
                    type="monotone"
                    isAnimationActive={false}
                    strokeWidth={3}
                    dot={false}
                  />
                ))}

                <CartesianGrid strokeDasharray="3 3" />
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
