import React from 'react'

import moment from 'moment'
import chroma from 'chroma-js'

import { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'
import { colors } from '../Results/DeterministicLinePlot'

interface PropsType {
  result: AlgorithmResult
}

const STEP = 7

const dateFormat = (time: number) => moment(time).format('MMM DD YYYY')

export default function TableResult({ result }: PropsType) {
  const downSampled = {
    mean: result.trajectory.mean.reduce<ExportedTimePoint[]>((acc, curr, i) => {
      if (i % STEP === 0) {
        return [...acc, curr]
      }
      return acc
    }, []),

    variance: result.trajectory.variance.reduce<ExportedTimePoint[]>((acc, curr, i) => {
      if (i % STEP === 0) {
        return [...acc, curr]
      }
      return acc
    }, []),
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
                {Math.round(line.current.severe.total)}±
                {Math.round(Math.sqrt(downSampled.variance[i].current.severe.total))}
              </td>
              <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex() }}>
                {Math.round(line.current.critical.total)}±
                {Math.round(Math.sqrt(downSampled.variance[i].current.critical.total))}
              </td>
              <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex() }}>
                {Math.round(line.cumulative.recovered.total)}±
                {Math.round(Math.sqrt(downSampled.variance[i].cumulative.recovered.total))}
              </td>
              <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex() }}>
                {Math.round(line.cumulative.fatality.total)}±
                {Math.round(Math.sqrt(downSampled.variance[i].cumulative.fatality.total))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
