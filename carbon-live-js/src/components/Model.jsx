import React from 'react';
import { start_state, step, calc_fluxes, var_info} from './ThreeBox_full';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import { Disasters, ModelControls, RadiativeForcing } from './ModelControls'
import { Schematic } from './Schematic';
import { ParamToggle } from './ParamButtons';
import {calc_Ks, GtC2uatm, uatm2GtC} from './csys'

import 'bootstrap/dist/css/bootstrap.min.css';

const GtC_atmos_0 = uatm2GtC(372.8);
// const frameTime = 20;
// const npoints = 200;

export class Model extends React.Component {
    constructor(props) {
        super(props)

        // Set model state
        this.state = {
            start_state: start_state,
            now: start_state,
            history: {},
            fluxes: calc_fluxes(start_state),
            npoints: 200,
            year_field: 200,
            frameTime: 20,  // ms
        };
        // Calculate Ks
        this.state['Ks'] = this.genKs(start_state)

        // Set arrays to record model state
        for (let key in this.state.now) {
            this.state.history[key] = new Array(2).fill(this.state.now[key]);
          };
        
        this.state.yearsPerSecond = 1 / this.state.frameTime * 1e3

        //   Default parameter to show in schematic
        this.state['schematicParam'] = 'pCO2'
        
        // Model Params
        this.state['model_global_params'] = ['vmix', 'vcirc'] 
        this.state['model_hilat_params'] = ['tau_hilat', 'percent_CaCO3_hilat', 'temp_hilat']
        this.state['model_lolat_params'] = ['tau_lolat', 'percent_CaCO3_lolat', 'temp_lolat']

        //   Default plot setup
        this.state['ocean_vars'] = ['pCO2', 'DIC', 'pH', 'CO3', 'HCO3', 'CO2'];
        this.state['plot_atmos'] = ['pCO2_atmos',];
        this.state['plot_ocean'] = ['pCO2']
        for (let box of ['_deep', '_hilat', '_lolat']) {
            this.state['plot' + box] = [this.state.plot_ocean[0] + box]
        }

        // Whether or not to run the model.
        this.state['start_stop_button'] = "Pause";

        this.state.running = true;
        this.interval = null;

        this.emitting = false;
        this.state.GtC_released = 0;

        this.stepModel = this.stepModel.bind(this);
        this.startSimulation = this.startSimulation.bind(this)
        this.stopSimulation = this.stopSimulation.bind(this)
        this.resetModel = this.resetModel.bind(this)
        this.toggleSimulation = this.toggleSimulation.bind(this)
        this.genPlotVars = this.genPlotVars.bind(this)
        this.genKs = this.genKs.bind(this)


        this.handleDropdownSelect = this.handleDropdownSelect.bind(this)
        this.handleParamButtonChange = this.handleParamButtonChange.bind(this)
        this.handleParamToggle = this.handleParamToggle.bind(this)
        this.handleParamUpdate = this.handleParamUpdate.bind(this)

        this.handleVolcano = this.handleVolcano.bind(this)
        this.toggleEmissions = this.toggleEmissions.bind(this)

        this.onChangeYears = this.onChangeYears.bind(this)
        this.onYearsEnter = this.onYearsEnter.bind(this)
        this.handleUpdateYears = this.handleUpdateYears.bind(this)
        
        this.handleSpeedUp = this.handleSpeedUp.bind(this)
        this.handleSlowDown = this.handleSlowDown.bind(this)
    }

    startSimulation() {
        if (this.interval == null) {
            this.interval = setInterval(() => {
                this.stepModel()
            }, this.state.frameTime);
        }
        this.setState({running: true})
    }

    stopSimulation() {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({running: false})
    }

    toggleSimulation() {
        if (this.interval === null) {
            this.startSimulation()
            this.setState({start_stop_button: "Pause"})
        }  else {
            this.stopSimulation()
            this.setState({start_stop_button: "Run"})
        }
    }

    resetModel() {
        this.setState({
            now: start_state, 
            fluxes: calc_fluxes(start_state),
            history: this.updateHistory(start_state),
            Ks: this.genKs(start_state),
            GtC_released: 0})
    }

    stepModel() {
        // Update Model State
        let newState = this.state.now;
        let GtC_release = 2;
        let new_GtC = 0;
        let totalEmissions = this.state.GtC_released;

        if (this.emitting) {
            newState.pCO2_atmos += GtC2uatm(GtC_release)
            new_GtC = GtC_release;
            totalEmissions += new_GtC;
        }

        let fluxes = calc_fluxes(newState)

        newState = step(newState, fluxes, this.state.Ks);
        // pCO2 if no ocean interaction
        newState.pCO2_atmos_noExch = GtC2uatm(GtC_atmos_0 + this.state.GtC_released)
        // update state
        this.setState({
            now: newState, 
            fluxes: fluxes, 
            history: this.updateHistory(newState), 
            GtC_released: totalEmissions,
        });
    };  

    updateHistory(newState) {
        let newHistory = this.state.history;
        let len = newHistory.DIC_deep.length;
        for (let key in this.state.now) {
            if (len >= this.state.npoints) {
                newHistory[key] = newHistory[key].slice(len - this.state.npoints + 1);
            }
            newHistory[key].push(newState[key])
        }
        
        return newHistory
    }

    handleParamButtonChange(params) {
        this.setState(this.genPlotVars(params))
    }

    handleParamToggle(param) {
        let newState = this.genPlotVars([param])
        newState.schematicParam = param
        this.setState(newState)
    }

    handleVolcano(GtC) {
        // Size of eruption (Pinatubo = 0.05 Gt CO2, or 0.05 * 0.272 Gt C)
        let newState = this.state.now
        newState.pCO2_atmos += GtC2uatm(GtC)
        this.setState({now: newState, GtC_released: this.state.GtC_released + GtC});
    }

    toggleEmissions() {
        if (this.emitting) {
            this.emitting = false;
        } else {
            this.emitting = true;
        }
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
        return plotvars
    }

    genKs(state) {
        let Ks = {};
        Ks['deep'] = calc_Ks({Tc:state.temp_deep, Sal: state.sal_deep})
        Ks['hilat'] = calc_Ks({Tc:state.temp_hilat, Sal: state.sal_hilat})
        Ks['lolat'] = calc_Ks({Tc:state.temp_lolat, Sal: state.sal_lolat})
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
        this.setState({now: newState, Ks: this.genKs(newState)});
    }

    onChangeYears(event) {
        this.setState({year_field: event.target.value})
    }

    onYearsEnter(event) {
        if (event.key === "Enter") {
            this.setState({npoints: this.state.year_field})
        }
    }

    handleUpdateYears() {
        this.setState({npoints: this.state.year_field})
    }

    handleSpeedUp() {
        let newFrameTime = this.state.frameTime / 2;
        let newYearsPerSecond = 1 / newFrameTime * 1e3;
        
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.stepModel()
        }, newFrameTime);

        this.setState({frameTime: newFrameTime, yearsPerSecond: newYearsPerSecond});
    }

    handleSlowDown() {
        let newFrameTime = this.state.frameTime * 2;
        let newYearsPerSecond = 1 / newFrameTime * 1e3;

        clearInterval(this.interval);
        this.interval = setInterval(() => {
            this.stepModel()
        }, newFrameTime);

        this.setState({frameTime: newFrameTime, yearsPerSecond: newYearsPerSecond});
    }

    render() {
    return (
        <div id='main-panel'>
            <div className="top-bar">
                <div className="control-container">
                    <Disasters handleVolcano={this.handleVolcano} handleEmissions={this.toggleEmissions} GtC_released={this.state.GtC_released}/>
                    <ModelControls title="Circulation" params={this.state.model_global_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <ModelControls title="High Latitude" params={this.state.model_hilat_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <ModelControls title="Low Latitude" params={this.state.model_lolat_params} now={this.state.now} handleUpdate={this.handleParamUpdate}/>
                    <RadiativeForcing pCO2_atmos={this.state.now.pCO2_atmos} pCO2_atmos_noExch={this.state.now.pCO2_atmos_noExch}/>
                </div>
            </div>
            <div className='main-display'>
                <Schematic param={this.state.schematicParam} data={this.state.history} fluxes={this.state.fluxes} ocean_vars={this.state.ocean_vars} npoints={this.state.npoints} var_info={var_info} handleDropdownSelect={this.handleDropdownSelect } 
                           plot_hilat={this.state.plot_hilat} plot_lolat={this.state.plot_lolat} plot_deep={this.state.plot_deep}/>
            </div>
            <div className="bottom-bar">
                <div id="plot-controls">
                    <ParamToggle id='plot-param-toggle' params={this.state.ocean_vars} defaultValue={this.state.plot_ocean} onChange={this.handleParamToggle}/>
                    <div id='time-controls'>
                        <InputGroup size='sm' className="control-bit">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">Model Years</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                placeholder="200"
                                aria-label="200"
                                aria-describedby="basic-addon2"
                                onChange={this.onChangeYears}
                                onKeyPress={this.onYearsEnter}
                            />
                            <InputGroup.Append>
                                <Button onClick={this.handleUpdateYears} size="sm">Set</Button>
                            </InputGroup.Append>
                        </InputGroup>
                        <ButtonGroup size='sm' id='speed-controls' className="control-bit">
                            <Button onClick={this.handleSlowDown} size="sm">{"\u2193"}</Button>
                            <div id="speed-label" dangerouslySetInnerHTML={{__html: "Speed<br>" + this.state.yearsPerSecond + " yr/s"}}></div>
                            <Button onClick={this.handleSpeedUp} size="sm">{"\u2191"}</Button>
                        </ButtonGroup>
                        <ButtonGroup size='sm' className="control-bit">
                            <Button onClick={this.resetModel} size="sm">Reset</Button>
                            <Button onClick={this.toggleSimulation} size="sm">{this.state.start_stop_button}</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="bottom-credit">
                    {"\u00A9"} <a href="mailto:ob266@cam.ac.uk">Oscar Branson</a>, Department of Earth Sciences, University of Cambridge
                </div>
            </div>
        </div>
        )
    };
}