function dPO4_deep({PO4_deep, PO4_surf, vmix, tau, vol_surf, vol_deep}) {
    return (vmix * (PO4_surf - PO4_deep) + 
    (PO4_surf * vol_surf / tau)) / vol_deep
}
    

function dPO4_surf({PO4_deep, PO4_surf, vmix, tau, vol_surf}) {
    return (vmix * (PO4_deep - PO4_surf) -
    (PO4_surf * vol_surf / tau)) / vol_surf
}

function calc_DIC_surf({PO4_deep, PO4_surf, percent_CaCO3, total_DIC}) {
    let delta_PO4 = PO4_deep - PO4_surf;
    
    let organic = 106 * delta_PO4;
    let CaCO3 = 106 * percent_CaCO3 * delta_PO4 / 100;
    
    return total_DIC - organic - CaCO3
}

function calc_TA_surf({PO4_deep, PO4_surf, percent_CaCO3, total_TA}) {
    let delta_PO4 = PO4_deep - PO4_surf;
    
    let organic = 0.15 * 106 * delta_PO4;
    let CaCO3 = 2 * 106 * percent_CaCO3 * delta_PO4 / 100;
    
    return total_TA - organic - CaCO3
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
    'DIC_surf': 2000,
    'TA_surf': 2000
  };

export const var_names = {
  'vmix': 'Mixing Rate (m3 / yr)',
  'tau': 'Productivity (tau)',
  'percent_CaCO3': '% CaCO3',
  'total_PO4': 'Total [PO4]',
  'total_DIC': 'Total [DIC]',
  'total_TA': 'Total Alkalinity',
  'vol_deep': 'Deep Ocean Volume (m3)',
  'vol_surf': 'Surface Ocean Volume (m3)',
  'PO4_surf': 'Surface [PO4]',
  'PO4_deep': 'Deep [PO4]',
  'DIC_surf': 'Surface [DIC]',
  'TA_surf': 'Surface Alkalinity'
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

    return newState
}

