import React from 'react';
import { start_state, step, var_info} from './ThreeBox_full';
import Button from 'react-bootstrap/Button'
import { ModelControls } from './ModelControls'
import { GraphPane } from './GraphPane';
import { Schematic } from './Schematic';
import { ParamButtons } from './ParamButtons';
import {calc_Ks} from './csys'

const frameTime = 50;
const npoints = 100;

export class Model extends React.Component {
    constructor(props) {
        super(props)

        // Set model state
        this.state = {
            start_state: start_state,
            now: start_state,
            history: {},
        };
        // Calculate Ks
        this.state['Ks'] = this.genKs()

        // Set arrays to record model state
        for (let key in this.state.now) {
            this.state.history[key] = new Array(npoints).fill(this.state.now[key]);
          };
        //   Default parameter to show in schematic
        this.state['schematicParam'] = 'DIC'
        
        // Model Params
        this.state['model_global_params'] = ['vmix', 'vthermo'] 
        this.state['model_hilat_params'] = ['tau_hilat', 'percent_CaCO3_hilat', 'temp_hilat']
        this.state['model_lolat_params'] = ['tau_lolat', 'percent_CaCO3_lolat', 'temp_lolat']

        //   Default plot setup
        this.state['ocean_vars'] = ['PO4', 'DIC', 'TA', 'fCO2', 'pH', 'c', 'CO3', 'HCO3'];
        this.state['plot_atmos'] = ['pCO2_atmos',];
        this.state['plot_ocean'] = ['PO4']
        for (let box of ['_deep', '_hilat', '_lolat']) {
            this.state['plot' + box] = ['PO4' + box]
        }

        // Whether or not to run the model.
        this.state['start_stop_button'] = "Stop";

        this.interval = null;

        this.stepModel = this.stepModel.bind(this);
        this.startSimulation = this.startSimulation.bind(this)
        this.stopSimulation = this.stopSimulation.bind(this)
        this.resetModel = this.resetModel.bind(this)
        this.toggleSimulation = this.toggleSimulation.bind(this)
        this.genPlotVars = this.genPlotVars.bind(this)
        this.genKs = this.genKs.bind(this)


        this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
        this.handleParamButtonChange = this.handleParamButtonChange.bind(this)
        this.handleParamUpdate = this.handleParamUpdate.bind(this)
        
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
            this.setState({start_stop_button: "Stop"})
        }  else {
            this.stopSimulation()
            this.setState({start_stop_button: "Start"})
        }
    }

    resetModel() {
        let newState = this.state.start_state
        this.updateHistory(newState);
        this.setState({now: newState, history: this.state.history});
    }

    stepModel() {
        // Update Model State
        let newState = step(this.state.now, this.state.Ks);
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

    handleParamButtonChange(params) {
        this.setState({plot_ocean: params})
        this.genPlotVars(params)
        // console.log(params)
    }

    genPlotVars(params) {
        let plotvars ={
            'plot_ocean': params,
            'plot_atmos': ['pCO2_atmos']
        }
        for (let box of ['_deep', '_hilat', '_lolat']) {
            plotvars['plot' + box] = []
            for (let p of params) {
                plotvars['plot' + box].push(p + box)
            }
        }
        this.setState(plotvars)
    }

    genKs() {
        let Ks = {};
        Ks['deep'] = calc_Ks({Tc:this.state.now.temp_deep, Sal: this.state.now.sal_deep})
        Ks['hilat'] = calc_Ks({Tc:this.state.now.temp_hilat, Sal: this.state.now.sal_hilat})
        Ks['lolat'] = calc_Ks({Tc:this.state.now.temp_lolat, Sal: this.state.now.sal_lolat})
        return Ks
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

    handleParamUpdate(key, value){
        // console.log(key, value)
        let newState = this.state.now;
        newState[key] = value;
        let Ks = this.genKs(newState);
        this.setState({now: newState, Ks: Ks});
        // this.updateHistory(newState);
        // this.setState({now: newState, history: this.state.history, Ks: Ks});
    }

    render() {
    return (
        <div id='main-panel'>
            <div className="top-bar">
                <div className="control-container">
                    <ModelControls title="Global" params={this.state.model_global_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <ModelControls title="High Latitude" params={this.state.model_hilat_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <ModelControls title="Low Latitude" params={this.state.model_lolat_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <div id="plot-controls">
                        <ParamButtons id='plot-param-controls' params={this.state.ocean_vars} defaultValue={this.state.plot_ocean} onChange={this.handleParamButtonChange}/>
                        <div id='start-stop'>
                            <Button onClick={this.resetModel} variant="outline-secondary" size="sm">Reset</Button>
                            <Button onClick={this.toggleSimulation} variant="outline-secondary" size="sm">{this.state.start_stop_button}</Button>
                        </div>
                    </div>
                </div>
                <div id='schematic-container'>
                    <Schematic param={this.state.schematicParam} data={this.state.history}  ocean_vars={this.state.ocean_vars} npoints={npoints} var_info={var_info} handleDropdownSelect={this.handleDropdownSelect}/>
                </div>
            </div>
            <div id="graph-panel">
            < GraphPane 
                width= "100%"
                title= "Atmosphere"
                data = {this.state.history}
                variables = {this.state.plot_atmos}
                var_info = {var_info}
                npoints = {npoints}
            />
            < GraphPane 
                width= "46.5vw"
                title= "High Lat. Surface"
                data = {this.state.history}
                variables = {this.state.plot_hilat}
                var_info = {var_info}
                npoints = {npoints}
            />

            < GraphPane 
                width= "46.5vw"
                title= "Low Lat. Surface"
                data = {this.state.history}
                variables = {this.state.plot_lolat}
                var_info = {var_info}
                npoints = {npoints}
            />

            < GraphPane 
                width= "100%"
                title= "Deep"
                data = {this.state.history}
                variables = {this.state.plot_deep}
                var_info = {var_info}
                npoints = {npoints}
            />
            </div>
        </div>
        )
    };
}