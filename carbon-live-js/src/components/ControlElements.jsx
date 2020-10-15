import React from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

export class Button extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this)
    }

    handleClick() {
        this.props.onClick()
    }

    render() {
        return (
            <button className="button" onClick={this.handleClick}>
                {this.props.label}
            </button>
        )
    }

}

// https://whoisandy.github.io/react-rangeslider/
export class VerticalSlider extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this)
        this.fmtLabel = this.fmtLabel.bind(this)
    }

    handleChange = value => {
        this.props.handleChange(value)
      };

    fmtLabel(value) {
        return this.props.fmt_info[0](value, this.props.fmt_info[1])
    }

    render() {
        return (
            <Slider 
                value={this.props.value}
                min={this.props.min}
                max={this.props.max}
                orientation='vertical'
                onChange={this.handleChange}
                format={this.fmtLabel}
                labels={this.props.labels}
                step={this.props.step}
            />
        )
    }

}

