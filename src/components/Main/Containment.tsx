import React from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import * as math from 'mathjs'
import ReactResizeDetector from 'react-resize-detector'

const ASPECT_RATIO = 16 / 9
const MAX_TRANSMISSION_RATIO = 1.2

function uniformDatesBetween(min, max, n) {
  const d = (max - min) / (n - 1)
  var dates = d3.range(Number(min), Number(max) + d, d)
  return dates.map(d => new Date(d))
}

interface TimePoint {
  t: Date
  y: number
}

export type TimeSeries = TimePoint[]

export function makeTimeSeries(
  tMin: Date,
  tMax: Date,
  values: number[],
): TimeSeries {
  const dates = uniformDatesBetween(tMin, tMax, values.length)
  const tSeries = []
  for (let i = 0; i < values.length; i++) {
    tSeries.push({ t: dates[i], y: values[i] })
  }
  return tSeries
}

// *****************************************************
// ** Graph and App components
// *****************************************************

class Graph extends React.Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   minTime: this.props.minTime,
    //   maxTime: this.props.maxTime,
    //   data: this.props.data,
    // }
    // newData
    // const n     = this.props.data.length;
    // const dates = uniformDatesBetween(this.props.minTime, this.props.maxTime, n);
    // for (let i = 0; i < n; i++) {
    //     newData.push({"t": dates[i], "y": this.props.data[i].y});
    // }
  }

  // updateState(): void {
  //   const n = this.props.data.length
  //   const dates = uniformDatesBetween(this.props.minTime, this.props.maxTime, n)
  //   newData.forEach(function(_, i) {
  //     this[i].t = dates[i]
  //   }, newData)
  //
  //   this.state.minTime = this.props.minTime
  //   this.state.maxTime = this.props.maxTime
  // }

  componentDidMount(): void {
    this.draw()
    // NOTE: Ensures the dates are properly populated.
    // this.props.setData(newData)
  }

  componentDidUpdate(): void {
    this.draw()
  }

  draw() {
    const { width, height, data } = this.props
    console.log({ props: this.props })

    // if (
    //   this.props.minTime != this.state.minTime ||
    //   this.props.maxTime != this.state.maxTime
    // ) {
    //   this.updateState()
    //   this.props.setData(newData)
    // }

    let newData = data
    const minTime = data[0].t
    const maxTime = data[data.length - 1].t

    const margin = {
      top: math.round(0.1 * height),
      right: math.round(0.15 * height),
      left: math.round(0.15 * height),
      bottom: math.round(0.2 * height),
    }

    var tScale = d3
      .scaleTime()
      .domain([minTime, maxTime])
      .range([0, width - margin.right - margin.left])

    var yScale = d3
      .scaleLinear()
      .domain([0, MAX_TRANSMISSION_RATIO])
      .range([height - margin.top - margin.bottom, 0])

    this.d3Graph = d3
      .select(ReactDOM.findDOMNode(this.refs.graph))
      .html(null) // clear everything
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var drawLine = d3
      .line()
      .x(function(d) {
        return tScale(d.t)
      })
      .y(function(d) {
        return yScale(d.y)
      })
      .curve(d3.curveMonotoneX)

    let started = (_, i, n) => {
      d3.select(n[i])
        .raise()
        .classed('active', true)
    }

    let dragged = (d, i, n) => {
      d.y = yScale.invert(d3.event.y)
      if (d.y > MAX_TRANSMISSION_RATIO) {
        d.y = MAX_TRANSMISSION_RATIO
      } else if (d.y < 0) {
        d.y = 0
      }

      d3.select(n[i]).attr('cy', yScale(d.y))

      newData[i].y = d.y
      d3.select(ReactDOM.findDOMNode(this.refs.graph))
        .select('.line-graph')
        .attr('d', drawLine)
    }

    let ended = (_, i, n) => {
      this.props.setData(newData)
      d3.select(n[i]).classed('active', false)
    }

    // X axis
    this.d3Graph
      .append('g')
      .attr('class', 'x-axis')
      .attr(
        'transform',
        'translate(0,' + (height - margin.bottom - margin.top) + ')',
      )
      .call(d3.axisBottom(tScale).tickFormat(d3.timeFormat('%Y-%m-%d')))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-65)')

    // Y axis
    this.d3Graph
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale))

    // text label for the y axis
    this.d3Graph
      .append('text')
      .attr('dy', '1em')
      .attr('y', -margin.left)
      .attr('x', -height / 2 + 60)
      .style('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .text('Transmission rel to baseline')

    // Hovering dashed line
    this.d3Graph
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
    this.d3Graph
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
    this.d3Graph
      .append('path')
      .datum(newData)
      .attr('class', 'line-graph')
      .attr('fill', 'none')
      .attr('stroke', '#ffab00')
      .attr('stroke-width', 3)
      .attr('d', drawLine)

    // Draggable markers
    this.d3Graph
      .selectAll('.dot')
      .data(newData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', function(d) {
        return tScale(d.t)
      })
      .attr('cy', function(d) {
        return yScale(d.y)
      })
      .attr('r', 8)

    var Root = this.d3Graph
    this.d3Graph
      .selectAll('.dot')
      .on('mouseover', function(d, i) {
        d3.select(this)
          .attr('fill', '#ffab00')
          .attr('r', 10)
        Root.select('#temp-line')
          .attr('opacity', 0.3)
          .attr('x1', tScale(d.t))
          .attr('x2', tScale(d.t))
      })
      .on('mouseout', function() {
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

  render() {
    const { width, height } = this.props
    if (!width || !height) {
      return null
    }

    return (
      <svg
        className="noselect"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g ref="graph" />
      </svg>
    )
  }
}

export interface ContainControlProps {
  data: TimeSeries
  minTime: Date
  maxTime: Date
  onDataChange(timeSeries: TimeSeries): void
}

export function ContainControl({
  data,
  onDataChange,
  minTime,
  maxTime,
}: ContainControlProps) {
  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width / ASPECT_RATIO

          return (
            <Graph
              data={data}
              setData={onDataChange}
              minTime={minTime}
              maxTime={maxTime}
              width={width}
              height={height}
            />
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
