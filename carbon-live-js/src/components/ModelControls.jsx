import React from 'react';
// import { Button } from 'react-bootstrap';
import { VerticalSlider } from './ControlElements';
import { start_state } from './ThreeBox_full'

function fmt_sci(value, precision) {
    return value.toExponential(precision)
}

function fmt_pre(value, precision) {
    return value.toPrecision(precision)
}

const paramFormats = {
    vthermo: [fmt_sci, 2, start_state.vthermo * 0.5, start_state.vthermo * 2],
    vmix: [fmt_sci, 2, start_state.vmix * 0.5, start_state.vmix * 2],
    tau_hilat: [fmt_pre, 2, 1, 80],
    tau_lolat: [fmt_pre, 2, 1, 80],
    percent_CaCO3_hilat: [fmt_pre, 2, 0, 50],
    percent_CaCO3_lolat: [fmt_pre, 2, 0, 50],
    temp_hilat: [fmt_pre, 2, 0, 10],
    temp_lolat: [fmt_pre, 2, 20, 30]
}

const sliderLabels = {
    vthermo: {[start_state.vthermo]: '', [start_state.vthermo * 2]: 'x2', [start_state.vthermo / 2]: '/2'},
    vmix: {[start_state.vmix]: '', [start_state.vmix * 2]: 'x2', [start_state.vmix / 2]: '/2'},
    tau_hilat: {[start_state.tau_hilat]: ''},
    tau_lolat: {[start_state.tau_lolat]: ''},
    percent_CaCO3_hilat: {[start_state.percent_CaCO3_hilat]: ''},
    percent_CaCO3_lolat: {[start_state.percent_CaCO3_lolat]: ''},
    temp_hilat: {[start_state.temp_hilat]: ''},
    temp_lolat: {[start_state.temp_lolat]: ''},
}

const labels = {
    vthermo: 'V<sub>thermo</sub>',
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

    // render () {
    //     return (
    //         <div className="control-set">
    //             <h3 dangerouslySetInnerHTML={{__html: labels[this.props.param]}}></h3>
    //             <Button onClick={this.handleDouble} size='sm'>Double</Button>
    //             <div className="control-value">
    //                 {formatnum(this.props.value, paramFormats[this.props.param])}
    //             </div>
    //             <Button onClick={this.handleHalve} size='sm'>Halve</Button>
    //             <VerticalSlider value={10} min={0} max={20}/>
    //         </div>
    //     )
    // } 
    render () {
        let min = paramFormats[this.props.param][2];
        let max = paramFormats[this.props.param][3];
        return (
            <div className="control-set">
                <h3 dangerouslySetInnerHTML={{__html: labels[this.props.param]}}></h3>
                <VerticalSlider value={this.props.value} min={min} max={max} handleChange={this.handleSliderChange} fmt_info={paramFormats[this.props.param]} labels={sliderLabels[this.props.param]}/>
                <div className="control-value">
                {paramFormats[this.props.param][0](this.props.value, paramFormats[this.props.param][1])}
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