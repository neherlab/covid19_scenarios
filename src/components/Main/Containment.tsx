import React from 'react'
import ReactDOM from 'react-dom'

import * as d3 from 'd3'
import ReactResizeDetector from 'react-resize-detector'

const ASPECT_RATIO = 16 / 9

var n = 10

function uniformDatesBetween(min, max) {
    const d = (max - min) / (n-1);
    var dates = d3.range(Number(min), Number(max) + d, d)
    return dates.map(d => new Date(d))
}

// *****************************************************
// ** Graph and App components
// *****************************************************

class Graph extends React.Component {
  componentDidMount(): void {
    this.draw()
  }

  componentDidUpdate(): void {
    this.draw()
  }

  draw() {
    const { width, height } = this.props

    const dates = uniformDatesBetween(this.props.minTime, this.props.maxTime);
    if (this.props.data.length == 0) {
        for (let i = 0; i < n; i++) {
          this.props.data.push({ y: 0, t: dates[i] })
        }
    } else {
        for (let i = 0; i < n; i++) {
            this.props.data[i].t = dates[i];
        }
    }

    var margin = { top: 50, right: 50, bottom: 75, left: 50 }

    var tScale = d3
      .scaleTime()
      .domain([this.props.minTime, this.props.maxTime])
      .range([0, width - margin.right - margin.left])

    var yScale = d3
      .scaleLinear()
      .domain([0, 1])
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
      if (d.y > 1) {
        d.y = 1
      } else if (d.y < 0) {
        d.y = 0
      }

      d3.select(n[i]).attr('cy', yScale(d.y))

      this.props.data[i].y = d.y
      d3.select(ReactDOM.findDOMNode(this.refs.graph))
        .select('.line-graph')
        .attr('d', drawLine)
    }

    let ended = (_, i, n) => {
      d3.select(n[i]).classed('active', false)
    }

    this.d3Graph
      .append('path')
      .datum(this.props.data)
      .attr('class', 'line-graph')
      .attr('fill', 'none')
      .attr('stroke', '#ffab00')
      .attr('stroke-width', 3)
      .attr('d', drawLine)

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

    // text label for the x axis
    // this.d3Graph.append("text")
    //     .attr("transform",
    //       "translate(" + (width/2-50) + " ," +
    //                      (height - margin.top - margin.bottom + 35) + ")")
    //     .style("text-anchor", "middle")
    //     .text("Date");

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
      .text('Transmission Reduction')

    this.d3Graph
      .selectAll('.dot')
      .data(this.props.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', function(d) {
        return tScale(d.t)
      })
      .attr('cy', function(d) {
        return yScale(d.y)
      })
      .attr('r', 5)

    var Root = this.d3Graph
    this.d3Graph
      .selectAll('.dot')
      .on('mouseover', function(d, i) {
        d3.select(this)
          .attr('fill', '#ffab00')
          .attr('r', 7)
        Root.append('path')
          .datum([
            { y: 0, t: d.t },
            { y: height, t: d.t },
          ])
          .attr('class', 'temp-line')
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('opacity', 0.2)
          .style('stroke-dasharray', '3, 3')
          .attr(
            'd',
            d3
              .line()
              .x(function(d) {
                return tScale(d.t)
              })
              .y(function(d) {
                return yScale(d.y)
              })
              .curve(d3.curveMonotoneX),
          )
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('fill', 'black')
          .attr('r', 5)
        Root.select('.temp-line').remove()
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

export default class ContainControl extends React.Component {
  render() {
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
                data={this.props.data}
                minTime={this.props.minTime}
                maxTime={this.props.maxTime}
                width={width}
                height={height}
              />
            )
          }}
        </ReactResizeDetector>
      </div>
    )
  }
}
