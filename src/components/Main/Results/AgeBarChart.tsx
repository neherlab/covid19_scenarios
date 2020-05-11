import React from 'react'

import { sumBy } from 'lodash'

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

import { colors } from './ChartCommon'
import { calculatePosition, scrollToRef } from './chartHelper'
import { ChartTooltip } from './ChartTooltip'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  showHumanized?: boolean
  data?: AlgorithmResult
  ageDistribution?: AgeDistributionDatum[]
  rates?: SeverityDistributionDatum[]
  forcedWidth?: number
  forcedHeight?: number
  printLabel?: boolean
}

export function AgeBarChart({
  printLabel,
  showHumanized,
  data,
  ageDistribution,
  rates,
  forcedWidth,
  forcedHeight,
}: SimProps) {
  const { t: unsafeT } = useTranslation()
  const casesChartRef = React.useRef(null)
  const percentageChartRef = React.useRef(null)

  const label: LabelProps | undefined = printLabel
    ? {
        position: 'top',
        fill: '#444444',
        fontSize: '11px',
        formatter: (label: string | number) => (label > 0 ? label : null),
      }
    : undefined

  if (!data || !rates || !ageDistribution) {
    return null
  }

  const formatNumber = numberFormatter(!!showHumanized, false)
  const formatNumberRounded = numberFormatter(!!showHumanized, true)

  const t = (...args: Parameters<typeof unsafeT>) => {
    const translation = unsafeT(...args)
    if (typeof translation === 'string' || typeof translation === 'undefined') {
      return translation
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Translation incomatible in AgeBarChart.tsx', ...args)
    }
    return String(translation)
  }

  // Ensure age distribution is normalized
  const Z: number = sumBy(ageDistribution, ({ population }) => population)
  const normAgeDistribution = ageDistribution.map((d) => d.population / Z)
  const ages = ageDistribution.map((d) => d.ageGroup)

  const lastDataPoint = data.trajectory.middle[data.trajectory.middle.length - 1]
  const plotData = ages.map((age, i) => ({
    name: age,
    fraction: Math.round(normAgeDistribution[i] * 1000) / 10,
    peakSevere: Math.round(Math.max(...data.trajectory.middle.map((x) => x.current.severe[age]))),
    errorPeakSevere: [
      Math.round(Math.max(...data.trajectory.lower.map((x) => x.current.severe[age]))),
      Math.round(Math.max(...data.trajectory.upper.map((x) => x.current.severe[age]))),
    ],
    peakCritical: Math.round(Math.max(...data.trajectory.middle.map((x) => x.current.critical[age]))),
    errorPeakCritical: [
      Math.round(Math.max(...data.trajectory.lower.map((x) => x.current.critical[age]))),
      Math.round(Math.max(...data.trajectory.upper.map((x) => x.current.critical[age]))),
    ],
    peakOverflow: Math.round(Math.max(...data.trajectory.middle.map((x) => x.current.overflow[age]))),
    errorPeakOverflow: [
      Math.round(Math.max(...data.trajectory.lower.map((x) => x.current.overflow[age]))),
      Math.round(Math.max(...data.trajectory.upper.map((x) => x.current.overflow[age]))),
    ],
    totalFatalities: Math.round(lastDataPoint.cumulative.fatality[age]),
    errorFatalities: [
      Math.round(Math.max(...data.trajectory.lower.map((x) => x.cumulative.fatality[age]))),
      Math.round(Math.max(...data.trajectory.upper.map((x) => x.cumulative.fatality[age]))),
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
                width={forcedWidth || width}
                height={forcedHeight || height}
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
                  label={{ value: t('Age'), textAnchor: 'middle', position: 'insideBottom', offset: -3 }}
                />
                <YAxis
                  label={{ value: t('Cases'), angle: -90, position: 'insideLeft' }}
                  tickFormatter={tickFormatter}
                />
                <YAxis
                  label={{ value: t('Age distribution [%]'), textAnchor: 'middle', angle: 90, position: 'insideRight' }}
                  orientation={'right'}
                  yAxisId="ageDisAxis"
                  tickFormatter={tickFormatter}
                />
                <Tooltip
                  position={tooltipPosition}
                  content={(props: TooltipProps) => <ChartTooltip valueFormatter={tooltipValueFormatter} {...props} />}
                />
                <Legend verticalAlign="bottom" />
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

              <div ref={percentageChartRef} />
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
