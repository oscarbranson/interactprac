import React from 'react';
import { Graph } from './Graph'

export class GraphPane extends React.Component {
    // constructor(props) {
    //     super(props)
    // }

    render () {
        let graphs = [];
        for (let key in this.props.variables) {
            graphs.push(
                <Graph 
                    data = {this.props.data}
                    id = {key}
                    min = {this.props.variables[key][0]}
                    max = {this.props.variables[key][1]}
                    param = {key}
                    npoints = {this.props.npoints}
                    ylabel = {this.props.labels[key]}
                />
            )
        }

        return (
            <div className='graph-container'>
                {graphs}
            </div>
        )
    } 
}