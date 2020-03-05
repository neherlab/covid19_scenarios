import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'

var width = 600;
var height = 300;
var n = 10;

// *****************************************************
// ** Graph and App components
// *****************************************************

class Graph extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          now: new Date(props.nowTime),
          max: new Date(props.maxTime),
          data: {}
      };

      console.log("Building graph with state", this.state);
  }

  componentDidMount() {
      var margin = {top: 50, right: 50, bottom: 75, left: 50}

      var tScale = d3.scaleTime()
                     .domain([this.state.now, this.state.max])
                     .range([0, width-margin.right-margin.left]);

      const d = (this.state.max-this.state.now)/(n);
      var dates = d3.range(Number(this.state.now), Number(this.state.max) + d, d);
      dates = dates.map((d) => new Date(d));
                
      var xScale = d3.scaleLinear()
                     .domain([0, n-1]) 
                     .range([0, width-margin.right-margin.left]);

      var yScale = d3.scaleLinear()
                     .domain([0, 1])
                     .range([height-margin.top-margin.bottom, 0]);

      var data = d3.range(n).map(function(_, i) { return {"y": d3.randomUniform(1)(), "t": dates[i]} });
      console.log("Data", data);

      this.d3Graph = d3.select(ReactDOM.findDOMNode(this.refs.graph))
                       .attr("width", width)
                       .attr("height", height)
                       .append("g")
                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      var drawLine = d3.line()
                       .x(function(d) { return tScale(d.t); })
                       .y(function(d) { return yScale(d.y); })
                       .curve(d3.curveMonotoneX);

      let started = (_, i, n) => {
          d3.select(n[i])
              .raise()
              .classed('active', true);
      }

      let dragged = (d, i, n) => {
          d.y = yScale.invert(d3.event.y);
          if (d.y > 1) { d.y = 1; }
          else if (d.y < 0) { d.y = 0; }

          d3.select(n[i]).attr("cy", yScale(d.y));

          data[i].y = d.y;
          d3.select(ReactDOM.findDOMNode(this.refs.graph))
             .select(".line-graph")
             .attr("d", drawLine);
      }

      let ended = (_, i, n) => {
          d3.select(n[i]).classed('active', false);
      }

     this.d3Graph.append("path")
         .datum(data)
         .attr("class", "line-graph")
         .attr("fill", "none")
         .attr("stroke", "#ffab00")
         .attr("stroke-width", 3)
         .attr("d", drawLine);

      // X axis
      this.d3Graph.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
          .call(d3.axisBottom(tScale)
                  .tickFormat(d3.timeFormat("%Y-%m-%d"))
          ) 
          .selectAll("text")	
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      // text label for the x axis
      // this.d3Graph.append("text")             
      //     .attr("transform",
      //       "translate(" + (width/2-50) + " ," + 
      //                      (height - margin.top - margin.bottom + 35) + ")")
      //     .style("text-anchor", "middle")
      //     .text("Date");
    
     // Y axis
     this.d3Graph.append("g")
         .attr("class", "y-axis")
         .call(d3.axisLeft(yScale));

      // text label for the y axis
      this.d3Graph.append("text")             
          .attr("dy", "1em")
          .attr("y", -margin.left)
          .attr("x", -height/2+50)
          .style("text-anchor", "middle")
          .attr("transform", "rotate(-90)")
          .text("Containment effect");

    this.d3Graph.selectAll(".dot")
          .data(data)
          .enter().append("circle") 
          .attr("class", "dot")
          .attr("cx", function(d) { return tScale(d.t); })
          .attr("cy", function(d) { return yScale(d.y); })
          .attr("r", 5);

    var Root = this.d3Graph;
    this.d3Graph.selectAll(".dot")
        .on("mouseover", function(d, i) { 
                d3.select(this)
                    .attr("fill", "#ffab00")
                    .attr("r", 7);
                Root.append("path")
                    .datum([{y: 0, t: d.t}, {y: height, t: d.t}])
                    .attr("class", "temp-line")
                    .attr("stroke", "black")
                    .attr("stroke-width", 2)
                    .attr("opacity", .2)
                    .style("stroke-dasharray", ("3, 3"))
                    .attr("d", d3.line()
                                 .x(function(d) {return tScale(d.t); })
                                 .y(function(d) {return yScale(d.y);})
                                 .curve(d3.curveMonotoneX)
                    );
         })
        .on("mouseout", function() { 
                d3.select(this)
                    .attr("fill", "black")
                    .attr("r", 5);
                Root.select(".temp-line").remove();
         })
        .call(d3.drag()
              .subject((d) => ({x: tScale(d.t), y:yScale(d.y)}))
              .on('start', started)
              .on('drag', dragged)
              .on('end', ended)
         );
  }

  render() {
    return (
      <svg width={width} height={height}>
        <g ref="graph" />
      </svg>
    );
  }
};

export default class ContainControl extends React.Component {
  render() {
    return (
        <div>
            <Graph nowTime={this.props.nowTime} maxTime={this.props.maxTime}/>
        </div>
    );
  }
};

