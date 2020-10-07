import React, { Component } from 'react'
import { ParamDropdown } from './ParamDropdown'
import { moles2GtC } from './csys'
import { SubGraph } from './Graph';

const divid = "threebox"

export class Box extends Component {
  render() {
    return (
    <div className="box" id={this.props.id} 
    style={{
      left: this.props.pos[0] + '%',
      bottom: this.props.pos[1] + '%', 
      width: this.props.pos[2] + '%', 
      height: this.props.pos[3] + '%',
      backgroundColor: this.props.color
    }}>
      <div className='box-label' id={this.props.id}>{this.props.value}</div>
    </div>
    )
  }
}

function mapValue(val, min, max, h, s) {
  let range = 0.8;
  return 100 * ((1 - range) / 2 + range * (1 - (val - min) / (max - min)))
}

function parseHSL(h, s, l) {
  return "hsl(" + h + "," + s + "%," + l + "%)"
}

function neg_color(lightness) {
  let delta_lightness = 50;
  if (lightness > 50) {
    return lightness - delta_lightness
  } else {
    return lightness + delta_lightness
  }
}

export class Schematic extends Component {

  getLimits() {
    let gMin = Math.min(
      Math.min(...this.props.data[this.props.param + '_deep']),
      Math.min(...this.props.data[this.props.param + '_hilat']),
      Math.min(...this.props.data[this.props.param + '_lolat'])
    );
    let gMax = Math.max(
      Math.max(...this.props.data[this.props.param + '_deep']),
      Math.max(...this.props.data[this.props.param + '_hilat']),
      Math.max(...this.props.data[this.props.param + '_lolat'])
    );
    if (gMin === gMax) {
      gMin -= 1;
      gMax += 1;
    }
    return [gMin, gMax]
  }
  
  render() {
    let limits = this.getLimits();
    let ind = this.props.npoints - 1;

    // Define color pallette
    let h = 200;
    let s = 51;

    let val_atmos = this.props.data['pCO2_atmos'][ind];
    let text_atmos = parseHSL(h, s, 10);

    let val_deep = this.props.data[this.props.param + '_deep'][ind];
    let l_deep = mapValue(val_deep, limits[0], limits[1]);
    let col_deep = parseHSL(h, s, l_deep);
    let text_deep = parseHSL(h, s, neg_color(l_deep));

    let val_lolat = this.props.data[this.props.param + '_lolat'][ind];
    let l_lolat = mapValue(val_lolat, limits[0], limits[1]);
    let col_lolat = parseHSL(h, s, l_lolat);
    let text_lolat = parseHSL(h, s, neg_color(l_lolat));
    
    let val_hilat = this.props.data[this.props.param + '_hilat'][ind];
    let l_hilat = mapValue(val_hilat, limits[0], limits[1]);
    let col_hilat = parseHSL(h, s, l_hilat);
    let text_hilat = parseHSL(h, s, neg_color(l_hilat));

    // console.log([this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_deep[ind]])

    return (
      <div className="schematic-container">
      <div className="schematic" id={divid}>
        <SubGraph 
          npoints = {this.props.data.pCO2_atmos.length}
          min={300}
          max={500}
          id = 'graph_pCO2_atmos'
          data={this.props.data}
          param='pCO2_atmos'
          />
        {/* Boxes */}
        <Box 
          id='atmos'
          pos = {[0, 80, 100, 20]}
          color = "white"
          value = {"pCO2: " + val_atmos.toPrecision(this.props.var_info['pCO2_atmos']['precision'])}
        />
        <Box 
          id='deep'
          pos = {[0, 0, 100, 50]}
          color = {col_deep}
          value = {val_deep.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
        />
        <Box 
          id='lolat'
          pos = {[40, 50, 60, 30]}
          color = {col_lolat}
          value = {val_lolat.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
        />
        <Box 
          id='hilat'
          pos = {[0, 40, 40, 40]}
          color = {col_hilat}
          value = {val_hilat.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
        />

        {/* Flux Arrows */}
        {/* CO2 Exchange */}
        <Fluxes fluxes={[moles2GtC(-this.props.fluxes.exCO2_hilat)]} sizes={[0.3]} centre={[18, 20]}/>
        <Fluxes fluxes={[moles2GtC(-this.props.fluxes.exCO2_lolat)]} sizes={[0.3]} centre={[70, 20]}/>
        {/* Thermohaline Mixing */}
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[32, 60]}
          />
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_lolat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_lolat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[48, 50]}
          />
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[40, 42]} 
          id='lohi' 
          />
        {/* Diffusive Mixing */}
        <Fluxes 
          fluxes={[-this.props.fluxes.vmix_PO4_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_DIC_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[22, 60]}
          />
        <Fluxes 
          fluxes={[-this.props.fluxes.vmix_PO4_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_DIC_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[58, 50]}
          />
        {/* Productivity */}
        <Fluxes 
          fluxes={[-this.props.fluxes.prod_PO4_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_DIC_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[12, 60]}
          />
        <Fluxes 
          fluxes={[-this.props.fluxes.prod_PO4_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_DIC_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[68, 50]}
          />
        {/* Parameter Selection */}
        <ParamDropdown className='dropdown'
                        params={this.props.ocean_vars}
                        param={this.props.param} 
                        handleSelect={this.props.handleDropdownSelect}/>
      </div>
      </div>
    )
  }
}

class Fluxes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      arrowWidthPercent: 2,
      arrowHeightPercent: 10,
    }

    this.style = {
      width: this.props.fluxes.length * this.state.arrowWidthPercent + "%",
      height: this.state.arrowHeightPercent + "%",
      left: this.props.centre[0] - this.props.fluxes.length * this.state.arrowWidthPercent / 2 + '%',
      top: this.props.centre[1] - this.state.arrowHeightPercent * 0.5 + "%"
    }
  }

  render() {
    let arrows = [];
    let n = this.props.fluxes.length;
    for (let i = 0; i < n; i++) {
      arrows.push(
        <Arrow direction={this.props.fluxes[i]} width={100 / n + '%'} amplitude={this.props.sizes[i]}/>
      )
    }
    
    return (
      <div className="flux-pane" id={this.props.id} style={this.style}>
        {arrows}
      </div>
    )
  }
}

class Arrow extends Component {
  constructor(props) {
    super(props)
  }

  size_2_percent(size) {
    return Math.abs(50 * size / this.props.amplitude) + '%'
  }

  render() {
    let arrowStyle = {
      width: "95%",
      left: "0%"
    }
    if (this.props.direction >= 0) {
      arrowStyle.bottom = "50%"
      arrowStyle.height = this.size_2_percent(this.props.direction)
    } else {
      arrowStyle.top = "50%"
      arrowStyle.height = this.size_2_percent(this.props.direction)
    }

    // console.log(arrowStyle)

    return ( 
      <div className='flux-box' style={{width: this.props.width}}>
        <div className='flux-arrow' style={arrowStyle}>
          
        </div>
      </div>
      )
  }

}


// class hFluxes extends Component {
//   constructor(props) {
//     super(props)

//     this.state = {
//       arrowWidthPercent: 10,
//       arrowHeightPercent: 2,
//     }

//     this.style = {
//       width: this.props.fluxes.length * this.state.arrowWidthPercent + "%",
//       height: this.state.arrowHeightPercent + "%",
//       left: this.props.centre[0] - this.props.fluxes.length * this.state.arrowWidthPercent / 2 + '%',
//       top: this.props.centre[1] - this.state.arrowHeightPercent * 0.5 + "%"
//     }
//   }

//   render() {
//     let arrows = [];
//     let n = this.props.fluxes.length;
//     for (let i = 0; i < n; i++) {
//       arrows.push(
//         <Arrow direction={this.props.fluxes[i]} width={100 / n + '%'} amplitude={this.props.sizes[i]}/>
//       )
//     }
    
//     return (
//       <div className="arrow-pane" style={this.style}>
//         {arrows}
//       </div>
//     )
//   }
// }

// class hArrow extends Component {
//   constructor(props) {
//     super(props)
//   }

//   size_2_percent(size) {
//     return Math.abs(50 * size / this.props.amplitude) + '%'
//   }

//   render() {
//     let arrowStyle = {
//       width: "95%",
//       left: "0%"
//     }
//     if (this.props.direction >= 0) {
//       arrowStyle.bottom = "50%"
//       arrowStyle.height = this.size_2_percent(this.props.direction)
//     } else {
//       arrowStyle.top = "50%"
//       arrowStyle.height = this.size_2_percent(this.props.direction)
//     }

//     // console.log(arrowStyle)

//     return ( 
//       <div className='flux-box' style={{width: this.props.width}}>
//         <div className='flux-arrow' style={arrowStyle}>
          
//         </div>
//       </div>
//       )
//   }

// }