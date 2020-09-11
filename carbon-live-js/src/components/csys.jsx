// functions for calculating C chemistry

export function calc_Ks({Tc, Sal}) {
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

// TA = 2 CO3 + HCO3 + BOH3 + OH - H
// DIC = CO3 + HCO3 + CO2

export function calc_csys({DIC, TA, Sal, Temp}) {
    TA = TA * 1e-6;
    DIC = DIC * 1e-6;

    let BT = 416e-6 * Sal / 35;

    let Ks = calc_Ks({Tc: Temp, Sal: Sal})

    let pH = 8.;  // start pH
    let H = 10 ** -pH;
    let diff_H = H;
    let tiny_diff_H = 1e-15;

    let iter = 0;

    let CA = null;
    let a = null;
    let b = null;
    let c = null;
    let H_old = null;

    while (diff_H > tiny_diff_H) {
        H_old = H;

        CA = TA - BT * (Ks.KB / (Ks.KB + H))

        a = CA;
        b = Ks.K1 * (CA - DIC);
        c = Ks.K1 * Ks.K2 * (CA - 2 * DIC);
        H = (-b + Math.sqrt(b**2 - 4 * a * c)) / (2 * a);

        diff_H = Math.abs(H - H_old);
        iter += 1;
    }

    pH = -Math.log10(H)
    let CO2aq = CA / (Ks.K1 / H + 2 * Ks.K1 * Ks.K2 / H**2);
    let HCO3 = 1e6 * DIC / (1 + H / Ks.K1 + Ks.K2 / H);
    let CO3 = 1e6 * DIC / (1 + H / Ks.K2 + H**2 / (Ks.K1 * Ks.K2));
    let pCO2 = CO2aq / Ks.K0 * 1e6;


    return {
        pH: pH,
        pCO2: pCO2,
        CO2: CO2aq * 1e6,
        HCO3: HCO3,
        CO3: CO3,
    }
}

// function calc_DIC({pCO2, TA, Temp, Sal}) {
//     let TempK = Temp + 273.15;
//     TA = TA * 1e-6;
//     let CO2 = pCO2 * 1e-6 * Ks.K0;

//     let BT = 416e-6 * Sal / 35;

//     let Ks = calc_Ks({Tc: Temp, Sal: Sal})

//     let pH = 8.;  // start pH
//     let H = 10 ** -pH;
//     let diff_H = H;
//     let tiny_diff_H = 1e-15;

//     let iter = 0;
//     let CA = null;
//     let a = null;
//     let b = null;
//     let c = null;
//     let H_old = null;

//     while (diff_H > tiny_diff_H) {
//         H_old = H;
//         CA = TA - BT * (Ks.KB / (Ks.KB + H))
        
//         residual = TA - CA - BT * (Ks.KB / (Ks.KB + H))

//         // a = CA;
//         // b = Ks.K1 * (CA - DIC);
//         // c = Ks.K1 * Ks.K2 * (CA - 2 * DIC);
//         // H = (-b + Math.sqrt(b**2 - 4 * a * c)) / (2 * a);


//         diff_H = Math.abs(H - H_old);
//         iter += 1;
//     }
// }

function calc_DIC({pCO2, TA, Temp, Sal}) {
    TA = TA * 1e-6;
    let CO2 = pCO2 * 1e-6 * Ks.K0;

    let BT = 416e-6 * Sal / 35;

    let Ks = calc_Ks({Tc: Temp, Sal: Sal})

    let pHguess = 8.;
    let pHtol = 0.0000001;
    let deltapH = pHtol + 1;
    let ln10 = Math.log(10)

    while (deltapH > pHtol) {

        // Insert routine from cbsyst - returns pH


        deltapH = Math.abs(...)
    }

    // Calculate DIC from pH and CO2?
    
}