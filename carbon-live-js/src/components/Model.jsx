import React from 'react';
import { start_state, step, var_info} from './TwoBox';
// import { start_state, step, var_info} from './ThreeBox';
import { Button } from './ControlElements';
// import { Graph } from './Graph';
import { GraphPane } from './GraphPane';

const frameTime = 50;
const npoints = 100;

const plot_variables = ['PO4_surf', 'DIC_surf', 'TA_surf']
// const  plot_variables = [
//     'PO4_hilat', 'PO4_lolat', 'PO4_deep',
//     'DIC_hilat', 'DIC_lolat',
//     'TA_hilat', 'TA_lolat'
// ]

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
            <Button onClick={this.toggleSimulation} label="Start/Stop"/>
            <Button onClick={this.resetModel} label="reset"/>
            </div>
            < GraphPane 
                data = {this.state.history}
                variables = {plot_variables}
                var_info = {var_info}
                npoints = {npoints}
            />
        </div>
        )
    };
}