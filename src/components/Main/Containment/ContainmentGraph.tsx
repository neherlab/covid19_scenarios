import React, { useEffect, useRef } from 'react'

import * as d3 from 'd3'
import * as math from 'mathjs'
import ReactResizeDetector from 'react-resize-detector'

import { TimeSeries } from '../../../algorithms/TimeSeries'

const ASPECT_RATIO = 16 / 9
const MAX_TRANSMISSION_RATIO = 1.2

export interface DrawParams {
  data: TimeSeries
  width: number
  height: number
  d3ref: React.RefObject<SVGSVGElement>
  onDataChange(timeSeries: TimeSeries): void
}

function draw({ data, width, height, onDataChange, d3ref }: DrawParams) {
  const newData = data.map(d => {
    return {t:d.t, y:d.y}
  }) // copy
  const tMin = data[0].t
  const tMax = data[data.length - 1].t
  const svg = d3ref.current

  const margin = {
    top: math.round(0.1 * height),
    right: math.round(0.15 * height),
    left: math.round(0.15 * height),
    bottom: math.round(0.2 * height),
  }

  const tScale = d3
    .scaleTime()
    .domain([tMin, tMax])
    .range([0, width - margin.right - margin.left])

  const yScale = d3
    .scaleLinear()
    .domain([0, MAX_TRANSMISSION_RATIO])
    .range([height - margin.top - margin.bottom, 0])

  const graph = d3
    .select(svg)
    .html(null) // clear everything
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const drawLine = d3
    .line()
    .x(d => tScale(d.t))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX)

  const started = (_, i, n) => {
    d3.select(n[i])
      .raise()
      .classed('active', true)
  }

  const dragged = (d, i, n) => {
    d.y = yScale.invert(d3.event.y)
    if (d.y > MAX_TRANSMISSION_RATIO) {
      d.y = MAX_TRANSMISSION_RATIO
    } else if (d.y < 0) {
      d.y = 0
    }

    d3.select(n[i]).attr('cy', yScale(d.y))

    newData[i].y = d.y
    d3.select(svg)
      .select('.line-graph')
      .attr('d', drawLine)
  }

  const ended = (_, i, n) => {
    onDataChange(newData)
    d3.select(n[i]).classed('active', false)
  }

  // X axis
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - margin.bottom - margin.top})`)
    .call(d3.axisBottom(tScale).tickFormat(d3.timeFormat('%Y-%m-%d')))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)')

  // Y axis
  graph
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale))

  // text label for the y axis
  graph
    .append('text')
    .attr('dy', '1em')
    .attr('y', -margin.left)
    .attr('x', -height / 2 + 60)
    .style('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Transmission rel to baseline')

  // Hovering dashed line
  graph
    .append('line')
    .attr('id', 'temp-line')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', 0)
    .attr('y2', height - margin.top - margin.bottom)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('opacity', 0)
    .style('stroke-dasharray', '3, 3')

  // Baseline transmission
  graph
    .append('line')
    .attr('id', 'base-line')
    .attr('x1', 0)
    .attr('x2', width - margin.left - margin.right)
    .attr('y1', yScale(1))
    .attr('y2', yScale(1))
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('opacity', 0.5)
    .style('stroke-dasharray', '4, 2, 1')

  // Line graph
  graph
    .append('path')
    .datum(newData)
    .attr('class', 'line-graph')
    .attr('fill', 'none')
    .attr('stroke', '#ffab00')
    .attr('stroke-width', 3)
    .attr('d', drawLine)

  // Draggable markers
  graph
    .selectAll('.dot')
    .data(newData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => tScale(d.t))
    .attr('cy', d => yScale(d.y))
    .attr('r', 8)

  const Root = graph
  graph
    .selectAll('.dot')
    .on('mouseover', function onMouseover(d, i) {
      d3.select(this)
        .attr('fill', '#ffab00')
        .attr('r', 10)
      Root.select('#temp-line')
        .attr('opacity', 0.3)
        .attr('x1', tScale(d.t))
        .attr('x2', tScale(d.t))
    })
    .on('mouseout', function onMouseOut() {
      d3.select(this)
        .attr('fill', 'black')
        .attr('r', 8)
      Root.select('#temp-line').attr('opacity', 0)
    })
    .call(
      d3
        .drag()
        .subject(d => ({ x: tScale(d.t), y: yScale(d.y) }))
        .on('start', started)
        .on('drag', dragged)
        .on('end', ended),
    )
}

export interface ContainmentGraphImplProps {
  data: TimeSeries
  width: number
  height: number
  onDataChange(timeSeries: TimeSeries): void
}

export function ContainmentGraphImpl({ data, onDataChange, width, height }: ContainmentGraphImplProps) {
  const d3ref = useRef<SVGSVGElement>(null)

  // FIXME: can we avoid some of the re-rendering? Add array of dependencies. Ensure proper cleanups.
  useEffect(() => draw({ data, onDataChange, width, height, d3ref }))

  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width / ASPECT_RATIO

          return (
            <svg className="noselect" width={width} height={height} viewBox={`0 0 ${width} ${height}`} ref={d3ref} />
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}

export interface ContainmentGraphProps {
  data: TimeSeries
  onDataChange(timeSeries: TimeSeries): void
}

export function ContainmentGraph({ data, onDataChange }: ContainmentGraphProps) {
  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width / ASPECT_RATIO

          return <ContainmentGraphImpl data={data} onDataChange={onDataChange} width={width} height={height} />
        }}
      </ReactResizeDetector>
    </div>
  )
}
