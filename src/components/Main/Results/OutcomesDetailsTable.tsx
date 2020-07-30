import React from 'react'

import { isNil } from 'lodash'

import moment from 'moment'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Table } from 'reactstrap'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { State } from '../../../state/reducer'
import { selectResult } from '../../../state/algorithm/algorithm.selectors'

import { numberFormatter } from '../../../helpers/numberFormat'

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

  // Three-way range
  if (valueFinite && lowerFinite && upperFinite) {
    return (
      <div>
        ({numberFormat(lower)}, <b>{numberFormat(value)}</b>, {numberFormat(upper)})
      </div>
    )
  }

  // Just value
  if ((!lowerFinite || !upperFinite) && valueFinite) {
    return <div>{numberFormat(value)}</div>
  }

  // Two-way range ("from - $to")
  if (!valueFinite && lowerFinite && upperFinite) {
    const lowerFormatted = numberFormat(lower)
    const upperFormatted = numberFormat(upper)

    // Avoid formats like "0 - 0" and "5k - 5k"
    if (lowerFormatted === upperFormatted) {
      return <div>{lowerFormatted}</div>
    }

    return (
      <div>
        {numberFormat(lower)} - {numberFormat(upper)}
      </div>
    )
  }

  // Catch-all value is zero
  return <div>{'0'}</div>
}

export interface OutcomesDetailsTableProps {
  result?: AlgorithmResult
  forPrint?: boolean
  formatter?: (num: number) => string
}

const mapStateToProps = (state: State) => ({
  result: selectResult(state),
})

const mapDispatchToProps = {}

export const OutcomesDetailsTable = connect(mapStateToProps, mapDispatchToProps)(OutcomesDetailsTableDisconnected)

export function OutcomesDetailsTableDisconnected({
  result,
  forPrint,
  formatter = Number.toString,
}: OutcomesDetailsTableProps) {
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
    <div className={classNames('outcomes-table-wrapper', forPrint && 'print-preview')}>
      <Table className={classNames('outcomes-table', forPrint && 'print-preview')} bordered>
        <thead>
          <tr>
            <th scope="col" className="outcome-table-th outcome-table-th-date">
              {t(`Date`)}
            </th>
            <th scope="col" className="outcome-table-th bg-severe">
              {t(`Severe`)}
            </th>
            <th scope="col" className="outcome-table-th bg-critical">
              {t(`Critical`)}
            </th>
            <th scope="col" className="outcome-table-th bg-overflow">
              {t(`ICU Overflow`)}
            </th>
            <th scope="col" className="outcome-table-th bg-fatality">
              {t(`Deaths`)}
            </th>
            <th scope="col" className="outcome-table-th bg-recovered">
              {t(`Recovered`)}
            </th>
          </tr>
        </thead>

        <tbody className="outcomes-table-body">
          {downsampled.middle.map((line, i) => (
            <tr key={line.time}>
              <th scope="row">{dateFormat(line.time)}</th>
              <td className="bg-severe">
                <NumberWithUncertainty
                  lower={downsampled.lower[i].current.severe.total}
                  upper={downsampled.upper[i].current.severe.total}
                />
              </td>
              <td className="bg-critical">
                <NumberWithUncertainty
                  lower={downsampled.lower[i].current.critical.total}
                  upper={downsampled.upper[i].current.critical.total}
                />
              </td>
              <td className="bg-overflow">
                <NumberWithUncertainty
                  lower={downsampled.lower[i].current.overflow.total}
                  upper={downsampled.upper[i].current.overflow.total}
                />
              </td>
              <td className="bg-fatality">
                <NumberWithUncertainty
                  lower={downsampled.lower[i].cumulative.fatality.total}
                  upper={downsampled.upper[i].cumulative.fatality.total}
                />
              </td>
              <td className="bg-recovered">
                <NumberWithUncertainty
                  lower={downsampled.lower[i].cumulative.recovered.total}
                  upper={downsampled.upper[i].cumulative.recovered.total}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
