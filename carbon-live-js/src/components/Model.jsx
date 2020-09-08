import React from 'react';
import { start_state, step, var_info} from './TwoBox';
import { Button } from './ControlElements';
// import { Graph } from './Graph';
import { GraphPane } from './GraphPane';

const frameTime = 50;
const npoints = 100;

export class Model extends React.Component {
    constructor(props) {
        super(props)

        // Set model state
        this.state = {
            start_state: start_state,
            now: start_state,
            history: {}
        };
        // Set arrays to record model state
        for (let key in this.state.now) {
            this.state.history[key] = new Array(npoints).fill(this.state.now[key]);
          };
        
        this.interval = null;

        this.stepModel = this.stepModel.bind(this);
        this.startSimulation = this.startSimulation.bind(this)
        this.stopSimulation = this.stopSimulation.bind(this)
        this.resetModel = this.resetModel.bind(this)
        this.toggleSimulation = this.toggleSimulation.bind(this)
    }

    startSimulation() {
        if (this.interval == null) {
            this.interval = setInterval(() => {
                this.stepModel()
            }, frameTime);
        }
    }

    stopSimulation() {
        clearInterval(this.interval);
        this.interval = null;
    }

    toggleSimulation() {
        if (this.interval === null) {
            this.startSimulation()
        }  else {
            this.stopSimulation()
        }
    }

    resetModel() {
        let newState = this.state.start_state
        this.updateHistory(newState);
        this.setState({now: newState, history: this.state.history});
    }

    stepModel() {
        // Update Model State
        let newState = step(this.state.now);
        // Log in history
        this.updateHistory(newState);
        // update state
        this.setState({now: newState, history: this.state.history});
    };

    updateHistory(newState) {
        for (let key in this.state.now) {
            this.state.history[key].shift();
            this.state.history[key].push(newState[key])
        }
    }

    componentDidMount() {
        this.startSimulation()
    }

    componentWillUnmount() {
        this.stopSimulation()
    }

    render() {
    return (
        <div id='main_panel'>
            <div className="control-container">
            <h1>{this.state.now.PO4_surf}</h1>
            <Button onClick={this.toggleSimulation} label="Start/Stop"/>
            {/* <Button onClick={this.stopSimulation} label="STOP!"/> */}
            <Button onClick={this.resetModel} label="reset"/>
            </div>
            < GraphPane 
                data = {this.state.history}
                variables = {['PO4_surf', 'DIC_surf', 'TA_surf']}
                var_info = {var_info}
                npoints = {npoints}
            />
        </div>
        )
    };
}