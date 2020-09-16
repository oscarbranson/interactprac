import React from 'react';
import { Graph } from './Graph'
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