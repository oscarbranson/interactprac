import React, { Component } from 'react'
import { ParamDropdown } from './Dropdown'

const divid = "threebox"

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
  
  mapValue(val, min, max, h, s) {
    let range = 0.8;
    return 100 * ((1 - range) / 2 + range * (1 - (val - min) / (max - min)))
  }

  parseHSL(h, s, l) {
    return "hsl(" + h + "," + s + "%," + l + "%)"
  }

  neg_color(lightness) {
    let delta_lightness = 50;
    if (lightness > 50) {
      return lightness - delta_lightness
    } else {
      return lightness + delta_lightness
    }
  }

  render() {
    let limits = this.getLimits();
    let ind = this.props.npoints - 1;

    // Define color pallette
    let h = 200;
    let s = 51;

    let val_atmos = this.props.data['pCO2_atmos'][ind];
    let text_atmos = this.parseHSL(h, s, 10);

    let val_deep = this.props.data[this.props.param + '_deep'][ind];
    let l_deep = this.mapValue(val_deep, limits[0], limits[1]);
    let col_deep = this.parseHSL(h, s, l_deep);
    let text_deep = this.parseHSL(h, s, this.neg_color(l_deep));

    let val_lolat = this.props.data[this.props.param + '_lolat'][ind];
    let l_lolat = this.mapValue(val_lolat, limits[0], limits[1]);
    let col_lolat = this.parseHSL(h, s, l_lolat);
    let text_lolat = this.parseHSL(h, s, this.neg_color(l_lolat));
    
    let val_hilat = this.props.data[this.props.param + '_hilat'][ind];
    let l_hilat = this.mapValue(val_hilat, limits[0], limits[1]);
    let col_hilat = this.parseHSL(h, s, l_hilat);
    let text_hilat = this.parseHSL(h, s, this.neg_color(l_hilat));

    return (
      <div className="schematic" id={divid}>
        <div className="box" id="atmos" style={{
          top: 0, left: 0, width: "100%", height: "20%", textAlign: "right", color: text_atmos,
          backgroundColor: "white"
          }}>pCO<sub>2</sub> {val_atmos.toPrecision(this.props.var_info['pCO2_atmos']['precision'])}</div>
        <div className="box" id="deep" style={{
          bottom: 0, left: 0, width: "100%", height: "50%", textAlign: "right", color: text_deep,
          backgroundColor: col_deep
          }}>{val_deep.toPrecision(this.props.var_info[this.props.param + '_deep']['precision'])}</div>
        <div className="box" id="lolat" style={{
          top: "20%", right: 0, width: "60%", height: "30%", textAlign: "right", color: text_lolat,
          backgroundColor: col_lolat
          }}>{val_lolat.toPrecision(this.props.var_info[this.props.param + '_lolat']['precision'])}</div>
        <div className="box" id="hilat" style={{
          top: "20%", left: 0, width: "40%", height: "40%", textAlign: "left", color: text_hilat,
          backgroundColor: col_hilat
          }}>{val_hilat.toPrecision(this.props.var_info[this.props.param + '_hilat']['precision'])}</div>
        <ParamDropdown className='dropdown'
                        params={['pH', 'DIC', 'TA', 'fCO2', 'temp', 'sal', 'PO4', 'CO3', 'HCO3', 'c']}
                        param={this.props.param} 
                        handleSelect={this.props.handleDropdownSelect}/>
      </div>
    )
  }
}