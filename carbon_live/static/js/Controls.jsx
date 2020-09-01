import React from "react";
var $ = require('jquery');
import { Button } from "react-bootstrap";
import Slider, { Range } from "rc-slider"
import "rc-slider/assets/index.css";

export class Buttons extends React.Component {
    constructor(props) {
        super(props);

        this.doubleParam = this.doubleParam.bind(this)
        this.halveParam = this.halveParam.bind(this)
        this.getParam = this.getParam.bind(this)
    }

    doubleParam() {
        let data = this.props.data
        let lastind = data[this.props.param].length - 1
        data[this.props.param][lastind] = data[this.props.param][lastind] * 2
        this.props.appCallback(data)
    }

    halveParam() {
        let data = this.props.data
        let lastind = data[this.props.param].length - 1
        data[this.props.param][lastind] = data[this.props.param][lastind] * 0.5
        this.props.appCallback(data)
    }

    getParam() {
        let lastind = this.props.data[this.props.param].length - 1
        let value = this.props.data[this.props.param][lastind]
        if (value > 100 || value < 0.01) {
            return value.toExponential(2)
        }
        return value
    }

    render () {
        return (
            <div className="control_group">
                <h3>{ this.props.param }</h3>
                <Button 
                  bssize="large" 
                  bsstyle="danger" 
                  onClick={this.halveParam}>
                  Halve
                </Button>
                <Button 
                  bssize="large" 
                  bsstyle="danger" 
                  onClick={this.doubleParam}>
                  Double
                </Button>
                <p>{this.getParam()}</p>
            </div>
        );
    }
}

export class RangeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 10
        };
        this.moveSlider = this.moveSlider.bind(this)
    }

    moveSlider(value) {
        this.setState({value})
        // console.log(value)

        let data = this.props.data
        let lastind = data[this.props.param].length - 1
        data[this.props.param][lastind] = value
        this.props.appCallback(data)

        // return value
    }

    render () {
        return (
        <div className="control_group">
            <h3>{this.props.param}</h3>
            <Slider 
              min={this.props.min}
              max={this.props.max} 
              value={this.state.value} 
              onChange={this.moveSlider}
              railStyle={{
                height: 3
              }}
              handleStyle={{
                height: 14,
                width: 14,
                marginLeft: 0,
                marginTop: -5,
                backgroundColor: "black",
                border: 0
              }}
              trackStyle={{
                background: "none"
              }}
            />
            <p>{this.state.value}</p>
        </div>
        )
    }
}