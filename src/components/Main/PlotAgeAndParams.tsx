import React from 'react'

import Plot from 'react-plotly.js'

import { AlgorithmResult } from '../../algorithms/Result.types'

export interface LinePlotProps {
  data?: AlgorithmResult
}

export default function AgePlot({ data }: LinePlotProps) {
  if (!data) {
    return null
  }
  const params = data.params;
  const ages = Object.keys(params.ageDistribution).map(x => x)
  const agesFrac = ages.map(x => params.ageDistribution[x])
  const deathByAgeGroup = {}

  return (
    <Plot
      data={[
        {
          x: ages,
          y: agesFrac,
          type: 'bar',
          line: { color: '#E2F0CB', width: 2 },
          marker: { color: '#E2F0CB', size: 3 },
          name: 'Age distribution',
        },
      ]}
      layout={{
        title: 'Age distribution',
        xaxis: {
          tickmode: 'linear',
          title: "Age group"
        },
        yaxis: {
            title: "Fraction of population"
        }
      }}
    />
  )
}
