function dPO4_deep({PO4_deep, PO4_surf, vmix, tau, vol_surf, vol_deep}) {
    return (vmix * (PO4_surf - PO4_deep) + 
    (PO4_surf * vol_surf / tau)) / vol_deep
}
    

function dPO4_surf({PO4_deep, PO4_surf, vmix, tau, vol_surf}) {
    return (vmix * (PO4_deep - PO4_surf) -
    (PO4_surf * vol_surf / tau)) / vol_surf
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
function calc_X_deep({X_surf, X_total, vol_surf, vol_deep}) {
    let vol_total = vol_surf + vol_deep;
    return (X_total * vol_total - X_surf * vol_surf) / vol_deep
}

export const start_state = {
    'vmix': 6.3072e14,
    'tau': 5,
    'percent_CaCO3': 10,
    'total_PO4': 2.5,
    'total_DIC': 2140,
    'total_TA': 2400,
    'vol_deep': 1.25e18,
    'vol_surf': 1.31e16,
    'PO4_surf': 0,
    'PO4_deep': 2.5,
    'DIC_surf': 2140,
    'DIC_deep': 2140,
    'TA_surf': 2400,
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
    'tau': {
        label: 'Productivity (tau)',
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
    'vol_surf': {
        label: 'Surface Ocean Volume (m3)',
        ymin: null,
        ymax: null,
        precision: null
    },
    'PO4_surf': {
        label: 'Surface [PO4]',
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
    'DIC_surf': {
        label: 'Surface [DIC]',
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
    'TA_surf': {
        label: 'Surface Alkalinity',
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

    newState['PO4_surf'] = state['PO4_surf'] + dPO4_surf({
        PO4_deep: state['PO4_deep'],
        PO4_surf: state['PO4_surf'],
        vmix: state['vmix'],
        tau: state['tau'],
        vol_surf: state['vol_surf']
    });

    newState['PO4_deep'] = state['PO4_deep'] + dPO4_deep({
        PO4_deep: state['PO4_deep'],
        PO4_surf: state['PO4_surf'],
        vmix: state['vmix'],
        tau: state['tau'],
        vol_surf: state['vol_surf'],
        vol_deep: state['vol_deep']
    });

    newState['DIC_surf'] = calc_DIC_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_surf'],
        percent_CaCO3: state['percent_CaCO3'],
        total_DIC: state['total_DIC']
    });

    newState['TA_surf'] = calc_TA_surf({
        PO4_deep: newState['PO4_deep'],
        PO4_surf: newState['PO4_surf'],
        percent_CaCO3: state['percent_CaCO3'],
        total_TA: state['total_TA']
    });

    newState['TA_deep'] = calc_X_deep({
        X_surf: newState['TA_surf'],
        X_total: newState['total_TA'],
        vol_surf: state['vol_surf'],
        vol_deep: state['vol_deep']
    });

    newState['DIC_deep'] = calc_X_deep({
        X_surf: newState['DIC_surf'],
        X_total: newState['total_DIC'],
        vol_surf: state['vol_surf'],
        vol_deep: state['vol_deep']
    })


    return newState
}

