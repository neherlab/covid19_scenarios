import React from 'react'

import moment from 'moment'
import chroma from 'chroma-js'

import { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'
import { colors } from '../Results/ChartCommon'

interface PropsType {
  result: AlgorithmResult
}

const STEP = 7

const dateFormat = (time: number) => moment(time).format('MMM DD YYYY')

function sampleEvery(arr: ExportedTimePoint[], step: number): ExportedTimePoint[] {
  return arr.reduce<ExportedTimePoint[]>((acc, curr, i) => {
    if (i % step === 0) {
      return [...acc, curr]
    }
    return acc
  }, [])
}

interface NumberPropsType {
  value: number
  lower: number
  upper: number
}

function NumberWithUncertainty({ value, lower, upper }: NumberPropsType) {
  return (
    <div>
      {Math.round(value)}{' '}
      <div style={{ display: 'inline-block' }}>
        <span style={{ display: 'inline-block' }}>
          <sup style={{ display: 'block', position: 'relative' }}>+{Math.round(lower)}</sup>
          <sub style={{ display: 'block', position: 'relative' }}>-{Math.round(upper)}</sub>
        </span>
      </div>
    </div>
  )
}

export default function TableResult({ result }: PropsType) {
  const downSampled = {
    mean: sampleEvery(result.trajectory.mean, STEP),
    lower: sampleEvery(result.trajectory.lower, STEP),
    upper: sampleEvery(result.trajectory.upper, STEP),
  }

  return (
    <div className="tableResult">
      <table>
        <thead>
          <tr>
            <td>date</td>
            <td style={{ backgroundColor: chroma(colors.severe).alpha(0.1).hex() }}>hospitalized</td>
            <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex() }}>ICU</td>
            <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex() }}>recovered</td>
            <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex() }}>deaths</td>
          </tr>
        </thead>
        <tbody>
          {downSampled.mean.map((line, i) => (
            <tr key={line.time}>
              <td>{dateFormat(line.time)}</td>
              <td style={{ backgroundColor: chroma(colors.severe).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  value={line.current.severe.total}
                  lower={downSampled.lower[i].current.severe.total}
                  upper={downSampled.upper[i].current.severe.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  value={line.current.critical.total}
                  lower={downSampled.lower[i].current.critical.total}
                  upper={downSampled.upper[i].current.critical.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  value={line.cumulative.recovered.total}
                  lower={downSampled.lower[i].cumulative.recovered.total}
                  upper={downSampled.upper[i].cumulative.recovered.total}
                />
              </td>
              <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex() }}>
                <NumberWithUncertainty
                  value={line.cumulative.fatality.total}
                  lower={downSampled.lower[i].cumulative.fatality.total}
                  upper={downSampled.upper[i].cumulative.fatality.total}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
