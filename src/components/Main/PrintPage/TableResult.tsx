import React from 'react'

import moment from 'moment'
import chroma from 'chroma-js'

import type { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'
import { colors } from '../Results/ChartCommon'

export interface TableResultProps {
  result: AlgorithmResult
}

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
  if ((!lower || !upper) && value) {
    return <div>{Math.round(value)}</div>
  }
  if (!value && lower && upper) {
    return (
      <div>
        {Math.round(lower)} - {Math.round(upper)}
      </div>
    )
  }
  if (value && lower && upper) {
    return (
      <div>
        ({Math.round(lower)}, <b>{Math.round(value)}</b>, {Math.round(upper)})
      </div>
    )
  }
  return <div>{'0'}</div>
}

export default function TableResult({ result }: TableResultProps) {
  const downSampled = {
    middle: sampleEvery(result.trajectory.middle, STEP),
    lower: sampleEvery(result.trajectory.lower, STEP),
    upper: sampleEvery(result.trajectory.upper, STEP),
  }

  return (
    <div className="tableResult">
      <table>
        <thead>
          <tr>
            <td style={{ width: '3cm' }}>
              <b>date</b>
            </td>
            <td style={{ backgroundColor: chroma(colors.severe).alpha(0.1).hex(), width: '3cm' }}>
              <b>hospitalized</b>
            </td>
            <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex(), width: '3cm' }}>
              <b>ICU</b>
            </td>
            <td style={{ backgroundColor: chroma(colors.overflow).alpha(0.1).hex(), width: '3cm' }}>
              <b>overflow</b>
            </td>
            <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex(), width: '3.5cm' }}>
              <b>deaths</b>
            </td>
            <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex(), width: '4cm' }}>
              <b>recovered</b>
            </td>
          </tr>
        </thead>
        <tbody>
          {downSampled.middle.map((line, i) => (
            <tr key={line.time}>
              <td>{dateFormat(line.time)}</td>
              <td style={{ backgroundColor: chroma(colors.severe).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  lower={downSampled.lower[i].current.severe.total}
                  upper={downSampled.upper[i].current.severe.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  lower={downSampled.lower[i].current.critical.total}
                  upper={downSampled.upper[i].current.critical.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.overflow).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  lower={downSampled.lower[i].current.overflow.total}
                  upper={downSampled.upper[i].current.overflow.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  lower={downSampled.lower[i].cumulative.fatality.total}
                  upper={downSampled.upper[i].cumulative.fatality.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  lower={downSampled.lower[i].cumulative.recovered.total}
                  upper={downSampled.upper[i].cumulative.recovered.total}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
