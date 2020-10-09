import React from 'react';
import { start_state, step, calc_fluxes, var_info} from './ThreeBox_full';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { Disasters, ModelControls } from './ModelControls'
import { GraphPane } from './GraphPane';
import { Schematic } from './Schematic';
import { ParamButtons, ParamToggle } from './ParamButtons';
import {calc_Ks, GtC2uatm, moles2uatm} from './csys'

import 'bootstrap/dist/css/bootstrap.min.css';


const frameTime = 50;
const npoints = 200;

export class Model extends React.Component {
    constructor(props) {
        super(props)

        // Set model state
        this.state = {
            start_state: start_state,
            now: start_state,
            history: {},
            fluxes: calc_fluxes(start_state),
        };
        // Calculate Ks
        this.state['Ks'] = this.genKs(start_state)

        // Set arrays to record model state
        for (let key in this.state.now) {
            this.state.history[key] = new Array(npoints).fill(this.state.now[key]);
          };
        
        //   Default parameter to show in schematic
        this.state['schematicParam'] = 'fCO2'
        
        // Model Params
        this.state['model_global_params'] = ['vmix', 'vthermo'] 
        this.state['model_hilat_params'] = ['tau_hilat', 'percent_CaCO3_hilat', 'temp_hilat']
        this.state['model_lolat_params'] = ['tau_lolat', 'percent_CaCO3_lolat', 'temp_lolat']

        //   Default plot setup
        this.state['ocean_vars'] = ['fCO2', 'DIC', 'TA', 'pH', 'CO3', 'HCO3', 'c', 'PO4'];
        this.state['plot_atmos'] = ['pCO2_atmos',];
        this.state['plot_ocean'] = ['fCO2']
        for (let box of ['_deep', '_hilat', '_lolat']) {
            this.state['plot' + box] = [this.state.plot_ocean[0] + box]
        }

        // Whether or not to run the model.
        this.state['start_stop_button'] = "Stop";

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
            this.setState({start_stop_button: "Stop"})
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
    
        if (this.emitting) {
            newState.pCO2_atmos += GtC2uatm(GtC_release)
            new_GtC = GtC_release;
        }

        let fluxes = calc_fluxes(newState)

        newState = step(newState, fluxes, this.state.Ks);
        // update state
        this.setState({
            now: newState, 
            fluxes: fluxes, 
            history: this.updateHistory(newState), 
            emissions: this.state.GtC_released += new_GtC});
    };

    updateHistory(newState) {
        let newHisotry = this.state.history;
        for (let key in this.state.now) {
            newHisotry[key].shift();
            newHisotry[key].push(newState[key])
        }
        return newHisotry
    }

    handleParamButtonChange(params) {
        // this.setState({plot_ocean: params})
        this.setState(this.genPlotVars(params))
        // console.log(params)
    }

    handleParamToggle(param) {
        // this.setState({plot_ocean: params})
        // this.genPlotVars(params)
        let newState = this.genPlotVars([param])
        newState.schematicParam = param
        this.setState(newState)
    }

    handleVolcano(GtC) {
        // Size of eruption (Pinatubo = 0.05 Gt CO2, or 0.05 * 0.272 Gt C)
        let newState = this.state.now
        newState.pCO2_atmos += GtC2uatm(GtC)
        // console.log([GtC, GtC2uatm(GtC)])
        this.setState({now: newState, GtC_released: this.state.GtC_released + GtC});
    }

    toggleEmissions() {
        if (this.emitting) {
            this.emitting = false;
        } else {
            this.emitting = true;
        }
    }

    // handleHumans() {
    //     console.log('burn')

    //     let newState = this.state.now;
    //     let emit = 1e6 * 2.6e15 // micromoles of C per year

    //     let surf_vol = this.state.now.vol_hilat + this.state.now.vol_lolat;
    //     newState.DIC_hilat += emit * this.state.now.vol_hilat / surf_vol / this.state.now.vol_hilat; 
    //     newState.DIC_lolat += emit * this.state.now.vol_lolat / surf_vol / this.state.now.vol_lolat; 
    // }

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
                    <Disasters handleVolcano={this.handleVolcano} handleEmissions={this.toggleEmissions} GtC_released={this.state.GtC_released}/>
                </div>
            </div>
            <div className='main-display'>
            {/* <div id='schematic-container'> */}
                <Schematic param={this.state.schematicParam} data={this.state.history} fluxes={this.state.fluxes} ocean_vars={this.state.ocean_vars} npoints={npoints} var_info={var_info} handleDropdownSelect={this.handleDropdownSelect} 
                           plot_hilat={this.state.plot_hilat} plot_lolat={this.state.plot_lolat} plot_deep={this.state.plot_deep}/>
            {/* </div> */}
            </div>
            <div className="bottom-bar">
                <div id="plot-controls">
                    {/* <ParamButtons id='plot-param-controls' params={this.state.ocean_vars} defaultValue={this.state.plot_ocean} onChange={this.handleParamButtonChange}/> */}
                    <ParamToggle id='plot-param-toggle' params={this.state.ocean_vars} defaultValue={this.state.plot_ocean} onChange={this.handleParamToggle}/>
                    <div id='start-stop'>
                    <Button onClick={this.resetModel} variant="outline-secondary" size="sm" id='model-reset'>Reset</Button>
                    {/* <ButtonGroup> */}
                        {/* <Button onClick={this.toggleSimulation} variant="outline-secondary" size="sm" id="model-toggle">{this.state.start_stop_button}</Button> */}
                        <ToggleButton type="checkbox" variant="outline-secondary" onChange={this.toggleSimulation} value={1}>{this.state.start_stop_button}</ToggleButton>
                    {/* </ButtonGroup> */}
                    </div>
                </div>
            </div>
            {/* <div id="graph-panel">
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
            </div> */}
        </div>
        )
    };
}