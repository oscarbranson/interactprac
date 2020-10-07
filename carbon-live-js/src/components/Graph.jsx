import React, { Component } from 'react'
import * as d3 from 'd3';
// import {axisLeft} from 'd3-axis'

function responsivefy(svg) {
  // get container + svg aspect ratio
  var container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width")),
      height = parseInt(svg.style("height")),
      aspect = width / height;

  // add viewBox and preserveAspectRatio properties,
  // and call resize so that svg resizes on inital page load
  svg.attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMinYMid")
      .call(resize);

  // to register multiple listeners for same event type, 
  // you need to add namespace, i.e., 'click.foo'
  // necessary if you call invoke this function for multiple svgs
  // api docs: https://github.com/mbostock/d3/wiki/Selections#on
  d3.select(window).on("resize." + container.attr("id"), resize);

  // get width of container and resize svg to fit it
  function resize() {
      var targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
  }
}

export class Graph extends Component {
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
    var margin = 10;
    var axis_margin = 40;
    this.graph.bb = d3.select("#" + this.props.id).node().getBoundingClientRect();

    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - margin - axis_margin,
        width = svg_width - margin - axis_margin;

    this.graph.xScale = d3.scaleLinear()
      .domain([0, this.props.npoints])
      .range([0, width]);

    this.graph.yScale = d3.scaleLinear()
      .domain(this.getLimits(this.props.data[this.props.param], 0.05))
      .range([height, 0]);

    this.graph.svg = d3.select("#" + this.props.id)
      .append('svg')
        .attr('id', 'svg_' + this.props.id)
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

    this.graph.svg.append("text")
      .attr("x", margin)
      .attr("y", height - margin)
      .style("text-anchor", "start")
      .text(this.props.ylabel)
      .attr("class", "ylabel")

    this.graph.dataLabel = this.graph.svg.append("text")
      .data([this.props.data[this.props.param][this.props.npoints - 1].toPrecision(this.props.precision)])
      .attr("x", width)
      .attr("y", margin)
      .style("text-anchor", "end")
      .attr("class", "data-label")
      .text(function(d) {return d})
      // .text("test")

    this.graph.line = d3.line()
      .x((_, i) => this.graph.xScale(i))
      .y((d) => this.graph.yScale(d))
    
    this.graph.svg.append('path')
      .attr('id', 'dataline')
      .attr('d', this.graph.line(this.props.data[this.props.param]))
  }

  updateLine() {
    this.graph.svg.selectAll('path#dataline')
    .data([this.props.data[this.props.param]])
    .attr('d', this.graph.line)
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initGraph()
  }

  componentDidUpdate() {
    this.updateYlim()
    this.updateLine()
    this.updateDataLabel()
  }

  render() {
    return (
      <div className="graph" id={this.props.id}></div>
    )
  }
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
    var margin = 10;
    var axis_margin = 40;
    this.graph.bb = d3.select("#" + this.props.id).node().getBoundingClientRect();
    console.log(this.graph.bb)
    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - margin - axis_margin,
        width = svg_width - margin - axis_margin;

    this.graph.xScale = d3.scaleLinear()
      .domain([0, this.props.npoints])
      .range([0, width]);

    this.graph.yScale = d3.scaleLinear()
      .domain(this.getLimits(this.props.data[this.props.param], 0.05))
      .range([height, 0]);

    this.graph.svg = d3.select("#" + this.props.id)
      .append('svg')
        .attr('id', 'svg_' + this.props.id)
        .attr('width', svg_width)
        .attr('height', svg_height)
      .append('g')
        .attr('transform', 'translate(' + axis_margin + ', ' + margin + ')')
        // .attr('transform', 'translate(' + this.graph.bb.width * 0.05 + ', ' + this.graph.bb.height * 0.1 + ')')
        // .attr('transform', 'translate(0,' + this.graph.bb.height * 0.1 + ')')
    
    // this.graph.yAxis = d3.axisLeft(this.graph.yScale).ticks(5)
    
    // this.graph.svg.append('g')
    //   .attr("class", "y axis")
    //   // .attr("transform", "translate(0,0)")
    //   .call(this.graph.yAxis)
    
    // this.graph.svg.append('g')
    //   .attr("class", "x axis")
    //   .attr("transform", "translate(0, " + height + ")")
    //   .call(d3.axisBottom(this.graph.xScale))

    // this.graph.svg.append("text")
    //   .attr("x", margin)
    //   .attr("y", height - margin)
    //   .style("text-anchor", "start")
    //   .text(this.props.ylabel)
    //   .attr("class", "ylabel")

    // this.graph.dataLabel = this.graph.svg.append("text")
    //   .data([this.props.data[this.props.param][this.props.npoints - 1].toPrecision(this.props.precision)])
    //   .attr("x", width)
    //   .attr("y", margin)
    //   .style("text-anchor", "end")
    //   .attr("class", "data-label")
    //   .text(function(d) {return d})
      // .text("test")

    this.graph.line = d3.line()
      .x((_, i) => this.graph.xScale(i))
      .y((d) => this.graph.yScale(d))
    
    this.graph.svg.append('path')
      .attr('id', 'dataline')
      .attr('d', this.graph.line(this.props.data[this.props.param]))
  }

  updateLine() {
    this.graph.svg.selectAll('path#dataline')
    .data([this.props.data[this.props.param]])
    .attr('d', this.graph.line)
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

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.initGraph()
  }

  componentDidUpdate() {
    // this.updateYlim()
    this.updateLine()
    // this.updateDataLabel()
  }

  render() {
    return (
      <div className="subgraph" id={this.props.id}></div>
    )
  }
}
