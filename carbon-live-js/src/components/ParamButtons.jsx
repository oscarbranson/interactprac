import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import {paramLabels} from './ThreeBox_full'

export class ParamButtons extends React.Component {
    render() {
        let buttons = [];
        for (let p of this.props.params) {
            buttons.push(
                <ToggleButton key={p} value={p}><div dangerouslySetInnerHTML={{__html: paramLabels[p]}}></div></ToggleButton>
            )
        }
        return (
            <ToggleButtonGroup type="checkbox" size='sm' onChange={this.props.onChange} defaultValue={this.props.defaultValue}>
                {buttons}
            </ToggleButtonGroup>
        )
    }
}

export class ParamToggle extends React.Component {
    render() {
        let buttons = [];
        for (let p of this.props.params) {
            buttons.push(
                <ToggleButton key={p} value={p}><div dangerouslySetInnerHTML={{__html: paramLabels[p]}}></div></ToggleButton>
            )
        }
        return (
            <ToggleButtonGroup type="radio" name="plot_params" size='sm' onChange={this.props.onChange} defaultValue={this.props.defaultValue}>
                {buttons}
            </ToggleButtonGroup>
        )
    }
}