import React, { Component } from 'react'
import * as d3 from 'd3';

var frameTime = 40;
var noiseAmplitude = 10;
let oldY = 0;

export default class LiveUpdating extends Component {
  constructor(props) {
    super(props);
    this.interval = null;
  }

  // Interaction events
  handleRClick = Rclick => {
    noiseAmplitude -= 1
  }

  handleLClick = Lclick => {
    noiseAmplitude += 1
  }

  mouseDrag($event) {
    let diffY = 0;

    if ($event.pageY < oldY) {
        diffY = oldY - $event.pageY;
        noiseAmplitude += diffY / 100
    } else if ($event.pageY > oldY) {
        diffY = $event.pageY - oldY;
        noiseAmplitude -= diffY / 100;
    }

    oldY = $event.pageY
  }

  mouseDown = add => {
      const el = add.target
      el.addEventListener('mousemove', this.mouseDrag)
  }
  mouseUp = remove => {
      const el = remove.target
      el.removeEventListener('mousemove', this.mouseDrag)
  }

  // Python connection
  spawn = require("child_process").spawn;
  py = spawn('python', ['random_data.py']);
  dataString = '';
  py.stdout.on('data', function(data) {
    dataString += data.toString();
  })


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    const bb = d3.select(`#graph`).node().getBoundingClientRect();

    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([bb.width, 0]);
    
    const yScale = d3.scaleLinear()
      .domain([-10, 10])
      .range([bb.height, 0]);

    const data = new Array(200)
      .fill(0)
      .map(() => ((Math.random() - 0.5) * noiseAmplitude));
  
    const svg = d3.select('#graph')
      .append('svg')
      .attr('id', 'svg')
      .attr('width', '100%')
      .attr('height', '100%');
    
    const line = d3.line()
      .curve(d3.curveBasis)
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
    
    svg.append('path')
      .attr('d', line(data))
    
    this.interval = setInterval(() => {
      data.pop();
      data.unshift((Math.random() - 0.5) * noiseAmplitude);

      svg.selectAll('path')
        .data([data])
        .attr('d', line)
    }, frameTime);
  }

  render() {
    return (
      <div id="graph" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} style={{width: '100vw', height: '100vh'}}>
      </div>
    )
  }
}