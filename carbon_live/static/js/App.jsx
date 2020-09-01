// App.jsx
import React from "react";
var $ = require('jquery');
import GetData from "./GetData";
import Graph from "./Graph"
import TestChild from "./TestChild";
import { json } from "d3";
import { Buttons, RangeSlider } from "./Controls";

const frameTime = 50;
const npoints = 100;

const start_state = {
  'vmix': 6.3072e14,
  'tau': 5,
  'percent_CaCO3': 10,
  'total_PO4': 2.5,
  'total_DIC': 2140,
  'total_TA': 2400,
  'vol_deep': 1.25e18,
  'vol_surf': 1.31e16,
  'PO4_surf': 0,
  'PO4_deep': 2.5,
  'DIC_surf': 2000,
  'TA_surf': 2000
};

const last_state = {};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {data: {}}

    this.state.data = {};
    for (let key in start_state) {
      this.state.data[key] = new Array(npoints).fill(start_state[key]);
    }

    // console.log(this.state.data)
    this.interval = null;

    this.callbackFunction = this.callbackFunction.bind(this)
  }

  callbackFunction(data) {
    this.setState(data)
  }

  getLastState() {
    // grab state at end of simulation
    for (let key in start_state) {
      last_state[key] = this.state.data[key][npoints-1]
    }
  }

  stepState(newstep) {
    // remove first value and add new end values to simulation
    for (let key in start_state) {
      this.state.data[key].shift();
      this.state.data[key].push(newstep[key])
    }
  }

  stepSimulation() {
    this.getLastState()
    // send a post request to /sim with json data and sets returned data to state.data
    $.post(window.location.href + 'sim', JSON.stringify(last_state), (data) => {
      this.stepState(data)
      this.setState(data);  // Sets state.data
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.stepSimulation()
    }, frameTime);
  }

  render () {
    return (
      <div id="main_panel">
        <div id="control_layout">
          <Buttons 
            param = 'vmix' 
            data = {this.state.data} 
            appCallback = {this.callbackFunction} 
          />
          <Buttons 
            param = 'tau' 
            data = {this.state.data} 
            appCallback = {this.callbackFunction}
          />
          <RangeSlider 
            param = 'percent_CaCO3' 
            min = {0} 
            max = {100} 
            data = {this.state.data} 
            appCallback = {this.callbackFunction}
          />
        </div>
        <div id="graph_container">
          <Graph 
            data = {this.state.data} 
            id = 'graph1' 
            param = 'PO4_surf' 
            min = {0} 
            max = {1} 
            npoints = {npoints}
          />
          <Graph 
            data = {this.state.data} 
            id = 'graph2' 
            param = 'PO4_deep' 
            min = {2.45} 
            max = {2.55} 
            npoints = {npoints}
          />        
          <Graph 
            data = {this.state.data} 
            id = 'graph3' 
            param = 'DIC_surf' 
            min = {1800} 
            max = {2000} 
            npoints = {npoints}
          />        
          <Graph 
            data = {this.state.data} 
            id = 'graph4' 
            param = 'TA_surf' 
            min = {2000} 
            max = {2200} 
            npoints = {npoints}
          />        
        </div>
      </div>
    );
  }
}