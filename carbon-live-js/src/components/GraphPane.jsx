import React from 'react';
import { SubGraph } from './Graph'
// import { ParamButtons } from './ParamButtons'


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
                    time={this.props.time}
                    id = {key}
                    min = {info['ymin']}
                    max = {info['ymax']}
                    param = {key}
                    key = {key}
                    npoints = {this.props.npoints}
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
                <div className='axis-left'></div>
                {graphs}
                <GraphAxis nticks={3} npoints={this.props.npoints}/>
            </div>
        )
    } 
}

export class GraphAxis extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render () {
        let ticks = [];
        let labels = [];
        let labelValue = this.props.npoints;
        let labelGap = (this.props.npoints / (this.props.nticks - 1)).toFixed(0);
        for (let i = 0; i < this.props.nticks; i++) {
            ticks.push(<div className='axis-tick'></div>);
            labels.push(<div className='axis-label'>{labelValue}</div>);
            labelValue -= labelGap;
        }

        return <div className='graph-axis'>
            <div className='axis-ticks'>
                {ticks}
            </div>
            <div className='axis-labels'>
                {labels}
            </div>
        </div>
    }
}