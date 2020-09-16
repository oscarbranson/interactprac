import React from 'react';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'
import ToggleButton from 'react-bootstrap/ToggleButton'
import 'bootstrap/dist/css/bootstrap.min.css';

export class ParamButtons extends React.Component {
    render() {
        let buttons = [];
        for (let p of this.props.params) {
            buttons.push(
                <ToggleButton key={p} value={p}>{p}</ToggleButton>
            )
        }
        return (
            <ToggleButtonGroup type="checkbox" size='sm' onChange={this.props.onChange} defaultValue={this.props.defaultValue}>
                {buttons}
            </ToggleButtonGroup>
        )
    }
}