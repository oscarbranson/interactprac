import React, { Component } from 'react'
import * as d3 from 'd3';
// import {axisLeft} from 'd3-axis'

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function make_data(npoints, data) {
  let pdata = [];
  let ix = npoints - data.length + 1;
  for (let i = 0; i < data.length; i++) {
    pdata.push([ix, data[i]])
    ix += 1
  }
  return pdata
}

export class SubGraph extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.graph = {};
  }

  getLimits(a, pad) {
    let mx = d3.max(a);
    let mn = d3.min(a);
    if (mn > this.props.min) {mn = this.props.min};
    if (mx < this.props.max) {mx = this.props.max};
    let rn = mx - mn;
    if (rn === 0) {
      rn = 10;
    }
    return [mn - rn * pad, mx + rn * pad]
  }

  initGraph() {
    // size and padding
    var margin = 6;
    var axis_margin = 35;
    this.graph.bb = d3.select("#" + this.props.id).node().getBoundingClientRect();

    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - 2 * margin,
        width = svg_width - axis_margin - margin;

    this.graph.xScale = d3.scaleLinear()
      .domain([0, this.props.npoints])
      .range([0, width]);

    this.graph.yScale = d3.scaleLinear()
      .domain(this.getLimits(this.props.data[this.props.param], 0.05))
      .range([height, 0]);

    this.graph.svg = d3.select("#" + this.props.id)
      .append('svg')
        .attr('id', 'svg_' + this.props.id)
        .attr('viewBox', `0 0 ${svg_width} ${svg_height}`)
      .append('g')
        .attr('transform', 'translate(' + axis_margin + ', ' + margin + ')')
    
    this.graph.yAxis = d3.axisLeft(this.graph.yScale).ticks(2)
    
    this.graph.svg.append('g')
      .attr("class", "y axis")
      .call(this.graph.yAxis)

    let data = make_data(this.props.npoints, this.props.data[this.props.param]);

    this.graph.line = d3.line()
    .x((d) => this.graph.xScale(d[0]))
    .y((d) => this.graph.yScale(d[1]))

    this.graph.svg.append('path')
      .attr('id', 'dataline')
      .attr('d', this.graph.line(data))
  }

  updateLine() {
    let data = make_data(this.props.npoints, this.props.data[this.props.param]);
    
    this.graph.svg.selectAll('path#dataline')
    .attr('d', this.graph.line(data))
  }

  updateDataLabel() {
    this.graph.dataLabel
      .data([this.props.data[this.props.param][this.props.npoints - 1].toPrecision(this.props.precision)])
      .text(function(d) { return d })
  }

  updateYlim() {
    this.graph.yScale.domain(this.getLimits(this.props.data[this.props.param], 0.05))
    this.graph.yAxis.scale(this.graph.yScale)
    d3.select("#" + this.props.id).select('.y').transition(50).call(this.graph.yAxis)
  }

  updateXlim() {
   this.graph.xScale.domain([0, this.props.npoints]) 
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initGraph()
  }

  componentDidUpdate() {
    this.updateXlim()
    this.updateYlim()
    this.updateLine()
    // this.updateDataLabel()
  }

  render() {
    return (
      <div className="subgraph" id={this.props.id} style={{height: this.props.height}}>
        <div className="subgraph-label" dangerouslySetInnerHTML={{__html: this.props.label}}></div>
      </div>
    )
  }
}
