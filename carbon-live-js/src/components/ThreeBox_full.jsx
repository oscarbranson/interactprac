import { calc_csys } from './csys';

function calc_percent_CaCO3(c, cb, percent_CaCO3) {
    if (c >= cb) {
        return percent_CaCO3
    } else {
        return percent_CaCO3 * c / cb
    }
}

function dPO4_deep({PO4_deep, PO4_hilat, PO4_lolat, vmix, vthermo, tau_hilat, vol_hilat, tau_lolat, vol_lolat, vol_deep}) {
    return (vmix * PO4_hilat -
            vmix * PO4_deep + 
            vthermo * PO4_hilat - 
            vthermo * PO4_deep + 
            (PO4_hilat * vol_hilat / tau_hilat) + 
            (PO4_lolat * vol_lolat / tau_lolat)) / vol_deep
    }

function dPO4_hilat({PO4_deep, PO4_hilat, PO4_lolat, vmix, vthermo, tau_hilat, vol_hilat}) {
    return (vmix * PO4_deep -
            vmix * PO4_hilat +
            vthermo * PO4_lolat -
            vthermo * PO4_hilat -
            (PO4_hilat * vol_hilat / tau_hilat)) / vol_hilat
    }

function dPO4_lolat({PO4_deep, PO4_lolat, vthermo, tau_lolat, vol_lolat}) {
    return (vthermo * PO4_deep -
            vthermo * PO4_lolat -
            (PO4_lolat * vol_lolat / tau_lolat)) / vol_lolat
        }

// Replace this with differential equations. Stoichiometric removal flux, mixing, atmospheric equilibration.
function dDIC_deep({DIC_deep, DIC_hilat, PO4_hilat, PO4_lolat, vmix, vthermo, tau_hilat, vol_hilat, tau_lolat, vol_lolat, vol_deep, percent_CaCO3_lolat, percent_CaCO3_hilat}) {
    let f_DIC_lolat = 106 + 106 * percent_CaCO3_lolat / 100;
    let f_DIC_hilat = 106 + 106 * percent_CaCO3_hilat / 100;
    return (vmix * DIC_hilat -
            vmix * DIC_deep + 
            vthermo * DIC_hilat -
            vthermo * DIC_deep + 
            f_DIC_hilat * (PO4_hilat * vol_hilat / tau_hilat) + 
            f_DIC_lolat * (PO4_lolat * vol_lolat / tau_lolat)) / vol_deep
    }

function dDIC_hilat({DIC_deep, DIC_hilat, DIC_lolat, PO4_hilat, vmix, vthermo, tau_hilat, vol_hilat, percent_CaCO3}) {
    let f_DIC = 106 + 106 * percent_CaCO3 / 100;
    return (vmix * DIC_deep -
            vmix * DIC_hilat +
            vthermo * DIC_lolat -
            vthermo * DIC_hilat -
            f_DIC * (PO4_hilat * vol_hilat / tau_hilat)) / vol_hilat
    }

function dDIC_lolat({DIC_deep, DIC_lolat, PO4_lolat, vthermo, tau_lolat, vol_lolat, percent_CaCO3}) {
    let f_DIC = 106 + 106 * percent_CaCO3 / 100;
    return (vthermo * DIC_deep -
            vthermo * DIC_lolat -
            f_DIC * (PO4_lolat * vol_lolat / tau_lolat)) / vol_lolat
        }

function dTA_deep({TA_deep, TA_hilat, PO4_hilat, PO4_lolat, vmix, vthermo, tau_hilat, vol_hilat, tau_lolat, vol_lolat, vol_deep, percent_CaCO3_lolat, percent_CaCO3_hilat}) {
    let f_TA_lolat = 0.15 * 106 + 2 * 106 * percent_CaCO3_lolat / 100;
    let f_TA_hilat = 0.15 * 106 + 2 * 106 * percent_CaCO3_hilat / 100;
    return (vmix * TA_hilat -
            vmix * TA_deep + 
            vthermo * TA_hilat -
            vthermo * TA_deep + 
            f_TA_hilat * (PO4_hilat * vol_hilat / tau_hilat) + 
            f_TA_lolat * (PO4_lolat * vol_lolat / tau_lolat)) / vol_deep
    }

function dTA_hilat({TA_deep, TA_hilat, TA_lolat, PO4_hilat, vmix, vthermo, tau_hilat, vol_hilat, percent_CaCO3}) {
    let f_TA = 0.15 * 106 + 2 * (106 * percent_CaCO3 / 100);
    return (vmix * TA_deep -
            vmix * TA_hilat +
            vthermo * TA_lolat -
            vthermo * TA_hilat -
            f_TA * (PO4_hilat * vol_hilat / tau_hilat)) / vol_hilat
    }

function dTA_lolat({TA_deep, TA_lolat, PO4_lolat, vthermo, tau_lolat, vol_lolat, percent_CaCO3}) {
    let f_TA = 0.15 * 106 + 2 * (106 * percent_CaCO3 / 100);
    return (vthermo * TA_deep -
            vthermo * TA_lolat -
            f_TA * (PO4_lolat * vol_lolat / tau_lolat)) / vol_lolat
        }

// const total_DIC = 2100;
// const total_TA = 2200;

// From Table 8.2.4 of Sarmiento & Gruber mean global ocean
// const total_DIC = 2256;
// const total_TA = 2364;

export const start_state = {
    'vmix': 6.0e14,
    'vthermo': 6.3072e14,
    'tau_hilat': 50,
    'tau_lolat': 1,
    'percent_CaCO3_hilat': 30,
    'percent_CaCO3_lolat': 30,
    'vol_deep': 1.25e18,
    'vol_lolat': 1.31e16,
    'vol_hilat': 2.97e16,
    // Temp and sal from Table 8.2.4 of Sarmiento & Gruber
    'temp_deep': 1.8,
    'temp_hilat': 4,
    'temp_lolat': 23,
    'sal_lolat': 35.15,
    'sal_hilat': 33,
    'sal_deep': 34.73,
    'PO4_lolat': 0,
    'PO4_hilat': 0,
    'PO4_deep': 2.5,
    'DIC_lolat': 1938,  // total_DIC,
    'DIC_hilat': 2049,  // total_DIC,
    'DIC_deep': 2264.2,  // total_DIC,
    'TA_lolat': 2180,  // total_TA,
    'TA_hilat': 2257,  // total_TA,
    'TA_deep': 2368.5,  // total_TA,
    'pH_deep': 7.97,
    'c_deep': 1,
    'fCO2_deep': 300,
    'CO2_deep': 9,
    'HCO3_deep': 1900,
    'CO3_deep': 300,
    'pH_hilat': 8.23,
    'fCO2_hilat': 300,
    'CO2_hilat': 9,
    'HCO3_hilat': 1900,
    'CO3_hilat': 300,
    'c_hilat': 1,
    'pH_lolat': 7.99,
    'c_lolat': 1,
    'fCO2_lolat': 300,
    'CO2_lolat': 9,
    'HCO3_lolat': 1900,
    'CO3_lolat': 300,
    'pCO2_atmos': 303,
  };

function update_csys(state) {
    let csys_deep = calc_csys({
        DIC: state['DIC_deep'],
        TA: state['TA_deep'],
        Sal: state['sal_deep'],
        Temp: state['temp_deep']
    })
    
    let csys_hilat = calc_csys({
        DIC: state['DIC_hilat'],
        TA: state['TA_hilat'],
        Sal: state['sal_hilat'],
        Temp: state['temp_hilat']
    })
    
    let csys_lolat = calc_csys({
        DIC: state['DIC_lolat'],
        TA: state['TA_lolat'],
        Sal: state['sal_lolat'],
        Temp: state['temp_lolat']
    })
    
    for (let cvar of ['pH', 'fCO2', 'CO2', 'HCO3', 'CO3', 'c']) {
        state[cvar + '_deep'] = csys_deep[cvar]
        state[cvar + '_lolat'] = csys_lolat[cvar]
        state[cvar + '_hilat'] = csys_hilat[cvar]
    }
}

export function step(state) {
    let newState = Object.assign({}, state);

    newState['PO4_deep'] = state['PO4_deep'] + dPO4_deep({
        PO4_deep: state['PO4_deep'],
        PO4_hilat: state['PO4_hilat'], 
        PO4_lolat: state['PO4_lolat'], 
        vmix: state['vmix'],
        vthermo: state['vthermo'],
        tau_hilat: state['tau_hilat'], 
        vol_hilat: state['vol_hilat'], 
        tau_lolat: state['tau_lolat'],
        vol_lolat: state['vol_lolat'], 
        vol_deep: state['vol_deep']
    });

    newState['PO4_hilat'] = state['PO4_hilat'] + dPO4_hilat({
        PO4_deep: state['PO4_deep'],
        PO4_hilat: state['PO4_hilat'],
        PO4_lolat: state['PO4_lolat'],
        vmix: state['vmix'],
        vthermo: state['vthermo'],
        tau_hilat: state['tau_hilat'],
        vol_hilat: state['vol_hilat']
    });

    newState['PO4_lolat'] = state['PO4_lolat'] + dPO4_lolat({
        PO4_deep: state['PO4_deep'], 
        PO4_lolat: state['PO4_lolat'], 
        vmix: state['vmix'],
        vthermo: state['vthermo'], 
        tau_lolat: state['tau_lolat'], 
        vol_lolat: state['vol_lolat']
    });

    newState['DIC_hilat'] = state['DIC_hilat'] + dDIC_hilat({
        DIC_deep: state['DIC_deep'],
        DIC_hilat: state['DIC_hilat'],
        DIC_lolat: state['DIC_lolat'],
        PO4_hilat: newState['PO4_hilat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_hilat: newState['tau_hilat'],
        vol_hilat: newState['vol_hilat'],
        percent_CaCO3: calc_percent_CaCO3(newState['c_hilat'], 1, newState['percent_CaCO3_hilat']),
    })

    newState['DIC_lolat'] = state['DIC_lolat'] + dDIC_lolat({
        DIC_deep: state['DIC_deep'],
        DIC_lolat: state['DIC_lolat'],
        PO4_lolat: newState['PO4_lolat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_lolat: newState['tau_lolat'],
        vol_lolat: newState['vol_lolat'],
        percent_CaCO3: calc_percent_CaCO3(newState['c_lolat'], 1, newState['percent_CaCO3_lolat']),
    })

    newState['DIC_deep'] = state['DIC_deep'] + dDIC_deep({
        DIC_deep: state['DIC_deep'],
        DIC_lolat: state['DIC_lolat'],
        DIC_hilat: state['DIC_hilat'],
        PO4_lolat: newState['PO4_lolat'],
        PO4_hilat: newState['PO4_hilat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_hilat: newState['tau_hilat'],
        vol_hilat: newState['vol_hilat'],
        tau_lolat: newState['tau_lolat'],
        vol_lolat: newState['vol_lolat'],
        vol_deep: state['vol_deep'],
        percent_CaCO3_hilat: calc_percent_CaCO3(newState['c_hilat'], 1, newState['percent_CaCO3_hilat']),
        percent_CaCO3_lolat: calc_percent_CaCO3(newState['c_lolat'], 1, newState['percent_CaCO3_lolat']),
    })

    newState['TA_hilat'] = state['TA_hilat'] + dTA_hilat({
        TA_deep: state['TA_deep'],
        TA_hilat: state['TA_hilat'],
        TA_lolat: state['TA_lolat'],
        PO4_hilat: newState['PO4_hilat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_hilat: newState['tau_hilat'],
        vol_hilat: newState['vol_hilat'],
        percent_CaCO3: calc_percent_CaCO3(newState['c_hilat'], 1, newState['percent_CaCO3_hilat']),
    })
    
    newState['TA_lolat'] = state['TA_lolat'] + dTA_lolat({
        TA_deep: state['TA_deep'],
        TA_lolat: state['TA_lolat'],
        PO4_lolat: newState['PO4_lolat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_lolat: newState['tau_lolat'],
        vol_lolat: newState['vol_lolat'],
        percent_CaCO3: calc_percent_CaCO3(newState['c_lolat'], 1, newState['percent_CaCO3_lolat']),
    })
    
    newState['TA_deep'] = state['TA_deep'] + dTA_deep({
        TA_deep: state['TA_deep'],
        TA_lolat: state['TA_lolat'],
        TA_hilat: state['TA_hilat'],
        PO4_lolat: newState['PO4_lolat'],
        PO4_hilat: newState['PO4_hilat'],
        vmix: newState['vmix'],
        vthermo: newState['vthermo'],
        tau_hilat: newState['tau_hilat'],
        vol_hilat: newState['vol_hilat'],
        tau_lolat: newState['tau_lolat'],
        vol_lolat: newState['vol_lolat'],
        vol_deep: state['vol_deep'],
        percent_CaCO3_lolat: calc_percent_CaCO3(newState['c_lolat'], 1, newState['percent_CaCO3_lolat']),
        percent_CaCO3_hilat: calc_percent_CaCO3(newState['c_hilat'], 1, newState['percent_CaCO3_hilat']),
    })

    update_csys(newState)

    newState['pCO2_atmos'] = (newState['fCO2_hilat'] * newState['vol_hilat'] + newState['fCO2_lolat'] * newState['vol_lolat']) / (newState['vol_lolat'] + newState['vol_hilat'])

    return newState
}

export const var_info = {
    // variable: [label, min, max]
    'vmix': {
        label:'Mixing Rate (m3 / yr)', 
        ymin: null, 
        ymax: null,
        precision: null
    },
    'vthermo': {
        label:'Thermohaline Mixing Rate (m3 / yr)', 
        ymin: null, 
        ymax: null,
        precision: null
    },
    'tau_lolat': {
        label: 'Low Lat. Productivity (tau)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'tau_hilat': {
        label: 'High Lat. Productivity (tau)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'percent_CaCO3_lolat': {
        label: 'Low Lat. % CaCO3',
        ymin: 0,
        ymax: 100,
        precision: 1
    },
    'percent_CaCO3': {
        label: 'High Lat. % CaCO3',
        ymin: 0,
        ymax: 100,
        precision: 1
    },
    'vol_deep': {
        label: 'Deep Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'vol_lolat': {
        label: 'Low Lat. Surface Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'vol_hilat': {
        label: 'High Lat. Surface Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },    
    'PO4_lolat': {
        label: 'Low Lat. Surface [PO4]',
        ymin: 0,
        ymax: 1,
        precision: 3
    },
    'PO4_hilat': {
        label: 'High Lat. Surface [PO4]',
        ymin: 0,
        ymax: 1,
        precision: 3
    },
    'PO4_deep': {
        label: 'Deep [PO4]',
        ymin: 2.4,
        ymax: 2.6,
        precision: 3
    },
    'DIC_hilat': {
        label: 'High Lat. Surface [DIC]',
        ymin: 1800,
        ymax: 2000,
        precision: 4
    },
    'DIC_lolat': {
        label: 'Low Lat. Surface [DIC]',
        ymin: 1800,
        ymax: 2000,
        precision: 4
    },
    'DIC_deep': {
        label: 'Deep [DIC]',
        ymin: 2130,
        ymax: 2150,
        precision: 5
    },
    'TA_lolat': {
        label: 'Low Lat. Surface Alkalinity',
        ymin: 2200,
        ymax: 2400,
        precision: 4
    },
    'TA_hilat': {
        label: 'High Lat. Surface Alkalinity',
        ymin: 2200,
        ymax: 2400,
        precision: 4
    },
    'TA_deep': {
        label: 'Deep Alkalinity',
        ymin: 2390,
        ymax: 2410,
        precision: 5
    },
    'pH_deep': {
        label: 'Deep pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_deep': {
        label: 'Deep fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_deep': {
        label: 'Deep [CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_deep': {
        label: 'Deep [HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_deep': {
        label: 'Deep [CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'pH_hilat': {
        label: 'High Lat. pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_hilat': {
        label:  'High Lat. fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_hilat': {
        label:  'High Lat. [CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_hilat': {
        label:  'High Lat. [HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_hilat': {
        label:  'High Lat. [CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'pH_lolat': {
        label:  'Low Lat. pH',
        ymin: 7.5,
        ymax: 8.5,
        precision: 3
    },
    'fCO2_lolat': {
        label: 'Low Lat. fCO2',
        ymin: 200,
        ymax: 500,
        precision: 3
    },
    'CO2_lolat': {
        label: 'Low Lat. [CO2]',
        ymin: 5,
        ymax: 15,
        precision: 3
    },
    'HCO3_lolat': {
        label: 'Low Lat. [HCO3]',
        ymin: 1500,
        ymax: 2000,
        precision: 4
    },
    'CO3_lolat': {
        label: 'Low Lat. [CO3]',
        ymin: 70,
        ymax: 120,
        precision: 3
    },
    'c_deep': {
        label: 'Deep Calcite Saturation',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'c_lolat': {
        label: 'Low Lat. Calcite Saturation',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'c_hilat': {
        label: 'High Lat Calcite Saturation',
        ymin: 0,
        ymax: 1,
        precision: 2
    },
    'pCO2_atmos': {
        label: 'Atmospheric CO2',
        ymin: 300,
        ymax: 500,
        precision: 3
    },
    'temp_lolat': {
        label: 'Low Lat. Surface Temp',
        ymin: 20,
        ymax: 25,
        precision: 3
    },
    'temp_hilat': {
        label: 'High Lat. Surface Temp',
        ymin: 2,
        ymax: 6,
        precision: 3
    },
    'temp_deep': {
        label: 'Deep Temp',
        ymin: 0,
        ymax: 4,
        precision: 3
    },
    'sal_lolat': {
        label: 'Low Lat. Surface Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
    'sal_hilat': {
        label: 'High Lat. Surface Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
    'sal_deep': {
        label: 'Deep Temp',
        ymin: 36,
        ymax: 34,
        precision: 3
    },
  };