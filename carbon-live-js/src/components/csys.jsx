// functions for calculating C chemistry

var BT35 = 415.7e-6 / 35.;

export function calc_Ks({ Tc, Sal }) {
    let sqrtSal = Math.sqrt(Sal);
    let T = Tc + 273.15;
    let lnT = Math.log(T);

    let K0 = Math.exp(-60.2409 + 93.4517 * 100 / T + 23.3585 * Math.log(T / 100) + Sal * (0.023517 - 0.023656 * T / 100 + 0.0047036 * (T / 100) * (T / 100)));  // Weiss74
    let K1 = Math.pow(10, -3633.86 / T + 61.2172 - 9.67770 * lnT + 0.011555 * Sal - 0.0001152 * Sal * Sal)  // Dickson
    let K2 = Math.pow(10, -471.78 / T - 25.9290 + 3.16967 * lnT + 0.01781 * Sal - 0.0001122 * Sal * Sal);

    let KW = Math.exp(148.9652 - 13847.26 / T - 23.6521 * lnT + (118.67 / T - 5.977 + 1.0495 * lnT) * sqrtSal - 0.01615 * Sal)
    let KB = Math.exp((-8966.90 - 2890.53 * sqrtSal - 77.942 * Sal + 1.728 * Sal * sqrtSal - 0.0996 * Sal * Sal) / T + (148.0248 + 137.1942 * sqrtSal + 1.62142 * Sal) + (-24.4344 - 25.085 * sqrtSal - 0.2474 * Sal) * lnT + 0.053105 * sqrtSal * T);  // Dickson90b

    return {
        K0: K0,
        K1: K1,
        K2: K2,
        KB: KB,
        KW: KW
    }
}

export function give_DIC_TA({ DIC, TA, Sal, Ks}) {
    // Returns [H], units: mol/kg

    let BT = BT35 * Sal;
    let pH = 8.;
    let H = 10 ** -pH;
    let diff_H = H;
    let tiny_diff_H = 1e-15;

    let HCO3 = null;
    let CO3 = null;
    let CAlk = null;
    let BAlk = null;
    let OH = null;
    let residual = null;
    let slope = null;

    while (Math.abs(diff_H) > tiny_diff_H) {
        HCO3 = DIC / (1 + H / Ks.K1 + Ks.K2 / H);
        CO3 = DIC / (1 + H / Ks.K2 + H**2 / (Ks.K1 * Ks.K2))
        CAlk = HCO3 + 2 * CO3;
        BAlk = BT * Ks.KB / (Ks.KB + H);
        OH = Ks.KW / H;

        residual = TA - CAlk - BAlk - OH + H;
        slope = 1 + (2 * CO3 + HCO3 + OH) / H + BT * Ks.KB / (Ks.KB + H) ** 2

        diff_H = residual / slope;
        H -= diff_H;
    }

    return H
}

export function give_H_CO2({H, CO2, Ks}) {
    // Returns DIC, units: mol/kg
    return CO2 * (1 + Ks.K1 / H + Ks.K1 * Ks.K2 / H ** 2)  // DIC
}

// For adding CO2 with conserved TA.
export function give_fCO2_TA({ fCO2, TA, Sal, Ks}) {
    // Returns [H], units: mol/kg
    let BT = BT35 * Sal;

    let CO2 = fCO2 * Ks.K0;
    let pH = 8.;
    let H = 10 ** -pH;
    let diff_H = H;
    let tiny_diff_H = 1e-15;

    let HCO3 = null;
    let CO3 = null;
    let CAlk = null;
    let BAlk = null;
    let OH = null;
    let residual = null;
    let slope = null;

    while (Math.abs(diff_H) > tiny_diff_H) {
        HCO3 = Ks.K1 * CO2 / H;
        CO3 = Ks.K1 * Ks.K2 * CO2 / H ** 2;
        CAlk = HCO3 + 2 * CO3;
        BAlk = BT * Ks.KB / (Ks.KB + H);
        OH = Ks.KW / H;

        residual = TA - CAlk - BAlk - OH + H;
        slope = 1 + (2 * CO3 + HCO3 + OH) / H + BT * Ks.KB / (Ks.KB + H) ** 2

        diff_H = residual / slope;
        H -= diff_H;
    }

    return H
}

export function calc_csys({ DIC, TA, Sal, Temp }) {
    TA = TA * 1e-6;
    DIC = DIC * 1e-6;

    let Ks = calc_Ks({ Tc: Temp, Sal: Sal })

    let H = give_DIC_TA({DIC: DIC, TA:TA, Sal: Sal, Ks:Ks})

    let pH = -Math.log10(H)
    let CO2 = 1e6 * DIC / (1 + Ks.K1 / H + Ks.K1 * Ks.K2 / H**2)
    let HCO3 = 1e6 * DIC / (1 + H / Ks.K1 + Ks.K2 / H);
    let CO3 = 1e6 * DIC / (1 + H / Ks.K2 + H ** 2 / (Ks.K1 * Ks.K2));
    let fCO2 = CO2 / Ks.K0;

    return {
        pH: pH,
        fCO2: fCO2,
        CO2: CO2 * 1e6,
        HCO3: HCO3,
        CO3: CO3,
    }
}

