import { calc_csys, calc_Ks, moles2uatm } from './csys';

// Form from Zeebe 2012 (LOSCAR)
function dCO2_lolat(state, Ks) {
    // console.log(state.pCO2_atmos * Ks.lolat.K0 - state.CO2_lolat)
    return state.kas * state.SA_lolat * (state.pCO2_atmos - state.pCO2_lolat)  // mol yr-1
}

function dCO2_hilat(state, Ks) {
    // console.log(state.pCO2_atmos * Ks.hilat.K0 - state.CO2_hilat)
    return state.kas * state.SA_hilat * (state.pCO2_atmos - state.pCO2_hilat)  // mol yr-1
}

export const paramLabels = {
    PO4: '[PO<sub>4</sub>]',
    c: '\u03A9',
    DIC: 'DIC',
    TA: 'TA',
    fCO2: 'fCO<sub>2</sub>',
    pCO2: 'pCO<sub>2</sub>',
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

// const Sv_2_m3yr = 1e6 * (60 * 60 * 24 * 365);
// const vthermo = 20;  // Sv
// const vmix = 10;  // Sv

export var start_state = {
    'kas': 0.02,  // air-sea gas exchange mol (uatm m2 yr-1)-1
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
    'vol_ocean': vol_ocean,
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
    'PO4_lolat': 0.182,  //0.31,
    'PO4_hilat': 1.68,  //(0.89 + 1.54) / 2,
    'PO4_deep': 2.38,
    'DIC_lolat': 1969, // 1972,  //1958,  // total_DIC,
    'DIC_hilat': 2183.1,  // 2192,  //(2006 + 2082) / 2,  // total_DIC,
    'DIC_deep': 2260.5,  //2279,  // total_DIC,
    'TA_lolat': 2253.4,  // 2244,  // 2315,  // total_TA,
    'TA_hilat': 2344.1,  //2341,  // (2257 + 2291) / 2,  // total_TA,
    'TA_deep': 2381.4,  // total_TA,
    'pCO2_atmos': 373,
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

    for (let cvar of ['pH', 'fCO2', 'pCO2', 'CO2', 'HCO3', 'CO3', 'c']) {
        state[cvar + '_deep'] = csys_deep[cvar]
        state[cvar + '_lolat'] = csys_lolat[cvar]
        state[cvar + '_hilat'] = csys_hilat[cvar]
    }

    return state
}

// update carbon system of start_state
let Ks = {};
for (let box of ['hilat', 'lolat', 'deep']) {
    Ks[box] = calc_Ks({Tc: start_state['temp_' + box], Sal: start_state['sal_' + box]})
}
start_state = update_csys(start_state, Ks)


export function calc_fluxes(state) {
    let fluxes = {};
    // vmix
    fluxes.vmix_PO4_hilat = state.vmix * (state.PO4_hilat - state.PO4_deep);
    fluxes.vmix_PO4_lolat = state.vmix * (state.PO4_lolat - state.PO4_deep);
    // fluxes.vmix_PO4_lolat = 0;
    fluxes.vmix_DIC_hilat = state.vmix * (state.DIC_hilat - state.DIC_deep);
    fluxes.vmix_DIC_lolat = state.vmix * (state.DIC_lolat - state.DIC_deep);
    // fluxes.vmix_DIC_lolat = 0;
    fluxes.vmix_TA_hilat = state.vmix * (state.TA_hilat - state.TA_deep);
    fluxes.vmix_TA_lolat = state.vmix * (state.TA_lolat - state.TA_deep);
    // fluxes.vmix_TA_lolat = 0;

    // vthermo
    fluxes.vthermo_PO4_deep = state.vthermo * (state.PO4_hilat - state.PO4_deep);
    fluxes.vthermo_PO4_lolat = state.vthermo * (state.PO4_deep - state.PO4_lolat);
    fluxes.vthermo_PO4_hilat = state.vthermo * (state.PO4_lolat - state.PO4_hilat);
    fluxes.vthermo_DIC_deep = state.vthermo * (state.DIC_hilat - state.DIC_deep);
    fluxes.vthermo_DIC_lolat = state.vthermo * (state.DIC_deep - state.DIC_lolat);
    fluxes.vthermo_DIC_hilat = state.vthermo * (state.DIC_lolat - state.DIC_hilat);
    fluxes.vthermo_TA_deep = state.vthermo * (state.TA_hilat - state.TA_deep);
    fluxes.vthermo_TA_lolat = state.vthermo * (state.TA_deep - state.TA_lolat);
    fluxes.vthermo_TA_hilat = state.vthermo * (state.TA_lolat - state.TA_hilat);

    // productivity
    fluxes.prod_PO4_hilat = (state.PO4_hilat * state.vol_hilat / state.tau_hilat);
    fluxes.prod_PO4_lolat = (state.PO4_lolat * state.vol_lolat / state.tau_lolat);
    let f_DIC_lolat = 106 + 106 * state.percent_CaCO3_lolat / 100;
    let f_DIC_hilat = 106 + 106 * state.percent_CaCO3_hilat / 100;
    fluxes.prod_DIC_hilat = fluxes.prod_PO4_hilat * f_DIC_hilat
    fluxes.prod_DIC_lolat = fluxes.prod_PO4_lolat * f_DIC_lolat
    let f_TA_lolat = 0.15 * 106 + 2 * 106 * state.percent_CaCO3_lolat / 100;
    let f_TA_hilat = 0.15 * 106 + 2 * 106 * state.percent_CaCO3_hilat / 100;
    fluxes.prod_TA_hilat = fluxes.prod_PO4_hilat * f_TA_hilat
    fluxes.prod_TA_lolat = fluxes.prod_PO4_lolat * f_TA_lolat

    // CO2 exchange (moles yr-1)
    fluxes.exCO2_lolat = state.kas * state.SA_lolat * (state.pCO2_atmos - state.pCO2_lolat)
    fluxes.exCO2_hilat = state.kas * state.SA_hilat * (state.pCO2_atmos - state.pCO2_hilat)

    return fluxes
}

export function step(state, fluxes, Ks) {
    // let fluxes = calc_fluxes(state);
    let newState = Object.assign({}, state);
    // let newState = state;

    newState.PO4_deep += (fluxes.vmix_PO4_hilat + fluxes.vmix_PO4_lolat + fluxes.vthermo_PO4_deep + fluxes.prod_PO4_hilat + fluxes.prod_PO4_lolat) / state.vol_deep
    newState.PO4_hilat += (- fluxes.vmix_PO4_hilat + fluxes.vthermo_PO4_hilat - fluxes.prod_PO4_hilat) / state.vol_hilat
    newState.PO4_lolat += (- fluxes.vmix_PO4_lolat + fluxes.vthermo_PO4_lolat - fluxes.prod_PO4_lolat) / state.vol_lolat

    newState.DIC_deep += (fluxes.vmix_DIC_hilat + fluxes.vmix_DIC_lolat + fluxes.vthermo_DIC_deep + fluxes.prod_DIC_hilat + fluxes.prod_DIC_lolat) / state.vol_deep
    newState.DIC_hilat += (- fluxes.vmix_DIC_hilat + fluxes.vthermo_DIC_hilat - fluxes.prod_DIC_hilat + 1e3 * fluxes.exCO2_hilat) / state.vol_hilat
    newState.DIC_lolat += (- fluxes.vmix_DIC_lolat + fluxes.vthermo_DIC_lolat - fluxes.prod_DIC_lolat + 1e3 * fluxes.exCO2_lolat) / state.vol_lolat

    newState.TA_deep += (fluxes.vmix_TA_hilat + fluxes.vmix_TA_lolat + fluxes.vthermo_TA_deep + fluxes.prod_TA_hilat + fluxes.prod_TA_lolat) / state.vol_deep
    newState.TA_hilat += (- fluxes.vmix_TA_hilat + fluxes.vthermo_TA_hilat - fluxes.prod_TA_hilat) / state.vol_hilat
    newState.TA_lolat += (- fluxes.vmix_TA_lolat + fluxes.vthermo_TA_lolat - fluxes.prod_TA_lolat) / state.vol_lolat

    newState.pCO2_atmos += moles2uatm(- fluxes.exCO2_hilat - fluxes.exCO2_lolat)

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
        ymin: 350,
        ymax: 450,
        precision: 3
    },
    'pCO2_deep': {
        label: 'pCO2',
        ymin: 350,
        ymax: 450,
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
        ymin: 350,
        ymax: 450,
        precision: 3
    },
    'pCO2_hilat': {
        label: 'pCO2',
        ymin: 350,
        ymax: 450,
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
        ymin: 350,
        ymax: 450,
        precision: 3
    },
    'pCO2_lolat': {
        label: 'pCO2',
        ymin: 350,
        ymax: 450,
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
        precision: 4
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