import React from 'react'

import ReactResizeDetector from 'react-resize-detector'

import { useTranslation } from 'react-i18next'

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, TooltipPayload, LabelProps } from 'recharts'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { OneCountryAgeDistribution } from '../../../assets/data/CountryAgeDistribution.types'

import { SeverityTableRow } from '../Scenario/SeverityTable'

import { numberFormatter } from '../../../helpers/numberFormat'

import { colors } from './DeterministicLinePlot'

import { calculatePosition, scrollToRef } from './chartHelper'
import { ResponsiveTooltipContent } from './ResponsiveTooltipContent'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  showHumanized?: boolean
  data?: AlgorithmResult
  ageDistribution?: OneCountryAgeDistribution
  rates?: SeverityTableRow[]
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

    process.env.NODE_ENV !== 'production' && console.warn('Translation incomatible in AgeBarChart.tsx', ...args)
    return String(translation)
  }

  // Ensure age distribution is normalized
  const Z: number = Object.values(ageDistribution).reduce((a, b) => a + b, 0)
  const normAgeDistribution: Record<string, number> = {}
  Object.keys(ageDistribution).forEach((k) => {
    normAgeDistribution[k] = ageDistribution[k] / Z
  })

  const ages = Object.keys(normAgeDistribution)
  const lastDataPoint = data.trajectory.mean[data.trajectory.mean.length - 1]
  const plotData = ages.map((age) => ({
    name: age,
    fraction: Math.round(normAgeDistribution[age] * 1000) / 10,
    peakSevere: Math.round(Math.max(...data.trajectory.mean.map((x) => x.current.severe[age]))),
    peakCritical: Math.round(Math.max(...data.trajectory.mean.map((x) => x.current.critical[age]))),
    peakOverflow: Math.round(Math.max(...data.trajectory.mean.map((x) => x.current.overflow[age]))),
    totalFatalities: Math.round(lastDataPoint.cumulative.fatality[age]),
  }))

  const tooltipFormatter = (
    value: string | number | Array<string | number>,
    name: string,
    entry: TooltipPayload,
    index: number,
  ) => <span>{formatNumber(Number(value))}</span>

  const tickFormatter = (value: number) => formatNumberRounded(value)

  return (
    <div className="w-100 h-100" data-testid="AgeBarChart">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(300, width / ASPECT_RATIO)
          const tooltipPosition = calculatePosition(height)

          return (
            <>
              <h3>{t('Distribution across age groups')}</h3>

              <div ref={casesChartRef} />
              <BarChart
                onClick={() => scrollToRef(casesChartRef)}
                width={forcedWidth || width}
                height={forcedHeight || height}
                data={plotData}
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
                <Tooltip position={tooltipPosition} content={ResponsiveTooltipContent} />
                <Legend verticalAlign="bottom" />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="peakSevere" fill={colors.severe} name={t('peak severe')} label={label} />
                <Bar dataKey="peakCritical" fill={colors.critical} name={t('peak critical')} label={label} />
                <Bar dataKey="peakOverflow" fill={colors.overflow} name={t('peak overflow')} label={label} />
                <Bar dataKey="totalFatalities" fill={colors.fatality} name={t('total deaths')} label={label} />
                <Bar dataKey="fraction" fill="#aaaaaa" name={t('% of population')} yAxisId={'ageDisAxis'} />
              </BarChart>

              <div ref={percentageChartRef} />
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
