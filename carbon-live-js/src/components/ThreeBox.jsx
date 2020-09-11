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
function calc_DIC_surf({PO4_deep, PO4_surf, percent_CaCO3, total_DIC}) {
    let delta_PO4 = PO4_deep - PO4_surf;
    
    let organic = 106 * delta_PO4;
    let CaCO3 = 106 * percent_CaCO3 * delta_PO4 / 100;
    
    return total_DIC - organic - CaCO3
}

// Replace this with differential equations. Stoichiometric removal flux, mixing.
function calc_TA_surf({PO4_deep, PO4_surf, percent_CaCO3, total_TA}) {
    let delta_PO4 = PO4_deep - PO4_surf;
    
    let organic = 0.15 * 106 * delta_PO4;
    let CaCO3 = 2 * 106 * percent_CaCO3 * delta_PO4 / 100;
    
    return total_TA - organic - CaCO3
}

// Replace this with differential equation. Remineralisation, mixing, sedimentation -- lysocline? 
function calc_X_deep({X_hilat, X_lolat, X_total, vol_hilat, vol_lolat, vol_deep}) {
    let vol_total = vol_hilat + vol_lolat + vol_deep;
    return (X_total * vol_total - X_hilat * vol_hilat - X_lolat * vol_lolat) / vol_deep
}

export const start_state = {
    'vmix': 6.0e14,
    'vthermo': 6.3072e14,
    'tau_hilat': 50,
    'tau_lolat': 1,
    'percent_CaCO3': 30,
    'total_PO4': 2.5,
    'total_DIC': 2140,
    'total_TA': 2400,
    'vol_deep': 1.25e18,
    'vol_lolat': 1.31e16,
    'vol_hilat': 2.97e16,
    'PO4_lolat': 0,
    'PO4_hilat': 0,
    'PO4_deep': 2.5,
    'DIC_lolat': 2140,
    'DIC_hilat': 2140,
    'DIC_deep': 2140,
    'TA_lolat': 2400,
    'TA_hilat': 2400,
    'TA_deep': 2400
  };

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
    'percent_CaCO3': {
        label: '% CaCO3',
        ymin: 0,
        ymax: 100,
        precision: 1
    },
    'total_PO4': {
        label: 'Total [PO4]',
        ymin: 2,
        ymax: 3,
        precision: 3
    },
    'total_DIC': {
        label: 'Total [DIC]',
        ymin: 1800,
        ymax: 2000,
        precision: 4
    },
    'total_TA': {
        label: 'Total Alkalinity',
        ymin: 2200,
        ymax: 2400,
        precision: 4
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
  };

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
        vthermo: state['vthermo'], 
        tau_lolat: state['tau_lolat'], 
        vol_lolat: state['vol_lolat']
    });

    newState['DIC_lolat'] = calc_DIC_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_lolat'],
        percent_CaCO3: state['percent_CaCO3'],
        total_DIC: state['total_DIC']
    });

    newState['DIC_hilat'] = calc_DIC_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_hilat'],
        percent_CaCO3: state['percent_CaCO3'],
        total_DIC: state['total_DIC']
    });

    newState['DIC_deep'] = calc_X_deep({
        X_hilat: newState['DIC_hilat'],
        X_lolat: newState['DIC_lolat'],
        X_total: newState['total_DIC'],
        vol_hilat: newState['vol_hilat'],
        vol_lolat: newState['vol_lolat'],
        vol_deep: newState['vol_deep'],
    });

    newState['TA_lolat'] = calc_TA_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_lolat'],
        percent_CaCO3: state['percent_CaCO3'],
        total_TA: state['total_TA']
    });

    newState['TA_hilat'] = calc_TA_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_hilat'],
        percent_CaCO3: state['percent_CaCO3'],
        total_TA: state['total_TA']
    });

    newState['TA_deep'] = calc_X_deep({
        X_hilat: newState['TA_hilat'],
        X_lolat: newState['TA_lolat'],
        X_total: newState['total_TA'],
        vol_hilat: newState['vol_hilat'],
        vol_lolat: newState['vol_lolat'],
        vol_deep: newState['vol_deep'],
    });

    return newState
}

