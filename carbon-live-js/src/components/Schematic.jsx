import React, { Component } from 'react'
import { moles2GtC, uatm2GtC } from './csys'
import { var_info, paramLabels } from './ThreeBox_full'
import { Graph } from './Graph';

const divid = "threebox"

const flux_labels = ['CO<sub>2</sub>', '[PO<sub>4</sub>]', '[DIC]', 'Alkalinity']
const flux_colors = ["#888e9b", "#d3ca98", "#e98787", "#e7abef"]  // CO2, PO4, DIC, TA
// const plot_bkg = "black"

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
      <div className='box-value' id={this.props.id}>{this.props.value}</div>
      <div className='box-label' id={this.props.id}>{this.props.label + ': ' + this.props.GtC.toFixed(0) + ' GtC'}</div>
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
    let ind = this.props.data['pCO2_atmos'].length - 1;

    // Define color pallette
    let h = 200;
    let s = 51;

    let val_atmos = this.props.data['pCO2_atmos'][ind];

    let val_deep = this.props.data[this.props.param + '_deep'][ind];
    let l_deep = mapValue(val_deep, limits[0], limits[1]);
    let col_deep = parseHSL(h, s, l_deep);

    let val_lolat = this.props.data[this.props.param + '_lolat'][ind];
    let l_lolat = mapValue(val_lolat, limits[0], limits[1]);
    let col_lolat = parseHSL(h, s, l_lolat);
    
    let val_hilat = this.props.data[this.props.param + '_hilat'][ind];
    let l_hilat = mapValue(val_hilat, limits[0], limits[1]);
    let col_hilat = parseHSL(h, s, l_hilat);

    // GtC in each reservoir
    let GtC_atmos = uatm2GtC(this.props.data['pCO2_atmos'][ind])
    let GtC_deep = moles2GtC(this.props.data['DIC_deep'][ind] * 1e-3 * this.props.data['vol_deep'][ind])
    let GtC_lolat = moles2GtC(this.props.data['DIC_lolat'][ind] * 1e-3 * this.props.data['vol_lolat'][ind])
    let GtC_hilat = moles2GtC(this.props.data['DIC_hilat'][ind] * 1e-3 * this.props.data['vol_hilat'][ind])

    // Generate legend
    let legend = [];
    for (let i = 0; i < flux_colors.length; i++) {
      // console.log(legend_items[i])
      legend.push(
        <div className='legend item'>
          <div className='legend key' style={{backgroundColor: flux_colors[i]}}></div>
          <div className='legend label' dangerouslySetInnerHTML={{__html: flux_labels[i]}}></div>
        </div>
      )
    }
    // console.log([this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_deep[ind]])
    return (
      <div className="schematic-container">
      <div className="schematic" id={divid}>
        {/* Boxes */}
        <Box 
          id='atmos'
          pos = {[0, 80, 100, 20]}
          color = "white"
          value = {"pCO2: " + val_atmos.toPrecision(this.props.var_info['pCO2_atmos']['precision'])}
          label = "Atmosphere"
          GtC = {GtC_atmos}
        />
        <Box 
          id='deep'
          pos = {[0, 0, 100, 50]}
          color = {col_deep}
          value = {val_deep.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
          label = "Deep Ocean"
          GtC = {GtC_deep}
        />
        <Box 
          id='lolat'
          pos = {[35, 50, 65, 30]}
          color = {col_lolat}
          value = {val_lolat.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
          label = "Low Lat. Surface Ocean"
          GtC = {GtC_lolat}
        />
        <Box 
          id='hilat'
          pos = {[0, 40, 35, 40]}
          color = {col_hilat}
          value = {val_hilat.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}
          label = "High Lat. Surface Ocean"
          GtC = {GtC_hilat}
        />
        {/* Graphs */}
        <Graph
          pos = {[38, 84, 22, 12]}
          data={this.props.data}
          npoints={this.props.npoints}
          variables={['pCO2_atmos_noExch', 'pCO2_atmos']}
          var_info={var_info}
          label="pCO<sub>2</sub>"
          id = 'g_atmos_noex'
        />

        <Graph
          pos = {[2, 54, 22, 12]}
          data={this.props.data}
          npoints={this.props.npoints}
          variables={[this.props.plot_hilat]}
          var_info={var_info}
          label={paramLabels[this.props.param]}
          id = 'g_hilat'
        />

        <Graph
          pos = {[76, 58, 22, 12]}
          data={this.props.data}
          npoints={this.props.npoints}
          variables={[this.props.plot_lolat]}
          var_info={var_info}
          label={paramLabels[this.props.param]}
          id = 'g_lolat'
        />

        <Graph
          pos = {[38, 10, 22, 12]}
          data={this.props.data}
          npoints={this.props.npoints}
          variables={[this.props.plot_deep]}
          var_info={var_info}
          label={paramLabels[this.props.param]}
          id = 'g_deep'
        />

        {/* Flux Arrows */}
        {/* CO2 Exchange */}
        <Fluxes fluxes={[moles2GtC(-this.props.fluxes.exCO2_hilat)]} sizes={[0.3]} centre={[18, 20]} colors={[flux_colors[0]]} label='Gas exch.' id='gas'/>
        <Fluxes fluxes={[moles2GtC(-this.props.fluxes.exCO2_lolat)]} sizes={[0.3]} centre={[70, 20]} colors={[flux_colors[0]]} label='Gas exch.' id='gas'/>
        {/* Thermohaline Mixing */}
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[32, 60]}
          colors={flux_colors.slice(1)}
          label="V<sub>thermo</sub>"
          />
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_lolat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_lolat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[43, 50]}
          colors={flux_colors.slice(1)}
          label="V<sub>thermo</sub>"
          />
        <Fluxes 
          fluxes={[this.props.fluxes.vthermo_PO4_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_DIC_hilat / this.props.data.vol_ocean[ind], this.props.fluxes.vthermo_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[35, 42]} 
          colors={flux_colors.slice(1)}
          id='lohi' 
          label="V<sub>thermo</sub>"
          />
        {/* Diffusive Mixing */}
        <Fluxes 
          fluxes={[-this.props.fluxes.vmix_PO4_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_DIC_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[24, 60]}
          colors={flux_colors.slice(1)}
          label="V<sub>mix</sub>"
          />
        <Fluxes 
          fluxes={[-this.props.fluxes.vmix_PO4_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_DIC_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.vmix_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[56, 50]}
          colors={flux_colors.slice(1)}
          label="V<sub>mix</sub>"
          />
        {/* Productivity */}
        <Fluxes 
          fluxes={[-this.props.fluxes.prod_PO4_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_DIC_hilat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_TA_hilat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[16, 60]}
          colors={flux_colors.slice(1)}
          label="&tau;"
          />
        <Fluxes 
          fluxes={[-this.props.fluxes.prod_PO4_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_DIC_lolat / this.props.data.vol_ocean[ind], -this.props.fluxes.prod_TA_lolat / this.props.data.vol_ocean[ind]]}
          sizes={[0.001, 0.1, 0.05]}
          centre={[64, 50]}
          colors={flux_colors.slice(1)}
          label="&tau;"
          />

        <div className='legend box'>
          <h3>Net Fluxes</h3>
          {legend}
        </div>
      
      </div>
      </div>
    )
  }
}

class Fluxes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      arrowWidthPercent: 1,
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
    let pos = 0;
    for (let i = 0; i < n; i++) {
      arrows.push(
        <Arrow direction={this.props.fluxes[i]} width={100 / n + '%'} amplitude={this.props.sizes[i]} color={this.props.colors[i]}/>
      )
      if (this.props.fluxes[i] > 0) {
        pos += 1;
      } else {
        pos -= 1;
      }
    }
    
    let labelPos = {}
    if (pos < 0) {
       labelPos.bottom = '55%'
      } else {
        labelPos.top = '55%'
      }

    return (
      <div className="flux-pane" id={this.props.id} style={this.style}>
        <div className="flux-label" dangerouslySetInnerHTML={{__html: this.props.label}} style={labelPos}></div>
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
      left: "0%",
      backgroundColor: this.props.color
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