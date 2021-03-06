import React, { Component } from 'react'
import * as d3 from 'd3';
// import {axisLeft} from 'd3-axis'

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.graph = {
      id: this.props.id,
      param: this.props.param,
      npoints: this.props.npoints
    };
  }

  getLimits(a, pad) {
    let mx = d3.max(a);
    let mn = d3.min(a);
    if (mn > this.props.min) {mn = this.props.min};
    if (mx < this.props.max) {mx = this.props.max};
    let rn = mx - mn;
    if (rn == 0) {
      rn = 10;
    }
    return [mn - rn * pad, mx + rn * pad]
  }

  initGraph() {
    // size and padding
    var margin = 10;
    var axis_margin = 40;
    this.graph.bb = d3.select("#" + this.graph.id).node().getBoundingClientRect();

    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - margin - axis_margin,
        width = svg_width - margin - axis_margin;

    this.graph.xScale = d3.scaleLinear()
      .domain([0, this.graph.npoints])
      .range([0, width]);

    this.graph.yScale = d3.scaleLinear()
      .domain(this.getLimits(this.props.data[this.graph.param], 0.05))
      .range([height, 0]);

    this.graph.svg = d3.select("#" + this.graph.id)
      .append('svg')
        .attr('id', 'svg_' + this.graph.id)
        .attr('width', svg_width)
        .attr('height', svg_height)
      .append('g')
        .attr('transform', 'translate(' + axis_margin + ', ' + margin + ')')
        // .attr('transform', 'translate(' + this.graph.bb.width * 0.05 + ', ' + this.graph.bb.height * 0.1 + ')')
        // .attr('transform', 'translate(0,' + this.graph.bb.height * 0.1 + ')')
    
    this.graph.yAxis = d3.axisLeft(this.graph.yScale).ticks(5)
    
    this.graph.svg.append('g')
      .attr("class", "y axis")
      // .attr("transform", "translate(0,0)")
      .call(this.graph.yAxis)

    this.graph.svg.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(this.graph.xScale))

    this.graph.line = d3.line()
      .x((_, i) => this.graph.xScale(i))
      .y((d) => this.graph.yScale(d))
    
    this.graph.svg.append('path')
      .attr('id', 'dataline')
      .attr('d', this.graph.line(this.props.data[this.graph.param]))
  }

  updateLine() {
    this.graph.svg.selectAll('path#dataline')
    .data([this.props.data[this.graph.param]])
    .attr('d', this.graph.line)
  }

  updateYlim() {
    this.graph.yScale.domain(this.getLimits(this.props.data[this.graph.param], 0.05))
    this.graph.yAxis.scale(this.graph.yScale)
    d3.select("#" + this.graph.id).select('.y').transition(50).call(this.graph.yAxis)
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initGraph()
  }

  componentDidUpdate() {
    this.updateYlim()
    this.updateLine()
  }

  render() {
    return (
      <div className="graph" id={this.graph.id}></div>
    )
  }
}