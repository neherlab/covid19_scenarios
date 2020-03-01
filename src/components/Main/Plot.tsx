import React from 'react'

import Plot from 'react-plotly.js'

import { AlgorithmResult } from '../../algorithms/Result.types'

export interface LinePlotProps {
  data?: AlgorithmResult
}

export default function LinePlot({ data }: LinePlotProps) {
  if (!data) {
    return null
  }

  const time = data.map(x => new Date(x.time))
  const susceptible = data.map(x => x.susceptible)
  const exposed = data.map(x => x.exposed)
  const infectious = data.map(x => x.infectious)
  const hospitalized = data.map(x => x.hospitalized)
  // const recovered = data.map(x => x.recovered)
  const dead = data.map(x => x.dead)

  return (
    <Plot
      data={[
        {
          x: time,
          y: susceptible,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#E2F0CB', width: 2 },
          marker: { color: '#E2F0CB', size: 3 },
          name: 'susceptible',
        },
        {
          x: time,
          y: exposed,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFB7B2', width: 2 },
          marker: { color: '#FFB7B2', size: 3 },
          name: 'exposed',
        },
        {
          x: time,
          y: infectious,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FF9AA2', width: 2 },
          marker: { color: '#FF9AA2', size: 3 },
          name: 'infectious',
        },
        {
          x: time,
          y: hospitalized,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'hospitalized',
        },
        // {
        //   x: time,
        //   y: recovered,
        //   type: 'scatter',
        //   mode: 'lines+markers',
        //   line: { color: '#B5EAD7', width: 2 },
        //   marker: { color: '#B5EAD7', size: 3 },
        //   name: 'recovered',
        // },
        {
          x: time,
          y: dead,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#C7CEEA', width: 2 },
          marker: { color: '#C7CEEA', size: 3 },
          name: 'dead',
        },
      ]}
      layout={{
        title: 'Outbreak Trajectory',
        xaxis: {
          tickmode: 'linear',
          tickformat: '%Y-%m-%d',
          dtick: 7 * 24 * 60 * 60 * 1000, // milliseconds
        },
      }}
    />
  )
}
