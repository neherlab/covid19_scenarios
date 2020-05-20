import React from 'react'

import { isNil } from 'lodash'

import moment from 'moment'
import chroma from 'chroma-js'
import { useTranslation } from 'react-i18next'
import { Table } from 'reactstrap'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'
import { numberFormatter } from '../../../helpers/numberFormat'
import { colors } from '../Results/ChartCommon'

import './TableResult.scss'

const STEP = 7

const formatter = numberFormatter(true, true)

function numberFormat(x?: number): string {
  return formatter(x ?? 0)
}

function dateFormat(time: number) {
  return moment(time).format('MMM DD YYYY')
}

/**
 * Samples array values with a given step.
 * For example, if step is 7, it will return an array with every 7th value from the original array.
 */
export function sampleEvery<T>(arr: T[], step: number): T[] {
  return arr.filter((_0, i) => i % step === 0)
}

interface NumberWithUncertaintyProps {
  value?: number
  lower?: number
  upper?: number
}

export function NumberWithUncertainty({ value, lower, upper }: NumberWithUncertaintyProps) {
  const lowerFinite = !isNil(lower) && Number.isFinite(lower)
  const valueFinite = !isNil(value) && Number.isFinite(value)
  const upperFinite = !isNil(upper) && Number.isFinite(upper)

  if (valueFinite && lowerFinite && upperFinite) {
    return (
      <div>
        ({numberFormat(lower)}, <b>{numberFormat(value)}</b>, {numberFormat(upper)})
      </div>
    )
  }

  if ((!lowerFinite || !upperFinite) && valueFinite) {
    return <div>{numberFormat(value)}</div>
  }

  if (!valueFinite && lowerFinite && upperFinite) {
    if (lower === upper) {
      return <div>{numberFormat(lower)}</div>
    }

    return (
      <div>
        {numberFormat(lower)} - {numberFormat(upper)}
      </div>
    )
  }

  return <div>{'0'}</div>
}

export function pale(color: string): string {
  return chroma(color).alpha(0.1).hex()
}

export interface TableResultProps {
  result?: AlgorithmResult
  formatter?: (num: number) => string
}

export default function TableResult({ result, formatter = Number.toString }: TableResultProps) {
  const { t } = useTranslation()

  if (!result) {
    return null
  }

  const downsampled = {
    middle: sampleEvery(result.trajectory.middle, STEP),
    lower: sampleEvery(result.trajectory.lower, STEP),
    upper: sampleEvery(result.trajectory.upper, STEP),
  }

  return (
    <Table className="outcomes-table">
      <thead>
        <tr>
          <th scope="col" className="text-center col-auto" style={{ width: '3.5cm' }}>
            <b>{t(`Date`)}</b>
          </th>
          <th scope="col" className="text-center col-auto" style={{ backgroundColor: pale(colors.severe) }}>
            <b>{t(`Severe`)}</b>
          </th>
          <th scope="col" className="text-center col-auto" style={{ backgroundColor: pale(colors.critical) }}>
            <b>{t(`Critical`)}</b>
          </th>
          <th scope="col" className="text-center col-auto" style={{ backgroundColor: pale(colors.overflow) }}>
            <b>{t(`ICU Overflow`)}</b>
          </th>
          <th scope="col" className="text-center col-auto" style={{ backgroundColor: pale(colors.fatality) }}>
            <b>{t(`Deaths`)}</b>
          </th>
          <th scope="col" className="text-center col-auto" style={{ backgroundColor: pale(colors.recovered) }}>
            <b>{t(`Recovered`)}</b>
          </th>
        </tr>
      </thead>

      <tbody className="outcomes-table-body">
        {downsampled.middle.map((line, i) => (
          <tr key={line.time}>
            <th scope="row">{dateFormat(line.time)}</th>
            <td style={{ backgroundColor: pale(colors.severe) }}>
              <NumberWithUncertainty
                lower={downsampled.lower[i].current.severe.total}
                upper={downsampled.upper[i].current.severe.total}
              />
            </td>
            <td style={{ backgroundColor: pale(colors.critical) }}>
              <NumberWithUncertainty
                lower={downsampled.lower[i].current.critical.total}
                upper={downsampled.upper[i].current.critical.total}
              />
            </td>
            <td style={{ backgroundColor: pale(colors.overflow) }}>
              <NumberWithUncertainty
                lower={downsampled.lower[i].current.overflow.total}
                upper={downsampled.upper[i].current.overflow.total}
              />
            </td>
            <td style={{ backgroundColor: pale(colors.fatality) }}>
              <NumberWithUncertainty
                lower={downsampled.lower[i].cumulative.fatality.total}
                upper={downsampled.upper[i].cumulative.fatality.total}
              />
            </td>
            <td style={{ backgroundColor: pale(colors.recovered) }}>
              <NumberWithUncertainty
                lower={downsampled.lower[i].cumulative.recovered.total}
                upper={downsampled.upper[i].cumulative.recovered.total}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
