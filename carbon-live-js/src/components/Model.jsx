import React from 'react';
// import { start_state, step, var_info} from './TwoBox';
import { start_state, step, var_info} from './ThreeBox_full';
import { Button } from './ControlElements';
// import { Graph } from './Graph';
import { GraphPane } from './GraphPane';
import { Schematic } from './Schematic';
import { SchematicDropdown } from './Dropdown';

const frameTime = 50;
const npoints = 100;

// const plot_variables = ['PO4_surf', 'DIC_surf', 'DIC_deep', 'TA_surf', 'TA_deep']
const  plot_variables = [
    // 'PO4_hilat', 'PO4_lolat', 'PO4_deep',
    // 'DIC_hilat', 'DIC_lolat', 'DIC_deep',
    // 'TA_hilat', 'TA_lolat', 'TA_deep',
    'pCO2_atmos',
    'TA_hilat', 'DIC_hilat', 'pH_hilat', 'c_hilat', 'fCO2_hilat',
    'TA_lolat', 'DIC_lolat', 'pH_lolat', 'c_lolat', 'fCO2_lolat',
    'TA_deep', 'DIC_deep', 'pH_deep', 'c_deep', 'fCO2_deep',
]

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

        this.state['schematicParam'] = 'DIC'
        
        this.interval = null;

        this.stepModel = this.stepModel.bind(this);
        this.startSimulation = this.startSimulation.bind(this)
        this.stopSimulation = this.stopSimulation.bind(this)
        this.resetModel = this.resetModel.bind(this)
        this.toggleSimulation = this.toggleSimulation.bind(this)
        this.handleDropdownSelect = this.handleDropdownSelect.bind(this)

        // let sw = calc_csys({DIC: 1980, TA: 2300, Sal: 34.78, Temp: 25})
        // console.log(sw)
        // let Ks = calc_Ks({Sal: 34.78, Tc: 25})
        // let H = give_DIC_TA({DIC: 1980e-6, TA: 2300e-6, Sal: 34.78, Ks: Ks})
        // console.log(-Math.log10(H))
        // console.log(calc_DIC({fCO2: sw.fCO2, TA: 2300, Sal: 34.78, Temp: 25}))
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

    handleDropdownSelect(param) {
        this.setState({schematicParam: param})
    }

    render() {
    return (
        <div id='main_panel'>
            <div className="top-bar">
                <div className="control-container">
                    <Button onClick={this.toggleSimulation} label="Start/Stop"/>
                    <Button onClick={this.resetModel} label="reset"/>
                    <SchematicDropdown 
                        params={['pH', 'DIC', 'TA', 'fCO2', 'temp', 'sal', 'PO4', 'CO3', 'HCO3']}
                        param={this.state.schematicParam} 
                        handleSelect={this.handleDropdownSelect}/>
                </div>
                <Schematic param={this.state.schematicParam} data={this.state.history} npoints={npoints} var_info={var_info}/>
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