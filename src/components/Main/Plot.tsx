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
  const trajectory = data.trajectory;
  const time = trajectory.map(x => new Date(x.time))
  const susceptible = trajectory.map(x => Math.round(x.susceptible))
  const exposed = trajectory.map(x => Math.round(x.exposed))
  const infectious = trajectory.map(x => Math.round(x.infectious))
  const hospitalized = trajectory.map(x => Math.round(x.hospitalized))
  const recovered = trajectory.map(x => Math.round(x.recovered))
  const dead = trajectory.map(x => Math.round(x.dead))

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
          name: 'Susceptible',
          visible: 'legendonly'
        },
        {
          x: time,
          y: exposed,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFB7B2', width: 2 },
          marker: { color: '#FFB7B2', size: 3 },
          name: 'Exposed',
          visible: 'legendonly'
        },
        {
          x: time,
          y: infectious,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FF9AA2', width: 2 },
          marker: { color: '#FF9AA2', size: 3 },
          name: 'Cases',
        },
        {
          x: time,
          y: hospitalized,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'Hospitalized',
        },
        {
          x: time,
          y: recovered,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#B5EAD7', width: 2 },
          marker: { color: '#B5EAD7', size: 3 },
          name: 'Recovered (cumulative)',
          visible: 'legendonly'
        },
        {
          x: time,
          y: dead,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#C7CEEA', width: 2 },
          marker: { color: '#C7CEEA', size: 3 },
          name: 'Deaths (cumulative)',
        },
      ]}
      layout={{
        title: 'Outbreak Trajectory',
        xaxis: {
          tickmode: 'linear',
          tickformat: '%Y-%m-%d',
          tickmode:'auto',
          nticks:10
          // dtick: 14 * 24 * 60 * 60 * 1000, // milliseconds
        },
        yaxis: {
          type: 'log'
        }
      }}
    />
  )
}
