import React from 'react';
import { Graph } from './Graph'

export class GraphPane extends React.Component {
    // constructor(props) {
    //     super(props)
    //     console.log(this.props)
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
            <div className='graph-container'>
                {graphs}
            </div>
        )
    } 
}