import React from 'react';
import Button from 'react-bootstrap/Button';
import { VerticalSlider } from './ControlElements';
import { start_state } from './ThreeBox_full'

function fmt_sci(value, precision) {
    return value.toExponential(precision)
}

function fmt_pre(value, precision) {
    return value.toPrecision(precision)
}

const paramFormats = {
    vcirc: [fmt_sci, 2, start_state.vcirc * 0.5, start_state.vcirc * 2],
    vmix: [fmt_sci, 2, start_state.vmix * 0.5, start_state.vmix * 2],
    tau_hilat: [fmt_pre, 2, 1, 80],
    tau_lolat: [fmt_pre, 2, 1, 80],
    percent_CaCO3_hilat: [fmt_pre, 2, 0, 50],
    percent_CaCO3_lolat: [fmt_pre, 2, 0, 50],
    temp_hilat: [fmt_pre, 2, 0, 10],
    temp_lolat: [fmt_pre, 2, 20, 30]
}

const sliderLabels = {
    vcirc: {[start_state.vcirc]: '', [start_state.vcirc * 2]: 'x2', [start_state.vcirc / 2]: '/2'},
    vmix: {[start_state.vmix]: '', [start_state.vmix * 2]: 'x2', [start_state.vmix / 2]: '/2'},
    tau_hilat: {[start_state.tau_hilat]: ''},
    tau_lolat: {[start_state.tau_lolat]: ''},
    percent_CaCO3_hilat: {[start_state.percent_CaCO3_hilat]: ''},
    percent_CaCO3_lolat: {[start_state.percent_CaCO3_lolat]: ''},
    temp_hilat: {[start_state.temp_hilat]: ''},
    temp_lolat: {[start_state.temp_lolat]: ''},
}

const slidersteps = {
    temp_hilat: 0.1,
    temp_lolat: 0.1,
}

const labels = {
    vcirc: 'V<sub>circ</sub>',
    vmix: 'V<sub>mix</sub>',
    tau_hilat: '&tau;',
    tau_lolat: '&tau;',
    percent_CaCO3_hilat: '% CaCO<sub>3</sub>',
    percent_CaCO3_lolat: '% CaCO<sub>3</sub>',
    temp_hilat: 'Temp',
    temp_lolat: 'Temp',
}

export class ControlSet extends React.Component {
    constructor(props) {
        super(props)
        this.handleDouble = this.handleDouble.bind(this);
        this.handleHalve = this.handleHalve.bind(this);    
        this.handleSliderChange = this.handleSliderChange.bind(this);    
    }

    handleDouble(e) {
        this.props.handleUpdate(this.props.param, this.props.value * 2)
    }

    handleHalve(e) {
        this.props.handleUpdate(this.props.param, this.props.value / 2)
    }

    handleSliderChange(value) {
        this.props.handleUpdate(this.props.param, value)
    }

    render () {
        let min = paramFormats[this.props.param][2];
        let max = paramFormats[this.props.param][3];

        return (
            <div className="control-set">
                <h3 dangerouslySetInnerHTML={{__html: labels[this.props.param]}}></h3>
                <VerticalSlider value={this.props.value} min={min} max={max} handleChange={this.handleSliderChange} fmt_info={paramFormats[this.props.param]} labels={sliderLabels[this.props.param]} step={slidersteps[this.props.param]}/>
                <div className="control-value">
                {paramFormats[this.props.param][0](this.props.value, paramFormats[this.props.param][1])}
                </div>
            </div>
        )
    } 
}

export class Disasters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            GtC_pinutubo: 0.05 * 0.272,
            emitLabel: 'Burn!'
        }
    
        this.handleStHelens = this.handleStHelens.bind(this)
        this.handlePinatubo = this.handlePinatubo.bind(this)
        // this.handleTambora = this.handleTambora.bind(this)
        this.handleEmissions = this.handleEmissions.bind(this)
    }

    handleStHelens() {
        this.props.handleVolcano(0.01 * 0.272)
    }

    handlePinatubo() {
        this.props.handleVolcano(0.05 * 0.272)
    }

    // handleTambora() {
    //     this.props.handleVolcano(0.05 * 0.272)
    // }

    handleEmissions() {
        this.props.handleEmissions()
        if (this.state.emitLabel === 'Burn!') {
            this.setState({emitLabel: 'Stop.'});
        } else {
            this.setState({emitLabel: 'Burn!'});
        }
    }

    render () {
        return (
        <div className="control-section disasters" style={{zIndex: 5}}>
            <h2>Carbon Release: {this.props.GtC_released.toFixed(2)} GtC</h2>
            <div className="model-controls">
            <div className="control-set">
                <h3>Fossil Fuels</h3>
                <Button onClick={this.handleEmissions} size="sm">{this.state.emitLabel}</Button>
                {/* <div className="control-value">
                
                </div> */}
            </div>
            <div className="control-set">
                <h3>Volcanos</h3>
                {/* <VerticalSlider/> */}
                {/* <Button size="sm">St. Helens</Button> */}
                <Button onClick={this.handleStHelens} size="sm">St. Helens</Button>
                <Button onClick={this.handlePinatubo} size="sm">Pinatubo</Button>
                {/* <Button onClick={this.handleVolcano} size="sm">Tambora</Button> */}
            </div>
            </div>
        </div>
        )
    }
}

const climate_sensitivity = 2.5;  // degrees C per doubling CO2

function calc_deltaF(pCO2) {
    return 5.35 * Math.log(pCO2 / start_state.pCO2_atmos)
}

function calc_deltaT(pCO2) {
    return climate_sensitivity * pCO2 / start_state.pCO2_atmos - climate_sensitivity
}

export class RadiativeForcing extends React.Component {
    render () {
        return (
        <div className="control-section forcing" style={{zIndex: 5}}>
            <h2>Climate: Radiative Forcing </h2>
            <div className="model-controls">
            <div className='control-set table'>
                {/* titles */}
                <div className="table cell title"></div>
                <div className="table cell head">No Ocean</div>
                <div className="table cell head">With Ocean</div>
                <div className="table cell title"></div>
                {/* Row 1 - pCO2 */}
                <div 
                    className="table cell title" 
                    dangerouslySetInnerHTML={{__html: "pCO<sub>2</sub>"}}>
                </div>
                <div className="table cell"> {this.props.pCO2_atmos_noExch.toFixed(1)}</div>
                <div className="table cell"> {this.props.pCO2_atmos.toFixed(1)}</div>
                <div className="table cell unit">ppm</div>
                {/* Row 2 - Delta F */}
                <div 
                    className="table cell title" 
                    dangerouslySetInnerHTML={{__html: "\u0394F"}}>
                </div>
                <div className="table cell"> {calc_deltaF(this.props.pCO2_atmos_noExch).toFixed(1)}</div>
                <div className="table cell"> {calc_deltaF(this.props.pCO2_atmos).toFixed(1)}</div>
                <div className="table cell unit" dangerouslySetInnerHTML={{__html: "W m<sup>-2</sup>"}}></div>
                {/* Row 3 - Delta T */}
                <div 
                    className="table cell title" 
                    dangerouslySetInnerHTML={{__html: "\u0394T"}}>
                </div>
                <div className="table cell"> {calc_deltaT(this.props.pCO2_atmos_noExch).toFixed(1)}</div>
                <div className="table cell"> {calc_deltaT(this.props.pCO2_atmos).toFixed(1)}</div>
                <div className="table cell unit" dangerouslySetInnerHTML={{__html: "\u2103"}}></div>
            </div>
            </div>
        </div>
        )
    }

}


export class ModelControls extends React.Component {
    render () {
        let controls = [];
        for (let p of this.props.params) {
            controls.push(
                <ControlSet 
                    key={p}
                    param={p}
                    value={this.props.now[p]}
                    handleUpdate={this.props.handleUpdate}
                />
            )
        }

        return (
            <div className="control-section">
                <h2>{this.props.title}</h2>
                <div className="model-controls">
                    {controls}
                </div>
            </div>
        )
    } 
}