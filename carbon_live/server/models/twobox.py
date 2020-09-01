import numpy as np

# model parameters
start_params = {
    'vmix': 6.3072e14,  # m3 yr-1
    'tau': 5,  # productivity - surface residence time yr-1
    'percent_CaCO3': 10,
    # ocean averages
    'total_PO4': 2.5,
    'total_DIC': 2140,
    'total_TA': 2400,
    # 'total_Ca': 10.2e-3  # mol kg
    'vol_deep': 1.25e18,
    'vol_surf': 1.31e16,
}

# # set up boxes
# surf = {'temp': 25.,
#         'sal': 35.,
#         'K0': .0285,
#         'K1': 1.45e-6,
#         'K2': 1.102e-9,
#         'KW': 5.982e-14,
#         'KB': 2.619e-9,
#         'KspC': 4.2658e-7,
#         'KspA': 6.45654e-7,
#         'vol': 1.31e16}

# deep = {'temp': 2.0,
#         'sal': 35.,
#         'K0': 0.05855,
#         'K1': 8.279e-7,
#         'K2': 4.475e-10,
#         'KW': 6.068e-15,
#         'KB': 1.349e-9,
#         'KspC': 7.76e-7,
#         'KspA': 1.2e-6,
#         'vol': 1.25e18}

def dPO4_deep(PO4_deep, PO4_surf, vmix, tau, vol_surf, vol_deep, **kwargs):
    return (vmix * (PO4_surf - PO4_deep) + 
            (PO4_surf * vol_surf / tau)) / vol_deep

def dPO4_surf(PO4_deep, PO4_surf, vmix, tau, vol_surf, **kwargs):
    return (vmix * (PO4_deep - PO4_surf) -
            (PO4_surf * vol_surf / tau)) / vol_surf

def calc_DIC_surf(PO4_deep, PO4_surf, percent_CaCO3, total_DIC, **kwargs):
    delta_PO4 = PO4_deep - PO4_surf
    
    organic = 106 * delta_PO4
    CaCO3 = 106 * percent_CaCO3 * delta_PO4 / 100
    
    return total_DIC - organic - CaCO3

def calc_TA_surf(PO4_deep, PO4_surf, percent_CaCO3, total_TA, **kwargs):
    delta_PO4 = PO4_deep - PO4_surf
    
    organic = 0.15 * 106 * delta_PO4
    CaCO3 = 2 * 106 * percent_CaCO3 * delta_PO4 / 100
    
    return total_TA - organic - CaCO3


def step(last):
    last.update({
        'PO4_surf': last['PO4_surf'] + dPO4_surf(**last),
        'PO4_deep': last['PO4_deep'] + dPO4_deep(**last),
    })
    last.update({
        'DIC_surf': calc_DIC_surf(**last),
        'TA_surf': calc_TA_surf(**last)
    })
    return last