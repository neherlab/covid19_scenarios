import React from 'react'
import moment from 'moment'
import { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'
import { colors } from '../Results/DeterministicLinePlot'

interface PropsType {
  result: AlgorithmResult
}

const STEP = 7

const dateFormat = (time: number) => moment(time).format('MMM Do YY')

export default function TableResult({ result }: PropsType) {
  const downSampled = result.deterministic.trajectory.reduce<ExportedTimePoint[]>((acc, curr, i) => {
    if (i % STEP === 0) {
      return [...acc, curr]
    }
    return acc
  }, [])
  return (
    <div className="tableResult">
      <table>
        <thead>
          <tr>
            <td>date</td>
            <td style={{ backgroundColor: colors.severe }}>hospitalized</td>
            <td style={{ backgroundColor: colors.critical }}>ICU</td>
            <td style={{ backgroundColor: colors.recovered }}>recovered</td>
            <td style={{ backgroundColor: colors.fatality }}>deaths</td>
          </tr>
        </thead>
        <tbody>
          {downSampled.map((line) => (
            <tr key={line.time}>
              <td>{dateFormat(line.time)}</td>
              <td style={{ backgroundColor: colors.severe }}>{Math.round(line.current.severe.total)}</td>
              <td style={{ backgroundColor: colors.critical }}>{Math.round(line.current.critical.total)}</td>
              <td style={{ backgroundColor: colors.recovered }}>{Math.round(line.cumulative.recovered.total)}</td>
              <td style={{ backgroundColor: colors.fatality }}>{Math.round(line.cumulative.fatality.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
