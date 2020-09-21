import { calc_csys } from './csys';

function calc_percent_CaCO3(c, cb, percent_CaCO3) {
    if (c >= cb) {
        return percent_CaCO3
    } else {
        return percent_CaCO3 * c / cb
    }
}

function dPO4_deep(state) {
    return (state.vmix * state.PO4_hilat -
        state.vmix * state.PO4_deep +
        state.vthermo * state.PO4_hilat -
        state.vthermo * state.PO4_deep +
        (state.PO4_hilat * state.vol_hilat / state.tau_hilat) +
        (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_deep
}

function dPO4_hilat(state) {
    return (state.vmix * state.PO4_deep -
        state.vmix * state.PO4_hilat +
        state.vthermo * state.PO4_lolat -
        state.vthermo * state.PO4_hilat -
        (state.PO4_hilat * state.vol_hilat / state.tau_hilat)) / state.vol_hilat
}

function dPO4_lolat(state) {
    return (state.vthermo * state.PO4_deep -
        state.vthermo * state.PO4_lolat -
        (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_lolat
}

// Replace this with differential equations. Stoichiometric removal flux, mixing, atmospheric equilibration.
function dCO2_lolat(state, Ks) {
    // timestep is longer than surface layer equilibration time - don't worry about diffusivity
    return (state.pCO2_atmos * Ks.lolat.K0 - state.CO2_lolat)
}

function dCO2_hilat(state, Ks) {
    return (state.pCO2_atmos * Ks.hilat.K0 - state.CO2_hilat)
}

function dpCO2(state, Ks) {
    let dpCO2 = -1 * (state.vol_lolat * (dCO2_lolat(state, Ks) / Ks.lolat.K0) + state.vol_hilat * (dCO2_hilat(state, Ks) / Ks.hilat.K0)) / (state.vol_hilat + state.vol_lolat)
    console.log(
        (state.vol_lolat * (dCO2_lolat(state, Ks) / Ks.lolat.K0)) / 
        (state.vol_hilat * (dCO2_hilat(state, Ks) / Ks.hilat.K0)))
    return dpCO2

}

function dDIC_deep(state) {
    let f_DIC_lolat = 106 + 106 * state.percent_CaCO3_lolat / 100;
    let f_DIC_hilat = 106 + 106 * state.percent_CaCO3_hilat / 100;
    return (state.vmix * state.DIC_hilat -
        state.vmix * state.DIC_deep +
        state.vthermo * state.DIC_hilat -
        state.vthermo * state.DIC_deep +
        f_DIC_hilat * (state.PO4_hilat * state.vol_hilat / state.tau_hilat) +
        f_DIC_lolat * (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_deep
}

function dDIC_hilat(state, Ks) {
    let f_DIC = 106 + 106 * state.percent_CaCO3_hilat / 100;
    // console.log(dCO2_hilat(state, Ks))
    return (state.vmix * (state.DIC_deep - state.DIC_hilat) +
        state.vthermo * (state.DIC_lolat - state.DIC_hilat) -
        f_DIC * (state.PO4_hilat * state.vol_hilat / state.tau_hilat)) / state.vol_hilat + dCO2_hilat(state, Ks)
}

function dDIC_lolat(state, Ks) {
    let f_DIC = 106 + 106 * state.percent_CaCO3_lolat / 100;
    // console.log(dCO2_lolat(state, Ks))
    return (state.vthermo * state.DIC_deep -
        state.vthermo * state.DIC_lolat -
        f_DIC * (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_lolat + dCO2_lolat(state, Ks)
}

function dTA_deep(state) {
    let f_TA_lolat = 0.15 * 106 + 2 * 106 * state.percent_CaCO3_lolat / 100;
    let f_TA_hilat = 0.15 * 106 + 2 * 106 * state.percent_CaCO3_hilat / 100;
    return (state.vmix * state.TA_hilat -
        state.vmix * state.TA_deep +
        state.vthermo * state.TA_hilat -
        state.vthermo * state.TA_deep +
        f_TA_hilat * (state.PO4_hilat * state.vol_hilat / state.tau_hilat) +
        f_TA_lolat * (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_deep
}

function dTA_hilat(state) {
    let f_TA = 0.15 * 106 + 2 * (106 * state.percent_CaCO3_hilat / 100);
    return (state.vmix * state.TA_deep -
        state.vmix * state.TA_hilat +
        state.vthermo * state.TA_lolat -
        state.vthermo * state.TA_hilat -
        f_TA * (state.PO4_hilat * state.vol_hilat / state.tau_hilat)) / state.vol_hilat
}

function dTA_lolat(state) {
    let f_TA = 0.15 * 106 + 2 * (106 * state.percent_CaCO3_lolat / 100);
    return (state.vthermo * state.TA_deep -
        state.vthermo * state.TA_lolat -
        f_TA * (state.PO4_lolat * state.vol_lolat / state.tau_lolat)) / state.vol_lolat
}


// const total_DIC = 2100;
// const total_TA = 2200;

// From Table 8.2.4 of Sarmiento & Gruber mean global ocean
// const total_DIC = 2256;
// const total_TA = 2364;

export const paramLabels = {
    PO4: '[PO<sub>4</sub>]',
    c: '\u03A9',
    DIC: 'DIC',
    TA: 'TA',
    fCO2: 'fCO<sub>2</sub>',
    pH: 'pH',
    CO3: '[CO<sub>3</sub><sup>2-</sup>]',
    HCO3: '[HCO<sub>3</sub><sup>-</sup>]',
}

// Box setup
const SA_ocean = 358e12;  // m2
const vol_ocean = 1.34e18  // m3
const fSA_hilat = 0.15;
const depth_hilat = 200;  // m
const vol_hilat = SA_ocean * fSA_hilat * depth_hilat;  // m3
const fSA_lolat = 1 - fSA_hilat;
const depth_lolat = 100;  // m
const vol_lolat = SA_ocean * fSA_lolat * depth_lolat;  // m3

export const start_state = {
    // 'vmix': 1.2e15,
    'vmix': 1.89e15,  // m3 yr-1
    // 'vthermo': 6.3072e14,
    'vthermo': 6.3072e14,  // m3 yr-1
    'tau_hilat': 50,  // yr
    'tau_lolat': 1,  // yr
    'percent_CaCO3_hilat': 10,
    'percent_CaCO3_lolat': 20,
    'depth_lolat': depth_lolat,
    'depth_hilat': depth_hilat,
    'vol_deep': vol_ocean - vol_lolat - vol_hilat,  // m3
    'vol_lolat': vol_lolat,  // m3
    'vol_hilat': vol_hilat,  // m3
    'mass_atmos': 5.132e18,  // kg
    'moles_atmos': 1.773e20,  // moles
    'SA_ocean': SA_ocean,  // m2
    'fSA_hilat': fSA_hilat,
    'fSA_lolat': fSA_lolat,
    'SA_hilat': SA_ocean * fSA_hilat,
    'SA_lolat': SA_ocean * fSA_lolat,
    // Temp and sal from Table A.3 of Sarmiento & Gruber
    'temp_deep': 1.92,
    'temp_hilat': (4.21 + 3.22) / 2,
    'temp_lolat': 22.85,
    'sal_lolat': 35.15,
    'sal_hilat': 33.5,
    'sal_deep': 34.72,
    'PO4_lolat': 0.0484,  //0.31,
    'PO4_hilat': 1.66,  //(0.89 + 1.54) / 2,
    'PO4_deep': 2.38,
    'DIC_lolat': 1972,  //1958,  // total_DIC,
    'DIC_hilat': 2192,  //(2006 + 2082) / 2,  // total_DIC,
    'DIC_deep': 2279,  // total_DIC,
    'TA_lolat': 2244,  // 2315,  // total_TA,
    'TA_hilat': 2341,  // (2257 + 2291) / 2,  // total_TA,
    'TA_deep': 2380.4,  // total_TA,
    'c_lolat': 1,
    'c_hilat': 1,
    'c_deep': 1,
    'fCO2_lolat': 399,
    'fCO2_hilat': 369,
    'fCO2_deep': 502,
    'pH_lolat': 7.99,
    'pH_hilat': 8.23,
    'pH_deep': 7.97,
    'CO2_lolat': 9,
    'CO2_hilat': 9,
    'CO2_deep': 9,
    'HCO3_lolat': 1900,
    'HCO3_hilat': 1900,
    'HCO3_deep': 1900,
    'CO3_lolat': 300,
    'CO3_hilat': 300,
    'CO3_deep': 300,
    'pCO2_atmos': 389,
};

function update_csys(state, Ks) {
    let csys_deep = calc_csys({
        DIC: state['DIC_deep'],
        TA: state['TA_deep'],
        Sal: state['sal_deep'],
        Ks: Ks['deep']
    })

    let csys_hilat = calc_csys({
        DIC: state['DIC_hilat'],
        TA: state['TA_hilat'],
        Sal: state['sal_hilat'],
        Ks: Ks['hilat']
    })

    let csys_lolat = calc_csys({
        DIC: state['DIC_lolat'],
        TA: state['TA_lolat'],
        Sal: state['sal_lolat'],
        Ks: Ks['lolat']
    })

    for (let cvar of ['pH', 'fCO2', 'CO2', 'HCO3', 'CO3', 'c']) {
        state[cvar + '_deep'] = csys_deep[cvar]
        state[cvar + '_lolat'] = csys_lolat[cvar]
        state[cvar + '_hilat'] = csys_hilat[cvar]
    }

    return state
}

function calc_pCO2_atmos(state) {
    return (state.fCO2_hilat * state.vol_hilat + state.fCO2_lolat * state.vol_lolat) / (state.vol_hilat + state.vol_lolat)
}

export function emitC(state, GtC) {
    // let surf_vol = state.vol_hilat + state.vol_lolat;
    let emit_moles = GtC * 1e15 / 12; // convert Gt C to moles of C
    let emit_ppm = 1e6 * emit_moles / state.moles_atmos;
    let new_pCO2 = state.pCO2_atmos + emit_ppm;
    // console.log(emit_ppm, new_pCO2)
    state.pCO2_atmos = new_pCO2;
    return state
}

// function diffuse_CO2_hilat(state) {
//     let kw = (24 * 365) * 20 / 100;  // diffusivity of CO2 - 20 cm hr-1 converted to m yr-1
//     return (state.pCO2_atmos - state.fCO2_hilat) * kw / state.depth_hilat
// }

// function diffuse_CO2_lolat(state) {
//     let kw = (24 * 365) * 20 / 100;  // diffusivity of CO2 - 20 cm hr-1 converted to m yr-1
//     return (state.pCO2_atmos - state.fCO2_lolat) * kw / state.depth_lolat
// }

// function update_pCO2(state) {

// let last_pCO2_atmos = (state.fCO2_hilat * state.vol_hilat + state.fCO2_lolat * state.vol_lolat) / vol_surf;
//     let delta_pCO2 = state.pCO2_atmos - last_pCO2_atmos;
//     pCO2_hilat = 
//     pCO2_lolat = 
//     // let newDIC = DIC_from_fCO2(state.pCO2_atmos, )
// }

export function step(state, Ks) {
    let newState = Object.assign({}, state);

    newState.PO4_deep += dPO4_deep(state);
    newState.PO4_hilat += dPO4_hilat(state);
    newState.PO4_lolat += dPO4_lolat(state);

    newState.DIC_hilat += dDIC_hilat(state, Ks);
    newState.DIC_lolat += dDIC_lolat(state, Ks);
    newState.DIC_deep += dDIC_deep(state);

    newState.TA_hilat += dTA_hilat(state);
    newState.TA_lolat += dTA_lolat(state);
    newState.TA_deep += dTA_deep(state);

    newState['pCO2_atmos'] += dpCO2(state, Ks);

    newState = update_csys(newState, Ks);

    return newState
}

export const var_info = {
    // variable: [label, min, max]
    'vmix': {
        label: 'Mixing Rate (m3 / yr)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'vthermo': {
        label: 'Thermohaline Mixing Rate (m3 / yr)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'tau_lolat': {
        label: 'Productivity (tau)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'tau_hilat': {
        label: 'Productivity (tau)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'percent_CaCO3_lolat': {
        label: '% CaCO3',
        ymin: 0,
        ymax: 100,
        precision: 1
    },
    'percent_CaCO3': {
        label: '% CaCO3',
        ymin: 0,
        ymax: 100,
        precision: 1
    },
    'vol_deep': {
        label: 'Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'vol_lolat': {
        label: 'Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'vol_hilat': {
        label: 'Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'PO4_lolat': {
        label: '[PO4]',
        ymin: 0,
        ymax: 1,
        precision: 3
    },
    'PO4_hilat': {
        label: '[PO4]',
        ymin: 0,
        ymax: 1,
        precision: 3
    },
    'PO4_deep': {
        label: '[PO4]',
        ymin: 2.4,
        ymax: 2.6,
        precision: 3
    },
    'DIC_hilat': {
        label: '[DIC]',
        ymin: 1800,
        ymax: 2000,
        precision: 4
    },
    'DIC_lolat': {
        label: '[DIC]',
        ymin: 1800,
        ymax: 2000,
        precision: 4
    },
    'DIC_deep': {
        label: '[DIC]',
        ymin: 2130,
        ymax: 2150,
        precision: 5
    },
    'TA_lolat': {
        label: 'Alkalinity',
        ymin: 2200,
        ymax: 2400,
        precision: 4
    },
    'TA_hilat': {
        label: 'Alkalinity',
        ymin: 2200,
        ymax: 2400,
        precision: 4
    },
    'TA_deep': {
        label: 'Alkalinity',
        ymin: 2390,
        ymax: 2410,
        precision: 5
    },
    'pH_deep': {
        label: 'pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_deep': {
        label: 'fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_deep': {
        label: '[CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_deep': {
        label: '[HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_deep': {
        label: '[CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'pH_hilat': {
        label: 'pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_hilat': {
        label: 'fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_hilat': {
        label: '[CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_hilat': {
        label: '[HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_hilat': {
        label: '[CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'pH_lolat': {
        label: 'pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_lolat': {
        label: 'fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_lolat': {
        label: '[CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_lolat': {
        label: '[HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_lolat': {
        label: '[CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'c_deep': {
        label: '\u03A9',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'c_lolat': {
        label: '\u03A9',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'c_hilat': {
        label: '\u03A9',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'pCO2_atmos': {
        label: 'pCO2',
        ymin: 350,
        ymax: 450,
        precision: 3
    },
    'temp_lolat': {
        label: 'Temp',
        ymin: 20,
        ymax: 25,
        precision: 3
    },
    'temp_hilat': {
        label: 'Temp',
        ymin: 2,
        ymax: 6,
        precision: 3
    },
    'temp_deep': {
        label: 'Temp',
        ymin: 0,
        ymax: 4,
        precision: 3
    },
    'sal_lolat': {
        label: 'Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
    'sal_hilat': {
        label: 'Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
    'sal_deep': {
        label: 'Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
};