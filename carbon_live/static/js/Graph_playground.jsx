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
    let plotdata = this.props.data[this.graph.param]
    // let ylim = this.getLimits(this.props.data[this.graph.param], 0.05)

    this.graph.bb = d3.select("#" + this.graph.id).node().getBoundingClientRect();

    var svg = d3.select("#" + this.graph.id)
    .append('svg')
    .attr('id', 'svg_' + this.graph.id)
    .attr('width', '100%')
    .attr('height', '100%');

    var x = d3.scaleLinear()
      .domain([0, this.graph.npoints])
      .range([0, this.graph.bb.width]);
    svg.append("g")
      .attr("transform", "translate(0," + this.graph.bb.height + ")")
      .call(d3.axisBottom(x).ticks(7));

    var y = d3.scaleLinear()
      .domain(d3.extent(plotdata))
      .range([this.graph.bb.height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    var line = svg
      .append('g')
      .append('path')
        .datum(plotdata)
        .attr('d', d3.line()
          .x(function(_, i) {return x(i)})
          .y(function(d) {return y(d)})
        )
    this.line = line
    this.x = x
    this.y = y
  }

  update() {
    let plotdata = this.props.data[this.graph.param]

    this.line
      .datum(plotdata)
      .attr("d", d3.line()
            .x(function(_, i) { return this.x(i) })
            .y(function(d) { return this.y(d) })
          )
  }

  // updateYlim() {
  //   let ylim = this.getLimits(this.props.data[this.graph.param], 0.05)

  //   this.graph.yScale = d3.scaleLinear()
  //     .domain(ylim)
  //     .range([this.graph.bb.height, 0]);
  // }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initGraph()
  }

  componentDidUpdate() {
    // this.updateYlim()
    // this.updateLine()
    this.update()
  }

  render() {
    return (
      <div className="graph" id={this.graph.id}></div>
    )
  }
}