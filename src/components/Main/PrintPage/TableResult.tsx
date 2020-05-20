import React from 'react'

import moment from 'moment'
import chroma from 'chroma-js'
import { useTranslation } from 'react-i18next'
import { Table } from 'reactstrap'

import type { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'
import { numberFormatter } from '../../../helpers/numberFormat'
import { colors } from '../Results/ChartCommon'

import './TableResult.scss'

const STEP = 7

const dateFormat = (time: number) => moment(time).format('MMM DD YYYY')

export function sampleEvery(arr: ExportedTimePoint[], step: number): ExportedTimePoint[] {
  return arr.reduce<ExportedTimePoint[]>((acc, curr, i) => {
    if (i % step === 0) {
      return [...acc, curr]
    }
    return acc
  }, [])
}

interface NumberWithUncertaintyProps {
  value?: number
  lower?: number
  upper?: number
}

export function NumberWithUncertainty({ value, lower, upper }: NumberWithUncertaintyProps) {
  const formatter = numberFormatter(true, true)

  if ((!lower || !upper) && value) {
    return <div>{formatter(value)}</div>
  }
  if (!value && lower && upper) {
    return (
      <div>
        {formatter(lower)} - {formatter(upper)}
      </div>
    )
  }
  if (value && lower && upper) {
    return (
      <div>
        ({formatter(lower)}, <b>{formatter(value)}</b>, {formatter(upper)})
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

  console.log({ result })
  console.log({ downsampled })

  return (
    <Table className="outcomes-table">
      <thead>
        <tr>
          <th scope="col" className="text-center col-auto" style={{ width: '3cm' }}>
            <b>{t(`Date`)}</b>
          </th>
          <th
            scope="col"
            className="text-center col-auto"
            style={{ backgroundColor: pale(colors.severe), width: '3cm' }}
          >
            <b>{t(`Severe`)}</b>
          </th>
          <th
            scope="col"
            className="text-center col-auto"
            style={{ backgroundColor: pale(colors.critical), width: '3cm' }}
          >
            <b>{t(`Critical`)}</b>
          </th>
          <th
            scope="col"
            className="text-center col-auto"
            style={{ backgroundColor: pale(colors.overflow), width: '3cm' }}
          >
            <b>{t(`ICU Overflow`)}</b>
          </th>
          <th
            scope="col"
            className="text-center col-auto"
            style={{ backgroundColor: pale(colors.fatality), width: '3.5cm' }}
          >
            <b>{t(`Deaths`)}</b>
          </th>
          <th
            scope="col"
            className="text-center col-auto"
            style={{ backgroundColor: pale(colors.recovered), width: '4cm' }}
          >
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
