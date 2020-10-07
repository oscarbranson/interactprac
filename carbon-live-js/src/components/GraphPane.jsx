import React from 'react';
import { SubGraph, Graph } from './Graph'
// import { ParamButtons } from './ParamButtons'

export class GraphPane extends React.Component {
    // constructor(props) {
    //     super(props)
    //     console.log(this.props)
    // }

    // onParamChange(p) {
    //     console.log(p)

    // }

    render () {
        let graphs = [];
        for (let key of this.props.variables) {
            let info = this.props.var_info[key]
            graphs.push(
                <Graph 
                    data = {this.props.data}
                    id = {key}
                    min = {info['ymin']}
                    max = {info['ymax']}
                    param = {key}
                    key = {key}
                    npoints = {this.props.npoints}
                    ylabel = {info['label']}
                    precision = {info['precision']}
                />
            )
        }

        return (
            <div className='graph-container' style={{width: this.props.width}}>
                <h3>{this.props.title}</h3> 
                {/* <ParamButtons params={this.props.variables} onChange={this.onParamChange}/> */}
                {graphs}
            </div>
        )
    } 
}

export class SubGraphPane extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            h: '49%'
        }
    }

    // onParamChange(p) {
    //     console.log(p)

    // }

    render () {
        if (this.props.variables.length === 0) {
            return <div></div>
        }

        let graphs = [];
        let i = 1;
        for (let key of this.props.variables) {
            let info = this.props.var_info[key]
            graphs.push(
                <SubGraph 
                    data = {this.props.data}
                    id = {key}
                    min = {info['ymin']}
                    max = {info['ymax']}
                    param = {key}
                    key = {key}
                    npoints = {this.props.data[key].length}
                    label = {info['label']}
                    // height = { this.state.h }
                    // precision = {info['precision']}
                />
            )
            if (i < this.props.variables.length) {
                graphs.push(<hr/>)
            }

            i += 1;
        }

        return (
            <div className='graph-pane' style={{
                left: this.props.pos[0] + '%',
                bottom: this.props.pos[1] + '%', 
                width: this.props.pos[2] + '%', 
                height: this.props.pos[3] + '%',
              }}>
                {/* <ParamButtons params={this.props.variables} onChange={this.onParamChange}/> */}
                {graphs}
            </div>
        )
    } 
}