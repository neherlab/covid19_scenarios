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

export default function TableResult({ result }: PropsType) {
  const sampleEvery = (arr: ExportedTimePoint[], step: number) => {
    return arr.reduce<ExportedTimePoint[]>((acc, curr, i) => {
      if (i % step === 0) {
        return [...acc, curr]
      }
      return acc
    }, [])
  }

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
                {Math.round(line.current.severe.total)}{' '}
                <div style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block' }}>
                    <sup style={{ display: 'block', position: 'relative' }}>
                      +{Math.round(downSampled.upper[i].current.severe.total)}
                    </sup>
                    <sub style={{ display: 'block', position: 'relative' }}>
                      -{Math.round(downSampled.lower[i].current.severe.total)}
                    </sub>
                  </span>
                </div>
              </td>
              <td style={{ backgroundColor: chroma(colors.critical).alpha(0.1).hex() }}>
                {Math.round(line.current.critical.total)}{' '}
                <div style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block' }}>
                    <sup style={{ display: 'block', position: 'relative' }}>
                      +{Math.round(downSampled.upper[i].current.critical.total)}
                    </sup>
                    <sub style={{ display: 'block', position: 'relative' }}>
                      -{Math.round(downSampled.lower[i].current.critical.total)}
                    </sub>
                  </span>
                </div>
              </td>
              <td style={{ backgroundColor: chroma(colors.recovered).alpha(0.1).hex() }}>
                {Math.round(line.cumulative.recovered.total)}{' '}
                <div style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block' }}>
                    <sup style={{ display: 'block', position: 'relative' }}>
                      +{Math.round(downSampled.upper[i].cumulative.recovered.total)}
                    </sup>
                    <sub style={{ display: 'block', position: 'relative' }}>
                      -{Math.round(downSampled.lower[i].cumulative.recovered.total)}
                    </sub>
                  </span>
                </div>
              </td>
              <td style={{ backgroundColor: chroma(colors.fatality).alpha(0.1).hex() }}>
                {Math.round(line.cumulative.fatality.total)}{' '}
                <div style={{ display: 'inline-block' }}>
                  <span style={{ display: 'inline-block' }}>
                    <sup style={{ display: 'block', position: 'relative' }}>
                      +{Math.round(downSampled.upper[i].cumulative.fatality.total)}
                    </sup>
                    <sub style={{ display: 'block', position: 'relative' }}>
                      -{Math.round(downSampled.lower[i].cumulative.fatality.total)}
                    </sub>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
