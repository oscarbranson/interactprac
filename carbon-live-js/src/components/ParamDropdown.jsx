import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import {paramLabels} from './ThreeBox_full'

export class ParamDropdown extends React.Component {

    render() {
        let opts = [];
        let i = 0;
        for (let param of this.props.params) {
            opts.push(
                <Dropdown.Item key={i} eventKey={param}>
                    <div dangerouslySetInnerHTML={{__html: paramLabels[param]}}></div>
                </Dropdown.Item>
            )
            i += 1;
        }

        return (
            <Dropdown onSelect={this.props.handleSelect}>
            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-secondary">
                {this.props.param}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {opts}
            </Dropdown.Menu>
            </Dropdown>
        )
    }
}