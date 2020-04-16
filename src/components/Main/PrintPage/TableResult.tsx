import React from 'react'

import { Table } from 'reactstrap'

import { AlgorithmResult, ExportedTimePoint } from '../../../algorithms/types/Result.types'

import { dateFormat } from './dateFormat'

const STEP = 7

export interface TableResultProps {
  result: AlgorithmResult
}

export default function TableResult({ result }: TableResultProps) {
  const { trajectory } = result.deterministic

  const entries = trajectory
    .reduce((acc, curr, i, _0) => {
      if (i % STEP === 0) {
        return [...acc, curr]
      }
      return acc
    }, new Array<ExportedTimePoint>())

    .map((line) => {
      return {
        time: dateFormat(new Date(line.time)),
        severe: Math.round(line.current.severe.total),
        critical: Math.round(line.current.critical.total),
        overflow: Math.round(line.current.overflow.total),
        recovered: Math.round(line.cumulative.recovered.total),
        fatality: Math.round(line.cumulative.fatality.total),
      }
    })

  return (
    <Table className="table-result">
      <thead>
        <tr>
          <th>{`Date`}</th>
          <th>{`Hospitalized`}</th>
          <th>{`In ICU`}</th>
          <th>{`ICU overflow`}</th>
          <th>
            {`Deaths`}
            <br />
            {`(cumulative)`}
          </th>
          <th>
            {`Recovered`}
            <br />
            {`(cumulative)`}
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ time, severe, critical, overflow, recovered, fatality }) => (
          <tr key={time}>
            <td>{time}</td>
            <td>{severe}</td>
            <td>{critical}</td>
            <td>{overflow}</td>
            <td>{fatality}</td>
            <td>{recovered}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
