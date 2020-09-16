import React from 'react';
import { Button } from 'react-bootstrap';

const paramFormats = {
    vthermo: ['sci', 2],
    vmix: ['sci', 2],
    tau_hilat: ['', 1],
    tau_lolat: ['', 1],
    percent_CaCO3_hilat: ['', 1],
    percent_CaCO3_lolat: ['', 1],
}

function formatnum(num, format) {
    if (format[0] === 'sci') {
        return num.toExponential(format[1])
    } else {
        return num.toPrecision(format[1])
    }
}

export class ControlSet extends React.Component {
    constructor(props) {
        super(props)
        this.handleDouble = this.handleDouble.bind(this);
        this.handleHalve = this.handleHalve.bind(this);    
    }

    handleDouble(e) {
        this.props.handleUpdate(this.props.param, this.props.value * 2)
    }

    handleHalve(e) {
        this.props.handleUpdate(this.props.param, this.props.value / 2)
    }

    render () {
        return (
            <div className="control-set">
                <h3>{this.props.param}</h3>
                <Button onClick={this.handleDouble} size='sm'>Double</Button>
                <div className="control-value">
                    {formatnum(this.props.value, paramFormats[this.props.param])}
                </div>
                <Button onClick={this.handleHalve} size='sm'>Halve</Button>
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
            <div id="model-controls">
                {controls}
            </div>
        )
    } 
}