import type { TFunction, TFunctionResult } from 'i18next'
import React from 'react'

import { sumBy } from 'lodash'
import { connect } from 'react-redux'

import ReactResizeDetector from 'react-resize-detector'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  ErrorBar,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  LabelProps,
  TooltipProps,
} from 'recharts'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import type { AgeDistributionDatum, SeverityDistributionDatum } from '../../../algorithms/types/Param.types'

import { numberFormatter } from '../../../helpers/numberFormat'
import { State } from '../../../state/reducer'
import { selectAgeDistributionData, selectSeverityDistributionData } from '../../../state/scenario/scenario.selectors'
import { selectResult } from '../../../state/algorithm/algorithm.selectors'
import { selectShouldFormatNumbers, selectShouldShowPlotLabels } from '../../../state/settings/settings.selectors'

import { colors } from './ChartCommon'
import { calculatePosition, scrollToRef } from './chartHelper'
import { ChartTooltip } from './ChartTooltip'

const ASPECT_RATIO = 16 / 4

// eslint-disable-next-line @typescript-eslint/ban-types
export type SafeTFunction = (...args: Parameters<TFunction>) => Exclude<TFunctionResult, null | object>

export interface AgeBarChartProps {
  result?: AlgorithmResult
  ageDistributionData: AgeDistributionDatum[]
  severityDistributionData: SeverityDistributionDatum[]
  shouldFormatNumbers: boolean
}

const mapStateToProps = (state: State) => ({
  result: selectResult(state),
  ageDistributionData: selectAgeDistributionData(state),
  severityDistributionData: selectSeverityDistributionData(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
  shouldShowPlotLabels: selectShouldShowPlotLabels(state),
})

const mapDispatchToProps = {}

export const AgeBarChart = connect(mapStateToProps, mapDispatchToProps)(AgeBarChartDisconnected)

export function AgeBarChartDisconnected({
  result,
  ageDistributionData,
  severityDistributionData,
  shouldFormatNumbers,
}: AgeBarChartProps) {
  const { t: unsafeT } = useTranslation()
  const casesChartRef = React.useRef(null)

  const t = unsafeT as SafeTFunction

  const label: LabelProps = {
    position: 'top',
    fill: '#444444',
    fontSize: '11px',
    formatter: (label: string | number) => {
      if (label <= 0) {
        return undefined
      }

      if (!shouldFormatNumbers) {
        return label
      }

      let num = label
      if (typeof num === 'string') {
        num = Number.parseFloat(num)
      }

      return numberFormatter(true, false)(num)
    },
  }

  if (!result) {
    return null
  }

  const formatNumber = numberFormatter(shouldFormatNumbers, false)
  const formatNumberRounded = numberFormatter(shouldFormatNumbers, true)

  // Ensure age distribution is normalized
  const Z: number = sumBy(ageDistributionData, ({ population }) => population)
  const normAgeDistribution = ageDistributionData.map((d) => d.population / Z)
  const ages = ageDistributionData.map((d) => d.ageGroup)

  const lastDataPoint = result.trajectory.middle[result.trajectory.middle.length - 1]
  const plotData = ages.map((age, i) => ({
    name: age,
    fraction: Math.round(normAgeDistribution[i] * 1000) / 10,
    peakSevere: Math.round(Math.max(...result.trajectory.middle.map((x) => x.current.severe[age]))),
    errorPeakSevere: [
      Math.round(Math.max(...result.trajectory.lower.map((x) => x.current.severe[age]))),
      Math.round(Math.max(...result.trajectory.upper.map((x) => x.current.severe[age]))),
    ],
    peakCritical: Math.round(Math.max(...result.trajectory.middle.map((x) => x.current.critical[age]))),
    errorPeakCritical: [
      Math.round(Math.max(...result.trajectory.lower.map((x) => x.current.critical[age]))),
      Math.round(Math.max(...result.trajectory.upper.map((x) => x.current.critical[age]))),
    ],
    peakOverflow: Math.round(Math.max(...result.trajectory.middle.map((x) => x.current.overflow[age]))),
    errorPeakOverflow: [
      Math.round(Math.max(...result.trajectory.lower.map((x) => x.current.overflow[age]))),
      Math.round(Math.max(...result.trajectory.upper.map((x) => x.current.overflow[age]))),
    ],
    totalFatalities: Math.round(lastDataPoint.cumulative.fatality[age]),
    errorFatalities: [
      Math.round(Math.max(...result.trajectory.lower.map((x) => x.cumulative.fatality[age]))),
      Math.round(Math.max(...result.trajectory.upper.map((x) => x.cumulative.fatality[age]))),
    ],
  }))

  const tooltipValueFormatter = (value: number | string) => (typeof value === 'number' ? formatNumber(value) : value)

  const tickFormatter = (value: number) => formatNumberRounded(value)

  return (
    <div className="w-100 h-100" data-testid="AgeBarChart">
      <ReactResizeDetector handleWidth handleHeight refreshRate={300} refreshMode="debounce">
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(300, width / ASPECT_RATIO)
          const tooltipPosition = calculatePosition(height)

          return (
            <>
              <div ref={casesChartRef} />
              <BarChart
                onClick={() => scrollToRef(casesChartRef)}
                width={width}
                height={height}
                data={plotData}
                throttleDelay={75}
                margin={{
                  left: 0,
                  right: 0,
                  bottom: 10,
                  top: 10,
                }}
              >
                <XAxis
                  dataKey="name"
                  label={{
                    value: t('Age'),
                    textAnchor: 'middle',
                    position: 'insideBottom',
                    offset: -7,
                    fill: '#495057',
                  }}
                />
                <YAxis
                  label={{ value: t('Cases'), angle: -90, position: 'insideLeft', fill: '#495057' }}
                  domain={[0, 'dataMax']}
                  tickFormatter={tickFormatter}
                />
                <YAxis
                  label={{
                    value: t('Age distribution [%]'),
                    textAnchor: 'middle',
                    angle: 90,
                    position: 'insideRight',
                    fill: '#495057',
                  }}
                  orientation={'right'}
                  yAxisId="ageDisAxis"
                  tickFormatter={tickFormatter}
                />
                <Tooltip
                  position={tooltipPosition}
                  content={(props: TooltipProps) => <ChartTooltip valueFormatter={tooltipValueFormatter} {...props} />}
                />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '12px' }} />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  isAnimationActive={false}
                  dataKey="peakSevere"
                  fill={colors.severe}
                  name={t('peak severe')}
                  label={label}
                >
                  <ErrorBar dataKey="errorPeakSevere" stroke={colors.severe} width={2} strokeWidth={1} />
                </Bar>
                <Bar
                  isAnimationActive={false}
                  dataKey="peakCritical"
                  fill={colors.critical}
                  name={t('peak critical')}
                  label={label}
                >
                  <ErrorBar dataKey="errorPeakCritical" stroke={colors.critical} width={2} strokeWidth={1} />
                </Bar>
                <Bar
                  isAnimationActive={false}
                  dataKey="peakOverflow"
                  fill={colors.overflow}
                  name={t('peak overflow')}
                  label={label}
                >
                  <ErrorBar dataKey="errorPeakOverflow" stroke={colors.overflow} width={2} strokeWidth={1} />
                </Bar>
                <Bar
                  isAnimationActive={false}
                  dataKey="totalFatalities"
                  fill={colors.fatality}
                  name={t('total deaths')}
                  label={label}
                >
                  <ErrorBar dataKey="errorFatalities" stroke={colors.fatality} width={2} strokeWidth={1} />
                </Bar>
                <Bar
                  isAnimationActive={false}
                  dataKey="fraction"
                  fill="#aaaaaa"
                  name={t('% of population')}
                  yAxisId={'ageDisAxis'}
                />
              </BarChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
