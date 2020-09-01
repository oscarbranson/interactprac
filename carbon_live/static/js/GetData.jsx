import React from "react";
var $ = require('jquery');
import { Button, Container, Row, Col } from "react-bootstrap";

export default class GetData extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {data: this.props.data};
        
        // This binding is necessary to make `this` work in the callback
        this.getPythonData = this.getPythonData.bind(this);
    }

    stepSimulation(data) {
        this.setState({data: data});  // Sets the state.data
    }

    getPythonData() {
        // send a post request to /sim with json data and sets returned data to state.data
        $.post(window.location.href + 'sim', JSON.stringify(this.state.data), (data) => {
            this.stepSimulation(data);
            console.log(this.state.data)
        })
    }

    render () {
        return (
            <div>
                <h1>{this.state.data.ping}</h1>
                <hr/>
                <Button bssize="large" bsstyle="danger" onClick={this.getPythonData}>
                Get Data!
                </Button>
            </div>
        );
    }
}