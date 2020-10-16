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

export class Graph extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
    this.graph = {};
    this.state = {
      ymin: Infinity,
      ymax: -Infinity,
    };

    for (let v of this.props.variables) {
      let info = this.props.var_info[v];
      if (info['ymin'] < this.state.ymin) {this.state.ymin = info['ymin']};
      if (info['ymax'] > this.state.ymax) {this.state.ymax = info['ymax']};
    }
    this.graph.data = this.make_data();
  }

  getLimits(pad) {
    let mn = Infinity;
    let mx = -Infinity;
    for (let i in this.props.variables) {
      let imn = d3.min(this.props.data[this.props.variables[i]]);
      let imx = d3.max(this.props.data[this.props.variables[i]]);

      if (mn > imn) {mn = imn}
      if (mx < imx) {mx = imx}
    }

    if (mn > this.state.ymin) {mn = this.state.ymin};
    if (mx < this.state.ymax) {mx = this.state.ymax};
    let rn = mx - mn;
    if (rn === 0) {
      rn = 10;
    }
    return [mn - rn * pad, mx + rn * pad]
  }

  make_data() {
    let pdatas = [];
    for (let v of this.props.variables) {
      let data = this.props.data[v]
      let pdata = [];
      let ix = - data.length + 1;
      for (let i = 0; i < data.length; i++) {
        pdata.push([ix, data[i]])
        ix += 1
      }
      pdatas.push(pdata)
    }
    return pdatas
  }

  initGraph() {
    // size and padding
    var margin = 6;
    var axis_left = 35;
    var axis_bottom = 20;
    this.graph.bb = d3.select("#" + this.props.id).node().getBoundingClientRect();

    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - axis_bottom - margin,
        width = svg_width - axis_left - margin;

    this.graph.xScale = d3.scaleLinear()
      .domain([-this.props.npoints, 0])
      .range([0, width]);

    this.graph.yScale = d3.scaleLinear()
      .domain(this.getLimits(0.05))
      .range([height, 0]);

    this.graph.svg = d3.select("#" + this.props.id)
      .append('svg')
        .attr('id', 'svg_' + this.props.id)
        .attr('viewBox', `0 0 ${svg_width} ${svg_height}`)
      .append('g')
        .attr('transform', 'translate(' + axis_left + ', ' + margin + ')')
    
    this.graph.yAxis = d3.axisLeft(this.graph.yScale).ticks(2)    
    this.graph.svg.append('g')
      .attr("class", "y axis")
      .call(this.graph.yAxis)

    this.graph.xAxis = d3.axisBottom(this.graph.xScale).ticks(2)
    this.graph.svg.append('g')
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 65 + ")")
      .call(this.graph.xAxis)

    this.graph.lines = []
    for (let i in this.props.variables) {
      this.graph.lines.push(
        d3.line()
        .x((d) => this.graph.xScale(d[0]))
        .y((d) => this.graph.yScale(d[1]))
      )
    }
    
    for (let i in this.graph.data) {
      this.graph.svg.append('path')
        .attr('id', 'dataline')
        .attr('id', this.props.variables[i])
        .attr('d', this.graph.lines[i](this.graph.data[i]))
    }
  }

  updateLine() {
    this.graph.data = this.make_data();
    
    for (let i in this.graph.data) {
      this.graph.svg.selectAll('path#' + this.props.variables[i])
      .attr('d', this.graph.lines[i](this.graph.data[i]))
    }
  }

  updateYlim() {
    this.graph.yScale.domain(this.getLimits(0.05))
    this.graph.yAxis.scale(this.graph.yScale)
    d3.select("#" + this.props.id).select('.y').call(this.graph.yAxis)
  }

  updateXlim() {
   this.graph.xScale.domain([-this.props.npoints, 0]) 
   this.graph.xAxis.scale(this.graph.xScale)
    d3.select("#" + this.props.id).select('.x').call(this.graph.xAxis)
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
  }

  render () {
    return (
        <div className='graph-pane' style={{
            left: this.props.pos[0] + '%',
            bottom: this.props.pos[1] + '%', 
            width: this.props.pos[2] + '%', 
            height: this.props.pos[3] + '%',
          }}>
          <div className="subgraph" id={this.props.id} style={{height: this.props.height}}>
            <div className="subgraph-label" dangerouslySetInnerHTML={{__html: this.props.label}}></div>
          </div>
        </div>
    )
  } 
}

export class GraphAxis extends React.Component {
  constructor(props) {
      super(props)
  }
  
  render () {
      let ticks = [];
      let labels = [];
      let labelValue = this.props.npoints;
      let labelGap = (this.props.npoints / (this.props.nticks - 1)).toFixed(0);
      for (let i = 0; i < this.props.nticks; i++) {
          ticks.push(<div className='axis-tick'></div>);
          labels.push(<div className='axis-label'>{labelValue}</div>);
          labelValue -= labelGap;
      }

      return <div className='graph-axis'>
          <div className='axis-ticks'>
              {ticks}
          </div>
          <div className='axis-labels'>
              {labels}
          </div>
      </div>
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
    var margin = 6;
    var axis_left = 35;
    this.graph.bb = d3.select("#" + this.props.id).node().getBoundingClientRect();

    var svg_height = this.graph.bb.height,
        svg_width = this.graph.bb.width;
      
    var height = svg_height - 2 * margin,
        width = svg_width - axis_left - margin;

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
        .attr('transform', 'translate(' + axis_left + ', ' + margin + ')')
    
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
