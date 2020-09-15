import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

export class ParamDropdown extends React.Component {

    render() {
        let opts = [];
        let i = 0;
        for (let param of this.props.params) {
            opts.push(
                <Dropdown.Item key={i} eventKey={param}>
                    {param}
                </Dropdown.Item>
            )
            i += 1;
        }

        return (
            <Dropdown onSelect={this.props.handleSelect} size="sm">
            <Dropdown.Toggle variant="secondary" id="dropdown-secondary">
                {this.props.param}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {opts}
            </Dropdown.Menu>
            </Dropdown>
        )
    }
}